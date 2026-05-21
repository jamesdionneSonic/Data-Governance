# User Guide

## Overview

This guide covers daily use of the Data Governance platform for analysts, data stewards, and read-only users.

You can open this guide inside the application from **Help Center** in the left navigation.

## Start Here

If you only do three things, do these:

1. Search for a data object.
2. Open the object and review its metadata.
3. Check lineage before you reuse or change anything.

## Navigation Model

The sidebar is organized into governance workflow domains:

- **Workspace**: `Command Center`, `Catalog Search`, `Lineage Explorer`
- **Govern**: `Business Glossary`, `Trust & Compliance`
- **Deliver**: `Data Products`, `Governance Insights`
- **Operate**: `Connections`, `Metadata Ingestion`, `Administration`
- **Support**: `Help Center`

## Sign In

1. Open the application URL provided by your admin.
2. Use Entra ID sign-in or the local development login flow.
3. After login, your access is restricted to assigned databases.

## Core Workflows

### 1) Discover Trusted Data (Workspace)

- Use the search bar to find an object by name, database, owner, or tag.
- Narrow results with filters: database, type, owner, sensitivity, and tags.
- Open an object to inspect metadata, trust signals, and lineage context.
- If the result set is too broad, remove one filter at a time.

### 2) Apply Governance Context (Govern)

- Use **Business Glossary** to confirm shared business definitions.
- Use **Trust & Compliance** to review ownership, sensitivity, and policy posture.
- Validate governance state before downstream usage or sharing.

### 3) Explore Lineage Impact (Workspace)

- Use **Lineage Explorer** to view high-level landscape metrics.
- Open object graph views (`cytoscape`, `d3`, or `mermaid`) to inspect dependencies.
- Use impact and matrix views to understand downstream risk.

### 4) Deliver and Share (Deliver)

- Use **Data Products** to review curated, reusable datasets.
- Use **Governance Insights** for executive reporting and share workflows.
- Export catalog data in CSV or Excel-compatible format.
- Export dependency reports as PDF.
- Export graph visualizations as SVG or PNG.
- Create expiring read-only share links for visualizations.

### 5) Know What You Can Do

If a button or action is disabled, it usually means your role does not allow it.

- `Viewer`: can search and read.
- `Analyst`: can search, read, and create reports.
- `PowerUser`: can manage metadata and operational tasks.
- `Admin`: can manage users, permissions, and schedules.

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
