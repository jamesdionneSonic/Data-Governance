# T2P-07 Rovo Link Alignment Packet

## Purpose

This packet verifies that Rovo AI retrieval artifacts remain under
`AI Retrieval Artifacts` and that their canonical human-page links align to
the platform-grouped Database Catalog path when a human page exists or is in a
reviewed publish packet.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live Rovo publish still requires explicit approval.

## Summary

| Signal                          | Value |
| ------------------------------- | ----: |
| Rovo artifact pages             |     8 |
| Locator rows                    |   500 |
| Ambiguity groups                |     8 |
| Human link rows checked         |   527 |
| Old flat Database Catalog links |     0 |

## Human Link Status Counts

| Status                   | Count |
| ------------------------ | ----- |
| `pending`                | 478   |
| `pending_publish_packet` | 49    |

## Sample Reconciliation Rows

| Rovo page                       | Canonical id                                           | Human page                                                                              | Status                 |
| ------------------------------- | ------------------------------------------------------ | --------------------------------------------------------------------------------------- | ---------------------- |
| Rovo Object Locator 001         | `object:L1-5FSQL-01.Sonic_DW.dbo.Dim_Vehicle`          | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Vehicle`     | pending_publish_packet |
| Rovo Object Summary Context 001 | `object:L1-5FSQL-01.Sonic_DW.dbo.Dim_Vehicle`          | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Vehicle`     | pending_publish_packet |
| Rovo Ambiguity Context 001      | `object:L1-5FSQL-01.Sonic_DW.dbo.Dim_Vehicle`          | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / Dim_Vehicle`     | pending_publish_packet |
| Rovo Object Locator 001         | `object:L1-5FSQL-01.Sonic_DW.dbo.FactOpportunity`      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactOpportunity` | pending_publish_packet |
| Rovo Object Summary Context 001 | `object:L1-5FSQL-01.Sonic_DW.dbo.FactOpportunity`      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactOpportunity` | pending_publish_packet |
| Rovo Upstream Context 001       | `object:L1-5FSQL-01.Sonic_DW.dbo.FactOpportunity`      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactOpportunity` | pending_publish_packet |
| Rovo Downstream Context 001     | `object:L1-5FSQL-01.Sonic_DW.dbo.FactOpportunity`      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactOpportunity` | pending_publish_packet |
| Rovo Ambiguity Context 001      | `object:L1-5FSQL-01.Sonic_DW.dbo.FactOpportunity`      | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo / FactOpportunity` | pending_publish_packet |
| Rovo Object Locator 001         | `database:VendorData`                                  | `not created yet`                                                                       | pending                |
| Rovo Database Context 001       | `database:VendorData`                                  | `not created yet`                                                                       | pending                |
| Rovo Object Locator 001         | `object:L1-5FSQL-01.ETL_Staging.clean.FactOpportunity` | `not created yet`                                                                       | pending                |
| Rovo Object Summary Context 001 | `object:L1-5FSQL-01.ETL_Staging.clean.FactOpportunity` | `not created yet`                                                                       | pending                |
| Rovo Ambiguity Context 001      | `object:L1-5FSQL-01.ETL_Staging.clean.FactOpportunity` | `not created yet`                                                                       | pending                |
| Rovo Object Locator 001         | `object:L1-5FSQL-01.Sonic_DW.dbo.DimVehicle`           | `not created yet`                                                                       | pending                |
| Rovo Object Summary Context 001 | `object:L1-5FSQL-01.Sonic_DW.dbo.DimVehicle`           | `not created yet`                                                                       | pending                |
| Rovo Ambiguity Context 001      | `object:L1-5FSQL-01.Sonic_DW.dbo.DimVehicle`           | `not created yet`                                                                       | pending                |
| Rovo Object Locator 001         | `object:L1-5FSQL-01.Sonic_DW.dbo.Fact_Opportunity`     | `not created yet`                                                                       | pending                |
| Rovo Object Summary Context 001 | `object:L1-5FSQL-01.Sonic_DW.dbo.Fact_Opportunity`     | `not created yet`                                                                       | pending                |
| Rovo Ambiguity Context 001      | `object:L1-5FSQL-01.Sonic_DW.dbo.Fact_Opportunity`     | `not created yet`                                                                       | pending                |
| Rovo Object Locator 001         | `object:L1-5FSQL-01.Sonic_DW.wrk.Dim_Vehicle`          | `not created yet`                                                                       | pending                |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:rovo-link-align:publish
```
