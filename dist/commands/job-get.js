import { requestMarkdown } from '../client/http.js';
export function runJobGetCommand(config, jobId) {
    return requestMarkdown({
        config,
        pathname: `/api/connectors/jobs/${jobId}`,
    });
}
