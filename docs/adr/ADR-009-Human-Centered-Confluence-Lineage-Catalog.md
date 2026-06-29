# ADR-009: Human-Centered Confluence Lineage Catalog

## Status

Accepted

## Context

The Sonic lineage skill and runtime package are designed for machine-readable
retrieval from Azure DevOps artifacts. They intentionally do not use Confluence
as a source of truth for normal lineage answers.

The existing Confluence lineage export is useful for agents because it publishes
object locator pages, quick-context pages, catalog shards, and compact lineage
records. That layout helps an assistant find exact artifacts, but it is hard for
humans to browse. Support analysts, data engineers, governance users, and
business stakeholders need a Confluence experience that starts with business
meaning, impact, and support checks before exposing raw technical evidence.

Confluence should become the human documentation and navigation layer. Azure
DevOps lineage artifacts and runtime packages remain the authoritative
machine-readable answer layer.

## Decision

Build a human-centered lineage catalog in Confluence alongside the existing
machine-oriented quick context and shard pages.

The Confluence tree must separate human navigation from AI retrieval artifacts:

```text
Sonic Data Lineage
  Data Product Catalog
    FIRE
    FORCE
    FUEL
    DOC
    TRAC
    TURBO
    HyperCards
    EchoPark Platform
    MCI
    MDP
  Database Catalog
    <Platform/Product>
      <Database>
        <Database.Schema>
          <Database.Schema Object Type Bucket>
            <Canonical Object Page>
  Confidence And Known Gaps
  Operating Guides
  AI Retrieval Artifacts
    Object Locators
    Lineage Quick Context
    Catalog Shards
```

The business entry point is `Data Product Catalog`. The technical entry point is
`Database Catalog`. Both paths must link to the same object documentation when a
page exists. `High-value` is an object tag, not a separate top-level page tree.

Human-facing pages must follow answer-first page design:

1. Plain-English summary
2. Business meaning and value
3. At-a-glance technical identity
4. Lineage summary
5. Support checks
6. Profile or quality signals when available
7. Expandable technical evidence
8. Source artifact and confidence/caveat detail

The concrete implementation contract for generated page sections, bounded
evidence packets, and summary validation is
`docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`.

Raw shard pages, locator pages, compact context packs, and answer cards remain
available under `AI Retrieval Artifacts`, but they must not be the primary
human browsing experience.

Rovo-specific retrieval artifacts are governed by
`docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md` and
`docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`. They should be compact,
table-first lookup and context pages that help Rovo answer database, object, and
lineage questions while linking back to the canonical human catalog.

Human Confluence generation must also follow ADR-028. New or refreshed source
metadata is not a reason to regenerate the whole human catalog. The generator
must consume the reviewed delta manifest and update only new or changed object,
database/schema, product, support, and directly impacted index pages unless a
scoped full-refresh packet is explicitly approved.

## Page Types

### Product Page

Product pages explain a business domain or application area such as FIRE, FORCE,
FUEL, DOC, TRAC, TURBO, HyperCards, EchoPark Platform, MCI, or MDP.

Each product page should include:

- plain-English business purpose
- main source systems and landing areas
- key final tables/views/procedures
- reports, packages, and downstream consumers when surfaced
- high-value, high-use, support-critical, product-critical, and known-risk tags
  when surfaced
- support checks for stale or incorrect data
- links to database/schema/object pages
- evidence and confidence notes

### Database And Schema Pages

Database and schema pages are browse pages. They should help a technical user
find objects without scanning shards. Under each schema, objects are separated
into typed bucket pages such as `Tables`, `Views`, `Stored Procedures`,
`Functions`, `Synonyms`, and `Other Objects` before the canonical object page.
For collision-safe Confluence publishing, schema pages use
`<Database>.<Schema>`, bucket pages use `<Database>.<Schema> <Object Type>`,
and object leaf titles use the full `<Database>.<Schema>.<Object>` technical
identity.

Each database/schema page should include:

- inventory counts by object type
- most-used or high-impact objects when available
- profiled vs. unprofiled table counts when available
- object tables grouped by table, view, procedure, package, report, or other
  useful type
- links to object pages or AI retrieval artifacts when no object page exists
- known extraction or confidence gaps

### Object Pages

Object pages live under the canonical database/schema path. Tags such as
`high-value`, `high-use`, `product-critical`, `support-critical`, `profiled`,
`review-needed`, and `lineage-hotspot` identify priority and support context.
Do not create a separate top-level `High-Value Assets` hierarchy.

Each object page should include:

- object name, type, database, schema, and source artifact
- plain-English description of what the object represents
- business impact if stale, missing, or changed
- upstream loaders, source tables/views/files, and orchestrators
- downstream consumers, reports, procedures, and dependent objects
- support checks with concrete first steps
- profile signals such as row count, column count, null/distinct summaries,
  freshness, and profile status when available
