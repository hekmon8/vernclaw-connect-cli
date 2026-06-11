import { resolveCliConfig } from './config/env.js';

export { resolveCliConfig };

type TerminalFormatOptions = {
  command?: string;
  subcommand?: string;
};

export type CliCommandResponse = {
  markdown?: string;
  data?: unknown;
  status: number;
  errorCode?: string;
};

export function ensureTrailingNewline(value: string) {
  return value.endsWith('\n') ? value : `${value}\n`;
}

function stripRawPayloads(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map((item) => stripRawPayloads(item));
  }

  if (!value || typeof value !== 'object') {
    return value;
  }

  return Object.entries(value as Record<string, unknown>).reduce<
    Record<string, unknown>
  >((result, [key, nextValue]) => {
    if (key === 'raw') {
      return result;
    }

    result[key] = stripRawPayloads(nextValue);
    return result;
  }, {});
}

export function formatJsonForTerminal(response: CliCommandResponse) {
  const payload: Record<string, unknown> = {
    status: response.status,
    data: response.data !== undefined ? stripRawPayloads(response.data) : {},
  };

  if (response.errorCode) {
    payload.errorCode = response.errorCode;
  }

  return ensureTrailingNewline(JSON.stringify(payload));
}

function formatScalar(value: unknown) {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return String(value);
  }

  return JSON.stringify(value);
}

function formatRecordBullets(record: Record<string, unknown>) {
  return Object.entries(record)
    .map(([key, value]) => {
      const formatted = formatScalar(value);
      return formatted ? `- ${key}: ${formatted}` : undefined;
    })
    .filter((line): line is string => Boolean(line));
}

function prettifyLabel(key: string) {
  return key
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (value) => value.toUpperCase());
}

