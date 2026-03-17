import type { EffectiveConnectorView } from './types.js';

function pad(value: string, width: number) {
  return value.length >= width ? value : value.padEnd(width, ' ');
}

function truncate(value: string, width: number) {
  if (value.length <= width) return value;
  return width > 3 ? value.slice(0, width - 3) + '...' : value.slice(0, width);
}

function friendlyStatus(entry: EffectiveConnectorView): string {
  if (entry.installStatus === 'disabled') return 'disabled';
  if (entry.installStatus === 'upgrade_required') return 'upgrade cli';
  if (entry.runtimeStatus === 'active') return 'ready';
  if (entry.runtimeStatus === 'blocked') return 'blocked';
  if (entry.runtimeStatus === 'quota_exceeded') return 'quota exceeded';
  if (entry.runtimeStatus === 'auth_required') return 'auth required';
  if (entry.runtimeStatus === 'training_required') return 'training required';
  if (entry.runtimeStatus === 'not_installed') return 'not installed';
  if (entry.installStatus === 'installed') return 'ready';
  if (entry.installStatus === 'available') return 'available';
  if (entry.installStatus === 'installable') return 'available';
  return entry.runtimeStatus;
}

export function renderCatalogTable(entries: EffectiveConnectorView[], debug = false) {
  if (debug) {
    return renderCatalogTableDebug(entries);
  }

  const columns: Array<[string, number]> = [
    ['CONNECTOR', 28],
    ['CATEGORY', 18],
    ['DESCRIPTION', 36],
    ['STATUS', 18],
  ];

  const header = columns
    .map(([label, width]) => pad(label, width))
    .join(' ');
  const body = entries
    .map((entry) =>
      [
        pad(entry.id, 28),
        pad(entry.category, 18),
        pad(truncate(entry.description || '', 36), 36),
        pad(friendlyStatus(entry), 18),
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

  const header = columns
    .map(([label, width]) => pad(label, width))
    .join(' ');
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

export function renderCatalogDescribe(entry: EffectiveConnectorView) {
  const inputFields = Object.entries(entry.manifest.inputSchema || {});

  return [
    `# ${entry.name}`,
    '',
    `- Connector ID: ${entry.id}`,
    `- Category: ${entry.category}`,
    `- Version: ${entry.version}`,
    `- Min CLI: ${entry.minCliVersion}`,
    `- Compatibility: ${entry.compatibilityState}`,
    `- Install: ${entry.installStatus}`,
    `- Runtime: ${entry.runtimeStatus}`,
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
