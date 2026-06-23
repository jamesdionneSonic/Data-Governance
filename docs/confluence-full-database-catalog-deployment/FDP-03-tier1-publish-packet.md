# FDP-03 Tier 1 Publish Review Packet

## Purpose

This packet prepares the reviewed Tier 1 Database Catalog publish for every
included cataloged database.

It does not publish to Confluence and it does not clean up, archive, delete, or
move superseded pages.

## Recommendation

Ready for user review. Live Tier 1 publish requires explicit approval. Cleanup is not included.

## Publish Scope

| Signal            | Value                                                                 |
| ----------------- | --------------------------------------------------------------------- |
| Packet            | `FDP-03`                                                              |
| Generated at      | 2026-06-23T13:08:08.944Z                                              |
| Canonical root    | `Sonic Data Lineage / Database Catalog`                               |
| Publish mode      | `reviewed publish packet; no live publish performed`                  |
| Cleanup mode      | `report-only; no cleanup authorized`                                  |
| Required labels   | `human-lineage-catalog`, `database-catalog`, `database-catalog-tier1` |
| Validation status | `passed`                                                              |

## Page Counts

| Signal                                         | Value |
| ---------------------------------------------- | ----- |
| Planned navigation pages                       | 3     |
| Planned database pages                         | 34    |
| Planned schema pages                           | 147   |
| Planned leaf pages                             | 181   |
| Planned total pages                            | 184   |
| Included objects represented on schema indexes | 5348  |
| Excluded SSIS package/catalog artifacts        | 2131  |
| Superseded cleanup candidates                  | 344   |

## Database Coverage

| Database                     | Schemas | Objects | Types                                                                |
| ---------------------------- | ------- | ------- | -------------------------------------------------------------------- |
| `BI_WorkDB`                  | 1       | 21      | table (21)                                                           |
| `CBS`                        | 2       | 5       | table (5)                                                            |
| `CDK_ROADSTER_ELEAD_SONIC`   | 1       | 7       | view (7)                                                             |
| `ContentManagement`          | 1       | 1       | table (1)                                                            |
| `DA_SIMS_EP`                 | 3       | 7       | table (7)                                                            |
| `DASimsRetail`               | 1       | 4       | table (4)                                                            |
| `DMS`                        | 1       | 38      | table (38)                                                           |
| `echoparkwebv_veh`           | 1       | 29      | table (29)                                                           |
| `eLeadDW`                    | 1       | 55      | table (55)                                                           |
| `eLeadDW_SF`                 | 1       | 136     | table (136)                                                          |
| `eRIMS`                      | 1       | 6       | table (6)                                                            |
| `ETL_Staging`                | 23      | 1703    | table (1332), procedure (221), view (138), function (6), synonym (6) |
| `Google`                     | 1       | 5       | table (5)                                                            |
| `GPA`                        | 1       | 12      | table (12)                                                           |
| `HRData`                     | 1       | 6       | table (6)                                                            |
| `HYPERNOVA_SONIC_CUSTACCESS` | 1       | 207     | table (207)                                                          |
| `NVPImport`                  | 1       | 3       | table (3)                                                            |
| `ProcessManagement`          | 1       | 1       | table (1)                                                            |
| `SIMS6200_EP`                | 1       | 26      | table (26)                                                           |
| `SIMS6200Retail`             | 2       | 28      | table (28)                                                           |
| `SIMSEP`                     | 1       | 1       | table (1)                                                            |
| `SIMSRT`                     | 1       | 6       | table (6)                                                            |
| `Sonic_DW`                   | 12      | 1746    | table (1023), view (385), procedure (324), synonym (8), function (6) |
| `Sonic_Xref`                 | 1       | 3       | table (3)                                                            |
| `SONICWEBV_VEH`              | 1       | 9       | table (9)                                                            |
| `Speed`                      | 4       | 5       | table (5)                                                            |
| `SSIS`                       | 1       | 1       | table (1)                                                            |
| `StagingDB`                  | 41      | 846     | table (746), procedure (86), view (11), synonym (2), function (1)    |
| `TitleTracking`              | 1       | 4       | table (4)                                                            |
| `VehicleMart`                | 5       | 45      | table (45)                                                           |
| `VehicleMartETLWeekly`       | 1       | 1       | table (1)                                                            |
| `VendorData`                 | 30      | 312     | table (202), procedure (70), view (34), function (3), synonym (3)    |
| `WebV`                       | 1       | 39      | table (39)                                                           |
| `webvEP`                     | 1       | 30      | table (30)                                                           |

## Pages To Create Or Update

