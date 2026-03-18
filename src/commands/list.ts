import type { CliConfig } from '../config/env.js';
import type { EffectiveConnectorView } from '../catalog/types.js';
import { filterCatalogForList, renderCatalogList, resolveEffectiveCatalog } from '../catalog/index.js';

function buildContextualHints(
  entries: EffectiveConnectorView[],
  isLoggedIn: boolean
): string {
  const hints: string[] = [];

  if (!isLoggedIn) {
    hints.push('Run `vernclaw-cli login` to authenticate before invoking connectors.');
    hints.push('Run `vernclaw-cli describe <connector>` to inspect required flags and example commands.');
  } else {
    const hasUpgradeRequired = entries.some(
      (e) => e.installStatus === 'upgrade_required'
    );
    if (hasUpgradeRequired) {
      hints.push('Some connectors require a CLI upgrade. Run `npm i -g vernclaw-connect-cli` to update.');
    }
    hints.push('Run `vernclaw-cli describe <connector>` to inspect flags and example commands, or `vernclaw-cli invoke <connector>` to use.');
  }

  return hints.length > 0 ? '\n' + hints.join('\n') + '\n' : '';
}

export async function runListCommand(
  config: CliConfig,
  flags: Record<string, string | boolean> = {}
) {
  const debug = flags.debug === true;
  const entries = filterCatalogForList(
    await resolveEffectiveCatalog({
      config,
      refresh: flags.refresh === true,
      offline: flags.offline === true,
    }),
    flags.all === true,
    flags.installed === true
  );

  const table = renderCatalogList(entries, debug, {
    viewerState: config.apiKey ? 'authenticated' : 'unauthenticated',
  });
  const hints = debug ? '' : buildContextualHints(entries, !!config.apiKey);

  return {
    markdown: table + hints,
    status: 200,
  };
}
