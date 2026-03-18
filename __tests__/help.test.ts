import { describe, expect, it } from 'vitest';

import { buildHelpText } from '../src/help.js';

describe('help text', () => {
  it('documents status command and api key login example', () => {
    const help = buildHelpText('0.1.0');

    expect(help).toContain('status                   Display current login, subscription, and credit status');
    expect(help).toContain('vernclaw-cli login --api-key YOUR_API_KEY');
    expect(help).not.toContain('balance                  Display current credit balance');
  });
});
