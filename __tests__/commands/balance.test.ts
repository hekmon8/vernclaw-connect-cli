import { beforeEach, describe, expect, it, vi } from 'vitest';

import { runBalanceCommand } from '../../src/commands/balance.js';

const { mockRequestMarkdown } = vi.hoisted(() => ({
  mockRequestMarkdown: vi.fn(),
}));

vi.mock('../../src/client/http.js', () => ({
  requestMarkdown: mockRequestMarkdown,
}));

describe('balance command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests connector balance markdown from the balance endpoint', async () => {
    mockRequestMarkdown.mockResolvedValue({
      markdown: '# Account Status',
      status: 200,
    });

    const config = {
      apiBaseUrl: 'https://api.example.com',
      apiKey: 'key_123',
      credentialsFile: '/tmp/.vernclaw-cli.json',
      registryCatalogFile: '/tmp/catalog.json',
    };

    const result = await runBalanceCommand(config);

    expect(result.status).toBe(200);
    expect(mockRequestMarkdown).toHaveBeenCalledWith({
      config,
      pathname: '/api/connectors/balance',
    });
  });
});
