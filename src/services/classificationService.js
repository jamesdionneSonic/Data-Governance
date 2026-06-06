/**
 * Classification Service
 * Markdown/YAML-backed taxonomy plus deterministic rule-based classification.
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import yaml from 'yaml';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

function taxonomyPath() {
  return (
    process.env.CLASSIFICATION_TAXONOMY_PATH ||
    path.resolve(dirName, '../../data/classification/taxonomy.yml')
  );
}

const DEFAULT_CATEGORIES = [
  {
    id: 'public',
    label: 'Public',
    parent: null,
    level: 1,
    description: 'Data approved for public consumption.',
    regulatory_frameworks: [],
    name_patterns: [],
    sensitivity_triggers: ['public'],
    tag_triggers: ['public', 'open-data'],
    built_in: true,
  },
  {
    id: 'confidential',
    label: 'Confidential',
    parent: null,
    level: 1,
    description: 'Business data that should not be shared outside approved audiences.',
    regulatory_frameworks: [],
    name_patterns: ['confidential', 'private'],
    sensitivity_triggers: ['confidential'],
    tag_triggers: ['confidential'],
    built_in: true,
  },
  {
    id: 'restricted',
    label: 'Restricted',
    parent: 'confidential',
    level: 2,
    description: 'Highly sensitive data requiring elevated access control.',
    regulatory_frameworks: [],
    name_patterns: ['restricted', 'secret'],
    sensitivity_triggers: ['restricted'],
    tag_triggers: ['restricted'],
    built_in: true,
  },
  {
    id: 'pii',
    label: 'PII',
    parent: 'restricted',
    level: 3,
    description: 'Personally identifiable information.',
    regulatory_frameworks: ['GDPR', 'CCPA'],
    name_patterns: [
      '(first|last|full)_?name',
      'email',
      'phone',
      'address',
      'ssn|social_security',
      'passport',
      'date_of_birth|dob',
      'driver_?license',
      'customer_id',
      'user_id',
    ],
    sensitivity_triggers: ['confidential', 'restricted'],
    tag_triggers: ['pii', 'personal', 'gdpr'],
    built_in: true,
  },
  {
    id: 'phi',
    label: 'PHI',
    parent: 'restricted',
    level: 3,
    description: 'Protected health information governed by HIPAA.',
    regulatory_frameworks: ['HIPAA', 'HITECH'],
    name_patterns: [
      'diagnosis|icd',
      'medication|prescription|drug',
      'patient',
      'medical_record|mrn',
      'health_plan|insurance_claim',
      'lab_result|test_result',
    ],
    sensitivity_triggers: ['restricted'],
    tag_triggers: ['hipaa', 'phi', 'health'],
    built_in: true,
  },
  {
    id: 'gdpr',
    label: 'GDPR',
    parent: 'pii',
    level: 4,
    description: 'Personal data or special-category data subject to GDPR.',
    regulatory_frameworks: ['GDPR'],
    name_patterns: [
      'political_opinion|religion|ethnicity|race',
      'sexual_orientation|gender_identity',
      'biometric|fingerprint|facial',
      'criminal_record',
      'union_membership',
      'eu_?resident',
    ],
    sensitivity_triggers: ['restricted'],
    tag_triggers: ['gdpr', 'special-category'],
    built_in: true,
  },
  {
    id: 'hipaa',
    label: 'HIPAA',
    parent: 'phi',
    level: 4,
    description: 'Health data subject to HIPAA safeguards.',
    regulatory_frameworks: ['HIPAA'],
    name_patterns: ['hipaa', 'patient', 'medical_record|mrn', 'diagnosis'],
    sensitivity_triggers: ['restricted'],
    tag_triggers: ['hipaa'],
    built_in: true,
  },
  {
    id: 'ccpa',
    label: 'CCPA',
    parent: 'pii',
    level: 4,
    description: 'California consumer personal information governed by CCPA.',
    regulatory_frameworks: ['CCPA'],
    name_patterns: ['ccpa', 'consumer', 'california'],
    sensitivity_triggers: ['confidential', 'restricted'],
    tag_triggers: ['ccpa'],
    built_in: true,
  },
  {
    id: 'financial',
    label: 'Financial',
    parent: 'confidential',
    level: 2,
    description: 'Financial data subject to audit, SOX, PCI, or business confidentiality.',
    regulatory_frameworks: ['SOX', 'PCI-DSS'],
    name_patterns: [
      'revenue',
      'salary|compensation|payroll',
      'account_balance|balance',
      'credit_card|payment_card',
      'invoice|billing',
      'transaction',
      'profit|loss|ebitda',
      'bank_account',
    ],
    sensitivity_triggers: ['confidential', 'restricted'],
    tag_triggers: ['financial', 'sox', 'pci'],
    built_in: true,
  },
];

const DEFAULT_RULES = [
  {
    id: 'rule-email-pii',
    label: 'Email columns are PII',
    target: 'column',
    classification: 'PII',
    pattern: '(^|_|\\b)(e_?mail|email_?address)(_|\\b|$)',
    confidence: 0.95,
    enabled: true,
    source: 'built_in',
  },
  {
    id: 'rule-phone-pii',
    label: 'Phone columns are PII',
    target: 'column',
    classification: 'PII',
    pattern: '(^|_|\\b)(phone|mobile|cell)_?(number)?(_|\\b|$)',
    confidence: 0.9,
    enabled: true,
    source: 'built_in',
  },
  {
    id: 'rule-ssn-pii',
    label: 'SSN columns are restricted PII',
    target: 'column',
    classification: 'PII',
    pattern: '(^|_|\\b)(ssn|social_?security)(_|\\b|$)',
    confidence: 0.99,
    enabled: true,
    source: 'built_in',
  },
  {
    id: 'rule-name-address-pii',
    label: 'Name/address combinations are PII',
    target: 'asset',
    classification: 'PII',
    pattern: '(first|last|full)_?name|address|city|state|zip|postal',
    min_column_hits: 2,
    confidence: 0.82,
    enabled: true,
    source: 'built_in',
  },
  {
    id: 'rule-salary-financial',
    label: 'Salary and compensation columns are Financial',
    target: 'column',
    classification: 'Financial',
    pattern: '(^|_|\\b)(salary|compensation|payroll|bonus|commission)(_|\\b|$)',
    confidence: 0.92,
    enabled: true,
    source: 'built_in',
  },
  {
    id: 'rule-health-phi',
    label: 'Patient and medical columns are PHI',
    target: 'column',
    classification: 'PHI',
    pattern: '(^|_|\\b)(patient|diagnosis|icd|medical_?record|mrn|prescription)(_|\\b|$)',
    confidence: 0.93,
    enabled: true,
    source: 'built_in',
  },
];

let taxonomyCache = null;

function toArray(value) {
  if (Array.isArray(value)) return value.filter((item) => item !== undefined && item !== null);
  if (value === undefined || value === null || value === '') return [];
  return [value];
}

function slugify(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function categoryId(category) {
  return slugify(category.id || category.label || category.name);
}

function normalizeCategory(category) {
  const id = categoryId(category);
  return {
    id,
    label: category.label || category.name || id,
    parent: category.parent || null,
    level: Number.isFinite(Number(category.level)) ? Number(category.level) : 1,
    description: category.description || '',
    regulatory_frameworks: toArray(category.regulatory_frameworks),
    name_patterns: toArray(category.name_patterns),
    sensitivity_triggers: toArray(category.sensitivity_triggers).map((item) =>
      String(item).toLowerCase()
    ),
    tag_triggers: toArray(category.tag_triggers).map((item) => String(item).toLowerCase()),
    built_in: category.built_in === true,
    custom: category.custom === true,
    created_at: category.created_at || null,
    updated_at: category.updated_at || null,
  };
}

function normalizeRule(rule) {
  const id = slugify(rule.id || rule.label || `${rule.classification}-${rule.pattern}`);
  return {
    id,
    label: rule.label || id,
    target: rule.target || 'asset',
    classification: rule.classification || rule.label || '',
    pattern: rule.pattern || '',
    min_column_hits: Number.isFinite(Number(rule.min_column_hits))
      ? Number(rule.min_column_hits)
      : null,
    confidence: Number.isFinite(Number(rule.confidence)) ? Number(rule.confidence) : 0.75,
    enabled: rule.enabled !== false,
    source: rule.source || (rule.custom ? 'custom' : 'configured'),
    description: rule.description || '',
    created_at: rule.created_at || null,
    updated_at: rule.updated_at || null,
  };
}

function mergeById(primary, fallback) {
  const merged = new Map();
  for (const item of fallback) merged.set(item.id, item);
  for (const item of primary) merged.set(item.id, { ...merged.get(item.id), ...item });
  return [...merged.values()];
}

function normalizeTaxonomy(raw = {}) {
  const configuredCategories = toArray(raw.categories).map(normalizeCategory).filter((c) => c.id);
  const configuredRules = toArray(raw.rules).map(normalizeRule).filter((r) => r.id);
  const categories = mergeById(configuredCategories, DEFAULT_CATEGORIES.map(normalizeCategory));
  const rules = mergeById(configuredRules, DEFAULT_RULES.map(normalizeRule));

  return {
    version: raw.version || 1,
    updated_at: raw.updated_at || null,
    categories,
    rules,
    history: toArray(raw.history),
  };
}

function writeTaxonomy(taxonomy) {
  const targetPath = taxonomyPath();
  mkdirSync(path.dirname(targetPath), { recursive: true });
  const serialized = yaml.stringify({
    version: taxonomy.version || 1,
    updated_at: taxonomy.updated_at,
    categories: taxonomy.categories,
    rules: taxonomy.rules,
    history: taxonomy.history || [],
  });
  writeFileSync(targetPath, serialized, 'utf-8');
  taxonomyCache = normalizeTaxonomy(taxonomy);
  return taxonomyCache;
}

/**
 * Load the classification taxonomy YAML.
 * @returns {Object} Taxonomy definition
 */
