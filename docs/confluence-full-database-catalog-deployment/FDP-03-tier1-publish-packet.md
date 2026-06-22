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
| Generated at      | 2026-06-19T16:14:08.316Z                                              |
| Canonical root    | `Sonic Data Lineage / Database Catalog`                               |
| Publish mode      | `reviewed publish packet; no live publish performed`                  |
| Cleanup mode      | `report-only; no cleanup authorized`                                  |
| Required labels   | `human-lineage-catalog`, `database-catalog`, `database-catalog-tier1` |
| Validation status | `passed`                                                              |

## Page Counts

| Signal                                         | Value |
| ---------------------------------------------- | ----- |
| Planned navigation pages                       | 1     |
| Planned database pages                         | 32    |
| Planned schema pages                           | 145   |
| Planned leaf pages                             | 177   |
| Planned total pages                            | 178   |
| Included objects represented on schema indexes | 5134  |
| Excluded SSIS package/catalog artifacts        | 2051  |
| Superseded cleanup candidates                  | 170   |

## Database Coverage

| Database               | Schemas | Objects | Types                                                                |
| ---------------------- | ------- | ------- | -------------------------------------------------------------------- |
| `BI_WorkDB`            | 1       | 21      | table (21)                                                           |
| `CBS`                  | 2       | 5       | table (5)                                                            |
| `ContentManagement`    | 1       | 1       | table (1)                                                            |
| `DA_SIMS_EP`           | 3       | 7       | table (7)                                                            |
| `DASimsRetail`         | 1       | 4       | table (4)                                                            |
| `DMS`                  | 1       | 38      | table (38)                                                           |
| `echoparkwebv_veh`     | 1       | 29      | table (29)                                                           |
| `eLeadDW`              | 1       | 55      | table (55)                                                           |
| `eLeadDW_SF`           | 1       | 136     | table (136)                                                          |
| `eRIMS`                | 1       | 6       | table (6)                                                            |
| `ETL_Staging`          | 23      | 1703    | table (1332), procedure (221), view (138), function (6), synonym (6) |
| `Google`               | 1       | 5       | table (5)                                                            |
| `GPA`                  | 1       | 12      | table (12)                                                           |
| `HRData`               | 1       | 6       | table (6)                                                            |
| `NVPImport`            | 1       | 3       | table (3)                                                            |
| `ProcessManagement`    | 1       | 1       | table (1)                                                            |
| `SIMS6200_EP`          | 1       | 26      | table (26)                                                           |
| `SIMS6200Retail`       | 2       | 28      | table (28)                                                           |
| `SIMSEP`               | 1       | 1       | table (1)                                                            |
| `SIMSRT`               | 1       | 6       | table (6)                                                            |
| `Sonic_DW`             | 12      | 1746    | table (1023), view (385), procedure (324), synonym (8), function (6) |
| `Sonic_Xref`           | 1       | 3       | table (3)                                                            |
| `SONICWEBV_VEH`        | 1       | 9       | table (9)                                                            |
| `Speed`                | 4       | 5       | table (5)                                                            |
| `SSIS`                 | 1       | 1       | table (1)                                                            |
| `StagingDB`            | 41      | 846     | table (746), procedure (86), view (11), synonym (2), function (1)    |
| `TitleTracking`        | 1       | 4       | table (4)                                                            |
| `VehicleMart`          | 5       | 45      | table (45)                                                           |
| `VehicleMartETLWeekly` | 1       | 1       | table (1)                                                            |
| `VendorData`           | 30      | 312     | table (202), procedure (70), view (34), function (3), synonym (3)    |
| `WebV`                 | 1       | 39      | table (39)                                                           |
| `webvEP`               | 1       | 30      | table (30)                                                           |

## Pages To Create Or Update

