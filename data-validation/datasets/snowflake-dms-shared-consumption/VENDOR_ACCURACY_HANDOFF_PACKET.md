# Vendor Accuracy Handoff Packet

## Purpose

This packet turns the current Snowflake versus DMS accuracy dashboard into
vendor/source-owner research questions.

DMS is the source of record for this validation. Snowflake is the candidate
source being evaluated.

Current successful run id: `20260626T112910Z`

Workbook:

```text
excel/Snowflake_DMS_Shared_Consumption_Validation.xlsx
```

## Current Decision

Overall status: `not_ready`

Subject-area status:

- Vehicle sales: `review_needed`
- Repair orders: `not_ready`

Plain-English summary:

Vehicle sales is close, but two material amount mismatches remain unexplained.
Repair orders is not ready because row coverage, dealer/account mapping, and
`PAYCPTOTAL` formula-definition blockers are still open.

## Questions For Vendor Or Source Owner

### 1. Vehicle Sales Amount Accuracy

Current blocker:

- `2` vehicle-sales rows are classified as
  `material_amount_mismatch_unexplained`.

Question:

```text
For the vehicle-sales rows in the sample, why does the Snowflake amount differ
from the DMS amount when the business key matches?
```

Sample:

```text
current/accuracy/samples/accuracy_unexplained_amount_mismatch_sample.csv
```

Examples currently in the sample:

| cora_acct_code | business_date | business_key    | DMS value | Snowflake value | Difference |
| -------------- | ------------- | --------------- | --------- | --------------- | ---------- |
| SA466-S        | 2026-06-01    | SA466-S\|236690 | 0         | 62800           | 62800      |
| SA466-S        | 2026-06-18    | SA466-S\|237253 | 45486     | 0               | -45486     |

Expected response:

- confirm whether the DMS amount or Snowflake amount is correct;
- identify whether the difference is timing, status, reversal, field mapping, or
  source defect;
- identify the source fields Snowflake uses for the comparable amount.

### 2. Repair Order PAYCPTOTAL Formula

Current blocker:

- `654` repair-order rows are classified as `amount_component_gap`.

Question:

```text
What is the exact source formula for Snowflake REPAIR_ORDER_RAW.PAYCPTOTAL, and
which DMS components should be used to compare against it?
```

Current DMS comparison formula:

```text
laborsalecustomerpay + partssalecustomerpay + miscsalecustomerpay
```

Sample:

```text
current/accuracy/samples/accuracy_amount_component_gap_sample.csv
```

Example rows currently in the sample:

| cora_acct_code | business_date | business_key    | DMS value | Snowflake value | Difference |
| -------------- | ------------- | --------------- | --------- | --------------- | ---------- |
| SA466-S        | 2026-05-27    | SA466-S\|747996 | 1261.35   | 1296            | 34.65      |
| SA466-S        | 2026-05-27    | SA466-S\|748481 | 753.16    | 817             | 63.84      |
| SA466-S        | 2026-05-27    | SA466-S\|748548 | 636.76    | 642             | 5.24       |

Expected response:

- define `PAYCPTOTAL`;
- confirm whether it includes tax, shop supplies, sublet, fees, discounts,
  warranty, internal pay, or other components;
- identify the DMS fields that should be included for a like-for-like
  comparison;
- confirm whether the formula is the same for open and closed repair orders.

### 3. Repair Order Dealer And Account Mapping

Current blockers:

- `502` rows are classified as `blank_primary_dealer_with_secondary_match`;
- `29` rows are classified as `found_in_snowflake_wrong_dealer_context`.

Question:

```text
Which Snowflake field is authoritative for matching repair orders back to the
DMS cora_acct_code?
```

Fields currently being reviewed:

- `cora_acct_code`
- `DEALERCODE`
- `STORENUMBER`
- `EIS_STORE_ID`
- `ACCOUNTINGACCOUNT`

Sample:

```text
current/accuracy/samples/accuracy_mapping_review_sample.csv
```

Example mapping-context rows currently in the sample:

| cora_acct_code | business_date | business_key    | Snowflake DEALERCODE | EIS_STORE_ID | ACCOUNTINGACCOUNT |
| -------------- | ------------- | --------------- | -------------------- | ------------ | ----------------- |
| SA466-S        | 2026-05-27    | SA466-S\|748882 | 05752                | S100019254   | SA466-A           |
| SA466-S        | 2026-05-28    | SA466-S\|748295 | 05102                | S100019254   | SA466-A           |
| SA466-S        | 2026-05-30    | SA466-S\|748480 | 05123                | S100019254   | SA466-A           |

Expected response:

- confirm the authoritative dealer/account field;
- explain when `DEALERCODE` can be blank or different from DMS
  `cora_acct_code`;
- confirm whether `ACCOUNTINGACCOUNT` values such as `SA466-A` should map to
  `SA466-S`;
- provide a durable mapping rule for `SA466-S` and `SA476-S`.

### 4. True Missing Repair Order Candidate

Current blocker:

- `1` row is classified as `true_missing_from_snowflake`.

Question:

```text
Should repair order 107344 for SA476-S be present in Snowflake
REPAIR_ORDER_RAW?
```

Sample:

```text
current/accuracy/samples/accuracy_true_missing_from_snowflake_sample.csv
```

Current candidate:

| cora_acct_code | business_date | business_key    | Finding                                                          |
| -------------- | ------------- | --------------- | ---------------------------------------------------------------- |
| SA476-S        | 2026-05-27    | SA476-S\|107344 | Present in DMS, not found in Snowflake by broad RO-number search |

Expected response:

- confirm whether the row should be included in the shared Snowflake feed;
- identify whether the row is excluded by status, date, dealer, or source-feed
  rule;
- if it should be present, identify why it is missing.

### 5. Timing Candidate

Current review item:

- `1` row is classified as `timing_candidate`.

Question:

```text
Is vehicle sale 237319 a Snowflake freshness lead, a DMS lag, or an out-of-scope
row?
```

Sample:

```text
current/accuracy/samples/accuracy_timing_review_sample.csv
```

Expected response:

- confirm whether the row later appears in DMS;
- confirm whether Snowflake publishes this event earlier than DMS;
- identify the correct handling rule for future timing candidates.

## Requested Vendor Response Format

For each question, please respond with:

- accepted rule or formula;
- rejected rule or formula, if applicable;
- source field names used by the vendor;
- whether the issue is a data defect, mapping rule, timing behavior, or
  validation logic change;
- effective date, if the rule changes over time;
- one or two confirmed example rows.

## What We Will Do After Response

After the vendor/source owner responds, the validation workflow should be
updated only where evidence supports a deterministic rule:

- update dealer/account mapping rules;
- update repair-order amount formula logic;
- reclassify rows that are proven timing behavior;
- leave unexplained rows as candidate defects until resolved;
- rerun the daily workflow and compare the next accuracy scorecard.
