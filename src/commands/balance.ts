import { requestApiJson } from '../client/http.js';
import type { CliConfig } from '../config/env.js';
import { buildAccountJsonResponse } from './account.js';

export async function runBalanceCommand(config: CliConfig) {
  const result = await requestApiJson({
    config,
    pathname: '/api/connectors/balance',
  });

  return buildAccountJsonResponse('balance', result);
}
