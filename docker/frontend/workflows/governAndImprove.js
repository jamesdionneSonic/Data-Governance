/* eslint-env browser */

export const governAndImproveSection = {
  key: 'govern',
  label: 'Govern & Improve',
  items: [
    { key: 'glossary', label: 'Business Glossary', icon: 'mdi-book-open-variant', audience: ['user', 'analyst', 'steward', 'admin'] },
    { key: 'governanceOps', label: 'Governance Ops', icon: 'mdi-clipboard-check', audience: ['steward', 'admin'] },
    { key: 'metrics', label: 'Metric Intelligence', icon: 'mdi-function-variant', audience: ['user', 'analyst', 'steward', 'admin'] },
  ],
};

export const governAndImproveMeta = {
  glossary: {
    title: 'Business Glossary',
    subtitle: 'Maintain business-defined terms first, then connect them to technical assets and metric context.',
    workflow: 'Define',
    primaryAction: 'Search terms',
  },
  governance: {
    title: 'Advanced Trust Controls',
    subtitle: 'Advanced policy, quality, and classification controls kept behind Review Work so Trust & Compliance is no longer a primary workflow.',
    workflow: 'Advanced',
    primaryAction: 'Review work',
  },
  governanceOps: {
    title: 'Governance Ops',
    subtitle: 'Review confidence warnings, stewardship tasks, trust actions, exceptions, and publication readiness.',
    workflow: 'Operate',
    primaryAction: 'Refresh ops',
  },
  metrics: {
    title: 'Metric Intelligence',
    subtitle: 'Review metric concepts, department/report variants, in-review suggestions, and impact links.',
    workflow: 'Measure',
    primaryAction: 'Search metrics',
  },
};
