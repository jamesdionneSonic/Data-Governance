# IBEX_DimSurveyQuestion1

Generated: 2026-06-29T10:58:59.085Z
ADF factory: `adf-inbounddataetl-prod`
Saved connector: `azure-data-factory-adf-inbounddataetl-prod`
Source profile artifact: `data/markdown/_runtime/profile-runs/azure-data-factory-adf-inbounddataetl-prod/2026-06-29T10-46-28-895Z-0c8e98f2-1277-45d8-864a-42cd5d44bb03.json`

## Plain-English Summary

IBEX_DimSurveyQuestion1 is an ADF child pipeline in adf-inbounddataetl-prod. If IBEX_DimSurveyQuestion1 fails or becomes stale, dependent ADF loads, files, datasets, or downstream reporting may be incomplete until the failed run is diagnosed and rerun through the approved parent path. Start troubleshooting by checking the parent pipeline that called IBEX_DimSurveyQuestion1; do not start the child with blank operational parameters.

## At a Glance

| Field                 | Value                                                                                                                                                                                                |
| --------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Platform              | ADF                                                                                                                                                                                                  |
| Asset type            | Pipeline                                                                                                                                                                                             |
| Native path           | `/subscriptions/bee9b611-da99-4cfc-9fb7-50f1359e5ca2/resourceGroups/RG-InboundDataServices-Prod/providers/Microsoft.DataFactory/factories/ADF-InboundDataETL-Prod/pipelines/IBEX_DimSurveyQuestion1` |
| Support role          | child pipeline                                                                                                                                                                                       |
| Business process      | adf-inbounddataetl-prod pipeline execution                                                                                                                                                           |
| Primary source        | SqlIBEXQuestionSource1, SqlIBEXSurveyResponseSource2                                                                                                                                                 |
| Primary target/output | SqlIBEXQuestionStage1, SqlIBEXSurveyResponseStage1                                                                                                                                                   |
| Schedule or trigger   | not directly triggered                                                                                                                                                                               |
| Runtime/usage signal  | Metadata profiled at 2026-06-29T10:46:28.849Z                                                                                                                                                        |
| Status signal         | metadata available                                                                                                                                                                                   |
| Evidence              | `data/markdown/_runtime/profile-runs/azure-data-factory-adf-inbounddataetl-prod/2026-06-29T10-46-28-895Z-0c8e98f2-1277-45d8-864a-42cd5d44bb03.json`                                                  |

## Business Use

This pipeline supports the adf-inbounddataetl-prod ADF process. Its available metadata shows 4 activity step(s), 0 child pipeline call(s), 2 source dataset reference(s), and 2 target dataset reference(s).

## Support Checks

1. Check the parent pipeline that called IBEX_DimSurveyQuestion1; do not start the child with blank operational parameters.
2. Confirm parameters are supplied by the parent, trigger, or documented default path: not surfaced in metadata.
3. Confirm source datasets are available: SqlIBEXQuestionSource1, SqlIBEXSurveyResponseSource2.
4. Confirm target datasets or child pipelines completed: SqlIBEXQuestionStage1, SqlIBEXSurveyResponseStage1.
5. If stored procedures are involved, validate process/audit logs before rerunning.

## Lineage And Dependencies

| Dependency type   | Values                                               |
| ----------------- | ---------------------------------------------------- |
| Parent pipelines  | IBEX_SurveyMaster                                    |
| Child pipelines   | none surfaced                                        |
| Source datasets   | SqlIBEXQuestionSource1, SqlIBEXSurveyResponseSource2 |
| Target datasets   | SqlIBEXQuestionStage1, SqlIBEXSurveyResponseStage1   |
| Stored procedures | [dbo].[uspLoadIBEXSurveyQuestion]                    |

## Runtime Or Usage Signals

Use ADF run history for live status. This page is generated from metadata-profile evidence and should not be treated as a current run monitor.

## Technical Details

| Activity                       | Type                     | Inputs                       | Outputs                     |
| ------------------------------ | ------------------------ | ---------------------------- | --------------------------- |
| Truncate Staging               | Script                   | not surfaced in metadata     | not surfaced in metadata    |
| SRC to STG IBEXQuestions       | Copy                     | SqlIBEXQuestionSource1       | SqlIBEXQuestionStage1       |
| SRC to STG IBEXSurveyResponse  | Copy                     | SqlIBEXSurveyResponseSource2 | SqlIBEXSurveyResponseStage1 |
| EXEC uspLoadIBEXSurveyQuestion | SqlServerStoredProcedure | not surfaced in metadata     | not surfaced in metadata    |

## Evidence And Caveats

- Generated from saved ADF connector metadata.
- Linked-service secret details and raw activity output are intentionally not published.
- Missing source or target detail means the value was not surfaced in metadata, not that no dependency exists.
