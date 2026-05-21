---
name: usp_GetVehicleServiceData
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
CREATE PROCEDURE [dbo].[usp_GetVehicleServiceData]
(@lastloaddate    INT,
 @maxclosedatekey INT
)
AS
     BEGIN
        --- OPEN RO

         INSERT INTO ETL_Staging.dbo.stgEleadVehicleServiceExport
         ([Name-File],
          LastName,
          FirstName,
          [Address],
          City,
          Zip,
          Email,
          HomePhone,
          CellPhone,
          DMSID,
          VIN,
          MaxRONumber,
          DateKey,
          RN
         )
                --- OPEN RO

                SELECT [Name-File],
                       LastName,
                       FirstName,
                       [Address],
                       City,
                       Zip,
                       Email,
                       HomePhone,
                       CellPhone,
                       DMSID,
                       VIN,
                       MaxRONumber,
                       DateKey,
                       RN
                FROM
                (
                    SELECT [Name-File],
                           LastName,
                           FirstName,
                           [Address],
                           City,
                           Zip,
                           Email,
                           HomePhone,
                           CellPhone,
                           DMSID,
                           VIN,
                           MaxRONumber,
                           ROW_NUMBER() OVER(PARTITION BY [Name-File],
                                                          VIN ORDER BY MaxRONumber DESC,
                                                                       DateKey DESC) RN,
                           DateKey
                    FROM
                    (
                        SELECT ronumber AS MaxRONumber,
                               fs.EntityKey,
                               CASE
                                   WHEN fs.entitykey = 344
                                   THEN 1425
                                   WHEN fs.entitykey IN(351, 352, 353)
                                   THEN 1414
                                   WHEN fs.entitykey = 401
                                   THEN 14993
                                   WHEN fs.entitykey = 479
                                   THEN 716
                                   ELSE COALESCE(e.enteleadnewid, e.enteleadid)
                               END AS [Name-File],
                               COALESCE(DMSCstNameLast, DMSCstBusinessName) LastName,
                               c.dmscstnamefirst FirstName,
                               DMSCstAddressLine1 [Address],
                               DMSCstAddressCity City,
                               DMSCstAddressZipCode Zip,
                               DMSCstEmailAddress1 Email,
                               DMSCstHomePhone HomePhone,
                               DMSCstCellPhone CellPhone,
                               DMSCstCustNo DMSID,
                               v.VehVIN VIN,
                               Opendatekey AS DateKey
                        FROM dbo.Fact_Service fs
                             JOIN dim_vehicle v ON v.VehicleKey = fs.VehicleKey
                             JOIN dim_entity e ON fs.EntityKey = e.EntityKey
                             JOIN Dim_DMSCustomer c ON fs.DMSCustomerKey = c.dmscustomerkey
                        WHERE(closedatekey = 19000101
                              AND fs.OpenDate >= DATEADD(dd, -7, GETDATE()))
                             AND DMSCstCustNo <> 'Unknown'
                             AND e.entitykey <> 98
                             AND VehVIN <> 'Unknown'
                             AND (c.dmscstnamefirst <> 'Unknown'
                                  AND COALESCE(DMSCstNameLast, DMSCstBusinessName) <> 'Unknown')

         --- CLOSED RO
                        UNION
                        SELECT ronumber AS MaxRONumber,
                               fs.EntityKey,
                               CASE
                                   WHEN fs.entitykey = 344
                                   THEN 1425
                                   WHEN fs.entitykey IN(351, 352, 353)
                                   THEN 1414
                                   WHEN fs.entitykey = 401
                                   THEN 14993
                                   WHEN fs.entitykey = 479
                                   THEN 716
                                   ELSE COALESCE(e.enteleadnewid, e.enteleadid)
                               END AS [Name-File],
                               COALESCE(DMSCstNameLast, DMSCstBusinessName) LastName,
                               c.dmscstnamefirst FirstName,
                               DMSCstAddressLine1 [Address],
                               DMSCstAddressCity City,
                               DMSCstAddressZipCode Zip,
                               DMSCstEmailAddress1 Email,
                               DMSCstHomePhone HomePhone,
                               DMSCstCellPhone CellPhone,
                               DMSCstCustNo DMSID,
                               v.VehVIN VIN,
                               Closedatekey AS DateKey
                        FROM dbo.Fact_Service fs
                             JOIN dim_vehicle v ON v.VehicleKey = fs.VehicleKey
                             JOIN dim_entity e ON fs.EntityKey = e.EntityKey
                             JOIN Dim_DMSCustomer c ON fs.DMSCustomerKey = c.dmscustomerkey
                        WHERE CloseDateKey > @lastloaddate
                              AND CloseDateKey <= @maxclosedatekey
                              AND CPFlag = 1
                              AND DMSCstCustNo <> 'Unknown'
                              AND VehVIN <> 'Unknown'
                              AND (c.dmscstnamefirst <> 'Unknown'
                                   AND COALESCE(DMSCstNameLast, DMSCstBusinessName) <> 'Unknown')

         -- SALES DATA
                        UNION ALL
                        SELECT NULL AS MaxRONumber,
                               fs.EntityKey,
                               COALESCE(e.enteleadnewid, e.enteleadid) AS [Name-File]
                               ,
                --,e.EntDealerLvl1
                               DMSCstNameLast AS LastName,
                               c.dmscstnamefirst AS FirstName
                               ,
                --,DMSCstBusinessName namecompany
                               DMSCstAddressLine1 AS [Address],
                               DMSCstAddressCity AS City
                               ,
                --,DMSCstAddressState
                               DMSCstAddressZipCode AS Zip,
                               DMSCstEmailAddress1 AS Email,
                               DMSCstCellPhone AS CellPhone,
                               DMSCstHomePhone AS HomePhone
                               ,
                --,DMSCstEmailAddress2
                               DMSCstCustNo AS DMSID,
                               v.VehVIN AS VIN,
                               fs.AccountingDateKey AS DateKey
                        FROM factFIRE_A fs
                             LEFT JOIN dim_vehicle v ON v.VehicleKey = fs.VehicleKey
                             LEFT JOIN Dim_DMSCustomer c ON fs.DMSCustomerKey = c.dmscustomerkey
                             JOIN dim_entity e ON fs.EntityKey = e.EntityKey
                        WHERE fs.AccountingDateKey > @lastloaddate
                              AND fs.AccountingDateKey <= @maxclosedatekey
                              AND Dealcount = 1
                              AND VehVIN <> 'Unknown'
                              AND (dmscstnamefirst <> 'Unknown'
                                   AND DMSCstNameLast <> 'Unknown')
                    ) T1
                ) T2
                WHERE RN = 1;
     END;
```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
