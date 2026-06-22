# eLeadDW Human Confluence Catalog Dry Run Readback

Date: 2026-06-20
Work packet: ELDW-007
Mode: dry run only

## Result

Generated the scoped human-facing Confluence catalog dry run for `eLeadDW`
without publishing to Confluence and without performing cleanup, archive, delete,
or page-move actions.

## Output Artifacts

Root:

`data/confluence/eleaddw-human-catalog-dry-run`

Generated pages:

| Page                    | Tree path                                               | Evidence                           |
| ----------------------- | ------------------------------------------------------- | ---------------------------------- |
| `database-eleaddw.md`   | `Sonic Data Lineage / Database Catalog / eLeadDW`       | `database-eleaddw.evidence.json`   |
| `schema-eleaddw-dbo.md` | `Sonic Data Lineage / Database Catalog / eLeadDW / dbo` | `schema-eleaddw-dbo.evidence.json` |

Support artifacts:

| Artifact                                                   | Purpose                                                    |
| ---------------------------------------------------------- | ---------------------------------------------------------- |
| `manifest.json`                                            | Dry-run page manifest and validation pointer               |
| `page-tree.md`                                             | Review-only page tree                                      |
| `duplicate-superseded-page-report.json`                    | Report-only duplicate/superseded candidates                |
| `duplicate-superseded-page-report.md`                      | Human-readable report-only duplicate/superseded candidates |
| `validation/eleaddw-human-catalog-dry-run-validation.json` | Dry-run validation result                                  |

## Counts

| Signal                |  Value |
| --------------------- | -----: |
| Pages generated       |      2 |
| Included schema scope |  `dbo` |
| `dbo` objects listed  |    440 |
| `dbo` tables          |    311 |
| `dbo` views           |      3 |
| `dbo` procedures      |    119 |
| `dbo` functions       |      7 |
| `dbo` triggers        |      0 |
| Metadata columns      |  5,686 |
| Lineage edges         | 27,926 |
| Direct positive edges |    308 |
| Review-needed edges   | 27,618 |

## Validation

Validation status: passed

| Check                                                             | Result |
| ----------------------------------------------------------------- | ------ |
| Database page generated                                           | passed |
| Schema page generated                                             | passed |
| Schema page title is `dbo`                                        | passed |
| Old title pattern `Schema - eLeadDW.dbo` not used as a page title | passed |
| `dbo` object inventory complete                                   | passed |
| Missing governance facts are explicit                             | passed |
| Live Confluence publish not performed                             | passed |
| Cleanup not allowed                                               | passed |

Unsupported owner, data steward, SLA, lifecycle/status, live freshness, and
certification fields are marked as `not surfaced in metadata`.

## Duplicate And Cleanup Boundary

Duplicate and superseded pages are report-only candidates in this packet.

Cleanup allowed: false

The old schema-title path
`Sonic Data Lineage / Database Catalog / eLeadDW / Schema - eLeadDW.dbo` is
listed only as a report-only candidate. No cleanup action was taken.

## Source Evidence

The dry run was built from these local catalog artifacts:

- `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW/_catalog/schema-inventory.json`
- `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW/_catalog/canonical-object-list-dbo.json`
- `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW/_catalog/lineage-edge-summary.json`
- `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW/_catalog/lineage-cross-database-references.json`

## Stop Point

ELDW-007 is complete.

ELDW-008, Rovo retrieval dry run, has not been started.
