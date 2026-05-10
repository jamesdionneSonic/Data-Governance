---
name: customers
database: production_hr
type: table
owner: data-team@company.com
sensitivity: confidential
tags: [core, pii, audit]
depends_on: []
description: "Master customer table containing all customer records"
last_updated: 2026-05-08
---

# Customers Table

## Overview

The `customers` table is the master customer directory for the entire organization. It contains all customer demographic and account information used across all downstream systems.

## Schema

| Column | Type | Nullable | Description |
|--------|------|----------|-------------|
| customer_id | INT | NO | Primary key, unique customer identifier |
| first_name | VARCHAR(100) | NO | Customer first name |
| last_name | VARCHAR(100) | NO | Customer last name |
| email | VARCHAR(255) | NO | Customer email address |
| phone | VARCHAR(20) | YES | Customer phone number |
| created_at | DATETIME | NO | Record creation timestamp |
| updated_at | DATETIME | NO | Last record update timestamp |

## Dependencies

### Depends On
- `[external]` CRM system (daily sync)

### Depended On By
- `production_hr.user_accounts` - FK relationship
- `analytics.vw_customer_summary` - materialized view
- `reports.sp_generate_customer_report` - stored procedure
- `dashboards.customer_metrics` - BI dashboard

## Data Quality

- **Uniqueness**: Email must be unique
- **Completeness**: All fields required except phone
- **Validity**: Email format validated on insert
- **Currency**: Daily refreshed from CRM

## Access Control

- **Owner**: Data Team
- **Sensitivity**: Confidential (PII)
- **Read Access**: Analysts, Administrators
- **Write Access**: Data Team only

## Maintenance

- **Backup Frequency**: Daily at 2 AM UTC
- **Retention Period**: 7 years
- **Last Review**: May 8, 2026
