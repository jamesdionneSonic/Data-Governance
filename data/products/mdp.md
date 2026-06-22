---
name: MDP
product_id: product-mdp
version: 1.0.0
status: published
domain: Master Data and Identity Resolution
owner: Data Engineering
steward: Data Engineering
assets:
  - L1-5FSQL-01.ETL_Staging.mdm.SonicCustAll_Ver2
  - L1-5FSQL-01.Sonic_DW.mdm.SonicCustAll_Ver2
  - L1-5FSQL-01.ETL_Staging.wrk.MDM_CRM_SR_Keys
  - L1-5FSQL-01.ETL_Staging.wrk.MDM_EPCRM_SR_Keys
  - L1-5FSQL-01.ETL_Staging.stage.DMSeLeadOrgIDxref_MDP
  - L1-5FSQL-01.ETL_Staging.stage.OrganizationXrefOutput_MDP
  - L1-5FSQL-01.ETL_Staging.wrk.MDM_ADP_SR_Keys
  - L1-5FSQL-01.ETL_Staging.wrk.MDM_eLead_SR_Keys
  - L1-DWASQL-02,12010.StagingDB.mdp.DMSOrgIDxref
  - L1-DWASQL-02,12010.StagingDB.mdp.DMSOrgIDxref_BKP_20260417
  - L1-DWASQL-02,12010.StagingDB.mdp.DMSOrgIDxref_uat
  - L1-DWASQL-02,12010.StagingDB.mdp.eleadOrgIDxref
  - L1-DWASQL-02,12010.StagingDB.mdp.eleadOrgIDxref_UAT
  - L1-5FSQL-01.ETL_Staging.stage.DMSCoraAcctIDxref_MDP
  - L1-DWASQL-02,12010.StagingDB.dbo.MDPCustomerIDS
sla: {}
tags:
  - mdp
  - mdm
  - xref
  - identity-resolution
certified: false
certified_by: null
certification_date: null
trust_level: lineage-documented
consumers:
  - Master data support
  - Customer/entity matching
  - Cross-system reporting
output_port:
  type: lineage-documented asset bundle
  location: ETL_Staging, StagingDB, Sonic_DW
  format: SQL Server / SSIS metadata
created_at: 2026-06-17
last_updated: 2026-06-17
---

# MDP

## Plain-English Summary

MDP is modeled as master-data / identity-resolution support for organization, DMS, CRM, eLead, and customer identifier crosswalks. Current lineage evidence is object-level rather than a dedicated SSIS folder.

If MDP-related crosswalks are stale, downstream joins between DMS, CRM, eLead, customer, and organization identifiers may become unreliable.

## Product Domain

| Field                     | Value                               |
| ------------------------- | ----------------------------------- |
| Product                   | MDP                                 |
| Domain                    | Master Data and Identity Resolution |
| Evidence strength         | Moderate catalog evidence           |
| Catalog objects matched   | 15                                  |
| SSIS packages matched     | 0                                   |
| Runtime package version   | 2026.6.13-1                         |
| Runtime package generated | 2026-06-13T23:31:32.400Z            |

## What This Product Appears To Do

MDP is modeled as master-data / identity-resolution support for organization, DMS, CRM, eLead, and customer identifier crosswalks. Current lineage evidence is object-level rather than a dedicated SSIS folder.

For support and upgrade planning, treat this product as a bundle of warehouse tables/views/procedures, SSIS packages, and external-feed artifacts rather than a single table. The highest-impact assets below are prioritized by lineage connectivity and available column metadata.

## Lineage Scope

### Object Types

| Type  | Count |
| ----- | ----- |
| table | 15    |

### Main Databases

| Database    | Matched Objects |
| ----------- | --------------- |
| ETL_Staging | 8               |
| StagingDB   | 6               |
| Sonic_DW    | 1               |

### SSIS Folders

_No lineage evidence found in the current package._

### Folder Catalog Matches

_No lineage evidence found in the current package._

## Important Assets To Start With

| Asset                                                        | Type  | Upstream | Downstream | Columns | Confidence |
| ------------------------------------------------------------ | ----- | -------- | ---------- | ------- | ---------- |
| `L1-5FSQL-01.ETL_Staging.mdm.SonicCustAll_Ver2`              | table | 0        | 0          | 307     | medium     |
| `L1-5FSQL-01.Sonic_DW.mdm.SonicCustAll_Ver2`                 | table | 0        | 0          | 24      | medium     |
| `L1-5FSQL-01.ETL_Staging.wrk.MDM_CRM_SR_Keys`                | table | 0        | 0          | 17      | medium     |
| `L1-5FSQL-01.ETL_Staging.wrk.MDM_EPCRM_SR_Keys`              | table | 0        | 0          | 17      | medium     |
| `L1-5FSQL-01.ETL_Staging.stage.DMSeLeadOrgIDxref_MDP`        | table | 0        | 0          | 14      | medium     |
| `L1-5FSQL-01.ETL_Staging.stage.OrganizationXrefOutput_MDP`   | table | 0        | 0          | 14      | medium     |
| `L1-5FSQL-01.ETL_Staging.wrk.MDM_ADP_SR_Keys`                | table | 0        | 0          | 13      | medium     |
| `L1-5FSQL-01.ETL_Staging.wrk.MDM_eLead_SR_Keys`              | table | 0        | 0          | 13      | medium     |
| `L1-DWASQL-02,12010.StagingDB.mdp.DMSOrgIDxref`              | table | 0        | 0          | 9       | medium     |
| `L1-DWASQL-02,12010.StagingDB.mdp.DMSOrgIDxref_BKP_20260417` | table | 0        | 0          | 9       | medium     |
| `L1-DWASQL-02,12010.StagingDB.mdp.DMSOrgIDxref_uat`          | table | 0        | 0          | 9       | medium     |
| `L1-DWASQL-02,12010.StagingDB.mdp.eleadOrgIDxref`            | table | 0        | 0          | 9       | medium     |
| `L1-DWASQL-02,12010.StagingDB.mdp.eleadOrgIDxref_UAT`        | table | 0        | 0          | 9       | medium     |
| `L1-5FSQL-01.ETL_Staging.stage.DMSCoraAcctIDxref_MDP`        | table | 0        | 0          | 5       | medium     |
| `L1-DWASQL-02,12010.StagingDB.dbo.MDPCustomerIDS`            | table | 0        | 0          | 1       | medium     |

## SSIS / Orchestration Evidence

_No lineage evidence found in the current package._

## Consumers And Support Impact

- Master data support
- Customer/entity matching
- Cross-system reporting

## Known Gaps / Caveats

- The current package does not expose a dedicated MDP SSIS folder; evidence is based on MDP/MDM object names and crosswalk tables.

## Evidence

- Runtime package: `sonic-data-lineage-runtime` version `2026.6.13-1`, hash `514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff`
- Registry: `registry/canonical-objects.jsonl`
- SSIS folder index: `ssis/README.md`
- Generated from local lineage package on 2026-06-17
