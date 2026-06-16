# ADR-008: Use A Separate Azure DevOps Repo For The Team Lineage Consumer Kit

## Status

Accepted

## Date

2026-06-16

## Context

The Data Governance app repository contains the platform source code, including
ingestion engines, extractors, parsers, generators, catalog rebuild scripts, UI,
API, and tests. Teammates who only need to consume lineage, inspect read-only
evidence, and submit rule recommendations do not need that full source tree.

Sharing the full app repository would create unnecessary access risk and would
make it easier for non-maintainer workflows to edit ingestion or rule-engine
implementation files. It would also mix two different responsibilities:

- maintaining the platform that builds and publishes lineage evidence
- consuming approved lineage evidence to answer questions and propose fixes

The team needs a small, governed Codex workspace that can be cloned locally,
opened in Codex, and used without exposing the full app implementation.

## Decision

Create a separate private Azure DevOps repository named
`Sonic-lineage-consumer-kit` in the `Data Warehouse` project.

Use that repository as the team-facing distribution point for:

- the repo-scoped Codex consumer skill
- runtime consumer contract
- runtime package readback process
- raw evidence access controls
- teammate training guide
- recommendation intake folders and templates
- lightweight guidance for using the approved lineage package

Do not place platform ingestion engines, parsers, extractors, generators, rebuild
scripts, UI code, API code, tests, secrets, credentials, connection strings, raw
row values, or unrestricted source payloads in the consumer-kit repository.

## Repository Boundary

| Repository                      | Purpose                                                                                | Typical access                                           |
| ------------------------------- | -------------------------------------------------------------------------------------- | -------------------------------------------------------- |
| Data Governance app repo        | Maintains the platform that extracts, builds, validates, publishes, and serves lineage | Maintainers only                                         |
| Sonic-data-lineage repo         | Generated lineage catalog and evidence package published by the platform               | Read-only for consumers; publisher write                 |
| Sonic-lineage-consumer-kit repo | Codex skill, contracts, training, and recommendation intake for teammates              | Read/write for recommendation authors; maintainer review |

## Required Workflow

1. Teammates clone `Sonic-lineage-consumer-kit`, not the full app repo.
2. Teammates open that repo in Codex.
3. Teammates invoke `$sonic-lineage-consumer`.
4. The skill reads the approved lineage runtime package and advertised evidence
   paths.
5. Teammates submit proposed corrections under `recommendations/intake/`.
6. Maintainers review recommendations and decide whether the app repo needs a
   rule, parser, extractor, generator, documentation, or test change.

## AI Update Rule

When working inside the Data Governance app repo, Codex must treat the
consumer-kit repo as the first destination for teammate-facing workflow updates.

Use the app repo only for changes that truly require maintainer-owned platform
code or package publishing behavior.

## Consequences

- Teammates receive a small, purpose-built Codex workspace.
- The platform implementation stays protected from broad distribution.
- Recommendation intake remains visible and reviewable without granting engine
  write access.
- Consumer guidance can mature into a Codex plugin later without changing the
  app repository boundary.
- There is an extra synchronization responsibility between the app repo and the
  consumer-kit repo, so the repo contract must name the canonical location.

## Related Documents

- `docs/SONIC_LINEAGE_CONSUMER_KIT_REPO.md`
- `docs/SONIC_LINEAGE_RUNTIME_CONSUMER_CONTRACT.md`
- `docs/LINEAGE_RUNTIME_READBACK_PROCESS.md`
- `docs/RAW_EVIDENCE_ACCESS_CONTROL.md`
- `docs/TEAM_CODEX_LINEAGE_TRAINING_GUIDE.md`
- `docs/adr/ADR-007-Team-Codex-Lineage-Runtime-Enablement.md`
