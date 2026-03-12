import type { CliConfig } from '../config/env.js';
import { filterCatalogForList, renderCatalogList, resolveEffectiveCatalog } from '../catalog/index.js';

export async function runListCommand(
  config: CliConfig,
  flags: Record<string, string | boolean> = {}
) {
  const entries = filterCatalogForList(
    await resolveEffectiveCatalog({
      config,
      refresh: flags.refresh === true,
      offline: flags.offline === true,
    }),
    flags.all === true,
    flags.installed === true
  );

  return {
    markdown: renderCatalogList(entries),
    status: 200,
  };
}
