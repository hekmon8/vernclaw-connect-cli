import type { CliConfig } from '../config/env.js';
import type { ConnectorRegistryCatalog, ConnectorRuntimeState, RegistryCatalogResponse } from './types.js';
export declare function normalizeRegistryCatalogResponse(catalog: RegistryCatalogResponse | ConnectorRegistryCatalog): ConnectorRegistryCatalog;
export declare function toRegistryCatalogResponse(catalog: ConnectorRegistryCatalog): RegistryCatalogResponse;
export declare function fetchRegistryCatalogResponse(config: CliConfig): Promise<RegistryCatalogResponse>;
export declare function fetchRegistryCatalog(config: CliConfig): Promise<{
    data: ConnectorRegistryCatalog;
    status: number;
}>;
export declare function fetchRuntimeStates(config: CliConfig, connectorIds: string[]): Promise<ConnectorRuntimeState[]>;
