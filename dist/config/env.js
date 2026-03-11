import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';
export function getCredentialsFilePath(homeDir = homedir()) {
    return join(homeDir, '.openclaw-connect.json');
}
export function loadStoredCredentials(filePath = getCredentialsFilePath()) {
    if (!existsSync(filePath)) {
        return {};
    }
    return JSON.parse(readFileSync(filePath, 'utf8'));
}
export function saveStoredCredentials(credentials, filePath = getCredentialsFilePath()) {
    writeFileSync(filePath, JSON.stringify(credentials, null, 2));
}
export function resolveCliConfig({ env = process.env, apiKey, apiBaseUrl, homeDir, } = {}) {
    const credentialsFile = getCredentialsFilePath(homeDir);
    const stored = loadStoredCredentials(credentialsFile);
    return {
        apiBaseUrl: apiBaseUrl ||
            env.OPENCLAW_CONNECT_API_BASE_URL ||
            stored.apiBaseUrl ||
            'http://localhost:3000',
        apiKey: apiKey || env.OPENCLAW_CONNECT_API_KEY || stored.apiKey || '',
        credentialsFile,
    };
}
