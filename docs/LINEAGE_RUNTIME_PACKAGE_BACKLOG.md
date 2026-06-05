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

| ID | Item | Status | Evidence |
| --- | --- | --- | --- |
| RTP-001 | Define package contract and backlog | Done | This file |
| RTP-002 | Add local package builder | Done | `npm run lineage:runtime:package` |
| RTP-003 | Add local package validator | Done | `npm run lineage:runtime:check` |
| RTP-004 | Add publish wrapper for Azure Artifacts Universal Packages | Done | `npm run lineage:runtime:publish` |
| RTP-005 | Add feed prerequisites to environment docs | Done | `.env.example` |
| RTP-006 | Generate and validate first local runtime package | Done | Local package has `7224` objects, `14975` files, no validation failures |
| RTP-007 | Publish first Universal Package | Done | Published `sonic-data-lineage-runtime` version `2026.6.4-1` to the `Data Warehouse` project feed `sonic-data-lineage-runtime` on 2026-06-05 |
| RTP-008 | Add optimized runtime indexes, answer cards, and canonical registry splits | Done | Local package version `2026.6.5-1` has `7224` objects, `45073` files, sharded by-name/alias indexes, rankings, answer cards, compact object context packs, and no validation failures |
| RTP-009 | Add consumer download/cache helper | Pending | After optimized package is published |
| RTP-010 | Update Sonic lineage skill to prefer local package cache | Pending | After optimized package is published |
| RTP-011 | Update Confluence AI routing copy after package publish | Pending | Link package/feed and DevOps repo |
| RTP-012 | Add incremental runtime package rebuild and publish skip | Done | `.build-state.json` tracks copied source hashes, object fingerprints, runtime content hash, and last published hash |
| RTP-013 | Re-run the lineage engine from raw sources, update corrected local markdown, rebuild runtime artifacts, export refreshed DevOps repo contents, and publish/push the resulting package and repo changes | In Progress | `npm run lineage:semantic:refresh` completed on `2026-06-05`, rebuilding `7224` markdown objects, refreshing runtime indexes, exporting `C:\projects\Sonic-data-lineage`, and rebuilding the runtime package; final publish/push still pending |

## Current Baseline

The latest validated DevOps catalog manifest before package work:

- Objects: `7224`
- Databases: `34`
- Context packs: `7224`
- SSIS package contexts: `1432`
- Forbidden `unknown.Sonic_DW` records: `0`

## Publish Status

- Azure CLI is installed with the Azure DevOps extension.
- Project-scoped Azure Artifacts feed: `sonic-data-lineage-runtime`.
- Latest published Universal Package: `sonic-data-lineage-runtime` version `2026.6.5-1`.
- Feed read-back confirmed the package as latest in the `Local` view with publish date `2026-06-05T09:43:21Z`.
- Optimized package publish returned Azure Artifacts manifest `4B9CCB640B8A6AF02A3D6345EAEEE4D0D170EACCCA6B7E8044112E337F6E51F202` and super root `6D14D59E263253814BE14835EFEB5DF8A71D1D20E4EEA219A0CCFEE5C4830CB902`.
- Read-back for `2026.6.5-1` is currently blocked by local Azure CLI extension metadata permissions: `Access is denied: C:\Users\james.dionne\.azure\cliextensions\azure-devops\azure_devops-1.0.4.dist-info`.
- Incremental package state is stored at `data/lineage-runtime-package/.build-state.json`.
- Current runtime content hash: `ef96f608190468dabb25ba07da93eba293597e9b166dea96939eb68f9069dc78`.
- `npm run lineage:runtime:publish -- --dry-run` now returns `skipped` when this hash already matches the last recorded successful publish.
