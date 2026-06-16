# Team Codex Lineage Training Guide

## Goal

Use the shared Sonic lineage runtime package in Codex to answer real Sonic lineage, SSIS, and rule-review questions without creating local drift or editing ingestion engines.

## Start Here

Read these in order:

1. `docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md`
2. `docs/TEAM_CODEX_LINEAGE_ENABLEMENT_BACKLOG.md`
3. `docs/CODEX_LINEAGE_EXECUTION_PACKET_TEMPLATE.md`
4. `docs/LINEAGE_RUNTIME_READBACK_PROCESS.md`
5. `docs/RAW_EVIDENCE_ACCESS_CONTROL.md`

## Codex Setup

Open Codex from the repository root so the repo-scoped skill is available:

```powershell
cd "C:\projects\Data Governence"
```

Use the repo-scoped skill:

```text
$sonic-lineage-consumer
```

If the skill is not visible, restart Codex from the repository root and confirm `.agents/skills/sonic-lineage-consumer/SKILL.md` exists.

## What Teammates Can Do

- Ask what feeds or uses a table.
- Trace SSIS package behavior.
- Review package evidence.
- Compare packaged lineage to raw evidence.
- Submit a rule recommendation.
- Help write support documentation from approved evidence.

## What Teammates Must Not Do

- Edit ingestion engines.
- Edit parser engines.
- Edit extractor code.
- Edit generator code.
- Edit catalog rebuild scripts.
- Treat a private local copy as authoritative.
- Guess missing package paths.
- Start Azure platform work.

## Example Prompts

```text
$sonic-lineage-consumer
Use approved package mode. Tell me what feeds DimVehicle and include package version/hash.
```

```text
$sonic-lineage-consumer
Trace this SSIS package from the approved runtime package and identify source reads, lookup reads, maintenance reads, writes, and package calls.
```

```text
$sonic-lineage-consumer
I think this lineage edge is wrong. Help me create a rule recommendation from the approved package and raw evidence. Do not edit ingestion code.
```

## Recommendation Intake

Use `recommendations/templates/rule-recommendation.md`.

Save new recommendations under:

```text
recommendations/intake/
```

Use a filename like:

```text
YYYY-MM-DD-short-object-or-package-name.md
```

## Evidence Line Requirement

Decision-grade answers must include:

```text
Evidence: package <version>, hash <runtime_content_hash>; artifacts: <paths>.
```

If version or hash is missing, do not use the package for a decision. Report the missing manifest field.

## Escalation

Ask a maintainer when:

- the package is stale
- the path is not advertised
- raw evidence appears unsafe
- a recommendation would require code changes
- a user asks to start Azure platform work

For Azure platform work, Codex must ask:

```text
STOP: Phase 5 starts Azure platform expansion. The package/plugin operating model must be accepted first. Do you want to continue into Azure platform work now?
```
