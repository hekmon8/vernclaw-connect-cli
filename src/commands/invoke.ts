import { readFileSync } from 'node:fs';

import { validateAndNormalizeInvokePayload } from '../catalog/input-schema.js';
import { getEffectiveConnectorById } from '../catalog/service.js';
import type { EffectiveConnectorView } from '../catalog/types.js';
import { requestApiJson } from '../client/http.js';
import type { CliConfig } from '../config/env.js';

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
  _entry: EffectiveConnectorView,
  _viewerState: 'authenticated' | 'unauthenticated',
  message: string
) {
  return {
    data: {
      message,
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
        message: 'No connector ID provided.',
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
