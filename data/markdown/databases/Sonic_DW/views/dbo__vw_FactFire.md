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
depends_on:
  - dim_DealType
  - dim_FIGLAccounts
  - factFIRE
dependency_count: 3
column_count: 87
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

1- **Type**: View

- **Schema**: dbo

## Dependencies

This view depends on:

- **dbo.dim_DealType** (U )
- **dbo.dim_FIGLAccounts** (U )
- **dbo.factFIRE** (U )

## Columns

| Name                       | Type      | Nullable | Description |
| -------------------------- | --------- | -------- | ----------- |
| `RowID`                    | bigint    | ✓        |             |
| `EntityKey`                | int       | ✓        |             |
| `dealno`                   | varchar   | ✓        |             |
| `FIMgrKey`                 | int       | ✓        |             |
| `SalesMgrKey`              | int       | ✓        |             |
| `SalesPerson1Key`          | int       | ✓        |             |
| `SalesPerson2Key`          | int       | ✓        |             |
| `SalesPerson3Key`          | int       | ✓        |             |
| `AccountingDateKey`        | int       | ✓        |             |
| `ContractDateKey`          | int       | ✓        |             |
| `CashPrice`                | numeric   | ✓        |             |
| `StockNo`                  | varchar   | ✓        |             |
| `StockType`                | varchar   | ✓        |             |
| `DealTypeKey`              | int       | ✓        |             |
| `PurchaseType`             | varchar   | ✓        |             |
| `TransactionType`          | varchar   | ✓        |             |
| `IsRetail`                 | varchar   | ✓        |             |
| `VehicleKey`               | int       | ✓        |             |
| `VehicleMileage`           | int       | ✓        |             |
| `VehicleYear`              | int       | ✓        |             |
| `CertifiedFlag`            | varchar   | ✓        |             |
| `FIGLProductKey`           | int       | ✓        |             |
| `Amount`                   | float     | ✓        |             |
| `VehicleGeneralKey`        | int       | ✓        |             |
| `statcount`                | numeric   | ✓        |             |
| `CustomerKey`              | int       | ✓        |             |
| `fiwipstatuscode`          | char      | ✓        |             |
| `LenderKey`                | int       | ✓        |             |
| `SaleType`                 | varchar   | ✓        |             |
| `DMSCustomerKey`           | int       | ✓        |             |
| `AcctgDealType`            | varchar   | ✓        |             |
| `apr`                      | float     | ✓        |             |
| `age`                      | int       | ✓        |             |
| `buyrateapr`               | float     | ✓        |             |
| `buyrateaddon`             | float     | ✓        |             |
| `buyratelfm`               | float     | ✓        |             |
| `extwarrantyexpmileslease` | int       | ✓        |             |
| `extwarrantytermlease`     | int       | ✓        |             |
| `frontweowesgrosssales`    | numeric   | ✓        |             |
| `mbilimit`                 | int       | ✓        |             |
| `mbiname`                  | varchar   | ✓        |             |
| `mbiterm`                  | int       | ✓        |             |
| `sellrateapr`              | float     | ✓        |             |
| `totaltradesover`          | numeric   | ✓        |             |
| `frontweowes`              | numeric   | ✓        |             |
| `term`                     | int       | ✓        |             |
| `VSC_RowLastUpdated`       | datetime2 | ✓        |             |
| `control`                  | varchar   | ✓        |             |
| `control2`                 | varchar   | ✓        |             |
| `postingsequence`          | int       | ✓        |             |
| `journalid`                | varchar   | ✓        |             |
| `postingdate`              | datetime  | ✓        |             |
| `postingtime`              | int       | ✓        |             |
| `userid`                   | varchar   | ✓        |             |
| `username`                 | varchar   | ✓        |             |
| `interfacecode`            | varchar   | ✓        |             |
| `costprice`                | numeric   | ✓        |             |
| `grossprofit`              | numeric   | ✓        |             |
| `totalcashsurplus`         | numeric   | ✓        |             |
| `backgross`                | numeric   | ✓        |             |
| `backweowes`               | numeric   | ✓        |             |
| `trade1stock`              | varchar   | ✓        |             |
| `trade1vin`                | varchar   | ✓        |             |
| `trade1gross`              | numeric   | ✓        |             |
| `trade1ACV`                | numeric   | ✓        |             |
| `trade2stock`              | varchar   | ✓        |             |
| `trade2vin`                | varchar   | ✓        |             |
| `trade2gross`              | numeric   | ✓        |             |
| `trade2ACV`                | numeric   | ✓        |             |
| `feeoption1amount`         | numeric   | ✓        |             |
| `salecreditsp1`            | int       | ✓        |             |
| `salecreditsp2`            | int       | ✓        |             |
| `BookedStatusDate`         | datetime  | ✓        |             |
| `financeamt`               | numeric   | ✓        |             |
| `paymentamt`               | numeric   | ✓        |             |
| `closingmgr`               | varchar   | ✓        |             |
| `dealerdefined6`           | varchar   | ✓        |             |
| `dealerdefined7`           | varchar   | ✓        |             |
| `cashdown`                 | numeric   | ✓        |             |
| `customercashdown`         | numeric   | ✓        |             |
| `DIMVehicleKey`            | int       | ✓        |             |
| `FI_cora_acct_id`          | int       | ✓        |             |
| `DealTypeFIRE`             | varchar   | ✓        |             |
| `FIAccount`                | int       |          |             |
| `FIAccountDesc`            | varchar   | ✓        |             |
| `FIGLProductCategoryKey`   | int       | ✓        |             |
| `FIGLProductCategory`      | varchar   | ✓        |             |

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

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