export function loadTaxonomy() {
  if (taxonomyCache) return taxonomyCache;

  const targetPath = taxonomyPath();
  if (!existsSync(targetPath)) {
    taxonomyCache = normalizeTaxonomy({});
    return taxonomyCache;
  }

  try {
    const raw = readFileSync(targetPath, 'utf-8');
    taxonomyCache = normalizeTaxonomy(yaml.parse(raw) || {});
    return taxonomyCache;
  } catch (err) {
    console.error('[classificationService] Failed to parse taxonomy.yml:', err.message);
    taxonomyCache = normalizeTaxonomy({});
    return taxonomyCache;
  }
}

export function saveTaxonomy(taxonomy, audit = {}) {
  const current = loadTaxonomy();
  const next = normalizeTaxonomy({
    ...taxonomy,
    history: [
      {
        action: audit.action || 'taxonomy_saved',
        changed_by: audit.changed_by || 'system',
        changed_at: new Date().toISOString(),
        details: audit.details || {},
      },
      ...(taxonomy.history || current.history || []),
    ].slice(0, 200),
    updated_at: new Date().toISOString(),
    version: Number(current.version || 1) + 1,
  });
  return writeTaxonomy(next);
}

export function upsertCategory(input, audit = {}) {
  const taxonomy = loadTaxonomy();
  const category = normalizeCategory({
    ...input,
    id: input.id || slugify(input.label || input.name),
    custom: input.custom !== false,
    updated_at: new Date().toISOString(),
    created_at: input.created_at || new Date().toISOString(),
  });
  const categories = taxonomy.categories.filter((item) => item.id !== category.id);
  categories.push(category);
  return saveTaxonomy(
    { ...taxonomy, categories },
    {
      action: taxonomy.categories.some((item) => item.id === category.id)
        ? 'category_updated'
        : 'category_created',
      changed_by: audit.changed_by,
      details: { id: category.id, label: category.label },
    }
  );
}

