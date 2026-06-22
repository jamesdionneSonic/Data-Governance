# Database Catalog Medium-Intelligence Backlog

This backlog decomposes the canonical Database Catalog work into medium-safe
items. Each item should be small enough for a balanced Codex run at normal speed
with medium thinking.

Use these documents before starting any item:

1. `docs/adr/ADR-013-Complete-Database-Catalog-And-Object-Library-Pages.md`
2. `docs/adr/ADR-014-Canonical-Object-Catalog-Trust-Signals-And-Medium-Backlog.md`
3. `docs/adr/ADR-015-Rovo-Optimized-AI-Retrieval-Artifacts.md`
4. `docs/adr/ADR-016-Full-Database-Catalog-Deployment-And-Cleanup.md`
5. `docs/CONFLUENCE_DATABASE_CATALOG_LAYOUT.md`
6. `docs/ROVO_AI_RETRIEVAL_ARTIFACTS_CONTRACT.md`
7. `docs/CODEX_CONFLUENCE_DATABASE_CATALOG_PACKET.md`
8. `docs/CODEX_ROVO_AI_RETRIEVAL_PACKET.md`
9. `AI_README.md`
10. `AGENTS.md`

Use `docs/DATABASE_CATALOG_ROVO_WORK_PACKETS.md` when planning execution order,
token budget, approval gates, and medium-intelligence handoffs.

Use `docs/DATABASE_CATALOG_FULL_DEPLOYMENT_BACKLOG.md` and
`docs/DATABASE_CATALOG_FULL_DEPLOYMENT_WORK_PACKETS.md` when the work is no
longer a pilot slice and must cover every included cataloged database.

No item authorizes live Confluence publish, archive, delete, or move unless the
user explicitly approves a reviewed dry run.

## Principles

- Schema pages are complete indexes.
- Object pages are canonical destinations under database/schema.
- Rich prose is optional and evidence-bound.
- `high-value` is a tag, not a place.
- Do not infer owner, lifecycle, live freshness, or certification from weak
  metadata.
- Every generated page should say what is not surfaced in metadata.
- Rovo retrieval pages are separate AI artifacts optimized for lookup and
  answers, not the primary human browsing tree.
- Rovo must be able to answer database, object, and lineage prompts such as
  `Tell me about VendorData`, `Tell me about DimVehicle`, and
  `Show me the lineage of FactOpportunity`.

## Backlog

### DCAT-001: Add Object Trust Contract To Evidence Packets

**Goal**: Extend dry-run evidence packets for object pages with page-level trust
fields.

**Scope**:

- Add `lineage_confidence`, `description_confidence`, `profile_confidence`, and
  `documentation_confidence` fields to object-page evidence packets.
- Add `not_surfaced_facts`.
- Keep output dry-run only.

**Acceptance Criteria**:

- One dry-run object page evidence packet contains all confidence fields.
- Missing owner, SLA, live freshness, lifecycle/status, and business definition
  are marked `not surfaced in metadata` when absent.
- No live Confluence write occurs.

### DCAT-002: Define Deterministic Object Tag Assignment

**Goal**: Implement deterministic tag assignment for the first safe tags.

**Scope**:

- Add `high-use`, `profiled`, `lineage-hotspot`, and `review-needed` rules.
- Do not auto-assign `high-value`.
- Write tag reasons into the evidence packet.

**Acceptance Criteria**:

- Schema object rows show tags and tag reasons.
- `high-value` appears only when explicitly supplied by reviewed input.
- Tag assignment does not use LLM output.

### DCAT-003: Generate Complete Schema Object Table For One Slice

**Goal**: Make one schema page a complete object-library index.

**Suggested Slice**: `Sonic_DW.dbo`

**Scope**:

- Generate grouped tables, views, procedures, and other objects.
- Include object, type, tags, purpose, columns, upstream, downstream, profile,
  and confidence columns.
- Use collapsible sections only if the renderer supports them safely.

**Acceptance Criteria**:

- Every cataloged object in the selected schema appears once.
- Counts reconcile to the evidence packet.
- High-use objects remain easy to find without hiding the complete inventory.

### DCAT-004: Generate Thin Canonical Object Pages For One Object Type

**Goal**: Create canonical thin object-page dry-run output for one object type in
one schema.

**Suggested Slice**: `Sonic_DW.dbo` tables.

**Scope**:

- Page path: `Database Catalog / Sonic_DW / dbo / <ObjectName>`.
- Include identity, tags, columns, upstream/downstream counts, profile
  availability, confidence, evidence links, and missing facts.
- Avoid rich prose unless evidence is strong.

**Acceptance Criteria**:

- Thin pages exist in dry-run output for the selected object type.
- Page titles are clean object names, with collision qualifiers only when
  needed.
- No pages are generated under `High-Value Assets`.

### DCAT-005: Add Alias/Search Metadata

**Goal**: Make canonical object pages easier to find.

**Scope**:

- Add fully qualified name, schema/object name, object name, underscore-free
  normalized name, casing variants, and surfaced product/report/package aliases.
- Do not invent business aliases.

**Acceptance Criteria**:

- Evidence packets include aliases and alias reasons.
- Rendered page includes a compact search/aliases section or metadata block.
- Alias generation is deterministic.

### DCAT-006: Add Missing-Facts Section To Object Pages

**Goal**: Make unsupported governance facts explicit.

**Scope**:

- Add `Not Surfaced In Metadata` or `Known Gaps` section.
- Include owner, steward, SLA, live freshness, lifecycle/status, business
  definition, source system of record, downstream business report names, and
  profile data when absent.

**Acceptance Criteria**:

- Missing facts are visible on thin and rich object pages.
- Pages do not show `Owner: Data Team` as a generated fallback.
- Pages do not show live freshness or lifecycle/status unless evidence supports
  it.

### DCAT-007: Add Backlinks And Related Navigation

**Goal**: Prevent object pages from becoming dead ends.

**Scope**:

- Add links back to database and schema pages.
- Link to product pages, SSIS/SSRS/ADF pages, upstream loaders, and downstream
  consumers when human pages exist.
- Avoid duplicating object detail on product pages.

**Acceptance Criteria**:

- One dry-run object page links to its database and schema pages.
- Related product/support links appear only when surfaced in evidence.
- Product pages link to canonical object pages instead of duplicate summaries.

### DCAT-008: Report Superseded Schema And High-Value Pages

**Goal**: Prepare safe cleanup without doing cleanup.

**Scope**:

- Dry-run report identifies pages such as `Schema - Sonic_DW.dbo`.
- Dry-run report identifies pages such as
  `High-Value Object - Sonic_DW.dbo.Dim_Vehicle`.
- Report includes canonical replacement path and action recommendation.

**Acceptance Criteria**:

- Report distinguishes `replace`, `archive candidate`, and `manual review`.
- Count/evidence mismatches between duplicates are surfaced.
- No live archive/delete/move occurs.

### DCAT-009: Add Rich Object Page Promotion Rules

**Goal**: Decide when thin pages become rich pages.

**Scope**:

- Rich page when object is requested, reviewed, profiled, product-critical,
  support-critical, or safe high-use/high-confidence.
- LLM prose uses bounded evidence packet only.
- Generic prose fails validation.

**Acceptance Criteria**:

- Promotion criteria are deterministic and visible in evidence.
- Rich prose is absent or clearly limited when evidence is weak.
- Validator rejects generic summaries such as `This object handles data`.

### DCAT-010: Update Human Catalog Validators

**Goal**: Make validation enforce the new IA and trust rules.

**Scope**:

- Fail noncanonical schema titles under database pages.
- Fail object pages under `High-Value Assets`.
- Fail missing schema object inventory.
- Warn on missing page-level confidence, aliases, backlinks, or missing-facts
  sections.

**Acceptance Criteria**:

- Validator fails a fixture with `Schema - Sonic_DW.dbo`.
- Validator fails a fixture with `High-Value Object - ...` under the old branch.
- Validator passes the canonical path fixture.

### DCAT-011: Dry-Run Sonic_DW.dbo End-To-End

**Goal**: Prove the full pattern for one schema without live publish.

**Scope**:

- Database page update.
- Complete `dbo` schema page.
- Thin canonical table pages.
- Tag evidence.
- Duplicate/superseded-page report.

**Acceptance Criteria**:

- Dry-run output is reviewable in local markdown/HTML.
- Object counts reconcile.
- No live Confluence write occurs.

### DCAT-012: Reviewed Live Publish Packet

**Goal**: Prepare, but not automatically run, the first live publish.

**Scope**:

- Summarize dry-run results.
- List pages to create/update.
- List superseded pages needing explicit cleanup approval.
- List known gaps and rollback plan.

**Acceptance Criteria**:

- User can approve or reject live publish from the packet.
- Cleanup is separated from canonical page creation.
- No live action is taken by this backlog item itself.

### DCAT-013: Add Rovo Start Here Page Dry Run

**Goal**: Create the first Rovo routing page under `AI Retrieval Artifacts`.

**Scope**:

- Generate `Rovo Start Here` in dry-run output.
- Include lookup order, ambiguity behavior, unsupported-fact rules, generated
  date, evidence version, and links to Rovo locator/context page families.
- Keep the page short and instruction-oriented.

**Acceptance Criteria**:

- The page tells Rovo to search Object Locator pages first.
- The page tells Rovo not to invent owner, SLA, lifecycle/status, live freshness,
  or certification.
- No page is generated under the human `Database Catalog` or
  `Data Product Catalog`.
- No live Confluence write occurs.

### DCAT-014: Generate Rovo Object Locator For One Slice

**Goal**: Make Rovo resolve database and object names from compact locator
tables.

**Suggested Slice**: `VendorData` database plus `Sonic_DW.dbo` requested
objects.

**Scope**:

