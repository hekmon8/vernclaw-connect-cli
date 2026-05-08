import { beforeEach, describe, expect, it, vi } from 'vitest';

import { runStatusCommand } from '../../src/commands/status.js';

const { mockRequestApiJson } = vi.hoisted(() => ({
  mockRequestApiJson: vi.fn(),
}));

vi.mock('../../src/client/http.js', () => ({
  requestApiJson: mockRequestApiJson,
}));

describe('status command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests connector account status and returns structured data', async () => {
    mockRequestApiJson.mockResolvedValue({
      data: {
        command: 'status',
        account: {
          login_status: 'Logged in',
          account_email: 'user@example.com',
          credits_remaining: 245,
        },
      },
      status: 200,
    });

    const config = {
      apiBaseUrl: 'https://api.example.com',
      apiKey: 'key_123',
      credentialsFile: '/tmp/.vernclaw-cli.json',
      registryCatalogFile: '/tmp/catalog.json',
    };

    const result = await runStatusCommand(config);

    expect(result.status).toBe(200);
    expect(result.data).toEqual({
      command: 'status',
      account: {
        login_status: 'Logged in',
        account_email: 'user@example.com',
        credits_remaining: 245,
      },
    });
    expect(mockRequestApiJson).toHaveBeenCalledWith({
      config,
      pathname: '/api/connectors/status',
    });
  });
});
