import type { CliConfig } from '../config/env.js';
export declare function buildInvokePayload(flags: Record<string, string | boolean>): any;
export declare function runInvokeCommand(config: CliConfig, connectorId: string, flags: Record<string, string | boolean>): Promise<import("../client/http.js").MarkdownResponse>;
