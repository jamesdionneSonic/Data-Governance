---
name: vw_lu_Campaign
database: Sonic_DW
type: view
schema: dbo
owner: Data Team
sensitivity: internal
tags:
  - view
  - auto-extracted
depends_on: []
dependency_count: 0
column_count: 4
extracted_at: 2026-05-13T11:28:24.843Z
---

## Overview

Metadata auto-extracted from SQL Server.

- **Type**: View
- **Schema**: dbo

## Columns

| Name                 | Type     | Nullable | Description |
| -------------------- | -------- | -------- | ----------- |
| `CampaignID`         | nvarchar | ✓        |             |
| `CampaignGroup`      | varchar  | ✓        |             |
| `CampaignGroupShort` | varchar  |          |             |
| `rn`                 | bigint   | ✓        |             |

## Definition

```sql
--****************************************************************************************************
--* Name: vw_lu_Campaign
--*
--* Description:
--* Marketing campaign names as IDs and groups as Descriptions.
--* Text ID fields are not recommended because performance. Consider these field as "temporary"
--* till can have the numeric IDs and the current text will be the descriptions.
--*
--* Change Log:
--* DATE        	MADE BY           		PURPOSE
--* 08/16/2022  	hermann.brandi    		Code creation.
--* 08/17/2022		hermann.brandi			Row count as sort column.
--****************************************************************************************************

CREATE VIEW dbo.vw_lu_Campaign
AS

--Google Analytics Combined
SELECT
	DISTINCT gac.GaCampaign as CampaignID --This field should not be nvarchar(max), but nvarchar(2000)
	, 'Google Analytics' as CampaignGroup
	, 'GA' as CampaignGroupShort

	, ROW_NUMBER() over ( order by  sum(gac.GaPageViews) desc) rn
FROM
	Sonic_DW.dbo.vw_GA_Combined gac --10,166
WHERE 1=1
	AND gac.GaCampaign IS NOT NULL
GROUP BY
	gac.GaCampaign

UNION

--Google Analytics Service
SELECT
	DISTINCT gasvc.GaCampaign --This field should not be nvarchar(max), but nvarchar(2000)
	, 'Google Analytics Service' as CampaignGroup
	, 'GA Service' as CampaignGroupShort
	, ROW_NUMBER() over ( order by  sum(gasvc.GaPageViews) desc) rn
FROM
	Sonic_DW.dbo.vw_GA_Service_Combined gasvc --6,278
WHERE 1=1
	AND gasvc.GaCampaign IS NOT NULL
GROUP BY
	GaCampaign

UNION

--Google Analytics Social
SELECT
	DISTINCT gas.GaCampaign --This field should not be nvarchar(max), but nvarchar(2000)
	, 'Google Analytics Social' as CampaignGroup
	, 'GA Social' as CampaignGroupShort
	, ROW_NUMBER() over ( order by  sum(gas.GaPageViews) desc) rn
FROM
	Sonic_DW.dbo.vw_GA_Social_Combined gas --3,102
WHERE 1=1
	AND gas.GaCampaign IS NOT NULL
GROUP BY
	GaCampaign

UNION

--Google Analytics Web Performance
SELECT
	DISTINCT gaw.GaCampaign --This field should not be nvarchar(max), but nvarchar(2000)
	, 'Google Analytics Web' as CampaignGroup
	, 'GA Web' as CampaignGroupShort
	, ROW_NUMBER() over ( order by  sum(gaw.GaPageViews) desc) rn
FROM
	Sonic_DW.dbo.vw_GA_WebPerformance_Segments gaw --9,806
WHERE 1=1
	AND gaw.GaCampaign IS NOT NULL
GROUP BY
	GaCampaign

UNION

--Gooble Ads
SELECT
	DISTINCT gaads.campaignName
	, 'Google Ads'as CampaignGroup
	, 'GA Ads' as CampaignGroupShort
	, ROW_NUMBER() over (order by sum(gaads.clicks) desc) rn
FROM
	Sonic_DW.dbo.vw_GoogleAds gaads --307
WHERE 1=1
	AND gaads.campaignName IS NOT NULL
GROUP BY
	campaignName

UNION

--Gooble Ads Advertising
SELECT
	DISTINCT gaadsa.campaignName
	, 'Google Ads Advertising'as CampaignGroup
	, 'GA Ads Adv' as CampaignGroupShort
	, ROW_NUMBER() over (order by sum(gaadsa.clicks) desc) rn
FROM
	Sonic_DW.dbo.vw_GoogleAds_Advertising gaadsa --1,339
WHERE 1=1
	AND gaadsa.campaignName IS NOT NULL
GROUP BY
	campaignName

UNION

--Facebook Metrics
SELECT
	DISTINCT fbmd.campaignname
	, fbmd.CampaignNameShort as CampaignGroup
	, 'FB Metrics' as CampaignGroupShort
	, ROW_NUMBER() over (order by sum(fbmd.clicks) desc) rn
FROM
	Sonic_DW.dbo.vw_facebook_metricsdaily_social fbmd --671
WHERE 1=1
	AND fbmd.campaignname IS NOT NULL
GROUP BY
	campaignName
	, fbmd.CampaignNameShort
```

## Governance

- **Last Extracted**: 2026-05-13T11:28:24.843Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
