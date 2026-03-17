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

const CLI_VERSION = '0.1.0';

function printHelp() {
  const help = [
    `vernclaw-cli v${CLI_VERSION}`,
    '',
    'Usage: vernclaw-cli <command> [options]',
    '',
    'Commands:',
    '  login                    Authenticate via browser or API key',
    '  logout                   Remove stored credentials',
    '  list                     List available connectors',
    '  describe <connector>     Show connector details and parameters',
    '  invoke <connector>       Run a connector and print output',
    '  job get <jobId>          Check status of an async job',
    '  balance                  Display current credit balance',
    '',
    'Options:',
    '  --help                   Show this help message',
    '  --api-key <key>          Use a specific API key',
    '  --api-base-url <url>     Override the API base URL',
    '',
    'Examples:',
    '  vernclaw-cli login',
    '  vernclaw-cli list',
    '  vernclaw-cli invoke seo.website-traffic --domain example.com',
    '',
    'Docs: https://vernclaw.com/docs/connectors/cli',
    '',
  ].join('\n');
  process.stdout.write(help);
}

async function main() {
  const { positionals, flags } = parseArgv(process.argv.slice(2));
  const command = positionals[0];
  const subcommand = positionals[1];

  if (!command || flags['help'] === true) {
    printHelp();
    return 0;
  }

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
    process.stderr.write(`Unknown command: ${command}\n\n`);
    printHelp();
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
