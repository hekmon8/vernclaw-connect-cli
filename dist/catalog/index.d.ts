import type { EffectiveConnectorView } from './types.js';
export { buildEffectiveCatalog } from './compat.js';
export { filterCatalogForList, getEffectiveConnectorById, resolveEffectiveCatalog, resolveRegistryCatalog, } from './service.js';
export declare function getCatalogEntry(entries: EffectiveConnectorView[], connectorId: string): EffectiveConnectorView | undefined;
export declare function renderCatalogList(entries: EffectiveConnectorView[], debug?: boolean): string;
export declare function renderCatalogEntry(entry: EffectiveConnectorView): string;
