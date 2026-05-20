# CRE OpenClaw Agent Implementation Plan

> **For Hermes:** Use subagent-driven-development skill to implement this plan task-by-task.

**Goal:** Build and publish `ahacker-1/cre-openclaw-agent`, a full Apache-2.0 open-source OpenClaw-native CRE acquisition helper derived from the CRE Acquisition Orchestrator operating model.

**Architecture:** Keep the full CRE dashboard and heavy parser runtime out of this repository. Package the reusable vertical brain as OpenClaw skills, workflows, workpad templates, file-backed state schemas, and a deterministic Node CLI that can install, validate, generate sample artifacts, and summarize local state without external API keys.

**Tech Stack:** Node.js 18+ ESM, Node built-in test runner, Markdown OpenClaw assets, JSON/JSONL file-backed state, GitHub Actions CI, Apache-2.0 licensing.

---

## Strategic product definition

`cre-openclaw-agent` is the OpenClaw-native deal-room chief of staff for commercial real estate acquisition work. It should help a user move from a raw opportunity to structured deal state, reviewable assumptions, approval-gated next actions, and IC-ready drafts.

It must not claim to be an autonomous acquisition machine. The trust differentiator is source-backed workflow discipline: explicit unknowns, provenance where available, approval gates, visible workpads, and repeatable TaskFlow state.

## Source relationship

- Upstream project: `ahacker-1/cre-acquisition-orchestrator`
- New repo: `ahacker-1/cre-openclaw-agent`
- License: Apache-2.0
- Attribution: Preserve upstream attribution in `NOTICE`, README, and source-project docs.

## Release objectives

### v0.1.0

- Public Apache-2.0 GitHub repo.
- README, LICENSE, NOTICE, SECURITY, CONTRIBUTING, CODE_OF_CONDUCT.
- OpenClaw skills/workflows/workpad templates.
- State model schemas.
- CLI with `init`, `install`, `validate`, `sample`, `status`, `doctor`.
- Synthetic sample deal.
- Node test suite and CI.
- No external credentials needed.

### v0.2.0

- Parser bridge to reuse source-backed extraction contracts from CRE Acquisition Orchestrator.
- Candidate-field review queue.
- Stale source hash checks.

### v0.3.0

- Optional OpenClaw plugin adapter.
- Expanded specialist skills and richer IC package generation.

## Task 1: Create repository shell

**Objective:** Create the local repo at `C:/Users/Avi Work/projects/cre-openclaw-agent` with package metadata, license, notices, README, gitignore, and initial directory structure.

**Files:**
- Create: `package.json`
- Create: `README.md`
- Create: `LICENSE`
- Create: `NOTICE`
- Create: `.gitignore`

**Verification:**

```bash
node --version
npm --version
node -e "const p=require('./package.json'); console.log(p.name, p.license)"
```

Expected: package name is `cre-openclaw-agent`, license is `Apache-2.0`.

## Task 2: Add open-source governance baseline

**Objective:** Make the project public-ready before any code is shipped.

**Files:**
- Create: `CONTRIBUTING.md`
- Create: `SECURITY.md`
- Create: `CODE_OF_CONDUCT.md`
- Create: `DISCLAIMER.md`
- Create: `.github/pull_request_template.md`
- Create: `.github/ISSUE_TEMPLATE/*.yml`

**Verification:**

```bash
node scripts/lint.mjs
```

Expected: no missing governance files.

## Task 3: Create OpenClaw skill pack

**Objective:** Add reusable OpenClaw skills that encode CRE acquisition operating behavior and approval boundaries.

**Files:**
- Create: `openclaw/skills/cre-acquisition-agent/SKILL.md`
- Create: `openclaw/skills/cre-deal-intake/SKILL.md`
- Create: `openclaw/skills/cre-underwriting-review/SKILL.md`
- Create: `openclaw/skills/cre-due-diligence-coordinator/SKILL.md`
- Create: `openclaw/skills/cre-investment-committee-memo/SKILL.md`
- Create: `openclaw/skills/cre-approval-gate/SKILL.md`

**Verification:**

```bash
node bin/cre-openclaw-agent.mjs validate
```

Expected: all SKILL.md files have frontmatter `name`, `description`, and a top-level heading.

## Task 4: Create workflows and workpad templates

**Objective:** Add OpenClaw workflow docs and workpads that users can copy/install into an OpenClaw workspace.

