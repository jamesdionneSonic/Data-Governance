# eLeadDW Dry Run Review And Approval Request

Date: 2026-06-20
Work packet: ELDW-009
Mode: review only

## Result

Reviewed the completed eLeadDW onboarding dry runs and prepared the explicit
approval checkpoint for publication decisions.

No Azure DevOps publish, Confluence publish, cleanup, archive, delete, or page
move was performed by this work packet.

## Dry Run Status

| Area                                 | Status                    | Evidence                                                                                      |
| ------------------------------------ | ------------------------- | --------------------------------------------------------------------------------------------- |
| Connector test                       | passed                    | `docs/lineage-runtime-readbacks/2026-06-20-eleaddw-connector-test-readback.md`                |
| Metadata extraction                  | passed                    | `docs/lineage-runtime-readbacks/2026-06-20-eleaddw-metadata-extraction-readback.md`           |
| Count reconciliation                 | passed                    | `docs/lineage-runtime-readbacks/2026-06-20-eleaddw-metadata-count-reconciliation.md`          |
| Local catalog artifacts              | passed                    | `docs/lineage-runtime-readbacks/2026-06-20-eleaddw-local-catalog-artifacts-readback.md`       |
| Local lineage validation             | passed with review caveat | `docs/lineage-runtime-readbacks/2026-06-20-eleaddw-local-lineage-edge-validation-readback.md` |
| Azure DevOps runtime package dry run | passed                    | `docs/lineage-runtime-readbacks/2026-06-20-eleaddw-devops-runtime-dry-run-readback.md`        |
| Human Confluence catalog dry run     | passed                    | `docs/lineage-runtime-readbacks/2026-06-20-eleaddw-human-confluence-dry-run-readback.md`      |
| Rovo retrieval dry run               | passed                    | `docs/lineage-runtime-readbacks/2026-06-20-eleaddw-rovo-retrieval-dry-run-readback.md`        |

## Extraction Counts

| Metric            |  Count |
| ----------------- | -----: |
| Schemas           |      3 |
| Tables            |    324 |
| Views             |      3 |
| Stored procedures |    130 |
| Functions         |      7 |
| Triggers          |      0 |
| Metadata objects  |    467 |
| Metadata columns  |  5,686 |
| Lineage edges     | 27,926 |

Trigger count is zero by extraction result, not a failed stream.

## Catalog Scope

Local catalog artifacts were generated under:

`data/markdown/servers/L1-DWASQL-02,12010/databases/eLeadDW`

Schema inventory:

| Schema              | Total Catalog Records | Tables | Views | Procedures | Functions | Triggers | Human page included |
| ------------------- | --------------------: | -----: | ----: | ---------: | --------: | -------: | ------------------- |
| `dbo`               |                   441 |    311 |     3 |        119 |         7 |        0 | yes                 |
| `mdp`               |                    17 |      5 |     0 |         11 |         0 |        0 | no                  |
| `SONIC\sunil.rawal` |                     9 |      8 |     0 |          0 |         0 |        0 | no                  |

The human Confluence dry run intentionally included only:

- `Sonic Data Lineage / Database Catalog / eLeadDW`
- `Sonic Data Lineage / Database Catalog / eLeadDW / dbo`

## Lineage Confidence Summary

| Signal                          |  Count |
| ------------------------------- | -----: |
| Total lineage edges             | 27,926 |
| Direct positive edges           |    308 |
| Review-needed edges             | 27,618 |
| Cross-domain matched references |      2 |

Edge classification:

| Extracted Edge Type |  Count | Decision                |
| ------------------- | -----: | ----------------------- |
| `loads`             |    206 | positive write evidence |
| `reads`             |    102 | positive read evidence  |
| `column_match`      | 27,618 | review-needed only      |

Important caveat:

The `column_match` edges are exact-name metadata hints. They are useful review
evidence, but they are not confirmed business lineage and must not be presented
as high-confidence lineage without additional SQL, SSIS, ADF, or report
evidence.

Known deterministic cross-database references surfaced in this pass:

| Domain        | Matched Edges |
| ------------- | ------------: |
| `ETL_Staging` |             1 |
| `StagingDB`   |             1 |
| `Sonic_DW`    |             0 |
| `VendorData`  |             0 |
| `SSIS`        |             0 |
| `ADF`         |             0 |
| `SSRS`        |             0 |

## Azure DevOps Runtime Dry Run

Output root:

`data/lineage-runtime-package-dry-run/eleaddw-runtime-dry-run`

Validation status: passed

| Artifact                               |  Count |
| -------------------------------------- | -----: |
| Canonical objects                      |    440 |
| Registry rows                          |    440 |
| Alias keys                             |  1,320 |
| Context packs                          |    440 |
| Answer cards                           |  2,200 |
| Positive upstream/downstream edges     |    308 |
| Review-needed edges retained as review | 27,618 |

