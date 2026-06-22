# FDP-05 Tier 3 Rich Object Batch 01 Publish Review Packet

## Purpose

This packet prepares the first Tier 3 rich priority object-page batch.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for user review. Live Tier 3 rich-page publish requires explicit approval and assumes Tier 1 parent pages exist.

## Promotion Strategy

| Signal            | Value                                                                                                                                                |
| ----------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Batch id          | `FDP-05-BATCH-01`                                                                                                                                    |
| Database          | `Sonic_DW`                                                                                                                                           |
| Schema            | `dbo`                                                                                                                                                |
| Max objects       | 5                                                                                                                                                    |
| Selection rule    | requested seed objects from the Tier 2 Sonic_DW.dbo thin batch; all remain evidence-bound and review-needed when business definition is not surfaced |
| Publish mode      | `reviewed publish packet; no live publish performed`                                                                                                 |
| Cleanup mode      | `none; cleanup remains separate`                                                                                                                     |
| Required labels   | `human-lineage-catalog`, `database-catalog`, `database-catalog-tier3`, `rich-object-page`                                                            |
| Validation status | `passed`                                                                                                                                             |

## Planned Pages

| Signal                 | Value |
| ---------------------- | ----- |
| Reference parent pages | 3     |
| Rich object pages      | 5     |
| Total packet entries   | 8     |

## Rich Object Pages

| Object            | Type  | Tags                                                                    | Upstream Loaders | Downstream Consumers | Caveat                                                                                                                                           |
| ----------------- | ----- | ----------------------------------------------------------------------- | ---------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `Dim_Vehicle`     | table | high-use, profiled, lineage-hotspot, review-needed, rich-page-candidate | 10               | 71                   | Business definition is not surfaced in metadata, so this rich page explains support impact from object name, columns, and lineage evidence only. |
| `FactOpportunity` | table | high-use, profiled, lineage-hotspot, review-needed, rich-page-candidate | 7                | 27                   | Business definition is not surfaced in metadata, so this rich page explains support impact from object name, columns, and lineage evidence only. |
| `factFIRE`        | table | high-use, profiled, lineage-hotspot, review-needed, rich-page-candidate | 2                | 46                   | Business definition is not surfaced in metadata, so this rich page explains support impact from object name, columns, and lineage evidence only. |
| `Fact_Service`    | table | high-use, profiled, lineage-hotspot, review-needed, rich-page-candidate | 3                | 20                   | Business definition is not surfaced in metadata, so this rich page explains support impact from object name, columns, and lineage evidence only. |
| `Dim_Date`        | table | high-use, profiled, lineage-hotspot, review-needed, rich-page-candidate | 0                | 224                  | Business definition is not surfaced in metadata, so this rich page explains support impact from object name, columns, and lineage evidence only. |

## Evidence Boundary

These pages add richer support prose from bounded object evidence only. They do
not infer owner, data steward, SLA, lifecycle/status, live freshness, or formal
business definition. Missing facts remain explicitly marked as not surfaced in
metadata.

## Approval To Publish

Live publish requires explicit user approval for:

`Sonic Data Lineage / Database Catalog / Sonic_DW / dbo`

The publish command is:

```powershell
npm run confluence:full:tier3:batch01:publish
```

Do not run cleanup commands from this approval.

## Validation

- No packet validation failures.

## Source Artifacts

- Tier 2 source packet: `docs/confluence-full-database-catalog-deployment/FDP-04-tier2-thin-object-batch-01-publish-packet.json`
- Dry-run output root: `data/confluence/human-catalog-dry-run`