export function deleteCategory(id, audit = {}) {
  const taxonomy = loadTaxonomy();
  const category = taxonomy.categories.find((item) => item.id === id || item.label === id);
  if (!category) return taxonomy;
  if (category.built_in) {
    throw new Error(`Built-in classification category '${category.label}' cannot be deleted`);
  }
  return saveTaxonomy(
    { ...taxonomy, categories: taxonomy.categories.filter((item) => item.id !== category.id) },
    {
      action: 'category_deleted',
      changed_by: audit.changed_by,
      details: { id: category.id, label: category.label },
    }
  );
}

export function upsertRule(input, audit = {}) {
  const taxonomy = loadTaxonomy();
  const rule = normalizeRule({
    ...input,
    id: input.id || slugify(input.label || `${input.classification}-${input.pattern}`),
    source: input.source || 'custom',
    updated_at: new Date().toISOString(),
    created_at: input.created_at || new Date().toISOString(),
  });
  const rules = taxonomy.rules.filter((item) => item.id !== rule.id);
  rules.push(rule);
  return saveTaxonomy(
    { ...taxonomy, rules },
    {
      action: taxonomy.rules.some((item) => item.id === rule.id) ? 'rule_updated' : 'rule_created',
      changed_by: audit.changed_by,
      details: { id: rule.id, classification: rule.classification },
    }
  );
}

export function deleteRule(id, audit = {}) {
  const taxonomy = loadTaxonomy();
  const rule = taxonomy.rules.find((item) => item.id === id);
  if (!rule) return taxonomy;
  return saveTaxonomy(
    { ...taxonomy, rules: taxonomy.rules.filter((item) => item.id !== id) },
    {
      action: 'rule_deleted',
      changed_by: audit.changed_by,
      details: { id },
    }
  );
}

