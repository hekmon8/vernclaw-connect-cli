import type { CliConfig } from '../config/env.js';
import { requestMarkdown } from '../client/http.js';

export function runDescribeCommand(config: CliConfig, connectorId: string) {
  return requestMarkdown({
    config,
    pathname: `/api/connectors/${connectorId}?format=markdown`,
  });
}
