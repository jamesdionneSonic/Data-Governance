/**
 * PII Policy Service
 * Detects sensitive columns from metadata and returns masking/semantic guidance.
 * This service never stores raw data values; sample value handling returns masked output only.
 */

const PII_COLUMN_RULES = [
  {
    id: 'email',
    label: 'Email address',
    classification: 'PII',
    pattern: '(^|_|\\b)(e_?mail|email_?address)(_|\\b|$)',
    mask_strategy: 'email',
    confidence: 0.97,
  },
  {
    id: 'ssn',
    label: 'Social Security number',
    classification: 'PII',
    pattern: '(^|_|\\b)(ssn|social_?security)(_|\\b|$)',
    mask_strategy: 'last4',
    confidence: 0.99,
  },
  {
    id: 'phone',
    label: 'Phone number',
    classification: 'PII',
    pattern: '(^|_|\\b)(phone|mobile|cell|fax)_?(number)?(_|\\b|$)',
    mask_strategy: 'phone',
    confidence: 0.93,
  },
  {
    id: 'name',
    label: 'Person name',
    classification: 'PII',
    pattern: '(^|_|\\b)(first|last|full|middle)_?name(_|\\b|$)|(^|_|\\b)name(_|\\b|$)',
    mask_strategy: 'redact',
    confidence: 0.82,
  },
  {
    id: 'address',
    label: 'Physical address',
    classification: 'PII',
    pattern: '(^|_|\\b)(address|street|city|state|zip|postal)_?(code)?(_|\\b|$)',
    mask_strategy: 'redact',
    confidence: 0.86,
  },
  {
    id: 'dob',
    label: 'Date of birth',
    classification: 'PII',
    pattern: '(^|_|\\b)(date_?of_?birth|dob|birth_?date)(_|\\b|$)',
    mask_strategy: 'date_year',
    confidence: 0.96,
  },
  {
    id: 'driver-license',
    label: 'Driver license',
    classification: 'PII',
    pattern: '(^|_|\\b)(driver_?license|drivers_?license|dl_?number)(_|\\b|$)',
    mask_strategy: 'last4',
    confidence: 0.96,
  },
  {
    id: 'credit-card',
    label: 'Payment card',
    classification: 'PCI',
    pattern: '(^|_|\\b)(credit_?card|card_?number|pan)(_|\\b|$)',
    mask_strategy: 'last4',
    confidence: 0.98,
  },
  {
    id: 'vin',
    label: 'Vehicle identification number',
    classification: 'DealerSensitive',
    pattern: '(^|_|\\b)(vin|vehicle_?identification_?number)(_|\\b|$)',
    mask_strategy: 'last4',
    confidence: 0.9,
  },
];

const PRESIDIO_ENTITY_TO_STRATEGY = {
  CREDIT_CARD: 'last4',
  CRYPTO: 'hash_token',
  DATE_TIME: 'date_year',
  EMAIL_ADDRESS: 'email',
  IBAN_CODE: 'last4',
  IP_ADDRESS: 'hash_token',
  LOCATION: 'redact',
  MEDICAL_LICENSE: 'last4',
  NRP: 'redact',
  PERSON: 'redact',
  PHONE_NUMBER: 'phone',
  US_BANK_NUMBER: 'last4',
  US_DRIVER_LICENSE: 'last4',
  US_ITIN: 'last4',
  US_PASSPORT: 'last4',
  US_SSN: 'last4',
};

const METRIC_PATTERNS = [
  'amount',
  'amt',
  'balance',
  'count',
  'cnt',
  'cost',
  'duration',
  'fee',
  'margin',
  'measure',
  'metric',
  'price',
  'qty',
  'quantity',
  'rate',
  'revenue',
  'score',
  'total',
  'value',
  'volume',
];

const IDENTIFIER_PATTERNS = ['id', 'key', 'code', 'number', 'nbr', 'guid', 'uuid'];
const DATE_PATTERNS = ['date', 'time', 'timestamp', 'created', 'updated', 'effective', 'expires'];
const NUMERIC_TYPES = [
  'bigint',
  'decimal',
  'double',
  'float',
  'int',
  'money',
  'numeric',
  'real',
  'smallint',
  'smallmoney',
  'tinyint',
];

function toArray(value) {
  if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null);
  if (value === undefined || value === null || value === '') return [];
  return [value];
}

function safeRegex(pattern) {
  try {
    return new RegExp(pattern, 'i');
  } catch {
    return null;
  }
}

