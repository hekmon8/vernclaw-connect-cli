import { requestJson } from '../client/http.js';
export function normalizeRegistryCatalogResponse(catalog) {
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
                inputSchema: entry.manifest.input_schema,
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
export function toRegistryCatalogResponse(catalog) {
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
export async function fetchRegistryCatalogResponse(config) {
    const response = await requestJson({
        config,
        pathname: '/api/registry/catalog',
    });
    return response.data;
}
export async function fetchRegistryCatalog(config) {
    const response = await requestJson({
        config,
        pathname: '/api/registry/catalog',
    });
    return {
        ...response,
        data: normalizeRegistryCatalogResponse(response.data),
    };
}
export async function fetchRuntimeStates(config, connectorIds) {
    if (!config.apiKey || connectorIds.length === 0) {
        return [];
    }
    const response = await requestJson({
        config,
        pathname: `/api/connectors/runtime-state?ids=${encodeURIComponent(connectorIds.join(','))}`,
    });
    return response.data.states.map((state) => ({
        connectorId: state.connector_id,
        installed: state.installed,
        authRequired: state.auth_required,
        trainingRequired: state.training_required,
        approvalRequired: state.approval_required,
        blockedByAdmin: state.blocked_by_admin,
        quotaExceeded: state.quota_exceeded,
        active: typeof state.active === 'boolean'
            ? state.active
            : state.installed &&
                !state.auth_required &&
                !state.training_required &&
                !state.blocked_by_admin &&
                !state.quota_exceeded,
    }));
}
