import { requestMarkdown } from '../client/http.js';
export function runListCommand(config) {
    return requestMarkdown({
        config,
        pathname: '/api/connectors?format=markdown',
    });
}
