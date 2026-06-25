# ADR-024: Validation Exception Classification And Accuracy Taxonomy

## Status

Accepted

## Date

2026-06-25

## Context

The Snowflake/DMS shared-consumption validation initially classified records as
missing, Snowflake-only, matched, changed, timing candidates, or unexplained.
That was enough to prove the daily workflow, but it is not enough for vendor
research or source-accuracy decisions.

The SA476 repair-order investigation showed why. Many repair orders appeared to
be `missing_from_snowflake` under the scoped validation key, but a broader
Snowflake search found the same RO numbers elsewhere in `REPAIR_ORDER_RAW`.
The real issue was likely dealer/store/account mapping, not missing Snowflake
feed coverage.

The next validation phase must support source accuracy review. It must separate:

- whether the record exists anywhere in the candidate source;
- whether the record is under the expected dealer/store/account context;
- whether the business key, grain, date, and lifecycle status line up;
- whether material amounts reconcile within agreed tolerances;
- whether the remaining issue is suitable for vendor research.

## Decision

Validation datasets must use a layered classification model.

Raw comparison labels must remain available for audit, but reviewer-facing
outputs must add a more specific `review_classification` and
`classification_reason` when evidence supports it.

For example, a record can keep the raw exception type:

```text
missing_from_snowflake_scoped_match
```

and also carry the reviewer classification:

```text
found_in_snowflake_wrong_dealer_context
```

This preserves the technical truth that the scoped comparison did not match,
while making the business/vendor issue clearer.

## Classification Groups

### Presence And Coverage

- `true_missing_from_snowflake`: DMS has the record and a broad Snowflake search
  cannot find it.
- `true_snowflake_only`: Snowflake has the record and DMS cannot find it.
- `timing_candidate`: the record is recent or update timestamps suggest it may
  appear or settle on a later refresh.
- `outside_validation_scope`: the record exists but should not be part of the
  comparison population based on date, status, dealer, or lifecycle rules.

### Dealer And Store Mapping

- `found_in_snowflake_wrong_dealer_context`: the record exists in Snowflake, but
  not under the expected dealer/store/account mapping.
- `blank_primary_dealer_with_secondary_match`: the primary Snowflake dealer
  field is blank, but secondary fields such as `EIS_STORE_ID` or
  `ACCOUNTINGACCOUNT` point to the expected account context.
- `ambiguous_dealer_context`: the same business record exists under multiple
  possible dealer/store values and cannot be classified safely.
- `mapping_rule_gap`: repeated evidence shows the validation needs a new mapping
  rule rather than one-off manual research.

### Business Key And Grain

- `business_key_format_mismatch`: same record appears to exist but key
  formatting differs, such as leading zeros, suffixes, prefixes, casing,
  trimming, or punctuation.
- `duplicate_source_record`: one source has multiple records for the same
  business key and must be deduplicated before accuracy can be judged.
- `grain_mismatch`: one source is header-level while the other is line,
  detail, status-event, or transaction-level.

### Date And Lifecycle

- `business_date_mismatch`: same record exists but the selected business date
  differs.
- `status_lifecycle_mismatch`: same record exists but lifecycle state differs,
  such as open, closed, posted, voided, reversed, or cancelled.
- `late_update_or_restatement`: same record exists but one side has a later
  update timestamp or restated value.

### Accuracy And Amount Reconciliation

- `amount_match`: business key matches and material amount is within tolerance.
- `amount_rounding_difference`: difference is below agreed tolerance.
- `amount_component_gap`: amount differs because one side includes or excludes
  fees, tax, shop supplies, sublet, discounts, warranty, customer-pay,
  internal-pay, or similar components.
- `amount_sign_or_credit_mismatch`: same amount family exists, but sign,
  credit/debit treatment, reversal, or adjustment logic differs.
- `amount_null_vs_zero_mismatch`: one side treats absence as null and the other
  as zero.
- `material_amount_mismatch_unexplained`: amount differs beyond tolerance and no
  timing, component, status, or mapping explanation is known.

## Workbook Requirement

Business-review workbooks must include a definitions tab for the active
classification model.

The tab must explain:

- raw exception type;
- reviewer classification;
- plain-English meaning;
- first check;
- vendor handoff guidance;
- whether the classification is a coverage, mapping, timing, key/grain,
  date/status, amount, or unexplained issue.

## Vendor Handoff Rule

Vendor-facing samples must not say a record is missing when evidence shows it is
present elsewhere in the candidate source. In that case, handoff files should
say the record was found outside the expected dealer/store/account context and
include the candidate source fields that explain why.

## Consequences

- Dashboard counts will become more useful and less alarming.
- The team can work through mapping and grain issues before making data-quality
  claims.
- Vendor conversations can focus on concrete evidence, such as
  `cora_acct_code`, RO number, Snowflake `DEALERCODE`, `EIS_STORE_ID`, and
  `ACCOUNTINGACCOUNT`.
- Output contracts must expand to include classification fields, and the first
  run after the change may reset exception identity if keys or classifications
  change.

## Validation

Each implementation must prove:

- raw exception type is preserved;
- reviewer classification is deterministic;
- classification reasons are populated for classified rows;
- workbook definitions match the code/config taxonomy;
- vendor research samples include the evidence fields needed to reproduce the
  classification;
- daily execution remains one-command and read-only.

## Related Documents

- `docs/adr/ADR-023-Repeatable-Read-Only-Data-Validation-Lab.md`
- `docs/DATA_VALIDATION_LAB_CONTRACT.md`
- `docs/DATA_VALIDATION_LAB_BACKLOG.md`
- `docs/DATA_VALIDATION_LAB_WORK_PACKETS.md`
- `data-validation/datasets/snowflake-dms-shared-consumption/VALIDATION_REVIEW_GUIDE.md`
