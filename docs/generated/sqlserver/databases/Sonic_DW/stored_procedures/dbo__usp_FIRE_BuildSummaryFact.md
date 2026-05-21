---
name: usp_FIRE_BuildSummaryFact
database: Sonic_DW
type: procedure
schema: dbo
owner: Data Team
tags:
  - procedure
  - auto-extracted
dependency_count: 0
parameter_count: 0
extracted_at: 2026-05-12T12:28:27.721Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: Stored Procedure
- **Schema**: dbo

## Definition

```sql

CREATE PROCEDURE [dbo].[usp_FIRE_BuildSummaryFact] (@StartDateKey int, @EndDateKey int)
AS
BEGIN
    SET NOCOUNT ON;

    --
    -- Delete from dbo.factFIRE_A for the date range specified in the parms. Note
    -- that the delete is batched...
    -- odmcpeak 9/26/2011
    --
    DECLARE @cnt int = 1
    WHILE @cnt <> 0
    BEGIN
        BEGIN TRANSACTION
            DELETE TOP (10000)
            FROM dbo.factFIRE_A
            WHERE AccountingDateKey BETWEEN @StartDateKey AND @EndDateKey;
            SET @cnt = @@ROWCOUNT;
        COMMIT TRANSACTION
    END

    --
    -- CTE defines the salesperson counts by entity, deal, and stockno. Note that
    -- unknown or duplicate salespersons do not add to salesperson counts
    -- odmcpeak 9/26/2011
    --
    ;WITH CTE AS
    (
        SELECT DISTINCT entitykey, dealno, stockno,
            CASE WHEN salesperson1key = -1 THEN 0 ELSE 1 END AS S1,
            CASE WHEN salesperson2key = -1 THEN 0 ELSE CASE WHEN SalesPerson1Key = SalesPerson2Key THEN 0 ELSE 1 END END AS S2,
            CASE WHEN salesperson3key = -1 THEN 0 ELSE CASE WHEN salesperson1key = salesperson3key OR SalesPerson3Key = SalesPerson2Key THEN 0 ELSE 1 END END AS S3
        FROM factFIRE
        WHERE dealno <> '' AND AccountingDateKey BETWEEN @StartDateKey AND @EndDateKey
    )

    --
    -- CTA gets the total number of unique salespersons per entity, dealno, and stockno
    -- odmcpeak 9/26/2011
    --
    ,CTA AS
    (
        SELECT entitykey, dealno, stockno, SUM(S1 + S2 + S3) AS SalesCount
        FROM CTE
        GROUP BY entitykey, dealno, stockno
    )

    --
    -- CTB performs the first stage of the unpivot by unioning the distinct salespersons
    -- vertically by entity, dealno, stockno
    -- odmcpeak 9/26/2011
    --
    ,CTB AS
    (
        SELECT DISTINCT entitykey, dealno, stockno, salesperson1key AS SalesPersonKey
        FROM factFIRE
        WHERE SalesPerson1Key <> -1 AND dealno <> '' AND AccountingDateKey BETWEEN @StartDateKey AND @EndDateKey
        UNION
        SELECT DISTINCT entitykey, dealno, stockno, salesperson2key AS SalesPersonKey
        FROM factFIRE
        WHERE SalesPerson2Key <> -1 AND dealno <> '' AND AccountingDateKey BETWEEN @StartDateKey AND @EndDateKey
        UNION
        SELECT DISTINCT entitykey, dealno, stockno, salesperson3key AS SalesPersonKey
        FROM factFIRE
        WHERE SalesPerson3Key <> -1 AND dealno <> '' AND AccountingDateKey BETWEEN @StartDateKey AND @EndDateKey
    )

    --
    -- CTC calculates the percent per deal of each salesperson for each entity, dealno, and stockno
    -- odmcpeak 9/26/2011
    --
    ,CTC AS
    (
        SELECT BB.*, CONVERT(float, 1.00 / AA.Salescount) AS SalesPercent
        FROM CTB BB
        LEFT JOIN CTA AA ON BB.dealno = AA.dealno AND BB.StockNo = AA.StockNo AND BB.EntityKey = AA.EntityKey
    )

    --
    -- The final stage of the unpivot forces the cartesian of the unique salesperson times the % per deal
    -- into the summary fact table dbo.factFIRE_A.
    -- odmcpeak 9/26/2011
    --
    INSERT INTO factFIRE_A
    (
        EntityKey,
        DealNo,
        FIMgrKey,
        SalesMgrKey,
        SalesPersonKey,
        AccountingDateKey,
        ContractDateKey,
        Stockno,
        DealTypeKey,
        VehicleKey,
        FIGLProductCategoryKey,
        FIAccountType,
        Amount,
        DealCount,
        ProductCount,
        PenetrationCount,
        CustomerKey,
        DMSCustomerKey,
        fiwipstatuscode,
        LenderKey,
        StockType,
        PurchaseType,
        TransactionType,
        VehicleMileage,
        VehicleYear,
        IsRetail,
        CertifiedFlag,
        apr,
        age,
        buyrateapr,
        buyrateaddon,
        buyratelfm,
        extwarrantyexpmileslease,
        extwarrantytermlease,
        frontweowesgrosssales,
        mbilimit,
        mbiname,
        mbiterm,
        sellrateapr,
        totaltradesover,
        term,
        VSC_RowLastUpdated,
        DIMVehicleKey -- New column
    )
    SELECT
        FF.EntityKey,
        FF.DealNo,
        FIMgrKey,
        SalesMgrKey,
        ISNULL(SalesPersonKey, -1) AS SalesPersonKey,
        FF.AccountingDateKey,
        ContractDateKey,
        FF.Stockno,
        DealTypeKey,
        ISNULL(VehicleKey, -1) AS VehicleKey,
        GL.FIGLProductCategoryKey,
        GL.FIAccountType,
        SUM(Amount) * ISNULL(CC.SalesPercent, 1) AS Amount,
        CASE WHEN PC.DealCountFlag = 'Y' AND GL.FIAccountType = 'S' THEN ISNULL(CC.SalesPercent, 1) * SUM(FF.statcount) ELSE 0 END AS DealCount,
        CASE WHEN PC.ProductCountFlag = 'Y' AND GL.FIAccountType = 'S' THEN ISNULL(CC.SalesPercent, 1) * SUM(FF.statcount) ELSE 0 END AS ProductCount,
        CASE WHEN PC.PenetrationCountFlag = 'Y' AND GL.FIAccountType = 'S' THEN ISNULL(CC.SalesPercent, 1) * SUM(FF.statcount) ELSE 0 END AS PenetrationCount,
        CustomerKey,
        DMSCustomerKey,
        fiwipstatuscode,
        LenderKey,
        StockType,
        PurchaseType,
        TransactionType,
        VehicleMileage,
        VehicleYear,
        IsRetail,
        CertifiedFlag,
        apr,
        age,
        buyrateapr,
        buyrateaddon,
        buyratelfm,
        extwarrantyexpmileslease,
        extwarrantytermlease,
        frontweowesgrosssales,
        mbilimit,
        mbiname,
        mbiterm,
        sellrateapr,
        totaltradesover,
        term,
        VSC_RowLastUpdated,
        -- Assuming DIMVehicleKey is to be added from a join or existing column
        FF.DIMVehicleKey
    FROM factFIRE FF
    LEFT OUTER JOIN CTC CC ON
        FF.dealno = CC.dealno AND FF.StockNo = CC.StockNo AND FF.EntityKey = CC.EntityKey
    INNER JOIN dim_FIGLAccounts GL ON FF.FIGLProductKey = GL.FIGLProductKey
    INNER JOIN dim_FIGLProductCategory PC ON GL.FIGLProductCategoryKey = PC.FIGLProductCategoryKey
    WHERE GL.FIAccountClassification NOT IN ('Wholesale', 'InterCompany')
    AND FF.AccountingDateKey BETWEEN @StartDateKey AND @EndDateKey
    GROUP BY
        FF.EntityKey,
        FF.DealNo,
        FIMgrKey,
        SalesMgrKey,
        SalesPersonKey,
        FF.AccountingDateKey,
        ContractDateKey,
        FF.Stockno,
        DealTypeKey,
        VehicleKey,
        GL.FIGLProductCategoryKey,
        SalesPercent,
        PC.FIGLProductCategory,
        FIAccountType,
        DealCountFlag,
        ProductCountFlag,
        PenetrationCountFlag,
        CustomerKey,
        DMSCustomerKey,
        fiwipstatuscode,
        LenderKey,
        StockType,
        PurchaseType,
        TransactionType,
        VehicleMileage,
        VehicleYear,
        IsRetail,
        CertifiedFlag,
        apr,
        age,
        buyrateapr,
        buyrateaddon,
        buyratelfm,
        extwarrantyexpmileslease,
        extwarrantytermlease,
        frontweowesgrosssales,
        mbilimit,
        mbiname,
        mbiterm,
        sellrateapr,
        totaltradesover,
        term,
        VSC_RowLastUpdated,
        FF.DIMVehicleKey -- Include DIMVehicleKey in the group by clause
END





```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
