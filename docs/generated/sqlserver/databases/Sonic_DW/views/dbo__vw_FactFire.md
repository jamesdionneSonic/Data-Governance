---
name: vw_FactFire
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Definition

```sql
CREATE VIEW dbo.vw_FactFire
AS
SELECT        ROW_NUMBER() OVER (ORDER BY Meta_RowEffectiveDate, DealNo ASC) AS RowID, f.EntityKey, f.dealno, f.FIMgrKey, f.SalesMgrKey, f.SalesPerson1Key, f.SalesPerson2Key, f.SalesPerson3Key, f.AccountingDateKey,
f.ContractDateKey, f.CashPrice, f.StockNo, f.StockType, f.DealTypeKey, f.PurchaseType, f.TransactionType, f.IsRetail, f.VehicleKey, f.VehicleMileage, f.VehicleYear, f.CertifiedFlag, f.FIGLProductKey, f.Amount, f.VehicleGeneralKey,
f.statcount, f.CustomerKey, f.fiwipstatuscode, f.LenderKey, CASE WHEN f.fiwipstatuscode = 'F' THEN a.FIAccountClassification WHEN d .DealTypeCode = 'Lease' OR
d .DealTypeCode = 'Demo' THEN 'New' ELSE d .DealTypeCode END AS SaleType, f.DMSCustomerKey, CASE WHEN f.fiwipstatuscode = 'F' THEN a.FIAccountClassification WHEN f.fiwipstatuscode <> 'F' AND
d .DealTypeCode = 'Lease' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND d .DealTypeCode = 'Demo' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND d .DealTypeCode = 'Fleet' THEN 'New' WHEN f.fiwipstatuscode <> 'F' AND
d .DealTypeCode = 'Wholesale' THEN 'Used' WHEN f.fiwipstatuscode <> 'F' AND d .DealTypeCode = 'Rental' THEN 'Used' WHEN f.fiwipstatuscode <> 'F' AND
d .DealTypeCode = 'Misc' THEN 'Unknown' ELSE d .DealTypeCode END AS AcctgDealType, f.apr, f.age, f.buyrateapr, f.buyrateaddon, f.buyratelfm, f.extwarrantyexpmileslease, f.extwarrantytermlease, f.frontweowesgrosssales, f.mbilimit,
f.mbiname, f.mbiterm, f.sellrateapr, f.totaltradesover, f.frontweowes, f.term, f.VSC_RowLastUpdated, f.control, f.control2, f.postingsequence, f.journalid, f.postingdate, f.postingtime, f.userid, f.username, f.interfacecode, f.costprice,
f.grossprofit, f.totalcashsurplus, f.backgross, f.backweowes, f.trade1stock, f.trade1vin, f.trade1gross, f.trade1ACV, f.trade2stock, f.trade2vin, f.trade2gross, f.trade2ACV, f.feeoption1amount, f.salecreditsp1, f.salecreditsp2,
f.BookedStatusDate, f.financeamt, f.paymentamt, f.closingmgr, f.dealerdefined6, f.dealerdefined7, f.cashdown, f.customercashdown, f.DIMVehicleKey, f.FI_cora_acct_id,
CASE WHEN TransactionType = 'Product Only' THEN 'Product Only' WHEN ([PurchaseType] = 'Finance(Buy)') THEN 'Finance(Buy)' WHEN ([PurchaseType] = 'Lease') THEN 'Lease' WHEN ([PurchaseType] = 'Cash(Buy)' AND
TransactionType = 'Vehicle Deal') THEN 'Cash(Buy)' WHEN TransactionType = 'NA' THEN 'Accounting' ELSE [PurchaseType] END AS DealTypeFIRE, a.[FIAccount], a.[FIAccountDesc], a.[FIGLProductCategoryKey], a.[FIGLProductCategory]
FROM            dbo.factFIRE AS f WITH (NOLOCK) INNER JOIN
                         dbo.dim_FIGLAccounts AS a ON f.FIGLProductKey = a.FIGLProductKey INNER JOIN
                         dbo.dim_DealType AS d ON f.DealTypeKey = d .DealTypeKey

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
