import { existsSync, mkdirSync, mkdtempSync, readFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

import { beforeAll, describe, expect, it } from 'vitest';

import {
  DEFAULT_E2E_TOPUP_CREDITS,
  topUpCreditsForE2E,
} from './support/e2e-credits.js';
import { resolveE2EPolicy } from './support/e2e-policy.js';

const apiKey = process.env.VERNCLAW_E2E_API_KEY;
const apiBaseUrl = process.env.VERNCLAW_E2E_API_BASE_URL || 'https://vernclaw.com';
const e2ePolicy = resolveE2EPolicy({
  apiBaseUrl,
  e2eRunEnv: process.env.VERNCLAW_E2E_RUN,
  expectSuccessEnv: process.env.VERNCLAW_E2E_EXPECT_SUCCESS,
});
const requireSuccess = e2ePolicy.requireSuccess;
const e2eTopUpCredits = (() => {
  const raw = process.env.VERNCLAW_E2E_TOPUP_CREDITS;
  if (!raw) {
    return DEFAULT_E2E_TOPUP_CREDITS;
  }

  const parsed = Number(raw);
  return Number.isFinite(parsed) && parsed > 0
    ? Math.floor(parsed)
    : DEFAULT_E2E_TOPUP_CREDITS;
})();
const e2eTopUpDatabase = process.env.VERNCLAW_E2E_TOPUP_DATABASE || 'vernclaw';
const e2eTopUpRemote = process.env.VERNCLAW_E2E_TOPUP_LOCAL !== '1';
const targetLabel = e2ePolicy.targetLabel;

const describeE2E = e2ePolicy.shouldRunE2E ? describe : describe.skip;

const cliEntry = resolve(process.cwd(), 'packages/vernclaw-connect-cli/dist/cli.js');

interface CliResult {
  args: string[];
  status: number;
  stdout: string;
  stderr: string;
}

function extractErrorCode(stderr: string) {
  return stderr.match(/ERROR_CODE=([A-Z0-9_]+)/)?.[1];
}

function isRetriableProviderFailure(result: CliResult) {
  if (result.status !== 4) {
    return false;
  }

  const errorCode = extractErrorCode(result.stderr);
  return (
    errorCode === 'PROVIDER_TIMEOUT' ||
    errorCode === 'PROVIDER_RATE_LIMITED' ||
    errorCode === 'PROVIDER_TEMPORARILY_UNAVAILABLE'
  );
}

interface ConnectorListRow {
  id: string;
  status: string;
}

const TABLE_CONNECTOR_WIDTH = 28;
const TABLE_CATEGORY_WIDTH = 18;
const TABLE_DESCRIPTION_WIDTH = 36;
const TABLE_COLUMN_GAP = 1;
const STATUS_COLUMN_OFFSET =
  TABLE_CONNECTOR_WIDTH +
  TABLE_COLUMN_GAP +
  TABLE_CATEGORY_WIDTH +
  TABLE_COLUMN_GAP +
  TABLE_DESCRIPTION_WIDTH +
  TABLE_COLUMN_GAP;

function parseConnectorRows(listOutput: string): ConnectorListRow[] {
  const lines = listOutput
    .split('\n')
    .map((line) => line.trimEnd())
    .filter(Boolean);

  if (lines.length <= 1) {
    return [];
  }

  return lines
    .slice(1)
    .map((line) => ({
      id: line.slice(0, TABLE_CONNECTOR_WIDTH).trim(),
      status: line.slice(STATUS_COLUMN_OFFSET).trim().toLowerCase(),
    }))
    .filter((row) => row.id.includes('.'));
}

function invokeFlagsFor(connectorId: string) {
  const preset: Record<string, string[]> = {
    'seo.website-traffic': ['--domain', 'openai.com', '--market', 'us'],
    'seo.domain-authority': ['--domain', 'openai.com'],
    'seo.backlinks': ['--target', 'openai.com', '--limit', '3'],
    'read.x.post': ['--url', 'https://x.com/openai/status/1882525602612259214'],
    'read.x.replies': ['--url', 'https://x.com/openai/status/1882525602612259214'],
    'read.x.article': ['--url', 'https://x.com/OpenAI/article/1893029015563155908'],
    'search.x': ['--query', 'openai launch', '--limit', '3'],
    'search.web': ['--query', 'best ai coding tools 2026', '--limit', '3'],
    'extract.url': ['--url', 'https://example.com'],
    'generate.image': [
      '--prompt',
      'A minimalist office desk with a laptop and coffee',
      '--size',
      '1024x1024',
    ],
  };

  return preset[connectorId] || [];
}

async function runCli(
  args: string[],
  {
    homeDir,
    includeApiKey = true,
    retryOnFetchError = true,
  }: {
    homeDir?: string;
    includeApiKey?: boolean;
    retryOnFetchError?: boolean;
  } = {}
): Promise<CliResult> {
  const env = {
    ...process.env,
    VERNCLAW_CLI_API_BASE_URL: apiBaseUrl,
    ...(includeApiKey && apiKey
      ? {
          VERNCLAW_CLI_API_KEY: apiKey,
        }
      : {}),
    ...(homeDir ? { HOME: homeDir } : {}),
  };

  const exec = () =>
    new Promise<CliResult>((resolveResult) => {
      const child = spawn(process.execPath, [cliEntry, ...args], {
        env,
      });

      let stdout = '';
      let stderr = '';

      const timeout = setTimeout(() => {
        child.kill('SIGKILL');
      }, 90_000);

      child.stdout.on('data', (chunk) => {
        stdout += String(chunk);
      });

      child.stderr.on('data', (chunk) => {
        stderr += String(chunk);
      });

      child.on('error', (error) => {
        clearTimeout(timeout);
        resolveResult({
          args,
          status: -1,
          stdout: stdout.trim(),
          stderr: `${stderr}\n${String(error)}`.trim(),
        });
      });

      child.on('close', (status) => {
        clearTimeout(timeout);
        resolveResult({
          args,
          status: status ?? -1,
          stdout: stdout.trim(),
          stderr: stderr.trim(),
        });
      });
    });

  let raw = await exec();

  const fetchFailed =
    raw.status === 4 && raw.stderr.toLowerCase().includes('fetch failed');

  if (retryOnFetchError && fetchFailed) {
    raw = await exec();
  }

  return raw;
}

describeE2E(`vernclaw-cli ${targetLabel} e2e`, () => {
  let connectorIds: string[] = [];

  beforeAll(() => {
    if (!existsSync(cliEntry)) {
      throw new Error(
        `Missing CLI dist entry: ${cliEntry}. Run pnpm build:cli before e2e.`
      );
    }

    if (!apiKey) {
      throw new Error(
        'Missing VERNCLAW_E2E_API_KEY. Set it before running live e2e.'
      );
    }
  });

  beforeAll(async () => {
    await topUpCreditsForE2E({
      apiBaseUrl,
      apiKey: apiKey || '',
      credits: e2eTopUpCredits,
      database: e2eTopUpDatabase,
      remote: e2eTopUpRemote,
      cwd: process.cwd(),
    });
  }, 120_000);

  it('login/list/describe/status/balance/invoke/job-get/logout flows work', async () => {
    const homeDir = mkdtempSync(join(tmpdir(), 'vernclaw-cli-e2e-'));
    mkdirSync(homeDir, { recursive: true });

    const login = await runCli(
      ['login', '--api-base-url', apiBaseUrl, '--api-key', apiKey || ''],
      {
        homeDir,
        includeApiKey: false,
        retryOnFetchError: false,
      }
    );
    expect(login.status).toBe(0);
    expect(login.stdout).toContain('Login Complete');

    const credentialsPath = join(homeDir, '.vernclaw-cli.json');
    expect(existsSync(credentialsPath)).toBe(true);
    const credentials = JSON.parse(readFileSync(credentialsPath, 'utf8')) as {
      apiBaseUrl?: string;
      apiKey?: string;
    };
    expect(credentials.apiBaseUrl).toBe(apiBaseUrl);
    expect(credentials.apiKey).toBe(apiKey);

    const list = await runCli(['list'], {
      homeDir,
      includeApiKey: false,
    });
    expect(list.status).toBe(0);
    expect(list.stdout).toContain('CONNECTOR');
    const connectorRows = parseConnectorRows(list.stdout);
    connectorIds = (requireSuccess
      ? connectorRows.filter((row) => row.status === 'ready')
      : connectorRows
    ).map((row) => row.id);
    expect(connectorIds.length).toBeGreaterThan(0);

    for (const connectorId of connectorIds) {
      const describeResult = await runCli(['describe', connectorId], {
        homeDir,
        includeApiKey: false,
      });
      expect(describeResult.status).toBe(0);
      expect(describeResult.stdout).toContain(`Connector ID: ${connectorId}`);
    }

    let asyncJobId = '';
    for (const connectorId of connectorIds) {
      const invokeResult = await runCli([
        'invoke',
        connectorId,
        ...invokeFlagsFor(connectorId),
      ], {
        homeDir,
        includeApiKey: false,
      });
      const stabilizedInvokeResult =
        requireSuccess && isRetriableProviderFailure(invokeResult)
          ? await (async () => {
              await new Promise((resolve) => setTimeout(resolve, 2000));
              return runCli(['invoke', connectorId, ...invokeFlagsFor(connectorId)], {
                homeDir,
                includeApiKey: false,
              });
            })()
          : invokeResult;

      if (requireSuccess) {
        expect(
          stabilizedInvokeResult.status,
          `invoke ${connectorId} failed: ${
            stabilizedInvokeResult.stderr || stabilizedInvokeResult.stdout
          }`
        ).toBe(0);
      } else {
        expect([0, 1, 3, 4]).toContain(stabilizedInvokeResult.status);
      }

      if (stabilizedInvokeResult.status === 0 || stabilizedInvokeResult.status === 1) {
        expect(stabilizedInvokeResult.stdout.length).toBeGreaterThan(0);
      } else {
        expect(stabilizedInvokeResult.stderr).toContain('ERROR_CODE=');
      }

      if (connectorId === 'generate.image' && stabilizedInvokeResult.status === 0) {
        const matched =
          stabilizedInvokeResult.stdout.match(
            /(?:Job ID|job_id|JobId)\s*[:：]\s*([a-zA-Z0-9_-]+)/i
          ) ||
          stabilizedInvokeResult.stdout.match(/\b(job_[a-zA-Z0-9_-]+|img_[a-zA-Z0-9_-]+)\b/);
        if (matched) {
          asyncJobId = matched[1];
        }
      }
    }

    const status = await runCli(['status'], {
      homeDir,
      includeApiKey: false,
    });
    if (requireSuccess) {
      expect(status.status).toBe(0);
      expect(status.stdout).toContain('Account Status');
    } else {
      expect([0, 4]).toContain(status.status);
      if (status.status === 0) {
        expect(status.stdout).toContain('Account Status');
      } else {
        expect(status.stderr).toContain('ERROR_CODE=');
      }
    }

    const balance = await runCli(['balance'], {
      homeDir,
      includeApiKey: false,
    });
    if (requireSuccess) {
      expect(balance.status).toBe(0);
      expect(balance.stdout).toContain('Account Status');
    } else {
      expect([0, 4]).toContain(balance.status);
      if (balance.status === 0) {
        expect(balance.stdout).toContain('Account Status');
      } else {
        expect(balance.stderr).toContain('ERROR_CODE=');
      }
    }

    if (requireSuccess) {
      if (asyncJobId) {
        const jobGet = await runCli(['job', 'get', asyncJobId], {
          homeDir,
          includeApiKey: false,
        });
        expect(jobGet.status).toBe(0);
        expect(jobGet.stdout.length).toBeGreaterThan(0);
      }
    } else {
      const jobGet = await runCli([
        'job',
        'get',
        asyncJobId || 'job_nonexistent_for_e2e',
      ], {
        homeDir,
        includeApiKey: false,
      });
      expect([0, 1, 3, 4]).toContain(jobGet.status);
      if (jobGet.status === 0 || jobGet.status === 1) {
        expect(jobGet.stdout.length).toBeGreaterThan(0);
      } else {
        expect(jobGet.stderr).toContain('ERROR_CODE=');
      }
    }

    const logout = await runCli(['logout', '--force'], {
      homeDir,
      includeApiKey: false,
      retryOnFetchError: false,
    });
    expect(logout.status).toBe(0);
    expect(logout.stdout).toContain('Logged Out');
    expect(existsSync(credentialsPath)).toBe(false);

    const statusAfterLogout = await runCli(['status'], {
      homeDir,
      includeApiKey: false,
      retryOnFetchError: false,
    });
    expect(statusAfterLogout.status).toBe(2);
    expect(statusAfterLogout.stderr).toContain('ERROR_CODE=INVALID_API_KEY');
  }, 300_000);
});
