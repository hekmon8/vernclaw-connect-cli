import { stdin as input, stdout as output } from 'node:process';
import { createInterface } from 'node:readline/promises';

import { deleteStoredCredentials, type CliConfig } from '../config/env.js';

export async function runLogoutCommand(
  config: CliConfig,
  { force }: { force?: boolean } = {}
) {
  if (!force) {
    const readline = createInterface({ input, output });
    const answer = await readline.question(
      'Are you sure you want to log out? This will remove stored credentials. (y/N): '
    );
    readline.close();

    if (answer.trim().toLowerCase() !== 'y') {
      return {
        data: {
          command: 'logout',
          status: 'cancelled',
          message: 'No changes made.',
        },
        status: 200,
      };
    }
  }

  const deleted = deleteStoredCredentials(config.credentialsFile);

  if (!deleted) {
    return {
      data: {
        command: 'logout',
        status: 'no_credentials',
        message: 'No stored credentials found.',
      },
      status: 200,
    };
  }

  return {
    data: {
      command: 'logout',
      status: 'logged_out',
      message: 'Stored credentials removed.',
    },
    status: 200,
  };
}
