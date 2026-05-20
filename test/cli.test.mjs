import test from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';

test('cli help works', () => {
  const r = spawnSync(process.execPath, ['bin/cre-openclaw-agent.mjs', '--help'], { encoding: 'utf8' });
  assert.equal(r.status, 0);
  assert.match(r.stdout, /CRE OpenClaw Agent/);
});
