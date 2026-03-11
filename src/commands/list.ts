import type { CliConfig } from '../config/env.js';
import { requestMarkdown } from '../client/http.js';

export function runListCommand(config: CliConfig) {
  return requestMarkdown({
    config,
    pathname: '/api/connectors?format=markdown',
  });
}
