# Codex Rovo Description Generation Packet

Use this packet when building or running the Rovo-assisted description workflow.

This packet keeps Codex out of the description-writing LLM path. Codex may
modify code, run deterministic extraction, generate packets, validate outputs,
and publish approved artifacts. Rovo generates the strong/medium plain-English
catalog descriptions.

## Required Reading

1. `AI_README.md`
2. `AGENTS.md`
3. `docs/adr/ADR-017-Rovo-Assisted-Plain-English-Catalog-Descriptions.md`
4. `docs/ROVO_DESCRIPTION_GENERATION_CONTRACT.md`
5. `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
6. `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`
7. `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`
8. `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`

## Pilot Scope

```text
Server: D1-SQL-07A\INST1
Database: Organization
Mode: incremental pilot
Live publish: only after explicit approval
Description LLM: Rovo only
```

## Goal

Build a repeatable incremental onboarding process where new databases receive:

- complete deterministic metadata pages;
- hidden Rovo context pages;
- Rovo-authored descriptions for strong/medium evidence;
- deterministic fallback language for weak evidence;
- durable human-approved override support;
- changed-only publishing.

## Allowed Work

- Add or update ADRs, contracts, backlog docs, and work packets.
- Add dry-run-only scripts or engine modules for the Organization pilot.
- Register or use a saved SQL metadata connector if credentials are already
  configured through the framework.
- Generate evidence packets and confidence scores.
- Generate hidden Rovo context artifacts.
- Generate Rovo prompt/request queue artifacts.
- Import Rovo output from a controlled review/export artifact.
- Validate descriptions against the contract.
- Publish only after explicit user approval.

## Not Allowed Without Separate Approval

- Use Codex as the LLM writer for catalog descriptions.
- Publish live Confluence pages without a reviewed packet.
- Change production source systems.
- Store credentials, tokens, connection strings, raw rows, or sample values.
- Permission-lock Rovo context away from intended Rovo users unless the user
  approves a security exception.
- Run a full catalog rebuild when the requested scope is one database.

## Required Outputs

Dry-run output should include:

```text
data/confluence/organization-rovo-pilot/
  manifest.json
  inventory.json
  evidence-packets/
  confidence-report.json
  rovo-context/
  rovo-description-queue.json
  rovo-description-import.json
  human-pages/
  validation-report.json
```

The final live readback, if approved and executed, should be written under:

```text
docs/organization-rovo-description-pilot/
```

## Suggested Commands

Command names may be added during implementation:

```powershell
npm run catalog:organization:inventory
npm run catalog:organization:dry-run
npm run rovo:organization:context
npm run rovo:organization:description-queue
npm run rovo:organization:description-import
npm run catalog:organization:validate
npm run confluence:organization:dry-run
npm run confluence:organization:publish
```

## Validation Checklist

- Organization database is onboarded incrementally.
- All included schemas and objects are accounted for.
- Every page has deterministic metadata detail.
- Hidden Rovo context is generated outside normal human navigation.
- Rovo description queue includes only strong/medium evidence.
- Weak evidence receives deterministic support text.
- Imported Rovo descriptions pass the contract.
- Human overrides win over Rovo and template text.
- The Data Team footer is present.
- No Codex-authored LLM descriptions are used.
- No secrets, credentials, raw rows, sample values, or connection strings are
  published.
