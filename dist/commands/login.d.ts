import type { CliConfig } from '../config/env.js';
export declare function runLoginCommand(config: CliConfig, { apiKey, apiBaseUrl, }?: {
    apiKey?: string;
    apiBaseUrl?: string;
}): Promise<{
    markdown: string;
    status: number;
}>;
