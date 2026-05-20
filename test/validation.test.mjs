import test from 'node:test';
import assert from 'node:assert/strict';
import { validate } from '../src/validation/validate-artifacts.mjs';

test('repo assets validate', () => {
  const result = validate();
  assert.equal(result.ok, true, JSON.stringify(result.errors));
  assert.equal(result.checked.skills >= 6, true);
});
