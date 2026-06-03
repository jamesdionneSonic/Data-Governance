STRUCTURED REQUIREMENTS SPECIFICATION

System Context: You are an Enterprise Data Architect and Senior Node.js Developer.
You are tasked with a root-level refactor of the data governance lineage extraction
engine: sqlServerExtractor.js, ssisExtractor.js, and lineageResolver.js.

The goal is not to maximize edge count. The goal is to maximize trustworthy,
explainable lineage while retaining ambiguous extraction evidence for review.

1. THE PROBLEM STATEMENT

The current engine suffers from severe namespace collisions, causing massive edge
hallucination, while simultaneously failing to map legitimate cross-server data
movement. It misses linked-server syntax, fails to dynamically map N-level SSIS
parent/child chains without naming conventions, and hallucinates nodes for
external SFTP/files.

The new engine must separate "evidence capture" from "validated edge creation."
Extractors may capture imperfect facts, but the resolver may only promote facts
into graph edges when they pass identity, topology, and evidence validation.

2. CORE DESIGN PRINCIPLE

Strict final edges, permissive evidence capture.

The engine must capture every observable lineage clue as a raw lineage fact, even
when incomplete. The engine must only promote a raw fact into a graph edge when:

* both endpoints are canonical or intentionally typed process IDs,
* the edge type is legal for the endpoint types,
* the edge has concrete parser evidence,
* the edge does not violate the process-bridge topology, and
* the resolver did not rely on substring, stem, name-only, or fuzzy matching.

Ambiguous facts must not disappear. They must be written to an
`unresolved_lineage` or `probable_lineage` section with enough diagnostics for a
human or future mapping rule to resolve them.

3. IDENTITY AND STORAGE TOPOLOGY

A. Canonical SQL Object IDs

All governed SQL object IDs must be fully qualified:

`[ServerName].[DatabaseName].[SchemaName].[ObjectName]`

Examples:

* `DW01.Sonic_DW.dbo.DimVehicle`
* `LinkedSrv.CustomerDB.sales.Orders`

The `ServerName` is derived from:

* the literal linked-server segment for 4-part SQL references,
* the connection manager `ServerName`, `DataSource`, or connection string for SSIS,
* the UI/connection input for local SQL objects.

B. Canonical SSIS Package IDs

All SSIS package IDs must use:

`[ServerName].SSISDB.[FolderName].[ProjectName].[PackageName]`

Example:

`ETL01.SSISDB.DimVehicle.DimVehicle.DimVehicle_Master.dtsx`

C. SQL File Storage Standard

SQL markdown output must be partitioned by server:

`data/markdown/servers/[ServerName]/databases/[DatabaseName]/tables/[Schema]__[Table].md`

Equivalent subfolders must be used for views, stored procedures, functions,
triggers, and synonyms.

D. SSIS File Storage Standard

SSIS markdown output must be partitioned by server:

`data/markdown/servers/[ServerName]/ssis_packages/[FolderName]/[ProjectName]/[PackageName].md`

4. EDGE VALIDATION MODEL

A. Validation Tiers

Validated edges are allowed in the default graph. Probable edges may be shown only
behind an explicit UI toggle or review mode. Unresolved facts must not be drawn as
lineage edges.

| Tier | Meaning | Default Graph |
| --- | --- | --- |
| `validated` | Canonical endpoints, legal edge type, concrete evidence | Yes |
| `probable` | Strong evidence but one missing context such as unresolved server | Optional review toggle only |
| `unresolved` | Dynamic SQL, dynamic connection, external path, unknown object, missing endpoint | No |

B. Edge Contract

Every promoted edge must include:

