export const SSIS_CURATED_ROOT = 'data/markdown';
export const SSIS_RAW_XML_ROOT = `${SSIS_CURATED_ROOT}/ssis_raw_xml`;
export const TABLE_CURATED_ROOT = 'data/markdown/databases';
export const TABLE_RAW_SQL_ROOT = 'data/analysis/raw/sqlserver/databases';

export const DEFAULT_EDGE_OVERPOPULATED_THRESHOLD = 10;
export const DEFAULT_EDGE_HARD_THRESHOLD = 25;
export const DEFAULT_SNIPPET_LIMIT = 1600;

export const SSIS_HIGH_FANOUT_ALLOWLIST = [
  'reference',
  'lookup',
  'mapping',
  'bridge',
  'staging',
  'source',
  'xref',
  'crossref',
  'dim',
  'fact',
];

export const TABLE_HIGH_FANOUT_ALLOWLIST = [
  'reference',
  'lookup',
  'mapping',
  'bridge',
  'xref',
  'crossref',
  'staging',
  'audit',
  'history',
  'log',
  'queue',
];
