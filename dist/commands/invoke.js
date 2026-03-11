import { readFileSync } from 'node:fs';
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
export function runInvokeCommand(config, connectorId, flags) {
    return requestMarkdown({
        config,
        pathname: `/api/connectors/${connectorId}/invoke`,
        method: 'POST',
        body: buildInvokePayload(flags),
    });
}
