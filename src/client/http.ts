import type { CliConfig } from '../config/env.js';

export interface MarkdownResponse {
  markdown: string;
  errorCode?: string;
  status: number;
}

export interface ApiJsonResponse {
  data: unknown;
  errorCode?: string;
  status: number;
}

interface JsonEnvelope<T> {
  code: number;
  message: string;
  data: T;
}

function inferErrorCode(status: number, headerErrorCode?: string | null) {
  if (headerErrorCode) {
    return headerErrorCode;
  }

  if (status >= 500) {
    return 'PROVIDER_ERROR';
  }

  if (status === 401 || status === 403) {
    return 'INVALID_API_KEY';
  }

  if (status >= 400) {
    return 'INVALID_PARAMS';
  }

  return undefined;
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

  const headerErrorCode = response.headers.get('x-error-code');

  return {
    markdown: await response.text(),
    errorCode: inferErrorCode(response.status, headerErrorCode),
    status: response.status,
  };
}

export async function requestApiJson({
  config,
  pathname,
  method = 'GET',
  body,
}: {
  config: CliConfig;
  pathname: string;
  method?: 'GET' | 'POST';
  body?: Record<string, unknown>;
}): Promise<ApiJsonResponse> {
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

  const headerErrorCode = response.headers.get('x-error-code');
  const contentType = response.headers.get('content-type') || '';
  const data = contentType.includes('application/json')
    ? await response.json()
    : { text: await response.text() };

  return {
    data,
    errorCode: inferErrorCode(response.status, headerErrorCode),
    status: response.status,
  };
}

export async function requestJson<T>({
  config,
  pathname,
  method = 'GET',
  body,
}: {
  config: CliConfig;
  pathname: string;
  method?: 'GET' | 'POST';
  body?: Record<string, unknown>;
}) {
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
  const payload = (await response.json()) as JsonEnvelope<T> | T;

  if (!response.ok) {
    const message =
      payload && typeof payload === 'object' && 'message' in payload
        ? String(payload.message)
        : `request failed with status ${response.status}`;
    throw new Error(message);
  }

  if (payload && typeof payload === 'object' && 'code' in payload) {
    if (payload.code !== 0) {
      throw new Error(
        payload.message || `request failed with status ${response.status}`
      );
    }

    return {
      status: response.status,
      data: payload.data,
    };
  }

  return {
    status: response.status,
    data: payload as T,
  };
}
