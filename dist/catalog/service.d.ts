import type { CliConfig } from '../config/env.js';
import type { EffectiveConnectorView, RegistryCatalogResponse } from './types.js';
export declare function resolveRegistryCatalog({ config, options, dependencies, }: {
    config: CliConfig & {
        registryCatalogFile?: string;
    };
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
}): Promise<{
    catalog: RegistryCatalogResponse;
    source: "cache";
    error?: undefined;
} | {
    catalog: RegistryCatalogResponse;
    source: "bootstrap";
    error?: undefined;
} | {
    catalog: RegistryCatalogResponse;
    source: "remote";
    error?: undefined;
} | {
    catalog: RegistryCatalogResponse;
    source: "cache";
    error: unknown;
} | {
    catalog: RegistryCatalogResponse;
    source: "bootstrap";
    error: unknown;
}>;
export declare function resolveEffectiveCatalog({ config, refresh, offline, }: {
    config: CliConfig & {
        registryCatalogFile?: string;
    };
    refresh?: boolean;
    offline?: boolean;
}): Promise<EffectiveConnectorView[]>;
export declare function getEffectiveConnectorById(configOrInput: (CliConfig & {
    registryCatalogFile?: string;
}) | {
    config: CliConfig & {
        registryCatalogFile?: string;
    };
    connectorId: string;
    refresh?: boolean;
    offline?: boolean;
}, maybeConnectorId?: string): Promise<EffectiveConnectorView | undefined>;
export declare function filterCatalogForList(entries: EffectiveConnectorView[], showAll?: boolean, installedOnly?: boolean): EffectiveConnectorView[];