```json
{
  "id": "deterministic-stable-id",
  "source_id": "ETL01.SSISDB.Folder.Project.Package.dtsx",
  "target_id": "DW01.Sonic_DW.dbo.TargetTable",
  "source_type": "package",
  "target_type": "table",
  "edge_type": "WRITES_TO",
  "validation_status": "validated",
  "confidence": 1.0,
  "evidence_type": "ssis_dataflow_destination",
  "evidence_text": "OLE DB Destination OpenRowset=dbo.TargetTable",
  "source_artifact": "Folder/Project/Package.dtsx",
  "component_name": "Load Target",
  "parser": "ssis_xml",
  "extracted_at": "ISO-8601 timestamp"
}
```

No evidence means no promoted edge.

C. Legal Edge Type Matrix

The resolver must reject any edge not allowed by this matrix.

| Edge Type | Source Type | Target Type | Meaning |
| --- | --- | --- | --- |
| `READS_FROM` | package, procedure, view, function, trigger | table, view, synonym | Process reads data from object |
| `WRITES_TO` | package, procedure, trigger | table | Process writes data to table |
| `CALLS` | package, procedure, agent_job | package, procedure | Process invokes another process |
| `TRIGGERS` | agent_job | package, procedure | Scheduler triggers process |
| `DEPENDS_ON_VIEW` | view | table, view, synonym | View definition references object |
| `USES_LOOKUP` | package | table, view, synonym | SSIS lookup reads reference data |

Hard rule: SQL tables, databases, and files must never connect directly to other
SQL tables, databases, or files in the graph.

5. RAW FACT AND UNRESOLVED LINEAGE CONTRACT

Extractors must preserve ambiguous observations without promoting them into graph
edges.

Example:

```yaml
unresolved_lineage:
  - source_artifact: DimVehicle_Master.dtsx
    source_id: ETL01.SSISDB.DimVehicle.DimVehicle.DimVehicle_Master.dtsx
    evidence_type: dynamic_connection_string
    evidence_text: "@[$Project::TargetConnection]"
    reason: Connection manager uses unresolved project variable.
    suggested_action: Map project parameter TargetConnection to server/database.
    validation_status: unresolved
```

External input example:

```yaml
external_inputs:
  - source_type: sftp
    evidence_text: sftp://vendor.example/inbound/vehicle.csv
    target_id: DW01.Sonic_DW.stg.VehicleInbound
    target_external_source: true
```

External files and SFTP paths must not become graph nodes.

6. ARCHITECTURAL TOPOLOGY AND PARSING RULES

A. Data Flow and Boundary Rules

* External files, SFTP paths, and external client feeds do not get markdown nodes.
* Receiving staging tables must be tagged with `external_source: true` only when
  there is concrete external-source evidence.
* The engine must not mark every table without a creator as external.
* Every data movement edge must pass through a package, procedure, view, function,
  trigger, or agent job.
* Pipelines are N-level deep. The resolver must follow valid process-to-process
  and process-to-data edges until the chain naturally terminates.

B. Cross-Server Resolution

SSIS:

* Data-flow targets and SQL task targets must use the target connection manager's
  server, not the host server running SSIS.
* Data-flow sources must use the source connection manager's server.
* Connection manager resolution order:
  1. explicit `ServerName` or `DataSource` property,
  2. parsed `Server` or `Data Source` from connection string,
  3. resolved SSISDB environment/project/package parameter,
  4. unresolved fact if still unknown.

SQL:

* 4-part SQL reference `[LinkedServer].[Database].[Schema].[Object]` must use
  `LinkedServer` as the server.
* 3-part SQL reference `[Database].[Schema].[Object]` must use the local server.
* 2-part SQL reference `[Schema].[Object]` must use local server and current database.
* 1-part SQL reference `[Object]` must use local server, current database, and
  default schema.

C. Dynamic Inputs

Dynamic SQL, dynamic table names, dynamic connection strings, package parameters,
and variables must be captured as unresolved facts unless the final value can be
resolved from SSISDB/environment metadata or explicit user-provided mappings.

7. SSIS EXTRACTION RULES

