export interface CliConfig {
    apiBaseUrl: string;
    apiKey: string;
    credentialsFile: string;
    registryCatalogFile: string;
    registryCacheFile?: string;
    cliVersion?: string;
}
export interface StoredCredentials {
    apiBaseUrl?: string;
    apiKey?: string;
}
export declare function getCredentialsFilePath(homeDir?: string): string;
export declare function getRegistryCacheFilePath(homeDir?: string): string;
export declare function loadStoredCredentials(filePath?: string): StoredCredentials;
export declare function saveStoredCredentials(credentials: StoredCredentials, filePath?: string): void;
export declare function deleteStoredCredentials(filePath?: string): boolean;
export declare function resolveCliConfig({ env, apiKey, apiBaseUrl, homeDir, }?: {
    env?: Partial<NodeJS.ProcessEnv>;
    apiKey?: string;
    apiBaseUrl?: string;
    homeDir?: string;
}): CliConfig;
