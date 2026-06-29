# ADR-015: Rovo-Optimized AI Retrieval Artifacts

## Status

Accepted

## Date

2026-06-19

## Context

The Sonic Data Lineage Confluence catalog now has two audiences:

1. humans browsing support and governance documentation;
2. Rovo agents answering natural-language questions from Confluence knowledge.

ADR-009, ADR-013, and ADR-014 define the human catalog and canonical database
object pages. Those pages are necessary but not sufficient for Rovo. Rovo needs
small, structured, scoped retrieval pages so it can resolve names, avoid
ambiguous objects, and answer questions without reading a large generated tree.

Representative questions the system must support include:

```text
Tell me about the database VendorData.
Tell me about the DimVehicle table.
Show me the lineage of the FactOpportunity table.
```

These questions require fast object/database resolution, aliases, concise
summary facts, upstream/downstream lineage, column context, confidence, and
links back to canonical human pages.

As cloud metadata is added, Rovo must also resolve non-database assets such as
AWS S3 buckets, Glue tables, Athena workgroups/tables/named queries, and
QuickSight assets. These assets must keep their native canonical ids and must
not be described as SQL objects unless the metadata actually represents a SQL
or table abstraction.

Atlassian Rovo guidance supports this direction:

- Rovo agents can use scoped knowledge sources.
- Short, specific agent instructions are preferred.
- Confluence tables and pages are useful retrieval surfaces.
- Rovo evaluation datasets should be used to test answer quality.

## Decision

AI retrieval artifacts under `Sonic Data Lineage / AI Retrieval Artifacts` will
be redesigned as Rovo-first retrieval surfaces.

The human catalog remains the readable documentation layer. The DevOps lineage
runtime package remains the authoritative machine-readable source. Rovo
retrieval artifacts are optimized Confluence copies of selected facts, built so
Rovo can answer common questions accurately and link to deeper pages.

The Rovo artifact tree will include:

```text
Sonic Data Lineage
  AI Retrieval Artifacts
    Rovo Start Here
    Rovo Object Locator ###
    Rovo Database Context ###
    Rovo Object Summary Context ###
    Rovo Upstream Context ###
    Rovo Downstream Context ###
    Rovo Column Context ###
    Rovo Profile Context ###
    Rovo Ambiguity Context ###
    Rovo Evaluation Prompts
```

Do not make these pages the primary human navigation path. Human users should
start with `Data Product Catalog` or `Database Catalog`.

Rovo artifact generation must follow ADR-028. Rovo pages are downstream
retrieval surfaces, not the baseline for determining metadata change. Routine
refreshes must update only the locator/context shards, ambiguity groups,
profile/lineage contexts, and evaluation prompts impacted by the delta manifest.
Whole-artifact regeneration requires a scoped full-refresh packet.

## Required Answer Capabilities

The Rovo retrieval layer must support these answer patterns.

### Database Summary

For a prompt such as `tell me about the database VendorData`, Rovo should find a
database context row/page that contains:

- exact database name and aliases;
- plain-English database purpose when surfaced;
- schema count and schema list;
- object counts by type;
- major business domains or product links when surfaced;
- important or tagged objects;
- profile coverage summary when surfaced;
- known gaps and confidence;
- canonical database page link;
- generated date and evidence hash.

### Object Summary

For a prompt such as `tell me about the DimVehicle table`, Rovo should resolve
the exact object, detect ambiguity, and answer with:

- fully qualified object name;
- type;
- aliases and normalized names;
- plain-English purpose when evidence supports it;
- key columns or column count;
- upstream loaders/sources;
- downstream consumers/reports;
- tags;
- confidence and missing facts;
- canonical object page link.

### Lineage Explanation

For a prompt such as `show me the lineage of the FactOpportunity table`, Rovo
should answer from compact upstream/downstream context:

- canonical object identity;
- upstream objects grouped by role;
- orchestrators such as SSIS packages or ADF pipelines when surfaced;
- downstream objects, reports, procedures, and products;
- relationship confidence and caveats;
- links to deeper human pages or DevOps artifacts.

## Page Design Rules

Rovo pages should be table-first and compact.

Object locator rows should include:

| Field                  | Purpose                                                                              |
| ---------------------- | ------------------------------------------------------------------------------------ |
| `lookup_key`           | Name or alias Rovo is likely to search.                                              |
| `canonical_id`         | Stable object or database id.                                                        |
| `type`                 | Database, schema, table, view, procedure, report, package, pipeline, or cloud asset. |
| `database`             | Database name when applicable.                                                       |
| `schema`               | Schema name when applicable.                                                         |
| `object`               | Object name when applicable.                                                         |
| `aliases`              | Deterministic and surfaced aliases.                                                  |
| `quick_context_page`   | Best first page for Rovo to read.                                                    |
| `canonical_human_page` | Human page to cite or send the user to.                                              |
| `confidence`           | Retrieval confidence and caveat.                                                     |

