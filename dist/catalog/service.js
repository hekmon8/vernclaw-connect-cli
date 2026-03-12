import { BUILTIN_BOOTSTRAP_CATALOG } from './bootstrap.js';
import { buildEffectiveCatalog } from './compat.js';
import { readCachedCatalog, shouldRefreshCatalog, writeCachedCatalog } from './cache.js';
import { fetchRegistryCatalogResponse, fetchRuntimeStates, normalizeRegistryCatalogResponse, toRegistryCatalogResponse, } from './http.js';
const SUPPORTED_REGISTRY_SCHEMAS = ['1.3'];
const SUPPORTED_CLI_FEATURES = ['registry_v1', 'invoke_v1'];
function getCacheFile(config) {
    return config.registryCatalogFile || config.registryCacheFile;
}
function getCliVersion(config) {
    return config.cliVersion || '0.1.0';
}
export async function resolveRegistryCatalog({ config, options = {}, dependencies, }) {
    const cacheFile = getCacheFile(config);
    const fetchCatalog = dependencies?.fetchCatalog ||
        (async (cliConfig) => fetchRegistryCatalogResponse(cliConfig));
    const readCache = dependencies?.readCache ||
        ((filePath) => readCachedCatalog(filePath)?.catalog || null);
    const writeCache = dependencies?.writeCache || writeCachedCatalog;
    const bootstrapCatalog = dependencies?.bootstrapCatalog || toRegistryCatalogResponse(BUILTIN_BOOTSTRAP_CATALOG);
    const cachedCatalog = (cacheFile ? readCache(cacheFile) : null);
    if (options.offline) {
        if (cachedCatalog) {
            return {
                catalog: cachedCatalog,
                source: 'cache',
            };
        }
        return {
            catalog: bootstrapCatalog,
            source: 'bootstrap',
        };
    }
    if (!options.refresh) {
        const cachedEnvelope = cacheFile ? readCachedCatalog(cacheFile) : null;
        if (cachedEnvelope && !shouldRefreshCatalog(cachedEnvelope)) {
            return {
                catalog: cachedEnvelope.catalog,
                source: 'cache',
            };
        }
        if (cachedCatalog && !cachedEnvelope) {
            return {
                catalog: cachedCatalog,
                source: 'cache',
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
            source: 'remote',
        };
    }
    catch (error) {
        if (cachedCatalog) {
            return {
                catalog: cachedCatalog,
                source: 'cache',
                error,
            };
        }
        return {
            catalog: bootstrapCatalog,
            source: 'bootstrap',
            error,
        };
    }
}
export async function resolveEffectiveCatalog({ config, refresh = false, offline = false, }) {
    const resolved = await resolveRegistryCatalog({
        config,
        options: {
            refresh,
            offline,
        },
    });
    let runtimeStates = [];
    if (!offline && config.apiKey && resolved.catalog.connectors.length > 0) {
        runtimeStates = await fetchRuntimeStates(config, resolved.catalog.connectors.map((entry) => entry.manifest.id)).catch(() => []);
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
export async function getEffectiveConnectorById(configOrInput, maybeConnectorId) {
    if (maybeConnectorId) {
        const entries = await resolveEffectiveCatalog({
            config: configOrInput,
        });
        return entries.find((entry) => entry.id === maybeConnectorId);
    }
    const input = configOrInput;
    const entries = await resolveEffectiveCatalog({
        config: input.config,
        refresh: input.refresh,
        offline: input.offline,
    });
    return entries.find((entry) => entry.id === input.connectorId);
}
export function filterCatalogForList(entries, showAll = false, installedOnly = false) {
    return entries.filter((entry) => {
        if (!showAll) {
            const visibleByDefault = entry.compatibilityState === 'supported' ||
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
