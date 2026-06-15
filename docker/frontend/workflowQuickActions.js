/* eslint-env browser */

export const workflowQuickActions = {
  overview: [
    { label: 'Search Catalog', icon: 'mdi-magnify', view: 'browse' },
    { label: 'Explore Lineage', icon: 'mdi-graphql', view: 'discovery' },
    { label: 'Review Work', icon: 'mdi-clipboard-check', view: 'governanceOps' },
  ],
  browse: [
    { label: 'Explore Lineage', icon: 'mdi-graphql', view: 'discovery' },
    { label: 'Governance Ops', icon: 'mdi-clipboard-check', view: 'governanceOps' },
  ],
  integrations: [
    { label: 'Lineage Acquisition', icon: 'mdi-database-import', view: 'import' },
    { label: 'Profiling', icon: 'mdi-calendar-clock', view: 'scheduler' },
  ],
  scheduler: [
    { label: 'Connections', icon: 'mdi-connection', view: 'integrations' },
    { label: 'Governance Ops', icon: 'mdi-clipboard-check', view: 'governanceOps' },
  ],
  governanceOps: [{ label: 'Search Catalog', icon: 'mdi-magnify', view: 'browse' }],
  import: [
    { label: 'Connections', icon: 'mdi-connection', view: 'integrations' },
    { label: 'Search Assets', icon: 'mdi-magnify', view: 'browse' },
  ],
  products: [
    { label: 'Search Reports', icon: 'mdi-magnify', view: 'browse' },
    { label: 'Explore Asset Lineage', icon: 'mdi-graphql', view: 'browse' },
    { label: 'Review Metrics', icon: 'mdi-function-variant', view: 'metrics' },
  ],
};
