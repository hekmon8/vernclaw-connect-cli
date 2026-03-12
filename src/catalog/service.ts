import type { CliConfig } from '../config/env.js';

import { BUILTIN_BOOTSTRAP_CATALOG } from './bootstrap.js';
import { buildEffectiveCatalog } from './compat.js';
import { readCachedCatalog, shouldRefreshCatalog, writeCachedCatalog } from './cache.js';
import {
  fetchRegistryCatalogResponse,
  fetchRuntimeStates,
  normalizeRegistryCatalogResponse,
  toRegistryCatalogResponse,
} from './http.js';
import type {
  ConnectorRuntimeState,
  EffectiveConnectorView,
  RegistryCatalogResponse,
} from './types.js';

const SUPPORTED_REGISTRY_SCHEMAS = ['1.3'];
const SUPPORTED_CLI_FEATURES = ['registry_v1', 'invoke_v1'];

function getCacheFile(config: CliConfig & { registryCatalogFile?: string }) {
  return config.registryCatalogFile || config.registryCacheFile;
}

function getCliVersion(config: CliConfig & { cliVersion?: string }) {
  return config.cliVersion || '0.1.0';
}

export async function resolveRegistryCatalog({
  config,
  options = {},
  dependencies,
}: {
  config: CliConfig & { registryCatalogFile?: string };
  options?: {
    refresh?: boolean;
    offline?: boolean;
  };
  dependencies?: {
    fetchCatalog?: (config: CliConfig) => Promise<RegistryCatalogResponse>;
    readCache?: (filePath: string) => RegistryCatalogResponse | null;
    writeCache?: (filePath: string, catalog: RegistryCatalogResponse) => void;
    bootstrapCatalog?: RegistryCatalogResponse;
  };
}) {
  const cacheFile = getCacheFile(config);
  const fetchCatalog =
    dependencies?.fetchCatalog ||
    (async (cliConfig: CliConfig) => fetchRegistryCatalogResponse(cliConfig));
  const readCache =
    dependencies?.readCache ||
    ((filePath: string) => readCachedCatalog(filePath)?.catalog || null);
  const writeCache = dependencies?.writeCache || writeCachedCatalog;
  const bootstrapCatalog =
    dependencies?.bootstrapCatalog || toRegistryCatalogResponse(BUILTIN_BOOTSTRAP_CATALOG);
  const cachedCatalog = (cacheFile ? readCache(cacheFile) : null) as RegistryCatalogResponse | null;

  if (options.offline) {
    if (cachedCatalog) {
      return {
        catalog: cachedCatalog,
        source: 'cache' as const,
      };
    }

    return {
      catalog: bootstrapCatalog,
      source: 'bootstrap' as const,
    };
  }

  if (!options.refresh) {
    const cachedEnvelope = cacheFile ? readCachedCatalog(cacheFile) : null;
    if (cachedEnvelope && !shouldRefreshCatalog(cachedEnvelope)) {
      return {
        catalog: cachedEnvelope.catalog as RegistryCatalogResponse,
        source: 'cache' as const,
      };
    }

    if (cachedCatalog && !cachedEnvelope) {
      return {
        catalog: cachedCatalog,
        source: 'cache' as const,
      };
    }
  }

  try {
    const remoteCatalog = await fetchCatalog(config);
    if (cacheFile) {
      writeCache(cacheFile, remoteCatalog);
    }

    return {
      catalog: remoteCatalog,
      source: 'remote' as const,
    };
  } catch (error) {
    if (cachedCatalog) {
      return {
        catalog: cachedCatalog,
        source: 'cache' as const,
        error,
      };
    }

    return {
      catalog: bootstrapCatalog,
      source: 'bootstrap' as const,
      error,
    };
  }
}

export async function resolveEffectiveCatalog({
  config,
  refresh = false,
  offline = false,
}: {
  config: CliConfig & { registryCatalogFile?: string };
  refresh?: boolean;
  offline?: boolean;
}) {
  const resolved = await resolveRegistryCatalog({
    config,
    options: {
      refresh,
      offline,
    },
  });

  let runtimeStates: ConnectorRuntimeState[] = [];
  if (!offline && config.apiKey && resolved.catalog.connectors.length > 0) {
    runtimeStates = await fetchRuntimeStates(
      config,
      resolved.catalog.connectors.map((entry) => entry.manifest.id)
    ).catch(() => []);
  }

  return buildEffectiveCatalog({
    cliVersion: getCliVersion(config),
    supportedRegistrySchemas: SUPPORTED_REGISTRY_SCHEMAS,
    supportedFeatures: SUPPORTED_CLI_FEATURES,
    catalog: normalizeRegistryCatalogResponse(resolved.catalog),
    runtimeStates,
    source: resolved.source,
  });
}

export async function getEffectiveConnectorById(
  configOrInput:
    | (CliConfig & { registryCatalogFile?: string })
    | {
        config: CliConfig & { registryCatalogFile?: string };
        connectorId: string;
        refresh?: boolean;
        offline?: boolean;
      },
  maybeConnectorId?: string
) {
  if (maybeConnectorId) {
    const entries = await resolveEffectiveCatalog({
      config: configOrInput as CliConfig & { registryCatalogFile?: string },
    });
    return entries.find((entry) => entry.id === maybeConnectorId);
  }

  const input = configOrInput as {
    config: CliConfig & { registryCatalogFile?: string };
    connectorId: string;
    refresh?: boolean;
    offline?: boolean;
  };
  const entries = await resolveEffectiveCatalog({
    config: input.config,
    refresh: input.refresh,
    offline: input.offline,
  });
  return entries.find((entry) => entry.id === input.connectorId);
}

export function filterCatalogForList(
  entries: EffectiveConnectorView[],
  showAll = false,
  installedOnly = false
) {
  return entries.filter((entry) => {
    if (!showAll) {
      const visibleByDefault =
        entry.compatibilityState === 'supported' ||
        entry.compatibilityState === 'visible_upgrade_required';
      if (!visibleByDefault) {
        return false;
      }
    }

    if (installedOnly && entry.installStatus !== 'installed') {
      return false;
    }

    return true;
  });
}