| Kind       | Type       | Title                      | Path                                                                 | Evidence                                                                  |
| ---------- | ---------- | -------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| navigation | navigation | `Database Catalog`         | `Sonic Data Lineage / Database Catalog`                              | navigation page                                                           |
| leaf       | database   | `BI_WorkDB`                | `Sonic Data Lineage / Database Catalog / BI_WorkDB`                  | `sha256:53F4B9847C14B9D8C7FFDD8948A6E45EADE5DB0B9F6DDBC347270045054EACF7` |
| leaf       | database   | `CBS`                      | `Sonic Data Lineage / Database Catalog / CBS`                        | `sha256:DF6C717E61BCC37F7C9E1C4A6752190E61906787355FE6406F0E21CDF82ADF0C` |
| leaf       | database   | `ContentManagement`        | `Sonic Data Lineage / Database Catalog / ContentManagement`          | `sha256:1D995BC1818C2ACADF35FD3F1453B61C7828BD26272F85E68967AC41DA54E1B0` |
| leaf       | database   | `DA_SIMS_EP`               | `Sonic Data Lineage / Database Catalog / DA_SIMS_EP`                 | `sha256:58FA1B6505191C536ACAF3EF4B51D66F1F981AE22518B2C117049B4B20C08C71` |
| leaf       | database   | `DASimsRetail`             | `Sonic Data Lineage / Database Catalog / DASimsRetail`               | `sha256:76A2F4F9B72A29AE5D33F55A9CE4298B2E8BBA6742CC45C26AA69670675EF83E` |
| leaf       | database   | `DMS`                      | `Sonic Data Lineage / Database Catalog / DMS`                        | `sha256:01682BD1DFD64ED451D48BBD06625F6C5BDB78641D79C3326119C03B6C2D8638` |
| leaf       | database   | `echoparkwebv_veh`         | `Sonic Data Lineage / Database Catalog / echoparkwebv_veh`           | `sha256:8B450D92E44E79E55B9EF4BE11572070FF9389C9599DDBBBE4702A81A1CD7577` |
| leaf       | database   | `eLeadDW`                  | `Sonic Data Lineage / Database Catalog / eLeadDW`                    | `sha256:23A68C653D4658F39BBE7A148271AA8E9463C803D5376CEB5780E062B3040122` |
| leaf       | database   | `eLeadDW_SF`               | `Sonic Data Lineage / Database Catalog / eLeadDW_SF`                 | `sha256:3765571CAB4FA33497D2B6F37167FEB6512798FE2FCF12DC1B06BBC0650AD283` |
| leaf       | database   | `eRIMS`                    | `Sonic Data Lineage / Database Catalog / eRIMS`                      | `sha256:9C3ACD93C3A961951CC74934A2A18D228971F13F585ED01C30A53CD38DB3DBDF` |
| leaf       | database   | `ETL_Staging`              | `Sonic Data Lineage / Database Catalog / ETL_Staging`                | `sha256:D70BC88E887FB809E744DA1B5F45824450F4DE773A89A2C0D460C1386BED1D17` |
| leaf       | database   | `Google`                   | `Sonic Data Lineage / Database Catalog / Google`                     | `sha256:6AD5FF3E4FB74B7CB0AB962C6D550693C0DC623391598AFD2785FCF41DAAC6A7` |
| leaf       | database   | `GPA`                      | `Sonic Data Lineage / Database Catalog / GPA`                        | `sha256:6424E7E4E0FE80A679FF3E454C30804421BDC7CF64AF9302D6AE313E5CA0F5DD` |
| leaf       | database   | `HRData`                   | `Sonic Data Lineage / Database Catalog / HRData`                     | `sha256:2B6EFCC2C1E2312D2C828366860ABB4973BAE9A94AA63F62F8D857D4D293E300` |
| leaf       | database   | `NVPImport`                | `Sonic Data Lineage / Database Catalog / NVPImport`                  | `sha256:1B1004A5B3AE641B6A8B544F3FD388AD9D1AAF82DAF203A14A13079762F6CDEB` |
| leaf       | database   | `ProcessManagement`        | `Sonic Data Lineage / Database Catalog / ProcessManagement`          | `sha256:6FDE16DDC024583574DA406D0C6C1EB8064940C17619AD0AA42A3AA62D97DAB5` |
| leaf       | database   | `SIMS6200_EP`              | `Sonic Data Lineage / Database Catalog / SIMS6200_EP`                | `sha256:52F200BDFB5F45346AD04B24B199AA7C619B1D420F98D2B537AC96E371210D09` |
| leaf       | database   | `SIMS6200Retail`           | `Sonic Data Lineage / Database Catalog / SIMS6200Retail`             | `sha256:72A66CED3E63F749E4861E42C1802CF5990FBBCB36E7E09780AF2BBF5A14F3A8` |
| leaf       | database   | `SIMSEP`                   | `Sonic Data Lineage / Database Catalog / SIMSEP`                     | `sha256:67FE1528A8B24131832563A494965F9644EEE161E713CD357ED0D58643CECF37` |
| leaf       | database   | `SIMSRT`                   | `Sonic Data Lineage / Database Catalog / SIMSRT`                     | `sha256:AAE916047A2C1CC23F4575CAB3148D1849A3D51EB2D87154302F819DF9D5C865` |
| leaf       | database   | `Sonic_DW`                 | `Sonic Data Lineage / Database Catalog / Sonic_DW`                   | `sha256:9966327B06C4C08C8B8F440ACB75B8DB1DF25EF7E6CAB77DF5FC08AE7563F792` |
| leaf       | database   | `Sonic_Xref`               | `Sonic Data Lineage / Database Catalog / Sonic_Xref`                 | `sha256:9D15E36B7280C4CEEDBA33BD9E90EFEE8D6536ACCD2FCD2AA32F970E4B622F67` |
| leaf       | database   | `SONICWEBV_VEH`            | `Sonic Data Lineage / Database Catalog / SONICWEBV_VEH`              | `sha256:D54A481853C213932B53A75034D5819DE06C510A150A25E00A02DEBFE7B5C529` |
| leaf       | database   | `Speed`                    | `Sonic Data Lineage / Database Catalog / Speed`                      | `sha256:6F78A21D3C3C74DAF12DFD74A8B94A7F9E299F0F7B4EE483417F024D608259C6` |
| leaf       | database   | `SSIS`                     | `Sonic Data Lineage / Database Catalog / SSIS`                       | `sha256:BF289250EE51BE6196528874A0559DF2D20221546655D13B5651D88244B304A6` |
| leaf       | database   | `StagingDB`                | `Sonic Data Lineage / Database Catalog / StagingDB`                  | `sha256:4D7AD7AD1E38A103CDD6D5E4816B497815ECED452AA89F3CA9013DAEE0F4BD00` |
| leaf       | database   | `TitleTracking`            | `Sonic Data Lineage / Database Catalog / TitleTracking`              | `sha256:B76EAB5EF52581BE5BD40BFDB892528378F87AE9FB0B2EFEF25E9250C3CC778A` |
| leaf       | database   | `VehicleMart`              | `Sonic Data Lineage / Database Catalog / VehicleMart`                | `sha256:E22D8FFA69ABC82523C225E5FF4F061CE0D26CC89109A5DC8862D0D4811CBDE8` |
| leaf       | database   | `VehicleMartETLWeekly`     | `Sonic Data Lineage / Database Catalog / VehicleMartETLWeekly`       | `sha256:B95BD5E6E360F3059AD77D4823F33A72D0FB4FDFEC71EAE7654A8F0073C45D11` |
| leaf       | database   | `VendorData`               | `Sonic Data Lineage / Database Catalog / VendorData`                 | `sha256:43E9769B6ED33496F825251996EBD3BA7DD32FC776B735FBF8795228E9650EB0` |
| leaf       | database   | `WebV`                     | `Sonic Data Lineage / Database Catalog / WebV`                       | `sha256:19FC1E8B1418027E039E05715AE1CC064F8D221D7FB5520F84080539A82653A8` |
| leaf       | database   | `webvEP`                   | `Sonic Data Lineage / Database Catalog / webvEP`                     | `sha256:8772AF4F970F6BD63247A56ED4CD8CA0347487392AA5626E23AC2E01EF3B63EB` |
| leaf       | schema     | `BI_WorkDB.dbo`            | `Sonic Data Lineage / Database Catalog / BI_WorkDB / dbo`            | `sha256:33E16383B04F7497AC5B0C752BCD1AC9570B7DAC830D2D267730DAEDC32A2441` |
| leaf       | schema     | `CBS.dbo`                  | `Sonic Data Lineage / Database Catalog / CBS / dbo`                  | `sha256:2DECDCB6EB274DA992C99FD2A01B643ADB3BF08304BD142D74901F8AC403C967` |
| leaf       | schema     | `CBS.wrk`                  | `Sonic Data Lineage / Database Catalog / CBS / wrk`                  | `sha256:9D0921DCCE34EC6D5998923CECABD064F4CACF1CB25044856247B408BF16E533` |
| leaf       | schema     | `ContentManagement.wrk`    | `Sonic Data Lineage / Database Catalog / ContentManagement / wrk`    | `sha256:0C89D17FB647924EDE88424EB60D93AE2E20DE8BF914583AEC0D846BE1C3FBD7` |
| leaf       | schema     | `DA_SIMS_EP.BlackBook`     | `Sonic Data Lineage / Database Catalog / DA_SIMS_EP / BlackBook`     | `sha256:D8C2DF78D2510B65F792E5AD22086B9E0591B00ADF75A45C8AB36923D75FD41F` |
| leaf       | schema     | `DA_SIMS_EP.dbo`           | `Sonic Data Lineage / Database Catalog / DA_SIMS_EP / dbo`           | `sha256:A835C2707DBB7E155524789586E650973AA03638EE18DBCB86ED00A601E5C9A6` |
| leaf       | schema     | `DA_SIMS_EP.Stage`         | `Sonic Data Lineage / Database Catalog / DA_SIMS_EP / Stage`         | `sha256:E51F5DC09AF5633E77E61E207A32D4A755598EE580E2DC33B1EA2E99175E64CE` |
| leaf       | schema     | `DASimsRetail.dbo`         | `Sonic Data Lineage / Database Catalog / DASimsRetail / dbo`         | `sha256:DD7D2F2057A07DF1B80D77D8BE71F1F578BC34F2BAFF9C75BDDC5C9D267BCFA3` |
| leaf       | schema     | `DMS.dbo`                  | `Sonic Data Lineage / Database Catalog / DMS / dbo`                  | `sha256:CE9C00F8146016633F2416B8FAF456B431F8113037D36EF8478DD884BB316B9A` |
| leaf       | schema     | `echoparkwebv_veh.dbo`     | `Sonic Data Lineage / Database Catalog / echoparkwebv_veh / dbo`     | `sha256:5FD9C53DA40D95781F74696C24D6556B244B19B8365653CBFAD681C9F0FD961C` |
| leaf       | schema     | `eLeadDW.dbo`              | `Sonic Data Lineage / Database Catalog / eLeadDW / dbo`              | `sha256:5989120972A13CC3BB3016749FAE852711AE421924F5A1F7431163F92355CEF0` |
| leaf       | schema     | `eLeadDW_SF.dbo`           | `Sonic Data Lineage / Database Catalog / eLeadDW_SF / dbo`           | `sha256:A7197523126E0E8927882550C40C05A65297D893B18BAC452C5065545C61F307` |
| leaf       | schema     | `eRIMS.dbo`                | `Sonic Data Lineage / Database Catalog / eRIMS / dbo`                | `sha256:61BD1E1C6570345A72E6F217081E8208EFDF9DA006B5C42703752B17B46D9B21` |
| leaf       | schema     | `ETL_Staging.callrevu`     | `Sonic Data Lineage / Database Catalog / ETL_Staging / callrevu`     | `sha256:D13F752944F5DA4740CD9168B88A1304A7CBFAB1D292B59804E8396CA214452A` |
| leaf       | schema     | `ETL_Staging.Cars`         | `Sonic Data Lineage / Database Catalog / ETL_Staging / Cars`         | `sha256:35317088261ABDF9DD25020FB194DF53B8FA7E17C3A57C78575B2C62F6C8A264` |
| leaf       | schema     | `ETL_Staging.clean`        | `Sonic Data Lineage / Database Catalog / ETL_Staging / clean`        | `sha256:379112722E975D0C05F88D3456A1EB3C8E32320E9D12D7B7E4752809D1DA2309` |
| leaf       | schema     | `ETL_Staging.conform`      | `Sonic Data Lineage / Database Catalog / ETL_Staging / conform`      | `sha256:6EE1FF0AE3DC0B218C563A9F9952EE172F7FE46827770D2CE9AB82CC9DAC8984` |
| leaf       | schema     | `ETL_Staging.dbo`          | `Sonic Data Lineage / Database Catalog / ETL_Staging / dbo`          | `sha256:C35312BC887283DCCED1BBD7C9D199C44F6E3BD27326921005ABB901870D5933` |
| leaf       | schema     | `ETL_Staging.dms`          | `Sonic Data Lineage / Database Catalog / ETL_Staging / dms`          | `sha256:8642BFDB824036DD9C7E9AC84C420DEA78DA7298719E5778CF75AF86A39A6770` |
| leaf       | schema     | `ETL_Staging.eleadDW`      | `Sonic Data Lineage / Database Catalog / ETL_Staging / eleadDW`      | `sha256:CD6B4FB4713BDE07F7B82A8FC7CDE8048D6216935849348BCC5EB894AC41F8B4` |
| leaf       | schema     | `ETL_Staging.etl`          | `Sonic Data Lineage / Database Catalog / ETL_Staging / etl`          | `sha256:35A0C57196E0E61A26E1F1A6E38F06C0DA69648C6CFCAE579FF193ECD76831F9` |
| leaf       | schema     | `ETL_Staging.extract`      | `Sonic Data Lineage / Database Catalog / ETL_Staging / extract`      | `sha256:C1B1110F6377F3569A25A1F65B56B88B8793B53559FBE3FF0E35CB3E08CB17CB` |
| leaf       | schema     | `ETL_Staging.hfm`          | `Sonic Data Lineage / Database Catalog / ETL_Staging / hfm`          | `sha256:94F8DE698F262884CCF60A04492B70D8A9C84AFD52CB8A5C992B64343C90C36B` |
| leaf       | schema     | `ETL_Staging.HMN`          | `Sonic Data Lineage / Database Catalog / ETL_Staging / HMN`          | `sha256:D2A271837E968B071ADE3897E9A5574ED9F80278425F43C730D30F3F30518AD7` |
| leaf       | schema     | `ETL_Staging.JMA`          | `Sonic Data Lineage / Database Catalog / ETL_Staging / JMA`          | `sha256:E7F4DB25D3207C7508ADBC21B802DCF430D6C0DC3F68D060F3F70F3A95E35BB7` |
| leaf       | schema     | `ETL_Staging.load`         | `Sonic Data Lineage / Database Catalog / ETL_Staging / load`         | `sha256:A014EA2DEBAC3741AD05EC0669EA1ECA91D80AFBC75A38A7E48EA45D06DDE11B` |
| leaf       | schema     | `ETL_Staging.mdm`          | `Sonic Data Lineage / Database Catalog / ETL_Staging / mdm`          | `sha256:6B0D3E51C13F1123C486AA867CBB621642F3BC6D4397398A78E299D01003A375` |
| leaf       | schema     | `ETL_Staging.Meta`         | `Sonic Data Lineage / Database Catalog / ETL_Staging / Meta`         | `sha256:1F8B276926272891D65D30EC778B9B6188A98EA0E2E93BF137FF5D6E8C86ECFB` |
| leaf       | schema     | `ETL_Staging.perm`         | `Sonic Data Lineage / Database Catalog / ETL_Staging / perm`         | `sha256:E3DCCCE2FE19D805D6A408A2EA1BC3BF7E54CA054A9067190276C3A81EEFB9B8` |
| leaf       | schema     | `ETL_Staging.permsup`      | `Sonic Data Lineage / Database Catalog / ETL_Staging / permsup`      | `sha256:D0861FABD16A6596471E1CB111226297C078152CD063757015BDDFF7C81ABD1A` |
| leaf       | schema     | `ETL_Staging.pgc`          | `Sonic Data Lineage / Database Catalog / ETL_Staging / pgc`          | `sha256:DEA7DCA0CE5A24BACB0B829BB4D67BB3EC545099C78932643DCDCFF042936D83` |
| leaf       | schema     | `ETL_Staging.Security`     | `Sonic Data Lineage / Database Catalog / ETL_Staging / Security`     | `sha256:54EBEACD2620C3BBAF9007F80277CFFD356D9EAC3877ED90CD3048FC854FD366` |
| leaf       | schema     | `ETL_Staging.shr`          | `Sonic Data Lineage / Database Catalog / ETL_Staging / shr`          | `sha256:33D17BD7FD886A223CC610343F29FDB0A20E9406F16DB0B5F2A9CA45191A019E` |
| leaf       | schema     | `ETL_Staging.SIMS`         | `Sonic Data Lineage / Database Catalog / ETL_Staging / SIMS`         | `sha256:C9E02C95B6649899DFD7D6B1FA3E7D678027A553DDCEB79FCC4EC405129B0D5E` |
| leaf       | schema     | `ETL_Staging.stage`        | `Sonic Data Lineage / Database Catalog / ETL_Staging / stage`        | `sha256:4056723091A5065D89C9E16E410A32A60BAEF5CD17B270480C52BF1BE6223400` |
| leaf       | schema     | `ETL_Staging.wrk`          | `Sonic Data Lineage / Database Catalog / ETL_Staging / wrk`          | `sha256:133F28C74416AA870D507EA831527E14A335BBAE81F3422ED2E5F4B041F2B173` |
| leaf       | schema     | `Google.dbo`               | `Sonic Data Lineage / Database Catalog / Google / dbo`               | `sha256:E1D71F1AF676B52C70509FA46AF0D155C5FDF8A2511FC843AC2C43B59EE6EC12` |
| leaf       | schema     | `GPA.dbo`                  | `Sonic Data Lineage / Database Catalog / GPA / dbo`                  | `sha256:2866FBA2716202FACCB1B6C6C5E07B6B3BB3CEDB35A0336B7FC1AC49C7522E88` |
| leaf       | schema     | `HRData.dbo`               | `Sonic Data Lineage / Database Catalog / HRData / dbo`               | `sha256:26BCEC1F21261C7FD6ED056DBB8A496863AF3EFFCB8EAEB4C90496A3F77FD7A7` |
| leaf       | schema     | `NVPImport.dbo`            | `Sonic Data Lineage / Database Catalog / NVPImport / dbo`            | `sha256:66F484118EAF1E06ACC5932031F90C53EFAEDD1C73C230E0904C7C6E182E5687` |
| leaf       | schema     | `ProcessManagement.dbo`    | `Sonic Data Lineage / Database Catalog / ProcessManagement / dbo`    | `sha256:B8343ABDE704116EDA3515FEFABE74F462C7C10E7E635276BA5B563814A7690D` |
| leaf       | schema     | `SIMS6200_EP.dbo`          | `Sonic Data Lineage / Database Catalog / SIMS6200_EP / dbo`          | `sha256:DC0812BD73C745E9EDC4F028B5C667F6D84BDA0197930E0534DC28332F7A5D44` |
| leaf       | schema     | `SIMS6200Retail.dbo`       | `Sonic Data Lineage / Database Catalog / SIMS6200Retail / dbo`       | `sha256:58BB4147ACD4EE1EB2588F9318CEBD479817FE224F7546CF3022A04BD4F8A53E` |
| leaf       | schema     | `SIMS6200Retail.SIMS`      | `Sonic Data Lineage / Database Catalog / SIMS6200Retail / SIMS`      | `sha256:FFD8AFB01F2370022C5D657D8C703D3066087DAC4C8233BC9CC24FA175905C29` |
| leaf       | schema     | `SIMSEP.dbo`               | `Sonic Data Lineage / Database Catalog / SIMSEP / dbo`               | `sha256:BF56968FBDBEFC309F62C389E9AEE278EFBAFB70D243A2AA3DC3783E934C8A18` |
| leaf       | schema     | `SIMSRT.dbo`               | `Sonic Data Lineage / Database Catalog / SIMSRT / dbo`               | `sha256:7956AA60C9D103D7ACDDCEA94DA560335D882A7C53C794E4B47091E0C0ECCCD3` |
| leaf       | schema     | `Sonic_DW.darpts`          | `Sonic Data Lineage / Database Catalog / Sonic_DW / darpts`          | `sha256:9E10CF9F62D4863D22286B812B7CD83AE9CC3547D85B6B68E74E8C30466AC805` |
| leaf       | schema     | `Sonic_DW.dbo`             | `Sonic Data Lineage / Database Catalog / Sonic_DW / dbo`             | `sha256:CCD3517ED49B3D25B93EE044AEBF17FECEF39B96EFBCCA9AA2214F598F8DAADC` |
| leaf       | schema     | `Sonic_DW.dq`              | `Sonic Data Lineage / Database Catalog / Sonic_DW / dq`              | `sha256:A5CD7398E9E660619277AC72691E1A9BF736E5C666BF9580D964C031F55425B3` |
| leaf       | schema     | `Sonic_DW.err`             | `Sonic Data Lineage / Database Catalog / Sonic_DW / err`             | `sha256:D00E7F0CD147B556E279DA1AB2BC5B74C88D9D1C895B63C6FE72BDF4A4DE8295` |
| leaf       | schema     | `Sonic_DW.kpi`             | `Sonic Data Lineage / Database Catalog / Sonic_DW / kpi`             | `sha256:FF5DCD4C89873B9DDD6F27BAAEC510FC9E41D5D18DE23594992566A3A6C553F7` |
| leaf       | schema     | `Sonic_DW.mdm`             | `Sonic Data Lineage / Database Catalog / Sonic_DW / mdm`             | `sha256:3CC11CB38133C4357A17480558760C9B8BE0CED7C641C0B5ACE4F2860A63088B` |
| leaf       | schema     | `Sonic_DW.Metric`          | `Sonic Data Lineage / Database Catalog / Sonic_DW / Metric`          | `sha256:23D1EC69475391649BF82FD5D5DAA0C5EDB307A580AD85EBB68A069DBB9E3D28` |
| leaf       | schema     | `Sonic_DW.MS`              | `Sonic Data Lineage / Database Catalog / Sonic_DW / MS`              | `sha256:1CD479343BFF86C9759E568686BFBB0178181E89B87B72D19C4F509565346393` |
| leaf       | schema     | `Sonic_DW.mstrtemp`        | `Sonic Data Lineage / Database Catalog / Sonic_DW / mstrtemp`        | `sha256:51BC0EF288611D8F0D533A4CAB5E090EC21B87F7798678829A262FFDD2E0654F` |
| leaf       | schema     | `Sonic_DW.razzle`          | `Sonic Data Lineage / Database Catalog / Sonic_DW / razzle`          | `sha256:C4B27FB62475560E1FE9195DE7DBD7711B433F4129C082B1B2DEE0EDC76A3C93` |
| leaf       | schema     | `Sonic_DW.stg`             | `Sonic Data Lineage / Database Catalog / Sonic_DW / stg`             | `sha256:DC5DDAC1CE535ABDFE4A77CD597B2CCC7C23AEC84CEB8077BDD2AA96E263A5CA` |
| leaf       | schema     | `Sonic_DW.wrk`             | `Sonic Data Lineage / Database Catalog / Sonic_DW / wrk`             | `sha256:51F87FD7EAED605DE906893FDA0560E3C8216B1B74FEADAABB665B9BFB596B28` |
| leaf       | schema     | `Sonic_Xref.dbo`           | `Sonic Data Lineage / Database Catalog / Sonic_Xref / dbo`           | `sha256:B690FB191D6E2F33B03FB4ABA073C294FFA924C22EB568FDDB9D265E5A6BA238` |
| leaf       | schema     | `SONICWEBV_VEH.dbo`        | `Sonic Data Lineage / Database Catalog / SONICWEBV_VEH / dbo`        | `sha256:9A1DCED50CE5F76A5F9E0B2F17FF4EA2E7A49E5C409AA80E07E141426CA17459` |
| leaf       | schema     | `Speed.Auto`               | `Sonic Data Lineage / Database Catalog / Speed / Auto`               | `sha256:D931A728DE6434D00AE92CD6EF6F2A4842BA014FBEDC9FBB1B9439DAD76785D8` |
| leaf       | schema     | `Speed.Cbrt`               | `Sonic Data Lineage / Database Catalog / Speed / Cbrt`               | `sha256:4A55066ED9040D66BF6ACD81AE712957084E8AC53A3E7E614B1A341530F60D25` |
| leaf       | schema     | `Speed.dbo`                | `Sonic Data Lineage / Database Catalog / Speed / dbo`                | `sha256:44C0B0D88606858F1AA0F16B9F88E027B1CD7CBB3E6380371A8A80233F368490` |
| leaf       | schema     | `Speed.DDC`                | `Sonic Data Lineage / Database Catalog / Speed / DDC`                | `sha256:6DE8DB8FAA6DA601B6A85862D000CD13135AADF06D2AB202C29311D209B7DD3F` |
| leaf       | schema     | `SSIS.Meta`                | `Sonic Data Lineage / Database Catalog / SSIS / Meta`                | `sha256:5BAF5C5DFF5CEF96A76A6CC2EDD743004BEFDA5EBB9A9D649705F31CBA3858A9` |
| leaf       | schema     | `StagingDB.acertus`        | `Sonic Data Lineage / Database Catalog / StagingDB / acertus`        | `sha256:168FDB9FD8FB9485CA89E9DB9B772D53BFD6575B473D381F103436F8646DBDA0` |
| leaf       | schema     | `StagingDB.Adv`            | `Sonic Data Lineage / Database Catalog / StagingDB / Adv`            | `sha256:C80FC12ACAF23BDB08135AFA4D780EE742CC54B8DA42B73056B11E6E512BBB13` |
| leaf       | schema     | `StagingDB.Audit`          | `Sonic Data Lineage / Database Catalog / StagingDB / Audit`          | `sha256:9FAA4E1E390A697769B89D16AF1304151058D85917D5E182D1BAE1B0509AC600` |
| leaf       | schema     | `StagingDB.Auto`           | `Sonic Data Lineage / Database Catalog / StagingDB / Auto`           | `sha256:308651F8100278BB8954F54E0E6A5BA25B73912EB675BF8CDA59C1FF1675E08A` |
| leaf       | schema     | `StagingDB.Black`          | `Sonic Data Lineage / Database Catalog / StagingDB / Black`          | `sha256:8882065E04CE907A83BD4BDF4FE2543B70F4B194EE07B7CCF025F73E838F6C49` |
| leaf       | schema     | `StagingDB.callrevu`       | `Sonic Data Lineage / Database Catalog / StagingDB / callrevu`       | `sha256:68A065DDF0A7B7B58C3754205BA74C5E06381DFB4BF24433952399D0D3619B3D` |
| leaf       | schema     | `StagingDB.carnow`         | `Sonic Data Lineage / Database Catalog / StagingDB / carnow`         | `sha256:3ED66AD1AF06D5DE14279626557618452E004163B60F3FA5958446F0CFE75668` |
| leaf       | schema     | `StagingDB.cars`           | `Sonic Data Lineage / Database Catalog / StagingDB / cars`           | `sha256:8911EAB645B6A9911BA0C962A4180825C7D7B3FABB06AE19CFDDAED46A41E0EE` |
| leaf       | schema     | `StagingDB.cba`            | `Sonic Data Lineage / Database Catalog / StagingDB / cba`            | `sha256:CCD858D45E160CC1048438C8B2A95D5A6BAE1EB4C350EB0326C26AD3AF008C8E` |
| leaf       | schema     | `StagingDB.cbrt`           | `Sonic Data Lineage / Database Catalog / StagingDB / cbrt`           | `sha256:3B6F7BD168E89F1A42A5F376E8A9B27C7DF790B6C3ECEF8BCC52683D5C9827DC` |
| leaf       | schema     | `StagingDB.dabe`           | `Sonic Data Lineage / Database Catalog / StagingDB / dabe`           | `sha256:241966D36D0F3E5EF0978F00196E5B184C43BFBE13684E8E533440EC98CA8100` |
| leaf       | schema     | `StagingDB.dbo`            | `Sonic Data Lineage / Database Catalog / StagingDB / dbo`            | `sha256:F78123C412AB54B335D4D0DBB2080D05F206B2EF604BC0130AE18270ED6B8493` |
| leaf       | schema     | `StagingDB.ddc`            | `Sonic Data Lineage / Database Catalog / StagingDB / ddc`            | `sha256:082A1687F24EDC401B75E07E7C7739FC3B5DBE08BFFAE4B3BBB178A9DCC181E4` |
| leaf       | schema     | `StagingDB.easy`           | `Sonic Data Lineage / Database Catalog / StagingDB / easy`           | `sha256:9CEC1301405C860798F8514F427ADA771FBB776D01B6F554B5C44986307E4AAE` |
| leaf       | schema     | `StagingDB.Elead`          | `Sonic Data Lineage / Database Catalog / StagingDB / Elead`          | `sha256:B3F0B5CB7335EC2A232AA617EEA2E843FA4259C8F164D61B8B00426396D16184` |
| leaf       | schema     | `StagingDB.etl`            | `Sonic Data Lineage / Database Catalog / StagingDB / etl`            | `sha256:6CE065A19C8541030623C4344466CB0149AF627B2F7F73A6EC96D8A1A4F1CDA7` |
| leaf       | schema     | `StagingDB.Facebook`       | `Sonic Data Lineage / Database Catalog / StagingDB / Facebook`       | `sha256:639389019C065FFB3700FE4C475E64A39C701FB802E6346A5520CB84DCE987CD` |
| leaf       | schema     | `StagingDB.ga`             | `Sonic Data Lineage / Database Catalog / StagingDB / ga`             | `sha256:46C64C4CEE335B9B7793012A1C9A8706C974BAF6AF1E04B9C015852779AE2EC0` |
| leaf       | schema     | `StagingDB.gad`            | `Sonic Data Lineage / Database Catalog / StagingDB / gad`            | `sha256:B7AC2543250BB0D381B98DDF2ECE2CC92C26AED6C08CC6B432E5C2F90AC4A160` |
| leaf       | schema     | `StagingDB.gl`             | `Sonic Data Lineage / Database Catalog / StagingDB / gl`             | `sha256:DEFFBE7DFEBA4E1398D8E84AB5D61824193BB08101F542559478CA8A381A81CB` |
| leaf       | schema     | `StagingDB.gmb`            | `Sonic Data Lineage / Database Catalog / StagingDB / gmb`            | `sha256:6C52772B402B1ACD908F0E45C32B3324B51AA4AFC48CB8062782A557F64A23FC` |
| leaf       | schema     | `StagingDB.Gold`           | `Sonic Data Lineage / Database Catalog / StagingDB / Gold`           | `sha256:7BB0954FEA69C1E92D896B25C1D830BFFBD8BD6248AA11841A9B030DA59E2840` |
| leaf       | schema     | `StagingDB.Google`         | `Sonic Data Lineage / Database Catalog / StagingDB / Google`         | `sha256:25A406707E01D54C9AC35E5BDC13210510CECF2F9CE530EE14CDF32CDBECAC24` |
| leaf       | schema     | `StagingDB.happyfox`       | `Sonic Data Lineage / Database Catalog / StagingDB / happyfox`       | `sha256:ACD38F5E2D7A60B319E1E89E56DD310760342F389EFA352C40F44ED2B4791474` |
| leaf       | schema     | `StagingDB.HFM`            | `Sonic Data Lineage / Database Catalog / StagingDB / HFM`            | `sha256:4266A0E2D0990A16767BA84106D73B0E419B0CCF6148C0F13179A65B9E5F232E` |
| leaf       | schema     | `StagingDB.ibex`           | `Sonic Data Lineage / Database Catalog / StagingDB / ibex`           | `sha256:5C42D71207931BEADF147390696DD3BA4705A3A150F2EFCEA133BE85E78A5F63` |
| leaf       | schema     | `StagingDB.JMA`            | `Sonic Data Lineage / Database Catalog / StagingDB / JMA`            | `sha256:A4BB0F3E0F92986DCFC49781EE2F4296C06257185DBAF2E9069A753FE38F0E4A` |
| leaf       | schema     | `StagingDB.jump`           | `Sonic Data Lineage / Database Catalog / StagingDB / jump`           | `sha256:36D81F31CE9A52E8E95784526DE48A3B8FB52B917886C875AEACC074296A482C` |
| leaf       | schema     | `StagingDB.mdp`            | `Sonic Data Lineage / Database Catalog / StagingDB / mdp`            | `sha256:269740AB8E411ACE4088E118D567572D8A51D683093D6DF836FC79C4BD88DFEF` |
| leaf       | schema     | `StagingDB.pgc`            | `Sonic Data Lineage / Database Catalog / StagingDB / pgc`            | `sha256:B81F2C46370741A2E6A46B278DDE49DA880AFAA5923748011C8E972CCA384249` |
| leaf       | schema     | `StagingDB.pgw`            | `Sonic Data Lineage / Database Catalog / StagingDB / pgw`            | `sha256:8CF8E023E7376DF93B9AC185AFB1F6EB4E210CBC9575C82016EAD5753AFC76C7` |
| leaf       | schema     | `StagingDB.Polk`           | `Sonic Data Lineage / Database Catalog / StagingDB / Polk`           | `sha256:913F87B423982887B8AA7147BFC2E592D50742537E091E34296CF9FBBF6FB4B1` |
| leaf       | schema     | `StagingDB.RepMgmt`        | `Sonic Data Lineage / Database Catalog / StagingDB / RepMgmt`        | `sha256:F3551021FA11FB9B838E2AECF821E655547ECCDCB8B80957066E183BA0EF1EEF` |
| leaf       | schema     | `StagingDB.RtlU`           | `Sonic Data Lineage / Database Catalog / StagingDB / RtlU`           | `sha256:0527B52F95E520AD17119E096D8F82626DE4DAFB0983742223550F24B798138D` |
| leaf       | schema     | `StagingDB.Security`       | `Sonic Data Lineage / Database Catalog / StagingDB / Security`       | `sha256:8619FEAEE59BF897A104A72D55BF2C23BC0A46A8B7FC803CF7FFCC2F12754306` |
| leaf       | schema     | `StagingDB.stage`          | `Sonic Data Lineage / Database Catalog / StagingDB / stage`          | `sha256:FDD36680D4B9DE4BF2A948E621CF7E4EB6AA156D114227DD55CE5473E9BC7A63` |
| leaf       | schema     | `StagingDB.tsd`            | `Sonic Data Lineage / Database Catalog / StagingDB / tsd`            | `sha256:EEB38EED2D0DCB4D56BCFE4B6DD5EA48443FCCEB8B1C424D3C9708E60DC6B91A` |
| leaf       | schema     | `StagingDB.uccx`           | `Sonic Data Lineage / Database Catalog / StagingDB / uccx`           | `sha256:FDE51B3B35F0725528D7B1DF73E7A3B98FF79119F6C80F0EA60C7AE8A69BCB04` |
| leaf       | schema     | `StagingDB.Verint`         | `Sonic Data Lineage / Database Catalog / StagingDB / Verint`         | `sha256:F564F461FA90EF1230CBB106A437FD4C2518E818D6B15125AB7A6BCE60A9D24A` |
| leaf       | schema     | `StagingDB.wrk`            | `Sonic Data Lineage / Database Catalog / StagingDB / wrk`            | `sha256:902887FE5E16340A6FF6D3A5ADDF1DD65EF20C64B44B7E98988690AFD5D7712F` |
| leaf       | schema     | `StagingDB.XTime`          | `Sonic Data Lineage / Database Catalog / StagingDB / XTime`          | `sha256:EBD4310290DACC3491BF225976C05AB431D797B0D64D1D42ED9F62B29C3E26D0` |
| leaf       | schema     | `TitleTracking.dbo`        | `Sonic Data Lineage / Database Catalog / TitleTracking / dbo`        | `sha256:6422C644D4BD92F130674D00A69CCF65FBB2BEE4F56370D4DD845199B1082CC0` |
| leaf       | schema     | `VehicleMart.BlackBook`    | `Sonic Data Lineage / Database Catalog / VehicleMart / BlackBook`    | `sha256:C9747CD336A16DAADA9A8279BE1E7CE6E8E004EF5DE1762F0A409A319FDAFFBA` |
| leaf       | schema     | `VehicleMart.Chrome`       | `Sonic Data Lineage / Database Catalog / VehicleMart / Chrome`       | `sha256:F8BC0DB9DE5CCE7F2A68355EEB2C109C1B8B4831E66252767D42E96A2BB7A0AD` |
| leaf       | schema     | `VehicleMart.dbo`          | `Sonic Data Lineage / Database Catalog / VehicleMart / dbo`          | `sha256:5309160A75EB898AD5740C5262885633A590B5A5AAE3DC864D338F5F987B41B6` |
| leaf       | schema     | `VehicleMart.Final`        | `Sonic Data Lineage / Database Catalog / VehicleMart / Final`        | `sha256:B4932645CE7147FF1241DB18C29AAC73C8033C8C54AB219E906F2A09D1783A0C` |
| leaf       | schema     | `VehicleMart.Stage`        | `Sonic Data Lineage / Database Catalog / VehicleMart / Stage`        | `sha256:78DB49BE8395E9311E93BCA1041A961721A3A6270414EADD6A7E2EB934B55EEE` |
| leaf       | schema     | `VehicleMartETLWeekly.dbo` | `Sonic Data Lineage / Database Catalog / VehicleMartETLWeekly / dbo` | `sha256:1B67BC296061E42D66C98326EBC972E4E1B95EEC9F864DB8D13EB3208D1023F7` |
| leaf       | schema     | `VendorData.acertus`       | `Sonic Data Lineage / Database Catalog / VendorData / acertus`       | `sha256:4BB0094FE1AC647B2F5354052CE55D8DFE2390990EB4F6304BEEF1C331B7DB06` |
| leaf       | schema     | `VendorData.buyer`         | `Sonic Data Lineage / Database Catalog / VendorData / buyer`         | `sha256:BC61994867AF5E346E71B0022AF660A11A9C27C0A96215FA04CBFFB3B36974A9` |
| leaf       | schema     | `VendorData.callrevu`      | `Sonic Data Lineage / Database Catalog / VendorData / callrevu`      | `sha256:D4AA8CE7F9E6EDF3F85EA5124D2B5F0CDA1F39B51337486586892C1458BBA88A` |
| leaf       | schema     | `VendorData.carnow`        | `Sonic Data Lineage / Database Catalog / VendorData / carnow`        | `sha256:6E6889B8DFF49F55BAC2B0E7A23E3AF21946E5067EA745DF1F69E6AAC238963D` |
| leaf       | schema     | `VendorData.cba`           | `Sonic Data Lineage / Database Catalog / VendorData / cba`           | `sha256:3F0A1905E2A1DBFB4DB8D77959F38DD0C079C66C6C0E4BFD4BEC31E6F003A1C4` |
| leaf       | schema     | `VendorData.cri`           | `Sonic Data Lineage / Database Catalog / VendorData / cri`           | `sha256:6FAF8B02A993B3E3A0C6CFECFCB71904FFB57D50B1018DAF17646A326D370B55` |
| leaf       | schema     | `VendorData.dagrp`         | `Sonic Data Lineage / Database Catalog / VendorData / dagrp`         | `sha256:905FB0F86C16AFFF2E7B78E0BF5F734010A59CC19A31EB60D737AD015EC21A3E` |
| leaf       | schema     | `VendorData.dbo`           | `Sonic Data Lineage / Database Catalog / VendorData / dbo`           | `sha256:7B8C1D0C501C6421A1E5DE0141D2D17E0CABECB3C7DE16A0DC7B437A77FB47FA` |
| leaf       | schema     | `VendorData.ecommerce`     | `Sonic Data Lineage / Database Catalog / VendorData / ecommerce`     | `sha256:72936B2FD8883B6E52D00C3EFEA887F83AF3E86AE9FF480055FE820C5E425D75` |
| leaf       | schema     | `VendorData.Elead`         | `Sonic Data Lineage / Database Catalog / VendorData / Elead`         | `sha256:2487ED3700609945806B0DAB1F0ACBA2477876A9999B56B50D7985CF450ABC95` |
| leaf       | schema     | `VendorData.Facebook`      | `Sonic Data Lineage / Database Catalog / VendorData / Facebook`      | `sha256:BBAC9E4DCFA535DCC837628F9D5C23F7D03DA8A0FB641CB5654B83D6789D6AEF` |
| leaf       | schema     | `VendorData.ga`            | `Sonic Data Lineage / Database Catalog / VendorData / ga`            | `sha256:D4953A77B7E3EB576614406E368989300B8F1A26E37F3C2D0C87AD87B124458D` |
| leaf       | schema     | `VendorData.gad`           | `Sonic Data Lineage / Database Catalog / VendorData / gad`           | `sha256:7B87D0DC1DEEBFBB6C5F605CC39DEF6B5A4613A653803C92730B9585BFC6895E` |
| leaf       | schema     | `VendorData.gmb`           | `Sonic Data Lineage / Database Catalog / VendorData / gmb`           | `sha256:5C8791C9840C0B7D081CB0C69362BE2644100A1FBF18BE9A6DA6737EB7C28E5B` |
| leaf       | schema     | `VendorData.Google`        | `Sonic Data Lineage / Database Catalog / VendorData / Google`        | `sha256:059203A6930495902D4C16E9BAD365C537F9864C5845524D9EAEBB3C5ABC25DE` |
| leaf       | schema     | `VendorData.happyfox`      | `Sonic Data Lineage / Database Catalog / VendorData / happyfox`      | `sha256:F730DB06FAD56B3CA53E0345470BBFE93B75D8BEFAC5380EE24133AD8FE2D42B` |
| leaf       | schema     | `VendorData.ibex`          | `Sonic Data Lineage / Database Catalog / VendorData / ibex`          | `sha256:6BB29B803A0C0C1F3548DA51D430B2E504B5FC1FF3AD62D8012789762BB343D6` |
| leaf       | schema     | `VendorData.JMA`           | `Sonic Data Lineage / Database Catalog / VendorData / JMA`           | `sha256:CC050347F5F3DB684BAD62EE8386FC4A5A28640665209E908153F718A3804180` |
| leaf       | schema     | `VendorData.mkt`           | `Sonic Data Lineage / Database Catalog / VendorData / mkt`           | `sha256:9ED19919E4EFDA855409FA4DC3DD04B0444C1ED1EB3BDA52EE96E60325414C38` |
| leaf       | schema     | `VendorData.recon`         | `Sonic Data Lineage / Database Catalog / VendorData / recon`         | `sha256:0EED52097F133330C9E2E1C70B05A7C36EEC98EACF59DE374958BC79E387715E` |
| leaf       | schema     | `VendorData.RepMgmt`       | `Sonic Data Lineage / Database Catalog / VendorData / RepMgmt`       | `sha256:E2C7E1D2EB83180EABAB2040E6E8C93FD2DF8D53476000F1BF5F6F1C18AC7669` |
| leaf       | schema     | `VendorData.rpt`           | `Sonic Data Lineage / Database Catalog / VendorData / rpt`           | `sha256:AED50E3D81501FDBF2832C65D1B4FCF2FC0755461E19155981CC07A984668D22` |
| leaf       | schema     | `VendorData.sonicdw`       | `Sonic Data Lineage / Database Catalog / VendorData / sonicdw`       | `sha256:D1766FC84F7B87F4ED6C9A8429DB5650EDB2D92136DB8087AD8F5466E37CA7D6` |
| leaf       | schema     | `VendorData.src`           | `Sonic Data Lineage / Database Catalog / VendorData / src`           | `sha256:995ED74D6096B611CDF9BFF44FE77E6B13B5E714592176B86F513AA0DC28AC16` |
| leaf       | schema     | `VendorData.street`        | `Sonic Data Lineage / Database Catalog / VendorData / street`        | `sha256:AF0CDF0D08C49CAB73257154D90922B713B55B1132A380EB52F8255BAABB2E4D` |
| leaf       | schema     | `VendorData.tsd`           | `Sonic Data Lineage / Database Catalog / VendorData / tsd`           | `sha256:44A8BD8859ADEEA1E054C506B1D8A7FAA5A5B8A2E8B8843DAD0C388DBDA0E5C1` |
| leaf       | schema     | `VendorData.uccx`          | `Sonic Data Lineage / Database Catalog / VendorData / uccx`          | `sha256:F303EB0D84946812D41F48C85D98593DF9D235FF104E111A27AB8DE761F368F3` |
| leaf       | schema     | `VendorData.uipath`        | `Sonic Data Lineage / Database Catalog / VendorData / uipath`        | `sha256:C0AB5559E922A06B43FF851C22CB75778A718F16D210486253676E5FE9BBC4BA` |
| leaf       | schema     | `VendorData.Verint`        | `Sonic Data Lineage / Database Catalog / VendorData / Verint`        | `sha256:F33C0FCD927AC4AE4E0413537A9CE63AC38789FA87D4C97D78D7855550102615` |
| leaf       | schema     | `VendorData.xTime`         | `Sonic Data Lineage / Database Catalog / VendorData / xTime`         | `sha256:574DE7573A0449DF08F0791B6E9AD76A273A4842172AA0910C09F8F30BFB778A` |
| leaf       | schema     | `WebV.dbo`                 | `Sonic Data Lineage / Database Catalog / WebV / dbo`                 | `sha256:D0D4F1806F2192DAC2775F2B56DEE9E3A6D7E2A75FA7417AD521E4F16A842BA3` |
| leaf       | schema     | `webvEP.dbo`               | `Sonic Data Lineage / Database Catalog / webvEP / dbo`               | `sha256:2DC0003BAE9DD2C85943DEC9C3FB2F9A894F619FF17E6ABC9EC82D5D643248A3` |

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
| Cleanup candidates                 | 170                                                                  |
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
