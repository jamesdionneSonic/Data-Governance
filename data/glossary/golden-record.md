---
term: Golden Record
domain: Master Data Management
status: approved
owner: data-governance-team
steward: mdm.lead@company.com
abbreviation: GR
related_terms: [Master Data, Data Product, Single Source of Truth, Data Quality]
tags: [mdm, quality, master-data, governance]
created_at: 2026-01-01
last_reviewed: 2026-06-01
---

# Golden Record

## Definition

A **Golden Record** is the single, authoritative, trusted version of a data entity (e.g., a
customer, product, or supplier) that represents the best-known truth across all source systems.

## Characteristics

- **Authoritative**: Designated as the master source for the entity
- **Survivored**: Created by applying merge/survivorship rules across duplicate records
- **Certified**: Carries a `certified: true` flag and a trust score ≥ 80
- **Governed**: Has an assigned owner, steward, and documented lineage

## Creation Process

1. Identify all source records for the entity across systems
2. Apply deduplication and matching rules
3. Apply survivorship rules (e.g., most recent, most complete)
4. Validate against quality thresholds
5. Publish as a certified Data Product

## Platform Representation

Golden Records are represented as certified data assets with `trust_level: gold` in
their YAML frontmatter. They appear with a gold badge in the data catalog.
