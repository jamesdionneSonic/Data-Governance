# AWS Lineage Ingestion

## Purpose

AWS lineage ingestion brings metadata from saved AWS SSO connectors into the
Sonic lineage graph without forcing AWS assets into a SQL Server/Snowflake
database shape.

Use this process for S3, Glue Data Catalog, Athena, and QuickSight metadata.

## Product Routing

The current registered AWS connector set is explicitly routed to the MDP data
product:

```text
product_area: MDP
product_route_id: mdp-aws-lineage-context
human_catalog_root: Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context
```

This is not a default for AWS. Future AWS accounts, services, or connector
records must declare their own `product_area`, `product_route_id`, and
`human_catalog_root` before downstream package generation places them under a
product tree.

The routing contract lives in:

```text
config/aws-lineage-product-routing.json
```

## Command

Plan-only local run:

```powershell
npm run aws:lineage:ingest -- --max-sample-items 10
```

Changed-only write mode:

```powershell
npm run aws:lineage:ingest -- --write --max-sample-items 10
```

Scoped account run:

```powershell
npm run aws:lineage:ingest -- --account-id 118570350539 --max-sample-items 10
```

Single connector run:

```powershell
npm run aws:lineage:ingest -- --connector-id aws-glue-sonic-prd-mdp --max-sample-items 10
```

Build the MDP AWS downstream package after ingestion:

```powershell
npm run aws:mdp:lineage:package
```

Full refresh requires a reason:

```powershell
npm run aws:lineage:ingest -- --account-id 118570350539 --full-refresh --full-refresh-reason "AWS asset identity contract changed."
```

## What The JavaScript Does

The JavaScript workflow:

1. Reads saved AWS connector records.
2. Runs the connector runtime using AWS CLI SSO profiles.
3. Collects bounded metadata events only.
4. Normalizes events into AWS-native canonical assets.
5. Creates deterministic edges.
6. Writes an AWS lineage package and readback.
7. Builds the source metadata delta manifest.
8. Preserves explicit product-routing fields for downstream package generation.

The engine does not capture raw S3 object contents, sample data, credentials,
SSO tokens, or unrestricted payloads.

## What AI Does

AI does not discover AWS assets and does not create the lineage edges.

AI may write human-friendly descriptions from `ai_evidence_packets` only. The
description must state missing facts plainly:

```text
not surfaced in metadata
```

Do not infer purpose, owner, steward, freshness, certification, or business
process from an AWS name alone.

## Canonical Identity

AWS assets use this id pattern:

```text
aws://<account>/<region>/<service>/<asset-type>/<path>
```

Examples:

```text
aws://118570350539/us-east-1/s3/bucket/example-bucket
aws://118570350539/us-east-1/glue/table/dms/repair_order_raw
aws://118570350539/us-east-1/athena/table/AwsDataCatalog/dms/repair_order_raw
```

`database`, `schema`, and `object_name` compatibility fields may be populated
where useful, but the canonical id is the source of truth for AWS assets.

## Current Edge Rules

| Rule                              | Meaning                                               |
| --------------------------------- | ----------------------------------------------------- |
| `contains`                        | Account/service/catalog/database/container hierarchy  |
| `has_column`                      | Glue table to Glue column                             |
| `storage_registered_by`           | S3 prefix backs a Glue table or database location     |
| `queried_by_athena`               | Athena table maps to a Glue table in `AwsDataCatalog` |
| `referenced_by_named_query`       | Athena named query SQL references an Athena table     |
| `metadata_catalog_used_by_athena` | Athena `AwsDataCatalog` uses Glue Data Catalog        |

QuickSight assets are inventoried. Detailed QuickSight edges require describe
API or asset bundle evidence and must remain gaps until that evidence exists.

## Output

Default output directory:

```text
docs/lineage-runtime-readbacks/aws-lineage
```

Each account/region run writes:

- `*-package.json`: canonical AWS objects, edges, evidence packets, and gaps;
- `*-readback.md`: human review summary;
- `*-delta.json`: source metadata delta manifest;
- `*-delta.md`: delta readback.

The MDP downstream package command writes:

```text
docs/lineage-runtime-readbacks/aws-mdp-lineage-context
  confluence-human/
  confluence-rovo/
  devops/
  mdp-aws-lineage-context-package.json
  mdp-aws-lineage-context-readback.md
```

Human Confluence page markdown is shaped for:

```text
Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context
```

Rovo artifacts remain under the separated AI retrieval branch. DevOps JSON/JSONL
files remain the machine-friendly record.

By default, the MDP package command selects the highest-object-count package per
AWS account/region, using generated time as the tie-breaker. This prevents a
later thin metadata run from replacing a richer same-scope evidence package.
Use `--latest-only` only when freshness is more important than coverage for the
review at hand.

## Review Checklist

- Object count is plausible for the selected account and sample limit.
- Edge sample includes only deterministic AWS relationships.
- QuickSight gaps are visible instead of hidden.
- Delta counts make sense for first-run or incremental mode.
- No raw data, credentials, SSO tokens, or raw query text are present.

## Validation

```powershell
node --check engines/connectors/aws/index.js
node --check scripts/ingest-aws-lineage-incremental.mjs
node --check scripts/build-mdp-aws-lineage-context.mjs
npm test -- tests/unit/aws-lineage-engine.test.js tests/unit/metadata-delta-engine.test.js --runInBand --coverage=false
```
