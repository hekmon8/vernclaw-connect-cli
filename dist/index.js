import { resolveCliConfig } from './config/env.js';
export { resolveCliConfig };
export function mapErrorCodeToExitCode(errorCode) {
    if (!errorCode)
        return 0;
    if (errorCode === 'INVALID_API_KEY')
        return 2;
    if (errorCode === 'INVALID_PARAMS')
        return 3;
    if (errorCode === 'PROVIDER_TIMEOUT' ||
        errorCode === 'PROVIDER_ERROR' ||
        errorCode === 'ALL_PROVIDERS_FAILED') {
        return 4;
    }
    return 1;
}
export function parseArgv(argv) {
    const flags = {};
    const positionals = [];
    for (let index = 0; index < argv.length; index += 1) {
        const part = argv[index];
        if (!part.startsWith('--')) {
            positionals.push(part);
            continue;
        }
        const key = part.slice(2);
        const next = argv[index + 1];
        if (!next || next.startsWith('--')) {
            flags[key] = true;
            continue;
        }
        flags[key] = next;
        index += 1;
    }
    return { flags, positionals };
}
