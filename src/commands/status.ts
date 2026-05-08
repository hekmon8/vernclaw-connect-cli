import { requestApiJson } from '../client/http.js';
import type { CliConfig } from '../config/env.js';
import { buildAccountJsonResponse } from './account.js';

export async function runStatusCommand(config: CliConfig) {
  const result = await requestApiJson({
    config,
    pathname: '/api/connectors/status',
  });

  return buildAccountJsonResponse('status', result);
}
