# Repo-Scoped Codex Assets

This folder contains maintainer-side Codex assets for the Data Governance
repository.

Teammate-facing lineage consumer assets are distributed from the separate Azure
DevOps repo:

`https://dev.azure.com/sonicapplicationdevelopment/Data%20Warehouse/_git/Sonic-lineage-consumer-kit`

## Available Skills

- `sonic-lineage-consumer`: pilot skill for consuming the approved Sonic lineage runtime package, reviewing read-only evidence, and submitting rule recommendations without editing ingestion engines.

## Maintainer Setup

Open Codex from this app repository root:

```powershell
cd "C:\projects\Data Governence"
```

Codex discovers repo-scoped skills under `.agents/skills` when working in this
repository.

For teammate onboarding, use the consumer-kit repository instead of this full app
repository.

For rollout steps, read:

- `docs/TEAM_CODEX_LINEAGE_TRAINING_GUIDE.md`
- `docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md`
- `docs/LINEAGE_RUNTIME_READBACK_PROCESS.md`
