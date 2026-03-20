import { describe, expect, it } from 'vitest';

import { resolveE2EPolicy } from './support/e2e-policy.js';

describe('e2e policy', () => {
  it('defaults production runs to success gate', () => {
    const policy = resolveE2EPolicy({
      apiBaseUrl: 'https://vernclaw.com',
      e2eRunEnv: '1',
    });

    expect(policy.targetLabel).toBe('production');
    expect(policy.shouldRunE2E).toBe(true);
    expect(policy.requireSuccess).toBe(true);
  });

  it('allows overriding success gate explicitly', () => {
    const policy = resolveE2EPolicy({
      apiBaseUrl: 'https://vernclaw.com',
      e2eRunEnv: '1',
      expectSuccessEnv: '0',
    });

    expect(policy.requireSuccess).toBe(false);
  });

  it('keeps local runs as smoke by default', () => {
    const policy = resolveE2EPolicy({
      apiBaseUrl: 'http://127.0.0.1:3000',
      e2eRunEnv: '1',
    });

    expect(policy.targetLabel).toBe('local');
    expect(policy.requireSuccess).toBe(false);
  });

  it('supports forcing local runs into success gate', () => {
    const policy = resolveE2EPolicy({
      apiBaseUrl: 'http://127.0.0.1:3000',
      e2eRunEnv: '1',
      expectSuccessEnv: '1',
    });

    expect(policy.requireSuccess).toBe(true);
  });
});
