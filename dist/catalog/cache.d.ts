import type { ConnectorRegistryCatalog, RegistryCatalogResponse } from './types.js';
type CachedCatalog = ConnectorRegistryCatalog | RegistryCatalogResponse;
interface CachedCatalogFile {
    fetchedAt: string;
    catalog: CachedCatalog;
}
export declare function readCachedCatalog(cacheFile: string): CachedCatalogFile | null;
export declare function shouldRefreshCatalog(cache: CachedCatalogFile | null): boolean;
export declare function writeCachedCatalog(cacheFile: string, catalog: CachedCatalog): void;
export {};
