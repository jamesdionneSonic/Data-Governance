# adf-pricefx-d1

Generated: 2026-06-29T10:58:59.460Z
Saved connector: `azure-data-factory-adf-pricefx-d1`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`

## Plain-English Summary

adf-pricefx-d1 is an Azure Data Factory captured by the saved connector runtime. It contains 98 pipeline(s), 17 trigger(s), 64 dataset(s), and 19 linked-service connection record(s). If adf-pricefx-d1 fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking active triggers, then the latest root or orchestrator pipeline run.

## At a Glance

| Field                 | Value                                                                                                                                                                                                                                                                                                                                                           |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                                                                                                                                                                                             |
| Asset type            | Factory                                                                                                                                                                                                                                                                                                                                                         |
| Native path           | `adf-pricefx-d1`                                                                                                                                                                                                                                                                                                                                                |
| Support role          | Factory / support section root                                                                                                                                                                                                                                                                                                                                  |
| Business process      | adf-pricefx-d1 ADF data movement and orchestration                                                                                                                                                                                                                                                                                                              |
| Primary source        | DS_SQL_DAGroup, DS_SQL_vehiclemart, DS_SQL_SSIS, DS_SFTP_US_EAST_1, ds_child_process_params                                                                                                                                                                                                                                                                     |
| Primary target/output | not fully surfaced in metadata; inspect pipeline pages                                                                                                                                                                                                                                                                                                          |
| Schedule or trigger   | Tr_Elead_Daily, Tr_SalesTransactions_Daily, Tr_VDP_Daily, Tr_CarGurus_Daily, Tr_MarketDetails_Daily, Tr_VehicleDetails_Daily, Store_Details_Daily, Tr_AggregationFields, EP_Sales_Tracker_Daily, Tr_Inventory_Details_Accounting_Daily, Tr_Inv_FMV_Daily, Tr_DMACluster, Tr_ChromeException, Tr_DecodeMapping, Tr_AuctionData, Tr_Inventory, Tr_Lag_Data_Weekly |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:49:10.426Z                                                                                                                                                                                                                                                                                                                   |
| Status signal         | active trigger surfaced                                                                                                                                                                                                                                                                                                                                         |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-pricefx-d1/2026-06-29T10-49-10-481Z-ea190808-2542-4272-b648-bcc818870f5e.json`                                                                                                                                                                                                                      |

## Business Use

Use this page as the support entry point for adf-pricefx-d1. Pipeline pages below explain orchestrators, child loads, source/target datasets, linked service boundaries, and concrete first checks.

## Support Checks

1. Confirm whether an active trigger should have started the pipeline.
2. Check the latest parent or orchestrator pipeline run.
3. Identify the first failed activity or child pipeline.
4. Confirm source datasets, target datasets, and linked-service availability.
5. Do not change triggers, schedules, retries, linked services, or credentials from documentation work.

## Lineage And Dependencies

| Asset type      | Count |
| --------------- | ----: |
| Pipelines       |    98 |
| Triggers        |    17 |
| Datasets        |    64 |
| Linked services |    19 |
| Lineage edges   |  1767 |

## Runtime Or Usage Signals

The support cache uses a bounded metadata-profile lookback. It is not a live monitor. Check ADF directly before operational reruns.

## Technical Details

