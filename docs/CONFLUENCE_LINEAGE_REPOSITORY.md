# Confluence Lineage Repository

The Data Governance Platform can export lineage documentation into a
Confluence-ready repository rooted at the Sonic Data Lineage page.

Confluence is the human documentation and navigation layer. The Sonic lineage
skill and other machine-readable consumers must use the Azure DevOps lineage
artifacts or runtime package, not Confluence page bodies, for normal answers.
See `docs/adr/ADR-009-Human-Centered-Confluence-Lineage-Catalog.md`.
Use `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md` for the concrete page
templates, evidence packet fields, and summary quality gate.
Use `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md` for the database, schema, and
object-library navigation rules.
Use `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md` for Rovo-specific lookup,
context, ambiguity, and evaluation artifacts.
Use `docs/CONFLUENCE_FULL_REBUILD_SCOPE.md` before any broad dry run or live
publish so the included and excluded page trees are explicit.

## Root Page

- Space: `TDE`
- Parent page ID: `2221670415`
- Page: `Sonic Data Lineage`

This lineage root sits behind the human-facing Data Engineering landing zone. See
`docs/CONFLUENCE_SPACE_MAP.md` for the full hub map and publisher page ID contract.

## Target Information Architecture

The Confluence tree should be organized for humans first:

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
          MDP AWS Lineage Context
            Data Team Feed Summary
            AWS Accounts And Services
            S3 Glue Athena Lineage
            Known Gaps And Ownership
            Technical Evidence And Readbacks
      Database Catalog
        <Database>
      <Schema>
        <Canonical Object Page>
  Confidence And Known Gaps
  Operating Guides
  AI Retrieval Artifacts
```

Use `Data Product Catalog` when a user thinks in business/application terms.
Use `Database Catalog` when a user thinks in database, schema, table, view, or
procedure terms. Both paths should link to the same canonical object page when
a human-facing object page exists.

## Human Page Types

Human pages should be answer-first, with evidence below the summary.
The page contract in `docs/CONFLUENCE_HUMAN_LINEAGE_PAGE_CONTRACT.md` is binding
for generated product, database, schema, and object pages.

### Product Pages

Product pages document business/application areas such as FIRE, FORCE, FUEL,
DOC, TRAC, TURBO, HyperCards, EchoPark Platform, MCI, and MDP.

Include:

- plain-English business purpose
- main source systems and landing/target areas
- key final tables, views, reports, SSIS packages, and procedures
- downstream impact if jobs fail or data is stale
- support checks
- links to database/schema/object pages
- confidence and known gaps

For the current AWS connector set, publish human-facing context under:

```text
Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context
```

This branch is MDP-specific because the current saved AWS connector records are
MDP-specific. It is not the default location for all future AWS metadata. Future
AWS connectors must declare an explicit product route before they are placed
under any data product. Keep Rovo lookup/context artifacts for AWS under
`AI Retrieval Artifacts`, and keep DevOps JSON/JSONL files as the
machine-readable source of truth.

### Database And Schema Pages

Database pages are technical browse pages. Schema pages are complete object
library indexes.

Include:

- inventory counts by type
- most-used or high-impact objects
- profiled vs. unprofiled table status when available
- grouped object tables for tables, views, procedures, packages, and reports
- links to object pages or AI retrieval artifacts
- extraction caveats

Schema pages must expose every cataloged object in the schema, not only the
high-use objects. Use collapsible sections when lists are long, but keep counts
and headings visible.

### Object Pages

Object pages live under their canonical database/schema path. Every object
should have one canonical destination. Tags such as `high-value`, `high-use`,
`product-critical`, `support-critical`, `profiled`, `review-needed`, and
`lineage-hotspot` identify priority and support context.

Start rich generated prose with high-use, product-critical, support-critical,
profiled, review-needed, or requested objects. Do not create a separate
top-level `High-Value Assets` object hierarchy.

Each object page should include:

- plain-English summary
- business meaning and support impact
- at-a-glance identity and confidence
- upstream loaders, source objects, and orchestrators
- downstream consumers and reports
- profile and quality signals when available
- concrete support checks
- expandable technical evidence

## Plain-English Generation

Use deterministic metadata extraction to build a structured evidence packet,
then use an LLM only to turn that bounded evidence into readable prose.

The generator should provide facts such as:

- object identity and type
- product/domain membership
- upstream/downstream relationships
- loaders, orchestrators, and consumers
- columns and column usage
- procedure/package/report calls
- profile and quality signals
- confidence, caveats, and source paths

The LLM must not invent missing business meaning. When evidence is absent, the
page should say that the information was not surfaced in metadata. Store the
summary evidence inputs or an evidence hash so reviewers can trace each
description.

## AI Retrieval Artifacts

- `Sonic Data Lineage README`
- `Latest Rebuild Report`
- `Catalog Manifest`
- `Source System Inventory`
- `Confidence Guide`
- `Object Index`
- `Rovo Start Here`
- `Rovo Object Locator ###` pages for fast name-to-page lookup
- `Rovo Database Context ###` pages for database-level questions
- `Rovo Object Summary Context ###` pages for table/view/procedure summaries
- `Rovo Upstream Context ###` and `Rovo Downstream Context ###` pages for
  lineage questions
