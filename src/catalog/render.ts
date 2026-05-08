import { normalizeInputSchema } from './input-schema.js';
import type { EffectiveConnectorView } from './types.js';

export type ViewerState = 'authenticated' | 'unauthenticated';
type AvailabilityStatus =
  | 'ready'
  | 'login required'
  | 'setup required'
  | 'upgrade required'
  | 'credits required'
  | 'unavailable';

function pad(value: string, width: number) {
  return value.length >= width ? value : value.padEnd(width, ' ');
}

function truncate(value: string, width: number) {
  if (value.length <= width) return value;
  return width > 3 ? value.slice(0, width - 3) + '...' : value.slice(0, width);
}

function toCliFlagName(key: string) {
  return `--${key}`;
}

function buildExampleValue(key: string, schema: Record<string, unknown>) {
  const normalizedKey = key.toLowerCase();
  const enumValues = Array.isArray(schema.enum) ? schema.enum : null;
  if (enumValues && enumValues.length > 0) {
    return String(enumValues[0]);
  }

  const type = typeof schema.type === 'string' ? schema.type : 'string';
  if (normalizedKey.includes('url')) return 'https://example.com';
  if (normalizedKey.includes('domain')) return 'example.com';
  if (normalizedKey.includes('market')) return 'us';
  if (normalizedKey.includes('limit')) return '10';
  if (normalizedKey.includes('prompt')) return 'example prompt';
  if (normalizedKey.includes('query')) return 'best ai tools';

  if (type === 'boolean') return 'true';
  if (type === 'integer' || type === 'number') return '1';
  if (type === 'array') return 'item1,item2';

  return 'example';
}

export function buildExampleInvokeCommand(entry: EffectiveConnectorView) {
  const { properties, required } = normalizeInputSchema(
    entry.manifest.inputSchema
  );
  const args = required
    .map((key) => {
      const schema = properties[key] || {};
      const rawValue = buildExampleValue(key, schema);
      const value = /\s/.test(rawValue) ? `"${rawValue}"` : rawValue;
      return `${toCliFlagName(key)} ${value}`;
    })
    .join(' ');

  return `vernclaw-cli invoke ${entry.id}${args ? ` ${args}` : ''}`;
}

export function resolveAvailability(
  entry: EffectiveConnectorView,
  viewerState: ViewerState = 'authenticated'
): AvailabilityStatus {
  if (entry.installStatus === 'disabled' || entry.runtimeStatus === 'blocked') {
    return 'unavailable';
  }

  if (entry.installStatus === 'upgrade_required') {
    return 'upgrade required';
  }

  if (
    viewerState === 'unauthenticated' &&
    entry.compatibilityState === 'supported' &&
    entry.runtimeStatus === 'unknown'
  ) {
    return 'login required';
  }

  if (entry.runtimeStatus === 'active' || entry.installStatus === 'installed') {
    return 'ready';
  }

  if (entry.runtimeStatus === 'quota_exceeded') {
    return 'credits required';
  }

  if (
    entry.runtimeStatus === 'auth_required' ||
    entry.runtimeStatus === 'training_required' ||
    entry.runtimeStatus === 'not_installed' ||
    entry.installStatus === 'installable' ||
    entry.installStatus === 'available'
  ) {
    return 'setup required';
  }

  return 'unavailable';
}

export function resolveCanRunNow(
  entry: EffectiveConnectorView,
  viewerState: ViewerState = 'authenticated'
) {
  return resolveAvailability(entry, viewerState) === 'ready' ? 'Yes' : 'No';
}

export function resolveNextStep(
  entry: EffectiveConnectorView,
  viewerState: ViewerState = 'authenticated'
) {
  const availability = resolveAvailability(entry, viewerState);

  if (availability === 'ready') {
    return `Run \`${buildExampleInvokeCommand(entry)}\`.`;
  }

  if (availability === 'login required') {
    return 'Run `vernclaw-cli login` and retry.';
  }

  if (availability === 'setup required') {
    return 'Complete connector setup in Settings → Connectors, then retry.';
  }

  if (availability === 'upgrade required') {
    return 'Upgrade `vernclaw-connect-cli` to a compatible version, then retry.';
  }

  if (availability === 'credits required') {
    return 'Add credits or upgrade your plan, then retry.';
  }

  return 'This connector is currently unavailable for this account.';
}

