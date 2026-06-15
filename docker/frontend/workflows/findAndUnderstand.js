/* eslint-env browser */

export const findAndUnderstandSection = {
  key: 'workspace',
  label: 'Find & Understand',
  items: [
    {
      key: 'overview',
      label: 'Home / Find Data',
      icon: 'mdi-home-search-outline',
      audience: ['user', 'analyst', 'steward', 'admin'],
    },
    {
      key: 'assetDetail',
      label: 'Asset Detail',
      icon: 'mdi-file-search-outline',
      audience: ['user', 'analyst', 'steward', 'admin'],
      hidden: true,
    },
    {
      key: 'browse',
      label: 'Search',
      icon: 'mdi-magnify',
      audience: ['user', 'analyst', 'steward', 'admin'],
      hidden: true,
    },
    {
      key: 'discovery',
      label: 'Lineage Explorer',
      icon: 'mdi-graphql',
      audience: ['user', 'analyst', 'steward', 'admin'],
      hidden: true,
    },
  ],
};

export const findAndUnderstandMeta = {
  overview: {
    title: 'Home / Find Data',
    subtitle: 'Search or ask about data.',
    workflow: 'Find',
    primaryAction: 'Search catalog',
  },
  browse: {
    title: 'Search',
    subtitle: 'Find governed assets, inspect metadata, and jump into lineage or stewardship work.',
    workflow: 'Find',
    primaryAction: 'Search catalog',
  },
  assetDetail: {
    title: 'Asset Detail',
    subtitle:
      'Review the selected asset before opening lineage, stewardship, or technical evidence.',
    workflow: 'Find',
    primaryAction: 'Explore lineage',
  },
  discovery: {
    title: 'Lineage Explorer',
    subtitle:
      'Answer table, column, report, and metric impact questions in plain English before graph and evidence drilldowns.',
    workflow: 'Trace',
    primaryAction: 'Get answer',
  },
};
