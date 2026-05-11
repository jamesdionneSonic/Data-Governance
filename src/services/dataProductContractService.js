import { randomUUID } from 'crypto';

const productStore = new Map();

export const DATA_PRODUCT_STATE = {
  DRAFT: 'draft',
  REVIEW: 'review',
  PUBLISHED: 'published',
  DEPRECATED: 'deprecated',
};

const DATA_PRODUCT_STATES = new Set(Object.values(DATA_PRODUCT_STATE));

function toActor(actor = {}) {
  return {
    userId: actor.userId || actor.sub || 'unknown-user',
    email: actor.email || null,
    name: actor.name || null,
  };
}

function ensureArray(value) {
  return Array.isArray(value) ? value : [];
}

function nowIso() {
  return new Date().toISOString();
}

function calculateReadinessScore(product) {
  const latestContract = product.contracts[product.contracts.length - 1] || null;
  const hasOwnerAndSteward = !!product.owner?.userId && !!product.steward?.userId;
  const hasContractTerms = !!latestContract
    && !!latestContract.schemaGuarantees
    && Number(latestContract.freshnessSlaMinutes) > 0
    && Number(latestContract.qualityThreshold) > 0
    && !!latestContract.accessTerms;

  const openViolations = product.violations.filter((violation) => !violation.resolvedAt);
  const severeOpenViolations = openViolations.filter((violation) =>
    ['high', 'critical'].includes(violation.severity));

  let score = 0;
  if (hasOwnerAndSteward) {
    score += 35;
  }
  if (hasContractTerms) {
    score += 40;
  }
  if (product.state === DATA_PRODUCT_STATE.PUBLISHED) {
    score += 15;
  }

  const qualityPenalty = Math.min(20, openViolations.length * 5);
  const severityPenalty = Math.min(25, severeOpenViolations.length * 12);
  score = Math.max(0, Math.min(100, score - qualityPenalty - severityPenalty + 10));

  return score;
}

function normalizeProduct(product) {
  const currentContract = product.contracts.find(
    (contract) => contract.contractId === product.currentContractId,
  ) || null;
  const readinessScore = calculateReadinessScore(product);

  return {
    ...product,
    readiness: {
      score: readinessScore,
      state: product.state,
      openViolations: product.violations.filter((violation) => !violation.resolvedAt).length,
    },
    currentContract,
  };
}

function appendHistory(product, type, actor, details = {}) {
  product.history.push({
    id: randomUUID(),
    type,
    actor: toActor(actor),
    details,
    timestamp: nowIso(),
  });
}

export function createDataProduct(payload = {}, actor = {}) {
  const {
    name,
    domain,
    description = '',
    ownerUserId,
    ownerEmail,
    stewardUserId,
    stewardEmail,
    consumers = [],
  } = payload;

  if (!name) {
    throw new Error('name is required');
  }

  if (!domain) {
    throw new Error('domain is required');
  }

  const createdAt = nowIso();
  const product = {
    productId: randomUUID(),
    name,
    domain,
    description,
    owner: {
      userId: ownerUserId || null,
      email: ownerEmail || null,
    },
    steward: {
      userId: stewardUserId || null,
      email: stewardEmail || null,
    },
    consumers: ensureArray(consumers),
    state: DATA_PRODUCT_STATE.DRAFT,
    contracts: [],
    currentContractId: null,
    violations: [],
    createdAt,
    updatedAt: createdAt,
    history: [],
  };

  appendHistory(product, 'product_created', actor, {
    state: product.state,
    domain: product.domain,
  });

  productStore.set(product.productId, product);
  return normalizeProduct(product);
}

export function getDataProduct(productId) {
  const product = productStore.get(productId);
  return product ? normalizeProduct(product) : null;
}

export function listDataProducts(filters = {}) {
  const {
    state, domain, ownerUserId, stewardUserId,
  } = filters;

  return Array.from(productStore.values())
    .filter((product) => {
      if (state && product.state !== state) {
        return false;
      }

      if (domain && product.domain !== domain) {
        return false;
      }

      if (ownerUserId && product.owner?.userId !== ownerUserId) {
        return false;
      }

      if (stewardUserId && product.steward?.userId !== stewardUserId) {
        return false;
      }

      return true;
    })
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
    .map(normalizeProduct);
}

