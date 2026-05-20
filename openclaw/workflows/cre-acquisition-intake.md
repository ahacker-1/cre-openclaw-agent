# CRE Acquisition Intake

## Purpose

Coordinate cre acquisition intake work inside OpenClaw using durable state, visible workpads, explicit missing data, and approval gates.

## Triggers

- User asks to start, review, underwrite, diligence, finance, legally review, or memo a CRE deal.
- New deal document or source context appears.
- Existing deal state needs refresh or approval.

## Required inputs

- Deal name or asset identifier.
- Current objective.
- Available source files or user-provided facts.
- Known constraints, deadline, or decision threshold.

Missing values must be marked `unknown`.

## State map

```text
captured -> normalized -> workpad_created -> intake_reviewed -> ready_for_underwriting
```

Side states:

```text
blocked
approval_needed
parked
cancelled
```

## Allowed local actions

- Create or update local workpads.
- Create or update local file-backed state.
- Draft internal notes, checklists, and memo sections.
- Record blockers, unknowns, and next actions.

## Approval gates

Approval is required before external messages, financial commitments, final recommendations, deletion/overwrite, client-facing output, or sharing confidential material.

## Done criteria

- Workflow state is updated.
- Workpad has current facts, unknowns, risks, approvals, and log entries.
- Next action is clear.
- Any approval need is explicit.

## Proof of work

When possible, run:

```bash
cre-openclaw-agent validate --workspace <workspace>
cre-openclaw-agent status --workspace <workspace>
```
