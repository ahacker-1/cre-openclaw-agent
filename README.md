# CRE OpenClaw Agent

[![CI](https://github.com/ahacker-1/cre-openclaw-agent/actions/workflows/ci.yml/badge.svg)](https://github.com/ahacker-1/cre-openclaw-agent/actions/workflows/ci.yml)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache--2.0-blue.svg)](LICENSE)

An OpenClaw-native commercial real estate acquisition helper for source-backed deal intake, human-approved underwriting inputs, workflow readiness checks, workpads, and IC-ready memo drafts.

> **Important disclaimer:** This project supports CRE document organization, workflow automation, and educational decision support. It does **not** provide financial, investment, tax, legal, accounting, brokerage, lending, or fiduciary advice. Outputs must be reviewed by qualified professionals before use in real transactions.

## Why this exists

CRE acquisition work is document-heavy and assumption-sensitive. Rent rolls, T12s, OMs, PSAs, lender terms, diligence files, and IC memos all depend on facts that need to be traceable back to source documents. Generic agents can draft text, but acquisition teams need source provenance, approval gates, and repeatable workflows.

`cre-openclaw-agent` packages a focused OpenClaw-native helper layer around those needs:

- CRE-specific skill prompts and operating loops.
- Durable workflow templates for deal intake, underwriting review, diligence, and IC memo preparation.
- Workpad templates that keep assumptions, risks, missing data, approvals, and logs visible.
- File-backed state schemas for deals, tasks, approvals, and runs.
- A deterministic local CLI for installation, validation, sample artifact generation, and status checks.
- No API keys required for the default demo path.

## Relationship to CRE Acquisition Orchestrator

This project is inspired by and adapted from concepts in [CRE Acquisition Orchestrator](https://github.com/ahacker-1/cre-acquisition-orchestrator), an Apache-2.0 project by Avi Hacker, J.D.

The upstream project is the broader CRE acquisition orchestration workspace: dashboard, parser contracts, specialist-agent catalog, workflow design, workpapers, IC package surfaces, and source-backed extraction model.

`cre-openclaw-agent` is intentionally narrower. It is the OpenClaw-native helper layer:

- `cre-acquisition-orchestrator` = vertical CRE acquisition orchestration framework and reference architecture.
- `cre-openclaw-agent` = OpenClaw-ready skill/workflow/workpad/state package for source-backed CRE deal work.

Attribution is preserved in [NOTICE](NOTICE).

## What it does

- Installs OpenClaw skills into `skills/<name>/SKILL.md`.
- Installs OpenClaw workflows into `workflows/*.md`.
- Installs reusable workpad templates into `workpads/templates/`.
- Initializes file-backed state under `state/cre-openclaw-agent/`.
- Generates synthetic sample deal state and a workpad with no real deal data.
- Validates repo assets and installed workspace artifacts.
- Tracks approval gates as append-only JSONL.
- Supports a trust posture where extracted or user-provided values are candidates until reviewed.

## What it does not do

- It does not make investment decisions.
- It does not replace underwriting judgment, counsel, lenders, brokers, accountants, or fiduciaries.
- It does not contact external parties automatically.
- It does not silently treat unreviewed values as approved.
- It does not require or include private offering memoranda, rent rolls, T12s, leases, or PII.
- It is not guaranteed production-ready without security, compliance, and professional review.

## Quick start

```bash
git clone https://github.com/ahacker-1/cre-openclaw-agent.git
cd cre-openclaw-agent
npm install
npm run validate
npm test
```

Generate a local demo workspace:

```bash
npm run sample
node bin/cre-openclaw-agent.mjs status --workspace ./tmp/sample-workspace
```

Install into an OpenClaw workspace:

```bash
node bin/cre-openclaw-agent.mjs install --workspace /path/to/openclaw/workspace --backup
node bin/cre-openclaw-agent.mjs sample --workspace /path/to/openclaw/workspace
node bin/cre-openclaw-agent.mjs validate --workspace /path/to/openclaw/workspace
```

> Exact OpenClaw CLI syntax can vary by distribution. This repo ships OpenClaw-compatible file assets plus a standalone CLI so the first-run path is deterministic.

## Core workflows

- **CRE acquisition intake**: capture a raw opportunity, create a deal record, open a workpad, and mark missing inputs.
- **CRE underwriting review**: review assumptions, risks, data gaps, and evidence needed before a deal screen or IC memo.
- **CRE due diligence**: coordinate financial, legal, physical, and operational diligence tasks.
- **CRE IC memo**: create an IC memo workpad with assumptions, risks, mitigants, and approval boundaries.
- **CRE acquisition TaskFlow**: maintain deal tasks, blockers, approvals, and run logs in file-backed state.

## Trust model

The design is deliberately conservative:

1. Inputs become **candidate facts**.
2. Candidate facts retain source/provenance fields where available.
3. Missing values are marked `unknown`, not guessed.
4. Sensitive or external actions require approval.
5. Approval records are append-only.
6. Workflows read from visible state and workpads.
7. Generated artifacts include caveats and open questions.

## Repository layout

```text
openclaw/       OpenClaw skills, workflows, workpad templates, state schemas
src/            Standalone Node CLI implementation
schemas/        JSON schemas for state and manifests
docs/           Architecture, install, state model, CLI, roadmap, security
examples/       Synthetic sample deal and expected generated artifacts
test/           Node built-in test suite
scripts/        Local lint and guard scripts
```

## Development

```bash
npm install
npm run lint
npm test
npm run validate
npm run sample
```

## License

Apache License 2.0. See [LICENSE](LICENSE) and [NOTICE](NOTICE).
