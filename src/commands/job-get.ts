import { requestApiJson } from '../client/http.js';
import type { CliConfig } from '../config/env.js';

export function runJobGetCommand(config: CliConfig, jobId: string) {
  return requestApiJson({
    config,
    pathname: `/api/connectors/jobs/${jobId}`,
  });
}
