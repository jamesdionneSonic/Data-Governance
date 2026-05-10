---
name: orders
database: sales
type: table
owner: sales-analytics
sensitivity: internal
tags: [sales, orders, critical]
depends_on: []
description: Core orders table containing all customer purchase transactions
---

# Sales Orders Table

This is the main orders fact table for the sales data warehouse.

## Schema

- order_id: Unique order identifier
- customer_id: Reference to customer
- order_date: When the order was placed
- total_amount: Total order value
- status: Order status (pending, confirmed, shipped, delivered, cancelled)

## Updates

Updated daily at 2 AM UTC from the operational system.

## Access

- Sales Analytics Team: Full access
- Finance Team: Read-only access
- Public Dashboard: Aggregated views only
