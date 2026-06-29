# AWS Lineage Work Packets

Generated: 2026-06-29

## Required Reading

1. `AI_README.md`
2. `docs/adr/ADR-029-AWS-And-Non-Database-Lineage-Ingestion.md`
3. `docs/AWS_LINEAGE_INGESTION.md`
4. `docs/CODEX_AWS_LINEAGE_INGESTION_PACKET.md`
5. `config/aws-lineage-product-routing.json`
6. `docs/CONNECTOR_METADATA_PROFILE_FRAMEWORK.md`
7. `docs/adr/ADR-020-Source-Agnostic-Incremental-Lineage-Ingestion.md`
8. `docs/adr/ADR-028-Delta-First-Metadata-Processing-And-Publication.md`
9. `AGENTS.md`

## WP-AWS-LIN-01: Native Asset Model And Edge Engine

Status: complete

Objective:

Build an AWS-specific canonicalizer that converts connector runtime events into
AWS-native assets and deterministic edges.

Scope:

- local JavaScript engine;
- fixture tests;
- no live AWS call required.

Validation:

```powershell
node --check engines/connectors/aws/index.js
npm test -- tests/unit/aws-lineage-engine.test.js --runInBand --coverage=false
```

Completion notes:

- Added AWS asset model under `engines/connectors/aws/`.
- Added S3/Glue/Athena edge rules and QuickSight inventory gap handling.

## WP-AWS-LIN-02: Incremental Ingest Command

Status: complete

Objective:

Add the repeatable command that runs saved AWS connectors and emits lineage
package plus delta manifest.

Scope:

- command wrapper in `scripts/`;
- npm command entry;
- no DevOps, Rovo, or Confluence publish.

Validation:

```powershell
node --check scripts/ingest-aws-lineage-incremental.mjs
npm run aws:lineage:ingest -- --account-id <account-id> --max-sample-items 5
```

Completion notes:

- Added `npm run aws:lineage:ingest`.
- Default mode is plan-only.

## WP-AWS-LIN-03: Governance And AI Documentation

Status: complete

Objective:

Update ADRs, AI instructions, contributor guidance, backlog, and work packets
so future runs understand the AWS/non-database lineage contract.

Scope:

- documentation only;
- no publish.

Validation:

```powershell
git diff --check
```

Completion notes:

- Added ADR-029 and AWS runbooks.
- Updated delta and connector framework references.

## WP-AWS-LIN-04: Live AWS Smoke Readback

Status: ready next

Objective:

Run the new AWS lineage command against a bounded sample and review output.

Scope:

- local AWS metadata read;
- no DevOps, Rovo, or Confluence publish;
- no raw data capture.

Command:

```powershell
npm run aws:lineage:ingest -- --max-sample-items 5
```

Validation:

- package JSON exists;
- readback markdown exists;
- delta JSON exists;
- edge sample includes deterministic relationships only;
- gaps are explicit;
- no secrets, tokens, raw S3 values, or raw query text.

## WP-AWS-LIN-05: QuickSight Detailed Lineage

Status: ready next

Objective:

Add QuickSight relationship edges only where describe APIs surface reliable
dependencies.

Scope:

- QuickSight describe API metadata only;
- bounded sample limits;
- raw SQL/custom SQL must be hashed or parsed to references before persistence.

Stop trigger:

- any request to infer dashboard/dataset lineage from names alone.

## WP-AWS-LIN-06: Downstream AWS Publication

Status: complete

Objective:

Package current AWS metadata into DevOps machine-readable artifacts, Rovo
retrieval artifacts, and human Confluence markdown under the reviewed MDP route.

Scope:

- current AWS connector set only;
- local package generation only;
- no live Confluence publish.

Command:

```powershell
npm run aws:mdp:lineage:package
```

Validation:

```powershell
node --check scripts/build-mdp-aws-lineage-context.mjs
npm run aws:mdp:lineage:package
```

Completion notes:

- Added explicit MDP routing config.
- Added MDP package command.
- Outputs are written to
  `docs/lineage-runtime-readbacks/aws-mdp-lineage-context`.

Stop trigger:

- live Confluence or DevOps publication without reviewed package/readback.

## WP-AWS-LIN-07: Future AWS Product Route Onboarding

Status: ready next

Objective:

Onboard a future AWS connector set without automatically lumping it under MDP.

Scope:

- route config only until a product owner or reviewer confirms placement;
- connector records must carry explicit product metadata;
- no live publish without a separate package/readback.

Acceptance criteria:

- New route in `config/aws-lineage-product-routing.json`.
- Connector configs include `product_area`, `product_route_id`, and
  `human_catalog_root`.
- Unrouted packages produce `missing_product_route` gaps.
- Product-specific package generation is separate from AWS ingestion.
