import type { CliConfig } from '../config/env.js';
export declare function runLogoutCommand(config: CliConfig, { force }?: {
    force?: boolean;
}): Promise<{
    markdown: string;
    status: number;
}>;
