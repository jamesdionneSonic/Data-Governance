---
name: customers
database: sales
type: table
owner: sales-analytics
sensitivity: confidential
tags: [customers, pii, crm]
depends_on: []
description: Customer master data with contact and demographic information
---

# Sales Customers

Master customer dimension table.

## Sensitive Fields

This table contains personally identifiable information (PII):
- Name
- Email
- Phone
- Address
- Date of birth

## Access Control

- Sales Team: Full access
- Analytics Team: Subset of fields only
- Public APIs: ID and name only

## Data Quality

- Last validated: 2026-05-08
- Completeness: 99.7%
- Freshness: Daily
