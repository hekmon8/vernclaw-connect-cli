import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import type {
  ConnectorRegistryCatalog,
  RegistryCatalogResponse,
} from './types.js';

type CachedCatalog = ConnectorRegistryCatalog | RegistryCatalogResponse;

export interface CachedCatalogEnvelope {
  fetchedAt: string;
  registryVersion: string;
  catalog: CachedCatalog;
}

const VERSION_CHECK_INTERVAL_MS = 5 * 60 * 1000;

export function readCachedCatalog(cacheFile: string): CachedCatalogEnvelope | null {
  if (!existsSync(cacheFile)) {
    return null;
  }

  try {
    const raw = JSON.parse(readFileSync(cacheFile, 'utf8'));
    if (raw && typeof raw === 'object' && raw.catalog) {
      return {
        fetchedAt: raw.fetchedAt || '',
        registryVersion: raw.registryVersion || '',
        catalog: raw.catalog as CachedCatalog,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export function shouldCheckVersion(envelope: CachedCatalogEnvelope | null): boolean {
  if (!envelope) {
    return true;
  }

  const fetchedAt = new Date(envelope.fetchedAt).getTime();
  if (!Number.isFinite(fetchedAt)) {
    return true;
  }

  return Date.now() - fetchedAt > VERSION_CHECK_INTERVAL_MS;
}

/**
 * @deprecated Use shouldCheckVersion instead
 */
export function shouldRefreshCatalog(envelope: CachedCatalogEnvelope | null): boolean {
  return shouldCheckVersion(envelope);
}

export function renewCacheTimestamp(cacheFile: string) {
  const envelope = readCachedCatalog(cacheFile);
  if (!envelope) {
    return;
  }

  writeCachedCatalog(cacheFile, envelope.catalog, envelope.registryVersion);
}

export function writeCachedCatalog(
  cacheFile: string,
  catalog: CachedCatalog,
  registryVersion?: string
) {
  mkdirSync(dirname(cacheFile), { recursive: true });

  const version =
    registryVersion ||
    ('registry_version' in catalog ? catalog.registry_version : '') ||
    ('registryVersion' in catalog ? catalog.registryVersion : '') ||
    '';

  writeFileSync(
    cacheFile,
    JSON.stringify(
      {
        fetchedAt: new Date().toISOString(),
        registryVersion: version,
        catalog,
      } satisfies CachedCatalogEnvelope,
      null,
      2
    )
  );
}
