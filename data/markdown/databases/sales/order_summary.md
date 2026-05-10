---
name: order_summary
database: sales
type: view
owner: sales-analytics
sensitivity: internal
tags: [sales, reporting, aggregates]
depends_on: [orders, customers]
description: Aggregated order summary by customer and date
---

# Order Summary View

## Purpose

Provides pre-aggregated order data for fast reporting and dashboard queries.

## Source Tables

- **orders**: Individual order transactions
- **customers**: Customer information and segments

## Aggregations

- Total orders per customer per month
- Total revenue per customer per month
- Average order value
- Order count by status

## Performance

- Materialized view
- Refreshed hourly
- Average query time: <100ms

## Usage

Used by:
- Executive Dashboard
- Sales Performance Reports
- Customer Analytics Pipeline
