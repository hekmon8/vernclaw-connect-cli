import { renderCatalogDescribe, renderCatalogTable } from './render.js';
export { buildEffectiveCatalog } from './compat.js';
export { filterCatalogForList, getEffectiveConnectorById, resolveEffectiveCatalog, resolveRegistryCatalog, } from './service.js';
export function getCatalogEntry(entries, connectorId) {
    return entries.find((entry) => entry.id === connectorId);
}
export function renderCatalogList(entries) {
    return renderCatalogTable(entries);
}
export function renderCatalogEntry(entry) {
    return renderCatalogDescribe(entry);
}
