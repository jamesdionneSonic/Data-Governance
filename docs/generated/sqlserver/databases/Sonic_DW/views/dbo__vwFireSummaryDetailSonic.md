---
name: vwFireSummaryDetailSonic
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
extracted_at: 2026-05-09T12:34:14.349Z
---

## Overview

1- **Type**: View
- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vwFireSummaryDetailSonic
AS
SELECT        row_number() OVER (ORDER BY e.EntADPCompanyID, f.StockNo, ad.FullDate, e.EntAccountingPrefix) AS ID, ad.FullDate AS AccountingDate, f.accountingdatekey, f.postingdate/*--Added 03/27/20 DMD*/ , MAX(f.VehicleMileage) 
VehicleMileage/*Raj add 20220802 ASM*/ , CASE WHEN f.dealno = '-1' THEN 0 ELSE 1 END AS AssignedFlag, MAX(ISNULL(f.CertifiedFlag, 'N')) AS CertifiedFlag, MAX(cd.FullDate) AS ContractDate, f.dealno AS DealNumber, 
f.fiwipst
```

## Governance

- **Last Extracted**: 2026-05-09T12:34:14.349Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
