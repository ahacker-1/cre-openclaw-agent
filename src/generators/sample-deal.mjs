import fs from 'node:fs';
import path from 'node:path';
import { relFromRoot } from '../utils/paths.mjs';
import { ensureDir, writeJson, appendJsonl } from '../utils/fs-safe.mjs';
import { initState, stateDir, recordRun } from '../state/store.mjs';
import { nowIso } from '../utils/time.mjs';

export function generateSample(workspace) {
  initState(workspace);
  const dir = stateDir(workspace);
  const sample = JSON.parse(fs.readFileSync(relFromRoot('examples', 'sample-deal.json'), 'utf8'));
  const taskflow = JSON.parse(fs.readFileSync(relFromRoot('examples', 'sample-taskflow.json'), 'utf8'));
  const workpadRel = 'workpads/active/2026-01-01-cre-acquisition-parkview-flats-sample.md';
  sample.workpads = [workpadRel];
  writeJson(path.join(dir, 'deals.json'), { version: 1, deals: [sample] });
  writeJson(path.join(dir, 'tasks.json'), taskflow);
  fs.writeFileSync(path.join(dir, 'approvals.jsonl'), '');
  appendJsonl(path.join(dir, 'approvals.jsonl'), { id: 'approval_sample_001', dealId: sample.id, taskId: 'task_sample_001', status: 'requested', riskLevel: 'medium', actionType: 'external_message', requestedAction: 'Send broker diligence request email', reason: 'External communication requires approval', requestedAt: nowIso(), resolvedAt: null, resolvedBy: null, notes: [] });
  const wp = path.join(workspace, workpadRel); ensureDir(path.dirname(wp));
  fs.writeFileSync(wp, `# CRE Deal Workpad: ${sample.name}

Status: active
Deal ID: ${sample.id}
Workflow: cre-acquisition-intake
Created: ${nowIso()}

## Deal snapshot

- Asset: ${sample.name}
- Address: ${sample.address}
- Asset type: ${sample.assetType}
- Units / SF: ${sample.units}
- Asking price: ${sample.askingPrice}
- NOI: ${sample.noi}
- Cap rate: ${sample.capRate}

## Objective

Create a source-backed quick screen and identify missing diligence.

## Source files checked

- Synthetic sample only

## Risks and red flags

- Real rent roll and T12 still required.

## Missing data

- Rent roll
- T12
- OM
- PSA

## Approval needed

- Approval required before contacting broker or lender.

## Log

- ${nowIso()} - Synthetic sample workpad generated.
`);
  recordRun(workspace, { id: `run_${Date.now()}`, command: 'sample', workspace, status: 'success', startedAt: nowIso(), endedAt: nowIso(), changedFiles: [path.join(dir,'deals.json'), path.join(dir,'tasks.json'), wp], notes: ['Generated synthetic sample deal'] });
  return { deal: sample, workpad: wp };
}
