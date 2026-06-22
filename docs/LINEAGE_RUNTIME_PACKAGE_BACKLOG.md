# Lineage Runtime Package Backlog

Purpose: publish the Sonic lineage catalog as a small, machine-readable runtime bundle that Codex, Rovo, and other AI assistants can download and query locally without crawling Confluence.

## Decision

Use an Azure Artifacts Universal Package named `sonic-data-lineage-runtime`.

The package is built from the already validated DevOps catalog repo at `CATALOG_REPO_PATH`. Confluence remains the human governance/search portal. AI tools should use this package first, then open Confluence only for curated explanation, stewardship, policy, or methodology.

## Runtime Contract

Required manifest fields are defined in
`docs/LINEAGE_RUNTIME_PACKAGE_MANIFEST_CONTRACT.md`.
Package/consumer compatibility is tracked in
`docs/LINEAGE_RUNTIME_PACKAGE_COMPATIBILITY_MATRIX.md`.

Required package entrypoints:

- `manifest.json`
- `latest.json`
- `registry/object-registry.jsonl`
- `registry/canonical-objects.jsonl`
- `registry/duplicate-objects.jsonl`
- `registry/unresolved-server-objects.jsonl`
- `registry/object-registry.csv`
- `registry/database-index.json`
- `registry/object-registry-summary.json`
- `indexes/index-manifest.json`
- `indexes/by-name/**`
- `indexes/by-database/**`
- `indexes/by-schema/**`
- `indexes/top-used/**`
- `indexes/aliases/**`
- `indexes/rankings/**`
- `answers/**`
- `AI_README.md`
- `docs/ai-usage-guide.md`
- `docs/runtime-package-guide.md`
- `context-packs/**`
- `ssis/**`

Retrieval order for AI assistants:

1. Load `manifest.json` and verify the expected package name/version.
2. Use `indexes/by-name/`, `indexes/aliases/`, `indexes/by-database/`, `indexes/by-schema/`, `indexes/top-used/`, or `indexes/rankings/` for common lookup and ranking questions.
3. Search `registry/canonical-objects.jsonl` before falling back to `registry/object-registry.jsonl`.
4. Read only the row-specific compact context pack, answer card, or original `context_pack_json_path`.
5. Use Confluence only for human governance explanation or curated context.

Quality gates:

- Package object count must match `catalog-manifest.json`.
- Every registry row must have existing markdown and JSON context pack paths.
- Case-insensitive duplicate object IDs or context paths must fail validation.
- `unknown.Sonic_DW` must not appear anywhere in the runtime package.
- Generated package files should stay below Azure Artifacts practical package limits.

## Mini Backlog

| ID      | Item                                                                                                                                                                                                   | Status           | Evidence                                                                                                                                                                                                                                                                                                          |
| ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RTP-001 | Define package contract and backlog                                                                                                                                                                    | Done             | This file                                                                                                                                                                                                                                                                                                         |
| RTP-002 | Add local package builder                                                                                                                                                                              | Done             | `npm run lineage:runtime:package`                                                                                                                                                                                                                                                                                 |
| RTP-003 | Add local package validator                                                                                                                                                                            | Done             | `npm run lineage:runtime:check`                                                                                                                                                                                                                                                                                   |
| RTP-004 | Add publish wrapper for Azure Artifacts Universal Packages                                                                                                                                             | Done             | `npm run lineage:runtime:publish`                                                                                                                                                                                                                                                                                 |
| RTP-005 | Add feed prerequisites to environment docs                                                                                                                                                             | Done             | `.env.example`                                                                                                                                                                                                                                                                                                    |
| RTP-006 | Generate and validate first local runtime package                                                                                                                                                      | Done             | Local package has `7224` objects, `14975` files, no validation failures                                                                                                                                                                                                                                           |
| RTP-007 | Publish first Universal Package                                                                                                                                                                        | Done             | Published `sonic-data-lineage-runtime` version `2026.6.4-1` to the `Data Warehouse` project feed `sonic-data-lineage-runtime` on 2026-06-05                                                                                                                                                                       |
| RTP-008 | Add optimized runtime indexes, answer cards, and canonical registry splits                                                                                                                             | Done             | Local package version `2026.6.5-1` has `7224` objects, `45073` files, sharded by-name/alias indexes, rankings, answer cards, compact object context packs, and no validation failures                                                                                                                             |
| RTP-009 | Add consumer download/cache helper                                                                                                                                                                     | Superseded       | Current pilot uses `LINEAGE_RUNTIME_PACKAGE_ROOT` plus clean-cache readback; deterministic teammate cache convention remains tracked in `TCE-207`                                                                                                                                                                 |
| RTP-010 | Update Sonic lineage skill to prefer local package cache                                                                                                                                               | Done             | `.agents/skills/sonic-lineage-consumer/SKILL.md` uses the approved runtime package contract and requires version/hash evidence                                                                                                                                                                                    |
| RTP-011 | Update Confluence AI routing copy after package publish                                                                                                                                                | Superseded       | Confluence is treated as human-facing documentation; machine readback and skill smoke tests use the runtime package, not Confluence page-body search                                                                                                                                                              |
| RTP-012 | Add incremental runtime package rebuild and publish skip                                                                                                                                               | Done             | `.build-state.json` tracks copied source hashes, object fingerprints, runtime content hash, and last published hash                                                                                                                                                                                               |
| RTP-013 | Re-run the lineage engine from raw sources, update corrected local markdown, rebuild runtime artifacts, export refreshed DevOps repo contents, and publish/push the resulting package and repo changes | Done With Caveat | Current local package version `2026.6.13-1` was rebuilt from refreshed catalog metadata with `6692` objects; published package version `2026.6.13-1` already exists and passed readback, but its content hash differs from the current local hash, so the current local package needs a new version before upload |
| RTP-014 | Add local runtime readback proof                                                                                                                                                                       | Done             | `npm run lineage:runtime:readback` validates package `2026.6.13-1` from advertised entrypoints only, resolves `factFIRE`, opens answer cards/context packs/profile-index/SSIS routes, and confirms no Confluence, local source markdown, or path guessing was used                                                |
| RTP-015 | Add published package readback proof                                                                                                                                                                   | Done             | Downloaded `sonic-data-lineage-runtime` version `2026.6.13-1` into a clean cache on `2026-06-18`; readback passed with published runtime hash `ab840383d8e4f9b1e1036523965536b03d23f2270959025d63a658f4daeece6e`                                                                                                  |
| RTP-016 | Add package approval checklist                                                                                                                                                                         | Done             | `docs/LINEAGE_RUNTIME_PACKAGE_APPROVAL_CHECKLIST.md` defines validation, publish, readback, and skill smoke gates for each approved package version                                                                                                                                                               |
| RTP-017 | Add SSIS documentation readiness check                                                                                                                                                                 | Done             | `npm run lineage:runtime:ssis-check` validates SSIS folder/project/package navigation plus source-read, lookup-read, target-maintenance, write/load, package-call, and column-mapping evidence                                                                                                                    |
| RTP-018 | Add targeted linked-server alias runtime refresh path                                                                                                                                                  | Done             | `ADR-019`, `docs/CODEX_COR_SQL_LINKED_SERVER_ALIAS_REFRESH_PACKET.md`, `npm run lineage:cor-sql:packet`, and `npm run lineage:cor-sql:refresh` define the `COR-SQL-02` alias-only refresh path                                                                                                                    |
| RTP-019 | Execute `COR-SQL-02` alias-only runtime rebuild and publish                                                                                                                                            | Planned          | Refresh only affected SQL targets, rebuild runtime package, pass readback, sync DevOps repo, publish a new Azure Artifacts version after packet review                                                                                                                                                            |