* A package node ID must be `[ServerName].SSISDB.[Folder].[Project].[Package]`.
* An SSIS data-flow source creates `Package -> SourceObject` with `READS_FROM`.
* An SSIS lookup creates `Package -> LookupObject` with `USES_LOOKUP`.
* An SSIS data-flow destination creates `Package -> TargetTable` with `WRITES_TO`.
* An Execute SQL Task that executes a procedure creates `Package -> Procedure`
  with `CALLS`.
* An Execute SQL Task that writes a table creates `Package -> Table` with
  `WRITES_TO`.
* An ExecutePackageTask creates `ParentPackage -> ChildPackage` with `CALLS`.
* SQL Agent SSIS execution creates `AgentJob -> Package` with `TRIGGERS`.
* Package-to-package relationships must be behavior-based, never naming-convention
  based.
* A source/destination pair inside a data flow must not create a table-to-table
  edge. The package is the process bridge.

8. SQL EXTRACTION RULES

* Stored procedure, trigger, and function definitions must be parsed into process
  edges, not table-to-table shortcuts.
* `FROM`, `JOIN`, and `USING` references create `Process -> Object` with
  `READS_FROM`.
* `INSERT INTO`, `MERGE INTO`, `UPDATE`, and write-side `DELETE` targets create
  `Process -> Table` with `WRITES_TO`.
* View definitions create `View -> Object` with `DEPENDS_ON_VIEW`.
* Linked-server references must preserve the linked server as the canonical
  server segment.
* OPENQUERY must be captured as unresolved or probable unless the remote object
  can be parsed and canonicalized with evidence.

9. RESOLVER LOCKDOWN RULES

The resolver must never use:

* substring matching,
* object name alone,
* package file stem alone,
* schema/object alone,
* database/object alone,
* case-insensitive partial path matching,
* fuzzy matching,
* greedy alias candidate expansion.

The resolver may only resolve references by:

* exact canonical ID match,
* exact canonical package ID match,
* an explicit alias mapping file created by a user or trusted import,
* a deterministic normalization rule defined in this spec.

If a reference cannot be resolved by those rules, it must become an unresolved
fact, not a graph edge.

10. EDGE REJECTION RULES

The resolver must reject or quarantine:

* any edge with non-canonical SQL endpoints,
* any edge with non-canonical SSIS package endpoints,
* any table-to-table data movement edge,
* any edge to `unknown_table`, `unknown_db`, `UNKNOWN`, or `UNRESOLVED_DYNAMIC_EDGE`,
* any edge to a file path, SFTP path, raw connection string, or raw variable name,
* any edge with no evidence,
* any edge resolved by partial names,
* any edge that uses SSIS host server instead of source/target connection manager
  server for a data object,
* duplicate edges with conflicting endpoint types.

Rejected items must be counted and written to diagnostics.

11. LINEAGE QUALITY OUTPUT

Each extraction run must return:

```json
{
  "validatedEdgeCount": 0,
  "probableEdgeCount": 0,
  "unresolvedFactCount": 0,
  "rejectedFactCount": 0,
  "externalInputCount": 0,
  "duplicateIdCount": 0,
  "warnings": []
}
```

Markdown files must include:

* `id`
* `type`
* `server`
* `database`
* canonical `depends_on`, `reads_from`, `writes_to`, `calls`, or `triggered_by`
* `external_source` only when supported by evidence
* `lineage_quality`
* unresolved/probable diagnostics when present

12. AI AND COLUMN-LEVEL IMPACT ANALYSIS MARKDOWN CONTRACT

Markdown is not only the application catalog. It is also an AI-readable evidence
corpus. A Codex-style assistant must be able to answer relationship and impact
questions from the markdown files without reconnecting to production systems.

The markdown must support questions such as:

* What feeds this table?
* What does this table feed?
* Which SSIS packages and SQL processes touch this table?
* If I add a column here, where else may it need to be added?
* If I delete, rename, resize, or change the nullability of a column, what could
  break?
* Which downstream objects reference this column directly, indirectly, or through
  unresolved/dynamic logic?

A. Table Column Contract