- expandable technical detail for columns, column usage, SQL snippets, calls,
  SSIS packages, confidence, unresolved facts, and caveats

## Plain-English Generation

Use the lineage engine to build structured evidence packets. Use an LLM only to
turn those packets into readable human text.

The LLM must not search broadly, invent business meaning, or summarize raw
markdown without guardrails. The generator must provide a bounded evidence
packet containing facts such as:

- object identity and type
- product/domain membership
- upstream loaders and orchestrators
- source and target objects
- downstream consumers and reports
- columns and column-usage signals
- procedure/package calls
- profile and quality signals
- confidence labels and unresolved risks
- source artifact paths

The generated prose must be stored with its evidence inputs or an evidence hash
so reviewers can explain why the summary says what it says.

If evidence is missing, the prose must say `not surfaced in metadata` or an
equivalent caveat. It must not fill gaps from object names alone.

LLM generation must be delta-bound. Run it only for new or changed bounded
evidence packets or for directly impacted parent/index pages that need revised
counts, links, or summaries. Do not run an LLM across unchanged objects during a
routine refresh.

Prefer deterministic templates before LLM generation:

- staging object: prepares data for later load or comparison
- dimension: standardizes descriptive attributes
- fact: stores measurable events or transactions
- bridge/xref: connects keys or identifiers across systems
- procedure: reads, transforms, deletes, inserts, updates, merges, or upserts
  named objects
- SSIS master package: orchestrates child packages or procedure calls
- report/dataset: presents or queries named warehouse objects

Use the LLM to make the final text specific and readable, not to decide the
facts.

## Evidence To Surface

The human catalog should use these existing metadata fields when present:

- `reads_from`, `writes_to`, `depends_on`, and `used_by`
- `calls` for procedure/package/report relationships
- semantic lineage groups such as loaders, business consumers, maintenance
  reads, and orchestrators
- table/view/procedure columns and column usage
- SSIS package hierarchy, column mappings, file/config evidence, and runtime
  baseline signals where already approved
- stored procedure SQL-derived reads/writes and business-rule snippets
- SSRS report, dataset, data-source, and parameter relationships
- profile-index signals such as row counts, column counts, null/distinct
  summaries, freshness, failures, and caveats
- product/domain grouping artifacts
- confidence labels, unresolved facts, validation status, and source paths

## Medium-Safe Implementation Rules

This work can be implemented at Medium when the task is limited to one page
type or one catalog slice at a time.

Medium-safe work may:

- update ADRs, docs, page templates, and generator copy rules
- add dry-run-only Confluence export previews
- generate a small pilot set of product, database, schema, or canonical object
  pages
- use existing metadata fields and existing runtime package artifacts
- add validation that rejects vague or unsupported summaries

Medium-safe work must not:

- change ingestion engines, extractors, parsers, or rebuild scripts without a
  separate maintainer-approved packet
- publish a broad live Confluence tree without dry-run review
- regenerate unchanged pages or run AI summaries for unchanged objects during a
  routine metadata refresh
- create one page per object across the full catalog in the first pass
- use Confluence as a machine-readable source for the Sonic lineage skill
- let an LLM invent unsupported business descriptions
- expose secrets, credentials, connection strings with sensitive values, raw
  source rows, or sample data

Stop and request a stronger setting or explicit approval before:

- broad live Confluence publish
- changing source ingestion or parser behavior
- changing confidence or semantic-lineage scoring
- generating thousands of object pages
- using external LLM calls against unrestricted raw markdown

## Consequences

- Human users get browsable pages organized by products, databases, schemas, and
  canonical object pages with priority tags.
- The existing lineage skill remains clean: it answers from DevOps artifacts and
  does not depend on Confluence.
- Rovo can use scoped Confluence retrieval pages without making the human
  catalog dense or machine-first.
- Routine source refreshes update only affected human pages and directly
  impacted indexes, reducing publication churn.
- Confluence becomes a curated support and governance portal instead of a raw
  filesystem mirror.
- Generator quality gates become more important because human prose can create
  false confidence if it is not evidence-bound.
- The first implementation should be a pilot before full catalog expansion.

## Validation

Before broad publish, validate:

- a product page for one key product such as FIRE
- one database page such as `Sonic_DW`
- one schema page such as `Sonic_DW.dbo`
- several object pages covering a table, view, procedure, SSIS package, and
  report when available
- one object with strong lineage and one object with weak evidence

Each page passes only if a human can answer these questions from the first two
sections:

- What is this?
- Why does it matter?
- What feeds it or what does it feed?
- What should support check first?
- How much should I trust this page?
