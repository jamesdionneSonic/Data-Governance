# Lineage Runtime Package Backlog

Purpose: publish the Sonic lineage catalog as a small, machine-readable runtime bundle that Codex, Rovo, and other AI assistants can download and query locally without crawling Confluence.

## Decision

Use an Azure Artifacts Universal Package named `sonic-data-lineage-runtime`.

The package is built from the already validated DevOps catalog repo at `CATALOG_REPO_PATH`. Confluence remains the human governance/search portal. AI tools should use this package first, then open Confluence only for curated explanation, stewardship, policy, or methodology.

## Runtime Contract

Required package entrypoints:

- `manifest.json`
- `latest.json`
- `registry/object-registry.jsonl`
- `registry/object-registry.csv`
- `registry/database-index.json`
- `registry/object-registry-summary.json`
- `AI_README.md`
- `docs/ai-usage-guide.md`
- `docs/runtime-package-guide.md`
- `context-packs/**`
- `ssis/**`

Retrieval order for AI assistants:

1. Load `manifest.json` and verify the expected package name/version.
2. Search `registry/object-registry.jsonl` by exact object ID, database/schema/name, alias, or SSIS package name.
3. Read only the row-specific `context_pack_path` or `context_pack_json_path`.
4. Use `registry/database-index.json` for database-first browsing.
5. Use Confluence only for human governance explanation or curated context.

Quality gates:

- Package object count must match `catalog-manifest.json`.
- Every registry row must have existing markdown and JSON context pack paths.
- Case-insensitive duplicate object IDs or context paths must fail validation.
- `unknown.Sonic_DW` must not appear anywhere in the runtime package.
- Generated package files should stay below Azure Artifacts practical package limits.

## Mini Backlog

| ID | Item | Status | Evidence |
| --- | --- | --- | --- |
| RTP-001 | Define package contract and backlog | Done | This file |
| RTP-002 | Add local package builder | Done | `npm run lineage:runtime:package` |
| RTP-003 | Add local package validator | Done | `npm run lineage:runtime:check` |
| RTP-004 | Add publish wrapper for Azure Artifacts Universal Packages | Done | `npm run lineage:runtime:publish` |
| RTP-005 | Add feed prerequisites to environment docs | Done | `.env.example` |
| RTP-006 | Generate and validate first local runtime package | Done | Local package has `7224` objects, `14975` files, no validation failures |
| RTP-007 | Publish first Universal Package | Blocked until feed name/auth are confirmed | Requires `AZURE_ARTIFACTS_FEED` and Azure CLI installed/authenticated |
| RTP-008 | Add consumer download/cache helper | Pending | After feed/version behavior is confirmed |
| RTP-009 | Update Sonic lineage skill to prefer local package cache | Pending | After package is published |
| RTP-010 | Update Confluence AI routing copy after package publish | Pending | Link package/feed and DevOps repo |

## Current Baseline

The latest validated DevOps catalog manifest before package work:

- Objects: `7224`
- Databases: `34`
- Context packs: `7224`
- SSIS package contexts: `1432`
- Forbidden `unknown.Sonic_DW` records: `0`

## Current Publish Blockers

- Azure CLI is not installed or not on `PATH` on this machine.
- `AZURE_ARTIFACTS_FEED` is not configured.
- After those are set, run `npm run lineage:runtime:publish -- --dry-run`, then run `npm run lineage:runtime:publish`.
