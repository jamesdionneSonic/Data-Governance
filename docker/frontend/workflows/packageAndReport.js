/* eslint-env browser */

export const packageAndReportSection = {
  key: 'deliver',
  label: 'Package & Report',
  items: [
    {
      key: 'products',
      label: 'Data Products',
      icon: 'mdi-package-variant-closed',
      audience: ['admin'],
      hidden: true,
    },
    {
      key: 'reports',
      label: 'Governance Insights',
      icon: 'mdi-chart-box',
      audience: ['analyst', 'steward', 'admin'],
      hidden: true,
    },
  ],
};

export const packageAndReportMeta = {
  products: {
    title: 'Data Products',
    subtitle:
      'Future-state workspace parked until the product definition is explicit; use Search and Metrics for report metadata today.',
    workflow: 'Future',
    primaryAction: 'Open Search',
  },
  reports: {
    title: 'Governance Insights',
    subtitle:
      'Internal reporting workbench retained until its access, impact, export, and KPI functions move to owning workflows.',
    workflow: 'Internal',
    primaryAction: 'Refresh reports',
  },
};
