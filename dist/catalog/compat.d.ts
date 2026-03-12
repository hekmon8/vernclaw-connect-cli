import type { CatalogBuildOptions, CompatibilityReason, EffectiveConnectorView, RegistryCatalogEntry } from './types.js';
export declare function evaluateConnectorCompatibility({ registrySchema, supportedRegistrySchemas, cliVersion, cliFeatures, entry, }: {
    registrySchema: string;
    supportedRegistrySchemas: string[];
    cliVersion: string;
    cliFeatures: string[];
    entry: RegistryCatalogEntry;
}): {
    visibility: string;
    compatibilityState: "supported" | "visible_upgrade_required" | "unsupported" | "hidden" | "disabled";
    installStatus: "installable" | "upgrade_required" | "unavailable";
    compatibilityReasons: CompatibilityReason[] | {
        code: "CONNECTOR_DISABLED";
        message: string;
    }[] | {
        code: "CONNECTOR_HIDDEN";
        message: string;
    }[] | {
        code: "REGISTRY_SCHEMA_UNSUPPORTED";
        message: string;
    }[] | {
        code: "REQUIRED_CLI_FEATURE_MISSING";
        message: string;
    }[] | {
        code: "CLI_UPGRADE_REQUIRED";
        message: string;
    }[];
};
export declare function buildEffectiveCatalog({ cliVersion, supportedRegistrySchemas, supportedFeatures, catalog, runtimeStates, source, }: CatalogBuildOptions): EffectiveConnectorView[];
