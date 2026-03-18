import { beforeEach, describe, expect, it, vi } from 'vitest';

import { runListCommand } from '../../src/commands/list.js';

const {
  mockFilterCatalogForList,
  mockRenderCatalogList,
  mockResolveEffectiveCatalog,
} = vi.hoisted(() => ({
  mockFilterCatalogForList: vi.fn(),
  mockRenderCatalogList: vi.fn(),
  mockResolveEffectiveCatalog: vi.fn(),
}));

vi.mock('../../src/catalog/index.js', () => ({
  filterCatalogForList: mockFilterCatalogForList,
  renderCatalogList: mockRenderCatalogList,
  resolveEffectiveCatalog: mockResolveEffectiveCatalog,
}));

describe('list command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockResolveEffectiveCatalog.mockResolvedValue([]);
    mockFilterCatalogForList.mockReturnValue([]);
    mockRenderCatalogList.mockReturnValue('CONNECTOR STATUS\nseo.website-traffic login required\n');
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

    expect(result.markdown).toContain('login required');
    expect(result.markdown).toContain(
      'Run `vernclaw-cli login` to authenticate before invoking connectors.'
    );
    expect(result.markdown).toContain(
      'Run `vernclaw-cli describe <connector>` to inspect required flags and example commands.'
    );
    expect(mockRenderCatalogList).toHaveBeenCalledWith([], false, {
      viewerState: 'unauthenticated',
    });
  });

  it('passes authenticated viewer state when api key exists', async () => {
    await runListCommand(
      {
        apiBaseUrl: 'https://api.example.com',
        apiKey: 'key_123',
        credentialsFile: '/tmp/cred.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      {}
    );

    expect(mockRenderCatalogList).toHaveBeenCalledWith([], false, {
      viewerState: 'authenticated',
    });
  });
});
