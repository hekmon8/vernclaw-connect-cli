import { renderCatalogEntry } from '../catalog/index.js';
import { getEffectiveConnectorById } from '../catalog/service.js';
export async function runDescribeCommand(config, connectorId) {
    const entry = await getEffectiveConnectorById(config, connectorId);
    if (!entry) {
        return {
            markdown: `# Connector Not Found\n\n- Connector ID: ${connectorId}\n`,
            status: 404,
            errorCode: 'INVALID_PARAMS',
        };
    }
    return {
        markdown: renderCatalogEntry(entry),
        status: 200,
    };
}
