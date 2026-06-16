---
name: sonic-lineage-consumer
description: Use the approved Sonic lineage runtime package to answer lineage, SSIS documentation, raw-evidence review, and rule-recommendation questions for the team pilot. Use this repo-scoped skill when working from the Data Governance repository or when a teammate asks to use the shared Sonic lineage package. Do not edit ingestion engines from evidence-review workflows.
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

## Required Evidence Line

For decision-grade answers, SSIS documentation outputs, package readback, raw-evidence review, and rule recommendations, include:

`Evidence: package <version>, hash <runtime_content_hash>; artifacts: <paths>.`

If package version or runtime hash is missing, say the package is not decision-grade and name the missing manifest field.

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
