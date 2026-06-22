# PHASE7S-009 Human Catalog Dry-Run Renderer

This review note documents the first repeatable renderer for the human-centered
Confluence lineage catalog. It does not publish to Confluence.

## Command

```powershell
npm run confluence:human:dry-run
```

## Output Location

```text
data/confluence/human-catalog-dry-run
```

This directory is generated preview output and may be ignored by Git. Tracked
review artifacts for the pilot pages live under:

```text
docs/confluence-human-catalog-pilots
```

## Generated Page Tree

```text
Sonic Data Lineage
  Data Product Catalog
    Data Product - FIRE
  Database Catalog
    Sonic_DW
      dbo
  High-Value Assets
    FIRE Object Pilot
```

## Supported First-Pass Slices

| Slice                    | Command                                                     | Output                                                                |
| ------------------------ | ----------------------------------------------------------- | --------------------------------------------------------------------- |
| FIRE product page        | `npm run confluence:human:dry-run -- --product fire`        | `product-fire.md`, `product-fire.evidence.json`                       |
| Sonic_DW.dbo schema page | `npm run confluence:human:dry-run -- --schema Sonic_DW.dbo` | `schema-sonic-dw-dbo.md`, `schema-sonic-dw-dbo.evidence.json`         |
| FIRE object pilot        | `npm run confluence:human:dry-run -- --objects fire-pilot`  | `high-value-objects-fire.md`, `high-value-objects-fire.evidence.json` |
| Full first-pass pilot    | `npm run confluence:human:dry-run`                          | all first-pass pages plus `page-tree.md`                              |

## Validation

- Script syntax check: `node --check scripts/build-human-confluence-catalog-dry-run.mjs`
- Dry-run command completed successfully.
- Generated evidence JSON files parsed successfully.
- No live Confluence credentials are required.
- No live Confluence publish occurs.

## Known Gaps

- The renderer currently supports only the first pilot slices.
- Profile coverage remains labeled as not surfaced when it is not included in the bounded packet.
- The high-value object output is intentionally compact; richer object-page rendering should be handled by the summary quality gate and object-page follow-up work.
