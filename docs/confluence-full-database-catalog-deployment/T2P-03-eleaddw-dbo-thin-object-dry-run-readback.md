# T2P-03 eLeadDW.dbo Thin Object Dry Run Readback

Date: 2026-06-23

This packet completed a dry-run only Tier 2 object-page slice for:

`Database Catalog / SQL Server / eLeadDW / dbo`

No Confluence live publish, cleanup, archive, delete, or move action was run.

## Scope

| Signal           | Value                                   |
| ---------------- | --------------------------------------- |
| Packet           | T2P-03                                  |
| Backlog items    | T2OBJ-004, T2OBJ-005                    |
| Platform/Product | `SQL Server`                            |
| Database         | `eLeadDW`                               |
| Schema           | `dbo`                                   |
| Publish mode     | dry-run only                            |
| Output root      | `data/confluence/human-catalog-dry-run` |

## Results

| Signal                             | Value |
| ---------------------------------- | ----: |
| Total dry-run pages                |    57 |
| Database pages                     |     1 |
| Schema pages                       |     1 |
| Thin object pages                  |    55 |
| Publishable schema objects         |    55 |
| Objects planned in packet          |    55 |
| Pending link rows                  |    55 |
| Schema-page object links rendered  |   175 |
| `Most Used Objects` links rendered |    10 |

The pending link status is expected in dry-run mode. The pages are generated in
the packet, but `canonical_page_exists` remains false until a reviewed live
publish and readback confirm the pages exist in Confluence.

## dwFullOpportunity Check

The requested high-use table now has a generated thin object-page candidate at:

`Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo / dwFullOpportunity`

The schema evidence shows:

| Signal          | Value |
| --------------- | ----: |
| Downstream uses |    58 |
| Columns         |   370 |

## Commands

```powershell
npm run confluence:full:tier2:eleaddw-dbo:dry-run
```

The command generated the scoped dry-run output and then ran
`npm run confluence:human:check`.

Validation passed with:

- 57 checked pages.
- Superseded-pages dry-run report checks passed.
- `no-ssisdb-database-catalog-artifacts` filesystem check passed.
- Existing smoke checks passed.

## Implementation Notes

- Added a scoped `--tier2-schema` mode to the human catalog dry-run builder.
- Reused the canonical object renderer for every object in the selected schema.
- Allowed object page rendering to accept both raw runtime registry rows and
  normalized schema-index rows.
- Linked database high-use rows, schema `Most Used Objects`, and grouped schema
  object rows only when the object page is generated in the same packet or is
  otherwise in the planned Tier 2 object-page set.

## Not Done

- No Confluence pages were published.
- No cleanup candidates were acted on.
- No Rovo artifacts were refreshed.
- No Tier 2 pages outside `SQL Server / eLeadDW / dbo` were generated in this
  scoped dry-run.

## Next Packet

Proceed to T2P-04 only after review and explicit live publish approval. T2P-04
should prepare and publish the one-schema Tier 2 slice, then run a Confluence
readback proving the object pages and schema links exist live.
