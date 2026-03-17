import type { CliConfig } from '../config/env.js';
export interface MarkdownResponse {
    markdown: string;
    errorCode?: string;
    status: number;
}
export declare function requestMarkdown({ config, pathname, method, body, }: {
    config: CliConfig;
    pathname: string;
    method?: 'GET' | 'POST';
    body?: Record<string, unknown>;
}): Promise<MarkdownResponse>;
export declare function requestJson<T>({ config, pathname, method, body, }: {
    config: CliConfig;
    pathname: string;
    method?: 'GET' | 'POST';
    body?: Record<string, unknown>;
}): Promise<{
    status: number;
    data: T;
}>;
