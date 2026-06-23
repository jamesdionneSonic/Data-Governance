# T2B-160 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-160`                    |
| Platform/Product      | `Snowflake`                  |
| Database              | `HYPERNOVA_SONIC_CUSTACCESS` |
| Schema                | `COSMOS_SONIC`               |
| Object type scope     | `table`                      |
| Object pages          | 75                           |
| Link refresh pages    | 2                            |
| Total planned entries | 79                           |
| Validation status     | `passed`                     |

## Object Pages

| Object                              | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                                |
| ----------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| `DWDIFFRELATIONSHIP_D`              | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFRELATIONSHIP_D`              |
| `DWDIFFRELATIONSHIP_I`              | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFRELATIONSHIP_I`              |
| `DWDIFFRELATIONSHIP_U`              | table | profiled, review-needed | 0          | 8       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFRELATIONSHIP_U`              |
| `DWDIFFREPORTCREDITCONFIGURATION_D` | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFREPORTCREDITCONFIGURATION_D` |
| `DWDIFFREPORTCREDITCONFIGURATION_I` | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFREPORTCREDITCONFIGURATION_I` |
| `DWDIFFREPORTCREDITCONFIGURATION_U` | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFREPORTCREDITCONFIGURATION_U` |
| `DWDIFFSCHEDULE_D`                  | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFSCHEDULE_D`                  |
| `DWDIFFSCHEDULE_I`                  | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFSCHEDULE_I`                  |
| `DWDIFFSCHEDULE_U`                  | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFSCHEDULE_U`                  |
| `DWDIFFSOURCE_D`                    | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFSOURCE_D`                    |
| `DWDIFFSOURCE_I`                    | table | profiled, review-needed | 1          | 9       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFSOURCE_I`                    |
| `DWDIFFSOURCE_U`                    | table | profiled, review-needed | 1          | 9       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFSOURCE_U`                    |
| `DWDIFFTASKCOMMENTS_D`              | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTASKCOMMENTS_D`              |
| `DWDIFFTASKCOMMENTS_I`              | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTASKCOMMENTS_I`              |
| `DWDIFFTASKCOMMENTS_U`              | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTASKCOMMENTS_U`              |
| `DWDIFFTASKDUEDATECHANGE_D`         | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTASKDUEDATECHANGE_D`         |
| `DWDIFFTASKDUEDATECHANGE_I`         | table | profiled, review-needed | 1          | 7       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTASKDUEDATECHANGE_I`         |
| `DWDIFFTASKDUEDATECHANGE_U`         | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTASKDUEDATECHANGE_U`         |
| `DWDIFFTASKITEM_D`                  | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTASKITEM_D`                  |
| `DWDIFFTASKITEM_I`                  | table | profiled, review-needed | 1          | 12      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTASKITEM_I`                  |
| `DWDIFFTASKITEM_U`                  | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTASKITEM_U`                  |
| `DWDIFFTASKREMINDER_D`              | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTASKREMINDER_D`              |
| `DWDIFFTASKREMINDER_I`              | table | profiled, review-needed | 1          | 11      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTASKREMINDER_I`              |
| `DWDIFFTASKREMINDER_U`              | table | profiled, review-needed | 1          | 11      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTASKREMINDER_U`              |
| `DWDIFFTEXTCONVERSATION_D`          | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTCONVERSATION_D`          |
| `DWDIFFTEXTCONVERSATION_I`          | table | profiled, review-needed | 1          | 13      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTCONVERSATION_I`          |
| `DWDIFFTEXTCONVERSATION_U`          | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTCONVERSATION_U`          |
| `DWDIFFTEXTCONVERSATIONELEMENT_D`   | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTCONVERSATIONELEMENT_D`   |
| `DWDIFFTEXTCONVERSATIONELEMENT_I`   | table | profiled, review-needed | 1          | 19      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTCONVERSATIONELEMENT_I`   |
| `DWDIFFTEXTCONVERSATIONELEMENT_U`   | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTCONVERSATIONELEMENT_U`   |
| `DWDIFFTEXTCONVERSATIONMESSAGE_D`   | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTCONVERSATIONMESSAGE_D`   |
| `DWDIFFTEXTCONVERSATIONMESSAGE_I`   | table | profiled, review-needed | 1          | 20      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTCONVERSATIONMESSAGE_I`   |
| `DWDIFFTEXTCONVERSATIONMESSAGE_U`   | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTCONVERSATIONMESSAGE_U`   |
| `DWDIFFTEXTCUSTOMERNUMBER_D`        | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTCUSTOMERNUMBER_D`        |
| `DWDIFFTEXTCUSTOMERNUMBER_I`        | table | profiled, review-needed | 1          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTCUSTOMERNUMBER_I`        |
| `DWDIFFTEXTCUSTOMERNUMBER_U`        | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTCUSTOMERNUMBER_U`        |
| `DWDIFFTEXTOPTINSTATUS_D`           | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTOPTINSTATUS_D`           |
| `DWDIFFTEXTOPTINSTATUS_I`           | table | profiled, review-needed | 1          | 13      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTOPTINSTATUS_I`           |
| `DWDIFFTEXTOPTINSTATUS_U`           | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFTEXTOPTINSTATUS_U`           |
| `DWDIFFUSER_D`                      | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFUSER_D`                      |
| `DWDIFFUSER_I`                      | table | profiled, review-needed | 0          | 46      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFUSER_I`                      |
| `DWDIFFUSER_U`                      | table | profiled, review-needed | 0          | 46      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFUSER_U`                      |
| `DWDIFFUSERCHILDCOMPANYMAP_D`       | table | profiled, review-needed | 0          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFUSERCHILDCOMPANYMAP_D`       |
| `DWDIFFUSERCHILDCOMPANYMAP_I`       | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFUSERCHILDCOMPANYMAP_I`       |
| `DWDIFFUSERCHILDCOMPANYMAP_U`       | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFUSERCHILDCOMPANYMAP_U`       |
| `DWDIFFUSERPOSITIONMAP_D`           | table | profiled, review-needed | 0          | 4       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFUSERPOSITIONMAP_D`           |
| `DWDIFFUSERPOSITIONMAP_I`           | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFUSERPOSITIONMAP_I`           |
| `DWDIFFUSERPOSITIONMAP_U`           | table | profiled, review-needed | 0          | 6       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFUSERPOSITIONMAP_U`           |
| `DWDIFFVEHICLE_D`                   | table | profiled, review-needed | 1          | 6       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFVEHICLE_D`                   |
| `DWDIFFVEHICLE_I`                   | table | profiled, review-needed | 1          | 90      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFVEHICLE_I`                   |
| `DWDIFFVEHICLE_U`                   | table | profiled, review-needed | 1          | 90      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFVEHICLE_U`                   |
| `DWDIFFVEHICLESOUGHT_D`             | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFVEHICLESOUGHT_D`             |
| `DWDIFFVEHICLESOUGHT_I`             | table | profiled, review-needed | 1          | 25      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFVEHICLESOUGHT_I`             |
| `DWDIFFVEHICLESOUGHT_U`             | table | profiled, review-needed | 1          | 25      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFVEHICLESOUGHT_U`             |
| `DWDIFFWARRANTY_D`                  | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFWARRANTY_D`                  |
| `DWDIFFWARRANTY_I`                  | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFWARRANTY_I`                  |
| `DWDIFFWARRANTY_U`                  | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFWARRANTY_U`                  |
| `DWDIFFWORKFLOW_D`                  | table | profiled, review-needed | 1          | 3       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFWORKFLOW_D`                  |
| `DWDIFFWORKFLOW_I`                  | table | profiled, review-needed | 1          | 13      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFWORKFLOW_I`                  |
| `DWDIFFWORKFLOW_U`                  | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWDIFFWORKFLOW_U`                  |
| `DWFULLACTIVITY`                    | table | profiled, review-needed | 1          | 45      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLACTIVITY`                    |
| `DWFULLAUDIT`                       | table | profiled, review-needed | 1          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLAUDIT`                       |
| `DWFULLCOMPANY`                     | table | profiled, review-needed | 1          | 41      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLCOMPANY`                     |
| `DWFULLCOMPANYCHILDCOMPANYMAP`      | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLCOMPANYCHILDCOMPANYMAP`      |
| `DWFULLCOMPANYHIERARCHY`            | table | profiled, review-needed | 1          | 17      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLCOMPANYHIERARCHY`            |
| `DWFULLCOMPANYOPTION`               | table | profiled, review-needed | 1          | 18      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLCOMPANYOPTION`               |
| `DWFULLCOMPANYSOURCE`               | table | profiled, review-needed | 1          | 18      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLCOMPANYSOURCE`               |
| `DWFULLCREATETASK`                  | table | profiled, review-needed | 1          | 39      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLCREATETASK`                  |
| `DWFULLCUSTOMER`                    | table | profiled, review-needed | 1          | 84      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLCUSTOMER`                    |
| `DWFULLDAYLIGHTSAVINGTIME`          | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLDAYLIGHTSAVINGTIME`          |
| `DWFULLDEALADDITIONALPERSONMAP`     | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLDEALADDITIONALPERSONMAP`     |
| `DWFULLDEALERPROGRAM`               | table | profiled, review-needed | 1          | 24      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLDEALERPROGRAM`               |
| `DWFULLDEALERPROMOTION`             | table | profiled, review-needed | 0          | 33      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLDEALERPROMOTION`             |
| `DWFULLDEALERPROMOTIONPUSH`         | table | profiled, review-needed | 0          | 21      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLDEALERPROMOTIONPUSH`         |
| `DWFULLDEALERPROMOTIONPUSHTASKMAP`  | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLDEALERPROMOTIONPUSHTASKMAP`  |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-160:publish
```
