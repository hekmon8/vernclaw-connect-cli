import { requestMarkdown } from '../client/http.js';
export function runBalanceCommand(config) {
    return requestMarkdown({
        config,
        pathname: '/api/connectors/balance',
    });
}
