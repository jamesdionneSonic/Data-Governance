# Codex AWS Lineage Ingestion Packet

## Required Reading

Read these files before AWS lineage ingestion or AWS documentation changes:

1. `AI_README.md`
2. `docs/adr/ADR-004-Single-Shared-Connector-Runtime.md`
3. `docs/adr/ADR-020-Source-Agnostic-Incremental-Lineage-Ingestion.md`
4. `docs/adr/ADR-028-Delta-First-Metadata-Processing-And-Publication.md`
5. `docs/adr/ADR-029-AWS-And-Non-Database-Lineage-Ingestion.md`
6. `docs/AWS_LINEAGE_INGESTION.md`
7. `docs/CONNECTOR_METADATA_PROFILE_FRAMEWORK.md`
8. `docs/SOURCE_METADATA_DELTA_BACKLOG.md`
9. `docs/SOURCE_METADATA_DELTA_WORK_PACKAGES.md`
10. `config/aws-lineage-product-routing.json`
11. `AGENTS.md`

## Goal

Run AWS metadata through the saved connector runtime, create AWS-native lineage
objects and edges, and produce a delta manifest that downstream DevOps, Rovo,
Confluence, support documentation, and AI-description workflows can consume.

For the current AWS connector set, preserve the explicit MDP route:

```text
product_area: MDP
product_route_id: mdp-aws-lineage-context
human_catalog_root: Sonic Data Lineage / Data Product Catalog / MDP AWS Lineage Context
```

Do not treat MDP as the default route for future AWS connectors.

## Safe Default

Use plan-only mode first:

```powershell
npm run aws:lineage:ingest -- --max-sample-items 10
```

This contacts AWS metadata APIs but writes only local package/readback/delta
files. It does not publish DevOps, Rovo, or Confluence artifacts.

After AWS ingestion, build the MDP downstream package:

```powershell
npm run aws:mdp:lineage:package
```

This creates local human Confluence markdown, Rovo retrieval artifacts, and
DevOps JSON/JSONL files. It does not live-publish to Confluence.

The package command defaults to the highest-object-count package per
account/region, then uses generated time as a tie-breaker. Use `--latest-only`
only when the user explicitly wants the newest package even if it has less
metadata coverage.

## Write Mode

Use write mode only after reviewing the readback:

```powershell
npm run aws:lineage:ingest -- --write --max-sample-items 10
```

Write mode is still delta-first. It must not perform broad publication unless a
separate reviewed publication packet approves that downstream scope.

## Scope Controls

Use one of these when the requested scope is not all registered AWS accounts:

```powershell
npm run aws:lineage:ingest -- --account-id <aws-account-id>
npm run aws:lineage:ingest -- --connector-id <connector-id>
```

## Full Refresh

Full refresh is a stop-and-think action. It requires an explicit reason:

```powershell
npm run aws:lineage:ingest -- --account-id <aws-account-id> --full-refresh --full-refresh-reason "<reason>"
```

Do not full-refresh multiple AWS accounts unless the user explicitly approves
that scope.

## AI Description Rules

AI can write plain-English text only from each object `ai_evidence_packet`.

Required language:

- Say what AWS service and asset type the object is.
- State account, region, surfaced columns, and deterministic edges when present.
- Use `not surfaced in metadata` for unsupported purpose, owner, steward, SLA,
  freshness, certification, or business process.
- Label inferred edges and the rule used.
- Do not infer business meaning from names alone.
- Do not include credentials, SSO tokens, raw S3 object values, sample data, raw
  source payloads, or raw SQL/query text.

## Stop Triggers

Stop and ask before:

- changing AWS authentication, SSO profiles, or IAM roles;
- running full refresh across multiple accounts;
- assigning future AWS connectors to MDP without explicit product-route
  evidence;
- adding raw S3 object sampling;
- publishing to DevOps, Rovo, or Confluence;
- creating QuickSight edges without describe API or asset bundle evidence;
- changing the canonical AWS id format;
- storing raw named-query SQL text in AI evidence or published artifacts.

## Validation

Minimum local validation:

```powershell
node --check engines/connectors/aws/index.js
node --check scripts/ingest-aws-lineage-incremental.mjs
node --check scripts/build-mdp-aws-lineage-context.mjs
node --check src/services/connectorRuntime/sourceClients.js
npm test -- tests/unit/aws-lineage-engine.test.js tests/unit/metadata-delta-engine.test.js --runInBand --coverage=false
```

Optional live smoke:

```powershell
npm run aws:lineage:ingest -- --account-id <aws-account-id> --max-sample-items 5
```

## Completion Readback

Report:

- command run;
- output package path;
- output readback path;
- delta manifest path;
- MDP package manifest/readback path when `aws:mdp:lineage:package` is run;
- object and edge counts;
- failures or lineage gaps;
- validation result.