export function addContractVersion(productId, payload = {}, actor = {}) {
  const product = productStore.get(productId);

  if (!product) {
    throw new Error('Data product not found');
  }

  const {
    schemaGuarantees, freshnessSlaMinutes, qualityThreshold, accessTerms, effectiveFrom,
  } = payload;

  if (!schemaGuarantees || !freshnessSlaMinutes || !qualityThreshold || !accessTerms) {
    throw new Error(
      'schemaGuarantees, freshnessSlaMinutes, qualityThreshold, and accessTerms are required',
    );
  }

  const versionNumber = product.contracts.length + 1;
  const contract = {
    contractId: randomUUID(),
    versionNumber,
    schemaGuarantees,
    freshnessSlaMinutes: Number(freshnessSlaMinutes),
    qualityThreshold: Number(qualityThreshold),
    accessTerms,
    effectiveFrom: effectiveFrom || nowIso(),
    createdAt: nowIso(),
    createdBy: toActor(actor),
  };

  product.contracts.push(contract);
  product.currentContractId = contract.contractId;
  product.updatedAt = nowIso();

  appendHistory(product, 'contract_version_added', actor, {
    contractId: contract.contractId,
    versionNumber,
  });

  productStore.set(productId, product);
  return normalizeProduct(product);
}

export function transitionDataProductState(productId, nextState, actor = {}, reason = '') {
  const product = productStore.get(productId);

  if (!product) {
    throw new Error('Data product not found');
  }

  if (!DATA_PRODUCT_STATES.has(nextState)) {
    throw new Error(`Unsupported state: ${nextState}`);
  }

  if (product.state === DATA_PRODUCT_STATE.DEPRECATED) {
    throw new Error('Deprecated products cannot transition to another state');
  }

  const stateTransitions = {
    [DATA_PRODUCT_STATE.DRAFT]: new Set([DATA_PRODUCT_STATE.REVIEW]),
    [DATA_PRODUCT_STATE.REVIEW]: new Set([DATA_PRODUCT_STATE.DRAFT, DATA_PRODUCT_STATE.PUBLISHED]),
    [DATA_PRODUCT_STATE.PUBLISHED]: new Set([DATA_PRODUCT_STATE.DEPRECATED]),
    [DATA_PRODUCT_STATE.DEPRECATED]: new Set(),
  };

  if (!stateTransitions[product.state].has(nextState)) {
    throw new Error(`Cannot transition from ${product.state} to ${nextState}`);
  }

  product.state = nextState;
  product.updatedAt = nowIso();

  appendHistory(product, 'state_transitioned', actor, {
    state: nextState,
    reason,
  });

  productStore.set(productId, product);
  return normalizeProduct(product);
}

export function recordContractViolation(productId, payload = {}, actor = {}) {
  const product = productStore.get(productId);

  if (!product) {
    throw new Error('Data product not found');
  }

  const {
    violationType,
    severity = 'medium',
    message,
    impactedConsumers = [],
    observedAt,
  } = payload;

  if (!violationType || !message) {
    throw new Error('violationType and message are required');
  }

  const violation = {
    violationId: randomUUID(),
    violationType,
    severity,
    message,
    impactedConsumers: ensureArray(impactedConsumers),
    observedAt: observedAt || nowIso(),
    recordedAt: nowIso(),
    recordedBy: toActor(actor),
    resolvedAt: null,
  };

  product.violations.push(violation);
  product.updatedAt = nowIso();

  appendHistory(product, 'violation_recorded', actor, {
    violationId: violation.violationId,
    violationType,
    severity,
  });

  productStore.set(productId, product);
  return normalizeProduct(product);
}

export function exportContractCompliance(filters = {}) {
  const products = listDataProducts(filters);

  return {
    exportedAt: nowIso(),
    count: products.length,
    products: products.map((product) => ({
      productId: product.productId,
      name: product.name,
      domain: product.domain,
      state: product.state,
      readinessScore: product.readiness.score,
      contractVersion: product.currentContract?.versionNumber || null,
      freshnessSlaMinutes: product.currentContract?.freshnessSlaMinutes || null,
      qualityThreshold: product.currentContract?.qualityThreshold || null,
      openViolations: product.readiness.openViolations,
      updatedAt: product.updatedAt,
    })),
  };
}

export function clearDataProducts() {
  productStore.clear();
}

export default {
  DATA_PRODUCT_STATE,
  createDataProduct,
  getDataProduct,
  listDataProducts,
  addContractVersion,
  transitionDataProductState,
  recordContractViolation,
  exportContractCompliance,
  clearDataProducts,
};
