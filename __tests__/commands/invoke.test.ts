import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BUILTIN_BOOTSTRAP_CATALOG } from '../../src/catalog/bootstrap.js';
import { runInvokeCommand } from '../../src/commands/invoke.js';

const { mockRequestApiJson, mockGetEffectiveConnectorById } = vi.hoisted(
  () => ({
    mockRequestApiJson: vi.fn(),
    mockGetEffectiveConnectorById: vi.fn(),
  })
);

vi.mock('../../src/client/http.js', () => ({
  requestApiJson: mockRequestApiJson,
}));

vi.mock('../../src/catalog/service.js', () => ({
  getEffectiveConnectorById: mockGetEffectiveConnectorById,
}));

function getResponseData(result: Awaited<ReturnType<typeof runInvokeCommand>>) {
  return 'data' in result ? result.data : undefined;
}

describe('invoke command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('blocks local invoke when required params are missing from schema', async () => {
    mockGetEffectiveConnectorById.mockResolvedValue({
      id: 'search.x',
      name: 'X Search',
      compatibilityState: 'supported',
      manifest: {
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query to run on X.',
            },
            limit: {
              type: 'number',
              description: 'Optional number of posts to return.',
            },
          },
          required: ['query'],
        },
        outputContract: {
          mode: 'sync_result',
          resultFormat: 'json',
          structuredPayload: 'optional',
        },
      },
    });

    const result = await runInvokeCommand(
      {
        apiBaseUrl: 'https://api.example.com',
        apiKey: 'key_123',
        credentialsFile: '/tmp/cred.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      'search.x',
      {}
    );

    expect(result.errorCode).toBe('INVALID_PARAMS');
    expect(getResponseData(result)).toMatchObject({
      message: 'Missing required parameter: `query`.',
    });
    expect(mockRequestApiJson).not.toHaveBeenCalled();
  });

  it('normalizes schema-typed flags before sending invoke requests', async () => {
    mockGetEffectiveConnectorById.mockResolvedValue({
      id: 'search.x',
      name: 'X Search',
      compatibilityState: 'supported',
      manifest: {
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query to run on X.',
            },
            limit: {
              type: 'number',
              description: 'Optional number of posts to return.',
            },
          },
          required: ['query'],
        },
        outputContract: {
          mode: 'sync_result',
          resultFormat: 'json',
          structuredPayload: 'optional',
        },
      },
    });
    mockRequestApiJson.mockResolvedValue({
      data: { summary: 'ok' },
      status: 200,
    });

    const result = await runInvokeCommand(
      {
        apiBaseUrl: 'https://api.example.com',
        apiKey: 'key_123',
        credentialsFile: '/tmp/cred.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      'search.x',
      {
        query: 'best ai tools',
        limit: '10',
      }
    );

    expect(result.status).toBe(200);
    expect(mockRequestApiJson).toHaveBeenCalledWith({
      config: {
        apiBaseUrl: 'https://api.example.com',
        apiKey: 'key_123',
        credentialsFile: '/tmp/cred.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      pathname: '/api/connectors/search.x/invoke',
      method: 'POST',
      body: {
        query: 'best ai tools',
        limit: 10,
      },
    });
  });

  it('normalizes Google Trends exploration flags before sending invoke requests', async () => {
    mockGetEffectiveConnectorById.mockResolvedValue({
      id: 'seo.google-trends',
      name: 'Google Trends Get',
      compatibilityState: 'supported',
      manifest: {
        inputSchema: {
          type: 'object',
          properties: {
            keywords: {
              type: 'string',
              description: 'Seed keyword list.',
            },
            'category-code': {
              type: 'number',
              description: 'Google Trends category code.',
            },
            'item-types': {
              type: 'array',
              description: 'Google Trends item types.',
            },
          },
          required: ['keywords'],
        },
      },
    });
    mockRequestApiJson.mockResolvedValue({
      data: { summary: 'ok' },
      status: 200,
    });

    const result = await runInvokeCommand(
      {
        apiBaseUrl: 'https://api.example.com',
        apiKey: 'key_123',
        credentialsFile: '/tmp/cred.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      'seo.google-trends',
      {
        keywords: 'translator',
        'category-code': '0',
        'item-types': 'google_trends_queries_list,google_trends_topics_list',
      }
    );

    expect(result.status).toBe(200);
    expect(mockRequestApiJson).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          keywords: 'translator',
          'category-code': 0,
          'item-types': [
            'google_trends_queries_list',
            'google_trends_topics_list',
          ],
        },
      })
    );
  });

  it('blocks local invoke when a typed flag cannot be coerced', async () => {
    mockGetEffectiveConnectorById.mockResolvedValue({
      id: 'search.x',
      name: 'X Search',
      compatibilityState: 'supported',
      manifest: {
        inputSchema: {
          type: 'object',
          properties: {
            query: {
              type: 'string',
              description: 'Search query to run on X.',
            },
            limit: {
              type: 'number',
              description: 'Optional number of posts to return.',
            },
          },
          required: ['query'],
        },
        outputContract: {
          mode: 'sync_result',
          resultFormat: 'json',
          structuredPayload: 'optional',
        },
      },
    });

    const result = await runInvokeCommand(
      {
        apiBaseUrl: 'https://api.example.com',
        apiKey: 'key_123',
        credentialsFile: '/tmp/cred.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      'search.x',
      {
        query: 'best ai tools',
        limit: 'ten',
      }
    );

    expect(result.errorCode).toBe('INVALID_PARAMS');
    expect(getResponseData(result)).toMatchObject({
      message: 'Parameter `limit` must be a valid number.',
    });
    expect(mockRequestApiJson).not.toHaveBeenCalled();
  });

  it('blocks local invoke when connector requires a CLI upgrade', async () => {
    mockGetEffectiveConnectorById.mockResolvedValue({
      id: 'agent_browser_v2',
      name: 'Agent Browser V2',
      compatibilityState: 'visible_upgrade_required',
      compatibilityReasons: [
        {
          code: 'CLI_UPGRADE_REQUIRED',
          message: 'Requires vernclaw-cli >= 0.2.0',
        },
      ],
    });

    const result = await runInvokeCommand(
      {
        apiBaseUrl: 'https://api.example.com',
        apiKey: 'key_123',
        credentialsFile: '/tmp/cred.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      'agent_browser_v2',
      {}
    );

    expect(result.errorCode).toBe('CLI_UPGRADE_REQUIRED');
    expect(getResponseData(result)).toMatchObject({
      message: 'Requires vernclaw-cli >= 0.2.0',
    });
    expect(mockRequestApiJson).not.toHaveBeenCalled();
  });
});

