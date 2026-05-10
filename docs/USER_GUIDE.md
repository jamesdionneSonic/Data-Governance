# User Guide

## Overview

This guide covers daily use of the Data Governance platform for analysts, data stewards, and read-only users.

You can open this guide inside the application from **Help & Docs** in the left navigation.

## Sign In

1. Open the application URL provided by your admin.
2. Use Entra ID sign-in or the local development login flow.
3. After login, your access is restricted to assigned databases.

## Core Workflows

### 1) Search for Data Objects

- Use `GET /api/v1/search?q=<term>` through the UI search bar.
- Narrow results with filters: database, type, owner, sensitivity, and tags.
- Open an object to inspect metadata and lineage context.

### 2) Explore Lineage and Discovery

- Use the Discovery dashboard to view high-level landscape metrics.
- Open object graph views (`cytoscape`, `d3`, or `mermaid`) to inspect dependencies.
- Use impact and matrix views to understand downstream risk.

### 3) Export and Share Reports

- Export catalog data in CSV or Excel-compatible format.
- Export dependency reports as PDF.
- Export graph visualizations as SVG or PNG.
- Create expiring read-only share links for visualizations.

## Roles and Access

- `Viewer`: read-only discovery and object access.
- `Analyst`: discovery and reporting usage.
- `PowerUser`: metadata and advanced operational actions.
- `Admin`: user, permission, and scheduling control.

## Best Practices

- Keep object metadata complete (`owner`, `description`, `tags`, `sensitivity`).
- Review dependency impact before changing upstream objects.
- Use scheduled reports for recurring governance reviews.

## Common Issues

- `401 Unauthorized`: re-authenticate and verify token validity.
- `403 Forbidden`: your role does not include this action.
- `503 Data not yet loaded`: trigger ingestion before discovery/reporting workflows.

See [Troubleshooting FAQ](TROUBLESHOOTING_FAQ.md) for full troubleshooting.

## More Help

- Start at [Help Center](HELP_CENTER.md) for user-focused guidance.
- For platform administration tasks, go to [Admin Guide](ADMIN_GUIDE.md).