# Data Governance Codex Guidance

## Team Lineage Consumer Kit

Do not give teammates the full Data Governance app repository when their role is
lineage consumption, read-only evidence review, or rule recommendation.

The team-facing Codex skill and consumer workflow belong in the separate Azure
DevOps repository:

`https://dev.azure.com/sonicapplicationdevelopment/Data%20Warehouse/_git/Sonic-lineage-consumer-kit`

When the user asks to update the teammate Codex skill, training guide, consumer
contract, raw evidence access rules, runtime readback process, or recommendation
intake workflow, update the consumer-kit repository first. Only update this app
repo when the change affects ingestion engines, parser/extractor/generator code,
runtime package publishing, app UI/API behavior, or maintainer governance.

The Data Governance app repo remains maintainer-only for ingestion engines,
extractors, parsers, generators, rebuild scripts, UI, API, and tests.

Teammate-facing repositories must not expose:

- ingestion engine code
- parser or extractor code
- generator code
- catalog rebuild scripts
- secrets, credentials, connection strings, or raw row/sample data

See `docs/adr/ADR-008-Separate-Lineage-Consumer-Kit-Repo.md` and
`docs/SONIC_LINEAGE_CONSUMER_KIT_REPO.md` before changing the consumer workflow.