Table and view markdown must include a `columns` section with stable,
fully-qualified column IDs:

`[ServerName].[DatabaseName].[SchemaName].[ObjectName].[ColumnName]`

Each column entry must include, when available:

* `name`
* `column_id`
* `data_type`
* `max_length`, `precision`, `scale`
* `nullable`
* `identity`
* `computed`
* `default`
* primary key, foreign key, unique key, and indexed participation
* sensitivity/classification tags
* extraction evidence source and timestamp

B. Column Usage Contract

Procedure, function, trigger, view, and package markdown must include
`column_usage` when parser evidence exists. Each usage record must include:

```yaml
column_usage:
  - column_id: DW01.Sonic_DW.dbo.FactClaim.ClaimAmount
    object_id: DW01.Sonic_DW.dbo.FactClaim
    process_id: ETL01.ETL_Staging.jma.Load_FactClaim
    usage_type: read
    usage_context: select_list
    expression: src.ClaimAmount
    evidence_type: sql_definition
    evidence_text: "src.ClaimAmount"
    source_artifact: stored_procedures/jma__Load_FactClaim.md
    validation_status: validated
```

Legal `usage_type` values:

* `read`
* `write`
* `join_key`
* `filter`
* `group_by`
* `order_by`
* `calculation`
* `insert_target`
* `update_target`
* `merge_key`
* `lookup_key`
* `lookup_output`
* `parameter`
* `dynamic_or_unresolved`

C. Column Lineage Contract

When source-to-target column mapping evidence exists, markdown must include
`column_lineage` records:

```yaml
column_lineage:
  - source_column_id: Vendor01.VendorData.jma.Claims.Amount
    target_column_id: DW01.Sonic_DW.dbo.FactClaim.ClaimAmount
    process_id: ETL01.SSISDB.Claims.Claims.LoadClaims.dtsx
    transform_type: direct
    expression: Amount
    evidence_type: ssis_dataflow_mapping
    evidence_text: "InputColumn=Amount OutputColumn=ClaimAmount"
    validation_status: validated
    confidence: 1.0
```

Legal `transform_type` values:

* `direct`
* `cast`
* `rename`
* `derived`
* `aggregate`
* `lookup`
* `constant`
* `case_expression`
* `calculation`
* `dynamic_or_unresolved`

No parser evidence means no promoted column lineage. Ambiguous column facts must
be written to `unresolved_column_lineage` with the reason and suggested action.

The column lineage resolver must follow these promotion rules:

* promote only records where both source and target resolve to known canonical
  `column_id` values,
* allow SSIS object references only when they match a canonical object ID, a
  fully qualified `database.schema.object` reference, or an exact
  package-scoped source/target reference from `reads_from` or `writes_to`,
* reject name-only, substring, fuzzy, and ambiguous matches,
* separate non-promoted facts with `validation_status` values of `probable`,
  `unresolved`, or `rejected`,
* include `reason`, `evidence_type`, `evidence_text`, `confidence`, and
  `suggested_action` for every non-promoted fact.

D. SSIS Column Mapping Contract

SSIS package markdown must preserve data-flow component mappings where available:

* data flow name
* component name
* component type
* source connection manager
* destination connection manager
* source object
* destination object
* input column name
* output column name
* external metadata column name
* lineage ID or ref ID when present
* mapping evidence text
* unresolved variable/parameter diagnostics

The extractor must capture SSIS mappings from data-flow XML, including mappings
nested inside containers. If a mapping references a dynamic source, destination,
or expression that cannot be resolved, it must be captured as unresolved column
lineage, not promoted as a validated mapping.

SSIS package markdown must write validated package-level mapping evidence as
`ssis_column_mappings`:

