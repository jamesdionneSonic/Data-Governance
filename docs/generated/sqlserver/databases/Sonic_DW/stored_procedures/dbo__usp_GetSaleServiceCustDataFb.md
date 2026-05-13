---
name: usp_GetSaleServiceCustDataFb
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

CREATE PROCEDURE [dbo].[usp_GetSaleServiceCustDataFb](@dateToCheck INT)
AS
     BEGIN
         SET NOCOUNT ON;

        -- fb Sales Query:

         SELECT *
         FROM
         (
             SELECT ff.EntityKey AS entity,
                    der.BigIntegerField AS event_set_id,
                    c.DMSCstEmailAddress1 AS email,
                    '1'+COALESCE(c.DMSCstCellPhone, c.DMSCstHomePhone, c.DMSCstBusinessPhone) AS phone,
                    DMSCstAddressCity AS ct,
                    DMSCstAddressState AS st,
                    DMSCstAddressZipCode AS zip,
                    c.DMSCstNameFirst AS fn,
                    COALESCE(c.DMSCstNameLast, c.DMSCstBusinessName) AS ln,
                    CASE ff.StockType
                        WHEN 'NEW'
                        THEN 'Purchase'
                        WHEN 'USED'
                        THEN 'AddToWishlist'
                        ELSE 'Purchase'
                    END AS event_name,
                    CONVERT(DATE, CONVERT(VARCHAR(10), ff.AccountingDateKey, 120)) AS event_time,
                    v.VehVIN AS order_id,
                    CASE ff.StockType
                        WHEN 'NEW'
                        THEN '0.04'
                        WHEN 'USED'
                        THEN '0.03'
                        ELSE '0.04'
                    END AS value,
                    'USD' AS currency
             FROM FactFire(NOLOCK) AS ff
                  INNER JOIN Dim_DMSCustomer(NOLOCK) AS c ON c.DMSCustomerKey = ff.DMSCustomerKey
                  INNER JOIN dim_FIGLAccounts(NOLOCK) AS a ON ff.FIGLProductKey = a.FIGLProductKey
                  INNER JOIN Dim_Vehicle(NOLOCK) AS v ON v.VehicleKey = ff.VehicleKey
                  LEFT JOIN dbo.DimEntityRelationship(NOLOCK) AS der ON ff.EntityKey = der.EntityKey
                  LEFT JOIN dbo.DimEntityRelationshipType(NOLOCK) AS dert ON der.RelationshipTypeGuid = dert.RelationshipTypeGuid
             WHERE 1 = 1
                   AND ff.AccountingDateKey >= CONVERT(VARCHAR(8), DATEADD(dd, -7, CAST(@dateToCheck AS VARCHAR)), 112)
                   AND FIGLProductCategory = 'FrontGross'
                   AND FIAccountType = 'S'
                   AND IsRetail = 'IsRetail'
                   AND statcount > 0
                   AND c.DMSCustomerKey > 0
              --AND c.DMSCstNameLast NOT LIKE '%unknown%'
                   AND dert.RelationshipType = 'SonicEventSetId'
                   AND der.IsActive = 1
                   AND der.BigIntegerField IS NOT NULL
             UNION ALL

        -- fb Service Query:

             SELECT fs.EntityKey AS entity,
               --fs.EntDealerLvl1 AS entity_name
                    der.BigIntegerField AS event_set_id,
               --,234466377250817 AS event_set_id
               --,fs.DMSCustomerKey DMSCustomerKey
                    CASE
                        WHEN CHARINDEX(',', MAX(dc.DMSCstEmailAddress1)) > 0
                        THEN '"'+MAX(dc.DMSCstEmailAddress1)+'"'
                        ELSE MAX(dc.DMSCstEmailAddress1)
                    END AS email,
                    '1'+COALESCE(dc.DMSCstCellPhone, dc.DMSCstHomePhone, dc.DMSCstBusinessPhone) AS phone, -- 20181218 Bedant : Added to include Country Code 1 for US
                    CASE
                        WHEN CHARINDEX(',', MAX(dc.DMSCstAddressCity)) > 0
                        THEN '"'+MAX(dc.DMSCstAddressCity)+'"'
                        ELSE MAX(dc.DMSCstAddressCity)
                    END AS ct,
                    CASE
                        WHEN CHARINDEX(',', MAX(dc.DMSCstAddressState)) > 0
                        THEN '"'+MAX(dc.DMSCstAddressState)+'"'
                        ELSE MAX(dc.DMSCstAddressState)
                    END AS st,
                    CASE
                        WHEN CHARINDEX(',', MAX(dc.DMSCstAddressZipCode)) > 0
                        THEN '"'+MAX(dc.DMSCstAddressZipCode)+'"'
                        ELSE MAX(dc.DMSCstAddressZipCode)
                    END AS zip,
                    CASE
                        WHEN CHARINDEX(',', MAX(dc.DMSCstNameFirst)) > 0
                        THEN '"'+MAX(dc.DMSCstNameFirst)+'"'
                        ELSE MAX(dc.DMSCstNameFirst)
                    END AS fn,
                    CASE
                        WHEN CHARINDEX(',', MAX(dc.DMSCstNameLast)) > 0
                        THEN '"'+MAX(dc.DMSCstNameLast)+'"'
                        ELSE MAX(dc.DMSCstNameLast)
                    END AS ln,
                    'AddToCart' AS event_name,
                    MAX(CAST(fs.CloseDate AS DATE)) AS event_time,
                    fs.vin AS order_id,
                    '0.02' AS value,
                    'USD' AS currency
             FROM dbo.vw_Fact_ServiceDetail(NOLOCK) AS fsd
                  LEFT JOIN dbo.vw_Fact_Service(NOLOCK) AS fs ON fsd.ServiceKey = fs.ServiceKey
                  LEFT JOIN dbo.Dim_DMSCustomer(NOLOCK) AS dc ON fs.DMSCustomerKey = dc.DMSCustomerKey
                  LEFT JOIN dbo.DimEntityRelationship(NOLOCK) AS der ON fs.EntityKey = der.EntityKey
                  LEFT JOIN dbo.DimEntityRelationshipType(NOLOCK) AS dert ON der.RelationshipTypeGuid = dert.RelationshipTypeGuid
             WHERE fs.CloseDateKey >= CONVERT(VARCHAR(8), DATEADD(dd, -7, CAST(@dateToCheck AS VARCHAR)), 112)
                   AND dert.RelationshipType = 'SonicEventSetId'
                   AND der.IsActive = 1
                   AND der.BigIntegerField IS NOT NULL
                   AND dc.DMSCstFullName NOT LIKE '%unknown%'
                   AND COALESCE(fsd.LbrLaborTypeCategory, 'UKN') IN('CP Body Shop', 'CP Ext Svc', 'CP Fleet Work', 'CP Quick Lube', 'Customer Pay', 'WTY', 'WTY Ext Svc',

'WTY Maint')
             GROUP BY fs.EntityKey,
                 --fs.EntDealerLvl1
                      der.BigIntegerField,
                      fs.DMSCustomerKey,
                      dc.DMSCstEmailAddress1,
                      COALESCE(dc.DMSCstCellPhone, dc.DMSCstHomePhone, dc.DMSCstBusinessPhone),
                      dc.DMSCstAddressCity,
                      dc.DMSCstAddressState,
                      dc.DMSCstAddressZipCode,
                      fs.vin
         ) t

         WHERE NOT EXISTS
         (
             SELECT 1
             FROM FacebookCustomerExport fce
             WHERE STATUS = 1
                   AND ISNULL(t.entity, -1) = ISNULL(fce.entity, -1)
                   AND ISNULL(t.event_name, 'dummy') = ISNULL(fce.event_name, 'dummy')
                   AND ISNULL(t.order_id, 'dummy') = ISNULL(fce.order_id, 'dummy')
                   AND ISNULL(t.phone, 'dummy') = ISNULL(fce.phone, 'dummy')
                   AND ISNULL(t.email, 'dummy') = ISNULL(fce.email, 'dummy')
                   AND ISNULL(t.ln, 'dummy') = ISNULL(fce.ln, 'dummy')
         )
         ORDER BY t.event_set_id,
                  t.fn,
                  t.ln;
     END;
```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
