# PHASE7S-011 - Reviewed Human Catalog Publish

## Purpose

Publish only the reviewed human Confluence lineage pilot after local dry-run
generation and summary quality validation pass.

This publish step is intentionally scoped to the pilot tree:

```text
Sonic Data Lineage / Data Product Catalog / Data Product - FIRE
Sonic Data Lineage / Database Catalog / Sonic_DW
Sonic Data Lineage / Database Catalog / Sonic_DW / dbo
Sonic Data Lineage / High-Value Assets / FIRE Object Pilot
```

The publish script may also create or update lightweight navigation parents
inside that same reviewed pilot tree:

```text
Sonic Data Lineage / Data Product Catalog
Sonic Data Lineage / Database Catalog
Sonic Data Lineage / High-Value Assets
```

## Commands

Dry-run only:

```powershell
npm run confluence:human:publish:dry-run
```

Live publish, approval-gated:

```powershell
npm run confluence:human:publish
```

The live publish command runs these checks first:

1. `npm run confluence:human:dry-run`
2. `npm run confluence:human:check`
3. `node scripts/publish-human-confluence-catalog-pilot.mjs --publish`

## Required Configuration

Dry run requires only local generated files and a configured parent page id.

Live publish requires:

```text
CONFLUENCE_BASE_URL
CONFLUENCE_SPACE_KEY
CONFLUENCE_HUMAN_LINEAGE_PARENT_PAGE_ID or CONFLUENCE_PARENT_PAGE_ID
CONFLUENCE_EMAIL
CONFLUENCE_API_TOKEN
```

If `CONFLUENCE_HUMAN_LINEAGE_PARENT_PAGE_ID` is not set, the script falls back
to `CONFLUENCE_PARENT_PAGE_ID`, then to the configured Sonic Data Lineage root.

## Stable Titles And Labels

Pilot pages use stable titles from the evidence packet `page_title` field and
are labeled:

```text
human-lineage-catalog
lineage-pilot
reviewed-pilot
```

The script finds existing pages by exact title under the expected parent. It
updates those pages in place instead of creating duplicate titles.

## Boundaries

This publish step does not:

- publish the full catalog
- move or delete AI retrieval artifacts
- replace the DevOps/Azure lineage runtime package
- publish broad object-level pages beyond the reviewed pilot
- change ingestion, parser, extractor, or generator behavior

## Rollback / No-Change Plan

Before live publish:

- Run `npm run confluence:human:publish:dry-run`.
- Confirm the output page tree is limited to the reviewed pilot.
- Confirm `npm run confluence:human:check` passes.
- Do not run live publish if any page path is unexpected.

After live publish:

- For updated pages, use Confluence page history to restore the prior version.
- For newly created pilot pages, use labels `human-lineage-catalog` and
  `lineage-pilot` to identify only the created pilot pages before removal.
- Do not remove or move existing AI retrieval artifacts unless a separate
  rollback/change request explicitly approves that action.

## Spot Check Plan

After live publish, spot-check these navigation paths in Confluence:

| Path                                                              | Expected result                                                                                                  |
| ----------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `Sonic Data Lineage / Data Product Catalog / Data Product - FIRE` | FIRE product page opens with plain-English summary, final targets, support checks, and technical evidence below. |
| `Sonic Data Lineage / Database Catalog / Sonic_DW`                | Database parent opens with schema summary and high-use objects.                                                  |
| `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo`          | Schema page opens with object counts and high-value objects.                                                     |
| `Sonic Data Lineage / High-Value Assets / FIRE Object Pilot`      | Object pilot page opens with table, view, and procedure candidates.                                              |

Record the live publish result in this document before marking the backlog item
fully complete.

## Live Publish Result

Published on 2026-06-18 with:

```powershell
npm run confluence:human:publish
```

The publish created the scoped pilot pages under root page id `2221670415`.

| Page                   | Confluence page id | Result  |
| ---------------------- | ------------------ | ------- |
| `Data Product Catalog` | `2282651652`       | Created |
| `Database Catalog`     | `2282422274`       | Created |
| `High-Value Assets`    | `2282061827`       | Created |
| `Data Product - FIRE`  | `2281963522`       | Created |
| `Sonic_DW`             | `2282684417`       | Created |
| `dbo`                  | `2282651675`       | Created |
| `FIRE Object Pilot`    | `2282455042`       | Created |

## Live Spot Check Result

Verified on 2026-06-18 with:

```powershell
npm run confluence:human:published:check
```

Result:

```json
{
  "status": "passed",
  "rootPageId": "2221670415",
  "checkedPages": 7,
  "failures": []
}
```

The checker verifies:

- each page exists under the expected parent
- each page has labels `human-lineage-catalog`, `lineage-pilot`, and
  `reviewed-pilot`
- each leaf page contains the expected human-facing sections/content snippets
- the AI retrieval artifact tree was not moved or deleted