```yaml
ssis_column_mappings:
  - package_id: SSIS01.SSISDB.ETL.Claims.LoadClaims.dtsx
    data_flow_name: "DFT - Load Claims"
    component_name: "OLE DB Destination"
    component_type: Microsoft.OLEDBDestination
    source_component: "Flat File Source"
    destination_component: "OLE DB Destination"
    source_object: "Flat File Source"
    destination_object: StagingDB.JMA.STG_JMA_CLAIMS_FINANCIAL_TRANSACTIONS_TBL
    input_column: ClaimDebitCreditCode
    output_column: CLAIM_DEBIT_CREDIT_CODE
    external_metadata_column: CLAIM_DEBIT_CREDIT_CODE
    transform_type: rename
    expression: ClaimDebitCreditCode
    evidence_type: ssis_dataflow_column_mapping
    evidence_text: "InputColumn=ClaimDebitCreditCode; ExternalColumn=CLAIM_DEBIT_CREDIT_CODE"
    validation_status: validated
```

Large packages must not quarantine valid mappings just because the parent
package frontmatter would become too large. The package markdown may embed a
small preview of `ssis_column_mappings`, but the complete mapping set must be
written to markdown sidecar datasets referenced by
`ssis_column_mapping_sidecars`:

```yaml
ssis_column_mapping_summary:
  total_mappings: 425
  embedded_mappings: 25
  sidecar_mappings: 425
  sidecar_chunks: 2
  truncated: false
ssis_column_mapping_sidecars:
  - id: SSIS01.SSISDB.ETL.Claims.LoadClaims.dtsx.ssis_column_mappings.chunk_001
    chunk_number: 1
    records: 250
```

Sidecar markdown datasets must include the parent `package_id`, the same
`reads_from` and `writes_to` scope candidates, and full `ssis_column_mappings`
records. The column lineage resolver must attach sidecar mappings back to the
parent package ID so impact analysis cites the SSIS package, not the sidecar, as
the process.

Non-SQL SSIS endpoints such as flat files, Excel files, raw files, XML,
SharePoint, Access, FTP/SFTP files, and recordsets must be represented as
external-source markdown datasets when SSIS provides component or column
metadata. These objects must use `external_source: true`, stable column IDs, and
`ssis_external_component` extraction evidence so they can participate in
column-level lineage without pretending to be SQL tables.

Unresolved SSIS column facts must be written to
`unresolved_ssis_column_mappings`:

```yaml
unresolved_ssis_column_mappings:
  - package_id: SSIS01.SSISDB.ETL.Claims.LoadClaims.dtsx
    component_name: DynamicClaimsConnection
    component_type: connection_manager
    reason: dynamic_connection_manager
    evidence_type: ssis_dynamic_connection
    evidence_text: "@[User::ClaimsConnectionString]"
    variable_names:
      - ClaimsConnectionString
    validation_status: unresolved
```

Dynamic connection managers must first be resolved from package variables,
project/package parameters, environment variables, and literal SSIS
expressions. A dynamic connection manager should remain in
`unresolved_ssis_column_mappings` only when the unresolved value can affect SQL
lineage or object identity. File-path-only external endpoints and
credential-only expressions must not be counted as failed SSIS column mappings.
Raw rebuilds that do not have live SSISDB runtime metadata may use scoped
`ssisProjectParameterOverrides` from the lineage alias configuration. Overrides
must be scoped by folder/project, folder/project/package, or an explicit flat
key so a runtime value cannot leak into unrelated packages.

E. Change Impact Contract

Markdown must contain enough evidence for the impact engine and AI reader to
classify column-change risk. The following change types must be supported:

* `add_column`
* `drop_column`
* `rename_column`
* `change_data_type`
* `change_length_precision_scale`
* `change_nullability`
* `change_default`
* `change_key_or_index`

For each impacted object or process, the generated evidence must allow the system
to explain:

* why the object is impacted,
* which column usage caused the impact,
* whether the impact is validated, probable, or unresolved,
* whether the issue is a compile-time break, runtime load failure, data quality
  risk, reporting semantic risk, or low-risk metadata-only change,
* which SSIS package, SQL procedure, view, function, trigger, or table is the
  next owner to inspect.

Impact records must classify impact using these stable `impact_type` values:

