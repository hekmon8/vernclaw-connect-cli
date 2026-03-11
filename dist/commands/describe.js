import { requestMarkdown } from '../client/http.js';
export function runDescribeCommand(config, connectorId) {
    return requestMarkdown({
        config,
        pathname: `/api/connectors/${connectorId}?format=markdown`,
    });
}
