# Confluence Sonic Data Lineage Rebuild Scope

## Purpose

This document locks the scope for the next full rebuild of the Sonic Data
Lineage Confluence site so dry runs, reviews, and live publishes all mean the
same thing.

## Scope Decision

The rebuild target is the `Sonic Data Lineage` Confluence root:

```text
Space: TDE
Root page: Sonic Data Lineage
Root page id: 2221670415
Publisher env var: CONFLUENCE_PARENT_PAGE_ID
```

The rebuild includes both:

- human-facing lineage pages for business/support browsing
- AI retrieval artifacts for quick context, catalog shards, and object lookup

The rebuild does not include SSIS support documentation under `SSIS Folder
Catalog`. SSIS package documentation is a separate publisher rooted at
`SSIS_CONFLUENCE_CATALOG_PAGE_ID=2269610019`. SSIS lineage evidence may appear
inside Sonic Data Lineage pages when it is part of an object's upstream,
downstream, or orchestration evidence, but the SSIS documentation tree is not
replaced by this lineage rebuild.

## Included Page Families

### Human Navigation

Publish or refresh these human-facing pages under `Sonic Data Lineage`:

```text
Sonic Data Lineage
  Data Product Catalog
    Data Product - FIRE
    Data Product - FORCE
    Data Product - FUEL
    Data Product - DOC
    Data Product - TRAC
    Data Product - TURBO
    Data Product - HyperCards
    Data Product - EchoPark Platform
    Data Product - MCI
    Data Product - MDP
  Database Catalog
    <Platform/Product>
      <Database>
        <Database.Schema>
          <Database.Schema Object Type Bucket>
            <Canonical Object Page>
  Confidence And Known Gaps
  Operating Guides
```

Human pages must follow `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md`.
Database Catalog pages must follow `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`.
Plain-English sections must be generated from bounded evidence packets and
must label missing facts as `not surfaced in metadata`.

The Database Catalog rebuild applies this pattern to every included cataloged
database. It is not limited to `Sonic_DW`. Under each schema, objects are
separated into typed bucket pages such as `Sonic_DW.dbo Tables`,
`Sonic_DW.dbo Views`, `Sonic_DW.dbo Stored Procedures`,
`Sonic_DW.dbo Functions`, and `Sonic_DW.dbo Synonyms`; object leaf page
titles use `<Database>.<Schema>.<Object>`. Older schema pages named
`Schema - <Database>.<Schema>` are superseded by clean schema nodes named
`<Database>.<Schema>` under each database page. They must be reported as cleanup
candidates, but they must not be archived, deleted, or moved without separate
cleanup approval after replacements are verified.

SSIS package/catalog artifacts from `ssisdb` are not Database Catalog objects.
They must be excluded from database, schema, and object page generation and
kept in the SSIS support documentation path. Database Catalog pages may link to
SSIS documentation as upstream or orchestration evidence when that helps explain
a real database object.

### Human Catalog Do-Not-Publish List

The human catalog must not publish user/account schemas as browse pages. These
schemas may remain in machine-readable lineage artifacts when they are valid
technical evidence, but they are not useful as human navigation pages and should
be suppressed from database summaries and schema page generation:

```text
Sonic_DW.SONIC\bheemappa
Sonic_DW.SONIC\Murali
Sonic_DW.SONIC\rajakumar
Sonic_DW.SONIC\Sudheer
DMS.SONIC\rajakumar
eLeadDW.SONIC\sunil
StagingDB.SONIC\bheemappa
```

These entries are prefix rules; for example, they cover published schema names
such as `Sonic_DW.SONIC\bheemappa.madar`,
`Sonic_DW.SONIC\Murali.Gutha`, and
`Sonic_DW.SONIC\rajakumar.jaggani`. The DMS, eLeadDW, and Sonic_DW Sudheer
rules cover the account schemas surfaced by the DMS onboarding refresh. The
StagingDB rule covers
`StagingDB.SONIC\bheemappa` and any same-user schema variants surfaced later.

If a blocked schema was already published to Confluence, handle removal through
an explicit cleanup task after the replacement publish is validated.

### AI Retrieval Artifacts

Publish or refresh these machine-oriented pages under a clearly separated
technical section:

```text
Sonic Data Lineage
  AI Retrieval Artifacts
    Sonic Data Lineage README
    Latest Rebuild Report
    Catalog Manifest
    Source System Inventory
    Confidence Guide
    Object Index
    Rovo Start Here
    Rovo Object Locator pages
    Rovo Database Context pages
    Rovo Object Summary Context pages
    Rovo Upstream Context pages
    Rovo Downstream Context pages
    Rovo Column Context pages
    Rovo Profile Context pages
    Rovo Ambiguity Context pages
    Rovo Evaluation Prompts
```

These pages are allowed to be dense and technical, but they should be compact
enough for reliable Rovo retrieval. They must not become the primary human
navigation experience. They must follow
`docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`.

## Excluded From This Rebuild

- `SSIS Documentation` and `SSIS Folder Catalog` page trees.
- SSIS package/catalog artifacts from `ssisdb` as Database Catalog pages.
- `SSRS Report Documentation` page trees.
- Product/domain pages outside the `Sonic Data Lineage` root.
- User/account schemas listed in the human catalog do-not-publish list.
- Ingestion, parser, extractor, generator, or scoring-rule changes.
- Azure platform work.
- Broad Tier 2 or Tier 3 object page creation across the entire catalog unless
  separately approved after dry-run review.
- Cleanup, archive, delete, or move of superseded pages unless separately
  approved after replacement pages are verified.

## Required Command Order

Dry run and validation:

```powershell
npm run confluence:human:dry-run
npm run confluence:human:check
npm run confluence:export
npm run confluence:check
npm run confluence:dry-run
```

Live publish, after dry-run review:

```powershell
npm run confluence:human:publish
npm run confluence:replace
npm run confluence:human:published:check
npm run confluence:generated:check
```

If the dry run shows page paths outside the included page families, stop and
fix scope or publisher configuration before live publish.

## Acceptance Criteria

- Human pages and AI retrieval pages remain separated in the Confluence tree.
- The first human-facing sections answer what the page is, why it matters, what
  feeds it or what it feeds, what support should check first, and how much to
  trust the page.
- AI retrieval artifact pages remain available for agent lookup and validation.
- Rovo can answer database, object, and lineage prompts from scoped retrieval
  artifacts without scanning the full human catalog.
- No SSIS or SSRS documentation roots are moved, replaced, or deleted by this
  rebuild.
- No SSIS package/catalog artifacts from `ssisdb` are published as Database
  Catalog pages.
- Live publish uses the reviewed dry-run output, not ad hoc page edits.
- Post-publish checks pass for both the human pilot pages and generated lineage
  pages.
