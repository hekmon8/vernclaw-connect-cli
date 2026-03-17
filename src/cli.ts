#!/usr/bin/env node
import process from 'node:process';

import { runBalanceCommand } from './commands/balance.js';
import { runDescribeCommand } from './commands/describe.js';
import { runInvokeCommand } from './commands/invoke.js';
import { runJobGetCommand } from './commands/job-get.js';
import { runListCommand } from './commands/list.js';
import { runLoginCommand } from './commands/login.js';
import { runLogoutCommand } from './commands/logout.js';
import { resolveCliConfig } from './config/env.js';
import { mapErrorCodeToExitCode, parseArgv } from './index.js';

async function main() {
  const { positionals, flags } = parseArgv(process.argv.slice(2));
  const command = positionals[0];
  const subcommand = positionals[1];
  const config = resolveCliConfig({
    apiKey:
      typeof flags['api-key'] === 'string' ? String(flags['api-key']) : undefined,
    apiBaseUrl:
      typeof flags['api-base-url'] === 'string'
        ? String(flags['api-base-url'])
        : undefined,
  });

  let response:
    | {
        markdown: string;
        status: number;
        errorCode?: string;
      }
    | undefined;

  if (command === 'login') {
    response = await runLoginCommand(config, {
      apiKey:
        typeof flags['api-key'] === 'string' ? String(flags['api-key']) : undefined,
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
  } else if (command === 'balance') {
    response = await runBalanceCommand(config);
  } else {
    process.stderr.write('ERROR_CODE=INVALID_PARAMS\n');
    process.stderr.write('Unknown command.\n');
    return 3;
  }

  process.stdout.write(response.markdown);

  if (response.errorCode) {
    process.stderr.write(`ERROR_CODE=${response.errorCode}\n`);
  }

  return mapErrorCodeToExitCode(response.errorCode);
}

main()
  .then((exitCode) => {
    process.exitCode = exitCode;
  })
  .catch((error) => {
    process.stderr.write('ERROR_CODE=PROVIDER_ERROR\n');
    process.stderr.write(`${error instanceof Error ? error.message : String(error)}\n`);
    process.exitCode = 4;
  });
