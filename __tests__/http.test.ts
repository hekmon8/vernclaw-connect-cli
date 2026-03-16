import { afterEach, describe, expect, it, vi } from 'vitest';

import { requestMarkdown } from '../src/client/http.js';

const config = {
  apiBaseUrl: 'https://api.example.com',
  apiKey: 'sk-test',
};

describe('requestMarkdown', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('infers PROVIDER_ERROR when server returns 500 without x-error-code', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('', {
        status: 500,
        headers: {
          'content-type': 'text/plain',
        },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await requestMarkdown({
      config,
      pathname: '/api/connectors/search.web/invoke',
      method: 'POST',
      body: {
        query: 'test',
      },
    });

    expect(response.status).toBe(500);
    expect(response.errorCode).toBe('PROVIDER_ERROR');
  });

  it('keeps header error code when x-error-code is provided', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      new Response('# failed', {
        status: 502,
        headers: {
          'content-type': 'text/markdown',
          'x-error-code': 'PROVIDER_TIMEOUT',
        },
      })
    );
    vi.stubGlobal('fetch', fetchMock);

    const response = await requestMarkdown({
      config,
      pathname: '/api/connectors/search.web/invoke',
    });

    expect(response.status).toBe(502);
    expect(response.errorCode).toBe('PROVIDER_TIMEOUT');
  });
});
