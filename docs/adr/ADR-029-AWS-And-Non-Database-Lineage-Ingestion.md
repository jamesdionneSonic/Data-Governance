# ADR-029: AWS And Non-Database Lineage Ingestion

## Status

Accepted

## Date

2026-06-29

## Context

The lineage platform historically centered on SQL Server, SSIS, Snowflake, and
other database-shaped sources. AWS metadata is different. S3 buckets, Glue
Data Catalog tables, Athena workgroups, named queries, and QuickSight assets do
not fit cleanly into `database.schema.object`, and forcing them into that shape
would create misleading lineage.

AWS metadata also arrives through multiple service-specific connectors. A Glue
table may point to an S3 location, Athena may query Glue catalog tables, and a
BI asset may depend on a dataset source that is not visible from a list API
alone. The ingestion system therefore needs a cloud asset model and explicit
edge rules before AWS can become part of the Sonic lineage graph.

## Decision

AWS is a first-class lineage source family:

```text
source_family: aws
```

AWS ingestion must use saved connectors through the shared connector runtime.
The current command is:

```powershell
npm run aws:lineage:ingest
```

The command acquires bounded metadata from saved AWS SSO connectors, normalizes
it into canonical AWS assets, derives deterministic edges, writes a local AWS
lineage package/readback, and emits the same delta manifest required by
ADR-020 and ADR-028.

AWS product placement is explicit. The current registered AWS connector set is
MDP-specific and must carry:

```text
product_area: MDP
product_route_id: mdp-aws-lineage-context
human_catalog_root: Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context
```

This is a route assignment for the current connectors only, not an AWS-wide
default. Future AWS accounts, services, or connectors must declare their own
product route before downstream Confluence, Rovo, or DevOps package generation
places them in a product-specific context. Missing product routing is a lineage
gap and should stay out of product trees until reviewed.

AWS assets must use platform-native identity instead of pretending to be SQL
objects. Canonical ids use this pattern:

```text
aws://<account>/<region>/<service>/<asset-type>/<path>
```

Examples:

```text
aws://118570350539/us-east-1/s3/bucket/example-bucket
aws://118570350539/us-east-1/glue/table/dms/repair_order_raw
aws://118570350539/us-east-1/athena/table/AwsDataCatalog/dms/repair_order_raw
```

## Edge Rules

The JavaScript engine, not AI, creates AWS lineage edges.

Accepted edge rules:

- AWS account `contains` AWS service.
- AWS service `contains` service assets.
- S3 bucket `contains` S3 prefix.
- Glue database `contains` Glue table.
- Glue table `has_column` Glue column.
- S3 prefix `storage_registered_by` Glue database or Glue table when AWS
  metadata surfaces an `s3://` location.
- Glue table `queried_by_athena` Athena table when Athena uses
  `AwsDataCatalog` with the same database and table name.
- Athena table `referenced_by_named_query` Athena named query when bounded SQL
  parsing finds a table reference.
- Glue service `metadata_catalog_used_by_athena` Athena `AwsDataCatalog` in
  the same account and region.

QuickSight list metadata is allowed as inventory, but dashboard/dataset/source
lineage must be marked as a gap unless a bounded describe API or exported asset
bundle surfaces the dependency. The system must not invent QuickSight lineage
from names alone.

## AI Role

AI does not discover AWS assets and does not decide AWS edges.

JavaScript owns:

- AWS CLI/SSO metadata acquisition through saved connectors;
- canonical asset identity;
- deterministic edge creation;
- product-route preservation and missing-route gap reporting;
- delta manifest creation;
- evidence packet construction.

AI may write human-friendly descriptions only from bounded evidence packets.
For AWS and other non-database assets, AI must:

- describe the AWS service, asset type, account, region, surfaced columns, and
  deterministic edges;
- say `not surfaced in metadata` for purpose, owner, steward, SLA, freshness,
  certification, or business process when the evidence does not provide it;
- label inferred AWS edges as inferred and show the rule used;
- avoid treating bucket, table, or query names as proof of business meaning;
- never include credentials, SSO tokens, raw S3 object values, sample data, raw
  source payloads, or unrestricted SQL/query text.

## Incremental Rule

AWS follows the same delta-first rule as every other source family.

Default mode:

```text
plan_only
```

Write mode:

```powershell
npm run aws:lineage:ingest -- --write
```

Full refresh requires explicit scope and reason:

```powershell
npm run aws:lineage:ingest -- --full-refresh --full-refresh-reason "AWS identity contract changed."
```

The first AWS run for an account/region is expected to classify every object as
new because no DevOps baseline exists. Later runs must process only new or
changed AWS assets unless a scoped full refresh is approved.

After ingestion, the current MDP AWS downstream package is built with:

```powershell
npm run aws:mdp:lineage:package
```

That command reads the latest AWS lineage packages, filters to the explicit MDP
route, and writes:

- human Confluence markdown for `Data Product Catalog / MDP AWS Lineage Context`;
- Rovo retrieval pages under the separated AI retrieval branch;
- DevOps JSON/JSONL files for the machine-readable AWS MDP record.

## Non-Database Source Rule

Future non-database sources must follow the same pattern:

1. Keep native platform identity.
2. Define an explicit source family.
3. Define deterministic asset types.
4. Define deterministic edge rules.
5. Emit bounded evidence packets for AI.
6. Run delta comparison before downstream generation or publication.
7. Mark unsupported relationships as gaps instead of guessing.

## Consequences

- AWS can join the Sonic lineage graph without corrupting database semantics.
- S3, Glue, Athena, and QuickSight can be represented with platform-native
  identity.
- Current AWS assets can be documented under MDP without making MDP the default
  for every future AWS connector.
- AI descriptions become transparent about evidence and missing facts.
- Downstream DevOps, Rovo, Confluence, and support documentation can consume
  AWS changes through the same delta-first workflow.
- QuickSight and future services can be added incrementally without changing
  the core delta engine.

## Validation

Minimum validation:

```powershell
node --check engines/connectors/aws/index.js
node --check scripts/ingest-aws-lineage-incremental.mjs
node --check scripts/build-mdp-aws-lineage-context.mjs
npm test -- tests/unit/aws-lineage-engine.test.js tests/unit/metadata-delta-engine.test.js --runInBand --coverage=false
```

Live readback:

```powershell
npm run aws:lineage:ingest -- --max-sample-items 10
```

The readback must show:

- object counts by AWS type;
- edge counts by relationship type;
- lineage gaps;
- delta counts;
- no raw data or secrets.

## Related Documents

- `docs/AWS_LINEAGE_INGESTION.md`
- `docs/CODEX_AWS_LINEAGE_INGESTION_PACKET.md`
- `docs/AWS_LINEAGE_BACKLOG.md`
- `docs/AWS_LINEAGE_WORK_PACKETS.md`
- `docs/CONNECTOR_METADATA_PROFILE_FRAMEWORK.md`
- `docs/adr/ADR-004-Single-Shared-Connector-Runtime.md`
- `docs/adr/ADR-017-Rovo-Assisted-Plain-English-Catalog-Descriptions.md`
- `docs/adr/ADR-020-Source-Agnostic-Incremental-Lineage-Ingestion.md`
- `docs/adr/ADR-028-Delta-First-Metadata-Processing-And-Publication.md`
