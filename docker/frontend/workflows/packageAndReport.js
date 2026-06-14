/* eslint-env browser */

export const packageAndReportSection = {
  key: 'deliver',
  label: 'Package & Report',
  items: [
    { key: 'products', label: 'Data Products', icon: 'mdi-package-variant-closed', audience: ['admin'] },
    { key: 'reports', label: 'Governance Insights', icon: 'mdi-chart-box', audience: ['analyst', 'steward', 'admin'] },
  ],
};

export const packageAndReportMeta = {
  products: {
    title: 'Data Products',
    subtitle: 'Future-state workspace parked until the product definition is explicit; use Search and Metrics for report metadata today.',
    workflow: 'Future',
    primaryAction: 'Open Search',
  },
  reports: {
    title: 'Governance Insights',
    subtitle: 'Review impact analysis, generated reports, leaderboards, and executive evidence.',
    workflow: 'Report',
    primaryAction: 'Refresh reports',
  },
};
