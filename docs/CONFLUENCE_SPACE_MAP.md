# Confluence Space Map

This page documents the Data Engineering Confluence layout after the 2026-06-17 landing-zone cleanup.

## Space

| Name           | Value                                        |
| -------------- | -------------------------------------------- |
| Base URL       | `https://sonicautomotive.atlassian.net/wiki` |
| Space key      | `TDE`                                        |
| Space homepage | `736100596`                                  |

## Human-Facing Hubs

These pages are curated navigation hubs for team members. Publishers should not use these as their write targets.

| Hub                           | Page ID      | Purpose                                      |
| ----------------------------- | ------------ | -------------------------------------------- |
| Operate & Support             | `2279538852` | SSIS, SSRS, QA, validation, runbooks         |
| Understand the Data           | `2278228136` | Lineage, source systems, functional flows    |
| Govern & Measure              | `2279211164` | KPIs, audit, governance, quality             |
| Change & Release              | `2278129886` | Releases, deployments, cutovers, upgrades    |
| Products & Domains            | `2278293724` | Turbo, MDP, Supermetrics, source/domain docs |
| Architecture & Team Standards | `2278064272` | ADRs, templates, working agreement, retros   |

## Publishing Roots

Keep these IDs stable unless the publisher configuration is intentionally changed and validated.

| Publisher                      | Environment variable              | Default page ID | Notes                                                       |
| ------------------------------ | --------------------------------- | --------------- | ----------------------------------------------------------- |
| Lineage Confluence export/sync | `CONFLUENCE_PARENT_PAGE_ID`       | `2221670415`    | Publishes under `Sonic Data Lineage`.                       |
| SSIS package docs              | `SSIS_CONFLUENCE_CATALOG_PAGE_ID` | `2269610019`    | Publishes package/folder pages under `SSIS Folder Catalog`. |
| SSRS support docs              | `SSRS_CONFLUENCE_PARENT_PAGE_ID`  | `2267643963`    | Publishes report docs under `SSRS Report Documentation`.    |

## Implementation Contract

- The code-level source of truth is `src/config/confluencePageMap.js`.
- Hub pages are for navigation and should link to publishing roots.
- Publishers should target publishing roots, not the top-level landing hubs.
- Moving a publishing root in Confluence may preserve page IDs, but Confluence can reject moves with very large child trees. Validate with a dry run before any live publish.
