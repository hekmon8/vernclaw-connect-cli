import { describe, expect, it, vi } from 'vitest';

import { BUILTIN_BOOTSTRAP_CATALOG } from '../../src/catalog/bootstrap.js';
import type { CachedCatalogEnvelope } from '../../src/catalog/cache.js';
import { resolveRegistryCatalog } from '../../src/catalog/service.js';
import type { RegistryCatalogResponse } from '../../src/catalog/types.js';

function buildCatalog(version = '2026-03-12'): RegistryCatalogResponse {
  return {
    registry_schema: '1.3',
    registry_version: version,
    connectors: [
      {
        manifest: {
          id: 'seo.website-traffic',
          name: 'SEO Website Traffic',
          version: '1.0.0',
          connector_type: 'read_only',
          min_cli_version: '0.1.0',
          required_cli_features: ['registry_v1', 'invoke_v1'],
          input_schema: { type: 'object', properties: {} },
          output_contract: {
            mode: 'sync_result',
            result_format: 'json',
            structured_payload: 'optional',
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

function buildCacheEnvelope(version: string): CachedCatalogEnvelope {
  return {
    fetchedAt: new Date().toISOString(),
    registryVersion: version,
    catalog: buildCatalog(version),
  };
}

describe('registry catalog service', () => {
  it('falls back to cache when refresh fails', async () => {
    const cachedEnvelope = buildCacheEnvelope('1.0.0');
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
        readCache: vi.fn().mockReturnValue(cachedEnvelope),
        writeCache: vi.fn(),
        bootstrapCatalog: buildCatalog('0.0.0'),
      },
    });

    expect(result.source).toBe('cache');
    expect(result.catalog.registry_version).toBe('1.0.0');
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
        bootstrapCatalog: buildCatalog('0.0.0'),
      },
    });

    expect(result.source).toBe('bootstrap');
    expect(result.catalog.registry_version).toBe('0.0.0');
  });

  it('uses cache when version check shows same version', async () => {
    const staleEnvelope = buildCacheEnvelope('1.0.0');
    staleEnvelope.fetchedAt = new Date(
      Date.now() - 10 * 60 * 1000
    ).toISOString();
    const fetchCatalog = vi.fn();
    const fetchVersion = vi
      .fn()
      .mockResolvedValue({ registry_version: '1.0.0' });
    const renewTimestamp = vi.fn();

    const result = await resolveRegistryCatalog({
      config: {
        apiBaseUrl: 'https://api.example.com',
        apiKey: '',
        credentialsFile: '/tmp/cred.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      dependencies: {
        fetchCatalog,
        fetchVersion,
        readCache: vi.fn().mockReturnValue(staleEnvelope),
        writeCache: vi.fn(),
        renewTimestamp,
      },
    });

    expect(result.source).toBe('cache');
    expect(fetchVersion).toHaveBeenCalledOnce();
    expect(fetchCatalog).not.toHaveBeenCalled();
    expect(renewTimestamp).toHaveBeenCalled();
  });

  it('fetches full catalog when remote version is newer', async () => {
    const staleEnvelope = buildCacheEnvelope('1.0.0');
    staleEnvelope.fetchedAt = new Date(
      Date.now() - 10 * 60 * 1000
    ).toISOString();
    const newCatalog = buildCatalog('1.1.0');
    const fetchCatalog = vi.fn().mockResolvedValue(newCatalog);
    const fetchVersion = vi
      .fn()
      .mockResolvedValue({ registry_version: '1.1.0' });
    const writeCache = vi.fn();

    const result = await resolveRegistryCatalog({
      config: {
        apiBaseUrl: 'https://api.example.com',
        apiKey: '',
        credentialsFile: '/tmp/cred.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      dependencies: {
        fetchCatalog,
        fetchVersion,
        readCache: vi.fn().mockReturnValue(staleEnvelope),
        writeCache,
      },
    });

    expect(result.source).toBe('remote');
    expect(result.catalog.registry_version).toBe('1.1.0');
    expect(fetchVersion).toHaveBeenCalledOnce();
    expect(fetchCatalog).toHaveBeenCalledOnce();
    expect(writeCache).toHaveBeenCalled();
  });

  it('skips version check within TTL window', async () => {
    const freshEnvelope = buildCacheEnvelope('1.0.0');
    const fetchVersion = vi.fn();

    const result = await resolveRegistryCatalog({
      config: {
        apiBaseUrl: 'https://api.example.com',
        apiKey: '',
        credentialsFile: '/tmp/cred.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      dependencies: {
        fetchCatalog: vi.fn(),
        fetchVersion,
        readCache: vi.fn().mockReturnValue(freshEnvelope),
        writeCache: vi.fn(),
      },
    });

    expect(result.source).toBe('cache');
    expect(fetchVersion).not.toHaveBeenCalled();
  });

  it('keeps social connectors in the offline bootstrap catalog', () => {
    const ids = BUILTIN_BOOTSTRAP_CATALOG.connectors.map(
      (entry) => entry.manifest.id
    );

    expect(ids).toEqual(
      expect.arrayContaining([
        'social.tiktok',
        'social.douyin',
        'social.instagram',
        'social.linkedin',
        'social.reddit',
        'social.threads',
        'social.wechat',
        'social.weibo',
        'social.xiaohongshu',
        'social.youtube',
        'social.zhihu',
      ])
    );
  });
});
