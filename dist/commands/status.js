import { requestMarkdown } from '../client/http.js';
export function runStatusCommand(config) {
    return requestMarkdown({
        config,
        pathname: '/api/connectors/status',
    });
}
