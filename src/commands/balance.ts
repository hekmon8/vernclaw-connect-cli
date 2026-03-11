import type { CliConfig } from '../config/env.js';
import { requestMarkdown } from '../client/http.js';

export function runBalanceCommand(config: CliConfig) {
  return requestMarkdown({
    config,
    pathname: '/api/connectors/balance',
  });
}
