import type { EffectiveConnectorView } from './types.js';
import { renderCatalogDescribe, renderCatalogTable } from './render.js';
import type { ViewerState } from './render.js';
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

export function renderCatalogList(
  entries: EffectiveConnectorView[],
  debug = false,
  options: { viewerState?: ViewerState } = {}
) {
  return renderCatalogTable(entries, debug, options);
}

export function renderCatalogEntry(
  entry: EffectiveConnectorView,
  options: { viewerState?: ViewerState } = {}
) {
  return renderCatalogDescribe(entry, options);
}
