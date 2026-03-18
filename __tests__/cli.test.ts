import { describe, expect, it } from 'vitest';

import {
  ensureTrailingNewline,
  mapErrorCodeToExitCode,
  parseArgv,
} from '../src/index.js';
import { resolveCliConfig } from '../src/config/env.js';

describe('vernclaw-cli helpers', () => {
  it('maps connector error codes to exit codes', () => {
    expect(mapErrorCodeToExitCode()).toBe(0);
    expect(mapErrorCodeToExitCode('AUTH_REQUIRED')).toBe(1);
    expect(mapErrorCodeToExitCode('INVALID_API_KEY')).toBe(2);
    expect(mapErrorCodeToExitCode('INVALID_PARAMS')).toBe(3);
    expect(mapErrorCodeToExitCode('ALL_PROVIDERS_FAILED')).toBe(4);
  });

  it('parses flags and positionals', () => {
    const parsed = parseArgv([
      'invoke',
      'seo.website-traffic',
      '--domain',
      'example.com',
      '--api-key',
      'key_123',
    ]);

    expect(parsed.positionals).toEqual(['invoke', 'seo.website-traffic']);
    expect(parsed.flags.domain).toBe('example.com');
    expect(parsed.flags['api-key']).toBe('key_123');
  });

  it('resolves config precedence', () => {
    const config = resolveCliConfig({
      env: {
        VERNCLAW_CLI_API_KEY: 'env-key',
        VERNCLAW_CLI_API_BASE_URL: 'https://api.example.com',
      },
      apiKey: 'flag-key',
      apiBaseUrl: 'https://flag.example.com',
      homeDir: '/tmp/vernclaw-test-home',
    });

    expect(config.apiKey).toBe('flag-key');
    expect(config.apiBaseUrl).toBe('https://flag.example.com');
  });

  it('defaults api base url to production when no override is provided', () => {
    const config = resolveCliConfig({
      env: {},
      homeDir: '/tmp/vernclaw-empty-home',
    });

    expect(config.apiBaseUrl).toBe('https://vernclaw.com');
  });

  it('ensures terminal output ends with a newline', () => {
    expect(ensureTrailingNewline('# Heading')).toBe('# Heading\n');
    expect(ensureTrailingNewline('# Heading\n')).toBe('# Heading\n');
  });
});