function assetColumns(asset) {
  return toArray(asset.columns || asset.schema || asset.fields).map((column) => {
    if (typeof column === 'string') return { name: column };
    return column || {};
  });
}

function evidenceKey(label, source) {
  return `${String(label).toLowerCase()}::${source}`;
}

function addEvidence(map, label, source, confidence, evidence) {
  if (!label) return;
  const key = evidenceKey(label, source);
  const existing = map.get(key);
  if (existing) {
    existing.confidence = Math.max(existing.confidence, confidence);
    existing.evidence.push(...toArray(evidence));
    return;
  }
  map.set(key, {
    label,
    source,
    confidence,
    evidence: toArray(evidence),
  });
}

function safeRegex(pattern) {
  try {
    return new RegExp(pattern, 'i');
  } catch {
    return null;
  }
}

function assetSearchText(asset) {
  return [
    asset.id,
    asset.name,
    asset.database,
    asset.schema,
    asset.type,
    asset.sensitivity,
    asset.description,
    ...(asset.tags || []),
  ]
    .filter(Boolean)
    .join(' ');
}

/**
 * Classify a single asset and return evidence-rich details.
 *
 * @param {Object} asset - Parsed asset object from markdownService
 * @param {Object} options - Optional taxonomy override
 * @returns {Object} detailed classification result
 */
export function classifyAssetDetailed(asset = {}, options = {}) {
  const taxonomy = normalizeTaxonomy(options.taxonomy || loadTaxonomy());
  const evidence = new Map();
  const searchText = assetSearchText(asset);
  const lowerTags = toArray(asset.tags).map((tag) => String(tag).toLowerCase());
  const lowerSensitivity = String(asset.sensitivity || '').toLowerCase();
  const columns = assetColumns(asset);

  for (const category of taxonomy.categories || []) {
    for (const pattern of category.name_patterns || []) {
      const regex = safeRegex(pattern);
      if (regex && regex.test(searchText)) {
        addEvidence(evidence, category.label, 'taxonomy_pattern', 0.72, pattern);
      }
    }

    if (category.sensitivity_triggers?.includes(lowerSensitivity)) {
      addEvidence(evidence, category.label, 'sensitivity', 0.8, lowerSensitivity);
    }

    if (category.tag_triggers?.some((trigger) => lowerTags.includes(trigger))) {
      addEvidence(
        evidence,
        category.label,
        'tag',
        0.84,
        category.tag_triggers.filter((trigger) => lowerTags.includes(trigger))
      );
    }
  }

  for (const rule of taxonomy.rules || []) {
    if (rule.enabled === false || !rule.pattern) continue;
    const regex = safeRegex(rule.pattern);
    if (!regex) continue;

    if (rule.target === 'column') {
      const matchedColumns = columns
        .filter((column) => regex.test([column.name, column.description, ...(column.tags || [])].join(' ')))
        .map((column) => column.name)
        .filter(Boolean);
      if (matchedColumns.length > 0) {
        addEvidence(evidence, rule.classification, 'rule', rule.confidence, {
          rule_id: rule.id,
          columns: matchedColumns,
        });
      }
      continue;
    }

    if (rule.target === 'asset') {
      const matchedColumns = columns
        .filter((column) => regex.test([column.name, column.description, ...(column.tags || [])].join(' ')))
        .map((column) => column.name)
        .filter(Boolean);
      const assetMatched = regex.test(searchText);
      const columnHitsMet = rule.min_column_hits
        ? matchedColumns.length >= rule.min_column_hits
        : matchedColumns.length > 0;
      if (assetMatched || columnHitsMet) {
        addEvidence(evidence, rule.classification, 'rule', rule.confidence, {
          rule_id: rule.id,
          columns: matchedColumns,
          asset_match: assetMatched,
        });
      }
    }
  }

  for (const override of toArray(asset.classification_overrides)) {
    addEvidence(evidence, override.label || override.classification, 'manual_override', 1, {
      reason: override.reason || 'manual override',
      changed_by: override.changed_by || 'unknown',
    });
  }

  const matches = [...evidence.values()].sort((first, second) => {
    const confidenceDelta = second.confidence - first.confidence;
    if (confidenceDelta !== 0) return confidenceDelta;
    return first.label.localeCompare(second.label);
  });

  const labels = [...new Set(matches.map((match) => match.label))];
  const confidence = matches.length
    ? Number(Math.max(...matches.map((match) => match.confidence)).toFixed(3))
    : 0;

  return {
    asset_id: asset.id || asset.name || '',
    classifications: labels,
    confidence,
    matches,
    audit: {
      evaluated_at: new Date().toISOString(),
      rules_evaluated: taxonomy.rules.filter((rule) => rule.enabled !== false).length,
      categories_evaluated: taxonomy.categories.length,
    },
  };
}