function normalizeName(value) {
  return String(value || '')
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function columnText(column = {}) {
  return [
    column.name,
    column.column_name,
    column.description,
    column.data_type,
    column.type,
    ...(column.tags || []),
    ...(column.classification_tags || []),
  ]
    .filter(Boolean)
    .join(' ');
}

export function assetColumns(asset = {}) {
  return toArray(asset.columns || asset.fields).map((column) =>
    typeof column === 'string' ? { name: column } : column || {}
  );
}

export function detectPiiColumn(column = {}) {
  const normalized = normalizeName(column.name || column.column_name);
  const text = `${normalized} ${columnText(column)}`;
  const existingTags = toArray(column.classification_tags).map((tag) => String(tag).toLowerCase());
  const matches = [];

  for (const rule of PII_COLUMN_RULES) {
    const regex = safeRegex(rule.pattern);
    if (regex?.test(text)) {
      matches.push({
        rule_id: rule.id,
        label: rule.label,
        classification: rule.classification,
        confidence: rule.confidence,
        mask_strategy: rule.mask_strategy,
        evidence: 'column_name_pattern',
      });
    }
  }

  if (existingTags.some((tag) => ['pii', 'phi', 'pci', 'confidential', 'restricted'].includes(tag))) {
    matches.push({
      rule_id: 'existing-classification-tag',
      label: 'Existing sensitivity tag',
      classification: existingTags.includes('phi') ? 'PHI' : 'PII',
      confidence: 0.9,
      mask_strategy: 'redact',
      evidence: 'classification_tags',
    });
  }

  if (String(column.sensitivity || '').toLowerCase() === 'restricted') {
    matches.push({
      rule_id: 'restricted-sensitivity',
      label: 'Restricted column sensitivity',
      classification: 'PII',
      confidence: 0.78,
      mask_strategy: 'redact',
      evidence: 'sensitivity',
    });
  }

  const confidence = matches.length
    ? Number(Math.max(...matches.map((match) => match.confidence)).toFixed(3))
    : 0;
  const primary = matches.sort((first, second) => second.confidence - first.confidence)[0] || null;

  return {
    column_name: column.name || column.column_name || '',
    is_pii: matches.length > 0,
    classification: primary?.classification || null,
    confidence,
    mask_strategy: primary?.mask_strategy || null,
    matches,
  };
}

export function buildPiiMaskPlan(asset = {}) {
  const columns = assetColumns(asset);
  const columnResults = columns.map((column) => ({
    ...detectPiiColumn(column),
    data_type: column.data_type || column.dataType || column.type || null,
    nullable: column.nullable ?? column.isNullable ?? null,
  }));
  const piiColumns = columnResults.filter((column) => column.is_pii);

  return {
    asset_id: asset.id || asset.name || '',
    policy: 'mask_all_pii',
    retention: {
      raw_pii_allowed: false,
      store_raw_values: false,
      allowed_storage: 'metadata_only',
    },
    summary: {
      total_columns: columns.length,
      pii_columns: piiColumns.length,
      requires_masking: piiColumns.length > 0,
    },
    columns: columnResults,
    masking_actions: piiColumns.map((column) => ({
      column_name: column.column_name,
      action: 'mask',
      strategy: column.mask_strategy || 'redact',
      classification: column.classification,
      confidence: column.confidence,
    })),
  };
}

export function maskValue(value, strategy = 'redact') {
  if (value === undefined || value === null) return null;
  const text = String(value);

  if (strategy === 'email') {
    const [user, domain] = text.split('@');
    if (!domain) return '***';
    return `${user.slice(0, 1)}***@${domain}`;
  }

  if (strategy === 'last4') {
    const tail = text.replace(/\D/g, '').slice(-4) || text.slice(-4);
    return `***${tail}`;
  }

  if (strategy === 'phone') {
    const digits = text.replace(/\D/g, '');
    return digits.length >= 4 ? `(***) ***-${digits.slice(-4)}` : '***';
  }

  if (strategy === 'date_year') {
    const year = text.match(/\b(19|20)\d{2}\b/)?.[0];
    return year ? `${year}-**-**` : '****-**-**';
  }

  if (strategy === 'hash_token') {
    let hash = 0;
    for (let index = 0; index < text.length; index += 1) {
      hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
    }
    return `token_${hash.toString(16).padStart(8, '0')}`;
  }

  return '***';
}

export function maskRecord(record = {}, maskPlan = {}) {
  const masked = {};
  const strategies = new Map(
    toArray(maskPlan.masking_actions).map((action) => [
      String(action.column_name || '').toLowerCase(),
      action.strategy || 'redact',
    ])
  );

  for (const [key, value] of Object.entries(record)) {
    const strategy = strategies.get(String(key).toLowerCase());
    masked[key] = strategy ? maskValue(value, strategy) : value;
  }

  return masked;
}

export async function analyzeTextWithPresidio(text, options = {}) {
  const endpoint = options.endpoint || process.env.PRESIDIO_ANALYZER_URL;
  const threshold = Number(options.scoreThreshold ?? process.env.PRESIDIO_SCORE_THRESHOLD ?? 0.6);

  if (!endpoint || !text) {
    return {
      enabled: Boolean(endpoint),
      provider: 'presidio',
      entities: [],
      status: endpoint ? 'skipped_empty_text' : 'disabled',
    };
  }

  const response = await fetch(`${endpoint.replace(/\/+$/, '')}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: String(text),
      language: options.language || 'en',
      score_threshold: threshold,
    }),
  });

  if (!response.ok) {
    throw new Error(`Presidio analyzer failed with HTTP ${response.status}`);
  }

  const results = await response.json();
  return {
    enabled: true,
    provider: 'presidio',
    status: 'ok',
    entities: (Array.isArray(results) ? results : []).map((entity) => ({
      entity_type: entity.entity_type,
      score: Number(entity.score || 0),
      start: entity.start,
      end: entity.end,
      mask_strategy: PRESIDIO_ENTITY_TO_STRATEGY[entity.entity_type] || 'redact',
    })),
  };
}

export async function buildExternalPiiAnalysis(asset = {}, options = {}) {
  const columns = assetColumns(asset);
  const text = columns
    .map((column) =>
      [column.name || column.column_name, column.description, column.data_type || column.type]
        .filter(Boolean)
        .join(' ')
    )
    .join('\n');
  const analysis = await analyzeTextWithPresidio(text, options);

  return {
    asset_id: asset.id || asset.name || '',
    ...analysis,
    raw_text_retained: false,
    note:
      analysis.status === 'disabled'
        ? 'Set PRESIDIO_ANALYZER_URL to enable external Presidio analysis.'
        : 'External analysis used metadata text only; raw table values were not sent or stored.',
  };
}

function includesAny(normalizedName, patterns) {
  return patterns.some((pattern) => normalizedName === pattern || normalizedName.includes(pattern));
}

export function classifyColumnSemantic(column = {}) {
  const name = normalizeName(column.name || column.column_name);
  const type = String(column.data_type || column.dataType || column.type || '').toLowerCase();
  const pii = detectPiiColumn(column);
  const numeric = NUMERIC_TYPES.some((numericType) => type.includes(numericType));
  const evidence = [];

  if (pii.is_pii) {
    return {
      column_name: column.name || column.column_name || '',
      semantic_type: 'pii',
      is_metric: false,
      confidence: pii.confidence,
      evidence: pii.matches.map((match) => match.evidence),
      mask_strategy: pii.mask_strategy,
    };
  }

  if (column.primary_key || includesAny(name, IDENTIFIER_PATTERNS)) {
    evidence.push(column.primary_key ? 'primary_key' : 'identifier_name');
    return {
      column_name: column.name || column.column_name || '',
      semantic_type: 'identifier',
      is_metric: false,
      confidence: column.primary_key ? 0.95 : 0.78,
      evidence,
    };
  }

  if (includesAny(name, DATE_PATTERNS) || type.includes('date') || type.includes('time')) {
    return {
      column_name: column.name || column.column_name || '',
      semantic_type: 'date',
      is_metric: false,
      confidence: 0.82,
      evidence: ['date_name_or_type'],
    };
  }

  if (numeric && includesAny(name, METRIC_PATTERNS)) {
    return {
      column_name: column.name || column.column_name || '',
      semantic_type: 'metric',
      is_metric: true,
      confidence: 0.88,
      evidence: ['numeric_type', 'metric_name_pattern'],
    };
  }

  if (numeric && !column.foreign_keys?.length && !column.primary_key) {
    return {
      column_name: column.name || column.column_name || '',
      semantic_type: 'metric_candidate',
      is_metric: true,
      confidence: 0.62,
      evidence: ['numeric_type'],
    };
  }

  return {
    column_name: column.name || column.column_name || '',
    semantic_type: 'dimension',
    is_metric: false,
    confidence: 0.55,
    evidence: ['default_non_metric'],
  };
}

export function analyzeColumnSemantics(asset = {}) {
  const columns = assetColumns(asset).map((column) => ({
    ...classifyColumnSemantic(column),
    data_type: column.data_type || column.dataType || column.type || null,
  }));

  return {
    asset_id: asset.id || asset.name || '',
    can_answer_metric_question: columns.length > 0,
    metric_columns: columns.filter((column) => column.is_metric),
    columns,
  };
}

export default {
  PII_COLUMN_RULES,
  assetColumns,
  detectPiiColumn,
  buildPiiMaskPlan,
  maskValue,
  maskRecord,
  classifyColumnSemantic,
  analyzeColumnSemantics,
  analyzeTextWithPresidio,
  buildExternalPiiAnalysis,
};
