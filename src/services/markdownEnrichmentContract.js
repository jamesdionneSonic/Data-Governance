const EMPTY_OBJECT_FIELDS = {
  business_justification: '',
  business_processes: [],
  use_cases: [],
  documentation_links: [],
  related_dashboards: [],
  steward: '',
  domain_manager: '',
  custodian: '',
};

const DOMAIN_PATTERNS = [
  [/claims|jma/i, 'Claims'],
  [/vehicle|vin|make|model|trim/i, 'Vehicle'],
  [/sales|deal|lead|prospect|customer/i, 'Sales'],
  [/service|repair|ro|appointment/i, 'Service'],
  [/finance|accounting|gl|payroll|salary|revenue|payment/i, 'Finance'],
  [/hr|employee|associate|worker/i, 'Human Resources'],
  [/vendor|supplier/i, 'Vendor Management'],
  [/web|digital|ecomm/i, 'Digital'],
  [/dms|dealer/i, 'Dealer Management'],
  [/staging|etl|ssis|load/i, 'Data Integration'],
  [/dw|warehouse|mart|fact|dim/i, 'Enterprise Data Warehouse'],
];

const NUMERIC_TYPES = /\b(bigint|int|smallint|tinyint|decimal|numeric|money|float|real|double)\b/i;
const DATE_TYPES = /\b(date|datetime|datetime2|smalldatetime|time|timestamp)\b/i;
const BOOLEAN_TYPES = /\b(bit|boolean|bool)\b/i;

const METRIC_TERMS = [
  'amount',
  'amt',
  'balance',
  'cost',
  'count',
  'cnt',
  'duration',
  'fee',
  'gross',
  'hours',
  'margin',
  'miles',
  'net',
  'odometer',
  'percent',
  'percentage',
  'price',
  'qty',
  'quantity',
  'rate',
  'revenue',
  'score',
  'total',
  'value',
];

const IDENTIFIER_TERMS = ['id', 'key', 'code', 'guid', 'hash', 'vin', 'uuid', 'number', 'num'];

const DIMENSION_TERMS = [
  'category',
  'class',
  'description',
  'desc',
  'group',
  'name',
  'status',
  'type',
];

const PII_PATTERNS = [
  [/ssn|social_security/i, 'PII'],
  [/email|e_mail/i, 'PII'],
  [/phone|mobile|cell/i, 'PII'],
  [/address|addr|street|zip|postal/i, 'PII'],
  [/birth|dob|date_of_birth/i, 'PII'],
  [/driver.?license|license_no/i, 'PII'],
  [/\bvin\b|vehicle_identification/i, 'PII'],
  [/(first|last|middle|full|customer|employee|person|contact)_?name/i, 'PII'],
];

const PHI_PATTERNS = [[/patient|diagnosis|medical|clinic|provider|claim_diagnosis/i, 'PHI']];

const FINANCIAL_PATTERNS = [
  [/salary|wage|compensation|commission/i, 'Financial'],
  [/amount|amt|balance|cost|fee|gross|net|payment|price|revenue|tax|total/i, 'Financial'],
  [/account_?number|routing|credit|debit/i, 'Financial'],
];

function text(value) {
  return String(value ?? '').trim();
}

function ensureArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === '') return [];
  return [value];
}

function hasMeaningfulValue(value) {
  if (Array.isArray(value)) return value.length > 0;
  if (value && typeof value === 'object') return Object.keys(value).length > 0;
  return text(value) !== '';
}

function unique(values) {
  return Array.from(new Set(ensureArray(values).map(text).filter(Boolean)));
}

function nameTokens(value) {
  return text(value)
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[^A-Za-z0-9]+/g, ' ')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}

function humanizeName(value) {
  const tokens = nameTokens(value);
  if (tokens.length === 0) return '';
  return tokens
    .map((token) => token.charAt(0).toUpperCase() + token.slice(1).toLowerCase())
    .join(' ');
}

