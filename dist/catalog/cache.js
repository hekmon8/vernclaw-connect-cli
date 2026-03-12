import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
const MAX_CACHE_AGE_MS = 60 * 60 * 1000;
export function readCachedCatalog(cacheFile) {
    if (!existsSync(cacheFile)) {
        return null;
    }
    return JSON.parse(readFileSync(cacheFile, 'utf8'));
}
export function shouldRefreshCatalog(cache) {
    if (!cache) {
        return true;
    }
    const fetchedAt = new Date(cache.fetchedAt).getTime();
    if (!Number.isFinite(fetchedAt)) {
        return true;
    }
    return Date.now() - fetchedAt > MAX_CACHE_AGE_MS;
}
export function writeCachedCatalog(cacheFile, catalog) {
    mkdirSync(dirname(cacheFile), { recursive: true });
    writeFileSync(cacheFile, JSON.stringify({
        fetchedAt: new Date().toISOString(),
        catalog,
    }, null, 2));
}
