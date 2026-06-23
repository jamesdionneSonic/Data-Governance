# FDP-08 Legacy Database Catalog Cleanup Readback

Generated: 2026-06-23T14:47:08.081Z

Cleanup mode: `dry-run only`

## Summary

| Signal                           | Value |
| -------------------------------- | ----: |
| Direct children reviewed         |     2 |
| Legacy candidates                |     0 |
| Eligible for archive             |     0 |
| Archived                         |     0 |
| Skipped                          |     0 |
| Canonical replacements not found |     0 |
| Skipped for live risk            |     0 |

## Candidates

| Legacy Page | Page ID | Canonical Replacement | Action | Reason |
| ----------- | ------- | --------------------- | ------ | ------ |
| none        |         |                       |        |        |

## Guardrails

- Only direct children under `Sonic Data Lineage / Database Catalog` were considered.
- Only `Database Catalog - <database>` pages and the legacy `ssisdb` page were eligible.
- The legacy `ssisdb` page subtree is archived only when `--include-ssisdb-subtree` is passed and the child pages have no deeper children, attachments, or comments.
- Canonical platform/database replacement pages had to exist before archive.
- Pages with child pages, attachments, or comments were skipped.
