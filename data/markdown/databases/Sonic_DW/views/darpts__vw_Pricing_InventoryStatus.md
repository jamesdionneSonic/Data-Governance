---
name: vw_Pricing_InventoryStatus
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 2
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Dependencies

This view depends on:

- **darpts.Pricing_InventoryStatus** (U )
- **darpts.vw_Pricing_Report_Main_Full** (V )

## Definition

```sql

CREATE VIEW [darpts].[vw_Pricing_InventoryStatus]
AS
SELECT        darpts.Pricing_InventoryStatus.InventoryStatusID, darpts.Pricing_InventoryStatus.SIMSStatus, darpts.Pricing_InventoryStatus.StatusGroup, storename.store_name, 0 AS ZeroInv
FROM            darpts.Pricing_InventoryStatus CROSS JOIN
                             (SELECT DISTINCT store_name
                               FROM            darpts.vw_Pricing_Report_Main_Full) AS storename

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
