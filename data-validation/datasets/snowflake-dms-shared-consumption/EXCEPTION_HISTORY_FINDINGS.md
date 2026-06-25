# Exception History Findings

Dataset: `snowflake-dms-shared-consumption`

Latest live history-aware run: `20260624T190123Z`

## Outputs

Current history CSVs:

- `current/exceptions/open_exceptions.csv`
- `current/exceptions/resolved_since_last_run.csv`

Historical copies are archived under:

- `runs/20260624T190123Z/`

## Run Result

This was the first history-aware detail exception run.

- Open exceptions written: `1558`
- Resolved since last run: `0`
- Row limit: `1000`

The open total includes:

- missing-from-Snowflake exception rows;
- Snowflake-only exception rows;
- bounded changed-value rows from `changed_records.csv`.

## Behavior

On each `detail_exceptions` run, the runner now:

- reads the prior `current/exceptions/open_exceptions.csv`;
- builds the current exception set from the new bounded exception outputs;
- preserves the original `first_seen_run` for recurring exceptions;
- updates `last_seen_run` to the current run;
- calculates `days_open` from first-seen and current run dates;
- writes exceptions no longer present to `resolved_since_last_run.csv`.

## Caveats

Changed-value exception history is bounded by the configured row limit. If the
changed-record source output is capped, only written changed-value rows can be
tracked through history.

Repair-order exceptions are still mapping and rule-discovery evidence until the
dealer-code crosswalk and amount semantics are confirmed.

## Next Build Step

`WP-DVL-008` should wire the Excel workbook to the stable `current/` CSV files
and make `Refresh All` the normal reviewer workflow.
