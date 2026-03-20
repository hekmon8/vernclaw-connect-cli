import { readFileSync } from 'node:fs';

import type { CliConfig } from '../config/env.js';
import { validateAndNormalizeInvokePayload } from '../catalog/input-schema.js';
import { getEffectiveConnectorById } from '../catalog/service.js';
import { requestMarkdown } from '../client/http.js';

export function buildInvokePayload(flags: Record<string, string | boolean>) {
  if (typeof flags['input-file'] === 'string') {
    return JSON.parse(readFileSync(String(flags['input-file']), 'utf8'));
  }

  return Object.entries(flags).reduce<Record<string, unknown>>((acc, [key, value]) => {
    if (key === 'api-key' || key === 'api-base-url') {
      return acc;
    }
    acc[key] = value;
    return acc;
  }, {});
}

function buildLocalInvalidParamsResponse(
  connectorId: string,
  connectorName: string,
  message: string
) {
  return {
    markdown: [
      `# ${connectorName}`,
      '',
      '- Error Code: INVALID_PARAMS',
      `- Connector: ${connectorId}`,
      '',
      '## Summary',
      '',
      message,
      '',
      '## Next Steps',
      '',
      `- Run \`vernclaw-cli describe ${connectorId}\` to inspect the expected flags and example command.`,
      '',
    ].join('\n'),
    status: 400,
    errorCode: 'INVALID_PARAMS',
  } as const;
}

export async function runInvokeCommand(
  config: CliConfig,
  connectorId: string,
  flags: Record<string, string | boolean>
) {
  const entry = await getEffectiveConnectorById(config, connectorId);
  if (!entry) {
    return {
      markdown: `# Connector Invocation Failed\n\n- Error Code: INVALID_PARAMS\n- Connector: ${connectorId}\n\n## Summary\n\nUnknown connector.\n`,
      status: 404,
      errorCode: 'INVALID_PARAMS',
    };
  }

  if (entry.compatibilityState !== 'supported') {
    const summary =
      entry.compatibilityReasons?.[0]?.message ||
      'This connector is not compatible with the current CLI.';

    return {
      markdown: `# ${entry.name}\n\n- Error Code: CLI_UPGRADE_REQUIRED\n- Connector: ${entry.id}\n\n## Summary\n\n${summary}\n`,
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
      connectorId,
      entry.name,
      payloadValidation.error
    );
  }

  return requestMarkdown({
    config,
    pathname: `/api/connectors/${connectorId}/invoke`,
    method: 'POST',
    body: payloadValidation.payload,
  });
}