| Kind       | Type       | Title                                     | Path                                                                                            | Evidence                                                                  |
| ---------- | ---------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| navigation | navigation | `Database Catalog`                        | `Sonic Data Lineage / Database Catalog`                                                         | navigation page                                                           |
| navigation | navigation | `Snowflake`                               | `Sonic Data Lineage / Database Catalog / Snowflake`                                             | navigation page                                                           |
| navigation | navigation | `SQL Server`                              | `Sonic Data Lineage / Database Catalog / SQL Server`                                            | navigation page                                                           |
| leaf       | database   | `CDK_ROADSTER_ELEAD_SONIC`                | `Sonic Data Lineage / Database Catalog / Snowflake / CDK_ROADSTER_ELEAD_SONIC`                  | `sha256:BA1629A7B2A336DD5EC76BCDE8FEA9C08C9002CC0BAAF70660DEE0F59675253F` |
| leaf       | database   | `HYPERNOVA_SONIC_CUSTACCESS`              | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS`                | `sha256:24ACA5F60533AC4A6771457889E3CEA630D0C2607801BBB3C70FD3D56E0E6A59` |
| leaf       | database   | `BI_WorkDB`                               | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB`                                | `sha256:B80513645AC18533697FFB66CC6175B3038F8F224F40B082CD734CBBE0623732` |
| leaf       | database   | `CBS`                                     | `Sonic Data Lineage / Database Catalog / SQL Server / CBS`                                      | `sha256:F884FE8FF4538E5CB3F5973BB89498A08410A5BDC910ADA8EAE7E06C7EFBA071` |
| leaf       | database   | `ContentManagement`                       | `Sonic Data Lineage / Database Catalog / SQL Server / ContentManagement`                        | `sha256:E34C2DD4DBFCE27C0A1878420998A1D8FFCED6E612421C5E169797238184F137` |
| leaf       | database   | `DA_SIMS_EP`                              | `Sonic Data Lineage / Database Catalog / SQL Server / DA_SIMS_EP`                               | `sha256:48CF45CF1F5DB4CF50361122D367C3AA17B549128000206ED67EC60538DE90C7` |
| leaf       | database   | `DASimsRetail`                            | `Sonic Data Lineage / Database Catalog / SQL Server / DASimsRetail`                             | `sha256:945C2D8CB01209E3BAF0FA19534EDCFCC248F391BEC5A78FF72FCAD25D1F756B` |
| leaf       | database   | `DMS`                                     | `Sonic Data Lineage / Database Catalog / SQL Server / DMS`                                      | `sha256:523B907C0453D3A7A3FA05921BA45A0FC697C3F177531616BFF198523975A9EB` |
| leaf       | database   | `echoparkwebv_veh`                        | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh`                         | `sha256:333E03943823894882BBFE1D827719091AD69A7BB73807A908C48499B1CCB441` |
| leaf       | database   | `eLeadDW`                                 | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW`                                  | `sha256:A63CD4F0BE9430D901AC517484DF0C327B0C3BC3D2C5D42A9A95B9DEC6FBB187` |
| leaf       | database   | `eLeadDW_SF`                              | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF`                               | `sha256:9EF7266A812A41BDC0246DC2868B759D7ABEA8545366C4BD4DFF98C57260EC17` |
| leaf       | database   | `eRIMS`                                   | `Sonic Data Lineage / Database Catalog / SQL Server / eRIMS`                                    | `sha256:372BAD143A8ECEEFF95CD915CE88E75F41120013A6BB96A2F6F18AC582A1EC66` |
| leaf       | database   | `ETL_Staging`                             | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging`                              | `sha256:B5B9BB74C009145C3CFC2A7B0599A19FBB1F0514023A26423D3F929058666397` |
| leaf       | database   | `Google`                                  | `Sonic Data Lineage / Database Catalog / SQL Server / Google`                                   | `sha256:0C7DD1D9DE95BD78675FE5188C3552B5762218B11A2F1271FA943E7C99AAE7E2` |
| leaf       | database   | `GPA`                                     | `Sonic Data Lineage / Database Catalog / SQL Server / GPA`                                      | `sha256:CF6E4F65B85817F0540475471C6F8671ADC744FECAB28BA0C2C45C167BFCA346` |
| leaf       | database   | `HRData`                                  | `Sonic Data Lineage / Database Catalog / SQL Server / HRData`                                   | `sha256:04908763B94B47C8BB646470930874C0C8353512F8EF76C34DBFBCBB353E0765` |
| leaf       | database   | `NVPImport`                               | `Sonic Data Lineage / Database Catalog / SQL Server / NVPImport`                                | `sha256:E98D647E9FBD11BB58271ADDFC5C83C1817471FBF11FDF29CB424B45C6035FD4` |
| leaf       | database   | `ProcessManagement`                       | `Sonic Data Lineage / Database Catalog / SQL Server / ProcessManagement`                        | `sha256:BBC66EED875A87194035D23DA33E4F0C6C1B3DC7D5DB126B089C951ADEE05F27` |
| leaf       | database   | `SIMS6200_EP`                             | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP`                              | `sha256:1E41592CF52BCFAA6E847345D6422B39A6719C2B672636F03287459BEAAFD318` |
| leaf       | database   | `SIMS6200Retail`                          | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail`                           | `sha256:C40559E19568979FB297F15B6B5CB5189CF80F433773BA3557EA189E8F294266` |
| leaf       | database   | `SIMSEP`                                  | `Sonic Data Lineage / Database Catalog / SQL Server / SIMSEP`                                   | `sha256:D0329C7C1A4FF15762CA8AE94564B539B517F38DD733F28BCCCBC66D8FDC5863` |
| leaf       | database   | `SIMSRT`                                  | `Sonic Data Lineage / Database Catalog / SQL Server / SIMSRT`                                   | `sha256:5DB29C119F48FDFC747FA2AE103B196CC6ABE17008A9789795DEB40C90455A50` |
| leaf       | database   | `Sonic_DW`                                | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW`                                 | `sha256:9181685302D3EC515E7AC2EE3FDFB77BA2B42560A5E84406ED8EF9B1582B9B4F` |
| leaf       | database   | `Sonic_Xref`                              | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_Xref`                               | `sha256:1FF7637FC81F6C60C00F32FDEBC0E061F43787FC90743468C819D3A4BEA1C22D` |
| leaf       | database   | `SONICWEBV_VEH`                           | `Sonic Data Lineage / Database Catalog / SQL Server / SONICWEBV_VEH`                            | `sha256:9F46C7191622DEFFA73A0BB0C68CA618323996036B1F630BC92F2CA8B00A8E68` |
| leaf       | database   | `Speed`                                   | `Sonic Data Lineage / Database Catalog / SQL Server / Speed`                                    | `sha256:2DEB839982819AD00128019F5DDA00630C7DD1BDAF11B5D677391F1C5C2A03DC` |
| leaf       | database   | `SSIS`                                    | `Sonic Data Lineage / Database Catalog / SQL Server / SSIS`                                     | `sha256:C9A0D2362B7FD0060D5CFA9A869F742CC228CAD7081480BBD73D790942EEB7CE` |
| leaf       | database   | `StagingDB`                               | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB`                                | `sha256:0C65A6F56CE8D58FF7910A2D35B51884C130C31CCDC4616DF7373F4E923AEBB7` |
| leaf       | database   | `TitleTracking`                           | `Sonic Data Lineage / Database Catalog / SQL Server / TitleTracking`                            | `sha256:50DBEF49BB8BC71B90383585ECB531022E967C8505C7150F2AD8140A005F8983` |
| leaf       | database   | `VehicleMart`                             | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart`                              | `sha256:A05C98EE27D1287D06D8B7F1C4670D233A9029F0723C9A3773DEC6EEC085E72C` |
| leaf       | database   | `VehicleMartETLWeekly`                    | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMartETLWeekly`                     | `sha256:9F66CE040B74D4D2628A1D6E7F0D365A8919109B6A4B52788B0175DF96425264` |
| leaf       | database   | `VendorData`                              | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData`                               | `sha256:DF82C512BB68C670968423D4E1FDCBCFC0316DF54B6F683D1AD4982E809E3E3C` |
| leaf       | database   | `WebV`                                    | `Sonic Data Lineage / Database Catalog / SQL Server / WebV`                                     | `sha256:260B48B0734823C4AD3B45DD4D8CDED75C7C189FDBE6CD575F750A0534EAF218` |
| leaf       | database   | `webvEP`                                  | `Sonic Data Lineage / Database Catalog / SQL Server / webvEP`                                   | `sha256:3960EDFF4E08A3BF36E9AB673EAC7263FD59717C65089C07C2A7227BBF7B856D` |
| leaf       | schema     | `CDK_ROADSTER_ELEAD_SONIC.SONIC`          | `Sonic Data Lineage / Database Catalog / Snowflake / CDK_ROADSTER_ELEAD_SONIC / SONIC`          | `sha256:D9ECA8DCE8A54A4249EB572D9013261FF1F94D72F015A0D56BF6EFF070774BB7` |
| leaf       | schema     | `HYPERNOVA_SONIC_CUSTACCESS.COSMOS_SONIC` | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC` | `sha256:42E96C9F0CE8DE2967A22B1F9B8607C41C894E7421BA77A29EAA3308530CD225` |
| leaf       | schema     | `BI_WorkDB.dbo`                           | `Sonic Data Lineage / Database Catalog / SQL Server / BI_WorkDB / dbo`                          | `sha256:55879A4726F6244DBDD23D1F46A1544A3E23238E679D82D45BE27E0F29A2E329` |
| leaf       | schema     | `CBS.dbo`                                 | `Sonic Data Lineage / Database Catalog / SQL Server / CBS / dbo`                                | `sha256:92C0D3544ADA21A0CB096643A4B30324D259302785DD032736570C7E7C20D12C` |
| leaf       | schema     | `CBS.wrk`                                 | `Sonic Data Lineage / Database Catalog / SQL Server / CBS / wrk`                                | `sha256:336C572679AD89BA9D6426E0EE5325117B2BE26C4757ED99DA89FC60DF17BA84` |
| leaf       | schema     | `ContentManagement.wrk`                   | `Sonic Data Lineage / Database Catalog / SQL Server / ContentManagement / wrk`                  | `sha256:F41709D57D61E8CBBBB0CCC3A629921433FA0AD0D379A6BA3311F550B9C3D2F1` |
| leaf       | schema     | `DA_SIMS_EP.BlackBook`                    | `Sonic Data Lineage / Database Catalog / SQL Server / DA_SIMS_EP / BlackBook`                   | `sha256:C46A614CD3ED93EA2A8695901FD2DA1274E92EB02F717EB9D091A6D71DA6B1E6` |
| leaf       | schema     | `DA_SIMS_EP.dbo`                          | `Sonic Data Lineage / Database Catalog / SQL Server / DA_SIMS_EP / dbo`                         | `sha256:457B3A55810C921360D3C2EA8A9BD0B4C38748FEDB9D184BAB89CBBB1BBAF37C` |
| leaf       | schema     | `DA_SIMS_EP.Stage`                        | `Sonic Data Lineage / Database Catalog / SQL Server / DA_SIMS_EP / Stage`                       | `sha256:3A3F8816CD3EFBB71B6FF229ADB99182267524AE449DE0D4F78867FF49279CD1` |
| leaf       | schema     | `DASimsRetail.dbo`                        | `Sonic Data Lineage / Database Catalog / SQL Server / DASimsRetail / dbo`                       | `sha256:9312E618C3FDFE68938D464A047B511C5D022629BFAF068FDE53D0409DF94DBC` |
| leaf       | schema     | `DMS.dbo`                                 | `Sonic Data Lineage / Database Catalog / SQL Server / DMS / dbo`                                | `sha256:08691740609E158735D39092C1CF498087E0FA508533D3EEFF1FDA3DDACE0D8E` |
| leaf       | schema     | `echoparkwebv_veh.dbo`                    | `Sonic Data Lineage / Database Catalog / SQL Server / echoparkwebv_veh / dbo`                   | `sha256:AF9D2D6EC242F001D64022ECD97658CF2C038B93983DDF2AC64934D4C6A2CC9A` |
| leaf       | schema     | `eLeadDW.dbo`                             | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW / dbo`                            | `sha256:160EF7FE283A40DAEBDCF2B4DE44B069BEE86C92B1576B0255D156F8619365FF` |
| leaf       | schema     | `eLeadDW_SF.dbo`                          | `Sonic Data Lineage / Database Catalog / SQL Server / eLeadDW_SF / dbo`                         | `sha256:B065E795A9E01A88F19311A00184EF7BF9C89AA031710B09D63BF94BDB8BFF22` |
| leaf       | schema     | `eRIMS.dbo`                               | `Sonic Data Lineage / Database Catalog / SQL Server / eRIMS / dbo`                              | `sha256:320D39FF99E99F4C7C19F189DDA969F33F1356A8874ACE60DD95EEC5BDDB9E0A` |
| leaf       | schema     | `ETL_Staging.callrevu`                    | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / callrevu`                   | `sha256:223F62FA69ED21E93B3971BFCE69987C770C95014A6E04D983A6A00F370E5E90` |
| leaf       | schema     | `ETL_Staging.Cars`                        | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Cars`                       | `sha256:79554CEB5BEEC0211D1CC55B9D379ADE87399D625268649F054C0F14FB5D8E59` |
| leaf       | schema     | `ETL_Staging.clean`                       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / clean`                      | `sha256:B824BA25F431C3F8F29509169F19E5D2985BFEEEF1859E15EB2B7D9B9BA0ED34` |
| leaf       | schema     | `ETL_Staging.conform`                     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / conform`                    | `sha256:B72D9FCAE8D67C5DC662501338EFEC6A25DDA175CC39CDD337DAA19A434C260E` |
| leaf       | schema     | `ETL_Staging.dbo`                         | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dbo`                        | `sha256:E9324B3ED56AD982A1ECB661B0F82805013E5B153993453413B029B5E6804BC3` |
| leaf       | schema     | `ETL_Staging.dms`                         | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / dms`                        | `sha256:96F8CD24FC762999556F8F8D80E849BD9CFEBDB8C5DF82A308C9394655377CB7` |
| leaf       | schema     | `ETL_Staging.eleadDW`                     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / eleadDW`                    | `sha256:693F0B4E2C821F4A6EFEBB0C20C307EE16F4BF0403E7CE714433B72E3C6256CA` |
| leaf       | schema     | `ETL_Staging.etl`                         | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / etl`                        | `sha256:C9EE2427A157CD615E8558DD75F94A4768DA628F8647C40580B971EB14AD823B` |
| leaf       | schema     | `ETL_Staging.extract`                     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / extract`                    | `sha256:E11FF2A6C955D789C2924F5C9ACC0932286F60621CC36ECACCCAC582C875CAE8` |
| leaf       | schema     | `ETL_Staging.hfm`                         | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / hfm`                        | `sha256:74A2BA2AFDA0AC553C72DC03FAB38CB8F0A1416A8C86921AB9DA77A5561CDC95` |
| leaf       | schema     | `ETL_Staging.HMN`                         | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / HMN`                        | `sha256:D3EF0E4AC56D921014BC51D497C43C1D04E34D83C40D2FCD780285B1E867BB06` |
| leaf       | schema     | `ETL_Staging.JMA`                         | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / JMA`                        | `sha256:2FBC89E0112F93D9F272C20A849CEDFB8A4C57B603CFBE5FBE7722A985137AB0` |
| leaf       | schema     | `ETL_Staging.load`                        | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / load`                       | `sha256:E6D810B1E273003333A5828BE92077A6353484495CF0450B4C30C367E75F0A2A` |
| leaf       | schema     | `ETL_Staging.mdm`                         | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / mdm`                        | `sha256:8433AB7D6060FC6ED2E60DD5032B6EA9326D2AE8D02A9840B8AC437355AA0B61` |
| leaf       | schema     | `ETL_Staging.Meta`                        | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Meta`                       | `sha256:2D5724C709912E8684E91BA4E8E3F63D6908F1014FC5BF86926FFA67CA9ACE07` |
| leaf       | schema     | `ETL_Staging.perm`                        | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / perm`                       | `sha256:6F9EC74E7692E4F12A95C8A525C31761A53FB5F8C9F335975A464BA280B3B906` |
| leaf       | schema     | `ETL_Staging.permsup`                     | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / permsup`                    | `sha256:1A07C5451973A73188930CD71183742755E9896B9088B2B627F9A25046309219` |
| leaf       | schema     | `ETL_Staging.pgc`                         | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / pgc`                        | `sha256:B1863D679FEF5F9EF902C5991EF9C44B101BD13486D1B715201F184D0A5A7AE4` |
| leaf       | schema     | `ETL_Staging.Security`                    | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / Security`                   | `sha256:918F27B9A1930082EBE90AE0C117E8D6ACE8771BCC9F8F07451A6339E377F50A` |
| leaf       | schema     | `ETL_Staging.shr`                         | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / shr`                        | `sha256:CBF12499B3BDD8548314B9D878395D33E68D60BD563727A2CA064CE31EC0C04D` |
| leaf       | schema     | `ETL_Staging.SIMS`                        | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / SIMS`                       | `sha256:228F3C299FC6435F759C5FDBB3ACDCB00D10D800E438ABF3A642C6C74D140E4D` |
| leaf       | schema     | `ETL_Staging.stage`                       | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / stage`                      | `sha256:80B8A55C07C0202E5D27DE3B764353EFD6CEB49FAB33A37BBA28055B50EC4AB6` |
| leaf       | schema     | `ETL_Staging.wrk`                         | `Sonic Data Lineage / Database Catalog / SQL Server / ETL_Staging / wrk`                        | `sha256:15F57F7F152CDED0D38328A22701E2CE4324B7D35DAD3D0ABDC00697ECF48979` |
| leaf       | schema     | `Google.dbo`                              | `Sonic Data Lineage / Database Catalog / SQL Server / Google / dbo`                             | `sha256:9C9870937BD00B93D7DD5832AFCD78E8FF0FD9DFCA47D2F3C8A88D1891DA000B` |
| leaf       | schema     | `GPA.dbo`                                 | `Sonic Data Lineage / Database Catalog / SQL Server / GPA / dbo`                                | `sha256:39A7FA12241F95D7A53FD5980DD4F9983FDC69587A5F907D1634EFB2D85A0397` |
| leaf       | schema     | `HRData.dbo`                              | `Sonic Data Lineage / Database Catalog / SQL Server / HRData / dbo`                             | `sha256:17F1917C0B2C1F261A9CD3A564AF5C7D44008AFCC8495F66859647DC1ED018D1` |
| leaf       | schema     | `NVPImport.dbo`                           | `Sonic Data Lineage / Database Catalog / SQL Server / NVPImport / dbo`                          | `sha256:76B388FABAF7C2A991F5C0AFBA9E11312E108DF667EA0F3E65EF548E25CEC61A` |
| leaf       | schema     | `ProcessManagement.dbo`                   | `Sonic Data Lineage / Database Catalog / SQL Server / ProcessManagement / dbo`                  | `sha256:4E95E580137E40A90EE0CEDD33961CA1E3AF38BADF2E321EB1D40B77849A4FD0` |
| leaf       | schema     | `SIMS6200_EP.dbo`                         | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200_EP / dbo`                        | `sha256:4D4B50D65D7378969977614CE0ED50DB7637F49C0FC418042E2FDB91BE27D5D2` |
| leaf       | schema     | `SIMS6200Retail.dbo`                      | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / dbo`                     | `sha256:B5E35492AFD702B2DEF2FFAC329DBC8E0513BA1B59329563E4C353A7AC117BF7` |
| leaf       | schema     | `SIMS6200Retail.SIMS`                     | `Sonic Data Lineage / Database Catalog / SQL Server / SIMS6200Retail / SIMS`                    | `sha256:FB26AE0A1405459FE57D3968EF5F0E273C16628BFF5D740B2B99FE7504AD6C7D` |
| leaf       | schema     | `SIMSEP.dbo`                              | `Sonic Data Lineage / Database Catalog / SQL Server / SIMSEP / dbo`                             | `sha256:6DDE9931803EAEE7A17D01E1DCE8EE2BF4C5DC379546C036AB28FE579077F223` |
| leaf       | schema     | `SIMSRT.dbo`                              | `Sonic Data Lineage / Database Catalog / SQL Server / SIMSRT / dbo`                             | `sha256:710304CF8A9132BD90837AB0BFCAD4436C379FCB7B164C000D48D92C9DB2A11F` |
| leaf       | schema     | `Sonic_DW.darpts`                         | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / darpts`                        | `sha256:E61CD17E29810B4596A6D7638835CD996DDB006FB9379BCACAB3B71E20DDB574` |
| leaf       | schema     | `Sonic_DW.dbo`                            | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dbo`                           | `sha256:76BB671CAA195330F21603349BA52D61905FD50241C457C2328D5A39D8993DEE` |
| leaf       | schema     | `Sonic_DW.dq`                             | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / dq`                            | `sha256:909C469341C7C927B78CEE91E0B88EB8F77F4AA32A4B3E49F36AC35DA97CFB10` |
| leaf       | schema     | `Sonic_DW.err`                            | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / err`                           | `sha256:70F3EB110339B7A078941D414097CFA15804B095B93D1E1E0CD583C5B9CA19C5` |
| leaf       | schema     | `Sonic_DW.kpi`                            | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / kpi`                           | `sha256:057BD2314684992CB5EA4DBEB6AFD606CA77ADF77952A4004F155B64B4FA122D` |
| leaf       | schema     | `Sonic_DW.mdm`                            | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mdm`                           | `sha256:6AE8313ECDBDFE0762316252F175224313C467B248FC740634F79A7B1CA88DD9` |
| leaf       | schema     | `Sonic_DW.Metric`                         | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / Metric`                        | `sha256:5A48A4F900A1284A304C757D7F3136047454A7FA819BF90C4C9F040D7F2391B6` |
| leaf       | schema     | `Sonic_DW.MS`                             | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / MS`                            | `sha256:5B8DAE23F4DEA23F802B49B752C735E241D738FE91B5F7DCB94C471B8276EBD5` |
| leaf       | schema     | `Sonic_DW.mstrtemp`                       | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / mstrtemp`                      | `sha256:90A9A2979A90EC8DA46392E771911DE654687DE318D0909E2327969AA8C5F235` |
| leaf       | schema     | `Sonic_DW.razzle`                         | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / razzle`                        | `sha256:9A708937E5367EF293EC8D52BBC86F75CEB6AE80DA989381AB17F707385EB73E` |
| leaf       | schema     | `Sonic_DW.stg`                            | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / stg`                           | `sha256:A622B701743D78461DCCDE1317532AA98B66417CE0A4DB5BC1716434BCD23E25` |
| leaf       | schema     | `Sonic_DW.wrk`                            | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_DW / wrk`                           | `sha256:81C8CC9649D3CBAE780EECCAA2BE477BC23BCBE92D8FA00047616D032B1EE185` |
| leaf       | schema     | `Sonic_Xref.dbo`                          | `Sonic Data Lineage / Database Catalog / SQL Server / Sonic_Xref / dbo`                         | `sha256:17FC92070A43B53A20712904D070D6DDA958E6B4B2710D85ABCC940BEBA62A3B` |
| leaf       | schema     | `SONICWEBV_VEH.dbo`                       | `Sonic Data Lineage / Database Catalog / SQL Server / SONICWEBV_VEH / dbo`                      | `sha256:0F6C94D934CB7F72CE84CFF44912E3182B20A8D6893D077DE472F3785FB5BDF2` |
| leaf       | schema     | `Speed.Auto`                              | `Sonic Data Lineage / Database Catalog / SQL Server / Speed / Auto`                             | `sha256:5F9E7ACBB418D0FA4F4EEB63864014D736ED09D5D7C8F981821D845E27DF17CC` |
| leaf       | schema     | `Speed.Cbrt`                              | `Sonic Data Lineage / Database Catalog / SQL Server / Speed / Cbrt`                             | `sha256:10969B574A2FFB31BFD2C5C4DE71C157D0E34BFA0ED1C4ECF77B074054AF6EA5` |
| leaf       | schema     | `Speed.dbo`                               | `Sonic Data Lineage / Database Catalog / SQL Server / Speed / dbo`                              | `sha256:9BC34ADF566C7A35BFCD6C9CAF8C784C723B90ABCFBC279AA1521140DB48C9FF` |
| leaf       | schema     | `Speed.DDC`                               | `Sonic Data Lineage / Database Catalog / SQL Server / Speed / DDC`                              | `sha256:396A3285361BA30D68607FB671F7D73A6595A00B8DC6B88A13FCCA07855918A3` |
| leaf       | schema     | `SSIS.Meta`                               | `Sonic Data Lineage / Database Catalog / SQL Server / SSIS / Meta`                              | `sha256:6691077D32609C616BEE4FED7DF4E3ED18A854AE259F638C1A1E459E21F667A5` |
| leaf       | schema     | `StagingDB.acertus`                       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / acertus`                      | `sha256:078BED5415040FC5CE7CDDF15DB82473B0B3E2E8CF109A2E5E82D6F2C8E2732B` |
| leaf       | schema     | `StagingDB.Adv`                           | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Adv`                          | `sha256:10982DCE699BAA866E9A3602A948E5F414FC200625287C060AFA06CBABB9A1EA` |
| leaf       | schema     | `StagingDB.Audit`                         | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Audit`                        | `sha256:CD0176A81A1F1EFB596B7BC5599A243A67E13190492860FEBB88EEB9812EE3F4` |
| leaf       | schema     | `StagingDB.Auto`                          | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Auto`                         | `sha256:3D1C3FCD8C786C4386185E6186CDC17D80839F46F2284B3A8ED9C84A77B0823D` |
| leaf       | schema     | `StagingDB.Black`                         | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Black`                        | `sha256:8F6B137599C993963AB06F9B830F65A55812AE0A05FA6772C47172AA2847D1C3` |
| leaf       | schema     | `StagingDB.callrevu`                      | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / callrevu`                     | `sha256:B990585D21D59E5E93C9DA1C7A3C0D4AC9FDE9C07E56B3384C8BAABD0E3BE0BD` |
| leaf       | schema     | `StagingDB.carnow`                        | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / carnow`                       | `sha256:81E63DAA81B4982A389B9C2AEE1C5AE53BA0AF6A2F5BEE4EDA4F5B4FDA71AC90` |
| leaf       | schema     | `StagingDB.cars`                          | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cars`                         | `sha256:A2E75E39ED1116A915E816E2BCD779FA93CAE4CFC2D40A498E095DB344F36C4A` |
| leaf       | schema     | `StagingDB.cba`                           | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cba`                          | `sha256:28B14C7A8F155CEE3E365C9353A5323AE885C4CE3E6E5E5D030573C3702383DA` |
| leaf       | schema     | `StagingDB.cbrt`                          | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / cbrt`                         | `sha256:E053ACE28D5DCD0D54FE0DA92F13FBAE6854CEDA1086BFCCBACBEDBF4E88761E` |
| leaf       | schema     | `StagingDB.dabe`                          | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dabe`                         | `sha256:2BBA980E253489D959485F07607DDE0A36F65868E1A351D348E543391A28E49B` |
| leaf       | schema     | `StagingDB.dbo`                           | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / dbo`                          | `sha256:36B2D036D781498362EBF8A5EB4CF991592E2B4565885B015011EB05FC5178D2` |
| leaf       | schema     | `StagingDB.ddc`                           | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ddc`                          | `sha256:DDC424843404FE9AC2BD6C9B790288D617712546A2717CFA13A3E8E57EB7DB81` |
| leaf       | schema     | `StagingDB.easy`                          | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / easy`                         | `sha256:FE12723E93A05AB6377755F228CB264A004E6E9C942EC32034AB89944889769B` |
| leaf       | schema     | `StagingDB.Elead`                         | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Elead`                        | `sha256:A7CBD3703BBA450AC57EED353905A02CB1579955E41CAD233C7E285C6251210C` |
| leaf       | schema     | `StagingDB.etl`                           | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / etl`                          | `sha256:9534EF4D061C6AFAB777FE1608DFA5CCF6829232138D1270F76936A103321391` |
| leaf       | schema     | `StagingDB.Facebook`                      | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Facebook`                     | `sha256:B583A87190839B7CB3678762F0795FBFB78CC1C5E8B87F068A6BFFE0A5C42EE1` |
| leaf       | schema     | `StagingDB.ga`                            | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ga`                           | `sha256:F98E41DF6ACD856185A2058FFDF5A2B58F04B501730D4ADB18E7C33A6228DB57` |
| leaf       | schema     | `StagingDB.gad`                           | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gad`                          | `sha256:D5C5C96A6D6F9C764553A8E5A34BCC2F15B64CB2E5C2BB35ACD3F9F970CDCF34` |
| leaf       | schema     | `StagingDB.gl`                            | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gl`                           | `sha256:CBE7F0807B7C5379528C5AC54274FB55F4AF0584F56568086D8A301C023063AC` |
| leaf       | schema     | `StagingDB.gmb`                           | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / gmb`                          | `sha256:62C4BB72A286448D8D8D8742D4054DC9CECA25E373986D397E62E69F3EA7C5F3` |
| leaf       | schema     | `StagingDB.Gold`                          | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Gold`                         | `sha256:B9F03CA7D3E40EFA0AECFB305B9248DFF58B21D3455AFDFCB3CEE9ADF207121A` |
| leaf       | schema     | `StagingDB.Google`                        | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Google`                       | `sha256:5292BD57A00D7F9AB055BA210505DB7663C7045C90E5F7CF5D759BD288744ED0` |
| leaf       | schema     | `StagingDB.happyfox`                      | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / happyfox`                     | `sha256:07165849B43211F5A5A352EF4885B65DAD9AFCE1066BFEA13BDCFF3548AD1FCD` |
| leaf       | schema     | `StagingDB.HFM`                           | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / HFM`                          | `sha256:44BB0042E6519459639F30AC56496E16515B87A6F0E2005A112C598F1D2C15E4` |
| leaf       | schema     | `StagingDB.ibex`                          | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / ibex`                         | `sha256:799BE0F52E813659A6281BD45C092552340C168C33D915679395D0CFDCD3ED58` |
| leaf       | schema     | `StagingDB.JMA`                           | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / JMA`                          | `sha256:754621DB9BA051BBE21B8315B47DE344050DC71F3368AD03AEC4334FDCF21D47` |
| leaf       | schema     | `StagingDB.jump`                          | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / jump`                         | `sha256:2CC72CAC22F247A4AA12FAABCC97DC9FEBD15A2AAE9A6664C811792189BE0F79` |
| leaf       | schema     | `StagingDB.mdp`                           | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / mdp`                          | `sha256:7E8C9A7E33D540FCEC24633E45C43E1889BDA48615ADDDF6AE5476D4C966127E` |
| leaf       | schema     | `StagingDB.pgc`                           | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgc`                          | `sha256:F46C4AA5C3F7E5216B2B25B063C726FF76EF1119AC200AB3E8E2407565458678` |
| leaf       | schema     | `StagingDB.pgw`                           | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / pgw`                          | `sha256:D75C568965B5B38F65ACBEE7A7EA83F255D41309E27E615C42961E711ED2EECD` |
| leaf       | schema     | `StagingDB.Polk`                          | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Polk`                         | `sha256:35F9ED2759FAADCB65030B8C6050E93E3249E2A09F772A557BA7187A151FEE75` |
| leaf       | schema     | `StagingDB.RepMgmt`                       | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / RepMgmt`                      | `sha256:6751887A38C156CEF4E4A084230E5D0D70DBCD3091ABEEB8E8CED746CEBD4F83` |
| leaf       | schema     | `StagingDB.RtlU`                          | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / RtlU`                         | `sha256:2FBB573875CB05B2126CD53D78C3A7FBFF66A8700C824FD2FFEA4B452D414D22` |
| leaf       | schema     | `StagingDB.Security`                      | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Security`                     | `sha256:88FAD3D6E848ABEE8A0DC964B821D3B4EE276A043E0184CBA212C8AA84029CDE` |
| leaf       | schema     | `StagingDB.stage`                         | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / stage`                        | `sha256:7B5B6E9E8DFCC32168D9C29315AD8860B0A9B0306C8C615FF296FDBED2476AD5` |
| leaf       | schema     | `StagingDB.tsd`                           | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / tsd`                          | `sha256:ECA82F80B97D8DCDD41FF29A5C422301649A4B60E12E28CF97236ADB007AE626` |
| leaf       | schema     | `StagingDB.uccx`                          | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / uccx`                         | `sha256:76F3884DAAB2A8602C409FCA13309251FFAF2138901FA85056FFC8CB25CF7B5F` |
| leaf       | schema     | `StagingDB.Verint`                        | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / Verint`                       | `sha256:49229B46381D4BC6869855447225750D43ECC6BC617327D7534FFB3E03D42E2D` |
| leaf       | schema     | `StagingDB.wrk`                           | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / wrk`                          | `sha256:83F3446C0FFA3193C05AC5CC2854DEB73BCC35ED1D8D46B97E05FF0E66400B4C` |
| leaf       | schema     | `StagingDB.XTime`                         | `Sonic Data Lineage / Database Catalog / SQL Server / StagingDB / XTime`                        | `sha256:49C8824E31D0896A154C94367D86C7663C9868F50D257A87ECA03B2D65585C24` |
| leaf       | schema     | `TitleTracking.dbo`                       | `Sonic Data Lineage / Database Catalog / SQL Server / TitleTracking / dbo`                      | `sha256:192BF3390B606ED699F1B676604767C09B010A39BD2BAD8929157E3B028F43A8` |
| leaf       | schema     | `VehicleMart.BlackBook`                   | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / BlackBook`                  | `sha256:8C24A188D48566E892C23E6F64D6BF792E1C5573D40DC8DF2ACFD4FE461DCA03` |
| leaf       | schema     | `VehicleMart.Chrome`                      | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome`                     | `sha256:7AACFD24082DB13F83BFE530B68C9491702E3623C4FC714ABFF75BD9B2BF89B7` |
| leaf       | schema     | `VehicleMart.dbo`                         | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / dbo`                        | `sha256:55A2142E789657B77B18E7A91864D1FDCA083BAB6065EBD4B1F101CD1C6BB114` |
| leaf       | schema     | `VehicleMart.Final`                       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Final`                      | `sha256:9B88E3D8BDE31D837A371D8F3E46FC30AC85BA1659C60CE3ED60DDA587577587` |
| leaf       | schema     | `VehicleMart.Stage`                       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Stage`                      | `sha256:B9CC497B4AB08F59A04333909D67CF75730D8B11B5E8B0BF3417D597B3D043A7` |
| leaf       | schema     | `VehicleMartETLWeekly.dbo`                | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMartETLWeekly / dbo`               | `sha256:09B8912203F6E4F29D32F19A785105D291D9A126C0EFFC04D1CAF8ACEAFAFEDB` |
| leaf       | schema     | `VendorData.acertus`                      | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / acertus`                     | `sha256:E38F998655412CD2046A348232E8E8C5CBA1B28E1BFDCC1C50DFF5F3B75BA75E` |
| leaf       | schema     | `VendorData.buyer`                        | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / buyer`                       | `sha256:4F4EABCE59BDD5B0D760E9C87E9B7EA64C16D64A00FCB81319C38260B477ECFA` |
| leaf       | schema     | `VendorData.callrevu`                     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / callrevu`                    | `sha256:EAB88F983E77F8C1C44AA1ECB35264403B36652AEE3CAE79D989A0C3C119130F` |
| leaf       | schema     | `VendorData.carnow`                       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / carnow`                      | `sha256:BB695A792C1D3318F344B5084DC6BB8F9185547CD57840C4B50FF22005AAF8BF` |
| leaf       | schema     | `VendorData.cba`                          | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / cba`                         | `sha256:48A9EFC5C94A7D055A477BC586FBFF26172FB7D5FAA71CD4E63929C65F174CD4` |
| leaf       | schema     | `VendorData.cri`                          | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / cri`                         | `sha256:1FE63AF9E754DA4138AC525B1FA62C4B4266E54370B9A52E782615CBD7963B4A` |
| leaf       | schema     | `VendorData.dagrp`                        | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dagrp`                       | `sha256:0C2FF4D9D5928B6194E09C835CE5292F83DAB6B2C68D331DEA2CBB3CC3461120` |
| leaf       | schema     | `VendorData.dbo`                          | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / dbo`                         | `sha256:F83E9DA281809ABE6D96A8EA5058A0D1F439BB1C91C22B18D3B8EAD527B6C569` |
| leaf       | schema     | `VendorData.ecommerce`                    | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / ecommerce`                   | `sha256:6197A68D6DA302A038964C74BCDFF6B0C35FA5380B8EF56129626427F7DF1652` |
| leaf       | schema     | `VendorData.Elead`                        | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Elead`                       | `sha256:66F009B5FDEB7B20525148D5C1667173C979ACC9D0636FDA74144A35A3AA8B01` |
| leaf       | schema     | `VendorData.Facebook`                     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Facebook`                    | `sha256:7F7DC841F39EB326E48D6688A2C189818431950990E42DE23243D2EF94BFE368` |
| leaf       | schema     | `VendorData.ga`                           | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / ga`                          | `sha256:D8D89D166161CD2F0AF1959759A2B13ED7C1777902FBF76F7A578981D93344D2` |
| leaf       | schema     | `VendorData.gad`                          | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / gad`                         | `sha256:DFD2DA8A04D1029B6D188DAAE5742CD56E5E08D31648321B09EB5ED318B70D13` |
| leaf       | schema     | `VendorData.gmb`                          | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / gmb`                         | `sha256:4693AFF261E5F40E82FC17778A0D2BDE8D14B2221523980B7E67661943F98C92` |
| leaf       | schema     | `VendorData.Google`                       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Google`                      | `sha256:F7F8733354DBAF1793B030E2A61392EE247471C6DBFDC73DC37B6E8B0019047A` |
| leaf       | schema     | `VendorData.happyfox`                     | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / happyfox`                    | `sha256:4001679247D9F80F5F2F0D0D642ED00FDC282BF1BB27D5382176D1227C751E22` |
| leaf       | schema     | `VendorData.ibex`                         | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / ibex`                        | `sha256:E0BA2B99979BAF57245D8D7526333E994D386285831A6034BFAE2628FF8B13C9` |
| leaf       | schema     | `VendorData.JMA`                          | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / JMA`                         | `sha256:7FB21B2E2731F98163752290FA08310B1056EB01077C936DB92987865B3CEA82` |
| leaf       | schema     | `VendorData.mkt`                          | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / mkt`                         | `sha256:8DCEF6FA1C4281ECAC7A54847614D85C60EB7169D386BB4FA3CB21F52E359D35` |
| leaf       | schema     | `VendorData.recon`                        | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / recon`                       | `sha256:5E00BB10FE0558157D4D6BE2EFA2C8FC41AFF54ADED6A1EEEC0BE093AD467A04` |
| leaf       | schema     | `VendorData.RepMgmt`                      | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / RepMgmt`                     | `sha256:0833E72603BDB31FA0F90EC441A5542C7AD66BE045B7D3911FFE5AE64FEF6D7E` |
| leaf       | schema     | `VendorData.rpt`                          | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / rpt`                         | `sha256:3A080991869E930680B7F5BD5DE245ECF6BD98329E5CE679B983FB5C52FE6839` |
| leaf       | schema     | `VendorData.sonicdw`                      | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / sonicdw`                     | `sha256:66449078E617D302B741CE251FEFE0BFBA21260D2C1CF452587D52E5235E027B` |
| leaf       | schema     | `VendorData.src`                          | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / src`                         | `sha256:06D17CC91ABA9720792502183543854F0E78AE86F2DD7FC6E23E269DC1740DB2` |
| leaf       | schema     | `VendorData.street`                       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / street`                      | `sha256:C97CAFD0E66F62C48A526B341439E82B2C11273E698A54E2F3ED9F8FB5CC3A5D` |
| leaf       | schema     | `VendorData.tsd`                          | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / tsd`                         | `sha256:9088B1E8E7B59ED085FA7F204517AD0D713EC91760E0FCC5DDECFB182EBA7B90` |
| leaf       | schema     | `VendorData.uccx`                         | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uccx`                        | `sha256:419A515B364BC3ADA148B7273F4B0FC0EE0109DD17858DC1EF02F3AF9B3A0984` |
| leaf       | schema     | `VendorData.uipath`                       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / uipath`                      | `sha256:7C48A8A821F4856202C8BEDF90CAE74D3A6F079D901FE1EE6C509A1E7126C4FB` |
| leaf       | schema     | `VendorData.Verint`                       | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / Verint`                      | `sha256:38C86A612FA19D4AD7F1F62663B54932688EB82FE6F57BF3FAB0D09E68E91202` |
| leaf       | schema     | `VendorData.xTime`                        | `Sonic Data Lineage / Database Catalog / SQL Server / VendorData / xTime`                       | `sha256:074FD773733208E08D995E3575A9C6B98338C9E6BC420CA7F3D4E1BFC5EBC566` |
| leaf       | schema     | `WebV.dbo`                                | `Sonic Data Lineage / Database Catalog / SQL Server / WebV / dbo`                               | `sha256:FE23143E0D350B51D03ABF350508B6A6B5B5EED8930B10A8484387AF5E2333E9` |
| leaf       | schema     | `webvEP.dbo`                              | `Sonic Data Lineage / Database Catalog / SQL Server / webvEP / dbo`                             | `sha256:DDFB3A8CA388B37205F435BB8F29A85858C14C845612F3C8F7132CDFD0205E99` |

## SSIS Boundary

The packet excludes `ssisdb` package and dataset artifacts from Database
Catalog publication. They remain in SSIS support documentation.

The packet intentionally retains the separate cataloged database named `SSIS`
with its `Meta` schema because it is a real database table entry, not an
`ssisdb` package/catalog artifact.

## Cleanup Candidates

Cleanup is not authorized by this packet.

| Signal                             | Value                                                                |
| ---------------------------------- | -------------------------------------------------------------------- |
| Cleanup candidates                 | 344                                                                  |
| Cleanup allowed                    | No                                                                   |
| Separate cleanup approval required | Yes                                                                  |
| Cleanup report                     | `data/confluence/human-catalog-dry-run/superseded-pages-report.json` |

## Approval To Publish

To publish this packet, the user must explicitly approve live publish for:

`Sonic Data Lineage / Database Catalog`

The publish command should use the JSON packet path:

```powershell
node scripts\publish-human-confluence-catalog-pilot.mjs --packet docs/confluence-full-database-catalog-deployment/FDP-03-tier1-publish-packet.json --publish
```

Do not run cleanup commands from this approval.

## Rollback Notes

- Updated Confluence pages can be restored from Confluence page history.
- Created pages are labeled with the required labels in this packet for targeted
  review if rollback is approved.
- Cleanup candidates remain untouched, so old navigation remains available
  until a separate cleanup packet is approved.
- If validation fails after publish, stop and do not run cleanup.

## Validation

- No packet validation failures.

## Source Artifacts

- Dry-run manifest: `data/confluence/human-catalog-dry-run/manifest.json`
- Inventory: `data/confluence/full-database-catalog-deployment/inventory.json`
- Superseded report: `data/confluence/human-catalog-dry-run/superseded-pages-report.json`
