import type { CliConfig } from '../config/env.js';
export declare function runListCommand(config: CliConfig, flags?: Record<string, string | boolean>): Promise<{
    markdown: string;
    status: number;
}>;
