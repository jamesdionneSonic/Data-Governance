# Sonic Lineage Consumer Kit Guidance

This repository is the teammate-facing Codex workspace for Sonic lineage
consumption, read-only evidence review, and rule recommendations.

Before answering lineage or evidence questions, use the repo skill:

```text
$sonic-lineage-consumer
```

Read these files before doing substantive work:

1. `docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md`
2. `docs/CODEX_LINEAGE_EXECUTION_PACKET_TEMPLATE.md`
3. `docs/LINEAGE_RUNTIME_READBACK_PROCESS.md`
4. `docs/RAW_EVIDENCE_ACCESS_CONTROL.md`
5. `docs/TEAM_CODEX_LINEAGE_TRAINING_GUIDE.md`

Do not update, create, or request access to ingestion engines, parser code,
extractor code, generator code, catalog rebuild scripts, app UI/API code, or
platform tests from this repository.

When a teammate finds incorrect lineage or missing evidence, create a structured
recommendation in `recommendations/intake/` using
`recommendations/templates/rule-recommendation.md`.

Decision-grade answers must include:

```text
Evidence: package <version>, hash <runtime_content_hash>; artifacts: <paths>.
```

Do not guess package paths. If a path is not advertised by the package contract,
stop and report the missing contract entry.

Before Azure platform work, production deployment, Azure App Service, Azure SQL,
Blob, Redis, Key Vault, managed identity, private endpoint, production Entra, or
cloud migration work, stop and ask exactly:

```text
STOP: Phase 5 starts Azure platform expansion. The package/plugin operating model must be accepted first. Do you want to continue into Azure platform work now?
```
