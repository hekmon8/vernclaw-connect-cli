import {
  filterCatalogForList,
  resolveEffectiveCatalog,
} from '../catalog/index.js';
import { resolveAvailability } from '../catalog/render.js';
import type { EffectiveConnectorView } from '../catalog/types.js';
import type { CliConfig } from '../config/env.js';

function buildContextualHints(
  entries: EffectiveConnectorView[],
  isLoggedIn: boolean
): string[] {
  const hints: string[] = [];

  if (!isLoggedIn) {
    hints.push(
      'Run `vernclaw-cli login` to authenticate before invoking connectors.'
    );
    hints.push(
      'Run `vernclaw-cli describe <connector>` to inspect required flags and example commands.'
    );
  } else {
    const hasUpgradeRequired = entries.some(
      (e) => e.installStatus === 'upgrade_required'
    );
    if (hasUpgradeRequired) {
      hints.push(
        'Some connectors require a CLI upgrade. Run `npm i -g vernclaw-connect-cli` to update.'
      );
    }
    hints.push(
      'Run `vernclaw-cli describe <connector>` to inspect flags and example commands, or `vernclaw-cli invoke <connector>` to use.'
    );
  }

  return hints;
}

function buildListItem(
  entry: EffectiveConnectorView,
  viewerState: 'authenticated' | 'unauthenticated',
  debug: boolean
) {
  const base = {
    id: entry.id,
    name: entry.name,
    category: entry.category,
    description: entry.description,
    status: resolveAvailability(entry, viewerState),
  };

  if (!debug) {
    return base;
  }

  return {
    ...base,
    visibility: entry.visibility,
    install_status: entry.installStatus,
    runtime_status: entry.runtimeStatus,
    auth_status: entry.authStatus,
    training_status: entry.trainingStatus,
    min_cli_version: entry.minCliVersion,
    version: entry.version,
    source: entry.source,
  };
}

export async function runListCommand(
  config: CliConfig,
  flags: Record<string, string | boolean> = {}
) {
  const debug = flags.debug === true;
  const viewerState = config.apiKey ? 'authenticated' : 'unauthenticated';
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
    data: {
      command: 'list',
      count: entries.length,
      connectors: entries.map((entry) =>
        buildListItem(entry, viewerState, debug)
      ),
      hints: debug ? [] : buildContextualHints(entries, !!config.apiKey),
    },
    status: 200,
  };
}
