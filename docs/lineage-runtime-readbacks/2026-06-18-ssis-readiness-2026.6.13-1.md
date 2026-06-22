# SSIS Runtime Package Readiness Check - 2026.6.13-1

## Purpose

Validate that the Sonic lineage runtime package has enough structured SSIS
metadata to support Fuel-style SSIS documentation workflows without opening
Confluence or private local source markdown.

## Package Checked

| Field                       | Value                                                              |
| --------------------------- | ------------------------------------------------------------------ |
| Package name                | `sonic-data-lineage-runtime`                                       |
| Package version             | `2026.6.13-1`                                                      |
| Runtime content hash        | `514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff` |
| Package root                | `data/lineage-runtime-package/sonic-data-lineage-runtime`          |
| SSIS package contexts       | `1451`                                                             |
| Package JSON files checked  | `1451`                                                             |
| Project/folder README files | `478`                                                              |

Important: this check was run against the current local package hash. The
approved published package hash for version `2026.6.13-1` is
`ab840383d8e4f9b1e1036523965536b03d23f2270959025d63a658f4daeece6e`.

## Command

```powershell
npm run lineage:runtime:ssis-check
```

## Result

Status: `passed`

Prompt coverage:

| SSIS support-doc prompt area | Covered |
| ---------------------------- | ------- |
| Folder navigation            | Yes     |
| Project navigation           | Yes     |
| Package detail               | Yes     |
| Source reads                 | Yes     |
| Lookup/context reads         | Yes     |
| Target maintenance           | Yes     |
| Writes/loads                 | Yes     |
| Package calls                | Yes     |
| Column mappings              | Yes     |

## Representative Evidence

| Prompt area          | Evidence                                                                                                                  |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| Package detail       | `ssis/f/f-010a11ad79/p/p-18aa85f538/pkg/pkg-2024c7078a.json` and `.md`                                                    |
| Source reads         | `VehicleMart.DimCarGurusDealer.DimCarGurusDealer.dtsx` reads `L1-DWASQL-02,12010.VendorData.dbo.StgCargurusDealer`        |
| Lookup/context reads | `VehicleMart.DimVehicle.DimVehicle_STG_VehicleMart.dtsx` uses `L1-5FSQL-01.Sonic_DW.dbo.vw_Dim_Inventory_Vehicle_Staging` |
| Target maintenance   | `VehicleMart.DimCarGurusDealer.DimCarGurusDealer.dtsx` creates/maintains `VendorData.dbo.StgCargurusDealer`               |
| Writes/loads         | `VehicleMart.DimCarGurusDealer.DimCarGurusDealer.dtsx` loads `V1-VMARTSQL-01.StagingDB.dbo.StgCargurusDealer`             |
| Package calls        | `DImCarGurusDealerMaster.dtsx` calls `DimCarGurusDealer.dtsx`                                                             |
| Column mappings      | `pkg-2024c7078a.json` reports `19` SSIS column mappings                                                                   |

## Notes

- This is a package-structure readiness check, not a generated-page quality
  review.
- The check proves the runtime package has the raw support-doc signals needed
  for folder, project, package, source, target, write, mapping, and package-call
  prompts.
- Human-readable SSIS page quality remains governed by the SSIS support-docs
  workflow and the Fuel-style summary rules.
