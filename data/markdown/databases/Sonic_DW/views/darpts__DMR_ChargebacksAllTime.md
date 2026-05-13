---
name: DMR_ChargebacksAllTime
database: Sonic_DW
type: view
schema: darpts
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
dependency_count: 0
column_count: 0
extracted_at: 2026-05-12T20:14:33.860Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: darpts

## Definition

```sql



CREATE  VIEW [darpts].DMR_ChargebacksAllTime
AS
SELECT
accountingdatekey
, de.EntDealerLvl1
, em.empname1 AS EMPName1
, custno
, ad.EntityKey
, CASE
WHEN am.level8 in ('5700','5711','5721','5741','5761', '5771', '5912','5922','5941', '5961' ,'5981','5991', '5787', '5781','5791','5750') THEN 'Under 90'
WHEN am.level8 in ('5701', '5712', '5722', '5742', '5762', '5913', '5923', '5942', '5982','5751','5792','5962') THEN 'Over 90'
ELSE 'NA'
END AS flagfor90days
, sum(postingamount) as amount
FROM [Sonic_DW].[dbo].[Fact_AccountingDetail] ad
LEFT JOIN [Sonic_DW].[dbo].Dim_AccountMgmt am
ON ad.AccountMgmtKey = am.AccountMgmtKey
LEFT JOIN [Sonic_DW].[dbo].Dim_GLDetail gl
ON ad.DetailKey = gl.DetailKey
LEFT JOIN
(SELECT
DISTINCT cora_acct_id
, custno
, empname1
FROM [Sonic_DW].[dbo].Dim_DMSEmployee
WHERE Meta_RowIsCurrent = 'Y'
AND EMPNameCode = 7) em
ON gl.DetCora_Acct_ID = em.cora_acct_id
AND gl.DetControl = em.custno
INNER JOIN [sonic_dw].dbo.dim_entity de
ON de.entitykey = ad.EntityKey
WHERE AccountingDateKey >=  convert(varchar(8), dateadd(day, -120 , getdate()),112) and
am.Level8 IN
('5700','5722','5761','5762','5771','5941','5942','5721','5981','5982',
'5701','5787','5991','5712','5781','5711','5923','5741','5912','5742','5913','5922','5961','5750','5751','5791','5792','5962')
AND de.entbrand = 'echopark'
group by accountingdatekey,
de.EntDealerLvl1,em.empname1, custno, ad.EntityKey,
case when am.level8 in ('5700','5711','5721','5741','5761', '5771', '5912'
,'5922','5941', '5961' ,'5981','5991', '5787', '5781','5791','5750') then 'Under 90'
when am.level8 in ('5701', '5712', '5722', '5742', '5762', '5913', '5923', '5942', '5982','5751','5792','5962') then 'Over 90' else 'NA'
end

```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
