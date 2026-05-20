import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { installAssets } from '../src/openclaw/installer.mjs';

test('installer copies OpenClaw skills into a workspace', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'cre-openclaw-install-'));
  const changed = installAssets(workspace);
  assert.equal(changed.length > 0, true);
  assert.equal(fs.existsSync(path.join(workspace, 'skills', 'cre-acquisition-agent', 'SKILL.md')), true);
});
