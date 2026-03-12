import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

import type {
  ConnectorRegistryCatalog,
  RegistryCatalogResponse,
} from './types.js';

type CachedCatalog = ConnectorRegistryCatalog | RegistryCatalogResponse;

interface CachedCatalogFile {
  fetchedAt: string;
  catalog: CachedCatalog;
}

const MAX_CACHE_AGE_MS = 60 * 60 * 1000;

export function readCachedCatalog(cacheFile: string) {
  if (!existsSync(cacheFile)) {
    return null;
  }

  return JSON.parse(readFileSync(cacheFile, 'utf8')) as CachedCatalogFile;
}

export function shouldRefreshCatalog(cache: CachedCatalogFile | null) {
  if (!cache) {
    return true;
  }

  const fetchedAt = new Date(cache.fetchedAt).getTime();
  if (!Number.isFinite(fetchedAt)) {
    return true;
  }

  return Date.now() - fetchedAt > MAX_CACHE_AGE_MS;
}

export function writeCachedCatalog(cacheFile: string, catalog: CachedCatalog) {
  mkdirSync(dirname(cacheFile), { recursive: true });
  writeFileSync(
    cacheFile,
    JSON.stringify(
      {
        fetchedAt: new Date().toISOString(),
        catalog,
      } satisfies CachedCatalogFile,
      null,
      2
    )
  );
}
