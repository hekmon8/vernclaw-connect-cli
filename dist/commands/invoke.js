import { readFileSync } from 'node:fs';
import { getEffectiveConnectorById } from '../catalog/service.js';
import { requestMarkdown } from '../client/http.js';
export function buildInvokePayload(flags) {
    if (typeof flags['input-file'] === 'string') {
        return JSON.parse(readFileSync(String(flags['input-file']), 'utf8'));
    }
    return Object.entries(flags).reduce((acc, [key, value]) => {
        if (key === 'api-key' || key === 'api-base-url') {
            return acc;
        }
        acc[key] = value;
        return acc;
    }, {});
}
export async function runInvokeCommand(config, connectorId, flags) {
    const entry = await getEffectiveConnectorById(config, connectorId);
    if (!entry) {
        return {
            markdown: `# Connector Invocation Failed\n\n- Error Code: INVALID_PARAMS\n- Connector: ${connectorId}\n\n## Summary\n\nUnknown connector.\n`,
            status: 404,
            errorCode: 'INVALID_PARAMS',
        };
    }
    if (entry.compatibilityState !== 'supported') {
        const summary = entry.compatibilityReasons?.[0]?.message ||
            'This connector is not compatible with the current CLI.';
        return {
            markdown: `# ${entry.name}\n\n- Error Code: CLI_UPGRADE_REQUIRED\n- Connector: ${entry.id}\n\n## Summary\n\n${summary}\n`,
            status: 409,
            errorCode: 'CLI_UPGRADE_REQUIRED',
        };
    }
    return requestMarkdown({
        config,
        pathname: `/api/connectors/${connectorId}/invoke`,
        method: 'POST',
        body: buildInvokePayload(flags),
    });
}
