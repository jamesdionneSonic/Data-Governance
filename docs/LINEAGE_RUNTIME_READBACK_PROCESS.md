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
- Use `LINEAGE_RUNTIME_PACKAGE_ROOT` when explicitly set; otherwise use
  `./.lineage-runtime-cache/sonic-data-lineage-runtime/<version>/sonic-data-lineage-runtime/`.
- Do not scan arbitrary local folders to find a package.
- Do not query Confluence for machine-readable answers.
- Do not open raw evidence until the package resolves the target object or package.
- Report package version and runtime content hash in the result.

## Local Package Readback

Use this when validating a package built in this repo before publishing.

```powershell
npm run lineage:runtime:check
npm run lineage:answers:check
npm run lineage:runtime:readback
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
- SSIS readiness validation passes when the package will support SSIS
  documentation workflows
- readback checks pass from a clean cache
- no missing path is solved by guessing
- no local-only path is required

## Latest Local Readback Result

Validated on 2026-06-18 with:

```powershell
npm run lineage:runtime:check
npm run lineage:answers:check
npm run lineage:runtime:readback
npm run lineage:runtime:ssis-check
```

Result:

```text
Package readback result:
- status: passed
- package version: 2026.6.13-1
- runtime content hash: 514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff
- generated at: 2026-06-13T23:31:32.400Z
- package location: data/lineage-runtime-package/sonic-data-lineage-runtime
- checks passed: runtime package validation, answer-card validation, local readback validation
- checks failed: none
- missing contract entries: none
- decision: approved for local readback; published-package readback still required after DevOps publish
```

The local readback proof resolves
`L1-5FSQL-01.Sonic_DW.dbo.factFIRE` from
`registry/canonical-objects.jsonl`, then opens only the advertised answer-card
and compact-context paths from that registry row:

```text
answers/summary/by-object-id/a489fe2e3fad0e62.json
answers/usage-count/by-object-id/a489fe2e3fad0e62.json
answers/upstream/by-object-id/a489fe2e3fad0e62.json
answers/downstream/by-object-id/a489fe2e3fad0e62.json
answers/profile-teaser/by-object-id/a489fe2e3fad0e62.json
context-packs/objects/by-id/a489fe2e3fad0e62.json
```

The proof also confirms:

- `answers/catalog/databases.json` includes `Sonic_DW`
- `profile-index/manifest.json` and `profile-index/latest-summary.json` are
  present and safety-marked
- `ssis/README.md` is present for SSIS package routing
- Confluence was not used
- local source markdown was not used
- path guessing was not used

## Latest Published Package Readback Result

Validated on 2026-06-18 after downloading Azure Artifacts package
`sonic-data-lineage-runtime` version `2026.6.13-1` to `tmp/rtpkg`.

```text
Package readback result:
- status: passed
- package version: 2026.6.13-1
- runtime content hash: ab840383d8e4f9b1e1036523965536b03d23f2270959025d63a658f4daeece6e
- generated at: 2026-06-13T00:13:32.622Z
- package location: tmp/rtpkg
- checks passed: published-package download, runtime readback, profile-index safety, SSIS route check
- checks failed: none
- missing contract entries: none
- decision: published package approved for readback
```

See
`docs/lineage-runtime-readbacks/2026-06-18-published-package-2026.6.13-1.md`
for the detailed result.

Important: the current local package hash at the time of this validation was
`514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff`, while the
already-published package hash was
`ab840383d8e4f9b1e1036523965536b03d23f2270959025d63a658f4daeece6e`. Because
the existing package version differs from the current local package, the local
build state must not be marked as published for the current hash. Publish the
current local package with a new version if that package is the desired runtime.
