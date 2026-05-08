import type { CliCommandResponse } from '../index.js';
import type { ApiJsonResponse, MarkdownResponse } from '../client/http.js';

function toSnakeCase(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function stripMarkdownText(markdown: string) {
  return markdown
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) =>
      line
        .replace(/^#{1,6}\s*/, '')
        .replace(/^-\s*/, '')
        .replace(/`([^`]+)`/g, '$1')
        .trim()
    )
    .filter(Boolean)
    .join(' ');
}

export function parseAccountStatusMarkdown(markdown: string) {
  const account: Record<string, string | number> = {};

  for (const rawLine of markdown.replace(/\r\n/g, '\n').split('\n')) {
    const match = rawLine.match(/^- ([^:]+):\s*(.*)$/);
    if (!match) {
      continue;
    }

    const key = toSnakeCase(match[1] || '');
    const rawValue = (match[2] || '').trim();
    if (!key || !rawValue) {
      continue;
    }

    const numericValue = Number(rawValue);
    account[key] =
      Number.isFinite(numericValue) && /^\d+(?:\.\d+)?$/.test(rawValue)
        ? numericValue
        : rawValue;
  }

  return account;
}

export function buildAccountCommandResponse(
  command: 'status' | 'balance',
  result: MarkdownResponse
): CliCommandResponse {
  if (result.errorCode) {
    return {
      data: {
        command,
        error_code: result.errorCode,
        message: stripMarkdownText(result.markdown) || 'Command failed.',
      },
      status: result.status,
      errorCode: result.errorCode,
    };
  }

  return {
    data: {
      command,
      account: parseAccountStatusMarkdown(result.markdown),
    },
    status: result.status,
  };
}

export function buildAccountJsonResponse(
  command: 'status' | 'balance',
  result: ApiJsonResponse
): CliCommandResponse {
  if (
    result.data &&
    typeof result.data === 'object' &&
    'text' in result.data &&
    typeof (result.data as { text?: unknown }).text === 'string'
  ) {
    return buildAccountCommandResponse(command, {
      markdown: (result.data as { text: string }).text,
      errorCode: result.errorCode,
      status: result.status,
    });
  }

  if (result.errorCode) {
    return {
      data: {
        command,
        error_code: result.errorCode,
        message:
          result.data &&
          typeof result.data === 'object' &&
          'message' in result.data
            ? String((result.data as { message?: unknown }).message)
            : 'Command failed.',
        next_command:
          result.data &&
          typeof result.data === 'object' &&
          'next_command' in result.data
            ? String((result.data as { next_command?: unknown }).next_command)
            : undefined,
      },
      status: result.status,
      errorCode: result.errorCode,
    };
  }

  const data =
    result.data && typeof result.data === 'object'
      ? (result.data as Record<string, unknown>)
      : {};

  return {
    data: {
      command,
      account:
        data.account && typeof data.account === 'object' ? data.account : data,
    },
    status: result.status,
  };
}
