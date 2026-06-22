# ADR-014: Canonical Object Catalog Trust Signals And Medium Backlog

## Status

Accepted

## Date

2026-06-19

## Context

ADR-013 makes the Database Catalog a complete object library:

```text
Database Catalog / <Database> / <Schema> / <Object>
```

That settles the information architecture, but it does not fully define how a
user should trust, search, and interpret those object pages. A complete catalog
can still fail if object pages contain vague prose, unsupported labels, weak
search aliases, no page-level confidence, no explicit missing facts, or
confusing duplicate pages from earlier publish patterns.

The team also rejected several tempting but unreliable attributes as required
generated fields:

- live freshness/runtime status in Confluence;
- business owner or data steward when not surfaced in metadata;
- lifecycle status such as active, stale, deprecated, or do-not-use when only
  weak update signals exist.

These facts may be shown only when evidence supports them. Otherwise generated
pages must say the fact is not surfaced in metadata.

## Decision

Canonical object pages must be trustworthy before they are verbose. The catalog
will use:

1. deterministic object paths;
2. complete schema object indexes;
3. evidence-backed object tags;
4. thin and rich object-page levels;
5. alias/search metadata;
6. page-level confidence;
7. explicit missing-facts sections;
8. backlinks and related-object navigation;
9. dry-run duplicate/superseded-page reports before cleanup.

These trust signals also feed Rovo retrieval artifacts. Rovo context pages must
carry the same aliases, confidence, missing-facts language, and canonical human
page links so Rovo can answer object and lineage prompts without inventing weak
facts.

## Thin And Rich Object Pages

Every cataloged object should have one canonical destination under its database
and schema. The first version may be thin.

Thin object pages include:

- canonical object identity;
- type;
- tags;
- column count and column list when surfaced;
- upstream/downstream counts;
- profile availability;
- evidence links;
- page-level confidence;
- missing facts.

Rich object pages add:

- stronger plain-English purpose;
- business meaning and support impact;
- column summary with key columns when surfaced;
- readable lineage explanation;
- support checks;
- profile and quality signals;
- related reports, packages, pipelines, products, and objects.

Rich prose should be generated first for tagged or requested objects. Do not
generate vague rich prose for every object just to fill the page.

## Tag Rules

Tags are generated only from explicit rules or human review. They are signals,
not governance certification.

| Tag                | Assignment rule                                                                                                                                  |
| ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `high-value`       | Human-reviewed or explicitly business-significant. Do not assign from dependency count alone.                                                    |
| `high-use`         | Downstream count meets the configured threshold for the database/schema slice.                                                                   |
| `lineage-hotspot`  | Upstream plus downstream complexity meets the configured threshold or the object appears in many dependency paths.                               |
| `product-critical` | Product/domain evidence links the object to a named product such as FIRE, FUEL, DOC, MCI, MDP, TRAC, TURBO, or EchoPark Platform.                |
| `support-critical` | Support workflow, incident, report, job, or runbook evidence explicitly identifies the object.                                                   |
| `profiled`         | Published profile-index evidence exists for the object.                                                                                          |
| `review-needed`    | The generated page has weak business meaning, duplicate candidates, missing lineage, weak confidence, naming collision, or generic summary risk. |

Do not generate tags such as `active`, `stale`, `deprecated`, `owner-known`, or
`certified` unless an approved evidence source explicitly supports them.

## Attributes To Avoid Or Downgrade

Generated pages must not present these as authoritative required attributes:

| Attribute                     | Rule                                                                                                          |
| ----------------------------- | ------------------------------------------------------------------------------------------------------------- |
| Live freshness/runtime status | Do not show as live Confluence status. Show only metadata capture date or approved historical support signal. |
| Business owner/data steward   | Optional only. If not surfaced, write `not surfaced in metadata`.                                             |
| Lifecycle/status              | Optional only. Do not infer active/stale/deprecated from last update alone.                                   |
| High value                    | Tag only. Requires human/business evidence, not dependency count alone.                                       |

Use `Evidence Signals` instead of unsupported status fields.

Recommended evidence signals:

