import { normalizeInputSchema } from '../catalog/input-schema.js';
import {
  buildExampleInvokeCommand,
  resolveAvailability,
  resolveCanRunNow,
  resolveNextStep,
} from '../catalog/render.js';
import { getEffectiveConnectorById } from '../catalog/service.js';
import type { EffectiveConnectorView } from '../catalog/types.js';
import type { CliConfig } from '../config/env.js';

function buildConnectorDetails(
  entry: EffectiveConnectorView,
  viewerState: 'authenticated' | 'unauthenticated'
) {
  const { properties, required } = normalizeInputSchema(
    entry.manifest.inputSchema
  );

  return {
    connector_id: entry.id,
    name: entry.name,
    category: entry.category,
    description: entry.description,
    version: entry.version,
    min_cli_version: entry.minCliVersion,
    compatibility: entry.compatibilityState,
    status: resolveAvailability(entry, viewerState),
    can_run_now: resolveCanRunNow(entry, viewerState) === 'Yes',
    next_step: resolveNextStep(entry, viewerState),
    compatibility_reasons: entry.compatibilityReasons || [],
    cli_usage: {
      describe: `vernclaw-cli describe ${entry.id}`,
      invoke: buildExampleInvokeCommand(entry),
    },
    cli_flags: Object.entries(properties).map(([key, value]) => {
      const schema = value as Record<string, unknown>;
      return {
        name: `--${key}`,
        key,
        required: required.includes(key),
        type: typeof schema.type === 'string' ? schema.type : 'string',
        description:
          typeof schema.description === 'string'
            ? schema.description
            : 'No description',
      };
    }),
    output_contract: {
      mode: entry.manifest.outputContract.mode,
      result_format: entry.manifest.outputContract.resultFormat,
      structured_payload: entry.manifest.outputContract.structuredPayload,
    },
    input_schema: entry.manifest.inputSchema,
  };
}

export async function runDescribeCommand(
  config: CliConfig,
  connectorId: string
) {
  if (!connectorId) {
    return {
      data: {
        command: 'describe',
        error_code: 'INVALID_PARAMS',
        message: 'No connector ID provided.',
        next_steps: [
          'Run vernclaw-cli list to see all available connectors.',
          'Run vernclaw-cli describe <connector-id> to see connector details.',
        ],
      },
      status: 400,
      errorCode: 'INVALID_PARAMS',
    };
  }

  const entry = await getEffectiveConnectorById(config, connectorId);

  if (!entry) {
    return {
      data: {
        command: 'describe',
        error_code: 'INVALID_PARAMS',
        connector_id: connectorId,
        message: 'Connector not found.',
      },
      status: 404,
      errorCode: 'INVALID_PARAMS',
    };
  }

  return {
    data: buildConnectorDetails(
      entry,
      config.apiKey ? 'authenticated' : 'unauthenticated'
    ),
    status: 200,
  };
}
