# eLeadDW Connector Test Readback - 2026-06-20

## Work Packet

- Backlog item: `ELDW-001`
- Purpose: confirm the reusable eLeadDW SQL Server connector is reachable before any metadata extraction, lineage processing, DevOps publication, or Confluence publication.
- Connector id: `sqlserver-l1-dwasql-02-12010-eleaddw`
- Configured endpoint: `L1-DWASQL-02,12010`
- Configured database: `eLeadDW`

## Test Result

| Signal                   | Result                  |
| ------------------------ | ----------------------- |
| Status                   | `succeeded`             |
| Connection status        | `ready`                 |
| Live connection valid    | `true`                  |
| Metadata discovery valid | `true`                  |
| SQL Server reported      | `D1-DWASQL-01\INST1`    |
| Database reported        | `eLeadDW`               |
| Runtime login            | `SONIC\James.Dionne`    |
| Runtime host             | `SHQCORP01702`          |
| Elapsed time             | `668 ms`                |
| Test phase               | `connection_validation` |
| Secret exposed           | `false`                 |
| Raw data captured        | `false`                 |

## Scope Boundary

- No metadata extraction was run.
- No lineage processing was run.
- No Azure DevOps catalog or runtime package publication was run.
- No Confluence publication was run.
- No raw rows, sample data, credentials, tokens, or connection strings were written.

## Acceptance Criteria

| Criterion                                | Status |
| ---------------------------------------- | ------ |
| Connector test/readback completed        | Passed |
| Status is succeeded                      | Passed |
| Database is `eLeadDW`                    | Passed |
| Secret values are not written            | Passed |
| No metadata extraction runs in this task | Passed |

## Next Packet

The next packet is `ELDW-002: Define eLeadDW Metadata Scope Contract`. It is not started by this readback.
