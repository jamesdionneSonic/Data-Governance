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

Clone the consumer-kit repository and open Codex from that repository root so
the repo-scoped skill is available:

```powershell
git clone https://dev.azure.com/sonicapplicationdevelopment/Data%20Warehouse/_git/Sonic-lineage-consumer-kit
cd Sonic-lineage-consumer-kit
codex
```

Use the repo-scoped skill:

```text
$sonic-lineage-consumer
```

If the skill is not visible, restart Codex from the repository root and confirm `.agents/skills/sonic-lineage-consumer/SKILL.md` exists.

## Package Cache

Put the approved package in the repo-local cache unless a maintainer gives you
an explicit `LINEAGE_RUNTIME_PACKAGE_ROOT` path:

```text
./.lineage-runtime-cache/sonic-data-lineage-runtime/<version>/sonic-data-lineage-runtime/
```

Do not point Codex at random old downloads, sibling repos, Confluence exports,
or private Data Governance app folders. If the cache is missing, stop and ask
for the approved package download instructions.

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

For teammate parity checks, run the baseline suite in
`docs/TEAM_CODEX_LINEAGE_SMOKE_PROMPTS.md`.

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
Create a support-doc draft for this SSIS package. Start with a plain-English
summary, then an At a Glance table, support checks, and separated technical
sections for sources, targets, calls, mappings, file/configuration evidence,
runtime/confidence, and caveats. Use package artifacts first; use raw evidence
only after the package resolves the exact package.
```

```text
$sonic-lineage-consumer
I think this lineage edge is wrong. Help me create a rule recommendation from the approved package and raw evidence. Do not edit ingestion code.
```

## SSIS Support Documentation

SSIS support docs should be readable by support first and technical second.

Start from the approved package:

1. Open `ssis/README.md`.
2. Open the matching folder README.
3. Open the matching project README.
4. Open the package `.json` and `.md` artifacts.
5. Use raw SSIS/XML/SQL evidence only after the package identifies the exact
   folder, project, package, and evidence path.

The draft should include:

- plain-English summary with business/data subject, source area, target area,
  and impact if stale or failed
- `At a Glance` table with folder, project, package, role, source count, target
  count, package/procedure calls, mapping count, and evidence path
- concrete support checks for named source/target objects
- separate technical sections for source objects, target objects, package calls,
  stored procedure/utility calls, file/configuration evidence, column mappings,
  confidence/runtime detail, and caveats

Do not edit SSIS generators, extractors, parsers, rebuild scripts, or generated
catalog markdown from this workflow.

## Recommendation Intake

Use `recommendations/templates/rule-recommendation.md`.

Use a recommendation when package evidence appears wrong or incomplete, but the
fix would require changing a rule, parser, extractor, generator, rebuild script,
or generated catalog output.

The recommendation must include:

- package version and runtime content hash
- focus object, package, report, or profile issue
- current behavior from package evidence
- expected behavior
- exact package artifact paths
- exact raw evidence file paths, if raw evidence was needed
- why raw evidence was needed
- business/support impact
- confidence and reason

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

When raw evidence is used, add:

```text
Raw evidence: <exact file paths>; reason: <why package artifacts were not enough>.
```

Do not cite folders, screenshots, Confluence pages, search terms, or private
local working copies as raw evidence.

## Package Currency Warning

The skill compares the package you opened to the approved latest package in
`docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md`.

If the package is older, has the same version with a different hash, or is
missing version/hash metadata, Codex should warn you before giving a
decision-grade answer.

Treat that warning seriously: orientation answers may still be useful, but do
not use stale-package output for impact analysis, support decisions, or rule
recommendations until a maintainer confirms the package.

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