- `Rovo Column Context ###` pages for column questions
- `Rovo Profile Context ###` pages for profile and quality context
- `Rovo Ambiguity Context ###` pages for duplicate names and aliases
- `Rovo Evaluation Prompts`
- legacy `Object Locator ###`, `Lineage Quick Context ###`, and
  `Catalog Shard ###` pages while migration is in progress
- Attachments for the full object index, export summary, and zipped markdown catalog

These pages belong under `AI Retrieval Artifacts` or another clearly separated
technical section. They are still useful for troubleshooting and validation, but
they should not be the primary human browsing path.

## Safe Local Export

```powershell
npm run confluence:export
```

The export writes to:

```text
data/confluence/export
```

This does not call Confluence and does not require credentials.

## Dry-Run Sync

```powershell
npm run confluence:dry-run
```

Dry-run reports which pages and attachments would publish.

## Live Publish

Set secrets in the local shell. Do not commit them.

```powershell
$env:CONFLUENCE_BASE_URL="https://sonicautomotive.atlassian.net/wiki"
$env:CONFLUENCE_SPACE_KEY="TDE"
$env:CONFLUENCE_PARENT_PAGE_ID="2221670415"
$env:CONFLUENCE_EMAIL="your.email@sonicautomotive.com"
$env:CONFLUENCE_API_TOKEN="your-atlassian-api-token"
```

Then publish:

```powershell
npm run confluence:sync -- --publish
```

## Rovo Retrieval Pages

Rovo is expected to read Confluence page bodies and embedded tables more
reliably than large attachments. Publish Rovo locator and context pages as page
bodies first, with attachments only as supporting evidence.

For normal database, table, package, report, and lineage questions, start with
`Rovo Object Locator ###` pages. Locator pages resolve names to exact canonical
ids and context pages. Context pages contain compact records for database
summaries, object summaries, upstream/downstream lineage, column context,
profile signals, confidence, and human page links.

Use this prompt pattern:

```text
Use Atlassian MCP to search Confluence space TDE under Sonic Data Lineage.
Search Rovo Object Locator pages first for <database, object, report, package,
pipeline, or alias>.
Pick the best canonical id and Rovo context page.
If there are multiple plausible matches, explain the ambiguity and ask the user
to choose or answer with clearly labeled options.
Then read the matching Rovo context page and answer from it if possible.
Only read canonical human pages or DevOps artifacts when deeper evidence is
required.
Do not guess; cite the page titles used.
```

Each Rovo context page contains compact records with:

- fully-qualified object IDs
- direct upstream and downstream IDs
- confidence scores and labels
- column inventory
- column usage and lineage counts
- unresolved risk counts and risk previews
- canonical human page links
- source markdown paths

Use this variable to tune shard size:

```powershell
$env:CONFLUENCE_SHARD_OBJECT_LIMIT="150"
$env:CONFLUENCE_SHARD_MAX_BYTES="250000"
$env:CONFLUENCE_OBJECT_LOCATOR_OBJECT_LIMIT="500"
$env:CONFLUENCE_OBJECT_LOCATOR_MAX_BYTES="120000"
$env:CONFLUENCE_QUICK_CONTEXT_OBJECT_LIMIT="50"
$env:CONFLUENCE_QUICK_CONTEXT_MAX_BYTES="120000"
$env:CONFLUENCE_SYNC_CONCURRENCY="6"
$env:CONFLUENCE_ATTACHMENT_SYNC_CONCURRENCY="2"
```

Use `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md` before changing locator,
context, ambiguity, or evaluation page shape.

Do not publish one rich Confluence page per object across the entire catalog
unless there is a specific business requirement and the pilot has validated page
volume. Schema pages should still list every object as a complete index. For
human pages, start with product pages, complete database/schema browse pages,
and canonical object pages with priority tags. Keep raw shard pages available as
AI retrieval artifacts instead of making them the main navigation experience.

## Medium-Safe Change Pattern

Keep Confluence lineage work medium-safe by limiting each implementation pass to
one page type or one catalog slice:

- one product page family, such as FIRE
- one database and schema pilot, such as `Sonic_DW.dbo`
- a small set of canonical object pages with priority tags
- a dry-run-only export preview

Do not combine broad page-generation, live publish, ingestion/parser changes,
and LLM summary-rule changes in one pass. Broad live publish requires dry-run
review and explicit approval.

## Codex MCP Integration

The app publisher does not require MCP. MCP is used by Codex UI to read/search the Confluence repository.

When the existing MCP details are available, configure Codex with either HTTP or STDIO transport and keep it read-only at first.

HTTP example:

```toml
[mcp_servers.sonic_confluence]
url = "https://your-mcp-host/mcp"
bearer_token_env_var = "SONIC_CONFLUENCE_MCP_TOKEN"
enabled = true
tool_timeout_sec = 60
```

STDIO example:

```toml
[mcp_servers.sonic_confluence]
command = "node"
args = ["C:/path/to/confluence-mcp/server.js"]
env_vars = [
  "CONFLUENCE_BASE_URL",
  "CONFLUENCE_EMAIL",
  "CONFLUENCE_API_TOKEN",
  "CONFLUENCE_SPACE_KEY",
  "CONFLUENCE_PARENT_PAGE_ID"
]
enabled = true
tool_timeout_sec = 60
```

Use `/mcp` in Codex to confirm the server is active.
