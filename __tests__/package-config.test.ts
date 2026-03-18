import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { CLI_VERSION } from '../src/version.js';

const repoRoot = resolve(import.meta.dirname, '..');
const packageJsonPath = resolve(repoRoot, 'package.json');
const gitignorePath = resolve(repoRoot, '.gitignore');

describe('package publishing configuration', () => {
  it('builds dist during prepack and ignores dist in git', () => {
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      files?: string[];
      scripts?: Record<string, string>;
      devDependencies?: Record<string, string>;
    };

    expect(packageJson.files).toContain('dist');
    expect(packageJson.scripts?.build).toBe('tsc -p tsconfig.json');
    expect(packageJson.scripts?.prepack).toBe('npm run build');
    expect(packageJson.devDependencies?.typescript).toBeTypeOf('string');
    expect(CLI_VERSION).toBe(packageJson.version);

    expect(existsSync(gitignorePath)).toBe(true);
    const gitignore = readFileSync(gitignorePath, 'utf8');
    expect(gitignore).toMatch(/(^|\n)dist\/?(\n|$)/);
  });
});
