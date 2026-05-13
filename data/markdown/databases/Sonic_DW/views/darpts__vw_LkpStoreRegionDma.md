---
name: vw_LkpStoreRegionDma
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

CREATE VIEW darpts.vw_LkpStoreRegionDma
         AS
         SELECT l.store_id,
               l.region_name,
               l.store_name,
               l.business,
               l.parent_store,
               l.recon_hub_id,
               l.recon_hub_nm,
               l.dma_id,
               l.dma_name,
               l.post_time,
               l.pricing_cd,
			   l.store_class,
			   l.active,
			   l.region_id,
			   l.outlet_location,
			   l.docfee,
			   l.entbrand,
			   l.bp_store_active,
			   CASE WHEN business<>'ECHOPARK' THEN NULL ELSE COALESCE(p.store_size,2)END store_size,
			   CASE WHEN business<>'ECHOPARK' THEN NULL ELSE COALESCE(p.buy_target_limit_multiplier,
			        CASE WHEN p.store_size=1 THEN NULL ELSE 2 END) END pol_buy_target_limit_multiplier,
			   CASE WHEN l.store_id IN (2001, 2003, 2013) THEN 'MOUNTAIN'
               WHEN l.store_id IN (2128, 2108, 2117) THEN 'WEST'
               WHEN l.store_id IN (2014, 2015, 2018, 2095, 2016) THEN 'CENTRAL'
               WHEN l.store_id IN (2017, 2098, 2096, 2109, 2125, 2126) THEN 'EAST'
               ELSE NULL END AS zone_name
         FROM [D1-DASQL-01,11010].DA_Group.src.LkpStoreRegionDma l WITH (NOLOCK)
         LEFT JOIN [D1-DASQL-01,11010].DA_Group.src.da_store_params p WITH (NOLOCK) on l.store_id=p.store_id
         WHERE l.pricing_cd <>'NA' OR l.region_name in ('NWMS', 'eCarOne')


```

## Governance

- **Last Extracted**: 2026-05-12T20:14:33.860Z
- **Data Classification**: To be assigned
- **Stewardship**: To be assigned
