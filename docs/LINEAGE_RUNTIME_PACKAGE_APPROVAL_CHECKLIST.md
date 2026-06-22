# Sonic Lineage Runtime Package Approval Checklist

## Purpose

Use this checklist before declaring a Sonic lineage runtime package approved for
Codex skill use, teammate evidence review, SSIS support documentation, or any
downstream automation.

This checklist is intentionally package-first. Confluence is not a machine
readback gate.

## Package Under Review

Required manifest fields are defined in
`docs/LINEAGE_RUNTIME_PACKAGE_MANIFEST_CONTRACT.md`.
Consumer compatibility is defined in
`docs/LINEAGE_RUNTIME_PACKAGE_COMPATIBILITY_MATRIX.md`.

| Field                       | Value                                 |
| --------------------------- | ------------------------------------- |
| Package name                | `sonic-data-lineage-runtime`          |
| Package version             |                                       |
| Runtime content hash        |                                       |
| Generated at                |                                       |
| Source catalog generated at |                                       |
| Reviewer                    |                                       |
| Review date                 |                                       |
| Decision                    | `approved / rejected / needs rebuild` |

## Required Gates

| Gate                                   | Command / Evidence                                                                        | Required Result                                                                                                                                                                      | Status |
| -------------------------------------- | ----------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------ |
| Runtime package validation             | `npm run lineage:runtime:check`                                                           | `status: ok`, no failures                                                                                                                                                            |        |
| Answer-card validation                 | `npm run lineage:answers:check`                                                           | `status: passed`                                                                                                                                                                     |        |
| Local package readback                 | `npm run lineage:runtime:readback`                                                        | Uses advertised package paths only; no Confluence, local source markdown, or path guessing                                                                                           |        |
| Profile-index safety                   | Covered by `lineage:runtime:check` and `lineage:runtime:readback`                         | `profile_index_safe=true`, `raw_data_captured=false`, `raw_values_retained=false`, `secret_exposed=false`                                                                            |        |
| SSIS documentation readiness           | `npm run lineage:runtime:ssis-check`                                                      | Folder, project, package, source-read, lookup-read, target-maintenance, write/load, package-call, and column-mapping prompts are covered                                             |        |
| Cache convention                       | Skill docs and readback packet                                                            | Consumer uses explicit `LINEAGE_RUNTIME_PACKAGE_ROOT` or `./.lineage-runtime-cache/sonic-data-lineage-runtime/<version>/sonic-data-lineage-runtime/`; no arbitrary local folder scan |        |
| Publish dry-run                        | `npm run lineage:runtime:publish -- --dry-run`                                            | Shows intended feed, version, hash, and Azure Artifacts command; no missing feed/name/version                                                                                        |        |
| Live publish or existing-version proof | `npm run lineage:runtime:publish` or documented Azure Artifacts existing-version result   | Package is uploaded, or existing version is proven and intentionally reused                                                                                                          |        |
| Published package download             | `az artifacts universal download ... --path <clean-cache>`                                | Download succeeds into a clean cache                                                                                                                                                 |        |
| Published package readback             | `$env:LINEAGE_RUNTIME_PACKAGE_ROOT='<clean-cache>'; npm run lineage:runtime:readback`     | Published package passes readback from the clean cache                                                                                                                               |        |
| Skill prompt smoke suite               | `$env:LINEAGE_RUNTIME_PACKAGE_ROOT='<clean-cache>'; npm run lineage:runtime:skill-check`  | Prompt suite passes and emits evidence lines with package version/hash/artifacts                                                                                                     |        |
| Teammate smoke prompt suite            | `docs/TEAM_CODEX_LINEAGE_SMOKE_PROMPTS.md`                                                | Baseline prompts cover feeds, uses, SSIS trace, rule recommendation, and confidence/caveat behavior                                                                                  |        |
| Documentation update                   | Update `docs/LINEAGE_RUNTIME_READBACK_PROCESS.md` and `docs/lineage-runtime-readbacks/**` | Version, hash, evidence, caveats, and decision are recorded                                                                                                                          |        |

## Mandatory Prompt Coverage

The skill prompt smoke suite must cover:

- `what uses this?`
- `what feeds this?`
- `what breaks if this changes?`
- `how many times is this used?`
- `show column impact`
- `profile summary`
- `database summary`
- `top-used objects`
- `trace SSIS package`
- `summarize SSIS folder/project support impact`
- `explain confidence`
- unresolved, ambiguity, truncation, and stale-source/currency warnings

## Approval Rules

Approve only when:

- runtime package validation passes
- answer-card validation passes
- profile-index safety validation passes
- published package readback passes from a clean cache
- skill prompt smoke suite passes from the same clean cache
- every decision-grade answer can cite package version, runtime content hash, and artifact paths
- no check relies on Confluence page-body search
- no check relies on private local source markdown
- no missing package path is solved by guessing

Reject or mark `needs rebuild` when:

- package version and runtime hash do not match the intended build
- the package exists in the feed but has a different runtime content hash than
  the local build under review
- profile-index safety flags fail
- any answer-card or context-pack artifact path is missing
- the skill smoke suite requires raw source markdown for ordinary answers
- the package has known stale-source caveats that are not surfaced in user-facing language

## Current Approved Package

As of 2026-06-18:

| Field                          | Value                                                                                                                                                    |
| ------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Package version                | `2026.6.13-1`                                                                                                                                            |
| Published runtime content hash | `ab840383d8e4f9b1e1036523965536b03d23f2270959025d63a658f4daeece6e`                                                                                       |
| Published readback             | Passed                                                                                                                                                   |
| Skill smoke suite              | Passed                                                                                                                                                   |
| Evidence                       | `docs/lineage-runtime-readbacks/2026-06-18-published-package-2026.6.13-1.md`; `docs/lineage-runtime-readbacks/2026-06-18-skill-readiness-2026.6.13-1.md` |

Important: the current local package hash recorded during the same review was
`514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff`, which is
different from the published package hash. If that local package is desired, it
must be published with a new package version and this checklist must be rerun.
