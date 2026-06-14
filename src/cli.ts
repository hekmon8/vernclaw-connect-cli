#!/usr/bin/env node
import process from 'node:process';

import { runBalanceCommand } from './commands/balance.js';
import { runDescribeCommand } from './commands/describe.js';
import { runInvokeCommand } from './commands/invoke.js';
import { runJobGetCommand } from './commands/job-get.js';
import { runListCommand } from './commands/list.js';
import { runLoginCommand } from './commands/login.js';
import { runLogoutCommand } from './commands/logout.js';
import { runStatusCommand } from './commands/status.js';
import { resolveCliConfig } from './config/env.js';
import { buildHelpText } from './help.js';
import {
  formatJsonForTerminal,
  formatResponseForTerminal,
  mapErrorCodeToExitCode,
  parseArgv,
  shouldEmitMachineErrorCode,
} from './index.js';
import { CLI_VERSION } from './version.js';

function printHelp() {
  process.stdout.write(buildHelpText(CLI_VERSION));
}

async function main() {
  const { positionals, flags } = parseArgv(process.argv.slice(2));
  const command = positionals[0];
  const subcommand = positionals[1];
  const pretty = flags.pretty === true;
  const json = flags.json === true;

  if (!command || flags['help'] === true) {
    printHelp();
    return 0;
  }

  delete flags.pretty;
  delete flags.json;

  const config = resolveCliConfig({
    apiKey:
      typeof flags['api-key'] === 'string'
        ? String(flags['api-key'])
        : undefined,
    apiBaseUrl:
      typeof flags['api-base-url'] === 'string'
        ? String(flags['api-base-url'])
        : undefined,
  });

  let response:
    | {
        markdown?: string;
        data?: unknown;
        status: number;
        errorCode?: string;
      }
    | undefined;

  if (command === 'login') {
    response = await runLoginCommand(config, {
      apiKey:
        typeof flags['api-key'] === 'string'
          ? String(flags['api-key'])
          : undefined,
      apiBaseUrl:
        typeof flags['api-base-url'] === 'string'
          ? String(flags['api-base-url'])
          : undefined,
    });
  } else if (command === 'logout') {
    response = await runLogoutCommand(config, {
      force: flags['force'] === true,
    });
  } else if (command === 'list') {
    response = await runListCommand(config, flags);
  } else if (command === 'describe') {
    response = await runDescribeCommand(config, positionals[1] || '');
  } else if (command === 'invoke') {
    response = await runInvokeCommand(config, positionals[1] || '', flags);
  } else if (command === 'job' && subcommand === 'get') {
    response = await runJobGetCommand(config, positionals[2] || '');
  } else if (command === 'status') {
    response = await runStatusCommand(config);
  } else if (command === 'balance') {
    response = await runBalanceCommand(config);
  } else {
    process.stderr.write(`Unknown command: ${command}\n\n`);
    printHelp();
    return 3;
  }

  const shouldPrintMarkdown = pretty || (command === 'list' && !json);

  process.stdout.write(
    shouldPrintMarkdown
      ? formatResponseForTerminal(response, { command, subcommand })
      : formatJsonForTerminal(response)
  );

  if (shouldEmitMachineErrorCode(response.errorCode, process.stderr.isTTY)) {
    process.stderr.write(`ERROR_CODE=${response.errorCode}\n`);
  }

  return mapErrorCodeToExitCode(response.errorCode);
}

main()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error) => {
    if (shouldEmitMachineErrorCode('PROVIDER_ERROR', process.stderr.isTTY)) {
      process.stderr.write('ERROR_CODE=PROVIDER_ERROR\n');
    }
    process.stderr.write(
      `${error instanceof Error ? error.message : String(error)}\n`
    );
    process.exitCode = 4;
  });
