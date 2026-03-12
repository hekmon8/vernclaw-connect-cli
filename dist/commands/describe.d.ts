import type { CliConfig } from '../config/env.js';
export declare function runDescribeCommand(config: CliConfig, connectorId: string): Promise<{
    markdown: string;
    status: number;
    errorCode: string;
} | {
    markdown: string;
    status: number;
    errorCode?: undefined;
}>;
