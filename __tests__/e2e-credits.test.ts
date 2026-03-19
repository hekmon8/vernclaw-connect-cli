import { describe, expect, it, vi } from 'vitest';

import {
  DEFAULT_E2E_TOPUP_CREDITS,
  parseAccountEmailFromStatus,
  topUpCreditsForE2E,
} from './support/e2e-credits.js';

describe('e2e credits helper', () => {
  it('parses the account email from status markdown', () => {
    const email = parseAccountEmailFromStatus(`
# Account Status

## Authentication

- Login Status: Logged in
- Account Email: user@example.com
- API Key: Stored API key
`);

    expect(email).toBe('user@example.com');
  });

  it('tops up credits for the status account before live e2e runs', async () => {
    const fetchImpl = vi.fn().mockResolvedValue(
      new Response(
        `# Account Status

## Authentication

- Login Status: Logged in
- Account Email: user@example.com
- API Key: Stored API key
`,
        {
          status: 200,
          headers: {
            'content-type': 'text/markdown; charset=utf-8',
          },
        }
      )
    );
    const execFileSyncImpl = vi.fn().mockReturnValue(
      JSON.stringify({
        success: true,
        email: 'user@example.com',
        grantedCredits: DEFAULT_E2E_TOPUP_CREDITS,
      })
    );

    const result = await topUpCreditsForE2E({
      apiBaseUrl: 'https://vernclaw.com',
      apiKey: 'vc_test_key',
      fetchImpl,
      execFileSyncImpl,
      cwd: '/repo',
    });

    expect(fetchImpl).toHaveBeenCalledWith(
      'https://vernclaw.com/api/connectors/status',
      expect.objectContaining({
        method: 'GET',
        headers: {
          authorization: 'Bearer vc_test_key',
        },
      })
    );
    expect(execFileSyncImpl).toHaveBeenCalledWith(
      'pnpm',
      [
        'tsx',
        'scripts/grant-credits-d1.ts',
        '--email=user@example.com',
        `--credits=${DEFAULT_E2E_TOPUP_CREDITS}`,
        '--description=cli e2e auto top-up',
        '--database=vernclaw',
      ],
      expect.objectContaining({
        cwd: '/repo',
        encoding: 'utf8',
      })
    );
    expect(result).toMatchObject({
      email: 'user@example.com',
      grantedCredits: DEFAULT_E2E_TOPUP_CREDITS,
    });
  });
});
