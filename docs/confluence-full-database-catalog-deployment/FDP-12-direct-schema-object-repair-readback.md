# Direct Schema Object Repair Readback

Generated: 2026-06-29T01:37:16.715Z

Repair mode: `archive stale direct schema object children`

## Summary

| Signal                        | Value |
| ----------------------------- | ----: |
| Failures reviewed             |   203 |
| Direct pages reviewed         |   203 |
| Canonical replacements found  |    35 |
| Excluded retired tables found |     0 |
| Eligible for archive          |    35 |
| Archived                      |    35 |
| Eligible for move             |   168 |
| Moved                         |   168 |
| Skipped                       |     0 |
| Skipped for live risk         |     0 |

## Candidate Readback

| Page                                                | Page ID      | Action                   | Reason |
| --------------------------------------------------- | ------------ | ------------------------ | ------ |
| `CBS.dbo.DealerDMSMapping`                          | `2302282277` | moved                    | none   |
| `CBS.dbo.ManheimPurchaseLog`                        | `2303853790` | moved                    | none   |
| `DA_SIMS_EP.dbo.Price_Recommendations_DuplicateRpt` | `2302774521` | moved                    | none   |
| `DA_SIMS_EP.dbo.VW_AT_DMA_TO_DMA_DIST`              | `2302676844` | created-bucket-and-moved | none   |
| `DMS.dbo.appointments`                              | `2303624490` | archived                 | none   |
| `DMS.dbo.dm_cora_account`                           | `2302543651` | archived                 | none   |
| `DMS.dbo.gldept`                                    | `2303035113` | archived                 | none   |
| `DMS.dbo.gljedetail_cur`                            | `2303853660` | archived                 | none   |
| `DMS.dbo.glschedule`                                | `2301724446` | archived                 | none   |
| `DMS.dbo.glschedulesetupreload`                     | `2303722764` | archived                 | none   |
| `DMS.dbo.labortype`                                 | `2302543675` | archived                 | none   |
| `DMS.dbo.manufacturer`                              | `2303035137` | archived                 | none   |
| `DMS.dbo.opcodes`                                   | `2302576972` | archived                 | none   |
| `DMS.dbo.orgname`                                   | `2303591736` | archived                 | none   |
| `DMS.dbo.partssales`                                | `2303265045` | archived                 | none   |
| `DMS.dbo.servicesalesclosed`                        | `2302838474` | archived                 | none   |
| `DMS.dbo.servicesalesopen`                          | `2302675174` | archived                 | none   |
| `DMS.dbo.servicesalespartsclosed`                   | `2302019662` | archived                 | none   |
| `DMS.dbo.ServiceVins_Staging`                       | `2302576996` | archived                 | none   |
| `DMS.dbo.stg_WeOwe`                                 | `2302314485` | archived                 | none   |
| `DMS.dbo.tblperformance`                            | `2303591760` | archived                 | none   |
| `DMS.dbo.tblstatus`                                 | `2303722788` | archived                 | none   |
| `DMS.dbo.technician`                                | `2302052171` | archived                 | none   |
| `DMS.dbo.vehicle`                                   | `2303297440` | archived                 | none   |
| `DMS.dbo.vehiclesalescurrent`                       | `2302543699` | archived                 | none   |
| `DMS.dbo.vsc_fiproducts_union_stage`                | `2302577020` | archived                 | none   |
| `DMS.dbo.vw_Dim_DMSCstImport_update_Inc`            | `2302543723` | archived                 | none   |
| `DMS.dbo.vw_Dim_Inventory_Vehicle_Staging`          | `2303591784` | archived                 | none   |
| `DMS.dbo.vw_Dim_Sales_Vehicle_Staging_hist`         | `2302019686` | archived                 | none   |
| `DMS.dbo.vw_Dim_Service_Vehicle_Staging_hist`       | `2302282085` | archived                 | none   |
| `DMS.dbo.vw_DMSVendor_Import`                       | `2303722812` | archived                 | none   |
| `DMS.dbo.vw_Essbase_HR_OT_Stage`                    | `2302838498` | moved                    | none   |
| `DMS.dbo.vw_FactService_staging`                    | `2302019710` | archived                 | none   |
| `DMS.dbo.vw_Fuel_II_glaccountledger_INC`            | `2303853684` | archived                 | none   |
| `DMS.dbo.vw_GPA_RateCap_SRC`                        | `2302838522` | moved                    | none   |
| `DMS.dbo.vw_PricingGrid_staging`                    | `2302577044` | archived                 | none   |
| `DMS.dbo.vw_vsc_All`                                | `2303265069` | archived                 | none   |
| `DMS.dbo.vw_vsc_fiproducts_union`                   | `2302772936` | archived                 | none   |
| `DMS.dbo.vw_vscLender`                              | `2302772960` | archived                 | none   |
| `DMS.dbo.vwFireSummaryVSC`                          | `2302314509` | archived                 | none   |
| `DMS.dbo.vwFloorPlanDetailACV`                      | `2302052195` | moved                    | none   |
| `DMS.dbo.vwTitleTrackingVSC`                        | `2302772984` | archived                 | none   |
| `echoparkwebv_veh.dbo.mps_decode_vehtype`           | `2303689970` | moved                    | none   |
| `echoparkwebv_veh.dbo.mps_decode_vinattribute`      | `2303035209` | moved                    | none   |
| `echoparkwebv_veh.dbo.mps_decode_vinbody`           | `2302314686` | moved                    | none   |
| `echoparkwebv_veh.dbo.mps_decode_vinbody_stage`     | `2303363255` | moved                    | none   |
| `echoparkwebv_veh.dbo.mps_decode_vinmake`           | `2303755873` | moved                    | none   |
| `echoparkwebv_veh.dbo.mps_decode_vinmfr`            | `2303591873` | moved                    | none   |
| `echoparkwebv_veh.dbo.mps_decode_vinmodel`          | `2303265172` | moved                    | none   |
| `echoparkwebv_veh.dbo.mps_decode_vintrim`           | `2303624649` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_acquired_by`              | `2302707300` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_exterior_color`           | `2303689994` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_fuel_type`                | `2302577147` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_interior_color`           | `2303690018` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_inventory`                | `2302543915` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_inventory_option`         | `2303755897` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_loc_account`              | `2302773104` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_loc_make`                 | `2303297561` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_loc_model`                | `2303690042` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_loc_model_number`         | `2303265196` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_loc_series`               | `2302019878` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_option`                   | `2303755921` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_order`                    | `2303363279` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_order_addtl_invoice_item` | `2303722887` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_order_dealer_add`         | `2303690066` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_order_option`             | `2303297585` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_process_code`             | `2302019902` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_source`                   | `2302052243` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_trim`                     | `2301954175` | moved                    | none   |
| `echoparkwebv_veh.dbo.veh_vehicle`                  | `2302773128` | moved                    | none   |
| `eRIMS.dbo.CRM_Customer`                            | `2303036412` | moved                    | none   |
| `eRIMS.dbo.Premises_Loss_Claims`                    | `2303625912` | moved                    | none   |
| `ETL_Staging.dbo.COA_Dept`                          | `2303362199` | moved                    | none   |
| `ETL_Staging.dbo.tblQuartile_Staging`               | `2303820078` | moved                    | none   |
| `ETL_Staging.dbo.GPA_TheNetworkCallEntitySource`    | `2303034309` | moved                    | none   |
| `ETL_Staging.wrk.TrueCarSalesData_1`                | `2302706974` | moved                    | none   |
| `ETL_Staging.wrk.DMS_JounalImport_csv`              | `2302281828` | moved                    | none   |
| `ETL_Staging.wrk.Excel_DimJournal_Staging`          | `2302707053` | moved                    | none   |
| `SIMS6200_EP.dbo.ADP_DEALERSHIP_MAPPING`            | `2302773008` | moved                    | none   |
| `SIMS6200_EP.dbo.Appraisal`                         | `2303624522` | moved                    | none   |
| `SIMS6200_EP.dbo.Book`                              | `2302773032` | moved                    | none   |
| `SIMS6200_EP.dbo.Book_Value_Request`                | `2303035161` | moved                    | none   |
| `SIMS6200_EP.dbo.Book_Value_Response`               | `2303363152` | moved                    | none   |
| `SIMS6200_EP.dbo.Customer`                          | `2301724477` | moved                    | none   |
| `SIMS6200_EP.dbo.EXTERNAL_REPORT_ICON`              | `2302314533` | moved                    | none   |
| `SIMS6200_EP.dbo.External_Vehicle_Data`             | `2301724501` | moved                    | none   |
| `SIMS6200_EP.dbo.Factory_Options`                   | `2302282109` | moved                    | none   |
| `SIMS6200_EP.dbo.Organization`                      | `2302577068` | moved                    | none   |
| `SIMS6200_EP.dbo.Organization_Address`              | `2303297464` | moved                    | none   |
| `SIMS6200_EP.dbo.Organization_Association`          | `2303624546` | moved                    | none   |
| `SIMS6200_EP.dbo.PhotoImport_VehicleUrls`           | `2302019734` | moved                    | none   |
| `SIMS6200_EP.dbo.Sonic_Appraisal_Center`            | `2302543747` | moved                    | none   |
| `SIMS6200_EP.dbo.STATUS`                            | `2302314557` | moved                    | none   |
| `SIMS6200_EP.dbo.Status_Cat`                        | `2303755777` | moved                    | none   |
| `SIMS6200_EP.dbo.Status_Rollup`                     | `2302019758` | moved                    | none   |
| `SIMS6200_EP.dbo.TitleStatus`                       | `2303755801` | moved                    | none   |
| `SIMS6200_EP.dbo.TitleStatus_staging`               | `2303722861` | moved                    | none   |
| `SIMS6200_EP.dbo.Vehicle`                           | `2303624570` | moved                    | none   |
| `SIMS6200_EP.dbo.Vehicle_Inventory`                 | `2302314581` | moved                    | none   |
| `SIMS6200_EP.dbo.Vehicle_Pricing`                   | `2303363176` | moved                    | none   |
| `SIMS6200_EP.dbo.Vehicle_Source`                    | `2303689891` | moved                    | none   |
| `SIMS6200_EP.dbo.Vehicle_Status_Log`                | `2302019782` | moved                    | none   |
| `SIMS6200_EP.dbo.VW_Vehicle_Inventory`              | `2301724525` | created-bucket-and-moved | none   |
| `SIMS6200Retail.dbo.ADP_DEALERSHIP_MAPPING`         | `2303624208` | moved                    | none   |
| `SIMS6200Retail.dbo.Appraisal`                      | `2303264388` | moved                    | none   |
| `SIMS6200Retail.dbo.Book`                           | `2301953703` | moved                    | none   |
| `SIMS6200Retail.dbo.Book_Value_Request`             | `2302543219` | moved                    | none   |
| `SIMS6200Retail.dbo.Book_Value_Response`            | `2302150466` | moved                    | none   |
| `SIMS6200Retail.dbo.Customer`                       | `2301953727` | moved                    | none   |
| `SIMS6200Retail.dbo.EXTERNAL_REPORT_ICON`           | `2303264412` | moved                    | none   |
| `SIMS6200Retail.dbo.External_Vehicle_Data`          | `2303034753` | moved                    | none   |
| `SIMS6200Retail.dbo.Factory_Options`                | `2303591295` | moved                    | none   |
| `SIMS6200Retail.dbo.FireDealData_New`               | `2303264436` | moved                    | none   |
| `SIMS6200Retail.dbo.FIREDealData_New_STG`           | `2303689423` | moved                    | none   |
| `SIMS6200Retail.dbo.Organization`                   | `2302281588` | moved                    | none   |
| `SIMS6200Retail.dbo.Organization_Address`           | `2303755331` | moved                    | none   |
| `SIMS6200Retail.dbo.Organization_Association`       | `2302838043` | moved                    | none   |
| `SIMS6200Retail.dbo.PhotoImport_VehicleUrls`        | `2302772757` | moved                    | none   |
| `SIMS6200Retail.dbo.Sonic_Appraisal_Center`         | `2302674690` | moved                    | none   |
| `SIMS6200Retail.dbo.STATUS`                         | `2303624232` | moved                    | none   |
| `SIMS6200Retail.dbo.Status_Cat`                     | `2303755355` | moved                    | none   |
| `SIMS6200Retail.dbo.Status_Rollup`                  | `2301724031` | moved                    | none   |
| `SIMS6200Retail.dbo.TitleStatus`                    | `2303264460` | moved                    | none   |
| `SIMS6200Retail.dbo.TitleStatus_staging`            | `2303264484` | moved                    | none   |
| `SIMS6200Retail.dbo.Vehicle`                        | `2303722394` | moved                    | none   |
| `SIMS6200Retail.dbo.Vehicle_Inventory`              | `2303689447` | moved                    | none   |
| `SIMS6200Retail.dbo.Vehicle_Pricing`                | `2303362685` | moved                    | none   |
| `SIMS6200Retail.dbo.Vehicle_Source`                 | `2303722418` | moved                    | none   |
| `SIMS6200Retail.dbo.Vehicle_Status_Log`             | `2302674738` | moved                    | none   |
| `Sonic_DW.dbo.dwDiffActivity_I`                     | `2288025848` | moved                    | none   |
| `Sonic_DW.dbo.vw_GPA_RateCap_SRC`                   | `2286223565` | moved                    | none   |
| `Sonic_DW.dbo.dwDiffEmail_D`                        | `2302148974` | moved                    | none   |
| `Sonic_DW.dbo.dwFullCompany`                        | `2303295671` | moved                    | none   |
| `Sonic_DW.dbo.Dim_DMSCustomer_temp`                 | `2302280033` | moved                    | none   |
| `Sonic_DW.dbo.dwFullTextConversation`               | `2303295911` | moved                    | none   |
| `Sonic_DW.dbo.dwFullTextConversationElement`        | `2302705912` | moved                    | none   |
| `Sonic_DW.dbo.dwFullTextConversationMessage`        | `2302017891` | moved                    | none   |
| `Sonic_DW.dbo.dwFullTextCustomerNumber`             | `2303066532` | moved                    | none   |
| `Sonic_DW.dbo.dwFullTextOptInStatus`                | `2302280153` | moved                    | none   |
| `Sonic_DW.dbo.SamCoraAccount`                       | `2303263202` | moved                    | none   |
| `Sonic_DW.dbo.vw_Dim_Inventory_Vehicle_Staging`     | `2302542343` | moved                    | none   |
| `Sonic_DW.dbo.vw_GPA_PettyCash_SRC`                 | `2302575281` | moved                    | none   |
| `Sonic_DW.dbo.vw_GPA_PettyCashAccounting_SRC`       | `2303066606` | moved                    | none   |
| `Speed.Cbrt.AcccountDetailesReport_Hist`            | `2303626486` | moved                    | none   |
| `StagingDB.dbo.autocheck_tracking`                  | `2303756195` | moved                    | none   |
| `StagingDB.dbo.AutoTraderDealerListingID_Archive`   | `2302773378` | moved                    | none   |
| `StagingDB.dbo.AutotraderNewInventoryStaging`       | `2303363564` | moved                    | none   |
| `StagingDB.dbo.Carmax_SF_New_Staging`               | `2303363588` | moved                    | none   |
| `StagingDB.dbo.JDPowerVehicleFeatures_Tracking`     | `2302773426` | moved                    | none   |
| `StagingDB.dbo.JDPowerVehicleFeatures_TrackingHist` | `2302020192` | moved                    | none   |
| `StagingDB.dbo.Stg_BuildingPermitByMonthVM`         | `2303297896` | moved                    | none   |
| `StagingDB.dbo.StgAdesaAuctionDataFull`             | `2303297920` | moved                    | none   |
| `StagingDB.dbo.StgAdesaAuctionDataInc`              | `2301954447` | moved                    | none   |
| `StagingDB.dbo.StgGetVINsforCarFaxChunks`           | `2303363636` | moved                    | none   |
| `StagingDB.dbo.StgManheimAPISearchesColor`          | `2302707713` | moved                    | none   |
| `StagingDB.dbo.StgManheimAPISearchesOption`         | `2302544282` | moved                    | none   |
| `StagingDB.dbo.StgManheimAPISearchesPackage`        | `2302577378` | moved                    | none   |
| `StagingDB.dbo.stgManheimMMRInput`                  | `2303854112` | moved                    | none   |
| `StagingDB.dbo.StgManheimVehicleListing`            | `2303035514` | moved                    | none   |
| `StagingDB.dbo.WS_SrcControl`                       | `2302544354` | moved                    | none   |
| `StagingDB.dbo.WS_STG_AutoCheck_Tracking_Test`      | `2303035586` | moved                    | none   |
| `StagingDB.dbo.AUTOCHECK_TRACKING_Daily`            | `2301954519` | moved                    | none   |
| `StagingDB.dbo.BlackBookAPIOutput_Staging`          | `2303625112` | moved                    | none   |
| `StagingDB.dbo.CarFaxFailedVINs`                    | `2302838908` | moved                    | none   |
| `StagingDB.dbo.CarFaxInvalidVINs`                   | `2302052536` | moved                    | none   |
| `StagingDB.dbo.CarvanaAdditionalFeaturesData`       | `2303854184` | moved                    | none   |
| `StagingDB.dbo.CarvanaOutputFileData`               | `2303592202` | moved                    | none   |
| `StagingDB.dbo.gljedetail_curLoadHist`              | `2303298040` | moved                    | none   |
| `StagingDB.dbo.OffRentalCarFaxFailedVINs`           | `2302020288` | moved                    | none   |
| `StagingDB.dbo.OffRentalCarFaxInvalidVINs`          | `2303756394` | moved                    | none   |
| `StagingDB.dbo.StageDimstyle`                       | `2302315101` | moved                    | none   |
| `StagingDB.dbo.Stg_AtDMAMiles`                      | `2302315125` | moved                    | none   |
| `StagingDB.dbo.StgAutoCheckVehicleEvents`           | `2302315149` | moved                    | none   |
| `StagingDB.dbo.StgAutoCheckVehicleScore`            | `2302577474` | moved                    | none   |
| `StagingDB.dbo.StgAutoTraderArchive`                | `2302020312` | moved                    | none   |
| `StagingDB.dbo.StgCarfaxVehicleScore`               | `2303035634` | moved                    | none   |
| `StagingDB.dbo.StgCargurusDealer`                   | `2302707761` | moved                    | none   |
| `StagingDB.dbo.StgCarmaxAccidentCount`              | `2302315173` | moved                    | none   |
| `StagingDB.dbo.StgCarmaxAuctionData`                | `2302315197` | moved                    | none   |
| `StagingDB.dbo.StgGeoCodeAddress`                   | `2303265612` | moved                    | none   |
| `StagingDB.dbo.StgJDPowerVehicleFeatures`           | `2303035658` | moved                    | none   |
| `StagingDB.dbo.StgJDPowerVehicleFeatures_Nodata`    | `2302020336` | moved                    | none   |
| `StagingDB.dbo.StgManheimAuctionLocations`          | `2301954615` | moved                    | none   |
| `StagingDB.dbo.StgManheimAuctionTransactions`       | `2302773474` | moved                    | none   |
| `StagingDB.dbo.StgOffRentalAutoCheckVehicleEvents`  | `2302707785` | moved                    | none   |
| `StagingDB.dbo.StgOffRentalAutoCheckVehicleScore`   | `2303035682` | moved                    | none   |
| `StagingDB.dbo.StgOffRentalCarfaxVehicleScore`      | `2303854208` | moved                    | none   |
| `StagingDB.dbo.StgSmartAuctionData`                 | `2303625184` | moved                    | none   |
| `StagingDB.dbo.StgUVCStandardEquipment`             | `2303592298` | moved                    | none   |
| `StagingDB.dbo.VehicleMart_DimUVC_Staging`          | `2302020360` | moved                    | none   |
| `StagingDB.dbo.VehicleVINUVC_Staging`               | `2303035730` | moved                    | none   |
| `StagingDB.dbo.WS_STG_AutoCheck_Tracking`           | `2303265660` | moved                    | none   |
| `StagingDB.stage.CarGurusSourceDateAdded`           | `2303690675` | moved                    | none   |
| `StagingDB.stage.KBBMappingStg`                     | `2302675867` | moved                    | none   |
| `StagingDB.stage.KBBVehicleInfo`                    | `2303364051` | moved                    | none   |
| `StagingDB.stage.NADAChromeStg`                     | `2302675891` | moved                    | none   |
| `StagingDB.stage.SimsEPVehicleListDaily`            | `2302773883` | moved                    | none   |
| `StagingDB.stage.SimsRetailVehicleListDaily`        | `2303854623` | moved                    | none   |
| `StagingDB.stage.StgCarGurusRelatedInventorySource` | `2302052872` | moved                    | none   |
| `StagingDB.stage.UCGChromeStg`                      | `2302315389` | moved                    | none   |
| `VehicleMart.dbo.AutoTrader_SF_New`                 | `2303299119` | moved                    | none   |
| `VehicleMart.dbo.vw_Dim_Inventory_Vehicle_Staging`  | `2303593501` | moved                    | none   |
| `WebV.dbo.vw_Dim_Inventory_Vehicle_Staging`         | `2303298953` | moved                    | none   |

## Guardrails

- Only direct object children reported by the published hierarchy check were considered.
- Pages were archived only when a canonical bucketed page exists or the page is an excluded retired-table candidate.
- Pages were moved only when they were the only available page and a typed bucket parent exists.
- Pages with child pages, attachments, or comments were skipped.
- The machine-readable lineage runtime registry was not modified by this cleanup.
