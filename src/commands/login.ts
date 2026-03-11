import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

import type { CliConfig } from '../config/env.js';
import { saveStoredCredentials } from '../config/env.js';

export async function runLoginCommand(
  config: CliConfig,
  {
    apiKey,
    apiBaseUrl,
  }: {
    apiKey?: string;
    apiBaseUrl?: string;
  } = {}
) {
  let nextApiKey = apiKey;

  if (!nextApiKey) {
    const readline = createInterface({ input, output });
    nextApiKey = await readline.question('Paste your OpenClaw Connect API key: ');
    await readline.close();
  }

  saveStoredCredentials(
    {
      apiKey: nextApiKey,
      apiBaseUrl: apiBaseUrl || config.apiBaseUrl,
    },
    config.credentialsFile
  );

  return {
    markdown: '# Login Complete\n\n- Credentials stored for `openclaw-connect`.\n',
    status: 200,
  };
}
