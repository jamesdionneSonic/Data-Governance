# Products And Domains Lineage Catalog

This catalog rebuilds the business product/domain layer around the key applications named by the team: FIRE, FORCE, FUEL, DOC, TRAC, TURBO, HyperCards, EchoPark Platform, MCI, and MDP. It uses the lineage runtime package to connect each product to the database objects, SSIS folders, SSIS packages, source systems, and evidence paths currently available.

## Product Summary

| Product           | Domain                                     | Evidence Strength         | Matched Objects | Matched Packages | Main Databases                                   | Product File                         |
| ----------------- | ------------------------------------------ | ------------------------- | --------------- | ---------------- | ------------------------------------------------ | ------------------------------------ |
| FIRE              | Retail Sales and Finance                   | Strong catalog evidence   | 177             | 30               | Sonic_DW, ETL_Staging, SIMS6200Retail, DMS       | `data/products/fire.md`              |
| FORCE             | Fixed Operations                           | Strong catalog evidence   | 55              | 16               | Sonic_DW, ETL_Staging                            | `data/products/force.md`             |
| FUEL              | Financial Accounting                       | Strong catalog evidence   | 249             | 71               | Sonic_DW, ETL_Staging, StagingDB, BI_WorkDB      | `data/products/fuel.md`              |
| DOC               | Dealership Operations and Accounting       | Limited catalog evidence  | 4               | 4                |                                                  | `data/products/doc.md`               |
| TRAC              | Traffic and Marketing Attribution          | Strong catalog evidence   | 389             | 63               | ETL_Staging, StagingDB, Sonic_DW, VendorData     | `data/products/trac.md`              |
| TURBO             | Sales Appointments and Operational Metrics | Moderate catalog evidence | 13              | 7                | Sonic_DW, ETL_Staging                            | `data/products/turbo.md`             |
| HyperCards        | Executive Analytics                        | Needs source review       | 0               | 0                |                                                  | `data/products/hypercards.md`        |
| EchoPark Platform | EchoPark Retail Platform                   | Strong catalog evidence   | 528             | 107              | StagingDB, ETL_Staging, webvEP, echoparkwebv_veh | `data/products/echopark-platform.md` |
| MCI               | External Franchise Feed                    | Moderate catalog evidence | 7               | 4                | Sonic_DW                                         | `data/products/mci.md`               |
| MDP               | Master Data and Identity Resolution        | Moderate catalog evidence | 15              | 0                | ETL_Staging, StagingDB, Sonic_DW                 | `data/products/mdp.md`               |

## Domain View

| Domain                                     | Products          | Matched Objects | Matched Packages |
| ------------------------------------------ | ----------------- | --------------- | ---------------- |
| Retail Sales and Finance                   | FIRE              | 177             | 30               |
| Fixed Operations                           | FORCE             | 55              | 16               |
| Financial Accounting                       | FUEL              | 249             | 71               |
| Dealership Operations and Accounting       | DOC               | 4               | 4                |
| Traffic and Marketing Attribution          | TRAC              | 389             | 63               |
| Sales Appointments and Operational Metrics | TURBO             | 13              | 7                |
| Executive Analytics                        | HyperCards        | 0               | 0                |
| EchoPark Retail Platform                   | EchoPark Platform | 528             | 107              |
| External Franchise Feed                    | MCI               | 7               | 4                |
| Master Data and Identity Resolution        | MDP               | 15              | 0                |

## Evidence Notes

- Product pages are generated from `registry/canonical-objects.jsonl` and `ssis/README.md`.
- The runtime package has 6692 objects, 1451 SSIS package contexts, and was generated at `2026-06-13T23:31:32.400Z`.
- HyperCards is intentionally retained even though the current lineage package has no strong HyperCards naming evidence. That gap should be closed by adding the BI/app/source metadata that owns HyperCards.
- TRAC is modeled from traffic and attribution evidence because the package does not currently expose a dedicated `TRAC` SSIS folder or database.
