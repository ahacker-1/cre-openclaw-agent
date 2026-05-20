---
name: cre-underwriting-review
description: Use when reviewing CRE underwriting assumptions, missing data, risks, and source-backed facts.
license: Apache-2.0
---

# CRE Underwriting Review

## Purpose

Use when reviewing CRE underwriting assumptions, missing data, risks, and source-backed facts.

## Use when

- The user is working on a commercial real estate acquisition, underwriting, diligence, financing, legal/PSA, or IC memo workflow.
- The user needs a durable OpenClaw workpad rather than a one-off chat answer.
- The action should preserve assumptions, missing data, risks, approvals, and an audit log.

## Operating rules

1. Treat user-provided facts and extracted facts as candidates until reviewed.
2. Mark unknown values as `unknown`; do not guess financial or legal inputs.
3. Write durable state under `state/cre-openclaw-agent/` when operating inside an OpenClaw workspace.
4. Use workpads for visible reasoning, task state, risks, missing data, and logs.
5. Require approval before external, financial, destructive, sensitive, or client-facing actions.
6. Include disclaimers when drafting investment, legal, financing, or IC-facing material.

## Approval-gated actions

Ask for explicit approval before:

- Sending emails, texts, LOIs, term sheets, diligence requests, or lender packages.
- Changing deal terms, recommendations, or approved assumptions.
- Sharing confidential deal materials externally.
- Deleting or overwriting state.
- Representing output as final professional advice.

## CLI support

When the CLI is available, prefer verified local operations:

```bash
npx cre-openclaw-agent validate --workspace <workspace>
npx cre-openclaw-agent status --workspace <workspace>
npx cre-openclaw-agent sample --workspace <workspace>
```

## Output standard

Return:

- Current workflow state
- Deal facts used and missing facts
- Risks or blockers
- Approval needed, if any
- Files created or updated
- Next recommended action