/**
 * Classify a single asset based on taxonomy and rules.
 * @param {Object} asset - Parsed asset object from markdownService
 * @returns {string[]} Array of matched classification labels
 */
export function classifyAsset(asset) {
  return classifyAssetDetailed(asset).classifications;
}

export function classifyAllAssets(assets) {
  const result = new Map();
  for (const [id, asset] of assets) {
    result.set(id, classifyAsset(asset));
  }
  return result;
}

function downstreamIdsFor(assetId, assets, lineageGraph) {
  const downstream = new Set();

  if (lineageGraph instanceof Map) {
    const entry = lineageGraph.get(assetId);
    for (const id of toArray(entry?.downstream || entry?.consumers || entry)) {
      if (typeof id === 'string') downstream.add(id);
      if (id?.id) downstream.add(id.id);
      if (id?.target) downstream.add(id.target);
    }
  }

  for (const [id, asset] of assets || new Map()) {
    const dependencies = [
      ...toArray(asset.depends_on),
      ...toArray(asset.reads_from),
      ...toArray(asset.sources),
    ].map((value) => (typeof value === 'string' ? value : value?.id || value?.source));
    if (dependencies.includes(assetId)) downstream.add(id);
  }

  return [...downstream].filter(Boolean);
}

export function propagateClassifications(seedAssetId, assets, lineageGraph, options = {}) {
  const maxDepth = Number.isFinite(Number(options.maxDepth)) ? Number(options.maxDepth) : 3;
  const seedAsset = assets?.get(seedAssetId);
  const seed = options.seedResult || classifyAssetDetailed(seedAsset || { id: seedAssetId });
  const queue = [{ id: seedAssetId, depth: 0, classifications: seed.classifications }];
  const visited = new Set([seedAssetId]);
  const propagated = [];

  while (queue.length) {
    const current = queue.shift();
    if (current.depth >= maxDepth) continue;

    for (const childId of downstreamIdsFor(current.id, assets, lineageGraph)) {
      if (visited.has(childId)) continue;
      visited.add(childId);
      const asset = assets?.get(childId) || { id: childId };
      const direct = classifyAssetDetailed(asset);
      const inherited = current.classifications.filter(
        (classification) => !direct.classifications.includes(classification)
      );
      if (inherited.length > 0) {
        propagated.push({
          asset_id: childId,
          inherited_from: current.id,
          depth: current.depth + 1,
          classifications: inherited,
          confidence: Number((seed.confidence * Math.max(0.4, 1 - (current.depth + 1) * 0.15)).toFixed(3)),
        });
      }
      queue.push({
        id: childId,
        depth: current.depth + 1,
        classifications: [...new Set([...direct.classifications, ...current.classifications])],
      });
    }
  }

  return {
    seed_asset_id: seedAssetId,
    seed_classifications: seed.classifications,
    propagated,
  };
}

export function bulkClassifyAssets(assets, requests = [], options = {}) {
  const entries =
    requests.length > 0
      ? requests.map((request) => [request.asset_id || request.id, assets.get(request.asset_id || request.id)])
      : [...assets.entries()];

  return entries
    .filter(([id, asset]) => id && asset)
    .map(([id, asset]) => {
      const result = classifyAssetDetailed(asset, options);
      const request = requests.find((item) => (item.asset_id || item.id) === id);
      if (request?.manual_classification) {
        result.classifications = [
          ...new Set([...result.classifications, request.manual_classification]),
        ];
        result.matches.unshift({
          label: request.manual_classification,
          source: 'manual_override',
          confidence: 1,
          evidence: [
            {
              reason: request.reason || 'bulk manual classification',
              changed_by: request.changed_by || options.changed_by || 'system',
            },
          ],
        });
        result.confidence = 1;
      }
      return result;
    });
}

export function resetTaxonomyCache() {
  taxonomyCache = null;
}

export default {
  loadTaxonomy,
  saveTaxonomy,
  upsertCategory,
  deleteCategory,
  upsertRule,
  deleteRule,
  classifyAsset,
  classifyAssetDetailed,
  classifyAllAssets,
  bulkClassifyAssets,
  propagateClassifications,
  resetTaxonomyCache,
};
