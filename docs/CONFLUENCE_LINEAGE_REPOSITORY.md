# Confluence Lineage Repository

The Data Governance Platform can export the markdown catalog into a Confluence-ready repository rooted at the Sonic Data Lineage page.

## Root Page

- Space: `TDE`
- Parent page ID: `2221670415`
- Page: `Sonic Data Lineage`

## What The Export Builds

- `[AUTO] Sonic Data Lineage README`
- `[AUTO] Latest Rebuild Report`
- `[AUTO] Catalog Manifest`
- `[AUTO] Source System Inventory`
- `[AUTO] Confidence Guide`
- `[AUTO] Object Index`
- `[AUTO] Object Locator ###` pages for fast name-to-page lookup
- `[AUTO] Lineage Quick Context ###` pages for fast object lookup and table-level lineage answers
- `[AUTO] Catalog Shard ###` pages containing many AI-readable object contexts
- Attachments for the full object index, export summary, and zipped markdown catalog

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

## Catalog Shard Pages

Rovo MCP is expected to read Confluence page bodies more reliably than attachments, so the export publishes object locator, quick context, and catalog shard pages by default.

For normal table/package lineage questions, start with object locator pages, then quick context pages. Locator pages resolve object names to exact quick-context pages. Quick context pages contain compact records for object IDs, aliases, direct upstream/downstream lineage, confidence, risk counts, and shard pointers.

Use this prompt pattern:

```text
Use Atlassian MCP to search Confluence space TDE under Sonic Data Lineage.
Search [AUTO] Object Locator pages first for <object name>.
Pick the best canonical object ID and quick_context_title.
Then read that [AUTO] Lineage Quick Context page and answer from it if possible.
Only read catalog shard pages when column detail or deeper evidence is required.
Do not guess; cite the page titles used.
```

Each shard contains many compact object contexts with:

- fully-qualified object IDs
- direct upstream and downstream IDs
- confidence scores and labels
- column inventory
- column usage and lineage counts
- unresolved risk counts and risk previews
- source markdown paths

Use this variable to tune shard size:

```powershell
$env:CONFLUENCE_SHARD_OBJECT_LIMIT="150"
$env:CONFLUENCE_SHARD_MAX_BYTES="250000"
$env:CONFLUENCE_OBJECT_LOCATOR_OBJECT_LIMIT="500"
$env:CONFLUENCE_OBJECT_LOCATOR_MAX_BYTES="120000"
$env:CONFLUENCE_QUICK_CONTEXT_OBJECT_LIMIT="250"
$env:CONFLUENCE_QUICK_CONTEXT_MAX_BYTES="180000"
$env:CONFLUENCE_SYNC_CONCURRENCY="6"
$env:CONFLUENCE_ATTACHMENT_SYNC_CONCURRENCY="2"
```

Do not publish one Confluence page per object unless there is a specific business requirement. The shard architecture keeps Confluence searchable without turning it into a filesystem.

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
