# Production ADF Factory Access Inventory

Generated: 2026-06-26

Scope:

- Subscription: `bee9b611-da99-4cfc-9fb7-50f1359e5ca2`
- Tenant: `b7944855-1c04-4fee-8f07-749ae6f28735`
- Excluded by request: VDM factories and SAEDP factories
- Method: read-only Azure Management API checks using delegated `azure_cli`

This inventory proves the current Azure identity can enumerate the listed
factory resources and read pipeline/trigger metadata. It does not authorize
starting pipelines. Operational starts still follow
`docs/ADF_PIPELINE_OPERATIONS.md`.

## Readable Factories

| Factory                   | Connector id                                 | Resource group                | Pipelines visible | Triggers visible | Active triggers                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------- | -------------------------------------------- | ----------------------------- | ----------------: | ---------------: | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `adf-Admin-D1`            | `azure-data-factory-adf-admin-d1`            | `rg-data-warehouse-prod`      |                 0 |                0 | None                                                                                                                                                                                                                                                                                                                                                                                              |
| `adf-dw-caroffer-prod`    | `azure-data-factory-adf-dw-caroffer-prod`    | `rg-data-warehouse-prod`      |                 0 |                0 | None                                                                                                                                                                                                                                                                                                                                                                                              |
| `adf-dw-lightspeed-prod`  | `azure-data-factory-adf-dw-lightspeed-prod`  | `rg-data-warehouse-prod`      |                 0 |                0 | None                                                                                                                                                                                                                                                                                                                                                                                              |
| `adf-dw-marketing-prod`   | `azure-data-factory-adf-dw-marketing-prod`   | `rg-data-warehouse-prod`      |                16 |                2 | `trigger_dailyload`, `trigger_sunday`                                                                                                                                                                                                                                                                                                                                                             |
| `adf-dw-postgres-prod`    | `azure-data-factory-adf-dw-postgres-prod`    | `rg-data-warehouse-prod`      |                 1 |                0 | Inventory-only; no usable deterministic lineage edges                                                                                                                                                                                                                                                                                                                                             |
| `adf-eLead-D1`            | `azure-data-factory-adf-elead-d1`            | `rg-data-warehouse-prod`      |                23 |                7 | `Elead_StoreRegionMapping`, `Elead_Data_Validation`, `Elead_Daily`, `Elead_Mkt_Campaign_Monthly`, `Elead_Copy_Files_To_Amplify`                                                                                                                                                                                                                                                                   |
| `adf-FacebookAds-D1`      | `azure-data-factory-adf-facebookads-d1`      | `rg-data-warehouse-prod`      |                10 |                4 | `FacebookAdsDaily`, `FacebookAdsMonthly`                                                                                                                                                                                                                                                                                                                                                          |
| `adf-GAnalytics-D1`       | `azure-data-factory-adf-ganalytics-d1`       | `rg-data-warehouse-prod`      |                 8 |                4 | `TGR_LoadViewsToTables_Daily`, `copyDimEntityTables`, `TGR_LoadViewsToTables_FirstRun_Daily`, `TGR_LoadViewsToTables_LastRun_Daily`                                                                                                                                                                                                                                                               |
| `adf-GoogleSearch-D1`     | `azure-data-factory-adf-googlesearch-d1`     | `rg-data-warehouse-prod`      |                 7 |                2 | None; documented as legacy                                                                                                                                                                                                                                                                                                                                                                        |
| `ADF-InboundDataETL-Prod` | `azure-data-factory-adf-inbounddataetl-prod` | `RG-InboundDataServices-Prod` |                50 |               10 | `trGoogleAdsDataLoad`, `trGoogleAdsDataLoadConversion`, `IBEXMaster`, `LoadEstimatedSpend_MktBudget`, `Tr_xTime_Monthly`                                                                                                                                                                                                                                                                          |
| `adf-MCI-D1`              | `azure-data-factory-adf-mci-d1`              | `rg-data-warehouse-prod`      |                18 |                4 | `Tr_LeadSale_Daily`, `Tr_CallSource_Daily`, `Tr_CarGurusDaily`, `Tr_Acquisition_Daily`                                                                                                                                                                                                                                                                                                            |
| `adf-PriceFx-D1`          | `azure-data-factory-adf-pricefx-d1`          | `rg-data-warehouse-prod`      |                50 |               17 | `Tr_Elead_Daily`, `Tr_SalesTransactions_Daily`, `Tr_VDP_Daily`, `Tr_CarGurus_Daily`, `Tr_MarketDetails_Daily`, `Tr_VehicleDetails_Daily`, `Store_Details_Daily`, `Tr_AggregationFields`, `EP_Sales_Tracker_Daily`, `Tr_Inventory_Details_Accounting_Daily`, `Tr_Inv_FMV_Daily`, `Tr_DMACluster`, `Tr_ChromeException`, `Tr_DecodeMapping`, `Tr_AuctionData`, `Tr_Inventory`, `Tr_Lag_Data_Weekly` |
| `adf-ReconPro-D1`         | `azure-data-factory-adf-reconpro-d1`         | `rg-data-warehouse-prod`      |                21 |                3 | `TRG_StoreLocationHours`, `TRG_ReconPro`                                                                                                                                                                                                                                                                                                                                                          |
| `adf-ReputationMgmt-D1`   | `azure-data-factory-adf-reputationmgmt-d1`   | `rg-data-warehouse-prod`      |                 8 |                2 | `RMLoadDaily`                                                                                                                                                                                                                                                                                                                                                                                     |
| `ADF-VehicleMart-Prod`    | `azure-data-factory-adf-vehiclemart-prod`    | `RG-VehicleMart-Prod`         |                16 |                7 | None                                                                                                                                                                                                                                                                                                                                                                                              |
| `adf-XTime-D1`            | `azure-data-factory-adf-xtime-d1`            | `rg-data-warehouse-prod`      |                 2 |                1 | None; documented as legacy                                                                                                                                                                                                                                                                                                                                                                        |

## Excluded Factories

These were visible at the resource level but intentionally excluded from this
connector registration pass:

- `adf-vdm-production`
- `adf-vdm-prod-001`
- `adf-saedp-prod-002`

## Notes

- `adf-Admin-D1`, `adf-dw-caroffer-prod`, and `adf-dw-lightspeed-prod` were
  readable but currently returned zero pipelines and zero triggers.
- `adf-dw-postgres-prod` is readable and surfaced one pipeline-like object in
  the final profile, but no tasks, datasets, connections, schedules, or
  deterministic lineage edges. It is closed as inventory/support context only.
- `adf-GoogleSearch-D1` and `adf-XTime-D1` are documented as legacy ADFs in
  `docs/ADF_LEGACY_FACTORY_INVENTORY.md`.
- A factory with active triggers should be treated as production-operational.
  Do not start or alter those triggers from Codex without an approved operation
  packet and explicit user approval.
- Permanent saved connectors are registered by
  `scripts/register-production-adf-connectors.mjs`.
- Multi-factory ingestion, lineage extraction, DevOps packaging, Confluence
  publication, and support documentation work is complete in
  `docs/ADF_MULTI_FACTORY_INGESTION_BACKLOG.md`.