function formatGenericObject(record: Record<string, unknown>) {
  return Object.entries(record)
    .map(([key, value]) => {
      const formatted = formatScalar(value);
      return formatted ? `- ${prettifyLabel(key)}: ${formatted}` : undefined;
    })
    .filter((line): line is string => Boolean(line));
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function truncateColumn(value: unknown, width: number) {
  const formatted = formatScalar(value) || '';
  if (formatted.length <= width) {
    return formatted;
  }

  if (width <= 3) {
    return formatted.slice(0, width);
  }

  return `${formatted.slice(0, width - 3)}...`;
}

function padColumn(value: unknown, width: number) {
  return truncateColumn(value, width).padEnd(width, ' ');
}

function formatConnectorListTable(record: Record<string, unknown>) {
  const connectors = Array.isArray(record.connectors) ? record.connectors : [];
  const widths = {
    connector: 28,
    category: 18,
    description: 36,
    status: 18,
  };

  const lines = [
    [
      padColumn('CONNECTOR', widths.connector),
      padColumn('CATEGORY', widths.category),
      padColumn('DESCRIPTION', widths.description),
      padColumn('STATUS', widths.status),
    ].join(' '),
  ];

  for (const item of connectors) {
    if (!item || typeof item !== 'object') {
      continue;
    }

    const connector = item as Record<string, unknown>;
    lines.push(
      [
        padColumn(connector.id, widths.connector),
        padColumn(connector.category, widths.category),
        padColumn(connector.description, widths.description),
        padColumn(connector.status, widths.status),
      ].join(' ')
    );
  }

  if (Array.isArray(record.hints) && record.hints.length > 0) {
    lines.push('', ...record.hints.map((hint) => String(hint)));
  }

  return ensureTrailingNewline(lines.join('\n'));
}

function formatStructuredDataForTerminal(data: unknown): string {
  data = stripRawPayloads(data);

  if (!data || typeof data !== 'object') {
    return ensureTrailingNewline(JSON.stringify(data, null, 2));
  }

  const record = data as Record<string, unknown>;

  if (record.error_code === 'INVALID_PARAMS' && isRecord(record.describe)) {
    return ensureTrailingNewline(
      [
        '# Parameter Error',
        '',
        String(record.message || 'Invalid connector parameters.'),
        '',
        formatStructuredDataForTerminal(record.describe).trimEnd(),
      ].join('\n')
    );
  }

  if (record.command === 'list' && Array.isArray(record.connectors)) {
    return formatConnectorListTable(record);
  }

  if (record.command === 'status' || record.command === 'balance') {
    const account =
      record.account && typeof record.account === 'object'
        ? (record.account as Record<string, unknown>)
        : {};
    return ensureTrailingNewline(
      [
        record.command === 'balance' ? '# Account Balance' : '# Account Status',
        '',
        ...formatGenericObject(account),
      ].join('\n')
    );
  }

  if (record.command === 'login' || record.command === 'logout') {
    const lines = [
      record.command === 'login' ? '# Login' : '# Logout',
      '',
      ...formatGenericObject(record),
    ];
    return ensureTrailingNewline(lines.join('\n'));
  }

  if (record.command === 'describe') {
    const lines = ['# Connector', '', ...formatGenericObject(record)];
    return ensureTrailingNewline(lines.join('\n'));
  }

  if (record.connector_id && record.name && record.cli_usage) {
    const usage =
      record.cli_usage && typeof record.cli_usage === 'object'
        ? (record.cli_usage as Record<string, unknown>)
        : {};
    const flags = Array.isArray(record.cli_flags) ? record.cli_flags : [];
    const lines = [
      `# ${formatScalar(record.name) || 'Connector'}`,
      '',
      ...formatRecordBullets({
        'Connector ID': record.connector_id,
        Category: record.category,
        Version: record.version,
        'Min CLI': record.min_cli_version,
        Compatibility: record.compatibility,
        Status: record.status,
        'Can Run Now': record.can_run_now,
        'Next Step': record.next_step,
      }),
      '',
      '## Summary',
      '',
      String(record.description || ''),
      '',
      '## CLI Usage',
      '',
      ...formatRecordBullets({
        Describe: usage.describe,
        Invoke: usage.invoke,
      }),
      '',
      '## CLI Flags',
      '',
      ...(flags.length
        ? flags
            .map((item) => {
              if (!item || typeof item !== 'object') {
                return undefined;
              }
              const flag = item as Record<string, unknown>;
              const required = flag.required ? 'required' : 'optional';
              return `- ${flag.name} (${required}): ${flag.description} [type=${flag.type}]`;
            })
            .filter((line): line is string => Boolean(line))
        : ['- No connector-specific flags.']),
      '',
      '## Output Contract',
      '',
      ...formatGenericObject(
        (record.output_contract as Record<string, unknown>) || {}
      ),
    ];
    return ensureTrailingNewline(lines.join('\n'));
  }

  const title =
    formatScalar(record.connector_name) ||
    (record.error_code ? 'Connector Error' : 'Connector Result');
  const lines: string[] = [`# ${title}`, ''];

  if (record.error_code) {
    lines.push(`- Error Code: ${record.error_code}`);
    if (record.connector_id) {
      lines.push(`- Connector ID: ${record.connector_id}`);
    }
    lines.push(
      '',
      '## Summary',
      '',
      String(record.message || 'Command failed.')
    );
    if (record.next_command) {
      lines.push('', '## Next Steps', '', `- ${record.next_command}`);
    }
    return ensureTrailingNewline(lines.join('\n'));
  }

  if (record.job_id) {
    lines.push(
      ...formatRecordBullets({
        'Connector ID': record.connector_id,
        'Job ID': record.job_id,
        Status: record.status,
        'Estimated Duration': record.estimated_duration,
        'Credits Cost': record.credits_cost,
      })
    );
    if (record.next_command) {
      lines.push('', '## Next Steps', '', `- ${record.next_command}`);
    }
    return ensureTrailingNewline(lines.join('\n'));
  }

  lines.push(
    ...formatRecordBullets({
      'Connector ID': record.connector_id,
      'Execution Mode': record.execution_mode,
      'Credits Cost': record.credits_cost,
    })
  );

  if (record.input && typeof record.input === 'object') {
    lines.push(
      '',
      '## Input',
      '',
      ...formatRecordBullets(record.input as Record<string, unknown>)
    );
  }

  if (record.summary) {
    lines.push('', '## Summary', '', String(record.summary));
  }

  if (Array.isArray(record.result)) {
    lines.push(
      '',
      '## Result',
      '',
      ...record.result
        .map((item) => {
          if (!item || typeof item !== 'object') {
            return undefined;
          }
          const field = item as Record<string, unknown>;
          const label = formatScalar(field.label);
          const value = formatScalar(field.value);
          return label && value ? `- ${label}: ${value}` : undefined;
        })
        .filter((line): line is string => Boolean(line))
    );
  }

  if (record.preview_url) {
    lines.push(`- Preview URL: ${record.preview_url}`);
  }

  if (Array.isArray(record.items) && record.items.length > 0) {
    lines.push(
      '',
      '## Items',
      '',
      '```json',
      JSON.stringify(record.items, null, 2),
      '```'
    );
  }

  if (Array.isArray(record.series) && record.series.length > 0) {
    lines.push(
      '',
      '## Series',
      '',
      '```json',
      JSON.stringify(record.series, null, 2),
      '```'
    );
  }

  if (Array.isArray(record.notes) && record.notes.length > 0) {
    lines.push('', '## Notes', '', ...record.notes.map((note) => `- ${note}`));
  }

  return ensureTrailingNewline(lines.join('\n'));
}

export function formatResponseForTerminal(
  response: CliCommandResponse,
  options: TerminalFormatOptions = {}
) {
  if (response.data !== undefined) {
    return formatStructuredDataForTerminal(response.data);
  }

  return formatMarkdownForTerminal(response.markdown || '', options);
}

function extractBulletLabel(line: string) {
  const match = line.match(/^- ([^:]+):/);
  return match?.[1]?.trim().toLowerCase();
}

function collectResultLabels(lines: string[]) {
  const labels = new Set<string>();
  let inResultSection = false;

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (line === '## Result') {
      inResultSection = true;
      continue;
    }

    if (line.startsWith('## ')) {
      inResultSection = false;
    }

    if (!inResultSection) {
      continue;
    }

    const label = extractBulletLabel(line);
    if (label) {
      labels.add(label);
    }
  }

  return labels;
}

