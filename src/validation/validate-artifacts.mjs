import fs from 'node:fs';
import path from 'node:path';
import { relFromRoot } from '../utils/paths.mjs';

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const p = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(p) : [p];
  });
}

function hasFrontmatter(text) {
  return text.startsWith('---\n') && text.indexOf('\n---\n') > 0;
}

function jsonlValid(file, errors) {
  if (!fs.existsSync(file)) return;
  const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
  lines.forEach((line, index) => {
    if (!line.trim()) return;
    try {
      JSON.parse(line);
    } catch {
      errors.push(`${file}:${index + 1} invalid JSONL`);
    }
  });
}

export function validate({ workspace = null } = {}) {
  const errors = [];
  const warnings = [];

  const skillFiles = walk(relFromRoot('openclaw', 'skills')).filter((f) => f.endsWith('SKILL.md'));
  for (const file of skillFiles) {
    const text = fs.readFileSync(file, 'utf8');
    if (!hasFrontmatter(text)) errors.push(`${file} missing frontmatter`);
    if (!/^# /m.test(text)) errors.push(`${file} missing heading`);
    if (!/description:/m.test(text)) errors.push(`${file} missing description`);
  }

  const workflows = walk(relFromRoot('openclaw', 'workflows')).filter((f) => f.endsWith('.md'));
  for (const file of workflows) {
    const text = fs.readFileSync(file, 'utf8');
    for (const term of ['State map', 'Approval gates', 'Done criteria']) {
      if (!text.includes(term)) errors.push(`${file} missing ${term}`);
    }
  }

  const workpads = walk(relFromRoot('openclaw', 'workpads', 'templates')).filter((f) => f.endsWith('.md'));
  for (const file of workpads) {
    const text = fs.readFileSync(file, 'utf8');
    for (const term of ['Deal ID', 'Workflow', 'Approval needed', 'Log']) {
      if (!text.includes(term)) errors.push(`${file} missing ${term}`);
    }
  }

  for (const file of walk(relFromRoot('schemas')).filter((f) => f.endsWith('.json'))) {
    try {
      JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch {
      errors.push(`${file} invalid JSON`);
    }
  }

  if (workspace) {
    const dir = path.join(workspace, 'state', 'cre-openclaw-agent');
    for (const name of ['config.json', 'deals.json', 'tasks.json']) {
      const file = path.join(dir, name);
      if (!fs.existsSync(file)) {
        errors.push(`${file} missing`);
      } else {
        try {
          JSON.parse(fs.readFileSync(file, 'utf8'));
        } catch {
          errors.push(`${file} invalid JSON`);
        }
      }
    }
    jsonlValid(path.join(dir, 'approvals.jsonl'), errors);
    jsonlValid(path.join(dir, 'runs.jsonl'), errors);
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    checked: { skills: skillFiles.length, workflows: workflows.length, workpads: workpads.length }
  };
}
