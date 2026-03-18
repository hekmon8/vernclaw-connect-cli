import { beforeEach, describe, expect, it, vi } from 'vitest';

import { runStatusCommand } from '../../src/commands/status.js';

const { mockRequestMarkdown } = vi.hoisted(() => ({
  mockRequestMarkdown: vi.fn(),
}));

vi.mock('../../src/client/http.js', () => ({
  requestMarkdown: mockRequestMarkdown,
}));

describe('status command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('requests connector account status markdown', async () => {
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

    const result = await runStatusCommand(config);

    expect(result.status).toBe(200);
    expect(mockRequestMarkdown).toHaveBeenCalledWith({
      config,
      pathname: '/api/connectors/status',
    });
  });
});
