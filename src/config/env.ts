import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { homedir } from 'node:os';

export interface CliConfig {
  apiBaseUrl: string;
  apiKey: string;
  credentialsFile: string;
}

export interface StoredCredentials {
  apiBaseUrl?: string;
  apiKey?: string;
}

export function getCredentialsFilePath(homeDir = homedir()) {
  return join(homeDir, '.vernclaw-cli.json');
}

export function loadStoredCredentials(
  filePath = getCredentialsFilePath()
): StoredCredentials {
  if (!existsSync(filePath)) {
    return {};
  }

  return JSON.parse(readFileSync(filePath, 'utf8'));
}

export function saveStoredCredentials(
  credentials: StoredCredentials,
  filePath = getCredentialsFilePath()
) {
  writeFileSync(filePath, JSON.stringify(credentials, null, 2));
}

export function resolveCliConfig({
  env = process.env,
  apiKey,
  apiBaseUrl,
  homeDir,
}: {
  env?: Partial<NodeJS.ProcessEnv>;
  apiKey?: string;
  apiBaseUrl?: string;
  homeDir?: string;
} = {}): CliConfig {
  const credentialsFile = getCredentialsFilePath(homeDir);
  const stored = loadStoredCredentials(credentialsFile);

  return {
    apiBaseUrl:
      apiBaseUrl ||
      env.VERNCLAW_CLI_API_BASE_URL ||
      stored.apiBaseUrl ||
      'http://localhost:3000',
    apiKey: apiKey || env.VERNCLAW_CLI_API_KEY || stored.apiKey || '',
    credentialsFile,
  };
}
