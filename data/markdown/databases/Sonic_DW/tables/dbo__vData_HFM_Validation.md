---
name: vData_HFM_Validation
database: Sonic_DW
type: table
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - core-schema
depends_on: []
row_count: 0
size_kb: 0
column_count: 122
index_count: 0
check_constraint_count: 0
extraction_warnings:
  - MISSING_VIEW_DATABASE_STATE
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: table
- **Schema**: dbo
- **Row Count**: 0
- **Size**: 0 KB

## Columns

| Name            | Type     | Nullable | Identity | Default | Description |
| --------------- | -------- | -------- | -------- | ------- | ----------- |
| `DataKey`       | bigint   |          |          |         |             |
| `PartitionKey`  | int      |          |          |         |             |
| `CatKey`        | int      |          |          |         |             |
| `PeriodKey`     | datetime |          |          |         |             |
| `DataView`      | nvarchar |          |          |         |             |
| `CurKey`        | nvarchar |          |          |         |             |
| `CalcAcctType`  | smallint |          |          |         |             |
| `ChangeSign`    | bit      |          |          |         |             |
| `JournalID`     | nvarchar |          |          |         |             |
| `Amount`        | float    |          |          |         |             |
| `AmountX`       | float    |          |          |         |             |
| `Desc1`         | nvarchar |          |          |         |             |
| `Desc2`         | nvarchar |          |          |         |             |
| `Account`       | nvarchar |          |          |         |             |
| `AccountX`      | nvarchar |          |          |         |             |
| `AccountR`      | int      |          |          |         |             |
| `AccountF`      | smallint |          |          |         |             |
| `Entity`        | nvarchar |          |          |         |             |
| `EntityX`       | nvarchar |          |          |         |             |
| `EntityR`       | int      |          |          |         |             |
| `EntityF`       | smallint |          |          |         |             |
| `ICP`           | nvarchar |          |          |         |             |
| `ICPX`          | nvarchar |          |          |         |             |
| `ICPR`          | int      |          |          |         |             |
| `ICPF`          | smallint |          |          |         |             |
| `UD1`           | nvarchar |          |          |         |             |
| `UD1X`          | nvarchar |          |          |         |             |
| `UD1R`          | int      |          |          |         |             |
| `UD1F`          | smallint |          |          |         |             |
| `UD2`           | nvarchar |          |          |         |             |
| `UD2X`          | nvarchar |          |          |         |             |
| `UD2R`          | int      |          |          |         |             |
| `UD2F`          | smallint |          |          |         |             |
| `UD3`           | nvarchar |          |          |         |             |
| `UD3X`          | nvarchar |          |          |         |             |
| `UD3R`          | int      |          |          |         |             |
| `UD3F`          | smallint |          |          |         |             |
| `UD4`           | nvarchar |          |          |         |             |
| `UD4X`          | nvarchar |          |          |         |             |
| `UD4R`          | int      |          |          |         |             |
| `UD4F`          | smallint |          |          |         |             |
| `UD5`           | nvarchar |          |          |         |             |
| `UD5X`          | nvarchar |          |          |         |             |
| `UD5R`          | int      |          |          |         |             |
| `UD5F`          | smallint |          |          |         |             |
| `UD6`           | nvarchar |          |          |         |             |
| `UD6X`          | nvarchar |          |          |         |             |
| `UD6R`          | int      |          |          |         |             |
| `UD6F`          | smallint |          |          |         |             |
| `UD7`           | nvarchar |          |          |         |             |
| `UD7X`          | nvarchar |          |          |         |             |
| `UD7R`          | int      |          |          |         |             |
| `UD7F`          | smallint |          |          |         |             |
| `UD8`           | nvarchar |          |          |         |             |
| `UD8X`          | nvarchar |          |          |         |             |
| `UD8R`          | int      |          |          |         |             |
| `UD8F`          | smallint |          |          |         |             |
| `ArchiveID`     | bigint   |          |          |         |             |
| `HasMemoItem`   | bit      |          |          |         |             |
| `StaticDataKey` | bigint   |          |          |         |             |
| `UD9`           | nvarchar |          |          |         |             |
| `UD9X`          | nvarchar |          |          |         |             |
| `UD9R`          | int      |          |          |         |             |
| `UD9F`          | smallint |          |          |         |             |
| `UD10`          | nvarchar |          |          |         |             |
| `UD10X`         | nvarchar |          |          |         |             |
| `UD10R`         | int      |          |          |         |             |
| `UD10F`         | smallint |          |          |         |             |
| `UD11`          | nvarchar |          |          |         |             |
| `UD11X`         | nvarchar |          |          |         |             |
| `UD11R`         | int      |          |          |         |             |
| `UD11F`         | smallint |          |          |         |             |
| `UD12`          | nvarchar |          |          |         |             |
| `UD12X`         | nvarchar |          |          |         |             |
| `UD12R`         | int      |          |          |         |             |
| `UD12F`         | smallint |          |          |         |             |
| `UD13`          | nvarchar |          |          |         |             |
| `UD13X`         | nvarchar |          |          |         |             |
| `UD13R`         | int      |          |          |         |             |
| `UD13F`         | smallint |          |          |         |             |
| `UD14`          | nvarchar |          |          |         |             |
| `UD14X`         | nvarchar |          |          |         |             |
| `UD14R`         | int      |          |          |         |             |
| `UD14F`         | smallint |          |          |         |             |
| `UD15`          | nvarchar |          |          |         |             |
| `UD15X`         | nvarchar |          |          |         |             |
| `UD15R`         | int      |          |          |         |             |
| `UD15F`         | smallint |          |          |         |             |
| `UD16`          | nvarchar |          |          |         |             |
| `UD16X`         | nvarchar |          |          |         |             |
| `UD16R`         | int      |          |          |         |             |
| `UD16F`         | smallint |          |          |         |             |
| `UD17`          | nvarchar |          |          |         |             |
| `UD17X`         | nvarchar |          |          |         |             |
| `UD17R`         | int      |          |          |         |             |
| `UD17F`         | smallint |          |          |         |             |
| `UD18`          | nvarchar |          |          |         |             |
| `UD18X`         | nvarchar |          |          |         |             |
| `UD18R`         | int      |          |          |         |             |
| `UD18F`         | smallint |          |          |         |             |
| `UD19`          | nvarchar |          |          |         |             |
| `UD19X`         | nvarchar |          |          |         |             |
| `UD19R`         | int      |          |          |         |             |
| `UD19F`         | smallint |          |          |         |             |
| `UD20`          | nvarchar |          |          |         |             |
| `UD20X`         | nvarchar |          |          |         |             |
| `UD20R`         | int      |          |          |         |             |
| `UD20F`         | smallint |          |          |         |             |
| `Attr1`         | nvarchar |          |          |         |             |
| `Attr2`         | nvarchar |          |          |         |             |
| `Attr3`         | nvarchar |          |          |         |             |
| `Attr4`         | nvarchar |          |          |         |             |
| `Attr5`         | nvarchar |          |          |         |             |
| `Attr6`         | nvarchar |          |          |         |             |
| `Attr7`         | nvarchar |          |          |         |             |
| `Attr8`         | nvarchar |          |          |         |             |
| `Attr9`         | nvarchar |          |          |         |             |
| `Attr10`        | nvarchar |          |          |         |             |
| `Attr11`        | nvarchar |          |          |         |             |
| `Attr12`        | nvarchar |          |          |         |             |
| `Attr13`        | nvarchar |          |          |         |             |
| `Attr14`        | nvarchar |          |          |         |             |

## Extraction Notes

- **MISSING_VIEW_DATABASE_STATE**: Missing VIEW DATABASE STATE permission. Row count and size metrics are unavailable.

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
- **Compliance**: Review for GDPR/HIPAA applicability
- **Extractor Warnings**: Present (see Extraction Notes)
