import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

describe('published skill output contract', () => {
  const skillsDir = resolve(import.meta.dirname, '../skills');
  for (const entry of readdirSync(skillsDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    it(`${entry.name} documents provider raw payload omission`, () => {
      const doc = readFileSync(
        resolve(skillsDir, entry.name, 'SKILL.md'),
        'utf8'
      );
      expect(doc).toMatch(
        /omits provider raw payloads from normal connector output/i
      );
    });
  }
});