Safety checks:

| Check                                             | Result  |
| ------------------------------------------------- | ------- |
| Raw rows exposed                                  | no      |
| Sample data exposed                               | no      |
| Secrets exposed                                   | no      |
| Credentials exposed                               | no      |
| Connection strings exposed                        | no      |
| Ingestion/parser/extractor/generator code exposed | no      |
| Azure DevOps live publish                         | not run |
| Confluence live publish                           | not run |

## Human Confluence Dry Run

Output root:

`data/confluence/eleaddw-human-catalog-dry-run`

Validation status: passed

| Check                                                             | Result  |
| ----------------------------------------------------------------- | ------- |
| Database page generated                                           | passed  |
| Schema page generated                                             | passed  |
| Schema page title is `dbo`                                        | passed  |
| Old title pattern `Schema - eLeadDW.dbo` not used as a page title | passed  |
| `dbo` object inventory complete                                   | passed  |
| Missing governance facts explicit                                 | passed  |
| Live Confluence publish                                           | not run |
| Cleanup allowed                                                   | false   |

Unsupported owner, data steward, SLA, lifecycle/status, live freshness, and
certification fields are marked as `not surfaced in metadata`.

Duplicate and superseded pages are report-only candidates. Cleanup is not
approved or bundled with publication.

## Rovo Retrieval Dry Run

Output root:

`data/confluence/rovo-ai-retrieval-dry-run/eleaddw-eldw-008`

Validation status: passed

| Artifact                | Count |
| ----------------------- | ----: |
| Locator rows            | 2,055 |
| Locator pages           |     5 |
| Object summary records  |    20 |
| Lineage context records |    20 |
| Column context records  |    20 |
| Ambiguity groups        |     0 |
| Evaluation prompts      |     6 |

Key readback:

| Prompt                                | Resolution                                                           |
| ------------------------------------- | -------------------------------------------------------------------- |
| `Tell me about the eLeadDW database.` | `database:eLeadDW`                                                   |
| `Find dwfullopportunity.`             | `object:sql_server:L1-DWASQL-02,12010.eLeadDW.dbo.dwFullOpportunity` |

The `dwFullOpportunity` locator row is present in
`rovo-object-locator-eleaddw-002.md`.

## Unresolved Risks And Limitations

| Risk or limitation                                                      | Impact                                                                           | Required handling                                                                  |
| ----------------------------------------------------------------------- | -------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------- |
| 27,618 `column_match` edges are review-needed                           | Rovo or users may over-trust name-matching if caveats are ignored                | Keep labels and caveats; do not train or publish as confirmed lineage              |
| Human Confluence dry run covers `dbo` only                              | `mdp` and `SONIC\sunil.rawal` are not human browsing pages in this packet        | Treat excluded schemas as out of scope unless separately approved                  |
| Business purpose is not surfaced in metadata                            | Human pages and Rovo answers cannot honestly state business ownership or purpose | Answer `not surfaced in metadata` until a reviewed source supplies it              |
| SSIS, ADF, SSRS references are zero in deterministic eLeadDW extraction | Cross-system impact may be incomplete                                            | Do not claim no operational dependencies exist; say none surfaced in this evidence |
| Cleanup candidates exist only as report-only findings                   | Old or duplicate pages may remain if live publish occurs                         | Cleanup requires separate approval after replacement pages are verified            |

## Approval Request

Approval is intentionally split.

### Option A: Approve Azure DevOps Runtime Publish Only

Approves publishing the reviewed machine-readable eLeadDW runtime package to the
approved Azure DevOps lineage artifact location.

Does not approve:

- Confluence publish;
- Rovo page publish;
- cleanup, archive, delete, or page move;
- parser, extractor, lineage-scoring, or auth changes.

### Option B: Approve Confluence Human And Rovo Publish Only

Approves publishing the reviewed eLeadDW human catalog pages and Rovo retrieval
pages to Confluence under the approved Sonic Data Lineage branches.

Does not approve:

- Azure DevOps runtime publish;
- cleanup, archive, delete, or page move;
- parser, extractor, lineage-scoring, or auth changes.

### Option C: Approve Both Publishes

Approves both Option A and Option B.

Still does not approve cleanup, archive, delete, page move, parser/extractor
changes, lineage-scoring changes, auth changes, raw row publication, or secret
publication.

### Option D: Do Not Publish Yet

Leaves all artifacts as local dry runs.

Use this if the review-needed lineage count, excluded schemas, or missing
business meaning need more review before publication.

## Stop Point

ELDW-009 is complete.

No publish task has been started.

The next tasks require explicit user approval:

- ELDW-010: Publish to Azure DevOps after approval.
- ELDW-011: Publish to Confluence after approval.
