---
term: Data Product
domain: Data Governance
status: approved
owner: data-governance-team
steward: chief.data.officer@company.com
abbreviation: DP
related_terms: [Data Asset, Data Contract, Data Marketplace]
tags: [core, governance, product]
created_at: 2026-01-01
last_reviewed: 2026-06-01
---

# Data Product

## Definition

A **Data Product** is a curated, discoverable, and trustworthy collection of data assets that
is managed as a product with a defined owner, SLA, and consumer contract.

## Key Characteristics

- **Discoverable**: Listed in the data marketplace with full metadata
- **Addressable**: Has a unique identifier and stable API/endpoint
- **Trustworthy**: Carries quality scores, certification status, and lineage
- **Self-describing**: Includes schema, examples, and usage documentation
- **Interoperable**: Conforms to organizational data standards

## Usage Examples

- The `sales.orders` table is packaged as the "Order Facts" Data Product
- BI teams subscribe to Data Products instead of raw tables

## Related Concepts

- **Data Contract**: The formal agreement between producer and consumer
- **Data Asset**: Any individual object (table, view, procedure) within a product
- **Data Marketplace**: The catalog where Data Products are published and discovered
