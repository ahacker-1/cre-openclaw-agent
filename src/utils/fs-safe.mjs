import fs from 'node:fs';
import path from 'node:path';

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function readJson(file, fallback = null) {
  return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, 'utf8')) : fallback;
}

export function writeJson(file, value) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${JSON.stringify(value, null, 2)}\n`);
}

export function appendJsonl(file, value) {
  ensureDir(path.dirname(file));
  fs.appendFileSync(file, `${JSON.stringify(value)}\n`);
}

export function copyFileSafe(src, dest, { force = false, backup = false, dryRun = false } = {}) {
  ensureDir(path.dirname(dest));
  if (fs.existsSync(dest) && !force) {
    throw new Error(`Refusing to overwrite ${dest}; use --force or --backup`);
  }
  if (dryRun) return { src, dest, action: 'dry_run' };
  if (fs.existsSync(dest) && backup) fs.copyFileSync(dest, `${dest}.bak.${Date.now()}`);
  fs.copyFileSync(src, dest);
  return { src, dest, action: 'copied' };
}