function sanitizeInvokeLine(line: string) {
  return line
    .replace(
      /accepted by [^.]+ and rendered successfully\./i,
      'rendered successfully.'
    )
    .replace(
      /^[A-Za-z0-9 ._-]+ accepted the image generation task and queued it asynchronously\.$/i,
      'The image generation task was queued asynchronously.'
    )
    .replace(
      /^- The upstream [^.]+ task is still pending\.$/i,
      '- The image generation task is still pending.'
    );
}

function findNextNonEmptyLine(lines: string[], startIndex: number) {
  for (let index = startIndex; index < lines.length; index += 1) {
    if (lines[index] !== '') {
      return lines[index];
    }
  }

  return undefined;
}

function compactMarkdownLines(lines: string[]) {
  const compacted: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index].replace(/[ \t]+$/g, '');

    if (line === '') {
      const previous = compacted[compacted.length - 1];
      const next = findNextNonEmptyLine(lines, index + 1);

      if (!previous || !next || previous === '') {
        continue;
      }

      if (previous.startsWith('- ') && next.startsWith('- ')) {
        continue;
      }
    }

    compacted.push(line);
  }

  return ensureTrailingNewline(compacted.join('\n'));
}

function isProviderSourceLine(line: string) {
  return /^-\s*(dataforseo|rapidapi|aiapi|firecrawl|exa|twitterapi|google custom search|nokia)\b/i.test(
    line
  );
}

function shouldSanitizeInvokeOutput(options: TerminalFormatOptions) {
  return (
    options.command === 'invoke' ||
    (options.command === 'job' && options.subcommand === 'get')
  );
}

function hasResultSection(lines: string[]) {
  return lines.some((line) => line.trim() === '## Result');
}

