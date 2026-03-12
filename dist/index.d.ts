import { resolveCliConfig } from './config/env.js';
export { resolveCliConfig };
export declare function mapErrorCodeToExitCode(errorCode?: string): 2 | 0 | 1 | 3 | 4;
export declare function parseArgv(argv: string[]): {
    flags: Record<string, string | boolean>;
    positionals: string[];
};
