# eLeadDW Local Lineage Edge Validation Readback - 2026-06-20

## Work Packet

- Backlog item: `ELDW-005`
- Purpose: process local eLeadDW lineage edges and classify confidence before runtime package or Confluence dry runs.
- Source run id: `88d20d20-2f75-496e-a192-2d6f0acb920c`
- Source artifact: `data/markdown/_runtime/profile-runs/sqlserver-l1-dwasql-02-12010-eleaddw/2026-06-20T13-15-45-023Z-88d20d20-2f75-496e-a192-2d6f0acb920c.json`

## Generated Reports

| Report                          | Path                                                                                                         |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| Edge summary JSON               | `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW/_catalog/lineage-edge-summary.json`              |
| Edge summary Markdown           | `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW/_catalog/lineage-edge-summary.md`                |
| Review-needed edge sample       | `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW/_catalog/lineage-review-needed-edges.json`       |
| Cross-database reference report | `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW/_catalog/lineage-cross-database-references.json` |

## Edge Summary

| Signal                          |  Count |
| ------------------------------- | -----: |
| Total lineage edges             | 27,926 |
| Direct positive edges           |    308 |
| Review-needed edges             | 27,618 |
| Cross-domain matched references |      2 |

## Edge Type Classification

| Extracted Edge Type |  Count | Local Class   | Label      |
| ------------------- | -----: | ------------- | ---------- |
| `loads`             |    206 | `writes_to`   | `positive` |
| `reads`             |    102 | `reads_from`  | `positive` |
| `column_match`      | 27,618 | `maps_column` | `review`   |

The `column_match` edges are exact-name metadata hints scored at `0.8`. They are
useful for review and possible feature engineering, but they are not promoted
as high-confidence lineage and must not be trained as positive hard lineage
without additional SQL, SSIS, ADF, or report evidence.

## Known Cross-Database Reference Matches

| Domain        | Matched Edges | Evidence                                                                                                                                     |
| ------------- | ------------: | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `ETL_Staging` |             1 | Procedure `dbo.usp_StageTrafficSummaryDailySubsourceAgg` writes to `L1-DWASQL-02,12010.ETL_Staging.dbo.StageTrafficDailySourceSubSourceAgg`. |
| `StagingDB`   |             1 | Procedure `dbo.STAGINGEvo2_CoreReport_V3_TBI_Sonic_V2` writes to `L1-DWASQL-02,12010.StagingDB.dbo.StageTrafficSummary`.                     |
| `Sonic_DW`    |             0 | No deterministic edge surfaced in this extraction.                                                                                           |
| `VendorData`  |             0 | No deterministic edge surfaced in this extraction.                                                                                           |
| `SSIS`        |             0 | No deterministic edge surfaced in this extraction.                                                                                           |
| `ADF`         |             0 | No deterministic edge surfaced in this extraction.                                                                                           |
| `SSRS`        |             0 | No deterministic edge surfaced in this extraction.                                                                                           |

## Validation

| Check                                                       | Result                                                |
| ----------------------------------------------------------- | ----------------------------------------------------- |
| Edges cite deterministic metadata or SQL/procedure evidence | Passed                                                |
| Ambiguous edges are not promoted as high confidence         | Passed; 27,618 `column_match` edges are review-needed |
| Known references are surfaced when evidence exists          | Passed; `ETL_Staging` and `StagingDB` surfaced        |
| Azure DevOps publication                                    | Not run                                               |
| Confluence publication                                      | Not run                                               |
| Parser/extractor/lineage-scoring changes                    | Not made                                              |

## Acceptance Criteria

| Criterion                                                    | Status |
| ------------------------------------------------------------ | ------ |
| Upstream/downstream edge summary produced                    | Passed |
| Low-confidence/review-needed edge report produced            | Passed |
| Known cross-database references report produced              | Passed |
| Ambiguous edges withheld from high-confidence classification | Passed |

## Next Packet

The next packet is `ELDW-006: Build Azure DevOps Runtime Package Dry Run`. It is not started by this local lineage validation.
