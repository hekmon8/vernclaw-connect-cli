import type { CliConfig } from '../config/env.js';
import { renderCatalogEntry } from '../catalog/index.js';
import { getEffectiveConnectorById } from '../catalog/service.js';

export async function runDescribeCommand(config: CliConfig, connectorId: string) {
  if (!connectorId) {
    return {
      markdown: [
        '# Connector Not Found',
        '',
        '- Error Code: INVALID_PARAMS',
        '',
        '## Summary',
        '',
        'No connector ID provided.',
        '',
        '## Next Steps',
        '',
        '- Run `vernclaw-cli list` to see all available connectors.',
        '- Run `vernclaw-cli describe <connector-id>` to see connector details.',
        '',
      ].join('\n'),
      status: 400,
      errorCode: 'INVALID_PARAMS',
    };
  }

  const entry = await getEffectiveConnectorById(config, connectorId);

  if (!entry) {
    return {
      markdown: `# Connector Not Found\n\n- Connector ID: ${connectorId}\n`,
      status: 404,
      errorCode: 'INVALID_PARAMS',
    };
  }

  return {
    markdown: renderCatalogEntry(entry, {
      viewerState: config.apiKey ? 'authenticated' : 'unauthenticated',
    }),
    status: 200,
  };
}
