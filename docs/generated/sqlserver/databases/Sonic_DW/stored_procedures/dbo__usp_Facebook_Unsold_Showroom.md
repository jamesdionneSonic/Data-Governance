---
name: usp_Facebook_Unsold_Showroom
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




CREATE PROCEDURE [dbo].[usp_Facebook_Unsold_Showroom]
 @LastLoadDate DATE,
 @FBAudiencePeriod int
AS
BEGIN

 DECLARE @StartDtProspectIn DATETIME = DATEADD(dd, -@FBAudiencePeriod, @LastLoadDate)
    ,@EndDtProspectIn DATETIME = @LastLoadDate

 SELECT DISTINCT
 opp.lPersonID,
    LTRIM(RTRIM([cust].[szFirstName])) AS FirstName,
    LTRIM(RTRIM([cust].[szLastName])) AS LastName,
    em.szAddress AS Email,
    opp.lChildCompanyID,
    opp.lCompanyID,
    opp.dtProspectIn,
    'UnsoldShowroom' AS AudienceType
 FROM [dbo].[dwFullOpportunity] (nolock)  AS opp
  INNER JOIN [dbo].dwFullActivity (nolock) AS act ON act.lDealID = opp.lDealID
            AND (act.dwActive IS NULL
             OR act.dwActive = 1)
            AND (opp.dwActive IS NULL
             OR opp.dwActive = 1)
  INNER JOIN [dbo].[dwFullCustomer](nolock) AS cust ON opp.lPersonID = cust.lPersonID
           AND (cust.dwActive IS NULL
            OR cust.dwActive = 1)
  INNER JOIN [dbo].[dwFullEmail]  (nolock) AS em ON em.lPersonID = opp.lPersonID
          AND (em.dwActive IS NULL
           OR em.dwActive = 1)
 WHERE opp.szStatus = 'Active'
   AND act.szTask LIKE '%Showroom%'
   AND opp.dtProspectIn BETWEEN @StartDtProspectIn AND @EndDtProspectIn
     --AND act.dtDue >= (GETDATE() - 14)
   AND act.dtCompleted IS NOT NULL
   AND ISNULL(em.szAddress, '') <> ''
   AND em.szEmailType = 'Personal'
    --- AND em.bPrimary = 1
 ORDER BY dtProspectIn DESC,
      email

END

```

## Governance

- **Last Extracted**: 2026-05-12T12:28:27.721Z
