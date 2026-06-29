# Rovo AI Retrieval Artifacts Contract

This contract defines the Confluence artifacts Rovo should use to answer Sonic
Data Lineage questions.

It implements:

- `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
- `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`
- `docs/CONFLUENCE_LINEAGE_REPOSITORY.md`

## Purpose

Rovo should be able to answer:

- `Tell me about the database VendorData.`
- `Tell me about the DimVehicle table.`
- `Show me the lineage of the FactOpportunity table.`

The retrieval artifacts exist to help Rovo find the right database or object
quickly, read a compact context page, and link to the canonical human catalog
page for deeper support documentation.

## Boundary

Rovo retrieval artifacts are not the primary human catalog and are not the
authoritative lineage source.

Use this boundary:

| Layer                          | Purpose                                                 |
| ------------------------------ | ------------------------------------------------------- |
| DevOps lineage runtime package | Authoritative machine-readable lineage facts.           |
| Human Confluence catalog       | Plain-English support and governance documentation.     |
| Rovo AI retrieval artifacts    | Compact Confluence retrieval surfaces for Rovo answers. |

## Confluence Tree

Publish Rovo artifacts under the separated technical branch:

```text
Sonic Data Lineage
  AI Retrieval Artifacts
    Rovo Start Here
    Rovo Object Locator 001
    Rovo Database Context 001
    Rovo Object Summary Context 001
    Rovo Upstream Context 001
    Rovo Downstream Context 001
    Rovo Column Context 001
    Rovo Profile Context 001
    Rovo Ambiguity Context 001
    Rovo Evaluation Prompts
```

Do not publish these pages under:

```text
Database Catalog
Data Product Catalog
High-Value Assets
```

Rovo artifacts must use the same object suppression rules as the human catalog.
Obvious backup (`bak`, `bk`, `bkp`, or `backup`), temporary, old, deprecated, delete/drop/remove, retired,
scratch, `tmp`, `temp`, or `zzz` table names are not locator/context targets
unless a human explicitly reclassifies the object as a valid business asset.
Those objects remain available in the DevOps lineage runtime package for
machine-readable evidence.

## Rovo Start Here

`Rovo Start Here` should be short. It tells the agent which pages to search
first.

Required content:

1. current generated date and evidence version;
2. the preferred lookup order;
3. instructions for ambiguous matches;
4. safety rules for unsupported facts;
5. links to locator and context page families.

Preferred lookup order:

1. `Rovo Object Locator ###`
2. `Rovo Database Context ###`
3. `Rovo Object Summary Context ###`
4. `Rovo Upstream Context ###` and `Rovo Downstream Context ###`
5. `Rovo Column Context ###`
6. canonical human catalog page

## Object Locator Pages

Object locator pages are table-first.

Required columns:

| Column                 | Required | Notes                                                                          |
| ---------------------- | -------- | ------------------------------------------------------------------------------ |
| `lookup_key`           | Yes      | Searchable name, alias, normalized name, or common variant.                    |
| `canonical_id`         | Yes      | Stable database/schema/object id.                                              |
| `type`                 | Yes      | Database, schema, table, view, procedure, report, package, pipeline, or other. |
| `database`             | Yes      | `not applicable` allowed for non-database artifacts.                           |
| `schema`               | Yes      | `not applicable` allowed.                                                      |
| `object`               | Yes      | Object name or `not applicable`.                                               |
| `aliases`              | Yes      | Deterministic and surfaced aliases only.                                       |
| `quick_context_page`   | Yes      | First page Rovo should read after matching.                                    |
| `canonical_human_page` | Yes      | Human page link or `not created yet`.                                          |
| `confidence`           | Yes      | High, medium, low, or ambiguous.                                               |

Locator rows must include database-level entries, not just objects. This is
what lets Rovo answer database prompts such as `tell me about VendorData`.

## Database Context Pages

Database context pages answer database-level prompts.

Required fields:

- database name;
- aliases;
- plain-English purpose when surfaced;
- schemas;
- object counts by type;
- tagged objects;
- profile coverage when surfaced;
- related products/domains;
- known gaps;
- confidence;
- canonical database page link;
- generated date;
- evidence hash.

## Object Summary Context Pages

Object summary context pages answer `tell me about <object>` prompts.

Required fields:

- canonical object identity;
- type;
- aliases;
- tags;
- plain-English summary or `not surfaced in metadata`;
- column count and key columns when surfaced;
- upstream count and compact upstream role summary;
- downstream count and compact downstream role summary;
- profile status;
- confidence;
- missing facts;
- canonical human page link.

## Upstream And Downstream Context Pages

Lineage context pages answer `show me lineage` prompts.

Required fields:

- canonical object identity;
- upstream sources grouped by role;
- upstream loaders;
- orchestrators such as SSIS packages and ADF pipelines;
- downstream consumers;
- downstream reports;
- maintenance reads;
- relationship confidence and caveats;
- source artifact paths or DevOps links.

Use compact tables over long prose. If the lineage graph is large, include the
top direct relationships and link to deeper DevOps artifacts or canonical pages.

## Column Context Pages

Column context pages answer column-level and schema-understanding prompts.

Required fields:

- canonical object identity;
- column name;
- data type when surfaced;
- nullable signal when surfaced;
- profile signal when surfaced;
- column usage or lineage count when surfaced;
- caveats.

Do not publish raw data values or sample rows.

## Ambiguity Context Pages

Ambiguity pages make similar names explicit.

Include groups for:

- same object name across databases or schemas;
- table/view/procedure names that differ only by prefix, suffix, underscores,
  or casing;
- common misspellings or normalized names;
- aliases that map to multiple canonical ids.

When a prompt is ambiguous, Rovo should answer with the likely options and ask
the user to choose unless one match is clearly dominant.

## Artifact Size Guidance

Start with these dry-run targets:

| Artifact            | Initial target              |
| ------------------- | --------------------------- |
| Object locator page | Up to 500 lookup rows.      |
| Quick/context page  | About 50 objects per page.  |
| Context page body   | Prefer under 120,000 bytes. |
| Evaluation prompts  | Up to 50 prompts per run.   |

Tune sizes only after Rovo evaluation shows retrieval remains accurate.

## Rovo Agent Instruction

Use this short instruction as the baseline:

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

## Quality Gate

A Rovo retrieval dry run fails when:

- locator pages omit database-level entries;
- required locator columns are missing;
- `DimVehicle`-style normalized aliases are absent;
- ambiguity groups are not generated for duplicate lookup keys;
- context pages omit canonical ids or human page links;
- lineage context lacks upstream/downstream role labels when surfaced;
- pages infer owner, SLA, lifecycle/status, live freshness, or certification;
- raw source rows, sample values, secrets, credentials, or connection strings
  are exposed;
- page size exceeds configured limits without a split recommendation;
- evaluation prompts are missing for the changed artifact family.

## Medium-Safe Change Pattern

Keep work bounded:

- one locator family;
- one context page type;
- one database/schema slice;
- one evaluation prompt file;
- dry-run only unless live publish is explicitly approved.

Use `docs/CODEX_ROVO_AI_RETRIEVAL_PACKET.md` before changing Rovo artifact
generation.
