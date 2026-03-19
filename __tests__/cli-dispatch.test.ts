import process from 'node:process';

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const {
  mockRunBalanceCommand,
  mockRunStatusCommand,
  mockResolveCliConfig,
} = vi.hoisted(() => ({
  mockRunBalanceCommand: vi.fn(),
  mockRunStatusCommand: vi.fn(),
  mockResolveCliConfig: vi.fn(),
}));

vi.mock('../src/commands/balance.js', () => ({
  runBalanceCommand: mockRunBalanceCommand,
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
  const stdoutWrite = vi.spyOn(process.stdout, 'write');
  const stderrWrite = vi.spyOn(process.stderr, 'write');

  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.argv = ['node', 'vernclaw-cli', 'balance'];
    mockResolveCliConfig.mockReturnValue({
      apiBaseUrl: 'https://api.example.com',
      apiKey: 'key_123',
      credentialsFile: '/tmp/.vernclaw-cli.json',
      registryCatalogFile: '/tmp/catalog.json',
    });
    mockRunBalanceCommand.mockResolvedValue({
      markdown: '# Account Balance\n',
      status: 200,
    });
    mockRunStatusCommand.mockResolvedValue({
      markdown: '# Account Status\n',
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
});