- `Cataloged`
- `Has downstream consumers`
- `No downstream consumers surfaced`
- `Profiled`
- `Not profiled`
- `Review needed`
- `Metadata capture date`
- `Live status location not surfaced in metadata`

## Alias And Search Rules

Each canonical object page should expose searchable aliases when evidence or
safe deterministic normalization supports them:

- fully qualified name;
- database/schema/object name;
- object name without underscores;
- common casing variants;
- product/domain names when surfaced;
- related report/package/pipeline names when surfaced.

Aliases must help search. They must not invent business names that metadata does
not support.

## Page-Level Confidence

Object pages must separate object/lineage confidence from page/documentation
confidence.

Recommended confidence fields:

| Field                      | Meaning                                                        |
| -------------------------- | -------------------------------------------------------------- |
| `lineage_confidence`       | Confidence in extracted upstream/downstream relationships.     |
| `description_confidence`   | Confidence in the plain-English purpose/business meaning.      |
| `profile_confidence`       | Whether profile evidence exists and is usable.                 |
| `documentation_confidence` | Overall confidence that the page is useful without SME review. |

Use labels such as `high`, `medium`, `low`, `not surfaced`, and
`review-needed`. Do not imply certification.

## Missing Facts

Every generated object page must include a concise `Not Surfaced In Metadata`
or `Known Gaps` section when important facts are missing.

Common missing facts:

- business owner;
- data steward;
- SLA;
- live freshness;
- lifecycle/status;
- business definition;
- source system of record;
- downstream business report names;
- profile data.

This section protects the catalog from false authority.

## Backlinks And Related Navigation

Every canonical object page must link back to:

- database page;
- schema page;
- related product pages when surfaced;
- related SSIS/SSRS/ADF pages when surfaced;
- related upstream loaders and downstream consumers when human pages exist.

Product pages and schema pages should link to the same canonical object page,
not duplicate object detail.

## Duplicate Cleanup Rules

Cleanup is separate from generation.

Dry runs must report:

- canonical page to keep or create;
- noncanonical schema pages such as `Schema - Sonic_DW.dbo`;
- superseded object pages such as `High-Value Object - Sonic_DW.dbo.Dim_Vehicle`;
- count or evidence mismatches between duplicates;
- recommended action: keep, replace, archive, or manual review.

Live archive/delete/move requires explicit user approval after a reviewed dry
run. Do not remove superseded pages before canonical replacements exist.

## Medium-Intelligence Work Contract

A balanced Codex session at normal speed with medium thinking may implement
this work when limited to one backlog item or one database/schema slice.

Allowed:

- update ADRs, AI docs, packets, and validators;
- add dry-run-only generation of thin canonical object pages for one slice;
- add deterministic tag assignment for one or two tags;
- add page-level confidence fields to evidence packets;
- add missing-facts sections;
- add alias/search fields;
- add duplicate/superseded-page reporting.

Not allowed without stronger review or explicit approval:

- live Confluence cleanup or publish;
- full-catalog rich object page generation;
- owner/steward inference;
- lifecycle/status inference from weak signals;
- live freshness/runtime claims in Confluence;
- ingestion/parser/scoring changes;
- unrestricted LLM summarization.

## Consequences

- Users can find every object without trusting unsupported governance claims.
- The catalog becomes honest about what metadata proves and what it does not.
- `high-value` becomes a controlled signal instead of a misleading navigation
  bucket.
- Medium-intelligence Codex work can proceed through small, reviewable backlog
  items.
- Rovo answer quality can be improved through locator/context pages without
  weakening the human catalog or making Confluence the lineage engine.

## Related Documents

- `docs/adr/ADR-013-Complete-Database-Catalog-And-Object-Library-Pages.md`
- `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
- `docs/adr/ADR-016-Full-Database-Catalog-Deployment-And-Cleanup.md`
- `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
- `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`
- `docs/CODEX_CONFLUENCE_DATABASE_CATALOG_PACKET.md`
- `docs/DATABASE_CATALOG_MEDIUM_BACKLOG.md`
- `docs/DATABASE_CATALOG_FULL_DEPLOYMENT_BACKLOG.md`
- `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`
- `docs/CONFLUENCE_LINEAGE_REPOSITORY.md`
