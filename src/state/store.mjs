import fs from 'node:fs';
import path from 'node:path';
import { ensureDir, writeJson, appendJsonl, readJson } from '../utils/fs-safe.mjs';
import { nowIso } from '../utils/time.mjs';

export function stateDir(workspace) { return path.join(workspace, 'state', 'cre-openclaw-agent'); }
export function initState(workspace) {
  const dir = stateDir(workspace); ensureDir(path.join(dir, 'artifacts'));
  const now = nowIso();
  const files = [];
  const defaults = {
    'config.json': { version: 1, workspaceKind: 'openclaw', createdAt: now, updatedAt: now, defaults: { approvalRequiredForExternalActions: true, workpadDirectory: 'workpads/active', archiveDirectory: 'workpads/archive' } },
    'deals.json': { version: 1, deals: [] },
    'tasks.json': { version: 1, tasks: [] }
  };
  for (const [name, value] of Object.entries(defaults)) { const file = path.join(dir, name); if (!fs.existsSync(file)) { writeJson(file, value); files.push(file); } }
  for (const name of ['approvals.jsonl','runs.jsonl']) { const file = path.join(dir, name); if (!fs.existsSync(file)) { fs.writeFileSync(file, ''); files.push(file); } }
  return { dir, files };
}
export function recordRun(workspace, run) { appendJsonl(path.join(stateDir(workspace), 'runs.jsonl'), run); }
export function loadState(workspace) { const dir = stateDir(workspace); return { deals: readJson(path.join(dir, 'deals.json'), {version:1,deals:[]}), tasks: readJson(path.join(dir, 'tasks.json'), {version:1,tasks:[]}) }; }
