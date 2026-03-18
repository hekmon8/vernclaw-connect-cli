import { describe, expect, it } from 'vitest';

import { normalizeRegistryCatalogResponse } from '../../src/catalog/http.js';

describe('catalog http normalization', () => {
  it('merges legacy input_schema maps with builtin bootstrap metadata', () => {
    const normalized = normalizeRegistryCatalogResponse({
      registry_schema: '1.3',
      registry_version: '2026-03-18',
      connectors: [
        {
          manifest: {
            id: 'seo.website-traffic',
            name: 'Website Traffic Get',
            category: 'seo',
            description: 'Traffic lookup',
            version: '1.0.0',
            connector_type: 'read_only',
            min_cli_version: '0.1.0',
            required_cli_features: ['registry_v1'],
            input_schema: {
              domain: 'string',
              market: 'string?',
            },
            output_contract: {
              mode: 'sync_result',
              result_format: 'markdown',
              structured_payload: 'none',
            },
          },
          overlay: {
            connector_id: 'seo.website-traffic',
            visible: true,
            featured: false,
            emergency_disable: false,
          },
        },
      ],
    });

    const schema = normalized.connectors[0].manifest.inputSchema as {
      properties?: Record<string, { description?: string }>;
      required?: string[];
    };

    expect(schema.required).toEqual(['domain']);
    expect(schema.properties?.domain?.description).toContain('Root domain');
    expect(schema.properties?.market?.description).toContain('market code');
  });
});
