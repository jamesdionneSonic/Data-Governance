# T2B-053 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value         |
| --------------------- | ------------- |
| Batch                 | `T2B-053`     |
| Platform/Product      | `SQL Server`  |
| Database              | `VehicleMart` |
| Schema                | `Chrome`      |
| Object type scope     | `table`       |
| Object pages          | 30            |
| Link refresh pages    | 2             |
| Total planned entries | 34            |
| Validation status     | `passed`      |

## Object Pages

| Object                       | Type  | Tags                                               | Downstream | Columns | Confidence | Path                                                                                                     |
| ---------------------------- | ----- | -------------------------------------------------- | ---------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------- |
| `Acode`                      | table | profiled, lineage-hotspot, review-needed           | 0          | 8       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / Acode`                      |
| `AmbiguousOption`            | table | profiled, lineage-hotspot, review-needed           | 0          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / AmbiguousOption`            |
| `BodyType`                   | table | profiled, lineage-hotspot, review-needed           | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / BodyType`                   |
| `ChromeStyleIdFuzzyResponse` | table | profiled, lineage-hotspot, review-needed           | 0          | 5       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / ChromeStyleIdFuzzyResponse` |
| `ConsumerInfo`               | table | profiled, lineage-hotspot, review-needed           | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / ConsumerInfo`               |
| `ConsumerInfoValue`          | table | profiled, lineage-hotspot, review-needed           | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / ConsumerInfoValue`          |
| `Engine`                     | table | profiled, lineage-hotspot, review-needed           | 0          | 32      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / Engine`                     |
| `ExteriorColor`              | table | profiled, lineage-hotspot, review-needed           | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / ExteriorColor`              |
| `ExteriorColorXref`          | table | profiled, lineage-hotspot, review-needed           | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / ExteriorColorXref`          |
| `GenericEquipment`           | table | profiled, lineage-hotspot, review-needed           | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / GenericEquipment`           |
| `GenericExteriorColor`       | table | profiled, lineage-hotspot, review-needed           | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / GenericExteriorColor`       |
| `Image`                      | table | profiled, lineage-hotspot, review-needed           | 0          | 22      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / Image`                      |
| `Input`                      | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / Input`                      |
| `InteriorColor`              | table | profiled, lineage-hotspot, review-needed           | 0          | 13      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / InteriorColor`              |
| `MatchedEquipment`           | table | profiled, lineage-hotspot, review-needed           | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / MatchedEquipment`           |
| `MatchedNonfactoryEquipment` | table | profiled, lineage-hotspot, review-needed           | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / MatchedNonfactoryEquipment` |
| `OemDescription`             | table | profiled, lineage-hotspot, review-needed           | 0          | 12      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / OemDescription`             |
| `Option`                     | table | profiled, lineage-hotspot, review-needed           | 0          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / Option`                     |
| `ResponseLog`                | table | profiled, lineage-hotspot, review-needed           | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / ResponseLog`                |
| `ResponseStatus`             | table | profiled, lineage-hotspot, review-needed           | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / ResponseStatus`             |
| `StandardEquipment`          | table | profiled, lineage-hotspot, review-needed           | 0          | 15      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / StandardEquipment`          |
| `Style`                      | table | profiled, lineage-hotspot, review-needed           | 0          | 28      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / Style`                      |
| `TechSpec`                   | table | profiled, lineage-hotspot, review-needed           | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / TechSpec`                   |
| `TechSpecValue`              | table | profiled, lineage-hotspot, review-needed           | 0          | 11      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / TechSpecValue`              |
| `UVCFuzzyLookup`             | table | profiled, lineage-hotspot, review-needed           | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / UVCFuzzyLookup`             |
| `UVCFuzzyLookupBB`           | table | profiled, lineage-hotspot, review-needed           | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / UVCFuzzyLookupBB`           |
| `UVCFuzzyLookupPricingApp`   | table | profiled, review-needed                            | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / UVCFuzzyLookupPricingApp`   |
| `UVCMappingStg`              | table | profiled, lineage-hotspot, review-needed           | 0          | 9       | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / UVCMappingStg`              |
| `VehicleDescription`         | table | profiled, lineage-hotspot, review-needed           | 0          | 36      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / VehicleDescription`         |
| `VinList`                    | table | high-use, profiled, lineage-hotspot, review-needed | 0          | 10      | high       | `Sonic Data Lineage / Database Catalog / SQL Server / VehicleMart / Chrome / VinList`                    |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-053:publish
```
