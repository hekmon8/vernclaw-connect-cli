import { describe, expect, it } from 'vitest';

import { resolveCliConfig } from '../src/config/env.js';
import {
  ensureTrailingNewline,
  formatJsonForTerminal,
  formatMarkdownForTerminal,
  formatResponseForTerminal,
  mapErrorCodeToExitCode,
  parseArgv,
  shouldEmitMachineErrorCode,
} from '../src/index.js';

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

  it('formats command responses as compact JSON by default', () => {
    expect(
      formatJsonForTerminal({
        markdown: '# Account Balance\n',
        status: 200,
      })
    ).toBe('{"status":200,"data":{}}\n');
  });

  it('formats structured responses as compact JSON without markdown', () => {
    expect(
      formatJsonForTerminal({
        data: {
          summary: 'ok',
          raw: {
            tasks: [],
          },
        },
        status: 200,
      })
    ).toBe('{"status":200,"data":{"summary":"ok","raw":{"tasks":[]}}}\n');
  });

  it('includes error codes in JSON output when present', () => {
    expect(
      formatJsonForTerminal({
        data: {
          error_code: 'INVALID_PARAMS',
          message: 'Failed',
        },
        status: 400,
        errorCode: 'INVALID_PARAMS',
      })
    ).toBe(
      '{"status":400,"data":{"error_code":"INVALID_PARAMS","message":"Failed"},"errorCode":"INVALID_PARAMS"}\n'
    );
  });

  it('suppresses machine-readable error codes on interactive terminals', () => {
    expect(shouldEmitMachineErrorCode(undefined, false)).toBe(false);
    expect(shouldEmitMachineErrorCode('PROVIDER_ERROR', true)).toBe(false);
    expect(shouldEmitMachineErrorCode('PROVIDER_ERROR', false)).toBe(true);
  });

  it('sanitizes invoke markdown for terminal display', () => {
    const output = formatMarkdownForTerminal(
      [
        '# Image Generate',
        '',
        '- Provider: aiapi-center-fallback',
        '- Credits Cost: 10',
        '- prompt: dog swiming in the river',
        '- size: 1024x1024',
        '## Summary',
        'The image prompt was accepted by AIAPI Center and rendered successfully.',
        '## Result',
        '- Prompt: dog swiming in the river',
        '- Size: 1024x1024',
        '',
        '- Preview URL: https://aires.hekmon.com/image/2026/03/19/media_mmwuzf7xi9g335p5.jpeg',
        '',
        '## Notes',
        '',
        '- Rendered through AIAPI Center.',
        '- Prompt: dog swiming in the river',
        '',
        '## Sources',
        '',
        '- DataForSEO',
        '',
      ].join('\n'),
      { command: 'invoke' }
    );

    expect(output).toBe(
      [
        '# Image Generate',
        '',
        '- Credits Cost: 10',
        '- Prompt: dog swiming in the river',
        '- Size: 1024x1024',
        '- Preview URL: https://aires.hekmon.com/image/2026/03/19/media_mmwuzf7xi9g335p5.jpeg',
        '',
      ].join('\n')
    );
    expect(output).not.toContain('rendered successfully');
    expect(output).not.toContain('## Notes');
    expect(output).not.toContain('DataForSEO');
    expect(output).not.toContain('## Summary');
    expect(output).not.toContain('## Result');
  });

  it('includes raw JSON when pretty-printing structured job responses', () => {
    const output = formatResponseForTerminal({
      status: 202,
      data: {
        connector_name: 'Image Generate',
        connector_id: 'generate.image',
        job_id: 'job_123',
        status: 'pending',
        estimated_duration: '30-60 seconds',
        raw: {
          id: 'upstream_task_123',
          status: 'pending',
        },
      },
    });

    expect(output).toContain('## Raw JSON');
    expect(output).toContain('"id": "upstream_task_123"');
  });

  it('pretty-prints structured account responses from data', () => {
    const output = formatResponseForTerminal({
      status: 200,
      data: {
        command: 'balance',
        account: {
          account_email: 'user@example.com',
          credits_remaining: 245,
        },
      },
    });

    expect(output).toContain('# Account Balance');
    expect(output).toContain('- Account Email: user@example.com');
    expect(output).toContain('- Credits Remaining: 245');
  });

  it('pretty-prints connector lists as terminal tables', () => {
    const output = formatResponseForTerminal({
      status: 200,
      data: {
        command: 'list',
        count: 1,
        connectors: [
          {
            id: 'seo.website-traffic',
            category: 'seo',
            description:
              'Estimate website traffic, top markets, and audience signals.',
            status: 'ready',
          },
        ],
        hints: [
          'Run `vernclaw-cli describe <connector>` to inspect flags and example commands.',
        ],
      },
    });

    expect(output).toContain('CONNECTOR');
    expect(output).toContain('seo.website-traffic');
    expect(output).toContain('ready');
    expect(output).toContain(
      'Run `vernclaw-cli describe <connector>` to inspect flags and example commands.'
    );
    expect(output).not.toContain('"connectors"');
  });

  it('keeps non-invoke markdown unchanged apart from trailing newline normalization', () => {
    const input = '# SEO Website Traffic\n\n## Summary\n\nTraffic lookup';

    expect(formatMarkdownForTerminal(input, { command: 'describe' })).toBe(
      '# SEO Website Traffic\n\n## Summary\n\nTraffic lookup\n'
    );
  });
});
