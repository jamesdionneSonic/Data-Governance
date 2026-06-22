# Rovo Automated Onboarding Contract

This contract defines the target npm-driven onboarding process for new database
catalog documentation.

It implements:

- `docs/adr/ADR-018-Automated-Npm-Catalog-Onboarding-With-Rovo-Hard-Gate.md`
- `docs/adr/ADR-017-Rovo-Assisted-Plain-English-Catalog-Descriptions.md`

## Purpose

Normal new database onboarding should run from npm without Codex orchestration.
Codex may build and maintain the workflow, but npm should run it.

The first pilot target is:

```text
D1-SQL-07A\INST1.Organization
```

## Target Command

```powershell
npm run catalog:onboard -- `
  --connection D1-SQL-07A-INST1 `
  --database Organization `
  --mode incremental `
  --rovo-descriptions auto `
  --publish false
```

## Required Phases

The command must execute these phases in order:

1. load saved connection and scope;
2. extract metadata;
3. build changed-only manifest;
4. build evidence packets;
5. score confidence;
6. generate or publish hidden Rovo context;
7. invoke Rovo or an Atlassian automation bridge;
8. retrieve structured Rovo output;
9. validate Rovo output;
10. apply human-approved overrides;
11. generate human catalog pages;
12. validate human and Rovo artifacts;
13. dry-run or publish changed Confluence pages;
14. write readback.

## Hard Gate

Before implementing phases 2-14 as one end-to-end command, the project must
complete the Rovo output spike.

The spike passes only when Node.js can:

- stage one evidence packet;
- trigger or route it to Rovo;
- retrieve structured Rovo output;
- validate the output;
- prove no Codex LLM wrote the description.

If the spike fails, stop and pivot.

## Required Rovo Output

Rovo output must be machine-readable:

```json
{
  "canonical_id": "",
  "purpose": "",
  "business_use": "",
  "support_notes": [],
  "lineage_summary": "",
  "confidence_used": "strong | medium",
  "unsupported_facts": [],
  "evidence_hash": ""
}
```

Markdown-only output is acceptable only if Node.js can reliably parse it into
the required structure.

## Operating Modes

| Mode            | Behavior                                                    |
| --------------- | ----------------------------------------------------------- |
| `template-only` | Do not invoke Rovo; use deterministic support language.     |
| `stage`         | Generate Rovo context and queue but do not retrieve output. |
| `import`        | Import previously generated Rovo output.                    |
| `auto`          | Invoke Rovo, retrieve output, validate, and continue.       |

## Publish Rules

The command must default to dry-run.

Live Confluence publish requires:

```text
--publish true
```

For broad scopes, the command must also require a bounded page limit or an
approved publish packet.

## Readback

Every run writes a readback containing:

- command arguments;
- source connection alias;
- database and schemas included;
- extraction counts;
- changed page counts;
- Rovo mode;
- Rovo invocation method;
- Rovo success/failure counts;
- validation failures;
- publish status;
- next recommended action.

## Safety Rules

The workflow must not write:

- passwords;
- tokens;
- connection strings;
- raw rows;
- sample values;
- unrestricted runtime payloads.

Weak evidence cannot be auto-enriched by Rovo. It uses deterministic fallback
language.