- Generate locator rows for databases, schemas, tables, views, procedures,
  reports, packages, and pipelines in the selected slice.
- Include `lookup_key`, `canonical_id`, `type`, `database`, `schema`, `object`,
  `aliases`, `quick_context_page`, `canonical_human_page`, and `confidence`.
- Include normalized aliases such as casing variants and underscore-free names.

**Acceptance Criteria**:

- `VendorData` resolves as a database, not only as an object prefix.
- `DimVehicle` resolves to a canonical object or an explicit ambiguity group.
- Locator rows link to the best Rovo context page and canonical human page when
  present.
- No live Confluence write occurs.

### DCAT-015: Add Rovo Database Context Pages

**Goal**: Let Rovo answer `tell me about the database <name>` prompts.

**Suggested Slice**: `VendorData`.

**Scope**:

- Generate compact database context records with database purpose when surfaced,
  schemas, object counts, tagged objects, profile coverage, related products,
  known gaps, confidence, and canonical database page links.
- Use embedded Confluence tables or compact page sections.

**Acceptance Criteria**:

- A dry-run context page can answer `Tell me about the database VendorData`.
- Missing business purpose, owner, SLA, lifecycle/status, live freshness, and
  certification are marked `not surfaced in metadata` when absent.
- The context page links to the canonical database catalog page.

### DCAT-016: Add Rovo Object Summary Context Pages

**Goal**: Let Rovo answer `tell me about <object>` prompts.

**Suggested Object**: `DimVehicle`.

**Scope**:

- Generate object summary context with fully qualified name, type, aliases,
  tags, bounded plain-English summary, column count/key columns, upstream
  summary, downstream summary, profile status, confidence, missing facts, and
  canonical human page link.
- Keep pages around 50 objects per context page until evaluation proves a
  larger size is reliable.

**Acceptance Criteria**:

- `DimVehicle` can be answered from a compact context page.
- The answer context includes enough detail for purpose, columns, upstream,
  downstream, and confidence.
- Unsupported governance facts are not inferred.

### DCAT-017: Add Rovo Lineage Context Pages

**Goal**: Let Rovo answer `show me the lineage of <object>` prompts.

**Suggested Object**: `FactOpportunity`.

**Scope**:

- Generate upstream and downstream context pages split by intent.
- Include upstream sources, upstream loaders, orchestrators, downstream
  consumers, downstream reports, maintenance reads, relationship confidence,
  caveats, and canonical human page links.

**Acceptance Criteria**:

- `FactOpportunity` lineage can be answered from upstream/downstream context.
- Relationships are grouped by role, not dumped as an unclassified edge list.
- Rovo context links to deeper human pages or DevOps artifacts when available.

### DCAT-018: Add Rovo Ambiguity Context

**Goal**: Make similar names explicit so Rovo does not answer from the wrong
object.

**Scope**:

- Generate ambiguity groups for duplicate lookup keys, same object names across
  schemas/databases, casing variants, underscore variants, and table/view/proc
  collisions.
- Include recommended disambiguation text.

**Acceptance Criteria**:

- Ambiguous names produce multiple labeled options.
- The Rovo instruction tells the agent to ask the user to choose when no match
  is clearly dominant.
- Ambiguity is deterministic and not LLM-decided.

### DCAT-019: Add Rovo Evaluation Prompt Set

**Goal**: Measure whether Rovo can answer the target questions before broad
publish.

**Scope**:

- Create an evaluation prompt set with up to 50 prompts.
- Include database summary, object summary, alias lookup, misspelling/casing,
  lineage, column, ambiguity, and unsupported owner/freshness/status prompts.
- Include expected canonical id, expected retrieval page, and forbidden
  invented facts.

**Acceptance Criteria**:

- Evaluation includes prompts for `VendorData`, `DimVehicle`, and
  `FactOpportunity`.
- Expected answers require citing or linking the retrieval page used.
- The set fails answers that invent unsupported owner, SLA, lifecycle/status,
  live freshness, or certification.

### DCAT-020: Add Rovo Retrieval Validators

**Goal**: Enforce the Rovo artifact contract before publish.

**Scope**:

- Validate required locator/context fields.
- Validate database-level locator entries exist.
- Validate context page size limits.
- Validate canonical human page links when pages exist.
- Validate no raw rows, sample values, secrets, credentials, or connection
  strings are published.

**Acceptance Criteria**:

- A fixture without database locator rows fails.
- A fixture without ambiguity groups for duplicate lookup keys fails or warns.
- A fixture over the configured page-size limit produces a split
  recommendation.
- No live Confluence write occurs.

## Out Of Scope For Medium

- Full-catalog live publish.
- Deleting or archiving Confluence pages.
- Owner/steward inference.
- Lifecycle/status inference.
- Live freshness monitoring in Confluence.
- Ingestion/parser/semantic-scoring changes.
- Unrestricted LLM summarization.
- Treating Rovo as the lineage engine instead of the retrieval and answer layer.
