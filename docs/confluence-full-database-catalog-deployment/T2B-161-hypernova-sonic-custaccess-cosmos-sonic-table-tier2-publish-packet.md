# T2B-161 Tier 2 Batch Publish Packet

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
| Batch                 | `T2B-161`                    |
| Platform/Product      | `Snowflake`                  |
| Database              | `HYPERNOVA_SONIC_CUSTACCESS` |
| Schema                | `COSMOS_SONIC`               |
| Object type scope     | `table`                      |
| Object pages          | 57                           |
| Link refresh pages    | 2                            |
| Total planned entries | 61                           |
| Validation status     | `passed`                     |

## Object Pages

| Object                                | Type  | Tags                    | Downstream | Columns | Confidence | Path                                                                                                                                  |
| ------------------------------------- | ----- | ----------------------- | ---------- | ------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `DWFULLDEALMERGE`                     | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLDEALMERGE`                     |
| `DWFULLDEALSALESPERSONMAP`            | table | profiled, review-needed | 1          | 15      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLDEALSALESPERSONMAP`            |
| `DWFULLDEPARTMENT`                    | table | profiled, review-needed | 1          | 18      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLDEPARTMENT`                    |
| `DWFULLDESKLOGVISIT`                  | table | profiled, review-needed | 1          | 18      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLDESKLOGVISIT`                  |
| `DWFULLELEADCALLMETADATA`             | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLELEADCALLMETADATA`             |
| `DWFULLEMAIL`                         | table | profiled, review-needed | 1          | 19      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLEMAIL`                         |
| `DWFULLEMAILOPTOUT`                   | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLEMAILOPTOUT`                   |
| `DWFULLENTERPRISECOMPANYMAP`          | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLENTERPRISECOMPANYMAP`          |
| `DWFULLHOLIDAY`                       | table | profiled, review-needed | 1          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLHOLIDAY`                       |
| `DWFULLINVENTORY`                     | table | profiled, review-needed | 0          | 84      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLINVENTORY`                     |
| `DWFULLLEADPROVIDERINACTIVEREASONMAP` | table | profiled, review-needed | 1          | 15      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLLEADPROVIDERINACTIVEREASONMAP` |
| `DWFULLLEGACYCUSTOMERID`              | table | profiled, review-needed | 1          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLLEGACYCUSTOMERID`              |
| `DWFULLLEGACYEMPLOYEEID`              | table | profiled, review-needed | 1          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLLEGACYEMPLOYEEID`              |
| `DWFULLMESSAGES`                      | table | profiled, review-needed | 1          | 13      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLMESSAGES`                      |
| `DWFULLOPPORTUNITY`                   | table | profiled, review-needed | 1          | 79      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLOPPORTUNITY`                   |
| `DWFULLOPPORTUNITYARCHIVE`            | table | profiled, review-needed | 0          | 79      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLOPPORTUNITYARCHIVE`            |
| `DWFULLPAYMENTVERSION`                | table | profiled, review-needed | 0          | 66      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLPAYMENTVERSION`                |
| `DWFULLPHONE`                         | table | profiled, review-needed | 1          | 20      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLPHONE`                         |
| `DWFULLPOSITION`                      | table | profiled, review-needed | 2          | 11      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLPOSITION`                      |
| `DWFULLPRODUCTORSERVICE`              | table | profiled, review-needed | 1          | 16      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLPRODUCTORSERVICE`              |
| `DWFULLQUOTE`                         | table | profiled, review-needed | 0          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLQUOTE`                         |
| `DWFULLQUOTEVERSION`                  | table | profiled, review-needed | 0          | 25      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLQUOTEVERSION`                  |
| `DWFULLRELATIONSHIP`                  | table | profiled, review-needed | 2          | 12      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLRELATIONSHIP`                  |
| `DWFULLREPORTCREDITCONFIGURATION`     | table | profiled, review-needed | 1          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLREPORTCREDITCONFIGURATION`     |
| `DWFULLSCHEDULE`                      | table | profiled, review-needed | 1          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLSCHEDULE`                      |
| `DWFULLSERVICE`                       | table | profiled, review-needed | 0          | 44      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLSERVICE`                       |
| `DWFULLSERVICEDETAILS`                | table | profiled, review-needed | 0          | 46      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLSERVICEDETAILS`                |
| `DWFULLSETTINGVERSION`                | table | profiled, review-needed | 0          | 48      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLSETTINGVERSION`                |
| `DWFULLSOURCE`                        | table | profiled, review-needed | 1          | 13      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLSOURCE`                        |
| `DWFULLSOURCECOMPANYMAP`              | table | profiled, review-needed | 0          | 13      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLSOURCECOMPANYMAP`              |
| `DWFULLSTATUS`                        | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLSTATUS`                        |
| `DWFULLTASKCOMMENTS`                  | table | profiled, review-needed | 1          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLTASKCOMMENTS`                  |
| `DWFULLTASKDUEDATECHANGE`             | table | profiled, review-needed | 1          | 11      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLTASKDUEDATECHANGE`             |
| `DWFULLTASKITEM`                      | table | profiled, review-needed | 1          | 16      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLTASKITEM`                      |
| `DWFULLTASKREMINDER`                  | table | profiled, review-needed | 1          | 15      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLTASKREMINDER`                  |
| `DWFULLTEMPLATE`                      | table | profiled, review-needed | 0          | 15      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLTEMPLATE`                      |
| `DWFULLTEXTCOMPANYNUMBER`             | table | profiled, review-needed | 0          | 28      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLTEXTCOMPANYNUMBER`             |
| `DWFULLTEXTCONVERSATION`              | table | profiled, review-needed | 1          | 17      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLTEXTCONVERSATION`              |
| `DWFULLTEXTCONVERSATIONELEMENT`       | table | profiled, review-needed | 1          | 23      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLTEXTCONVERSATIONELEMENT`       |
| `DWFULLTEXTCONVERSATIONMESSAGE`       | table | profiled, review-needed | 1          | 26      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLTEXTCONVERSATIONMESSAGE`       |
| `DWFULLTEXTCONVERSATIONMESSAGEMEDIA`  | table | profiled, review-needed | 0          | 19      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLTEXTCONVERSATIONMESSAGEMEDIA`  |
| `DWFULLTEXTCUSTOMERNUMBER`            | table | profiled, review-needed | 1          | 19      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLTEXTCUSTOMERNUMBER`            |
| `DWFULLTEXTOPTINSTATUS`               | table | profiled, review-needed | 1          | 17      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLTEXTOPTINSTATUS`               |
| `DWFULLUNCONFIRMED`                   | table | profiled, review-needed | 0          | 47      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLUNCONFIRMED`                   |
| `DWFULLUSER`                          | table | profiled, review-needed | 2          | 52      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLUSER`                          |
| `DWFULLUSERCHILDCOMPANYMAP`           | table | profiled, review-needed | 2          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLUSERCHILDCOMPANYMAP`           |
| `DWFULLUSERDEPARTMENTMAP`             | table | profiled, review-needed | 2          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLUSERDEPARTMENTMAP`             |
| `DWFULLUSERPOSITIONMAP`               | table | profiled, review-needed | 2          | 10      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLUSERPOSITIONMAP`               |
| `DWFULLVEHICLE`                       | table | profiled, review-needed | 1          | 94      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLVEHICLE`                       |
| `DWFULLVEHICLEBOOKVALUEADJUSTMENT`    | table | profiled, review-needed | 0          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLVEHICLEBOOKVALUEADJUSTMENT`    |
| `DWFULLVEHICLEINFO`                   | table | profiled, review-needed | 0          | 31      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLVEHICLEINFO`                   |
| `DWFULLVEHICLESOUGHT`                 | table | profiled, review-needed | 1          | 29      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLVEHICLESOUGHT`                 |
| `DWFULLWARRANTY`                      | table | profiled, review-needed | 1          | 14      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLWARRANTY`                      |
| `DWFULLWORKFLOW`                      | table | profiled, review-needed | 1          | 17      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLWORKFLOW`                      |
| `DWFULLWORKSHEETPRINTED`              | table | profiled, review-needed | 0          | 12      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWFULLWORKSHEETPRINTED`              |
| `DWRUNSTATUS`                         | table | profiled, review-needed | 0          | 20      | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / DWRUNSTATUS`                         |
| `ERRORLOG`                            | table | profiled, review-needed | 0          | 7       | medium     | `Sonic Data Lineage / Database Catalog / Snowflake / HYPERNOVA_SONIC_CUSTACCESS / COSMOS_SONIC / ERRORLOG`                            |

## Validation

- No packet validation failures.

## Live Gate

Live publish requires explicit user approval:

```powershell
npm run confluence:full:tier2:t2b-161:publish
```
