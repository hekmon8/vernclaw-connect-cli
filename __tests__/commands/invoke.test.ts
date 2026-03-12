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
