---
term: Data Lineage
domain: Data Governance
status: approved
owner: data-governance-team
steward: data.architect@company.com
abbreviation: ''
related_terms: [Data Product, Dependency, Impact Analysis, Data Catalog]
tags: [core, governance, lineage, traceability]
created_at: 2026-01-01
last_reviewed: 2026-06-01
---

# Data Lineage

## Definition

**Data Lineage** is the documentation of data's lifecycle — tracking the origin, movement,
transformation, and consumption of data assets from source to consumer.

## Why It Matters

- **Impact Analysis**: Understand what breaks when a source changes
- **Audit & Compliance**: Prove where regulated data came from
- **Quality Root-Cause**: Trace quality issues back to their origin
- **Trust**: Consumers trust data more when they can see its journey

## Lineage Types

| Type          | Description                               |
| ------------- | ----------------------------------------- |
| Column-level  | Tracks individual field transformations   |
| Table-level   | Tracks table-to-table dependencies        |
| Process-level | Tracks ETL/pipeline dependencies          |
| Cross-system  | Tracks lineage across databases and tools |

## In This Platform

Data lineage is captured in the `depends_on` field of each asset's markdown frontmatter.
The lineage graph is rendered as an interactive network diagram in the Lineage Explorer view.