| Pipeline                                       | Folder                               | Activities | Child pipelines                                                                   |
| ---------------------------------------------- | ------------------------------------ | ---------: | --------------------------------------------------------------------------------- |
| Close out master Pipeline                      | root                                 |          0 | none                                                                              |
| Close out master Pipeline                      | root                                 |          0 | none                                                                              |
| Close out master Pipeline                      | root                                 |          0 | none                                                                              |
| Close out master Pipeline                      | root                                 |          0 | none                                                                              |
| Close out master Pipeline                      | root                                 |          0 | none                                                                              |
| Close out master pipeline process              | root                                 |          0 | none                                                                              |
| Close out master pipeline process              | root                                 |          0 | none                                                                              |
| Close out master pipeline process              | root                                 |          0 | none                                                                              |
| Close out master pipeline process              | root                                 |          0 | none                                                                              |
| Close out master pipeline process              | root                                 |          0 | none                                                                              |
| Close out master pipeline process              | root                                 |          0 | none                                                                              |
| Close out master pipeline process              | root                                 |          0 | none                                                                              |
| Close out master pipeline process              | root                                 |          0 | none                                                                              |
| Close out master pipeline process              | root                                 |          0 | none                                                                              |
| Close out master pipeline process              | root                                 |          0 | none                                                                              |
| Close out master pipeline process              | root                                 |          0 | none                                                                              |
| Close out master pipeline process              | root                                 |          0 | none                                                                              |
| Close out master pipeline process              | root                                 |          0 | none                                                                              |
| Close out master pipeline process              | root                                 |          0 | none                                                                              |
| cp_pricefx_vehicle_details_DAGroup             | root                                 |          0 | none                                                                              |
| Ep_Sales_PriceFxDB                             | PriceFx/Sales_Tracker                |         11 | none                                                                              |
| Ep_salesTracker_Master                         | PriceFx/Sales_Tracker                |         11 | Ep_Sales_PriceFxDB, Ep_salesTracker_PriceFx                                       |
| Ep_salesTracker_PriceFx                        | PriceFx/Sales_Tracker                |          8 | none                                                                              |
| Execute Pipeline                               | root                                 |          0 | none                                                                              |
| Inventory_FMV_Master                           | PriceFx/Inventory_FMV                |         11 | Inventory_FMV_PriceFxDB, Inventory_FMV_PriceFx                                    |
| Inventory_FMV_PriceFx                          | PriceFx/Inventory_FMV                |         10 | none                                                                              |
| Inventory_FMV_PriceFxDB                        | PriceFx/Inventory_FMV                |         10 | none                                                                              |
| PL_AggregationFields_Getdata                   | PriceFx/AggregationFields            |         10 | none                                                                              |
| PL_AggregationFields_Senddata                  | PriceFx/AggregationFields            |          9 | none                                                                              |
| PL_AuctionData_Getdata                         | PriceFx/AuctionData                  |         22 | none                                                                              |
| PL_AuctionData_Senddata                        | PriceFx/AuctionData                  |          8 | none                                                                              |
| PL_CarGurus_Getdata                            | PriceFx/CarGurus                     |         13 | none                                                                              |
| PL_CarGurus_Senddata                           | PriceFx/CarGurus                     |          7 | none                                                                              |
| PL_ChromeException_Getdata                     | PriceFx/ChromeException              |         10 | none                                                                              |
| PL_ChromeException_Senddata                    | PriceFx/ChromeException              |          9 | none                                                                              |
| PL_DecodeMapping_Getdata                       | PriceFx/DecodeMapping                |         10 | none                                                                              |
| PL_DecodeMapping_Senddata                      | PriceFx/DecodeMapping                |          9 | none                                                                              |
| PL_DMACluster_Getdata                          | PriceFx/DMACluster                   |         10 | none                                                                              |
| PL_DMACluster_Senddata                         | PriceFx/DMACluster                   |          9 | none                                                                              |
| PL_ELead_Appointment_Activities_Getdata        | PriceFx/ELead                        |         13 | none                                                                              |
| PL_ELead_Appointment_Activities_Senddata       | PriceFx/ELead                        |          7 | none                                                                              |
| PL_ELead_Opportunity_Getdata                   | PriceFx/ELead                        |         13 | none                                                                              |
| PL_ELead_Opportunity_Senddata                  | PriceFx/ELead                        |          9 | none                                                                              |
| PL_ELead_Vehicle_Getdata                       | PriceFx/ELead                        |         13 | none                                                                              |
| PL_ELead_Vehicle_Senddata                      | PriceFx/ELead                        |          9 | none                                                                              |
| PL_Inventory_Details_Accounting_Getdata        | PriceFx/Inventory_Details_Accounting |         23 | none                                                                              |
| PL_Inventory_Details_Accounting_Master         | PriceFx/Inventory_Details_Accounting |         11 | PL_Inventory_Details_Accounting_Getdata, PL_Inventory_Details_Accounting_Senddata |
| PL_Inventory_Details_Accounting_Senddata       | PriceFx/Inventory_Details_Accounting |          9 | none                                                                              |
| PL_Inventory_Equipment_Options_Getdata         | PriceFx/Inventory_Equipment_Options  |         22 | none                                                                              |
| PL_Inventory_Equipment_Options_Master          | PriceFx/Inventory_Equipment_Options  |         11 | PL_Inventory_Equipment_Options_Getdata, PL_Inventory_Equipment_Options_Senddata   |
| PL_Inventory_Equipment_Options_Senddata        | PriceFx/Inventory_Equipment_Options  |          9 | none                                                                              |
| PL_MarketDetails_Getdata                       | PriceFx/MarketDetails                |         14 | none                                                                              |
| PL_MarketDetails_Senddata                      | PriceFx/MarketDetails                |         10 | none                                                                              |
| PL_PriceFx_AggregationFields_Master            | PriceFx/AggregationFields            |         11 | PL_AggregationFields_Getdata, PL_AggregationFields_Senddata                       |
| PL_PriceFx_AuctionData_Master                  | PriceFx/AuctionData                  |         11 | PL_AuctionData_Getdata, PL_AuctionData_Senddata                                   |
| PL_PriceFx_CarGurus_Master                     | PriceFx/CarGurus                     |         11 | PL_CarGurus_Getdata, PL_CarGurus_Senddata                                         |
| PL_PriceFx_ChromeException_Master              | PriceFx/ChromeException              |         11 | PL_ChromeException_Getdata, PL_ChromeException_Senddata                           |
| PL_PriceFx_DecodeMapping_Master                | PriceFx/DecodeMapping                |         11 | PL_DecodeMapping_Getdata, PL_DecodeMapping_Senddata                               |
| PL_PriceFx_DMACluster_Master                   | PriceFx/DMACluster                   |         11 | PL_DMACluster_Getdata, PL_DMACluster_Senddata                                     |
| PL_PriceFx_ELead_Appointment_Activities_Master | PriceFx/ELead                        |         11 | PL_ELead_Appointment_Activities_Getdata, PL_ELead_Appointment_Activities_Senddata |
| PL_PriceFx_ELead_Opportunity_Master            | PriceFx/ELead                        |         11 | PL_ELead_Opportunity_Getdata, PL_ELead_Opportunity_Senddata                       |
| PL_PriceFx_ELead_Vehicle_Master                | PriceFx/ELead                        |         11 | PL_ELead_Vehicle_Getdata, PL_ELead_Vehicle_Senddata                               |
| PL_PriceFx_LagData_Master                      | PriceFx/LagData                      |         14 | none                                                                              |
| PL_PriceFx_LagData_Weekly_Check                | PriceFx/LagData                      |          8 | none                                                                              |
| PL_PriceFx_MarketDetails_Master                | PriceFx/MarketDetails                |         11 | PL_MarketDetails_Getdata, PL_MarketDetails_Senddata                               |
| PL_PriceFx_SalesTransactions_Master            | PriceFx/SalesTransactions            |         11 | PL_SalesTransactions_Getdata, PL_SalesTransactions_Senddata                       |
| PL_PriceFx_VDP_Master                          | PriceFx/VDP                          |         11 | PL_VDP_Getdata, PL_VDP_Senddata                                                   |
| PL_SalesTransactions_Getdata                   | PriceFx/SalesTransactions            |         14 | none                                                                              |
| PL_SalesTransactions_Senddata                  | PriceFx/SalesTransactions            |          8 | none                                                                              |
| PL_VDP_Getdata                                 | PriceFx/VDP                          |         12 | none                                                                              |
| PL_VDP_Senddata                                | PriceFx/VDP                          |          7 | none                                                                              |
| PL_VehicleDetails_GetData                      | PriceFx/VehicleDetails               |         27 | none                                                                              |
| PL_VehicleDetails_Master                       | PriceFx/VehicleDetails               |         11 | PL_VehicleDetails_GetData, PL_VehicleDetails_SendFile                             |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Set Master Pipeline Metrics                    | root                                 |          0 | none                                                                              |
| Store_Details_PriceFx                          | PriceFx/Store_details                |          8 | none                                                                              |
| Store_Details_PriceFxDB                        | PriceFx/Store_details                |         19 | none                                                                              |
| Store_master                                   | PriceFx/Store_details                |         11 | Store_Details_PriceFxDB, Store_Details_PriceFx                                    |
| update failure information DAGrp Params        | root                                 |          0 | none                                                                              |
| update failure information DAGrp Vw            | root                                 |          0 | none                                                                              |
| update failure information tmp_dagrp           | root                                 |          0 | none                                                                              |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Raw activity output, sample rows, secrets, tokens, and connection strings are not published.
- Missing facts are marked as not surfaced in metadata.
