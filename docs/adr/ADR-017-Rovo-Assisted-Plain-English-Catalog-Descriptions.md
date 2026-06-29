# ADR-017: Rovo-Assisted Plain-English Catalog Descriptions

## Status

Accepted

## Date

2026-06-19

## Context

The Database Catalog must support ongoing onboarding of new databases without
repeating a full-catalog, Codex-authored rich documentation effort. The first
test database for the sustainable workflow is:

```text
Server: D1-SQL-07A\INST1
Database: Organization
```

The catalog must still be useful on day one. Every included database, schema,
and object needs complete deterministic metadata detail, canonical Confluence
navigation, hidden Rovo retrieval context, and direct support language. The
team is small, so a human cannot approve every object description before
publication.

ADR-015 made Rovo the retrieval and answer layer. This ADR extends that model:
Rovo may also create auto-published plain-English catalog descriptions when the
evidence is strong or medium. Codex must not be used as the LLM author for those
descriptions in this workload.

## Decision

New database onboarding will use confidence-gated Rovo description generation.

Deterministic Node.js engines will:

- extract database, schema, object, column, and lineage metadata;
- build bounded evidence packets;
- score evidence confidence as `strong`, `medium`, or `weak`;
- generate canonical human catalog pages and hidden Rovo context pages;
- create the Rovo description queue;
- import Rovo outputs;
- publish or update Confluence pages from deterministic files and approved
  override files.

Rovo will:

- generate plain-English purpose, business use, support notes, and lineage
  explanation for `strong` and `medium` evidence packets;
- use only the hidden Rovo context/evidence packet and canonical page contract;
- avoid inventing owners, SLAs, lifecycle/status, freshness, certification,
  source systems, or business processes not surfaced in metadata.

For AWS and other non-database sources, Rovo/AI descriptions must also preserve
native platform language. An S3 bucket, Glue table, Athena workgroup, or
QuickSight dashboard name is not enough evidence to infer business purpose,
owner, steward, SLA, freshness, certification, or process. Unsupported facts
must be written as `not surfaced in metadata`.

Weak evidence will not receive Rovo-authored business prose automatically. It
will use deterministic direct support language and be tagged for later
correction if users identify gaps.

Human-approved corrections will be stored in a durable override store. Overrides
win over Rovo text and rule-generated text on every future refresh.

## Architecture

```text
SQL Server metadata and lineage evidence
  -> Node.js extraction and catalog engines
  -> Evidence packets and confidence scores
  -> Hidden Rovo raw/context pages
  -> Rovo description generation for strong/medium packets
  -> Description import and validation
  -> Human catalog markdown/HTML cache
  -> Confluence publish
```

Codex is allowed to build and run the workflow, but Codex must not write the
plain-English business description content for catalog objects in this process.
Codex may write deterministic templates, validators, packet docs, scripts, and
readbacks.

## Confidence Gates

### Strong

Rovo description is auto-publishable.

Required signals:

- readable database/schema/object name;
- meaningful columns;
- lineage, report, package, pipeline, or procedure references;
- object type matches naming pattern;
- no conflicting evidence;
- no sensitive raw values required for explanation.

### Medium

Rovo description is auto-publishable with direct evidence-grounded language.

Typical signals:

- readable object or schema name;
- useful column names;
- limited lineage or usage evidence;
- business subject can be inferred from metadata names;
- no contradiction in the evidence packet.

### Weak

Rovo description is not auto-published.

Typical signals:

- cryptic object name;
- too few meaningful columns;
- no lineage or usage;
- staging/work/temp object with unclear final business use;
- conflicting source/target signals.

Weak pages still publish with deterministic support text, complete metadata,
and a standard footer:

```text
For questions or corrections, contact the Data Team.
```

## Hidden Rovo Context

Rovo context pages should be hidden from normal navigation but readable by users
who are expected to ask Rovo lineage questions. Do not permission-lock the
context away from those users unless the content contains sensitive information,
because Rovo retrieval follows user permissions.

The hidden context must not include:

- raw source rows;
- sample data values;
- secrets;
- credentials;
- connection strings;
- unrestricted SSISDB/ADF runtime payloads.

## Override Store

Approved descriptions must be stored outside Confluence page body text, for
example:

```text
catalog-overrides/descriptions/<database>.json
```

Suggested shape:

```json
{
  "database:Organization": {
    "purpose": "",
    "businessUse": "",
    "supportNotes": [],
    "lineageSummary": "",
    "approvedBy": "",
    "approvedAt": "",
    "source": "human-approved"
  },
  "object:Organization.dbo.Example": {
    "purpose": "",
    "businessUse": "",
    "supportNotes": [],
    "lineageSummary": "",
    "approvedBy": "",
    "approvedAt": "",
    "source": "human-approved"
  }
}
```

Refresh precedence:

1. human-approved override;
2. imported Rovo description for strong/medium evidence;
3. deterministic direct support template.

## Pilot Scope

The pilot will target:

```text
D1-SQL-07A\INST1.Organization
```

The pilot must prove:

- the database can be added incrementally;
- Codex is not used as the description-writing LLM;
- hidden Rovo context is enough for Rovo to write useful direct support text;
- strong/medium objects can auto-publish Rovo text;
- weak objects fall back to deterministic support language;
- approved human corrections persist through refresh.

## Consequences

- New databases can be onboarded without an expensive full-catalog Codex LLM
  rewrite.
- Rovo becomes the scalable description author for strong/medium metadata.
- The catalog remains complete even when Rovo cannot confidently describe an
  object.
- Human effort moves from approving everything to correcting exceptions.
- The durable source of approved meaning remains in the repo, not only in
  Confluence.

## Related Documents

- `docs/ROVO_DESCRIPTION_GENERATION_CONTRACT.md`
- `docs/CODEX_ROVO_DESCRIPTION_GENERATION_PACKET.md`
- `docs/ORGANIZATION_DATABASE_ROVO_PILOT_BACKLOG.md`
- `docs/ORGANIZATION_DATABASE_ROVO_PILOT_WORK_PACKETS.md`
- `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
- `docs/adr/ADR-016-Full-Database-Catalog-Deployment-And-Cleanup.md`
- `docs/adr/ADR-029-AWS-And-Non-Database-Lineage-Ingestion.md`
- `docs/AWS_LINEAGE_INGESTION.md`
- `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`
- `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`
