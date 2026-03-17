import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import type { CliConfig } from '../config/env.js';
import { deleteStoredCredentials } from '../config/env.js';

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
        markdown: '# Logout Cancelled\n\n- No changes made.\n',
        status: 200,
      };
    }
  }

  const deleted = deleteStoredCredentials(config.credentialsFile);

  if (!deleted) {
    return {
      markdown: '# Logout\n\n- No stored credentials found.\n',
      status: 200,
    };
  }

  return {
    markdown: '# Logged Out\n\n- Stored credentials removed.\n',
    status: 200,
  };
}
