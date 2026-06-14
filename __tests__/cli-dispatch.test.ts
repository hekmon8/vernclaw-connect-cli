import process from 'node:process';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockRunBalanceCommand,
  mockRunInvokeCommand,
  mockRunListCommand,
  mockRunStatusCommand,
  mockResolveCliConfig,
} = vi.hoisted(() => ({
  mockRunBalanceCommand: vi.fn(),
  mockRunInvokeCommand: vi.fn(),
  mockRunListCommand: vi.fn(),
  mockRunStatusCommand: vi.fn(),
  mockResolveCliConfig: vi.fn(),
}));

vi.mock('../src/commands/balance.js', () => ({
  runBalanceCommand: mockRunBalanceCommand,
}));

vi.mock('../src/commands/invoke.js', () => ({
  runInvokeCommand: mockRunInvokeCommand,
}));

vi.mock('../src/commands/list.js', () => ({
  runListCommand: mockRunListCommand,
}));

vi.mock('../src/commands/status.js', () => ({
  runStatusCommand: mockRunStatusCommand,
}));

vi.mock('../src/config/env.js', async () => {
  const actual = await vi.importActual('../src/config/env.js');
  return {
    ...actual,
    resolveCliConfig: mockResolveCliConfig,
  };
});

describe('cli dispatch', () => {
  const originalArgv = process.argv.slice();
  let stdoutWrite: ReturnType<typeof vi.spyOn>;
  let stderrWrite: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.argv = ['node', 'vernclaw-cli', 'balance'];
    stdoutWrite = vi.spyOn(process.stdout, 'write');
    stderrWrite = vi.spyOn(process.stderr, 'write');
    mockResolveCliConfig.mockReturnValue({
      apiBaseUrl: 'https://api.example.com',
      apiKey: 'key_123',
      credentialsFile: '/tmp/.vernclaw-cli.json',
      registryCatalogFile: '/tmp/catalog.json',
    });
    mockRunBalanceCommand.mockResolvedValue({
      data: {
        command: 'balance',
        account: {
          credits_remaining: 245,
        },
      },
      status: 200,
    });
    mockRunInvokeCommand.mockResolvedValue({
      data: {
        message: 'Missing required parameter: `query`.',
      },
      status: 400,
      errorCode: 'INVALID_PARAMS',
    });
    mockRunListCommand.mockResolvedValue({
      data: {
        command: 'list',
        count: 1,
        connectors: [
          {
            id: 'seo.website-traffic',
            category: 'seo',
            description: 'Estimate website traffic.',
            status: 'ready',
          },
        ],
        hints: [
          'Run `vernclaw-cli describe <connector>` to inspect flags and example commands.',
        ],
      },
      status: 200,
    });
    mockRunStatusCommand.mockResolvedValue({
      data: {
        command: 'status',
        account: {
          credits_remaining: 245,
        },
      },
      status: 200,
    });
    stdoutWrite.mockImplementation(() => true);
    stderrWrite.mockImplementation(() => true);
  });

  afterEach(() => {
    process.argv = originalArgv.slice();
    stdoutWrite.mockRestore();
    stderrWrite.mockRestore();
  });

  it('routes the balance command to runBalanceCommand', async () => {
    await import('../src/cli.js');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockRunBalanceCommand).toHaveBeenCalledTimes(1);
    expect(mockRunStatusCommand).not.toHaveBeenCalled();
  });

  it('prints JSON by default', async () => {
    await import('../src/cli.js');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(stdoutWrite).toHaveBeenCalledWith(
      '{"status":200,"data":{"command":"balance","account":{"credits_remaining":245}}}\n'
    );
  });

  it('pretty-prints structured data when --pretty is set', async () => {
    process.argv = ['node', 'vernclaw-cli', 'balance', '--pretty'];

    await import('../src/cli.js');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(stdoutWrite).toHaveBeenCalledWith(
      '# Account Balance\n\n- Credits Remaining: 245\n'
    );
  });

  it('prints a connector table for list by default', async () => {
    process.argv = ['node', 'vernclaw-cli', 'list'];

    await import('../src/cli.js');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(mockRunListCommand).toHaveBeenCalledTimes(1);
    expect(stdoutWrite).toHaveBeenCalledWith(
      expect.stringContaining('CONNECTOR')
    );
    expect(stdoutWrite).toHaveBeenCalledWith(
      expect.stringContaining('seo.website-traffic')
    );
  });

  it('prints JSON for list when --json is set', async () => {
    process.argv = ['node', 'vernclaw-cli', 'list', '--json'];

    await import('../src/cli.js');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(stdoutWrite).toHaveBeenCalledWith(
      '{"status":200,"data":{"command":"list","count":1,"connectors":[{"id":"seo.website-traffic","category":"seo","description":"Estimate website traffic.","status":"ready"}],"hints":["Run `vernclaw-cli describe <connector>` to inspect flags and example commands."]}}\n'
    );
  });

  it('prints local invoke parameter errors as compact JSON by default', async () => {
    process.argv = ['node', 'vernclaw-cli', 'invoke', 'search.x'];

    await import('../src/cli.js');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(stdoutWrite).toHaveBeenCalledWith(
      '{"status":400,"data":{"message":"Missing required parameter: `query`."},"errorCode":"INVALID_PARAMS"}\n'
    );
    expect(stderrWrite).toHaveBeenCalledWith('ERROR_CODE=INVALID_PARAMS\n');
  });
});
