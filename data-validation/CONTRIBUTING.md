# Contributing To Data Validation Lab

## Change Types

Use the work packets in `docs/DATA_VALIDATION_LAB_WORK_PACKETS.md`.

Small safe changes:

- documentation updates;
- config comments;
- SQL placeholder improvements;
- workbook template formatting.

Medium changes:

- new read-only SQL extracts;
- runner script changes;
- output contract changes;
- Excel dashboard changes.

High-risk changes requiring explicit review:

- expanding dealer/date scope;
- increasing detail row limits materially;
- changing source-of-record labels;
- publishing local extracts outside the workstation;
- changing connector authentication or permissions.

## SQL Review Checklist

- Query is read-only.
- No `SELECT *`.
- Dealer/date filters are explicit.
- Business key assumptions are documented.
- Output columns have stable aliases.
- Detail outputs are bounded.

## CSV Review Checklist

- CSV filename is stable.
- Headers match `config/output-contract.yml`.
- Business data is ignored by Git.
- Run archive exists under `runs/<run-id>/`.
- Latest copy exists under `current/`.