describe('Google Trends date precedence through the real offline schema', () => {
  const config = {
    apiBaseUrl: 'https://api.example.com',
    apiKey: 'fixture-key',
    credentialsFile: '/tmp/cred.json',
    registryCatalogFile: '/tmp/catalog.json',
  };
  beforeEach(() => {
    vi.clearAllMocks();
    const manifest = BUILTIN_BOOTSTRAP_CATALOG.connectors.find(
      (entry) => entry.manifest.id === 'seo.google-trends'
    )?.manifest;
    mockGetEffectiveConnectorById.mockResolvedValue({
      id: 'seo.google-trends',
      compatibilityState: 'supported',
      manifest,
    });
    mockRequestApiJson.mockResolvedValue({ status: 200, data: {} });
  });

  it.each(['date-from', 'date-to', 'date_from', 'date_to'])(
    'allows %s to override an ignored preset before enum validation',
    async (field) => {
      const result = await runInvokeCommand(config, 'seo.google-trends', {
        keywords: 'translator',
        [field]: '2026-05-01',
        'time-range': 'ignored-invalid-range',
      });
      expect(result.status).toBe(200);
      expect(mockRequestApiJson).toHaveBeenCalledWith(
        expect.objectContaining({
          body: { keywords: 'translator', [field]: '2026-05-01' },
        })
      );
    }
  );

  it('retains enum validation when a custom date is blank', async () => {
    const result = await runInvokeCommand(config, 'seo.google-trends', {
      keywords: 'translator',
      'date-from': ' ',
      'time-range': 'invalid',
    });
    expect(result.status).toBe(400);
    expect(mockRequestApiJson).not.toHaveBeenCalled();
  });

  it.each([
    ['date-from', 'date_from', ''],
    ['date-from', 'date_from', ' '],
    ['date-to', 'date_to', ''],
    ['date-to', 'date_to', ' '],
  ])(
    'retains the preset when blank %s shadows populated %s',
    async (primary, alias, blank) => {
      const input = {
        keywords: 'translator',
        [primary]: blank,
        [alias]: '2026-05-01',
        'time-range': 'past_7_days',
      };
      const result = await runInvokeCommand(config, 'seo.google-trends', input);
      expect(result.status).toBe(200);
      expect(mockRequestApiJson).toHaveBeenCalledWith(
        expect.objectContaining({ body: input })
      );
    }
  );

  it('rejects an invalid preset when both resolved dates are blank', async () => {
    const result = await runInvokeCommand(config, 'seo.google-trends', {
      keywords: 'translator',
      'date-from': ' ',
      date_from: '2026-05-01',
      'date-to': '',
      date_to: '2026-05-02',
      'time-range': 'invalid',
    });
    expect(result.status).toBe(400);
    expect(mockRequestApiJson).not.toHaveBeenCalled();
  });

  it('passes all existing explore controls with typed item lists and category zero', async () => {
    const result = await runInvokeCommand(config, 'seo.google-trends', {
      keywords: 'translator',
      market: 'us',
      language: 'english',
      'time-range': 'past_7_days',
      type: 'web',
      'category-code': '0',
      'item-types': 'google_trends_queries_list,google_trends_topics_list',
    });
    expect(result.status).toBe(200);
    expect(mockRequestApiJson).toHaveBeenCalledWith(
      expect.objectContaining({
        body: {
          keywords: 'translator',
          market: 'us',
          language: 'english',
          'time-range': 'past_7_days',
          type: 'web',
          'category-code': 0,
          'item-types': [
            'google_trends_queries_list',
            'google_trends_topics_list',
          ],
        },
      })
    );
  });
});
