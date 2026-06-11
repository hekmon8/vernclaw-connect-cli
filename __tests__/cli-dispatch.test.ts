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
        connector_id: 'search.x',
        connector_name: 'X Search',
        error_code: 'INVALID_PARAMS',
        message: 'Missing required parameter: `query`.',
        next_command: 'vernclaw-cli describe search.x',
        describe: {
          connector_id: 'search.x',
          name: 'X Search',
          category: 'search',
          description: 'Search posts on X.',
          version: '1.0.0',
          min_cli_version: '0.1.0',
          compatibility: 'supported',
          status: 'ready',
          can_run_now: true,
          next_step:
            'Run `vernclaw-cli invoke search.x --query "best ai tools"`.',
          cli_usage: {
            describe: 'vernclaw-cli describe search.x',
            invoke: 'vernclaw-cli invoke search.x --query "best ai tools"',
          },
          cli_flags: [
            {
              name: '--query',
              key: 'query',
              required: true,
              type: 'string',
              description: 'Search query to run on X.',
            },
          ],
          output_contract: {
            mode: 'sync_result',
            result_format: 'json',
            structured_payload: 'optional',
          },
        },
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

  it('prints local invoke parameter errors as markdown by default', async () => {
    process.argv = ['node', 'vernclaw-cli', 'invoke', 'search.x'];

    await import('../src/cli.js');
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(stdoutWrite).toHaveBeenCalledWith(
      expect.stringContaining('# Parameter Error')
    );
    expect(stdoutWrite).toHaveBeenCalledWith(
      expect.stringContaining('Missing required parameter: `query`.')
    );
    expect(stdoutWrite).toHaveBeenCalledWith(
      expect.stringContaining('# X Search')
    );
    expect(stdoutWrite).toHaveBeenCalledWith(
      expect.not.stringContaining('"status":400')
    );
    expect(stdoutWrite).toHaveBeenCalledWith(
      expect.not.stringContaining('next_command')
    );
    expect(stdoutWrite).toHaveBeenCalledWith(
      expect.not.stringContaining('Error Code')
    );
    expect(stderrWrite).not.toHaveBeenCalledWith('ERROR_CODE=INVALID_PARAMS\n');
  });
});
