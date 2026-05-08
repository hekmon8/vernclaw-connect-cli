import { execFileSync } from 'node:child_process';

export const DEFAULT_E2E_TOPUP_CREDITS = 100;

type FetchLike = typeof fetch;
type ExecFileSyncLike = typeof execFileSync;

type TopUpCreditsOptions = {
  apiBaseUrl: string;
  apiKey: string;
  credits?: number;
  description?: string;
  database?: string;
  remote?: boolean;
  cwd?: string;
  fetchImpl?: FetchLike;
  execFileSyncImpl?: ExecFileSyncLike;
};

type TopUpCreditsResult = {
  email: string;
  grantedCredits: number;
  raw: unknown;
};

export function parseAccountEmailFromStatus(payload: string) {
  try {
    const parsed = JSON.parse(payload) as {
      data?: {
        account?: {
          account_email?: string;
        };
      };
    };
    const email = parsed.data?.account?.account_email;
    if (email && email !== 'Unavailable') {
      return email;
    }
  } catch {
    // Older deployments returned markdown for this endpoint.
  }

  const match = payload.match(/^- Account Email:\s*(.+)$/m);
  const email = match?.[1]?.trim();

  if (!email || email === 'Unavailable') {
    return null;
  }

  return email;
}

export async function topUpCreditsForE2E({
  apiBaseUrl,
  apiKey,
  credits = DEFAULT_E2E_TOPUP_CREDITS,
  description = 'cli e2e auto top-up',
  database = 'vernclaw',
  remote = true,
  cwd = process.cwd(),
  fetchImpl = fetch,
  execFileSyncImpl = execFileSync,
}: TopUpCreditsOptions): Promise<TopUpCreditsResult> {
  const statusResponse = await fetchImpl(
    new URL('/api/connectors/status', apiBaseUrl).toString(),
    {
      method: 'GET',
      headers: {
        authorization: `Bearer ${apiKey}`,
      },
    }
  );
  const statusPayload = await statusResponse.text();

  if (!statusResponse.ok) {
    const errorCode = statusResponse.headers.get('x-error-code');
    throw new Error(
      `Unable to fetch account status before e2e top-up${errorCode ? ` (${errorCode})` : ''}.`
    );
  }

  const email = parseAccountEmailFromStatus(statusPayload);
  if (!email) {
    throw new Error(
      'Unable to parse account email from connector status response.'
    );
  }

  const args = [
    'tsx',
    'scripts/grant-credits-d1.ts',
    `--email=${email}`,
    `--credits=${credits}`,
    `--description=${description}`,
    `--database=${database}`,
  ];

  if (!remote) {
    args.push('--local');
  }

  const raw = execFileSyncImpl('pnpm', args, {
    cwd,
    encoding: 'utf8',
  });

  return {
    email,
    grantedCredits: credits,
    raw: raw ? JSON.parse(raw) : null,
  };
}
