---
name: Order Facts
product_id: prod-order-facts
version: '2.1.0'
status: published
domain: Sales
owner: sales-data-team
steward: sales.data.steward@company.com
assets: [sales.orders, sales.order_items]
sla:
  freshness_hours: 24
  availability_pct: 99.5
tags: [core, sales, transactional]
certified: true
certified_by: chief.data.officer@company.com
certification_date: 2026-05-01
trust_level: gold
consumers: [Finance BI, Marketing Analytics, Executive Dashboards]
output_port:
  type: table
  location: sales.orders
  format: SQL
  documentation_url: /catalog/sales.orders
created_at: 2025-10-01
last_updated: 2026-06-01
---

# Order Facts Data Product

## Overview

The **Order Facts** Data Product provides a complete, trusted view of all customer orders
across the organization. It is the authoritative source for revenue reporting, fulfillment
analysis, and customer behavior insights.

## What's Included

| Asset               | Type  | Description                                  |
| ------------------- | ----- | -------------------------------------------- |
| `sales.orders`      | Table | Order header — customer, date, total, status |
| `sales.order_items` | Table | Line items — SKU, quantity, unit price       |

## SLA

- **Freshness**: Updated within 24 hours of source system
- **Availability**: 99.5% uptime guarantee
- **Quality**: ≥ 95% completeness on all critical fields

## How to Subscribe

1. Navigate to the Data Marketplace in the platform
2. Search for "Order Facts"
3. Submit an access request with your use case and approver
4. Access is granted within 1 business day for standard roles

## Data Contract

This product follows the organizational Data Contract schema v1.0.
Breaking changes require a 30-day deprecation notice.
