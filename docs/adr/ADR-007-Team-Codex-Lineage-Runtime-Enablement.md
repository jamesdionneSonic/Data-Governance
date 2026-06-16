# ADR-007: Use A Versioned Lineage Runtime Package And Team Codex Plugin Before Azure Platform Expansion

## Status

Proposed

## Date

2026-06-16

## Context

The Sonic lineage project now supports more than a local web UI. It is being used as a machine-readable evidence base for SSIS documentation, lineage rule validation, impact analysis, and AI-assisted investigation.

The current working pattern depends on a curated DevOps/catalog repo, generated runtime package artifacts, and selected raw source evidence. If each teammate works from a different local copy, then answers, SSIS documentation, and rule recommendations will drift.

The project also has a long-term Azure platform direction, but Azure application hosting should not be the first dependency for team Codex usage. Teammates first need one approved data version, repeatable retrieval rules, and read-only evidence access.

## Decision

Use a versioned Sonic lineage runtime package as the canonical machine-readable source for Codex and automated consumers.

Distribute team Codex behavior through a plugin or repo-scoped skill that reads the approved runtime package and follows the consumer contract. Do not embed the data payload inside the skill.

Treat Azure-hosted application deployment as a later platform phase that requires an explicit human approval gate before work starts.

## Required Boundaries

- The runtime package is the source of truth for AI lookup, SSIS documentation support, lineage answers, and rule-validation evidence.
- Codex skills/plugins contain workflow, retrieval order, safety rules, and recommendation templates only.
- Raw evidence may be made available read-only for traceability, but teammates must not be able to update ingestion engines, extractor code, parser code, or generator code through the evidence-review workflow.
- Rule recommendations must be submitted as structured proposals and reviewed before any engine change.
- Azure platform expansion must not begin automatically after package/plugin enablement. It requires a hard stop and explicit approval.

## Consequences

- Teammates can work creatively from the same approved package version.
- AI answers can cite package files, context packs, and raw evidence consistently.
- Ingestion and rule-engine ownership remains protected.
- Azure remains the right long-term operating platform, but it is not allowed to mask unresolved package, access, or skill-readback problems.

## Related Documents

- `docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md`
- `docs/TEAM_CODEX_LINEAGE_ENABLEMENT_BACKLOG.md`
- `docs/LINEAGE_RUNTIME_PACKAGE_BACKLOG.md`
- `docs/PROFILE_INDEX_SPEC.md`
- `docs/adr/ADR-003-Codex-Skills-Use-DevOps-Profile-Index-First.md`
- `docs/adr/ADR-006-SSIS-Native-Hierarchy-And-Classified-Lineage.md`
