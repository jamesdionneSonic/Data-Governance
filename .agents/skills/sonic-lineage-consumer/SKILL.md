---
name: sonic-lineage-consumer
description: Use the approved Sonic lineage runtime package to answer lineage, SSIS documentation, raw-evidence review, and rule-recommendation questions for the team pilot. Use this repo-scoped skill when working from the Sonic lineage consumer-kit repository or when a teammate asks to use the shared Sonic lineage package. Do not edit ingestion engines from evidence-review workflows.
---

# Sonic Lineage Consumer

## Required Context

Before answering or taking action, read:

1. `docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md`
2. `docs/CODEX_LINEAGE_EXECUTION_PACKET_TEMPLATE.md`
3. `docs/LINEAGE_RUNTIME_READBACK_PROCESS.md`
4. `docs/RAW_EVIDENCE_ACCESS_CONTROL.md`

For SSIS documentation or SSIS lineage questions, also read:

1. `docs/adr/ADR-006-SSIS-Native-Hierarchy-And-Classified-Lineage.md`

## Source Order

Use approved package mode by default for this skill:

1. `manifest.json`
2. `latest.json`
3. `indexes/entrypoints.json`
4. `indexes/path-contract.json`
5. `indexes/artifact-manifest.json`
6. exact resolver, answer card, context pack, SSIS artifact, or `profile-index/**` shard
7. read-only raw evidence only after the package resolves the object/package

Never guess paths. If the path is not advertised by package contracts, stop and report the missing contract entry.

## Package Cache Location

Use one deterministic package cache location.

Preferred repo-local cache:

`./.lineage-runtime-cache/sonic-data-lineage-runtime/<version>/sonic-data-lineage-runtime/`

If `LINEAGE_RUNTIME_PACKAGE_ROOT` is explicitly set by the user or a readback
packet, use that exact path. Otherwise, use the repo-local cache path above.

Do not scan arbitrary local folders, sibling repositories, old downloads,
Confluence exports, generated catalog repos, or James's local Data Governance
app checkout to find a package. If the expected cache path is missing, stop and
ask for the approved package to be downloaded or for `LINEAGE_RUNTIME_PACKAGE_ROOT`
to be set.

## Package Currency Check

After reading `manifest.json` and `latest.json`, compare the package version and
runtime content hash to the approved latest package listed in
`docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md`.

Warn before decision-grade answers when the package is older than the approved
latest version, when the same version has a different hash, or when version/hash
metadata is missing.

Use this warning format:

`Package currency warning: this answer is using package <version>, hash <hash>. Approved latest is <approved_version>, hash <approved_hash>. Results may be stale or inconsistent with the team-approved package.`

Do not present stale-package output as decision-grade evidence.

## Required Evidence Line

For decision-grade answers, SSIS documentation outputs, package readback, raw-evidence review, and rule recommendations, include:

`Evidence: package <version>, hash <runtime_content_hash>; artifacts: <paths>.`

If package version or runtime hash is missing, say the package is not decision-grade and name the missing manifest field.

When raw evidence is used, the evidence line must also name the exact raw
evidence file paths and state why package artifacts were not enough:

`Raw evidence: <paths>; reason: <why raw evidence was needed>.`

Do not cite folders, search terms, screenshots, Confluence pages, or local
working copies as raw evidence. Cite the exact read-only file path opened from
the approved evidence bundle or advertised package artifact.

## SSIS Documentation Subworkflow

Use this subworkflow when asked to document an SSIS folder, project, package,
master/child chain, source-to-target flow, or support impact.

1. Start in approved package mode. Read `ssis/README.md`, then the exact folder
   README, project README, and package `.json` / `.md` artifact advertised by
   the package.
2. Confirm package currency and include the required evidence line before using
   the result for support decisions.
3. Resolve the native SSIS path as `folder -> project -> package`. Preserve that
   path in the output.
4. Classify evidence from package JSON direct edges:
   - `calls` = parent/child package call
   - `reads`, `extracts`, `used_by` from non-SSIS objects = source or lookup read
   - `loads`, `created_by`, `created_via` to non-SSIS objects = target/write or
     target maintenance
   - `ssis_column_mappings` counts = available mapping detail
5. Produce a support-ready page or answer with this shape:
   - plain-English summary naming the business/data subject, source area,
     landing/target area, and impact if stale or failed
   - `At a Glance` table with folder, project, package, role, source count,
     target count, package/procedure calls, mapping count, and evidence path
   - support checks that name concrete source/target objects when available
   - collapsible or clearly separated technical sections for sources, targets,
     calls, mappings, file/configuration evidence, runtime/confidence, and caveats
6. If a package has child packages, document the master package and each
   same-folder child package separately. Do not flatten child evidence into the
   parent without saying which child owns it.
7. Use read-only raw evidence only after the package has resolved the exact
   object/package and only to verify unclear configuration, file/path, SQL, or
   mapping claims.

Do not edit SSIS documentation generators, package extractors, parsers, rebuild
scripts, or generated catalog markdown from this teammate workflow. If the
package evidence is wrong or incomplete, create a rule/documentation
recommendation instead.

## Rule Recommendation Subworkflow

Use this subworkflow when a teammate says lineage is wrong, an SSIS package is
misclassified, a source/target edge is missing or overcaptured, a package/file
detail is incomplete, or a plain-English summary needs a rule change.

1. Stay in approved package mode first. Resolve the object, package, report, or
   profile issue from `manifest.json`, `latest.json`, advertised indexes,
   answer cards, context packs, `ssis/**`, or `profile-index/**`.
2. Record package version, runtime content hash, and exact package artifact
   paths before opening raw evidence.
3. Use read-only raw evidence only when package artifacts cannot prove the
   current/expected behavior. Cite exact raw evidence file paths and explain
   why raw evidence was needed in the `Raw evidence:` line.
4. Do not edit ingestion engines, parser engines, extractor code, generator
   code, rebuild scripts, generated markdown, or runtime package files.
5. Create or draft a recommendation using
   `recommendations/templates/rule-recommendation.md`.
6. Save new teammate-ready recommendations under `recommendations/intake/` with
   a filename like `YYYY-MM-DD-short-object-or-package-name.md`.
7. Fill in:
   - package evidence
   - focus object/package
   - current behavior
   - expected behavior
   - package artifact paths
   - raw evidence paths, if used
   - business/support impact
   - recommendation type
   - confidence and reason

If the user asks to implement the recommendation, explain that teammate mode
submits review-ready recommendations only. Maintainers convert accepted
recommendations into tests and engine changes separately.

## Hard Boundaries

- Do not update ingestion engines.
- Do not update parser engines.
- Do not update extractor code.
- Do not update generator code.
- Do not update catalog rebuild scripts.
- Do not use private local lineage copies as authoritative.
- Do not bypass package validation gates.
- Do not start Azure platform work without the required Phase 5 hard stop approval.

If a teammate finds bad lineage, produce a recommendation in `recommendations/intake/` using `recommendations/templates/rule-recommendation.md`.

## Azure Phase 5 Stop

Before Azure platform expansion, production deployment, Azure App Service, Azure SQL, Blob, Redis, Key Vault, managed identity, private endpoint, production Entra, or cloud migration work, stop and ask exactly:

`STOP: Phase 5 starts Azure platform expansion. The package/plugin operating model must be accepted first. Do you want to continue into Azure platform work now?`
