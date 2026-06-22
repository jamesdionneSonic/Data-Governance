# Sonic Lineage Runtime Package Compatibility Matrix

## Purpose

This matrix states which Sonic lineage consumers can safely read which runtime
package schema and package version.

Use it before upgrading the runtime package schema, changing the Codex skill
retrieval order, or approving a package for teammate use.

## Current Compatibility

| Consumer                             | Consumer version / location                                    | Supported package schema      | Supported package versions                               | Status              | Notes                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------ | -------------------------------------------------------------- | ----------------------------- | -------------------------------------------------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Repo-scoped Codex skill              | `.agents/skills/sonic-lineage-consumer/SKILL.md` pilot version | `manifest.schema_version = 1` | `2026.6.13-1` approved published package                 | Supported           | Requires deterministic repo-local cache or explicit `LINEAGE_RUNTIME_PACKAGE_ROOT`, `manifest.json`, `latest.json`, `indexes/entrypoints.json`, `indexes/path-contract.json`, `indexes/artifact-manifest.json`, exact answer cards/context packs/SSIS/profile-index paths, stale-package warning behavior, and evidence lines with package version/hash |
| Runtime readback script              | `scripts/check-lineage-runtime-readback.mjs`                   | `manifest.schema_version = 1` | local or clean-cache package with advertised entrypoints | Supported           | Validates advertised paths only; rejects Confluence, local source markdown, and path guessing                                                                                                                                                                                                                                                           |
| Skill smoke script                   | `scripts/check-lineage-runtime-skill-readiness.mjs`            | `manifest.schema_version = 1` | `2026.6.13-1` clean-cache package                        | Supported           | Covers common lineage, usage, profile, database, top-used, confidence, unresolved, and stale/currency prompts                                                                                                                                                                                                                                           |
| SSIS readiness script                | `scripts/check-lineage-runtime-ssis-readiness.mjs`             | `manifest.schema_version = 1` | local package with `ssis/**` package contexts            | Supported           | Covers folder, project, package, source-read, lookup-read, target-maintenance, write/load, package-call, and column-mapping evidence needed by SSIS support docs                                                                                                                                                                                        |
| Runtime package validator            | `scripts/check-lineage-runtime-package.mjs`                    | `manifest.schema_version = 1` | local package root                                       | Supported           | Checks required files, registry counts, profile-index safety, answer cards, forbidden patterns, and package size warnings                                                                                                                                                                                                                               |
| Product/domain documentation builder | `scripts/build-product-domain-docs.mjs`                        | `manifest.schema_version = 1` | local package root                                       | Supported With Care | Uses manifest and canonical registry. Output is documentation support, not a package approval gate                                                                                                                                                                                                                                                      |
| Future workspace plugin              | Not created yet                                                | Not approved                  | None                                                     | Not Supported Yet   | Graduate after pilot acceptance; plugin must pass the same readback and skill smoke gates before use                                                                                                                                                                                                                                                    |
| Azure platform consumer              | Not approved                                                   | Not approved                  | None                                                     | Blocked             | Azure work is behind the Phase 5 hard stop and must not start without explicit approval                                                                                                                                                                                                                                                                 |

## Package Schema `1` Requirements

Schema `1` consumers must be able to read:

- `manifest.json`
- `latest.json`
- `indexes/entrypoints.json`
- `indexes/path-contract.json`
- `indexes/artifact-manifest.json`
- `registry/canonical-objects.jsonl`
- `answers/**`
- `context-packs/**`
- `ssis/**`
- `profile-index/manifest.json`
- `profile-index/latest-summary.json`

Schema `1` consumers must not:

- guess path variants
- mix package versions or hashes
- treat Confluence as a machine readback source
- treat local source markdown as authoritative for ordinary answers
- approve a package without published-package readback and skill smoke evidence

## Approved Package Baseline

As of 2026-06-18:

| Field                           | Value                                                                        |
| ------------------------------- | ---------------------------------------------------------------------------- |
| Package name                    | `sonic-data-lineage-runtime`                                                 |
| Approved published version      | `2026.6.13-1`                                                                |
| Approved published runtime hash | `ab840383d8e4f9b1e1036523965536b03d23f2270959025d63a658f4daeece6e`           |
| Manifest schema                 | `1`                                                                          |
| Skill/readback status           | Passed                                                                       |
| Approval record                 | `docs/LINEAGE_RUNTIME_PACKAGE_APPROVAL_CHECKLIST.md`                         |
| Published readback record       | `docs/lineage-runtime-readbacks/2026-06-18-published-package-2026.6.13-1.md` |
| Skill smoke record              | `docs/lineage-runtime-readbacks/2026-06-18-skill-readiness-2026.6.13-1.md`   |

The current local package build also uses version `2026.6.13-1`, but has local
hash `514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff`.
Because that hash differs from the approved published hash, it must not be
treated as the approved package unless it is published under a new version and
passes the approval checklist again.

## Upgrade Rules

Create a new compatibility row before any of these changes:

- changing `manifest.schema_version`
- adding required manifest fields
- removing or renaming entrypoints
- changing answer-card, context-pack, SSIS, or profile-index path families
- changing package-cache behavior in the skill/plugin
- promoting the repo-scoped skill to a workspace plugin
- introducing an Azure platform consumer

For any breaking package change:

1. Publish or stage the new package under a new version.
2. Run package validation.
3. Run local readback.
4. Download to a clean cache.
5. Run published-package readback.
6. Run the skill smoke suite.
7. Update this matrix, the manifest contract, and the approval checklist.

## Compatibility Decision Rules

| Situation                                                                     | Decision                                           |
| ----------------------------------------------------------------------------- | -------------------------------------------------- |
| Consumer supports the package schema and exact required entrypoints           | Compatible                                         |
| Consumer supports the schema but has not passed readback for the package hash | Not approved yet                                   |
| Package has same version but different hash than the approved package         | Not compatible for approval; publish a new version |
| Package removes or renames advertised paths used by the consumer              | Breaking change                                    |
| Package adds optional fields while preserving schema `1` paths                | Compatible after validation                        |
| Skill/plugin changes retrieval order or cache behavior                        | Requires smoke suite and matrix update             |
