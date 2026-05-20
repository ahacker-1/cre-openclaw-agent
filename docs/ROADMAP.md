# Roadmap

`cre-openclaw-agent` is an OpenClaw-native helper layer for CRE acquisition workflows. It ships Markdown skills, workflows, workpad templates, JSON schemas, and a deterministic local CLI.

## Core idea

Keep heavy dashboard/runtime concerns in `cre-acquisition-orchestrator`; package the OpenClaw-facing deal-room assistant here.

## Safety posture

- No professional advice.
- No default external API calls.
- No real private deal data in samples.
- Explicit approval gates for external, financial, destructive, sensitive, or client-facing actions.
- File-backed state remains inspectable and recoverable.

## Upstream

See https://github.com/ahacker-1/cre-acquisition-orchestrator and this repo's `NOTICE`.
