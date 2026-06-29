# AWS Lineage Backlog

Generated: 2026-06-29

## Purpose

Add AWS and future non-database metadata sources to the Sonic lineage system
without losing native platform meaning or inventing edges.

## Backlog

### AWS-LIN-01: AWS Native Asset Model

Status: complete

Goal:

Represent AWS assets with platform-native canonical ids and object types.

Acceptance criteria:

- S3, Glue, Athena, and QuickSight assets do not require fake SQL database
  identity.
- Canonical ids use `aws://<account>/<region>/<service>/<asset-type>/<path>`.
- Delta objects still include compatibility fields for downstream consumers.

Completion notes:

- Added `engines/connectors/aws/index.js`.
- Added AWS source family `aws`.

### AWS-LIN-02: Deterministic AWS Edge Rules

Status: complete

Goal:

Create JavaScript-owned AWS lineage edges from bounded metadata evidence.

Acceptance criteria:

- S3 storage locations create S3-to-Glue edges.
- Glue databases/tables/columns create hierarchy and column edges.
- Athena `AwsDataCatalog` tables map to Glue tables by deterministic rule.
- Athena named query references create table-to-query edges when SQL text is
  surfaced.
- QuickSight missing relationships are recorded as gaps, not guessed.

Completion notes:

- Added S3, Glue, Athena, and QuickSight edge/gap handling.
- Added unit tests for S3/Glue/Athena edges and SQL text redaction from AI
  packets.

### AWS-LIN-03: Incremental AWS Ingest Command

Status: complete

Goal:

Provide a repeatable command that runs saved AWS connectors and emits AWS
lineage packages plus delta manifests.

Acceptance criteria:

- Command uses saved connectors through shared runtime.
- Default mode is plan-only.
- `--write` enables incremental write mode.
- `--full-refresh` requires explicit reason.
- Output includes package JSON, readback markdown, delta JSON, and delta
  readback.

Completion notes:

- Added `scripts/ingest-aws-lineage-incremental.mjs`.
- Added npm command `aws:lineage:ingest`.

### AWS-LIN-04: Human And AI Documentation Contract

Status: complete

Goal:

Document how JavaScript and AI split responsibilities for AWS and
non-database lineage.

Acceptance criteria:

- ADR explains AWS/non-database source model.
- AI instructions require bounded evidence only.
- Work packet tells future Codex sessions how to run and validate safely.
- Contributor docs point maintainers to AWS lineage rules.

Completion notes:

- Added ADR-029.
- Added AWS runbook and Codex packet.
- Updated AI and contributor guidance.

### AWS-LIN-05: QuickSight Detailed Lineage

Status: ready next

Goal:

Promote QuickSight from inventory-only to edge-aware lineage where the AWS APIs
surface reliable relationships.

Tasks:

- Add bounded `describe-data-set` support.
- Add bounded `describe-dashboard`/`describe-analysis` support if it surfaces
  dataset or source dependencies.
- Hash SQL/custom SQL and persist references, not raw SQL.
- Create QuickSight data source to dataset/dashboard edges only from surfaced
  evidence.

Acceptance criteria:

- QuickSight edges are supported by describe API or asset bundle evidence.
- Existing inventory gaps disappear only where detail evidence exists.
- No raw SQL or credentials are stored in published AI evidence.

### AWS-LIN-06: Downstream Publication Integration

Status: complete

Goal:

Make DevOps, runtime package, Rovo, Confluence, and support documentation
consume AWS lineage packages without broad regeneration.

Tasks:

- Teach downstream generators to accept `source_family=aws`.
- Add an MDP-specific AWS page shape under Data Product Catalog navigation.
- Create Rovo locator/context records for AWS canonical ids.
- Emit DevOps machine-readable JSON/JSONL files for the AWS MDP record.
- Keep live publication separate from local package generation.

Acceptance criteria:

- AWS package can update DevOps machine-readable master record.
- Human Confluence pages use product/account/service navigation under
  `Data Product Catalog / MDP AWS Lineage Context`.
- Rovo can answer where an AWS asset is and what it feeds from bounded
  evidence.
- Unchanged AWS metadata produces no AI-description requests.

Completion notes:

- Added `config/aws-lineage-product-routing.json`.
- Current AWS connector registration now writes explicit MDP product-route
  metadata.
- Added `scripts/build-mdp-aws-lineage-context.mjs`.
- Added npm command `aws:mdp:lineage:package`.
- Local package generation writes human Confluence markdown, Rovo artifacts,
  and DevOps JSON/JSONL files under
  `docs/lineage-runtime-readbacks/aws-mdp-lineage-context`.

### AWS-LIN-07: Future AWS Product Routes

Status: ready next

Goal:

Make future AWS onboarding require an explicit product route instead of
inheriting the current MDP route.

Tasks:

- Add a route entry to `config/aws-lineage-product-routing.json`.
- Register future AWS connectors with `product_area`, `product_route_id`, and
  `human_catalog_root`.
- Keep unrouted AWS packages visible as `missing_product_route` gaps.
- Build a product-specific downstream package only after the route is reviewed.

Acceptance criteria:

- New AWS accounts are not placed under MDP unless their connector records
  explicitly say MDP.
- Missing product routes are visible in package readbacks and AI evidence.
- Future product package commands can follow the MDP package pattern without
  changing AWS canonical identity.
