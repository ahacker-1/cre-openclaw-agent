import fs from 'node:fs';
import path from 'node:path';
import { relFromRoot } from '../utils/paths.mjs';
import { copyFileSafe, ensureDir } from '../utils/fs-safe.mjs';
import { initState, recordRun } from '../state/store.mjs';
import { nowIso } from '../utils/time.mjs';

function walk(dir) { return fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => { const p = path.join(dir, e.name); return e.isDirectory() ? walk(p) : [p]; }); }
export function installAssets(workspace, options = {}) {
  ensureDir(workspace);
  const source = relFromRoot('openclaw');
  const files = walk(source).filter((f) => !f.endsWith('README.md') || f.includes(`${path.sep}workpads${path.sep}`) || f.includes(`${path.sep}state${path.sep}`));
  const changed = [];
  for (const src of files) {
    const rel = path.relative(source, src);
    const top = rel.split(path.sep)[0];
    if (options.only && options.only !== top) continue;
    const dest = path.join(workspace, rel);
    changed.push(copyFileSafe(src, dest, options));
  }
  initState(workspace);
  if (!options.dryRun) recordRun(workspace, { id: `run_${Date.now()}`, command: 'install', workspace, status: 'success', startedAt: nowIso(), endedAt: nowIso(), changedFiles: changed.map(c => c.dest), notes: ['Installed CRE OpenClaw assets'] });
  return changed;
}
