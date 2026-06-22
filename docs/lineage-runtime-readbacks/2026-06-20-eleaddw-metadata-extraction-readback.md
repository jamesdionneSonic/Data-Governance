# eLeadDW Metadata Extraction Readback - 2026-06-20

## Work Packet

- Backlog item: `ELDW-002`
- Purpose: run approved metadata extraction streams through the saved connector runtime.
- Connector id: `sqlserver-l1-dwasql-02-12010-eleaddw`
- Configured endpoint: `L1-DWASQL-02,12010`
- Database: `eLeadDW`
- Runtime mode: `metadata_harvest`
- Run id: `88d20d20-2f75-496e-a192-2d6f0acb920c`
- Started at: `2026-06-20T13:15:40.774Z`
- Completed at: `2026-06-20T13:15:45.023Z`

## Result

| Signal                   | Result               |
| ------------------------ | -------------------- |
| Status                   | `succeeded`          |
| Source contacted         | `true`               |
| Dry run only             | `false`              |
| Connection status        | `ready`              |
| Live connection valid    | `true`               |
| Metadata discovery valid | `true`               |
| SQL Server reported      | `D1-DWASQL-01\INST1` |
| Database reported        | `eLeadDW`            |
| Runtime login            | `SONIC\James.Dionne` |
| Runtime host             | `SHQCORP01702`       |
| Secret exposed           | `false`              |
| Raw data captured        | `false`              |
| Errors                   | `0`                  |
| Warnings                 | `0`                  |

## Stream Counts

| Stream          | Status      | Event Count |
| --------------- | ----------- | ----------: |
| `schemas`       | `succeeded` |           3 |
| `tables`        | `succeeded` |         324 |
| `views`         | `succeeded` |           3 |
| `columns`       | `succeeded` |       5,686 |
| `procedures`    | `succeeded` |         130 |
| `functions`     | `succeeded` |           7 |
| `triggers`      | `succeeded` |           0 |
| `relationships` | `succeeded` |      27,926 |

## Canonical Summary

| Metric                 |  Count |
| ---------------------- | -----: |
| Metadata objects       |    467 |
| Metadata columns       |  5,686 |
| Lineage edges          | 27,926 |
| Total canonical events | 34,079 |

## Artifact Paths

- Markdown artifact: `C:\projects\Data Governence\data\markdown\_runtime\profile-runs\sqlserver-l1-dwasql-02-12010-eleaddw\2026-06-20T13-15-45-023Z-88d20d20-2f75-496e-a192-2d6f0acb920c.md`
- JSON artifact: `C:\projects\Data Governence\data\markdown\_runtime\profile-runs\sqlserver-l1-dwasql-02-12010-eleaddw\2026-06-20T13-15-45-023Z-88d20d20-2f75-496e-a192-2d6f0acb920c.json`

## Scope Boundary

- The extraction used the saved connector runtime, not an ad hoc SQL script.
- No raw business rows or sample values were captured.
- No credentials, tokens, or connection strings were written.
- No Azure DevOps publication was run.
- No Confluence publication was run.
- No parser, extractor, lineage-scoring, auth, or UI code was changed.
- The trigger stream returned zero events. This is recorded as a successful zero-count stream, not a failed stream.

## Acceptance Criteria

| Criterion                                 | Status                     |
| ----------------------------------------- | -------------------------- |
| Object count is greater than zero         | Passed                     |
| Column count is greater than zero         | Passed                     |
| Raw business rows are not captured        | Passed                     |
| Failed streams are documented and triaged | Passed; no failed streams  |
| Error list is captured                    | Passed; no errors returned |
| Artifact path list is captured            | Passed                     |

## Next Packet

The next packet is `ELDW-003: Reconcile Extracted Metadata Counts`. It is not started by this readback.