* `compile_time_break`
* `runtime_load_failure`
* `semantic_reporting_risk`
* `data_quality_risk`
* `metadata_only`

Each impact response must include `severity`, `validation_status`,
`evidence_type`, `evidence_text`, and the affected markdown object or process ID.

F. Risk Flags Required For AI Impact Answers

The extractor must flag patterns that make column impact analysis risky:

* `select_star`
* `insert_without_column_list`
* `merge_without_explicit_column_mapping`
* `dynamic_sql`
* `dynamic_table_name`
* `dynamic_column_name`
* `unresolved_ssis_expression`
* `unresolved_connection_manager`
* `implicit_conversion`
* `computed_column_dependency`
* `schema_bound_view_dependency`
* `index_or_constraint_dependency`

These flags must be written to markdown even when no validated column edge can be
created. AI answers must surface these risks instead of pretending the impact is
known.

SQL object markdown must write risk facts as structured `column_risk_flags`
records:

```yaml
column_risk_flags:
  - process_id: DW01.Sonic_DW.etl.LoadFactClaim
    flag_type: select_star
    severity: high
    usage_context: select_list
    object_id: DW01.Sonic_DW.dbo.FactClaim
    evidence_type: sql_definition
    evidence_text: "SELECT src.* FROM staging.Claims AS src"
    reason: "SELECT * hides column-level dependencies from explicit parser evidence."
    suggested_action: "Replace star expansion with an explicit column list."
    validation_status: risk_flag
```

Risk flags are not promoted lineage edges. They are evidence-backed warnings
that downstream impact answers must display when the extractor cannot prove
complete column coverage.

G. AI Answerability Requirement

For every governed table, a human or AI reading only the markdown corpus must be
able to produce:

* a table-level upstream/downstream summary,
* a column-level direct usage summary,
* a downstream blast-radius summary for a named column,
* a list of unresolved risks that require human review,
* evidence citations back to markdown object IDs, process IDs, package names,
  component names, or SQL snippets.

The markdown must prefer stable structured YAML for machine reading and concise
human-readable sections for review. Long SQL definitions may remain in fenced
SQL blocks, but extracted column usage and lineage facts must be represented as
structured metadata.

The Codex/AI context output must be generated from the markdown catalog only and
must include both structured JSON and rendered markdown. The rendered markdown
must contain these sections:

* `Focus`
* `Table-Level Upstream`
* `Table-Level Downstream`
* `Direct Column Usage`
* `Column Lineage`
* `Downstream Blast Radius`
* `Unresolved Risks`

The context API must accept object ID, column name or column ID, and change type.
It must return evidence labels (`validation_status`, `confidence`,
`evidence_type`, and `evidence_text`) so Codex can distinguish validated impact
from unresolved risk without reconnecting to SQL Server or SSIS.

13. ACCEPTANCE FIXTURES

The refactor must include tests or fixtures for:

* SQL 1-part, 2-part, 3-part, and 4-part linked-server references.
* SQL procedure reading from one table and writing to another.
* SQL view depending on tables across database boundaries.
* SSIS package reading a source table and writing a target table on a different server.
* SSIS parent package calling two child packages through ExecutePackageTask.
* SQL Agent job triggering an SSIS package.
* SSIS SFTP/file source loading a staging table without creating a file node.
* Two different servers/databases containing the same schema/table name.
* Dynamic SQL target that must become unresolved, not a fake edge.
* Dynamic SSIS connection manager that must become unresolved unless mapped.
* SQL procedure using explicit column lists for INSERT, UPDATE, MERGE, JOIN, and
  WHERE usage.
* SQL procedure using `SELECT *`, which must produce a risk flag.
* SQL procedure using INSERT without a column list, which must produce a risk
  flag.
* SSIS data-flow mapping a source column to a renamed destination column.
* SSIS derived-column transformation with direct and calculated outputs.
* A dropped-column impact fixture proving downstream SQL, SSIS, views, indexes,
  and unresolved risks are reported separately.

