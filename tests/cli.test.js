import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const exec = promisify(execFile);
const __dirname = dirname(fileURLToPath(import.meta.url));
const CLI = join(__dirname, '..', 'bin', 'openclawsquad.js');

describe('openclawsquad CLI', () => {
  it('--version prints the version', async () => {
    const { stdout } = await exec('node', [CLI, '--version']);
    assert.match(stdout.trim(), /^openclawsquad v\d+\.\d+\.\d+$/);
  });

  it('--help prints usage information', async () => {
    const { stdout } = await exec('node', [CLI, '--help']);
    assert.ok(stdout.includes('openclawsquad'), 'help should mention openclawsquad');
    assert.ok(stdout.includes('start'), 'help should mention start command');
    assert.ok(stdout.includes('create'), 'help should mention create command');
  });
});

describe('package.json', () => {
  it('has required fields for npm publish', async () => {
    const raw = await readFile(join(__dirname, '..', 'package.json'), 'utf8');
    const pkg = JSON.parse(raw);
    assert.ok(pkg.name, 'must have name');
    assert.ok(pkg.version, 'must have version');
    assert.ok(pkg.bin, 'must have bin');
    assert.ok(pkg.bin.openclawsquad, 'bin must include openclawsquad entry');
    assert.ok(pkg.license, 'must have license');
  });
});
