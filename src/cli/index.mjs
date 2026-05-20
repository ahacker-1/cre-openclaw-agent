import fs from 'node:fs';
import path from 'node:path';
import { resolveWorkspace } from '../utils/paths.mjs';
import { initState, loadState, stateDir } from '../state/store.mjs';
import { installAssets } from '../openclaw/installer.mjs';
import { generateSample } from '../generators/sample-deal.mjs';
import { validate } from '../validation/validate-artifacts.mjs';

function usage() {
  return `CRE OpenClaw Agent

Usage:
  cre-openclaw-agent <command> [options]

Commands:
  init       Initialize file-backed state in a workspace
  install    Copy OpenClaw assets into a workspace
  validate   Validate repo assets and optional workspace state
  sample     Generate a synthetic sample deal/workpad
  status     Summarize workspace state
  doctor     Check environment and validation

Options:
  --workspace <path>  Workspace path (default: .)
  --dry-run           Show intended writes without writing
  --force             Allow overwrite during install
  --backup            Backup overwritten files during install
  --only <section>    Install only skills, workflows, workpads, or state
`;
}

function argValue(args, name, fallback = null) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : fallback;
}

function flags(args) {
  return {
    dryRun: args.includes('--dry-run'),
    force: args.includes('--force') || args.includes('--backup'),
    backup: args.includes('--backup'),
    only: argValue(args, '--only')
  };
}

export async function main(args) {
  const cmd = args[0];
  if (!cmd || cmd === '--help' || cmd === '-h') {
    console.log(usage());
    return;
  }

  const workspace = resolveWorkspace(argValue(args, '--workspace', '.'));

  if (cmd === 'init') {
    const result = initState(workspace);
    console.log(`Initialized ${result.dir}`);
    return;
  }

  if (cmd === 'install') {
    const changed = installAssets(workspace, flags(args));
    console.log(JSON.stringify({ workspace, changed: changed.length, files: changed.map((c) => c.dest) }, null, 2));
    return;
  }

  if (cmd === 'validate') {
    const useWorkspace = args.includes('--workspace');
    const result = validate({ workspace: useWorkspace ? workspace : null });
    console.log(JSON.stringify(result, null, 2));
    if (!result.ok) process.exitCode = 1;
    return;
  }

  if (cmd === 'sample') {
    const result = generateSample(workspace);
    console.log(JSON.stringify({ workspace, deal: result.deal.id, workpad: result.workpad }, null, 2));
    return;
  }

  if (cmd === 'status') {
    const state = loadState(workspace);
    const approvals = path.join(stateDir(workspace), 'approvals.jsonl');
    const approvalCount = fs.existsSync(approvals)
      ? fs.readFileSync(approvals, 'utf8').split(/\r?\n/).filter(Boolean).length
      : 0;
    console.log(JSON.stringify({ workspace, deals: state.deals.deals.length, tasks: state.tasks.tasks.length, approvals: approvalCount }, null, 2));
    return;
  }

  if (cmd === 'doctor') {
    const result = validate({ workspace: fs.existsSync(stateDir(workspace)) ? workspace : null });
    console.log(JSON.stringify({ node: process.version, cwd: process.cwd(), workspace, validation: result }, null, 2));
    if (!result.ok) process.exitCode = 1;
    return;
  }

  throw new Error(`Unknown command: ${cmd}\n\n${usage()}`);
}