14. ACCEPTANCE CRITERIA

Regex and Parser Update:

* Refactor sqlServerExtractor.js to parse 4-part linked-server names correctly.
* Enforce server override from linked-server syntax.
* Emit process-to-data edges from SQL definitions.
* Extract column usage from explicit SQL references when parser evidence exists.
* Preserve `SELECT *`, positional inserts, dynamic SQL, and unresolved references
  as risk flags or unresolved column lineage.

SSIS Refactor:

* Refactor ssisExtractor.js to emit canonical package IDs.
* Resolve data source and target server names from their own connection managers.
* Infer N-level package chains from ExecutePackageTask behavior.
* Capture external file/SFTP inputs as external facts and mark receiving targets,
  not file nodes.
* Extract SSIS data-flow column mappings and derived-column expressions when
  available.
* Preserve unresolved SSIS variables, parameters, and dynamic mappings as
  unresolved column lineage diagnostics.

Resolver Lockdown:

* Rewrite lineageResolver.js to enforce exact canonical matching.
* Remove partial alias matching from final edge promotion.
* Preserve unresolved and probable facts with diagnostics.
* Validate every promoted edge against the legal edge matrix.
* Validate every promoted column edge against canonical source and target column
  IDs.

Reliability:

* Extraction must fail gracefully by section.
* A permission failure in one SQL metadata query must not label the entire run as
  a connection failure.
* Startup health checks must not wait for full corpus lineage resolution.
* Tests must assert clean validated edges and useful unresolved diagnostics.
* Tests must assert AI-answerable markdown for table-level and column-level
  impact questions.

15. CONFLUENCE LINEAGE REPOSITORY CONTRACT

The markdown catalog must be publishable to a Confluence page tree so humans and
Codex-style assistants can answer lineage questions from the generated corpus.
The Confluence repository is a distribution channel for the markdown source of
truth; it must not become a competing hand-edited source.

A. Repository Root

The default Confluence root is:

* Base URL: `https://sonicautomotive.atlassian.net/wiki`
* Space key: `TDE`
* Parent page ID: `2221670415`
* Root page title: `Sonic Data Lineage`

B. Export Artifacts

Each export must build:

* generated summary pages for README, rebuild report, catalog manifest, source
  inventory, confidence guide, and object index,
* fast object locator pages that resolve object names and aliases to exact
  quick-context pages from Confluence page bodies,
* fast lineage quick-context pages that expose searchable object aliases,
  direct upstream/downstream lineage, confidence, risk counts, and shard pointers
  from Confluence page bodies,
* Rovo-readable catalog shard pages containing many compact AI-readable object
  contexts,
* a machine-readable object index attachment,
* an export summary attachment,
* a zipped markdown catalog attachment,
* a `confluence-export-manifest.json` with file hashes, page titles, attachment
  names, labels, and publish flags.

C. Publishing Safety

Generated Confluence pages must be prefixed with `[AUTO]`. The sync process must
support dry-run mode, hash-aware publishing, and environment-variable secrets.
The default AI-facing corpus must be object locator pages, quick-context pages,
and catalog shard pages, not one page per object. Object locator pages must make
ambiguous name searches fast by mapping names/aliases to exact quick-context
page titles. Quick-context pages must support table-level lineage answers from
page bodies. Shards must map object IDs to shard page titles/files and include
enough structured context for Rovo/Codex to answer column-impact questions from
page bodies. Shards must split by both object count and estimated page size so
wide tables do not produce oversized Confluence pages. Live publishing must
require `CONFLUENCE_EMAIL` and `CONFLUENCE_API_TOKEN`.

D. Codex/MCP Boundary

The app publisher does not require MCP. The app writes and maintains the
Confluence repository through Confluence API credentials. Codex uses a separate
read-only Confluence MCP to search/read those pages and attachments. The MCP
must be configured outside the app and should be read-only until the publishing
workflow is proven stable.
