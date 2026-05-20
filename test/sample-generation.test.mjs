import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { generateSample } from '../src/generators/sample-deal.mjs';
import { validate } from '../src/validation/validate-artifacts.mjs';

test('sample generation creates valid workspace state', () => {
  const workspace = fs.mkdtempSync(path.join(os.tmpdir(), 'cre-openclaw-agent-'));
  const result = generateSample(workspace);
  assert.equal(fs.existsSync(result.workpad), true);
  const validation = validate({ workspace });
  assert.equal(validation.ok, true, JSON.stringify(validation.errors));
});