function nameHaystack(object = {}) {
  return [
    object.id,
    object.name,
    object.database,
    object.schema,
    object.type,
    object.package_name,
    object.project_name,
    object.folder_name,
    ...ensureArray(object.tags),
  ]
    .map(text)
    .join(' ');
}

export function inferBusinessDomain(object = {}) {
  const existing = text(object.business_domain || object.domain);
  if (existing) return existing;

  const haystack = nameHaystack(object);
  for (const [pattern, domain] of DOMAIN_PATTERNS) {
    if (pattern.test(haystack)) return domain;
  }
  return '';
}

export function inferBusinessProcesses(object = {}) {
  const existing = unique(object.business_processes || object.business_process);
  if (existing.length > 0) return existing;

  const haystack = nameHaystack(object).toLowerCase();
  const processes = [];
  if (/stg|stage|staging|etl|ssis|load|extract/.test(haystack))
    processes.push('Metadata ingestion and data load');
  if (/fact|report|view|mart|dashboard/.test(haystack)) processes.push('Reporting and analytics');
  if (/dim|xref|lookup|master/.test(haystack))
    processes.push('Reference and master data management');
  if (/claim|jma/.test(haystack)) processes.push('Claims processing');
  if (/vehicle|vin/.test(haystack)) processes.push('Vehicle data management');
  if (/sales|lead|customer/.test(haystack)) processes.push('Sales operations');
  if (/service|repair/.test(haystack)) processes.push('Service operations');
  return unique(processes);
}

export function inferUseCases(object = {}) {
  const existing = unique(object.use_cases);
  if (existing.length > 0) return existing;

  const useCases = [];
  const type = text(object.type).toLowerCase();
  const haystack = nameHaystack(object).toLowerCase();
  if (['table', 'view', 'dataset'].includes(type)) useCases.push('Data dictionary lookup');
  if (/fact|metric|amount|report|view|mart/.test(haystack))
    useCases.push('Analytics and reporting');
  if (/dim|xref|lookup/.test(haystack)) useCases.push('Business attribute lookup');
  if (/ssis|package|etl|load|staging/.test(haystack))
    useCases.push('Lineage and load path analysis');
  return unique(useCases);
}

function classificationFromName(name) {
  const labels = [];
  for (const [pattern, label] of [...PII_PATTERNS, ...PHI_PATTERNS, ...FINANCIAL_PATTERNS]) {
    if (pattern.test(name)) labels.push(label);
  }
  return unique(labels);
}

function strongerSensitivity(existing, classifications) {
  const current = text(existing).toLowerCase();
  if (current && !['internal', 'unknown', 'none'].includes(current)) return existing;
  if (classifications.includes('PHI') || classifications.includes('PII')) return 'restricted';
  if (classifications.includes('Financial')) return 'confidential';
  return existing || 'internal';
}

function includesAny(tokens, terms) {
  const lowerTokens = tokens.map((token) => token.toLowerCase());
  return terms.some((term) => lowerTokens.includes(term));
}

function inferSemanticType(column = {}) {
  const existing = text(column.semantic_type || column.semanticType);
  if (existing) return existing;

  const name = text(column.name || column.column_name || column.columnName);
  const tokens = nameTokens(name);
  const lowerName = name.toLowerCase();
  const dataType = text(column.data_type || column.dataType || column.type || column.system_type);
  const numeric = NUMERIC_TYPES.test(dataType);
  const dateLike = DATE_TYPES.test(dataType);
  const booleanLike = BOOLEAN_TYPES.test(dataType);

  if (dateLike || includesAny(tokens, ['date', 'time', 'timestamp'])) return 'date';
  if (booleanLike || /^(is|has|can|should)[A-Z_]/.test(name) || /^is_|^has_|^can_/.test(lowerName))
    return 'flag';
  if (includesAny(tokens, IDENTIFIER_TERMS) || /(^|_)id$|(^|_)key$|(^|_)code$/.test(lowerName))
    return 'identifier';
  if (numeric && includesAny(tokens, METRIC_TERMS)) return 'metric';
  if (includesAny(tokens, DIMENSION_TERMS)) return 'dimension';
  if (numeric) return 'measure_candidate';
  return 'attribute';
}

