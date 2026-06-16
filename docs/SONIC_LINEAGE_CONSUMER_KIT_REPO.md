# Sonic Lineage Consumer Kit Repository

## Canonical Repository

The teammate-facing Sonic lineage Codex kit is distributed from this private
Azure DevOps repository:

```text
https://dev.azure.com/sonicapplicationdevelopment/Data%20Warehouse/_git/Sonic-lineage-consumer-kit
```

The generated lineage evidence repository remains:

```text
https://dev.azure.com/sonicapplicationdevelopment/Data%20Warehouse/_git/Sonic-data-lineage
```

## Purpose

The consumer-kit repository exists so teammates can use Codex against approved
lineage evidence without receiving the full Data Governance app source code.

It contains only:

- `AGENTS.md`
- `.agents/skills/sonic-lineage-consumer/SKILL.md`
- `docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md`
- `docs/CODEX_LINEAGE_EXECUTION_PACKET_TEMPLATE.md`
- `docs/LINEAGE_RUNTIME_READBACK_PROCESS.md`
- `docs/RAW_EVIDENCE_ACCESS_CONTROL.md`
- `docs/TEAM_CODEX_LINEAGE_TRAINING_GUIDE.md`
- `docs/SONIC_LINEAGE_CONSUMER_KIT_REPO.md`
- `recommendations/README.md`
- `recommendations/intake/`
- `recommendations/reviewed/`
- `recommendations/templates/rule-recommendation.md`

## Excluded From This Repo

The consumer-kit repository must not contain:

- ingestion engine code
- parser code
- extractor code
- generator code
- catalog rebuild scripts
- app UI/API source
- unit or integration tests for the platform engines
- credentials, tokens, connection strings, or vault references
- raw row values, sample values, report result rows, or unrestricted source
  payloads

## Teammate Setup

Teammates should clone the consumer-kit repository, open that folder in Codex,
and invoke the repo-scoped skill:

```powershell
git clone https://dev.azure.com/sonicapplicationdevelopment/Data%20Warehouse/_git/Sonic-lineage-consumer-kit
cd Sonic-lineage-consumer-kit
codex
```

Then in Codex:

```text
$sonic-lineage-consumer
```

Recommended first prompt:

```text
$sonic-lineage-consumer

Read the team training guide and runtime consumer contract. Explain how I should
use this repo to answer lineage questions, review read-only evidence, and submit
recommendations without changing ingestion engines.
```

## Maintainer Update Rule

When updating teammate-facing Codex behavior from the Data Governance app repo,
update the Azure DevOps consumer-kit repo first.

Update the Data Governance app repo only when the change requires platform code,
runtime package publishing behavior, parser/extractor/generator logic, tests, or
maintainer governance.

## Promotion Path

The consumer-kit repo is the pilot distribution model. After the workflow is
stable, it may be packaged as a Codex plugin and shared through the Codex plugin
UI or a workspace marketplace. The plugin must still read approved lineage
packages and must not embed the data payload.