**Files:**
- Create: `openclaw/workflows/*.md`
- Create: `openclaw/workpads/templates/*.md`

**Verification:**

```bash
node bin/cre-openclaw-agent.mjs validate
```

Expected: workflows include state maps, approval gates, done criteria; workpads include deal ID, workflow, log, and approval sections.

## Task 5: Create file-backed state model

**Objective:** Define deterministic state files and schemas for deals, tasks, approvals, runs, and install manifests.

**Files:**
- Create: `schemas/*.schema.json`
- Create: `openclaw/state/cre-openclaw-agent/README.md`

**Verification:**

```bash
node bin/cre-openclaw-agent.mjs init --workspace ./tmp/plan-check
node bin/cre-openclaw-agent.mjs validate --workspace ./tmp/plan-check
```

Expected: initialized state validates.

## Task 6: Implement CLI foundation

**Objective:** Build a no-dependency Node CLI that supports help, path resolution, safe file operations, state init, install, validation, sample generation, status, and doctor checks.

**Files:**
- Create: `bin/cre-openclaw-agent.mjs`
- Create: `src/cli/index.mjs`
- Create: `src/openclaw/*.mjs`
- Create: `src/state/*.mjs`
- Create: `src/validation/*.mjs`
- Create: `src/generators/*.mjs`
- Create: `src/utils/*.mjs`

**Verification:**

```bash
node bin/cre-openclaw-agent.mjs --help
node bin/cre-openclaw-agent.mjs doctor
node bin/cre-openclaw-agent.mjs validate
```

Expected: commands complete successfully.

## Task 7: Add synthetic sample deal path

**Objective:** Make a first-time visitor path that proves the product without secrets, accounts, or a demo video.

**Files:**
- Create: `examples/sample-deal.json`
- Create: `examples/sample-taskflow.json`
- Create generated sample artifacts under `examples/expected-output/`

**Verification:**

```bash
rm -rf ./tmp/sample-workspace
node bin/cre-openclaw-agent.mjs sample --workspace ./tmp/sample-workspace
node bin/cre-openclaw-agent.mjs status --workspace ./tmp/sample-workspace
node bin/cre-openclaw-agent.mjs validate --workspace ./tmp/sample-workspace
```

Expected: sample workspace has deal state, tasks, approval log, run log, and a workpad.

## Task 8: Add tests and CI

**Objective:** Guard installer behavior, validation, state store, sample generation, and CLI smoke paths.

**Files:**
- Create: `test/*.test.mjs`
- Create: `.github/workflows/ci.yml`
- Create: `.github/workflows/security.yml`

**Verification:**

```bash
npm test
npm run validate
npm run lint
```

Expected: all tests pass locally and in GitHub Actions.

## Task 9: Initialize git and publish

**Objective:** Commit the finished v0.1.0 foundation and publish it to GitHub under `ahacker-1`.

**Commands:**

```bash
gh auth switch -u ahacker-1
git init
git add -A
git commit -m "feat: initial CRE OpenClaw agent release"
gh repo create ahacker-1/cre-openclaw-agent --public --source . --remote origin --push --description "OpenClaw-native CRE acquisition helper with skills, workflows, workpads, state model, validation, and sample artifacts."
gh repo edit ahacker-1/cre-openclaw-agent --enable-issues=true --enable-wiki=false --add-topic openclaw,commercial-real-estate,cre,proptech,ai-agents,workflow-automation,underwriting,due-diligence
```

**Verification:**

```bash
gh repo view ahacker-1/cre-openclaw-agent --json nameWithOwner,visibility,url,defaultBranchRef,licenseInfo
gh run list --repo ahacker-1/cre-openclaw-agent --limit 5
```

Expected: repo is public, default branch is `main`, license is Apache-2.0, and CI run is visible.

## Acceptance criteria

- [ ] Public repository exists at `https://github.com/ahacker-1/cre-openclaw-agent`.
- [ ] Repo is Apache-2.0 with `LICENSE` and `NOTICE`.
- [ ] README clearly references `ahacker-1/cre-acquisition-orchestrator`.
- [ ] No secrets, real deal materials, credentials, or private local paths are committed.
- [ ] `npm test`, `npm run validate`, and `npm run lint` pass locally.
- [ ] CLI can generate and validate a sample workspace.
- [ ] OpenClaw skills/workflows/workpads are installable into a workspace.
- [ ] GitHub Actions CI exists.
