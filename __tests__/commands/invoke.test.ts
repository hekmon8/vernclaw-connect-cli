import { describe, expect, it, vi, beforeEach } from 'vitest';

import { runInvokeCommand } from '../../src/commands/invoke.js';

const {
  mockRequestMarkdown,
  mockGetEffectiveConnectorById,
} = vi.hoisted(() => ({
  mockRequestMarkdown: vi.fn(),
  mockGetEffectiveConnectorById: vi.fn(),
}));

vi.mock('../../src/client/http.js', () => ({
  requestMarkdown: mockRequestMarkdown,
}));

vi.mock('../../src/catalog/service.js', () => ({
  getEffectiveConnectorById: mockGetEffectiveConnectorById,
}));

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
    expect(result.markdown).toContain('Missing required parameter: `query`');
    expect(mockRequestMarkdown).not.toHaveBeenCalled();
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
      },
    });
    mockRequestMarkdown.mockResolvedValue({
      markdown: '# ok\n',
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
    expect(mockRequestMarkdown).toHaveBeenCalledWith({
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
    expect(result.markdown).toContain(
      'Parameter `limit` must be a valid number.'
    );
    expect(mockRequestMarkdown).not.toHaveBeenCalled();
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
    expect(result.markdown).toContain('0.2.0');
    expect(mockRequestMarkdown).not.toHaveBeenCalled();
  });
});
