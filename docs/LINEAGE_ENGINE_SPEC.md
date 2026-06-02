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

12. ACCEPTANCE FIXTURES

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

13. ACCEPTANCE CRITERIA

Regex and Parser Update:

* Refactor sqlServerExtractor.js to parse 4-part linked-server names correctly.
* Enforce server override from linked-server syntax.
* Emit process-to-data edges from SQL definitions.

SSIS Refactor:

* Refactor ssisExtractor.js to emit canonical package IDs.
* Resolve data source and target server names from their own connection managers.
* Infer N-level package chains from ExecutePackageTask behavior.
* Capture external file/SFTP inputs as external facts and mark receiving targets,
  not file nodes.

Resolver Lockdown:

* Rewrite lineageResolver.js to enforce exact canonical matching.
* Remove partial alias matching from final edge promotion.
* Preserve unresolved and probable facts with diagnostics.
* Validate every promoted edge against the legal edge matrix.

Reliability:

* Extraction must fail gracefully by section.
* A permission failure in one SQL metadata query must not label the entire run as
  a connection failure.
* Startup health checks must not wait for full corpus lineage resolution.
* Tests must assert clean validated edges and useful unresolved diagnostics.