function inferredDescription(column = {}, semanticType = '') {
  const existing = text(column.description || column.business_definition);
  if (existing) return existing;
  const name = text(column.name || column.column_name || column.columnName || 'column');
  const businessName = humanizeName(name) || name;

  const descriptions = {
    metric: `${businessName} metric inferred from column name and data type.`,
    measure_candidate: `${businessName} numeric column; review whether it is a metric or attribute.`,
    identifier: `${businessName} identifier inferred from column naming.`,
    date: `${businessName} date/time column inferred from column name or data type.`,
    flag: `${businessName} boolean flag inferred from column name or data type.`,
    dimension: `${businessName} descriptive attribute inferred from column name.`,
    attribute: `${businessName} attribute inferred from technical metadata.`,
  };
  return descriptions[semanticType] || `${businessName} column inferred from technical metadata.`;
}

export function enrichColumnMetadata(column = {}, parent = {}) {
  const name = text(column.name || column.column_name || column.columnName || column.id);
  const semanticType = inferSemanticType(column);
  const inferredClassifications = classificationFromName(name);
  const existingClassifications = unique([
    ...ensureArray(column.classifications),
    ...ensureArray(column.classification),
    ...ensureArray(column.classification_tags),
    ...ensureArray(column.tags),
  ]);
  const classifications = unique([...existingClassifications, ...inferredClassifications]);
  const sensitivity = strongerSensitivity(
    column.sensitivity || parent.sensitivity,
    classifications
  );
  const businessName = text(column.business_name || column.businessName) || humanizeName(name);

  return {
    ...column,
    description: inferredDescription(column, semanticType),
    business_name: businessName,
    semantic_type: semanticType,
    is_metric: Boolean(column.is_metric || semanticType === 'metric'),
    is_identifier: Boolean(column.is_identifier || semanticType === 'identifier'),
    is_dimension: Boolean(column.is_dimension || semanticType === 'dimension'),
    sensitivity,
    classifications,
    classification_tags: unique([...ensureArray(column.classification_tags), ...classifications]),
    dictionary_confidence: text(column.dictionary_confidence) || 'inferred_from_metadata',
  };
}

export function applyDictionaryEnrichmentContract(metadata = {}, options = {}) {
  const enrichedAt =
    options.enrichedAt || options.extractedAt || metadata.extracted_at || new Date().toISOString();
  const enriched = { ...metadata };
  const businessDomain = inferBusinessDomain(enriched);

  if (!hasMeaningfulValue(enriched.business_domain)) enriched.business_domain = businessDomain;
  for (const [field, fallback] of Object.entries(EMPTY_OBJECT_FIELDS)) {
    if (!Object.hasOwn(enriched, field))
      enriched[field] = Array.isArray(fallback) ? [...fallback] : fallback;
  }

  if (!hasMeaningfulValue(enriched.business_processes))
    enriched.business_processes = inferBusinessProcesses(enriched);
  if (!hasMeaningfulValue(enriched.use_cases)) enriched.use_cases = inferUseCases(enriched);

  if (Array.isArray(enriched.columns)) {
    enriched.columns = enriched.columns.map((column) => enrichColumnMetadata(column, enriched));
    enriched.column_count = Number(enriched.column_count || enriched.columns.length || 0);
  }

  enriched.data_dictionary = {
    status: 'generated',
    source: 'raw_metadata',
    enrichment_version: 1,
    enriched_at: enrichedAt,
    ...(enriched.data_dictionary && typeof enriched.data_dictionary === 'object'
      ? enriched.data_dictionary
      : {}),
  };

  return enriched;
}

export default {
  applyDictionaryEnrichmentContract,
  enrichColumnMetadata,
  inferBusinessDomain,
  inferBusinessProcesses,
  inferUseCases,
};
