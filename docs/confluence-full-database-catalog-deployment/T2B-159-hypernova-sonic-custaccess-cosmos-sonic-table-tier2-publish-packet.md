# T2B-159 Tier 2 Batch Publish Packet

## Purpose

This packet prepares a dry-run publish package for the next queued Tier 2 batch
from `docs/DATABASE_CATALOG_TIER2_BATCH_STRATEGY.md`.

It does not publish to Confluence and it does not clean up, archive, delete, or
move pages.

## Recommendation

Ready for review. Live publish requires explicit approval.

## Scope

| Signal                | Value                        |
| --------------------- | ---------------------------- |
| Batch                 | `T2B-159`                    |
| Platform/Product      | `Snowflake`                  |
| Database              | `HYPERNOVA_SONIC_CUSTACCESS` |
| Schema                | `COSMOS_SONIC`               |
| Object type scope     | `table`                      |
| Object pages          | 75                           |
| Link refresh pages    | 2                            |
| Total planned entries | 79                           |
| Validation status     | `passed`                     |

## Object Pages

| Object                                  | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                                    |
| --------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| `DWDELTASTATUS`                         | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDELTASTATUS`                         |
| `DWDIFFACTIVITY_D`                      | table | profiled, review-needed | 7          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFACTIVITY_D`                      |
| `DWDIFFACTIVITY_I`                      | table | profiled, review-needed | 7          | 38      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFACTIVITY_I`                      |
| `DWDIFFACTIVITY_U`                      | table | profiled, review-needed | 7          | 38      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFACTIVITY_U`                      |
| `DWDIFFAUDIT_I`                         | table | profiled, review-needed | 1          | 11      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFAUDIT_I`                         |
| `DWDIFFCOMPANY_D`                       | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANY_D`                       |
| `DWDIFFCOMPANY_I`                       | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANY_I`                       |
| `DWDIFFCOMPANY_U`                       | table | profiled, review-needed | 0          | 36      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANY_U`                       |
| `DWDIFFCOMPANYCHILDCOMPANYMAP_D`        | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANYCHILDCOMPANYMAP_D`        |
| `DWDIFFCOMPANYCHILDCOMPANYMAP_I`        | table | profiled, review-needed | 1          | 6       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANYCHILDCOMPANYMAP_I`        |
| `DWDIFFCOMPANYCHILDCOMPANYMAP_U`        | table | profiled, review-needed | 1          | 6       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANYCHILDCOMPANYMAP_U`        |
| `DWDIFFCOMPANYHIERARCHY_D`              | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANYHIERARCHY_D`              |
| `DWDIFFCOMPANYHIERARCHY_I`              | table | profiled, review-needed | 1          | 12      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANYHIERARCHY_I`              |
| `DWDIFFCOMPANYHIERARCHY_U`              | table | profiled, review-needed | 1          | 12      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANYHIERARCHY_U`              |
| `DWDIFFCOMPANYOPTION_D`                 | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANYOPTION_D`                 |
| `DWDIFFCOMPANYOPTION_I`                 | table | profiled, review-needed | 1          | 12      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANYOPTION_I`                 |
| `DWDIFFCOMPANYOPTION_U`                 | table | profiled, review-needed | 1          | 12      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANYOPTION_U`                 |
| `DWDIFFCOMPANYSOURCE_D`                 | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANYSOURCE_D`                 |
| `DWDIFFCOMPANYSOURCE_I`                 | table | profiled, review-needed | 1          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANYSOURCE_I`                 |
| `DWDIFFCOMPANYSOURCE_U`                 | table | profiled, review-needed | 1          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCOMPANYSOURCE_U`                 |
| `DWDIFFCREATETASK_D`                    | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCREATETASK_D`                    |
| `DWDIFFCREATETASK_I`                    | table | profiled, review-needed | 1          | 35      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCREATETASK_I`                    |
| `DWDIFFCREATETASK_U`                    | table | profiled, review-needed | 0          | 35      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCREATETASK_U`                    |
| `DWDIFFCUSTOMER_D`                      | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCUSTOMER_D`                      |
| `DWDIFFCUSTOMER_I`                      | table | profiled, review-needed | 1          | 80      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCUSTOMER_I`                      |
| `DWDIFFCUSTOMER_U`                      | table | profiled, review-needed | 1          | 80      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFCUSTOMER_U`                      |
| `DWDIFFDAYLIGHTSAVINGTIME_D`            | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDAYLIGHTSAVINGTIME_D`            |
| `DWDIFFDAYLIGHTSAVINGTIME_I`            | table | profiled, review-needed | 1          | 6       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDAYLIGHTSAVINGTIME_I`            |
| `DWDIFFDAYLIGHTSAVINGTIME_U`            | table | profiled, review-needed | 1          | 6       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDAYLIGHTSAVINGTIME_U`            |
| `DWDIFFDEALERPROGRAM_D`                 | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDEALERPROGRAM_D`                 |
| `DWDIFFDEALERPROGRAM_I`                 | table | profiled, review-needed | 1          | 20      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDEALERPROGRAM_I`                 |
| `DWDIFFDEALERPROGRAM_U`                 | table | profiled, review-needed | 1          | 20      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDEALERPROGRAM_U`                 |
| `DWDIFFDEALMERGE_I`                     | table | profiled, review-needed | 1          | 11      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDEALMERGE_I`                     |
| `DWDIFFDEALSALESPERSONMAP_D`            | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDEALSALESPERSONMAP_D`            |
| `DWDIFFDEALSALESPERSONMAP_I`            | table | profiled, review-needed | 1          | 11      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDEALSALESPERSONMAP_I`            |
| `DWDIFFDEALSALESPERSONMAP_U`            | table | profiled, review-needed | 1          | 11      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDEALSALESPERSONMAP_U`            |
| `DWDIFFDEPARTMENT_D`                    | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDEPARTMENT_D`                    |
| `DWDIFFDEPARTMENT_I`                    | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDEPARTMENT_I`                    |
| `DWDIFFDEPARTMENT_U`                    | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDEPARTMENT_U`                    |
| `DWDIFFDESKLOGVISIT_D`                  | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDESKLOGVISIT_D`                  |
| `DWDIFFDESKLOGVISIT_I`                  | table | profiled, review-needed | 1          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDESKLOGVISIT_I`                  |
| `DWDIFFDESKLOGVISIT_U`                  | table | profiled, review-needed | 1          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFDESKLOGVISIT_U`                  |
| `DWDIFFEMAIL_D`                         | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFEMAIL_D`                         |
| `DWDIFFEMAIL_I`                         | table | profiled, review-needed | 1          | 15      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFEMAIL_I`                         |
| `DWDIFFEMAIL_U`                         | table | profiled, review-needed | 1          | 15      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFEMAIL_U`                         |
| `DWDIFFEMAILOPTOUT_D`                   | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFEMAILOPTOUT_D`                   |
| `DWDIFFEMAILOPTOUT_I`                   | table | profiled, review-needed | 1          | 6       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFEMAILOPTOUT_I`                   |
| `DWDIFFEMAILOPTOUT_U`                   | table | profiled, review-needed | 1          | 6       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFEMAILOPTOUT_U`                   |
| `DWDIFFHOLIDAY_D`                       | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFHOLIDAY_D`                       |
| `DWDIFFHOLIDAY_I`                       | table | profiled, review-needed | 1          | 6       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFHOLIDAY_I`                       |
| `DWDIFFHOLIDAY_U`                       | table | profiled, review-needed | 1          | 6       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFHOLIDAY_U`                       |
| `DWDIFFLEADPROVIDERINACTIVEREASONMAP_D` | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFLEADPROVIDERINACTIVEREASONMAP_D` |
| `DWDIFFLEADPROVIDERINACTIVEREASONMAP_I` | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFLEADPROVIDERINACTIVEREASONMAP_I` |
| `DWDIFFLEADPROVIDERINACTIVEREASONMAP_U` | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFLEADPROVIDERINACTIVEREASONMAP_U` |
| `DWDIFFLEGACYCUSTOMER_D`                | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFLEGACYCUSTOMER_D`                |
| `DWDIFFLEGACYCUSTOMER_I`                | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFLEGACYCUSTOMER_I`                |
| `DWDIFFLEGACYCUSTOMER_U`                | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFLEGACYCUSTOMER_U`                |
| `DWDIFFLEGACYEMPLOYEE_D`                | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFLEGACYEMPLOYEE_D`                |
| `DWDIFFLEGACYEMPLOYEE_I`                | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFLEGACYEMPLOYEE_I`                |
| `DWDIFFLEGACYEMPLOYEE_U`                | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFLEGACYEMPLOYEE_U`                |
| `DWDIFFMESSAGES_D`                      | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFMESSAGES_D`                      |
| `DWDIFFMESSAGES_I`                      | table | profiled, review-needed | 1          | 9       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFMESSAGES_I`                      |
| `DWDIFFMESSAGES_U`                      | table | profiled, review-needed | 0          | 9       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFMESSAGES_U`                      |
| `DWDIFFOPPORTUNITY_D`                   | table | profiled, review-needed | 1          | 4       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFOPPORTUNITY_D`                   |
| `DWDIFFOPPORTUNITY_I`                   | table | profiled, review-needed | 1          | 74      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFOPPORTUNITY_I`                   |
| `DWDIFFOPPORTUNITY_U`                   | table | profiled, review-needed | 1          | 74      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFOPPORTUNITY_U`                   |
| `DWDIFFPHONE_D`                         | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFPHONE_D`                         |
| `DWDIFFPHONE_I`                         | table | profiled, review-needed | 1          | 16      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFPHONE_I`                         |
| `DWDIFFPHONE_U`                         | table | profiled, review-needed | 1          | 16      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFPHONE_U`                         |
| `DWDIFFPOSITION_D`                      | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFPOSITION_D`                      |
| `DWDIFFPOSITION_I`                      | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFPOSITION_I`                      |
| `DWDIFFPOSITION_U`                      | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFPOSITION_U`                      |
| `DWDIFFPRODUCTORSERVICE_D`              | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFPRODUCTORSERVICE_D`              |
| `DWDIFFPRODUCTORSERVICE_I`              | table | profiled, review-needed | 1          | 12      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFPRODUCTORSERVICE_I`              |
| `DWDIFFPRODUCTORSERVICE_U`              | table | profiled, review-needed | 1          | 12      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFPRODUCTORSERVICE_U`              |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-159:publish
```
