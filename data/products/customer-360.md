---
name: Customer 360
product_id: prod-customer-360
version: '1.4.0'
status: published
domain: CRM
owner: crm-data-team
steward: crm.steward@company.com
assets: [production_hr.customers, analytics.vw_customer_summary]
sla:
  freshness_hours: 48
  availability_pct: 99.0
tags: [core, crm, pii, customer]
certified: true
certified_by: chief.data.officer@company.com
certification_date: 2026-04-15
trust_level: gold
consumers: [Sales Team, Customer Success, Marketing]
output_port:
  type: table
  location: production_hr.customers
  format: SQL
  documentation_url: /catalog/production_hr.customers
created_at: 2025-11-01
last_updated: 2026-06-01
---

# Customer 360 Data Product

## Overview

The **Customer 360** Data Product provides a unified, golden-record view of every customer.
It consolidates data from CRM, billing, and support systems into a single trusted entity.

## What's Included

| Asset                           | Type  | Description                   |
| ------------------------------- | ----- | ----------------------------- |
| `production_hr.customers`       | Table | Master customer attributes    |
| `analytics.vw_customer_summary` | View  | Aggregated behavioral metrics |

## Privacy & Compliance

- Contains **PII** — access is restricted to approved roles
- All access is logged and auditable
- GDPR deletion requests are processed within 30 days

## SLA

- **Freshness**: Updated within 48 hours
- **Availability**: 99.0%
- **Quality**: ≥ 98% uniqueness on email field

## Consumers

This product powers:

- Sales opportunity scoring
- Customer health dashboards
- Marketing segmentation campaigns
