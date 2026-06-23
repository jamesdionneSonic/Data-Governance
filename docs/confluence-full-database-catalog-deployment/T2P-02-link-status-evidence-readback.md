# T2P-02 Link Status Evidence Readback

Generated: 2026-06-23

## Purpose

This readback completes T2P-02 from
`docs/DATABASE_CATALOG_TIER2_OBJECT_COVERAGE_WORK_PACKETS.md`.

It adds deterministic link status fields to database and schema evidence
packets so future packets can safely render object-name hyperlinks without
matching on display text alone.

No Confluence publish, cleanup, archive, delete, or move was performed.

## Contract Added

Each database high-use object row and schema object row now carries:

| Field                   | Meaning                                                                                                           |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `canonical_page_path`   | Expected human object page path under `Database Catalog / <Platform/Product> / <Database> / <Schema> / <Object>`. |
| `canonical_page_exists` | Boolean readback signal. It remains `false` in dry-run output until a live publish/readback confirms the page.    |
| `planned_in_packet`     | Boolean signal showing whether an object page is generated in the same dry-run packet.                            |
| `link_status`           | `linked`, `pending`, or `blocked`. T2P-02 dry-run rows are `pending`.                                             |
| `link_status_reason`    | Human-readable explanation for why the row is linked, pending, or blocked.                                        |

Schema evidence also includes a `link_status_summary` rollup.

## Validation Result

| Signal                         | Value |
| ------------------------------ | ----- |
| Database pages checked         | 34    |
| Schema pages checked           | 147   |
| Schema object rows checked     | 5348  |
| Database high-use rows checked | 235   |
| Rows planned in packet         | 34    |
| Pending link rows              | 5583  |
| Linked rows                    | 0     |
| Blocked rows                   | 0     |
| Rows missing link fields       | 0     |

## Commands

| Command                            | Result |
| ---------------------------------- | ------ |
| `npm run confluence:human:dry-run` | Passed |
| `npm run confluence:human:check`   | Passed |

## Interpretation

T2P-02 does not make visible Confluence hyperlinks. It makes the evidence ready
for T2P-03 and T2P-04 by giving every schema/database object row a deterministic
link state.

Because this was a dry run, `canonical_page_exists` remains `false` and
`link_status` remains `pending`. Rows for the existing 25 generated object pages
are marked `planned_in_packet: true`; all other rows remain pending until their
Tier 2 object pages are generated and reviewed.

## Next Packet

Proceed with T2P-03 for the first one-schema dry run. The recommended first
slice remains:

```text
SQL Server / eLeadDW / dbo
```

That schema includes `dwFullOpportunity`, which is high-use and still lacks a
current Tier 2 object page.
