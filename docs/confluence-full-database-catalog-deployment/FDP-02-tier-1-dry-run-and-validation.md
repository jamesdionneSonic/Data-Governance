# FDP-02 Tier 1 Dry Run And Validation

Generated: `2026-06-19`

## Scope

This packet generated a full Tier 1 human catalog dry run for every included
cataloged database under:

```text
Sonic Data Lineage / Database Catalog / <Database> / <Schema>
```

No live Confluence publish or cleanup was performed.

## Inventory Baseline

| Signal                                  | Value                      |
| --------------------------------------- | -------------------------- |
| Source runtime package version          | `2026.6.18-1`              |
| Source catalog generated at             | `2026-06-17T12:13:35.669Z` |
| Raw database entries                    | 37                         |
| Canonical database names                | 33                         |
| Included databases                      | 32                         |
| Excluded databases                      | 1                          |
| Included schemas                        | 145                        |
| Included objects                        | 5,134                      |
| Blocked schemas                         | 4                          |
| Blocked objects                         | 6                          |
| Excluded SSIS package/catalog artifacts | 2,051                      |
| Source canonical objects                | 7,191                      |

## SSIS Boundary

`ssisdb` package and dataset artifacts were excluded from Database Catalog page
generation. These artifacts belong in SSIS support documentation, not in the
database browse hierarchy.

The excluded artifacts were:

| Database | Type      | Count | Example                                                        |
| -------- | --------- | ----- | -------------------------------------------------------------- |
| `ssisdb` | `dataset` | 1,045 | `CashPro.CashManagement.CashProBoADataLoad.dtsx.SFL - BoACash` |
| `ssisdb` | `package` | 1,006 | `CallRevu.CallRevu.CallRevu_Department.dtsx`                   |

The dry-run output directory is cleaned before generation so stale `ssisdb`
Database Catalog files cannot remain from older runs.

Note: the catalog still includes a separate database named `SSIS` with one
`Meta` table. That is not a package artifact from `ssisdb`; suppressing the
entire `SSIS` database would be a separate scope decision.

## Dry Run Output

| Signal                        | Value                                                             |
| ----------------------------- | ----------------------------------------------------------------- |
| Dry-run pages                 | 213                                                               |
| Superseded cleanup candidates | 170                                                               |
| Cleanup allowed               | No                                                                |
| Publish performed             | No                                                                |
| Output root                   | `data/confluence/human-catalog-dry-run`                           |
| Manifest                      | `data/confluence/human-catalog-dry-run/manifest.json`             |
| Inventory                     | `data/confluence/full-database-catalog-deployment/inventory.json` |

## Validation

Commands run:

```powershell
node --check scripts\build-full-database-catalog-inventory.mjs
node --check scripts\build-human-confluence-catalog-dry-run.mjs
node --check scripts\check-human-confluence-catalog-dry-run.mjs
npm run confluence:full:inventory
npm run confluence:human:dry-run
npm run confluence:human:check
rg -i "Database Catalog.*ssisdb|schema-ssisdb|database-ssisdb|no_schema" data\confluence\human-catalog-dry-run
```

Results:

- Inventory validation: passed.
- Human catalog validation: passed.
- Checked pages: 213.
- Filesystem guard: passed for `no-ssisdb-database-catalog-artifacts`.
- Smoke checks: passed for canonical schema paths, canonical object paths,
  object trust fields, weak-evidence wording, and SSIS Database Catalog
  rejection.
- Targeted `rg` search found no generated `ssisdb`, `database-ssisdb`,
  `schema-ssisdb`, or `no_schema` output after the clean dry run.

## Review Notes

- The dry run is ready for Tier 1 review.
- Cleanup candidates remain report-only and require separate approval.
- The next packet should prepare the reviewed Tier 1 publish packet without
  reintroducing `ssisdb` package/catalog artifacts into Database Catalog.
