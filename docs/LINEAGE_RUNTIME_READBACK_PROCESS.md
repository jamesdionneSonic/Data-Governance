# Sonic Lineage Runtime Readback Process

## Purpose

Readback proves that a teammate or clean Codex consumer can use the approved Sonic lineage runtime package without relying on James's local folders, unpublished files, Confluence page-body search, or ingestion-engine access.

## Required Inputs

| Input                                  | Required |
| -------------------------------------- | -------- |
| Runtime package location or cache path | Yes      |
| Package version                        | Yes      |
| Runtime content hash                   | Yes      |
| `manifest.json`                        | Yes      |
| `latest.json`                          | Yes      |
| `indexes/entrypoints.json`             | Yes      |
| `indexes/path-contract.json`           | Yes      |
| `indexes/artifact-manifest.json`       | Yes      |

## Readback Rules

- Use only advertised paths from the package contracts.
- Do not guess path variants.
- Do not use private local lineage repos as authoritative.
- Do not query Confluence for machine-readable answers.
- Do not open raw evidence until the package resolves the target object or package.
- Report package version and runtime content hash in the result.

## Local Package Readback

Use this when validating a package built in this repo before publishing.

```powershell
npm run lineage:runtime:check
npm run lineage:answers:check
```

Then verify these exact files exist in the package root:

```text
manifest.json
latest.json
indexes/entrypoints.json
indexes/path-contract.json
indexes/artifact-manifest.json
registry/canonical-objects.jsonl
answers/catalog/databases.json
profile-index/manifest.json
profile-index/latest-summary.json
```

## Published Package Readback

Use this after a package is published to the approved DevOps/Azure Artifacts location.

1. Download or mount the published package into a clean cache location.
2. Open only package-advertised entrypoints.
3. Record package version, runtime content hash, object count, and generated timestamp.
4. Run the baseline prompt checks below.
5. Mark the package approved only if every baseline prompt can be answered without local-only paths.

## Baseline Prompt Checks

| Check                     | Expected Artifact Route                                                 |
| ------------------------- | ----------------------------------------------------------------------- |
| Catalog databases         | `answers/catalog/databases.json`                                        |
| Resolve a known table     | `indexes/resolve/by-qualified-name/**` or advertised name index         |
| Summarize a known table   | `answers/summary/by-object-id/**`                                       |
| Show upstream/downstream  | `answers/upstream/**`, `answers/downstream/**`, or compact context pack |
| Show profile availability | `answers/profile-teaser/**` then `profile-index/**` if needed           |
| Trace an SSIS package     | advertised `ssis/**` package/project artifacts                          |

## Readback Result Template

```text
Package readback result:
- status:
- package version:
- runtime content hash:
- generated at:
- package location:
- checks passed:
- checks failed:
- missing contract entries:
- decision: approved / rejected / needs rebuild
```

## Approval Standard

A package is approved for teammate Codex use only when:

- runtime validation passes
- answer-card validation passes
- profile-index safety validation passes
- readback checks pass from a clean cache
- no missing path is solved by guessing
- no local-only path is required
