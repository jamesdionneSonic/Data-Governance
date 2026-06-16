# Sonic Lineage Runtime Consumer Contract

## Purpose

This contract defines how teammates, Codex skills/plugins, scripts, and future services consume Sonic lineage data without creating local drift or unsafe write paths.

## Canonical Sources

| Source                         | Purpose                                                                                             | Write Access                   |
| ------------------------------ | --------------------------------------------------------------------------------------------------- | ------------------------------ |
| Versioned runtime package      | Primary machine-readable source for Codex, scripts, SSIS documentation support, and lineage answers | Publisher pipeline only        |
| DevOps Sonic data lineage repo | Human-inspectable generated catalog and evidence package                                            | Publisher pipeline only        |
| Raw evidence bundle            | Read-only traceability for table/procedure/package investigation                                    | Publisher pipeline only        |
| Data Governance app repo       | Ingestion engines, extractors, parsers, generators, UI, API, tests                                  | Maintainers only               |
| Recommendation queue           | Teammate rule and documentation recommendations                                                     | Teammates may submit proposals |

## Required Runtime Package Entrypoints

Consumers must start with:

1. `manifest.json`
2. `latest.json`
3. `indexes/entrypoints.json`
4. `indexes/path-contract.json`
5. `registry/canonical-objects.jsonl`
6. The smallest relevant `indexes/**`, `answers/**`, `context-packs/**`, `ssis/**`, or `profile-index/**` artifact

Consumers must not guess path variants when `indexes/path-contract.json` or `indexes/artifact-manifest.json` marks a path unavailable.

## Version And Hash Rules

- Every approved package must have a package version, generated timestamp, runtime content hash, object count, database count, and validation status.
- Codex answers must report the package version when the user is making a decision from the data.
- Teammates must not mix files from different package versions in one investigation.
- Package readback validation must prove that a clean consumer can open the published package and answer baseline questions without local-only files.

## Raw Evidence Access Policy

Raw evidence should be available to teammates only when it is required for traceability, rule review, or documentation review.

Allowed:

- read-only SSIS XML evidence or parsed evidence extracts needed to trace package behavior
- read-only SQL/module text or generated markdown needed to verify lineage claims
- read-only context packs and answer cards
- read-only parser evidence summaries
- structured rule recommendation forms with evidence paths and proposed expected behavior

Not allowed:

- write access to ingestion engines, parser engines, extractor code, generator code, or catalog rebuild scripts
- direct edits to generated markdown as the permanent fix
- raw row values, sample values, report result rows, unrestricted API payloads, credentials, tokens, connection strings, or vault references
- local private copies treated as authoritative
- bypassing validation gates to publish a new package

## Recommendation Workflow

Teammates may submit rule recommendations. A recommendation must include:

- package version and runtime content hash
- focus object or package path
- observed current behavior
- expected behavior
- evidence artifact paths
- impact if accepted
- confidence level
- reviewer/owner

Recommendations must be stored separately from ingestion engine code. Maintainers decide whether to update rules, tests, documentation, or reject the recommendation.

## Codex Skill/Plugin Requirements

The team Codex plugin or skill must:

- read the approved package before scanning raw evidence
- cite package artifacts used as evidence
- use `profile-index/` first for profile, quality, metric, sensitivity, and freshness questions
- distinguish direct lineage from lookup, maintenance, contextual, inferred, and unresolved evidence
- refuse to update ingestion engines from teammate evidence-review workflows
- produce rule recommendations instead of code changes unless a maintainer explicitly asks for implementation
- stay executable by a balanced/medium model setting by using deterministic retrieval steps and compact artifacts

## Validation Gates

Minimum gates before a package is approved:

- package validation passes
- answer-card quality check passes
- profile-index safety validation passes
- no forbidden raw values or secrets are present
- readback from the published location succeeds
- skill/plugin smoke prompts pass
- recommendation workflow stores proposals without touching ingestion code

## Hard Stop Before Azure Platform Phase

Azure platform work must not start until the package, consumer contract, plugin/skill, readback validation, and raw-evidence access controls are accepted.

Before Azure work begins, Codex must stop and ask:

`STOP: Phase 5 starts Azure platform expansion. The package/plugin operating model must be accepted first. Do you want to continue into Azure platform work now?`

No Azure deployment, production auth, managed storage, production networking, or cloud migration work should proceed without explicit user approval after that prompt.
