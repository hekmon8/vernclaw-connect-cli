import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { exec } from 'node:child_process';
import { platform } from 'node:os';

import type { CliConfig } from '../config/env.js';
import { saveStoredCredentials } from '../config/env.js';
import { requestMarkdown, requestJson } from '../client/http.js';

interface DeviceCodeResponse {
  device_code: string;
  user_code: string;
  verification_uri: string;
  expires_in: number;
  interval: number;
}

interface PollResponse {
  status: 'pending' | 'authorized' | 'expired';
  api_key?: string;
}

function openBrowser(url: string) {
  const os = platform();
  const cmd =
    os === 'darwin' ? 'open' : os === 'win32' ? 'start' : 'xdg-open';
  exec(`${cmd} "${url}"`, () => {});
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function loginWithApiKey(
  config: CliConfig,
  apiKey: string,
  apiBaseUrl?: string
) {
  const tempConfig: CliConfig = {
    ...config,
    apiKey,
    apiBaseUrl: apiBaseUrl || config.apiBaseUrl,
  };

  const result = await requestMarkdown({
    config: tempConfig,
    pathname: '/api/connectors/status',
  });

  if (result.errorCode === 'INVALID_API_KEY') {
    return {
      markdown: '# Login Failed\n\n- Invalid API key. Please check and try again.\n',
      status: 401,
      errorCode: 'INVALID_API_KEY',
    };
  }

  if (result.errorCode) {
    return {
      markdown: `# Login Failed\n\n- Could not validate API key: ${result.errorCode}\n`,
      status: result.status,
      errorCode: result.errorCode,
    };
  }

  saveStoredCredentials(
    { apiKey, apiBaseUrl: apiBaseUrl || config.apiBaseUrl },
    config.credentialsFile
  );

  return {
    markdown: '# Login Complete\n\n- API key validated and stored for `vernclaw-cli`.\n',
    status: 200,
  };
}

async function loginWithDeviceCode(config: CliConfig, apiBaseUrl?: string) {
  const effectiveConfig: CliConfig = {
    ...config,
    apiBaseUrl: apiBaseUrl || config.apiBaseUrl,
  };

  const { data } = await requestJson<DeviceCodeResponse>({
    config: effectiveConfig,
    pathname: '/api/cli/device-code',
    method: 'POST',
  });

  process.stderr.write('\n');
  process.stderr.write(`  Your device code: ${data.user_code}\n\n`);
  process.stderr.write(`  Open this URL to authorize:\n`);
  process.stderr.write(`  ${data.verification_uri}\n\n`);
  process.stderr.write('  Waiting for authorization...\n');

  openBrowser(data.verification_uri);

  const deadline = Date.now() + data.expires_in * 1000;
  const interval = (data.interval || 5) * 1000;

  while (Date.now() < deadline) {
    await sleep(interval);

    const { data: pollData } = await requestJson<PollResponse>({
      config: effectiveConfig,
      pathname: '/api/cli/device-code/poll',
      method: 'POST',
      body: { device_code: data.device_code },
    });

    if (pollData.status === 'authorized' && pollData.api_key) {
      saveStoredCredentials(
        {
          apiKey: pollData.api_key,
          apiBaseUrl: effectiveConfig.apiBaseUrl,
        },
        config.credentialsFile
      );

      return {
        markdown:
          '# Login Complete\n\n- Authorized via browser. API key stored for `vernclaw-cli`.\n',
        status: 200,
      };
    }

    if (pollData.status === 'expired') {
      return {
        markdown: '# Login Failed\n\n- Device code expired. Please try again.\n',
        status: 408,
        errorCode: 'INVALID_PARAMS',
      };
    }
  }

  return {
    markdown: '# Login Failed\n\n- Timed out waiting for authorization. Please try again.\n',
    status: 408,
    errorCode: 'INVALID_PARAMS',
  };
}

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
  if (apiKey) {
    return loginWithApiKey(config, apiKey, apiBaseUrl);
  }

  return loginWithDeviceCode(config, apiBaseUrl);
}