export function formatMarkdownForTerminal(
  markdown: string,
  options: TerminalFormatOptions = {}
) {
  const normalized = markdown.replace(/\r\n/g, '\n');
  if (!shouldSanitizeInvokeOutput(options)) {
    return ensureTrailingNewline(normalized);
  }

  const lines = normalized.split('\n');
  const singleResultBlockMode = hasResultSection(lines);
  const resultLabels = collectResultLabels(lines);
  const output: string[] = [];
  let section: 'root' | 'summary' | 'result' | 'notes' | 'sources' | 'other' =
    'root';
  let noteLines: string[] = [];

  const flushNotes = () => {
    if (noteLines.length === 0) {
      return;
    }

    if (!singleResultBlockMode) {
      output.push('## Notes', '');
    }

    output.push(...noteLines);
    noteLines = [];
  };

  for (const rawLine of lines) {
    const line = sanitizeInvokeLine(rawLine).trimEnd();
    const trimmed = line.trim();

    if (trimmed === '## Summary') {
      flushNotes();
      section = 'summary';
      if (
        !singleResultBlockMode &&
        output.length > 0 &&
        output[output.length - 1] !== ''
      ) {
        output.push('');
      }
      continue;
    }

    if (trimmed === '## Result') {
      flushNotes();
      section = 'result';
      if (
        !singleResultBlockMode &&
        output.length > 0 &&
        output[output.length - 1] !== ''
      ) {
        output.push('');
      }
      continue;
    }

    if (trimmed === '## Notes') {
      flushNotes();
      section = 'notes';
      noteLines = [];
      continue;
    }

    if (trimmed === '## Sources') {
      flushNotes();
      section = 'sources';
      noteLines = [];
      continue;
    }

    if (trimmed.startsWith('## ')) {
      flushNotes();
      section = 'other';
      if (singleResultBlockMode) {
        continue;
      }
      output.push(trimmed);
      continue;
    }

    if (!trimmed) {
      if (section === 'notes') {
        continue;
      }

      output.push('');
      continue;
    }

    if (/^- Provider:/i.test(trimmed)) {
      continue;
    }

    if (
      (section === 'notes' || section === 'sources') &&
      /^- Rendered through\b/i.test(trimmed)
    ) {
      continue;
    }

    const label = extractBulletLabel(trimmed);
    if (section === 'root' && label && resultLabels.has(label)) {
      continue;
    }

    if (section === 'summary' && singleResultBlockMode) {
      continue;
    }

    if (section === 'sources') {
      continue;
    }

    if (section === 'notes') {
      if ((label && resultLabels.has(label)) || isProviderSourceLine(trimmed)) {
        continue;
      }
      noteLines.push(trimmed);
      continue;
    }

    output.push(line);
  }

  flushNotes();
  return compactMarkdownLines(output);
}

export function shouldEmitMachineErrorCode(
  errorCode: string | undefined,
  stderrIsTTY: boolean | undefined
) {
  return Boolean(errorCode) && !stderrIsTTY;
}

export function mapErrorCodeToExitCode(errorCode?: string) {
  if (!errorCode) return 0;

  if (errorCode === 'INVALID_API_KEY') return 2;
  if (errorCode === 'INVALID_PARAMS') return 3;
  if (
    errorCode === 'PROVIDER_TIMEOUT' ||
    errorCode === 'PROVIDER_ERROR' ||
    errorCode === 'ALL_PROVIDERS_FAILED'
  ) {
    return 4;
  }

  return 1;
}

export function parseArgv(argv: string[]) {
  const flags: Record<string, string | boolean> = {};
  const positionals: string[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const part = argv[index];
    if (!part.startsWith('--')) {
      positionals.push(part);
      continue;
    }

    const key = part.slice(2);
    const next = argv[index + 1];

    if (!next || next.startsWith('--')) {
      flags[key] = true;
      continue;
    }

    flags[key] = next;
    index += 1;
  }

  return { flags, positionals };
}
