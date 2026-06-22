---
name: HyperCards
product_id: product-hypercards
version: 1.0.0
status: published
domain: Executive Analytics
owner: Data Engineering
steward: Data Engineering
assets: []
sla: {}
tags:
  - hypercards
  - executive-analytics
  - needs-lineage-review
certified: false
certified_by: null
certification_date: null
trust_level: needs-lineage-review
consumers:
  - Executive analytics users
  - Dashboard consumers
output_port:
  type: lineage-documented asset bundle
  location: ''
  format: SQL Server / SSIS metadata
created_at: 2026-06-17
last_updated: 2026-06-17
---

# HyperCards

## Plain-English Summary

HyperCards is included as a key product, but the current lineage package does not expose strong object or SSIS naming evidence for `HyperCards`. This page intentionally documents the evidence gap so the product does not disappear from the catalog.

If HyperCards depends on the warehouse during maintenance windows, users may see stale cards or failed drilldowns, but the current lineage package cannot yet prove the exact source and target chain.

## Product Domain

| Field                     | Value                    |
| ------------------------- | ------------------------ |
| Product                   | HyperCards               |
| Domain                    | Executive Analytics      |
| Evidence strength         | Needs source review      |
| Catalog objects matched   | 0                        |
| SSIS packages matched     | 0                        |
| Runtime package version   | 2026.6.13-1              |
| Runtime package generated | 2026-06-13T23:31:32.400Z |

## What This Product Appears To Do

HyperCards is included as a key product, but the current lineage package does not expose strong object or SSIS naming evidence for `HyperCards`. This page intentionally documents the evidence gap so the product does not disappear from the catalog.

For support and upgrade planning, treat this product as a bundle of warehouse tables/views/procedures, SSIS packages, and external-feed artifacts rather than a single table. The highest-impact assets below are prioritized by lineage connectivity and available column metadata.

## Lineage Scope

### Object Types

_No lineage evidence found in the current package._

### Main Databases

_No lineage evidence found in the current package._

### SSIS Folders

_No lineage evidence found in the current package._

### Folder Catalog Matches

_No lineage evidence found in the current package._

## Important Assets To Start With

_No lineage evidence found in the current package._

## SSIS / Orchestration Evidence

_No lineage evidence found in the current package._

## Consumers And Support Impact

- Executive analytics users
- Dashboard consumers

## Known Gaps / Caveats

- No strong HyperCards object/folder/package matches were found in the current lineage package.
- This needs an owner-provided source list, BI workspace, report inventory, or application metadata source to complete.

## Evidence

- Runtime package: `sonic-data-lineage-runtime` version `2026.6.13-1`, hash `514712d9e99a5e3c8e35dcb5f8fb3f74c44e98babcab3585f8a3e1957250aaff`
- Registry: `registry/canonical-objects.jsonl`
- SSIS folder index: `ssis/README.md`
- Generated from local lineage package on 2026-06-17
