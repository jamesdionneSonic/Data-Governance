# eLeadDW Rovo Retrieval Dry Run Readback

Date: 2026-06-20
Work packet: ELDW-008
Mode: dry run only

## Result

Generated the scoped Rovo AI retrieval dry run for `eLeadDW` without publishing
to Confluence and without changing ingestion, parser, extractor, generator, or
lineage-scoring code.

## Output Artifacts

Root:

`data/confluence/rovo-ai-retrieval-dry-run/eleaddw-eldw-008`

Generated retrieval pages:

| Page family            | Files                                                                             |
| ---------------------- | --------------------------------------------------------------------------------- |
| Start here             | `rovo-start-here-eleaddw.md`                                                      |
| Object locator         | `rovo-object-locator-eleaddw-001.md` through `rovo-object-locator-eleaddw-005.md` |
| Database context       | `rovo-database-context-eleaddw-001.md`                                            |
| Object summary context | `rovo-object-summary-context-eleaddw-001.md`                                      |
| Upstream context       | `rovo-upstream-context-eleaddw-001.md`                                            |
| Downstream context     | `rovo-downstream-context-eleaddw-001.md`                                          |
| Column context         | `rovo-column-context-eleaddw-001.md`                                              |
| Ambiguity context      | `rovo-ambiguity-context-eleaddw-001.md`                                           |
| Evaluation prompts     | `rovo-evaluation-prompts-eleaddw.json`                                            |

Support artifacts:

| Artifact                                                    | Purpose                                                                                    |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| `manifest.json`                                             | Dry-run page manifest                                                                      |
| `validation/eleaddw-rovo-retrieval-dry-run-validation.json` | Validation result                                                                          |
| `*.evidence.json`                                           | Structured evidence for locator, database, object, lineage, column, and ambiguity contexts |

## Counts

| Signal                  | Value |
| ----------------------- | ----: |
| Locator rows            | 2,055 |
| Locator pages           |     5 |
| Object summary records  |    20 |
| Lineage context records |    20 |
| Column context records  |    20 |
| Ambiguity groups        |     0 |
| Evaluation prompts      |     6 |

Locator pages were split under the 500-row target from the Rovo retrieval
contract.

## Key Readback

`dwFullOpportunity` is locatable in the Rovo dry run.

Resolved id:

`object:sql_server:L1-DWASQL-02,12010.eLeadDW.dbo.dwFullOpportunity`

Locator page:

`rovo-object-locator-eleaddw-002.md`

The database prompt `Tell me about the eLeadDW database.` resolves to:

`database:eLeadDW`

## Validation

Validation status: passed

| Check                                            | Result |
| ------------------------------------------------ | ------ |
| Artifacts live under AI retrieval dry-run output | passed |
| Database context generated                       | passed |
| Required locator columns present                 | passed |
| Locator pages split under 500 rows               | passed |
| `dwFullOpportunity` can be located               | passed |
| Evaluation prompts generated                     | passed |
| Live publish not performed                       | passed |
| Unsupported facts guarded                        | passed |
| Obvious secrets or raw rows scan                 | passed |

Unsupported owner, SLA, lifecycle/status, live freshness, certification, and
business-purpose facts are marked as `not surfaced in metadata` when not
available.

## Source Evidence

The dry run was built from these deterministic artifacts:

- `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/manifest.json`
- `data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run/registry/canonical-objects.jsonl`
- `data/confluence/eleaddw-human-catalog-dry-run/manifest.json`
- `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW/_catalog/schema-inventory.json`
- `data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW/_catalog/lineage-edge-summary.json`

## Stop Point

ELDW-008 is complete.

ELDW-009, review dry runs and request approval, has not been started.
