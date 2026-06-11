import { readFileSync } from 'node:fs';

import { validateAndNormalizeInvokePayload } from '../catalog/input-schema.js';
import { getEffectiveConnectorById } from '../catalog/service.js';
import type { EffectiveConnectorView } from '../catalog/types.js';
import { requestApiJson } from '../client/http.js';
import type { CliConfig } from '../config/env.js';
import { buildConnectorDetails } from './describe.js';

export function buildInvokePayload(flags: Record<string, string | boolean>) {
  if (typeof flags['input-file'] === 'string') {
    return JSON.parse(readFileSync(String(flags['input-file']), 'utf8'));
  }

  return Object.entries(flags).reduce<Record<string, unknown>>(
    (acc, [key, value]) => {
      if (key === 'api-key' || key === 'api-base-url') {
        return acc;
      }
      acc[key] = value;
      return acc;
    },
    {}
  );
}

function buildLocalInvalidParamsResponse(
  entry: EffectiveConnectorView,
  viewerState: 'authenticated' | 'unauthenticated',
  message: string
) {
  return {
    data: {
      connector_id: entry.id,
      connector_name: entry.name,
      error_code: 'INVALID_PARAMS',
      message,
      next_command: `vernclaw-cli describe ${entry.id}`,
      describe: buildConnectorDetails(entry, viewerState),
    },
    status: 400,
    errorCode: 'INVALID_PARAMS',
  } as const;
}

export async function runInvokeCommand(
  config: CliConfig,
  connectorId: string,
  flags: Record<string, string | boolean>
) {
  if (!connectorId) {
    return {
      data: {
        error_code: 'INVALID_PARAMS',
        message: 'No connector ID provided.',
        next_command: 'vernclaw-cli list',
      },
      status: 400,
      errorCode: 'INVALID_PARAMS',
    };
  }

  if (flags['help'] === true) {
    const { runDescribeCommand } = await import('./describe.js');
    return runDescribeCommand(config, connectorId);
  }

  const entry = await getEffectiveConnectorById(config, connectorId);
  if (!entry) {
    return {
      data: {
        connector_id: connectorId,
        error_code: 'INVALID_PARAMS',
        message: 'Unknown connector.',
      },
      status: 404,
      errorCode: 'INVALID_PARAMS',
    };
  }

  if (entry.compatibilityState !== 'supported') {
    const summary =
      entry.compatibilityReasons?.[0]?.message ||
      'This connector is not compatible with the current CLI.';

    return {
      data: {
        connector_id: entry.id,
        connector_name: entry.name,
        error_code: 'CLI_UPGRADE_REQUIRED',
        message: summary,
      },
      status: 409,
      errorCode: 'CLI_UPGRADE_REQUIRED',
    };
  }

  const payloadValidation = validateAndNormalizeInvokePayload(
    buildInvokePayload(flags),
    entry.manifest?.inputSchema
  );

  if (!payloadValidation.ok) {
    return buildLocalInvalidParamsResponse(
      entry,
      config.apiKey ? 'authenticated' : 'unauthenticated',
      payloadValidation.error
    );
  }

  return requestApiJson({
    config,
    pathname: `/api/connectors/${connectorId}/invoke`,
    method: 'POST',
    body: payloadValidation.payload,
  });
}
