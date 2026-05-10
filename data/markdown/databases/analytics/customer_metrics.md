---
name: customer_metrics
database: analytics
type: procedure
owner: analytics-team
sensitivity: internal
tags: [customers, metrics, analytics]
depends_on: [order_summary]
description: Stored procedure that computes customer lifetime value and segmentation
---

# Customer Metrics Computation

## Overview

PL/SQL procedure that calculates advanced customer metrics including:
- Customer Lifetime Value (CLV)
- Recency, Frequency, Monetary (RFM) scoring
- Customer segment classification
- Churn propensity

## Source

Depends on the `order_summary` view for aggregated transaction data.

## Output

Populates `customer_metrics_table` with updated metrics.

## Schedule

Runs daily at 3 AM UTC.

## Owner

Analytics Team
- Primary: analytics-lead@company.com
- Secondary: analytics-team@company.com

## SLA

- Max execution time: 1 hour
- Max acceptable data lag: 24 hours