export function renderCatalogTable(
  entries: EffectiveConnectorView[],
  debug = false,
  options: { viewerState?: ViewerState } = {}
) {
  if (debug) {
    return renderCatalogTableDebug(entries);
  }

  const viewerState = options.viewerState || 'authenticated';

  const columns: Array<[string, number]> = [
    ['CONNECTOR', 28],
    ['CATEGORY', 18],
    ['DESCRIPTION', 36],
    ['STATUS', 18],
  ];

  const header = columns.map(([label, width]) => pad(label, width)).join(' ');
  const body = entries
    .map((entry) =>
      [
        pad(entry.id, 28),
        pad(entry.category, 18),
        pad(truncate(entry.description || '', 36), 36),
        pad(resolveAvailability(entry, viewerState), 18),
      ].join(' ')
    )
    .join('\n');

  return body ? `${header}\n${body}\n` : `${header}\n`;
}

function renderCatalogTableDebug(entries: EffectiveConnectorView[]) {
  const columns = [
    ['CONNECTOR', 28],
    ['CATEGORY', 14],
    ['VISIBILITY', 12],
    ['INSTALL', 12],
    ['RUNTIME', 18],
    ['AUTH', 14],
    ['TRAINING', 14],
    ['MIN_CLI', 10],
    ['VERSION', 8],
  ] as const;

  const header = columns.map(([label, width]) => pad(label, width)).join(' ');
  const body = entries
    .map((entry) =>
      [
        pad(entry.id, 28),
        pad(entry.category, 14),
        pad(entry.visibility, 12),
        pad(entry.installStatus, 12),
        pad(entry.runtimeStatus, 18),
        pad(entry.authStatus, 14),
        pad(entry.trainingStatus, 14),
        pad(entry.minCliVersion, 10),
        pad(entry.version, 8),
      ].join(' ')
    )
    .join('\n');

  return body ? `${header}\n${body}\n` : `${header}\n`;
}

export function renderCatalogDescribe(
  entry: EffectiveConnectorView,
  options: { viewerState?: ViewerState } = {}
) {
  const viewerState = options.viewerState || 'authenticated';
  const { properties, required } = normalizeInputSchema(
    entry.manifest.inputSchema
  );
  const inputFields = Object.entries(properties);
  const cliFlags = inputFields.map(([key, value]) => {
    const schema = value as Record<string, unknown>;
    const description =
      typeof schema.description === 'string'
        ? schema.description
        : 'No description';
    const type = typeof schema.type === 'string' ? schema.type : 'string';
    const flagLabel = required.includes(key)
      ? `${toCliFlagName(key)} (required)`
      : `${toCliFlagName(key)} (optional)`;

    return `- ${flagLabel}: ${description} [type=${type}]`;
  });
  const exampleCommand = buildExampleInvokeCommand(entry);
  const availability = resolveAvailability(entry, viewerState);
  const canRunNow = resolveCanRunNow(entry, viewerState);
  const nextStep = resolveNextStep(entry, viewerState);

  return [
    `# ${entry.name}`,
    '',
    `- Connector ID: ${entry.id}`,
    `- Category: ${entry.category}`,
    `- Version: ${entry.version}`,
    `- Min CLI: ${entry.minCliVersion}`,
    `- Compatibility: ${entry.compatibilityState}`,
    `- Status: ${availability}`,
    `- Can Run Now: ${canRunNow}`,
    `- Next Step: ${nextStep}`,
    ...(entry.compatibilityReasons?.length
      ? [
          '',
          '## Compatibility Notes',
          '',
          ...entry.compatibilityReasons.map(
            (item) => `- ${item.code}: ${item.message}`
          ),
        ]
      : []),
    '',
    '## Summary',
    '',
    entry.description,
    '',
    '## CLI Usage',
    '',
    `- Inspect again: \`vernclaw-cli describe ${entry.id}\``,
    `- Run: \`${exampleCommand}\``,
    '',
    '## CLI Flags',
    '',
    ...(cliFlags.length ? cliFlags : ['- No connector-specific flags.']),
    '',
    '## Output Contract',
    '',
    `- Mode: ${entry.manifest.outputContract.mode}`,
    `- Result Format: ${entry.manifest.outputContract.resultFormat}`,
    `- Structured Payload: ${entry.manifest.outputContract.structuredPayload}`,
    '',
    '## Input Schema',
    '',
    ...(inputFields.length
      ? inputFields.map(([key, value]) => `- ${key}: ${JSON.stringify(value)}`)
      : ['- {}']),
    '',
  ].join('\n');
}
