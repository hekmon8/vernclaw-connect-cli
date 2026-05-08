import { resolveCliConfig } from './config/env.js';

export { resolveCliConfig };

type TerminalFormatOptions = {
  command?: string;
  subcommand?: string;
};

export type CliCommandResponse = {
  markdown: string;
  status: number;
  errorCode?: string;
};

export function ensureTrailingNewline(value: string) {
  return value.endsWith('\n') ? value : `${value}\n`;
}

export function formatJsonForTerminal(response: CliCommandResponse) {
  const payload: Record<string, unknown> = {
    status: response.status,
    markdown: response.markdown,
  };

  if (response.errorCode) {
    payload.errorCode = response.errorCode;
  }

  return ensureTrailingNewline(JSON.stringify(payload));
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
  let section:
    | 'root'
    | 'summary'
    | 'result'
    | 'notes'
    | 'sources'
    | 'other' = 'root';
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
