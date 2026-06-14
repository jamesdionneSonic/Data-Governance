/* eslint-env browser */

export const connectAndOperateSection = {
  key: 'operate',
  label: 'Connect & Operate',
  items: [
    { key: 'integrations', label: 'Connections', icon: 'mdi-connection', audience: ['admin'] },
    { key: 'import', label: 'Lineage Acquisition', icon: 'mdi-database-import', audience: ['admin'] },
    { key: 'scheduler', label: 'Profiling', icon: 'mdi-calendar-clock', audience: ['analyst', 'admin'] },
    { key: 'admin', label: 'Platform Admin', icon: 'mdi-cog', audience: ['admin'] },
  ],
};

export const connectAndOperateMeta = {
  integrations: {
    title: 'Connections',
    subtitle: 'Manage reusable source access, verify login and discovery health, and keep source credentials out of user workflows.',
    workflow: 'Connect',
    primaryAction: 'New connection',
  },
  import: {
    title: 'Lineage Acquisition',
    subtitle: 'Refresh lineage evidence for configured investigation domains and keep raw extraction details in troubleshooting.',
    workflow: 'Acquire',
    primaryAction: 'Refresh domain',
  },
  scheduler: {
    title: 'Profiling',
    subtitle: 'Create, run, and monitor profile schedules and queues with blocker-first status.',
    workflow: 'Operate',
    primaryAction: 'New schedule',
  },
  admin: {
    title: 'Platform Admin',
    subtitle: 'Manage users, audit trail, platform health, settings, and API diagnostics.',
    workflow: 'Administer',
    primaryAction: 'Review health',
  },
};