Quick-context pages should be smaller than the old broad shard pattern. Start
with about 50 objects per quick-context page and validate with Rovo evaluation
before increasing size. Use pages by intent instead of one large mixed page.

## Agent Instruction Contract

Rovo agent instructions should be short and specific:

```text
Use Sonic Data Lineage AI Retrieval Artifacts first. Search Rovo Object Locator
pages for the user's database, schema, table, view, procedure, report, package,
or pipeline name. If multiple matches exist, say they are ambiguous and ask the
user to choose or answer with clearly labeled options. After resolving the exact
canonical id, read the matching Rovo context page and answer from that evidence.
Link to the canonical human catalog page when available. Do not invent owner,
SLA, lifecycle, freshness, or certification when the metadata says it is not
surfaced.
```

Do not point the Rovo agent at the whole company knowledge base for these
questions. Use a scoped knowledge source containing the `AI Retrieval Artifacts`
branch and the human lineage catalog.

## LLM Usage

The lineage engine, not Rovo, computes facts. Rovo explains and retrieves.

Use deterministic code for:

- object/database identity;
- aliases;
- counts;
- upstream/downstream relationships;
- page links;
- confidence;
- ambiguity groups;
- generated dates and evidence hashes.

Use bounded LLM generation only for:

- plain-English object/database summaries;
- support impact wording;
- readable lineage explanation from already-classified relationships.

LLM generation is allowed only for new or changed Rovo evidence records or
directly impacted retrieval pages. Do not run the LLM over the full Rovo corpus
when the source metadata delta is smaller.

The LLM must not:

- decide lineage;
- invent business definitions;
- infer owners, SLAs, lifecycle/status, live freshness, or certification;
- summarize unrestricted raw data;
- publish secrets, credentials, raw rows, sample values, or connection strings.

## Evaluation

Every Rovo retrieval change should include a small evaluation set before broad
publish. The initial evaluation dataset should contain up to 50 prompts,
including:

- database summary prompts;
- exact object prompts;
- misspelled or casing-variant object prompts;
- lineage prompts;
- column prompts;
- ambiguous name prompts;
- unsupported owner/freshness/status prompts.

The expected answer should require Rovo to cite or link the retrieval page used
and should fail when Rovo invents unsupported facts.

## Medium-Intelligence Work Contract

A balanced Codex session at normal speed with medium thinking may implement
this work when limited to one backlog item or one database/schema slice.

Allowed:

- update ADRs, AI docs, packets, and backlog items;
- add dry-run-only Rovo retrieval pages for one database/schema slice;
- add deterministic locator rows and context pages;
- add Rovo evaluation prompt files;
- tune quick-context page size with local dry-run output;
- update validators for size, required columns, ambiguity handling, and safety.
- update Rovo shards for the objects and index rows named in a reviewed delta
  manifest.

Not allowed without stronger review or explicit approval:

- broad live Confluence publish;
- full Rovo retrieval corpus regeneration when only a source metadata delta is
  available;
- changing ingestion/parser/scoring behavior;
- unrestricted LLM summarization;
- publishing raw source rows, samples, secrets, or credentials;
- deleting or moving existing Confluence pages;
- treating Rovo answers as authoritative beyond the lineage evidence.

## Consequences

- Rovo can answer common database, object, and lineage questions from a
  retrieval shape designed for those questions.
- Human pages stay readable instead of becoming dense machine pages.
- Ambiguous names such as similar table/view/procedure names are handled
  explicitly.
- The catalog remains honest about facts not surfaced in metadata.
- Rovo quality becomes measurable through evaluation prompts instead of judged
  only by ad hoc conversation.
- Rovo publication scope becomes explainable because every changed retrieval
  artifact can point back to the source metadata delta that required it.

## Related Documents

- `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`
- `docs/CODEX_ROVO_AI_RETRIEVAL_PACKET.md`
- `docs/DATABASE_CATALOG_MEDIUM_BACKLOG.md`
- `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`
- `docs/adr/ADR-013-Complete-Database-Catalog-And-Object-Library-Pages.md`
- `docs/adr/ADR-014-Canonical-Object-Catalog-Trust-Signals-And-Medium-Backlog.md`
- `docs/adr/ADR-016-Full-Database-Catalog-Deployment-And-Cleanup.md`
- `docs/adr/ADR-028-Delta-First-Metadata-Processing-And-Publication.md`
- `docs/adr/ADR-029-AWS-And-Non-Database-Lineage-Ingestion.md`
- `docs/CONFLUENCE_LINEAGE_REPOSITORY.md`
- `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
- `docs/DATABASE_CATALOG_FULL_DEPLOYMENT_WORK_PACKETS.md`
