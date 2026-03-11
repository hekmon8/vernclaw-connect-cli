import { readFileSync } from 'node:fs';

import type { CliConfig } from '../config/env.js';
import { requestMarkdown } from '../client/http.js';

export function buildInvokePayload(flags: Record<string, string | boolean>) {
  if (typeof flags['input-file'] === 'string') {
    return JSON.parse(readFileSync(String(flags['input-file']), 'utf8'));
  }

  return Object.entries(flags).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (key === 'api-key' || key === 'api-base-url') {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
}

export function runInvokeCommand(
  config: CliConfig,
  connectorId: string,
  flags: Record<string, string | boolean>
) {
  return requestMarkdown({
    config,
    pathname: `/api/connectors/${connectorId}/invoke`,
    method: 'POST',
    body: buildInvokePayload(flags) as Record<string, unknown>,
  });
}
