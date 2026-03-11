import type { CliConfig } from '../config/env.js';
import { requestMarkdown } from '../client/http.js';

export function runJobGetCommand(config: CliConfig, jobId: string) {
  return requestMarkdown({
    config,
    pathname: `/api/connectors/jobs/${jobId}`,
  });
}
