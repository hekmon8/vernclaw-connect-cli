export interface RegistryCatalogManifest {
    id: string;
    name: string;
    category?: string;
    description?: string;
    version: string;
    connector_type: string;
    min_cli_version: string;
    required_cli_features: string[];
    input_schema: Record<string, unknown>;
    output_contract: {
        mode: 'sync_result' | 'async_job';
        result_format: 'markdown';
        structured_payload: 'none' | 'optional';
    };
}
export interface RegistryCatalogEntry {
    manifest: RegistryCatalogManifest;
    overlay: {
        connector_id?: string;
        visible: boolean;
        featured: boolean;
        emergency_disable: boolean;
    };
}
export interface RegistryCatalogResponse {
    registry_schema: string;
    registry_version: string;
    connectors: RegistryCatalogEntry[];
}
export interface ConnectorOutputContract {
    mode: 'sync_result' | 'async_job';
    resultFormat: 'markdown';
    structuredPayload: 'none' | 'optional';
}
export interface ConnectorRegistryManifest {
    id: string;
    name: string;
    category: string;
    description: string;
    version: string;
    connectorType: string;
    minCliVersion: string;
    requiredCliFeatures: string[];
    inputSchema: Record<string, unknown>;
    outputContract: ConnectorOutputContract;
}
export interface ConnectorRegistryOverlay {
    connectorId: string;
    visible: boolean;
    featured: boolean;
    emergencyDisable: boolean;
}
export interface ConnectorRegistryCatalog {
    registrySchema: string;
    registryVersion: string;
    connectors: Array<{
        manifest: ConnectorRegistryManifest;
        overlay: ConnectorRegistryOverlay;
    }>;
}
export interface ConnectorRuntimeState {
    connectorId: string;
    installed: boolean;
    authRequired: boolean;
    trainingRequired: boolean;
    approvalRequired: boolean;
    blockedByAdmin: boolean;
    quotaExceeded: boolean;
    active: boolean;
}
export type ConnectorCompatibilityState = 'supported' | 'visible_upgrade_required' | 'unsupported' | 'hidden' | 'disabled';
export interface EffectiveConnectorView {
    id: string;
    name: string;
    category: string;
    description: string;
    version: string;
    minCliVersion: string;
    visibility: 'visible' | 'hidden' | 'disabled';
    compatibilityState: ConnectorCompatibilityState;
    installStatus: 'installable' | 'installed' | 'upgrade_required' | 'hidden' | 'disabled';
    runtimeStatus: 'active' | 'auth_required' | 'training_required' | 'quota_exceeded' | 'not_installed' | 'blocked' | 'unavailable' | 'unknown';
    authStatus: 'required' | 'authorized' | 'not_required' | 'unknown';
    trainingStatus: 'required' | 'acknowledged' | 'not_required' | 'unknown';
    compatibilityReasons?: CompatibilityReason[];
    source: 'remote' | 'cache' | 'bootstrap';
    manifest: ConnectorRegistryManifest;
}
export interface CompatibilityReason {
    code: 'REGISTRY_SCHEMA_UNSUPPORTED' | 'CLI_UPGRADE_REQUIRED' | 'REQUIRED_CLI_FEATURE_MISSING' | 'CONNECTOR_HIDDEN' | 'CONNECTOR_DISABLED';
    message: string;
}
export interface CatalogBuildOptions {
    cliVersion: string;
    supportedRegistrySchemas: string[];
    supportedFeatures: string[];
    catalog: ConnectorRegistryCatalog;
    runtimeStates?: ConnectorRuntimeState[];
    source?: EffectiveConnectorView['source'];
}
