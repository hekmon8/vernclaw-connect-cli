import type { CliConfig } from '../config/env.js';
import { requestJson } from '../client/http.js';

import { BUILTIN_BOOTSTRAP_CATALOG } from './bootstrap.js';
import type {
  ConnectorRegistryCatalog,
  ConnectorRuntimeState,
  RegistryCatalogResponse,
} from './types.js';

function getBootstrapInputSchema(connectorId: string) {
  return BUILTIN_BOOTSTRAP_CATALOG.connectors.find(
    (entry) => entry.manifest.id === connectorId
  )?.manifest.inputSchema;
}

function resolveInputSchema(
  connectorId: string,
  inputSchema: Record<string, unknown>
) {
  const bootstrapSchema = getBootstrapInputSchema(connectorId) as
    | {
        properties?: Record<string, Record<string, unknown>>;
        required?: string[];
      }
    | undefined;
  const schema = inputSchema as {
    properties?: Record<string, Record<string, unknown>>;
    required?: string[];
  };

  if (schema.properties && Object.keys(schema.properties).length > 0) {
    return inputSchema;
  }

  const legacyEntries = Object.entries(inputSchema || {});
  if (legacyEntries.length === 0) {
    return bootstrapSchema || inputSchema;
  }

  if (!bootstrapSchema?.properties) {
    return inputSchema;
  }

  const properties = Object.fromEntries(
    legacyEntries.map(([key, value]) => {
      const bootstrapProperty = bootstrapSchema.properties?.[key] || {};
      const rawType = typeof value === 'string' ? value : String(bootstrapProperty.type || 'string');
      const normalizedType = rawType.endsWith('?') ? rawType.slice(0, -1) : rawType;

      return [
        key,
        {
          ...bootstrapProperty,
          type: normalizedType || 'string',
        },
      ];
    })
  );

  const required = legacyEntries
    .filter(([, value]) => !(typeof value === 'string' && value.endsWith('?')))
    .map(([key]) => key);

  return {
    ...bootstrapSchema,
    properties,
    required,
  };
}

export function normalizeRegistryCatalogResponse(
  catalog: RegistryCatalogResponse | ConnectorRegistryCatalog
): ConnectorRegistryCatalog {
  if ('registrySchema' in catalog) {
    return catalog;
  }

  return {
    registrySchema: catalog.registry_schema,
    registryVersion: catalog.registry_version,
    connectors: catalog.connectors.map((entry) => ({
      manifest: {
        id: entry.manifest.id,
        name: entry.manifest.name,
        category: entry.manifest.category || 'general',
        description: entry.manifest.description || entry.manifest.name,
        version: entry.manifest.version,
        connectorType: entry.manifest.connector_type,
        minCliVersion: entry.manifest.min_cli_version,
        requiredCliFeatures: entry.manifest.required_cli_features,
        inputSchema: resolveInputSchema(entry.manifest.id, entry.manifest.input_schema),
        outputContract: {
          mode: entry.manifest.output_contract.mode,
          resultFormat: entry.manifest.output_contract.result_format,
          structuredPayload: entry.manifest.output_contract.structured_payload,
        },
      },
      overlay: {
        connectorId: entry.overlay.connector_id || entry.manifest.id,
        visible: entry.overlay.visible,
        featured: entry.overlay.featured,
        emergencyDisable: entry.overlay.emergency_disable,
      },
    })),
  };
}

export function toRegistryCatalogResponse(
  catalog: ConnectorRegistryCatalog
): RegistryCatalogResponse {
  return {
    registry_schema: catalog.registrySchema,
    registry_version: catalog.registryVersion,
    connectors: catalog.connectors.map((entry) => ({
      manifest: {
        id: entry.manifest.id,
        name: entry.manifest.name,
        category: entry.manifest.category,
        description: entry.manifest.description,
        version: entry.manifest.version,
        connector_type: entry.manifest.connectorType,
        min_cli_version: entry.manifest.minCliVersion,
        required_cli_features: entry.manifest.requiredCliFeatures,
        input_schema: entry.manifest.inputSchema,
        output_contract: {
          mode: entry.manifest.outputContract.mode,
          result_format: entry.manifest.outputContract.resultFormat,
          structured_payload: entry.manifest.outputContract.structuredPayload,
        },
      },
      overlay: {
        connector_id: entry.overlay.connectorId,
        visible: entry.overlay.visible,
        featured: entry.overlay.featured,
        emergency_disable: entry.overlay.emergencyDisable,
      },
    })),
  };
}

export async function fetchRegistryCatalogResponse(config: CliConfig) {
  const response = await requestJson<RegistryCatalogResponse>({
    config,
    pathname: '/api/registry/catalog',
  });

  return response.data;
}

export async function fetchRegistryCatalog(config: CliConfig) {
  const response = await requestJson<RegistryCatalogResponse>({
    config,
    pathname: '/api/registry/catalog',
  });

  return {
    ...response,
    data: normalizeRegistryCatalogResponse(response.data),
  };
}

export async function fetchRuntimeStates(
  config: CliConfig,
  connectorIds: string[]
): Promise<ConnectorRuntimeState[]> {
  if (!config.apiKey || connectorIds.length === 0) {
    return [];
  }

  const response = await requestJson<{
    states: Array<{
      connector_id: string;
      installed: boolean;
      auth_required: boolean;
      training_required: boolean;
      approval_required: boolean;
      blocked_by_admin: boolean;
      quota_exceeded: boolean;
      active?: boolean;
    }>;
  }>({
    config,
    pathname: `/api/connectors/runtime-state?ids=${encodeURIComponent(
      connectorIds.join(',')
    )}`,
  });

  return response.data.states.map((state) => ({
    connectorId: state.connector_id,
    installed: state.installed,
    authRequired: state.auth_required,
    trainingRequired: state.training_required,
    approvalRequired: state.approval_required,
    blockedByAdmin: state.blocked_by_admin,
    quotaExceeded: state.quota_exceeded,
    active:
      typeof state.active === 'boolean'
        ? state.active
        : state.installed &&
          !state.auth_required &&
          !state.training_required &&
          !state.blocked_by_admin &&
          !state.quota_exceeded,
  }));
}