## Current Local Package Snapshot

The current local package payload under `data/lineage-runtime-package/sonic-data-lineage-runtime`
was generated from the refreshed catalog and has this manifest snapshot:

| Field                                | Value                                                              |
| ------------------------------------ | ------------------------------------------------------------------ |
| Package name                         | `sonic-data-lineage-runtime`                                       |
| Package version                      | `2026.6.13-1`                                                      |
| Schema version                       | `1`                                                                |
| Generated at                         | `2026-06-13T23:31:32.400Z`                                         |
| Source catalog generated at          | `2026-06-13T23:28:21.263Z`                                         |
| Runtime content hash                 | `514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff` |
| Cataloged objects                    | `6692`                                                             |
| Canonical objects                    | `6687`                                                             |
| Duplicate objects                    | `5`                                                                |
| Databases                            | `34`                                                               |
| Context packs                        | `6692`                                                             |
| SSIS package contexts                | `1451`                                                             |
| Registry JSONL rows                  | `6692`                                                             |
| Copied source files                  | `20607`                                                            |
| Generated index files                | `22673`                                                            |
| Answer-card files                    | `33460`                                                            |
| Qualified resolver files             | `21485`                                                            |
| Payload files on disk                | `83461`                                                            |
| Forbidden `unknown.Sonic_DW` records | `0`                                                                |

Current object type counts:

| Object type |  Count |
| ----------- | -----: |
| table       | `3717` |
| package     |  `839` |
| dataset     |  `832` |
| procedure   |  `701` |
| view        |  `568` |
| synonym     |   `19` |
| function    |   `16` |

## Publish Status

- Azure CLI is installed with the Azure DevOps extension.
- Project-scoped Azure Artifacts feed: `sonic-data-lineage-runtime`.
- Previously published Universal Package: `sonic-data-lineage-runtime` version `2026.6.5-1`.
- Current approved published Universal Package: `sonic-data-lineage-runtime` version `2026.6.13-1`.
- Published package `2026.6.13-1` passed clean-cache readback on `2026-06-18`.
- Published package `2026.6.13-1` readback hash: `ab840383d8e4f9b1e1036523965536b03d23f2270959025d63a658f4daeece6e`.
- Published package `2026.6.13-1` Azure Artifacts manifest: `7ECA87A69474F45BAE7EAB27DDDF1237BDED4F9D1C089CE59B9661804E7F32BD02`.
- Published package `2026.6.13-1` Azure Artifacts super root: `F5AAA5B543A5C7717FA4DA210A31368E03EC4A0972C3005E637A75F675EA5D3402`.
- Published package `2026.6.13-1` package size: `1020523800`.
- Incremental package state is stored at `data/lineage-runtime-package/.build-state.json`.
- Current local runtime content hash: `514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff`.
- Local readback validation passed on `2026-06-18` with `npm run lineage:runtime:check`, `npm run lineage:answers:check`, and `npm run lineage:runtime:readback`.
- The published `2026.6.13-1` package hash differs from the current local package hash, so `.build-state.json` was not marked as published for the current local hash. Use a new package version for the current local package if it should be uploaded.
- `npm run lineage:runtime:publish -- --dry-run` for the current local hash reports the intended Azure Artifacts publish command; do not reuse version `2026.6.13-1` for the current local hash because that version already exists with different content.
