import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export function resolveWorkspace(input = '.') { return path.resolve(input); }
export function relFromRoot(...parts) { return path.join(repoRoot, ...parts); }
export function toPosix(p) { return p.split(path.sep).join('/'); }
