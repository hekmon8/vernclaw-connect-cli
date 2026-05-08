import { beforeEach, describe, expect, it, vi } from 'vitest';

import { runListCommand } from '../../src/commands/list.js';

const { mockFilterCatalogForList, mockResolveEffectiveCatalog } = vi.hoisted(
  () => ({
    mockFilterCatalogForList: vi.fn(),
    mockResolveEffectiveCatalog: vi.fn(),
  })
);

vi.mock('../../src/catalog/index.js', () => ({
  filterCatalogForList: mockFilterCatalogForList,
  resolveEffectiveCatalog: mockResolveEffectiveCatalog,
}));

describe('list command', () => {
  const sampleEntry = {
    id: 'seo.website-traffic',
    name: 'Website Traffic Get',
    category: 'seo',
    description: 'Estimate website traffic.',
    version: '1.0.0',
    minCliVersion: '0.1.0',
    visibility: 'visible',
    compatibilityState: 'supported',
    installStatus: 'available',
    runtimeStatus: 'unknown',
    authStatus: 'unknown',
    trainingStatus: 'unknown',
    source: 'bootstrap',
    manifest: {
      inputSchema: {},
      outputContract: {
        mode: 'sync_result',
        resultFormat: 'json',
        structuredPayload: 'optional',
      },
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockResolveEffectiveCatalog.mockResolvedValue([]);
    mockFilterCatalogForList.mockReturnValue([sampleEntry]);
  });

  it('shows login and describe hints when api key is missing', async () => {
    const result = await runListCommand(
      {
        apiBaseUrl: 'https://api.example.com',
        apiKey: '',
        credentialsFile: '/tmp/cred.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      {}
    );

    expect(result.data).toMatchObject({
      command: 'list',
      count: 1,
      connectors: [
        {
          id: 'seo.website-traffic',
          status: 'login required',
        },
      ],
    });
    expect(JSON.stringify(result.data)).toContain(
      'Run `vernclaw-cli login` to authenticate before invoking connectors.'
    );
    expect(JSON.stringify(result.data)).toContain(
      'Run `vernclaw-cli describe <connector>` to inspect required flags and example commands.'
    );
  });

  it('marks ready connectors for authenticated users', async () => {
    mockFilterCatalogForList.mockReturnValue([
      {
        ...sampleEntry,
        runtimeStatus: 'active',
      },
    ]);

    const result = await runListCommand(
      {
        apiBaseUrl: 'https://api.example.com',
        apiKey: 'key_123',
        credentialsFile: '/tmp/cred.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      {}
    );

    expect(result.data).toMatchObject({
      connectors: [
        {
          id: 'seo.website-traffic',
          status: 'ready',
        },
      ],
    });
  });
});
