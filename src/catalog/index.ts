import type { EffectiveConnectorView } from './types.js';
import { renderCatalogDescribe, renderCatalogTable } from './render.js';
export { buildEffectiveCatalog } from './compat.js';

export {
  filterCatalogForList,
  getEffectiveConnectorById,
  resolveEffectiveCatalog,
  resolveRegistryCatalog,
} from './service.js';

export function getCatalogEntry(
  entries: EffectiveConnectorView[],
  connectorId: string
) {
  return entries.find((entry) => entry.id === connectorId);
}

export function renderCatalogList(entries: EffectiveConnectorView[]) {
  return renderCatalogTable(entries);
}

export function renderCatalogEntry(entry: EffectiveConnectorView) {
  return renderCatalogDescribe(entry);
}
