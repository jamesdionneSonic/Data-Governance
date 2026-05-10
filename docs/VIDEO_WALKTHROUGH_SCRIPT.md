# Video Walkthrough Script (5 Minutes)

## Goal

Show an end-to-end MVP flow: authentication, discovery, lineage, reporting export, and admin/performance visibility.

## 0:00 - 0:30 Intro

- Introduce the platform and problem solved.
- Explain markdown-driven governance and dependency visibility.

## 0:30 - 1:20 Sign-In and API Health

- Show login flow.
- Show `/health` and `/api/v1` endpoint overview.

## 1:20 - 2:20 Discovery and Lineage

- Demonstrate search query and facets.
- Open discovery dashboard.
- Show object graph endpoint in one format (cytoscape or d3).

## 2:20 - 3:30 Reporting and Exports

- Export catalog as CSV.
- Export dependency report PDF for an object.
- Export visualization (SVG/PNG).
- Generate and open a shared read-only visualization link.

## 3:30 - 4:20 Scheduling and Admin Ops

- Create schedule endpoint call.
- List schedules and run one manually.

## 4:20 - 5:00 Performance and Close

- Show `/health/performance` p95 summary.
- Run `npm run perf:load` and discuss target thresholds.
- Close with deployment + docs links.

## Demo Checklist

- Local stack running
- Sample markdown objects loaded
- Test admin user ready
- Browser tabs prepared for API and exported artifacts