import type { CliConfig } from '../config/env.js';

export interface MarkdownResponse {
  markdown: string;
  errorCode?: string;
  status: number;
}

function buildUrl(baseUrl: string, pathname: string) {
  const normalizedBase = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
  return new URL(pathname.replace(/^\//, ''), normalizedBase).toString();
}

export async function requestMarkdown({
  config,
  pathname,
  method = 'GET',
  body,
}: {
  config: CliConfig;
  pathname: string;
  method?: 'GET' | 'POST';
  body?: Record<string, unknown>;
}): Promise<MarkdownResponse> {
  const response = await fetch(buildUrl(config.apiBaseUrl, pathname), {
    method,
    headers: {
      ...(config.apiKey
        ? {
            Authorization: `Bearer ${config.apiKey}`,
          }
        : {}),
      ...(body
        ? {
            'Content-Type': 'application/json',
          }
        : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  return {
    markdown: await response.text(),
    errorCode: response.headers.get('x-error-code') || undefined,
    status: response.status,
  };
}
