# FDP-01 Full Inventory And Manifest

## Status

Complete

## Date

2026-06-19

## Scope

This packet completed `FDP-01` from
`docs/DATABASE_CATALOG_FULL_DEPLOYMENT_WORK_PACKETS.md`.

The packet was dry-run only. It did not publish to Confluence and did not run
cleanup.

## Deliverables

- Script: `scripts/build-full-database-catalog-inventory.mjs`
- Command: `npm run confluence:full:inventory`
- Inventory JSON:
  `data/confluence/full-database-catalog-deployment/inventory.json`
- Inventory Markdown:
  `data/confluence/full-database-catalog-deployment/inventory.md`
- Deployment manifest:
  `data/confluence/full-database-catalog-deployment/manifest.json`

## Result

The inventory passed validation.

| Signal                      | Value |
| --------------------------- | ----: |
| Raw database entries        |    37 |
| Canonical database names    |    33 |
| Included databases          |    33 |
| Excluded databases          |     0 |
| Included schemas            |   148 |
| Blocked schemas             |     4 |
| Included objects            | 7,185 |
| Blocked objects             |     6 |
| Source canonical objects    | 7,191 |
| Cleanup candidates reported |   172 |

The included and blocked object counts reconcile to the runtime package
canonical object count:

```text
7,185 included + 6 blocked = 7,191 canonical objects
```

## Important Inventory Note

The runtime package contains 1,007 `ssisdb` package/dataset objects with blank
schema values. The inventory assigns those rows to `no_schema` so every
canonical object is accounted for in the deployment manifest. This is a
deterministic inventory bucket, not a new source-system schema claim.

## Blocked Schemas

The blocked-schema rules from `docs/CONFLUENCE_FULL_REBUILD_SCOPE.md` were
applied:

- `Sonic_DW.SONIC\bheemappa`
- `Sonic_DW.SONIC\Murali`
- `Sonic_DW.SONIC\rajakumar`
- `StagingDB.SONIC\bheemappa`

These rules suppressed four concrete schema variants and six objects from the
human browse catalog.

## Next Packet

Start `FDP-02: Tier 1 Full Dry Run And Validation` from this manifest:

```text
data/confluence/full-database-catalog-deployment/manifest.json
```

`FDP-02` should generate and validate the full Tier 1 database and schema page
dry run for every included database and schema in this inventory.
