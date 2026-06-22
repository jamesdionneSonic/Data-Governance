# eLeadDW Local Catalog Artifacts Readback - 2026-06-20

## Work Packet

- Backlog item: `ELDW-004`
- Purpose: convert reconciled eLeadDW metadata into local catalog-ready artifacts.
- Source run id: `88d20d20-2f75-496e-a192-2d6f0acb920c`
- Source artifact: `data/markdown/_runtime/profile-runs/sqlserver-l1-dwasql-02-12010-eleaddw/2026-06-20T13-15-45-023Z-88d20d20-2f75-496e-a192-2d6f0acb920c.json`
- Catalog root: `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW`

## Generated Artifacts

| Artifact                       | Path                                                                                                              |
| ------------------------------ | ----------------------------------------------------------------------------------------------------------------- |
| Local catalog dry-run manifest | `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW/_catalog/eleaddw-local-catalog-dry-run-manifest.json` |
| Schema inventory               | `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW/_catalog/schema-inventory.json`                       |
| Canonical dbo object list      | `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW/_catalog/canonical-object-list-dbo.json`              |
| Object markdown pages          | `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW/{schemas,tables,views,stored_procedures,functions}`   |
| Local markdown manifest        | `data/markdown/catalog-manifest.json`                                                                             |

## Counts

| Count                                    |  Value |
| ---------------------------------------- | -----: |
| Files generated for eLeadDW              |    470 |
| Metadata objects                         |    467 |
| Schemas                                  |      3 |
| Tables                                   |    324 |
| Views                                    |      3 |
| Stored procedures                        |    130 |
| Functions                                |      7 |
| Triggers                                 |      0 |
| Columns                                  |  5,686 |
| Lineage edges carried in source artifact | 27,926 |

## Schema Inventory

| Schema              | Total Catalog Objects | Tables | Views | Procedures | Functions | Triggers | Schema Records |
| ------------------- | --------------------: | -----: | ----: | ---------: | --------: | -------: | -------------: |
| `dbo`               |                   441 |    311 |     3 |        119 |         7 |        0 |              1 |
| `mdp`               |                    17 |      5 |     0 |         11 |         0 |        0 |              1 |
| `SONIC\sunil.rawal` |                     9 |      8 |     0 |          0 |         0 |        0 |              1 |

## Validation

| Check                                                                      | Result                               |
| -------------------------------------------------------------------------- | ------------------------------------ |
| `eLeadDW` appears in local markdown manifest                               | Passed; 470 eLeadDW files are listed |
| `eLeadDW.dbo` appears in schema inventory                                  | Passed                               |
| Canonical `dbo` object list exists                                         | Passed; 440 non-schema dbo objects   |
| Every `dbo` object has a stable canonical id                               | Passed; no duplicates found          |
| Unsupported owner/steward/status/SLA/freshness/certification facts avoided | Passed                               |
| Azure DevOps publication                                                   | Not run                              |
| Confluence publication                                                     | Not run                              |
| Parser/extractor/lineage-scoring changes                                   | Not made                             |

## Governance Fact Policy

The local object pages intentionally use `not surfaced in metadata` for these
facts unless a later approved evidence source supplies them:

- owner
- data steward
- lifecycle/status
- SLA
- live freshness
- certification

## Acceptance Criteria

| Criterion                                                                         | Status                                                              |
| --------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `eLeadDW` appears in the local database manifest                                  | Passed                                                              |
| `eLeadDW.dbo` appears in schema inventory                                         | Passed                                                              |
| Every extracted object has a stable identity                                      | Passed for generated catalog records; dbo list explicitly validated |
| No generated owner, steward, status, SLA, freshness, or certification is invented | Passed                                                              |

## Next Packet

The next packet is `ELDW-005: Build And Validate Local Lineage Edges`. It is not started by this local catalog artifact build.
