# eLeadDW Metadata Count Reconciliation - 2026-06-20

## Work Packet

- Backlog item: `ELDW-003`
- Purpose: reconcile extracted metadata counts before any local catalog or lineage build.
- Source run id: `88d20d20-2f75-496e-a192-2d6f0acb920c`
- Source status: `succeeded`
- Source mode: `metadata_harvest`
- Source artifact: `C:\projects\Data Governence\data\markdown\_runtime\profile-runs\sqlserver-l1-dwasql-02-12010-eleaddw\2026-06-20T13-15-45-023Z-88d20d20-2f75-496e-a192-2d6f0acb920c.json`

## Reconciliation Summary

| Count                  | ELDW-002 Summary | Artifact Recount | Reconciled |
| ---------------------- | ---------------: | ---------------: | ---------- |
| Total canonical events |           34,079 |           34,079 | Yes        |
| Metadata objects       |              467 |              467 | Yes        |
| Metadata columns       |            5,686 |            5,686 | Yes        |
| Lineage edges          |           27,926 |           27,926 | Yes        |
| Errors                 |                0 |                0 | Yes        |

## Stream Reconciliation

| Stream          | ELDW-002 Summary | Stream Result | Status      | Reconciled         |
| --------------- | ---------------: | ------------: | ----------- | ------------------ |
| `schemas`       |                3 |             3 | `succeeded` | Yes                |
| `tables`        |              324 |           324 | `succeeded` | Yes                |
| `views`         |                3 |             3 | `succeeded` | Yes                |
| `columns`       |            5,686 |         5,686 | `succeeded` | Yes                |
| `procedures`    |              130 |           130 | `succeeded` | Yes                |
| `functions`     |                7 |             7 | `succeeded` | Yes                |
| `triggers`      |                0 |             0 | `succeeded` | Yes; explicit zero |
| `relationships` |           27,926 |        27,926 | `succeeded` | Yes                |

Note: `summary.by_stream` omits `triggers` because the count is zero. The
`stream_results` array explicitly records `triggers` as `succeeded` with
`event_count: 0`, so this is a confirmed zero-count stream, not a missing or
failed extraction.

## Object Category Reconciliation

| Object Category   | Artifact Count | Reconciliation Note           |
| ----------------- | -------------: | ----------------------------- |
| Schemas           |              3 | Present as metadata objects.  |
| Tables            |            324 | Reconciles to stream result.  |
| Views             |              3 | Reconciles to stream result.  |
| Stored procedures |            130 | Reconciles to stream result.  |
| Functions         |              7 | Reconciles to stream result.  |
| Triggers          |              0 | Explicit zero-count category. |

The metadata object total reconciles as:

```text
3 schemas + 324 tables + 3 views + 130 stored procedures + 7 functions + 0 triggers = 467 metadata objects
```

## Safety Checks

| Check                                    | Result                                                   |
| ---------------------------------------- | -------------------------------------------------------- |
| Raw data captured                        | `false`                                                  |
| Secret exposed                           | `false`                                                  |
| Azure DevOps publication                 | Not run; artifact has `devops_upload_pending: true`      |
| Profile publication                      | Not applicable; `profile_publish.status: not_applicable` |
| Confluence publication                   | Not run                                                  |
| Catalog build                            | Not run                                                  |
| Parser/extractor/lineage-scoring changes | Not made                                                 |

## Acceptance Criteria

| Criterion                                                  | Status |
| ---------------------------------------------------------- | ------ |
| Counts reconcile or differences are explained              | Passed |
| Zero-count object categories are explicitly marked as zero | Passed |
| No catalog publish occurs                                  | Passed |

## Next Packet

The next packet is `ELDW-004: Build Local Catalog Artifacts`. It is not started by this reconciliation.
