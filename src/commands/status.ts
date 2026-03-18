import type { CliConfig } from '../config/env.js';
import { requestMarkdown } from '../client/http.js';

export function runStatusCommand(config: CliConfig) {
  return requestMarkdown({
    config,
    pathname: '/api/connectors/status',
  });
}
