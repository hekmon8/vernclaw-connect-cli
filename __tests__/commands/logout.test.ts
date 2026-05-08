import { beforeEach, describe, expect, it, vi } from 'vitest';

import { runLogoutCommand } from '../../src/commands/logout.js';

const { mockDeleteStoredCredentials } = vi.hoisted(() => ({
  mockDeleteStoredCredentials: vi.fn(),
}));

vi.mock('../../src/config/env.js', async () => {
  const actual = await vi.importActual('../../src/config/env.js');
  return {
    ...actual,
    deleteStoredCredentials: mockDeleteStoredCredentials,
  };
});

describe('logout command', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('removes stored credentials immediately in force mode', async () => {
    mockDeleteStoredCredentials.mockReturnValue(true);

    const result = await runLogoutCommand(
      {
        apiBaseUrl: 'https://api.example.com',
        apiKey: 'key_123',
        credentialsFile: '/tmp/.vernclaw-cli.json',
        registryCatalogFile: '/tmp/catalog.json',
      },
      { force: true }
    );

    expect(result.status).toBe(200);
    expect(result.data).toEqual({
      command: 'logout',
      status: 'logged_out',
      message: 'Stored credentials removed.',
    });
    expect(mockDeleteStoredCredentials).toHaveBeenCalledWith(
      '/tmp/.vernclaw-cli.json'
    );
  });
});
