import { describe, expect, it, vi } from 'vitest';

import { resolveRegistryCatalog } from '../../src/catalog/service.js';
import type { RegistryCatalogResponse } from '../../src/catalog/types.js';

function buildCatalog(version = '2026-03-12'): RegistryCatalogResponse {
  return {
    registry_schema: '1.3',
    registry_version: version,
    connectors: [
      {
        manifest: {
          id: 'website_traffic_get',
          name: 'Website Traffic Get',
          version: '1.0.0',
          connector_type: 'read_only',
          min_cli_version: '0.1.0',
          required_cli_features: ['registry_v1', 'invoke_v1'],
          input_schema: { type: 'object', properties: {} },
          output_contract: {
            mode: 'sync_result',
            result_format: 'markdown',
            structured_payload: 'none',
          },
        },
        overlay: {
          visible: true,
          featured: false,
          emergency_disable: false,
        },
      },
    ],
  };
}

describe('registry catalog service', () => {
  it('falls back to cache when refresh fails', async () => {
    const cached = buildCatalog('2026-03-11');
    const result = await resolveRegistryCatalog({
      config: {
        apiBaseUrl: 'https://api.example.com',
        apiKey: '',
        credentialsFile: '/tmp/cred.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      options: {
        refresh: true,
        offline: false,
      },
      dependencies: {
        fetchCatalog: vi.fn().mockRejectedValue(new Error('network down')),
        readCache: vi.fn().mockReturnValue(cached),
        writeCache: vi.fn(),
        bootstrapCatalog: buildCatalog('2026-03-10'),
      },
    });

    expect(result.source).toBe('cache');
    expect(result.catalog.registry_version).toBe('2026-03-11');
  });

  it('falls back to builtin bootstrap catalog when offline and cache is missing', async () => {
    const result = await resolveRegistryCatalog({
      config: {
        apiBaseUrl: 'https://api.example.com',
        apiKey: '',
        credentialsFile: '/tmp/cred.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      options: {
        offline: true,
      },
      dependencies: {
        fetchCatalog: vi.fn(),
        readCache: vi.fn().mockReturnValue(null),
        writeCache: vi.fn(),
        bootstrapCatalog: buildCatalog('2026-03-10'),
      },
    });

    expect(result.source).toBe('bootstrap');
    expect(result.catalog.registry_version).toBe('2026-03-10');
  });
});
