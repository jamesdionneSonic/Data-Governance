import { randomUUID } from 'crypto';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';
import { computeTrustScore, computeAllTrustScores } from './trustService.js';

const taskStore = new Map();
const commentStore = new Map();
const decisionStore = new Map();
const usageEvents = [];
const incidentStore = new Map();
const glossaryReviewStore = new Map();
const trustActionStore = new Map();
const publicationChecks = new Map();
const eventDeliveryStore = [];

let storePath =
  process.env.GOVERNANCE_OPS_STORE_PATH ||
  path.resolve(process.cwd(), 'data/governance-ops/state.json');
let explicitStorePath = Boolean(process.env.GOVERNANCE_OPS_STORE_PATH);

const TASK_STATUSES = new Set(['open', 'in_progress', 'blocked', 'done', 'canceled']);
const INCIDENT_STATUSES = new Set(['open', 'investigating', 'mitigated', 'resolved', 'closed']);

function nowIso() {
  return new Date().toISOString();
}

function actorFrom(user = {}) {
  return {
    userId: user.id || user.userId || user.email || 'system',
    email: user.email || null,
    name: user.name || user.email || 'System',
    roles: Array.isArray(user.roles) ? user.roles : [],
  };
}

function asArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null || value === '') return [];
  return [value];
}

function assetDisplay(asset) {
  return asset?.qualifiedName || asset?.id || asset?.name || 'unknown';
}

function hasValue(value) {
  return value !== undefined && value !== null && value !== '' && value !== 'unknown';
}

function lineageCounts(assetId, lineageGraph = new Map()) {
  const upstream = lineageGraph.get(assetId)?.size || 0;
  let downstream = 0;
  for (const neighbors of lineageGraph.values()) {
    if (neighbors?.has?.(assetId)) downstream += 1;
  }
  return { upstream, downstream };
}

function topEntries(counts, limit = 10) {
  return Object.entries(counts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit)
    .map(([key, count]) => ({ key, count }));
}

function severityRank(severity) {
  return { low: 1, medium: 2, high: 3, critical: 4 }[severity] || 1;
}

function addEvent(record, action, actor, details = {}) {
  record.events.push({
    eventId: randomUUID(),
    action,
    actor,
    details,
    at: nowIso(),
  });
}

function persistenceEnabled() {
  if (process.env.GOVERNANCE_OPS_PERSISTENCE === 'false') return false;
  if (process.env.NODE_ENV === 'test' && !explicitStorePath) return false;
  return true;
}

function mapToEntries(map) {
  return [...map.entries()];
}

function arrayMapToEntries(map) {
  return [...map.entries()].map(([key, value]) => [key, Array.isArray(value) ? value : []]);
}

function entriesToMap(entries = []) {
  return new Map(Array.isArray(entries) ? entries : []);
}

function governanceOpsState() {
  return {
    version: 1,
    savedAt: nowIso(),
    tasks: mapToEntries(taskStore),
    comments: arrayMapToEntries(commentStore),
    decisions: arrayMapToEntries(decisionStore),
    usageEvents,
    incidents: mapToEntries(incidentStore),
    glossaryReviews: mapToEntries(glossaryReviewStore),
    trustActions: arrayMapToEntries(trustActionStore),
    publicationChecks: mapToEntries(publicationChecks),
    eventDeliveries: eventDeliveryStore,
  };
}

function replaceState(state = {}) {
  taskStore.clear();
  commentStore.clear();
  decisionStore.clear();
  usageEvents.length = 0;
  incidentStore.clear();
  glossaryReviewStore.clear();
  trustActionStore.clear();
  publicationChecks.clear();
  eventDeliveryStore.length = 0;

  for (const [key, value] of entriesToMap(state.tasks)) taskStore.set(key, value);
  for (const [key, value] of entriesToMap(state.comments)) commentStore.set(key, value);
  for (const [key, value] of entriesToMap(state.decisions)) decisionStore.set(key, value);
  usageEvents.push(...(Array.isArray(state.usageEvents) ? state.usageEvents : []));
  for (const [key, value] of entriesToMap(state.incidents)) incidentStore.set(key, value);
  for (const [key, value] of entriesToMap(state.glossaryReviews)) glossaryReviewStore.set(key, value);
  for (const [key, value] of entriesToMap(state.trustActions)) trustActionStore.set(key, value);
  for (const [key, value] of entriesToMap(state.publicationChecks)) publicationChecks.set(key, value);
  eventDeliveryStore.push(...(Array.isArray(state.eventDeliveries) ? state.eventDeliveries : []));
}

export function persistGovernanceOpsState() {
  if (!persistenceEnabled()) return { persisted: false, path: storePath };
  mkdirSync(path.dirname(storePath), { recursive: true });
  writeFileSync(storePath, `${JSON.stringify(governanceOpsState(), null, 2)}\n`, 'utf8');
  return { persisted: true, path: storePath };
}

export function loadGovernanceOpsState() {
  if (!persistenceEnabled() || !existsSync(storePath)) {
    return { loaded: false, path: storePath };
  }
  const state = JSON.parse(readFileSync(storePath, 'utf8'));
  replaceState(state);
  return { loaded: true, path: storePath, savedAt: state.savedAt || null };
}

export function setGovernanceOpsStorePath(nextPath, options = {}) {
  storePath = path.resolve(nextPath);
  explicitStorePath = options.enablePersistence !== false;
  if (options.load !== false) {
    return loadGovernanceOpsState();
  }
  return { loaded: false, path: storePath };
}

export function exportGovernanceOpsState() {
  return governanceOpsState();
}

export function importGovernanceOpsState(state = {}) {
  replaceState(state);
  return persistGovernanceOpsState();
}

export function getGovernanceOpsStoreStatus() {
  return {
    path: storePath,
    persistenceEnabled: persistenceEnabled(),
    exists: existsSync(storePath),
    counts: {
      tasks: taskStore.size,
      commentThreads: commentStore.size,
      decisionLogs: decisionStore.size,
      usageEvents: usageEvents.length,
      incidents: incidentStore.size,
      glossaryReviews: glossaryReviewStore.size,
      trustActionThreads: trustActionStore.size,
      publicationChecks: publicationChecks.size,
      eventDeliveries: eventDeliveryStore.length,
    },
  };
}

function recordOpsEvent(eventType, payload = {}, actor = actorFrom()) {
  const delivery = {
    deliveryId: randomUUID(),
    eventType,
    payload,
    actor,
    status: 'queued',
    channels: ['email', 'slack', 'teams'],
    createdAt: nowIso(),
  };
  eventDeliveryStore.push(delivery);
  if (eventDeliveryStore.length > 5000) eventDeliveryStore.shift();
  return delivery;
}

function findAsset(assetId, objects = new Map()) {
  if (objects.has(assetId)) return objects.get(assetId);
  const lowered = String(assetId || '').toLowerCase();
  for (const [id, asset] of objects.entries()) {
    const candidates = [id, asset?.id, asset?.qualifiedName, asset?.name, asset?.object_name]
      .filter(Boolean)
      .map((value) => String(value).toLowerCase());
    if (candidates.includes(lowered)) return asset;
  }
  return null;
}

export function clearGovernanceOps() {
  taskStore.clear();
  commentStore.clear();
  decisionStore.clear();
  usageEvents.length = 0;
  incidentStore.clear();
  glossaryReviewStore.clear();
  trustActionStore.clear();
  publicationChecks.clear();
  eventDeliveryStore.length = 0;
  persistGovernanceOpsState();
}

export function createGovernanceTask(payload = {}, user = {}) {
  const actor = actorFrom(user);
  const task = {
    taskId: randomUUID(),
    assetId: payload.assetId || null,
    type: payload.type || 'stewardship',
    title: payload.title || 'Governance task',
    description: payload.description || '',
    priority: payload.priority || 'medium',
    status: 'open',
    owner: payload.owner || actor.email || actor.userId,
    dueAt: payload.dueAt || null,
    tags: asArray(payload.tags),
    evidence: asArray(payload.evidence),
    createdBy: actor,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    events: [],
  };
  addEvent(task, 'created', actor);
  taskStore.set(task.taskId, task);
  recordOpsEvent('governance.task.created', { taskId: task.taskId, assetId: task.assetId }, actor);
  persistGovernanceOpsState();
  return task;
}

export function listGovernanceTasks(filters = {}) {
  let tasks = [...taskStore.values()];
  if (filters.status) tasks = tasks.filter((task) => task.status === filters.status);
  if (filters.assetId) tasks = tasks.filter((task) => task.assetId === filters.assetId);
  if (filters.owner) tasks = tasks.filter((task) => task.owner === filters.owner);
  if (filters.type) tasks = tasks.filter((task) => task.type === filters.type);
  return tasks.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
}

export function transitionGovernanceTask(taskId, payload = {}, user = {}) {
  const task = taskStore.get(taskId);
  if (!task) return null;
  const nextStatus = payload.status;
  if (!TASK_STATUSES.has(nextStatus)) {
    throw new Error(`Unsupported task status '${nextStatus}'`);
  }
  const actor = actorFrom(user);
  task.status = nextStatus;
  task.updatedAt = nowIso();
  task.resolution = payload.resolution || task.resolution || null;
  addEvent(task, 'transitioned', actor, { status: nextStatus, note: payload.note || null });
  recordOpsEvent('governance.task.transitioned', { taskId, status: nextStatus }, actor);
  persistGovernanceOpsState();
  return task;
}

export function generateStewardshipTasks(objects = new Map(), user = {}, options = {}) {
  const limit = Number(options.limit || 250);
  const generated = [];
  const existingKeys = new Set(
    [...taskStore.values()].map((task) => `${task.assetId}:${task.type}:${task.status}`)
  );

  for (const [id, asset] of objects.entries()) {
    if (generated.length >= limit) break;
    const gaps = [];
    if (!hasValue(asset.owner)) gaps.push('owner');
    if (!hasValue(asset.steward)) gaps.push('steward');
    if (!hasValue(asset.description)) gaps.push('description');
    if (asArray(asset.tags).length === 0) gaps.push('tags');
    if (!hasValue(asset.sensitivity) && !hasValue(asset.classification)) gaps.push('sensitivity');
    if (gaps.length === 0) continue;

    const type = 'metadata_completion';
    const dedupeKey = `${id}:${type}:open`;
    if (existingKeys.has(dedupeKey)) continue;

    generated.push(
      createGovernanceTask(
        {
          assetId: id,
          type,
          title: `Complete governance metadata for ${assetDisplay(asset)}`,
          description: `Missing fields: ${gaps.join(', ')}`,
          priority: gaps.includes('owner') || gaps.includes('steward') ? 'high' : 'medium',
          tags: ['phase-7', 'stewardship', ...gaps],
          evidence: gaps.map((gap) => ({ gap })),
        },
        user
      )
    );
    existingKeys.add(dedupeKey);
  }
  return { count: generated.length, tasks: generated };
}

export function addAssetComment(assetId, payload = {}, user = {}) {
  const actor = actorFrom(user);
  const comment = {
    commentId: randomUUID(),
    assetId,
    body: payload.body || '',
    visibility: payload.visibility || 'internal',
    mentions: [...new Set((payload.body || '').match(/@[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*/g) || [])],
    tags: asArray(payload.tags),
    status: 'active',
    createdBy: actor,
    createdAt: nowIso(),
  };
  if (!commentStore.has(assetId)) commentStore.set(assetId, []);
  commentStore.get(assetId).push(comment);
  recordOpsEvent('governance.comment.created', { assetId, commentId: comment.commentId }, actor);
  persistGovernanceOpsState();
  return comment;
}

export function listAssetComments(assetId, options = {}) {
  const comments = commentStore.get(assetId) || [];
  return options.includeHidden ? comments : comments.filter((comment) => comment.status === 'active');
}

export function recordDecision(assetId, payload = {}, user = {}) {
  const decision = {
    decisionId: randomUUID(),
    assetId,
    title: payload.title || 'Governance decision',
    decision: payload.decision || '',
    rationale: payload.rationale || '',
    impact: payload.impact || '',
    evidence: asArray(payload.evidence),
    createdBy: actorFrom(user),
    createdAt: nowIso(),
  };
  if (!decisionStore.has(assetId)) decisionStore.set(assetId, []);
  decisionStore.get(assetId).push(decision);
  recordOpsEvent('governance.decision.recorded', { assetId, decisionId: decision.decisionId }, decision.createdBy);
  persistGovernanceOpsState();
  return decision;
}

export function listDecisions(assetId) {
  return decisionStore.get(assetId) || [];
}

export function recordUsageEvent(payload = {}, user = {}) {
  const event = {
    eventId: randomUUID(),
    assetId: payload.assetId || 'unknown',
    action: payload.action || 'view',
    channel: payload.channel || 'app',
    user: actorFrom(user),
    metadata: payload.metadata || {},
    at: payload.at || nowIso(),
  };
  usageEvents.push(event);
  if (usageEvents.length > 100000) usageEvents.shift();
  persistGovernanceOpsState();
  return event;
}

export function buildUsageAnalytics(options = {}) {
  const assetCounts = {};
  const actionCounts = {};
  const channelCounts = {};
  const since = options.since ? new Date(options.since) : null;

  for (const event of usageEvents) {
    if (since && new Date(event.at) < since) continue;
    assetCounts[event.assetId] = (assetCounts[event.assetId] || 0) + 1;
    actionCounts[event.action] = (actionCounts[event.action] || 0) + 1;
    channelCounts[event.channel] = (channelCounts[event.channel] || 0) + 1;
  }

  return {
    totalEvents: usageEvents.length,
    topAssets: topEntries(assetCounts, Number(options.limit || 10)),
    actions: actionCounts,
    channels: channelCounts,
  };
}

export function buildAdoptionScorecards(objects = new Map(), lineageGraph = new Map()) {
  const usage = buildUsageAnalytics({ limit: 100000 });
  const usageByAsset = Object.fromEntries(usage.topAssets.map((entry) => [entry.key, entry.count]));
  return [...objects.entries()]
    .map(([id, asset]) => {
      const counts = lineageCounts(id, lineageGraph);
      const usageCount = usageByAsset[id] || 0;
      const trust = computeTrustScore(asset);
      const score = Math.min(100, usageCount * 5 + counts.downstream * 3 + Math.round(trust.score / 4));
      return {
        assetId: id,
        name: assetDisplay(asset),
        usageCount,
        downstreamCount: counts.downstream,
        trustScore: trust.score,
        adoptionScore: score,
      };
    })
    .sort((a, b) => b.adoptionScore - a.adoptionScore);
}

export function recommendRetirementCandidates(objects = new Map(), lineageGraph = new Map()) {
  const activeAssetIds = new Set(usageEvents.map((event) => event.assetId));
  return [...objects.entries()]
    .map(([id, asset]) => {
      const counts = lineageCounts(id, lineageGraph);
      const reasons = [];
      if (!activeAssetIds.has(id)) reasons.push('no recorded usage');
      if (counts.downstream === 0) reasons.push('no downstream dependencies');
      if (asset.status === 'deprecated' || asset.lifecycle === 'deprecated') reasons.push('deprecated');
      const confidence = Math.min(0.95, 0.35 + reasons.length * 0.2);
      return { assetId: id, name: assetDisplay(asset), reasons, confidence };
    })
    .filter((candidate) => candidate.reasons.length >= 2)
    .sort((a, b) => b.confidence - a.confidence);
}

export function evaluateServiceLevel(payload = {}, user = {}) {
  const thresholds = payload.thresholds || {};
  const current = payload.current || {};
  const breaches = [];
  for (const [metric, threshold] of Object.entries(thresholds)) {
    const actual = Number(current[metric]);
    if (Number.isFinite(actual) && Number.isFinite(Number(threshold)) && actual > Number(threshold)) {
      breaches.push({ metric, threshold: Number(threshold), actual });
    }
  }
  return {
    evaluationId: randomUUID(),
    assetId: payload.assetId || 'unknown',
    status: breaches.length ? 'breached' : 'healthy',
    breaches,
    evaluatedBy: actorFrom(user),
    evaluatedAt: nowIso(),
  };
}

export function evaluateAnomaly(payload = {}, user = {}) {
  const baseline = payload.baseline || {};
  const current = payload.current || {};
  const tolerance = Number(payload.tolerancePct || 25);
  const findings = [];
  for (const [metric, baselineValue] of Object.entries(baseline)) {
    const currentValue = Number(current[metric]);
    const base = Number(baselineValue);
    if (!Number.isFinite(base) || !Number.isFinite(currentValue) || base === 0) continue;
    const deltaPct = Math.round(((currentValue - base) / base) * 1000) / 10;
    if (Math.abs(deltaPct) >= tolerance) {
      findings.push({ metric, baseline: base, current: currentValue, deltaPct });
    }
  }
  let severity = 'low';
  if (findings.length > 2) {
    severity = 'high';
  } else if (findings.length) {
    severity = 'medium';
  }

  return {
    anomalyId: randomUUID(),
    assetId: payload.assetId || 'unknown',
    severity,
    findings,
    evaluatedBy: actorFrom(user),
    evaluatedAt: nowIso(),
  };
}

export function detectSchemaChange(payload = {}, user = {}) {
  const before = new Map(asArray(payload.beforeColumns).map((col) => [col.name || col.column, col]));
  const after = new Map(asArray(payload.afterColumns).map((col) => [col.name || col.column, col]));
  const added = [...after.keys()].filter((name) => !before.has(name));
  const removed = [...before.keys()].filter((name) => !after.has(name));
  const changed = [...after.entries()]
    .filter(([name, col]) => before.has(name) && before.get(name).type !== col.type)
    .map(([name, col]) => ({ name, beforeType: before.get(name).type, afterType: col.type }));

  return {
    changeId: randomUUID(),
    assetId: payload.assetId || 'unknown',
    breaking: removed.length > 0 || changed.length > 0,
    changes: { added, removed, changed },
    migrationGuide: [
      removed.length ? 'Review downstream consumers before removing columns.' : null,
      changed.length ? 'Publish type-change notes and validate BI semantic models.' : null,
      added.length ? 'Classify and document new columns before certification.' : null,
    ].filter(Boolean),
    detectedBy: actorFrom(user),
    detectedAt: nowIso(),
  };
}

export function createIncident(payload = {}, user = {}) {
  const actor = actorFrom(user);
  const incident = {
    incidentId: randomUUID(),
    assetId: payload.assetId || null,
    title: payload.title || 'Governance incident',
    severity: payload.severity || 'medium',
    status: 'open',
    description: payload.description || '',
    impact: payload.impact || '',
    owner: payload.owner || actor.email || actor.userId,
    rootCause: null,
    communications: [],
    createdBy: actor,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    events: [],
  };
  addEvent(incident, 'created', actor);
  incidentStore.set(incident.incidentId, incident);
  recordOpsEvent('governance.incident.created', { incidentId: incident.incidentId, assetId: incident.assetId }, actor);
  persistGovernanceOpsState();
  return incident;
}

export function listIncidents(filters = {}) {
  let incidents = [...incidentStore.values()];
  if (filters.status) incidents = incidents.filter((incident) => incident.status === filters.status);
  if (filters.assetId) incidents = incidents.filter((incident) => incident.assetId === filters.assetId);
  if (filters.minSeverity) {
    incidents = incidents.filter(
      (incident) => severityRank(incident.severity) >= severityRank(filters.minSeverity)
    );
  }
  return incidents.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function transitionIncident(incidentId, payload = {}, user = {}) {
  const incident = incidentStore.get(incidentId);
  if (!incident) return null;
  if (!INCIDENT_STATUSES.has(payload.status)) {
    throw new Error(`Unsupported incident status '${payload.status}'`);
  }
  const actor = actorFrom(user);
  incident.status = payload.status;
  incident.rootCause = payload.rootCause || incident.rootCause;
  incident.updatedAt = nowIso();
  addEvent(incident, 'transitioned', actor, { status: payload.status, note: payload.note || null });
  recordOpsEvent('governance.incident.transitioned', { incidentId, status: payload.status }, actor);
  persistGovernanceOpsState();
  return incident;
}

export function addIncidentCommunication(incidentId, payload = {}, user = {}) {
  const incident = incidentStore.get(incidentId);
  if (!incident) return null;
  const communication = {
    communicationId: randomUUID(),
    channel: payload.channel || 'status-page',
    audience: payload.audience || 'data-consumers',
    message: payload.message || '',
    sentBy: actorFrom(user),
    sentAt: nowIso(),
  };
  incident.communications.push(communication);
  incident.updatedAt = nowIso();
  recordOpsEvent(
    'governance.incident.communication',
    { incidentId, communicationId: communication.communicationId },
    communication.sentBy
  );
  persistGovernanceOpsState();
  return communication;
}

export function assessChangeRisk(payload = {}, objects = new Map(), lineageGraph = new Map()) {
  const assetId = payload.assetId || payload.focusObject;
  const asset = findAsset(assetId, objects) || {};
  const counts = lineageCounts(assetId, lineageGraph);
  const trust = computeTrustScore(asset);
  const changeTypes = asArray(payload.changeTypes || payload.changeType);
  const riskFactors = [];

  if (counts.downstream >= 10) riskFactors.push('high downstream dependency count');
  if (changeTypes.some((type) => ['drop_column', 'type_change', 'rename'].includes(type))) {
    riskFactors.push('potentially breaking schema change');
  }
  if (trust.certified) riskFactors.push('certified asset requires governance review');
  if (asset.sensitivity || asset.classification) riskFactors.push('classified or sensitive data');

  const score = Math.min(100, counts.downstream * 5 + riskFactors.length * 20);
  let tier = 'low';
  if (score >= 75) {
    tier = 'critical';
  } else if (score >= 50) {
    tier = 'high';
  } else if (score >= 25) {
    tier = 'medium';
  }

  return {
    assessmentId: randomUUID(),
    assetId,
    assetName: assetDisplay(asset),
    riskTier: tier,
    riskScore: score,
    downstreamCount: counts.downstream,
    upstreamCount: counts.upstream,
    riskFactors,
    approvalRequired: tier === 'critical' || tier === 'high',
    reviewers: ['data-steward', 'data-owner', ...(trust.certified ? ['governance-council'] : [])],
    checklist: [
      'Validate downstream consumer inventory',
      'Publish impact notice',
      'Attach rollback or remediation plan',
      'Record approval decision',
    ],
  };
}

export function resolveGovernanceQuestion(query = '', objects = new Map()) {
  const normalized = query.toLowerCase();
  const matches = [...objects.entries()]
    .filter(([id, asset]) => {
      const haystack = [id, asset?.name, asset?.qualifiedName, asset?.description, ...(asset?.tags || [])]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return normalized
        .split(/\s+/)
        .filter((term) => term.length > 2)
        .some((term) => haystack.includes(term));
    })
    .slice(0, 25)
    .map(([id, asset]) => ({
      assetId: id,
      name: assetDisplay(asset),
      type: asset.object_type || asset.type || 'object',
      owner: asset.owner || 'unknown',
      trust: computeTrustScore(asset),
    }));

  return {
    query,
    answer:
      matches.length === 0
        ? 'No matching governed assets were found in the local catalog cache.'
        : `Found ${matches.length} governed asset match${matches.length === 1 ? '' : 'es'} for this question.`,
    matches,
  };
}

export function createGlossaryReview(payload = {}, user = {}) {
  const review = {
    reviewId: randomUUID(),
    termId: payload.termId || payload.term || 'unknown',
    action: payload.action || 'review',
    status: 'pending',
    proposal: payload.proposal || {},
    requestedBy: actorFrom(user),
    requestedAt: nowIso(),
    decision: null,
  };
  glossaryReviewStore.set(review.reviewId, review);
  recordOpsEvent('governance.glossary.review_requested', { reviewId: review.reviewId, termId: review.termId }, review.requestedBy);
  persistGovernanceOpsState();
  return review;
}

export function decideGlossaryReview(reviewId, payload = {}, user = {}) {
  const review = glossaryReviewStore.get(reviewId);
  if (!review) return null;
  review.status = payload.decision === 'approve' ? 'approved' : 'rejected';
  review.decision = {
    decision: payload.decision,
    notes: payload.notes || '',
    decidedBy: actorFrom(user),
    decidedAt: nowIso(),
  };
  recordOpsEvent('governance.glossary.review_decided', { reviewId, status: review.status }, review.decision.decidedBy);
  persistGovernanceOpsState();
  return review;
}

export function buildGlossaryHealth(terms = []) {
  const list = Array.isArray(terms) ? terms : [];
  const total = list.length;
  const withDefinition = list.filter((term) => hasValue(term.definition)).length;
  const withOwner = list.filter((term) => hasValue(term.owner) || hasValue(term.steward)).length;
  const pendingReviews = [...glossaryReviewStore.values()].filter((review) => review.status === 'pending')
    .length;
  return {
    totalTerms: total,
    definitionCoveragePct: total ? Math.round((withDefinition / total) * 100) : 0,
    ownershipCoveragePct: total ? Math.round((withOwner / total) * 100) : 0,
    pendingReviews,
  };
}

export function certifyAsset(assetId, payload = {}, user = {}) {
  const action = {
    actionId: randomUUID(),
    assetId,
    action: 'certified',
    level: payload.level || 'certified',
    expiresAt: payload.expiresAt || null,
    notes: payload.notes || '',
    actor: actorFrom(user),
    at: nowIso(),
  };
  if (!trustActionStore.has(assetId)) trustActionStore.set(assetId, []);
  trustActionStore.get(assetId).push(action);
  recordOpsEvent('governance.trust.certified', { assetId, actionId: action.actionId }, action.actor);
  persistGovernanceOpsState();
  return action;
}

export function endorseAsset(assetId, payload = {}, user = {}) {
  const action = {
    actionId: randomUUID(),
    assetId,
    action: 'endorsed',
    endorsement: payload.endorsement || 'useful',
    notes: payload.notes || '',
    actor: actorFrom(user),
    at: nowIso(),
  };
  if (!trustActionStore.has(assetId)) trustActionStore.set(assetId, []);
  trustActionStore.get(assetId).push(action);
  recordOpsEvent('governance.trust.endorsed', { assetId, actionId: action.actionId }, action.actor);
  persistGovernanceOpsState();
  return action;
}

export function getTrustActions(assetId) {
  return trustActionStore.get(assetId) || [];
}

export function buildKpis(objects = new Map(), lineageGraph = new Map()) {
  const total = objects.size;
  const trustScores = computeAllTrustScores(objects);
  const withOwner = [...objects.values()].filter((asset) => hasValue(asset.owner)).length;
  const withLineage = [...objects.keys()].filter((id) => lineageCounts(id, lineageGraph).upstream > 0).length;
  const openTasks = listGovernanceTasks({ status: 'open' }).length;
  const openIncidents = listIncidents({ status: 'open' }).length;
  const avgTrust = total
    ? Math.round([...trustScores.values()].reduce((sum, trust) => sum + trust.score, 0) / total)
    : 0;

  return {
    totalAssets: total,
    averageTrustScore: avgTrust,
    ownershipCoveragePct: total ? Math.round((withOwner / total) * 100) : 0,
    lineageCoveragePct: total ? Math.round((withLineage / total) * 100) : 0,
    openTasks,
    openIncidents,
    usageEvents: usageEvents.length,
  };
}

export function calculateRoi(payload = {}) {
  const avoidedIncidents = Number(payload.avoidedIncidents || 0);
  const hoursSaved = Number(payload.hoursSaved || 0);
  const hourlyRate = Number(payload.hourlyRate || 125);
  const incidentCost = Number(payload.incidentCost || 25000);
  const platformCost = Number(payload.platformCost || 0);
  const value = avoidedIncidents * incidentCost + hoursSaved * hourlyRate;
  return {
    value,
    platformCost,
    netValue: value - platformCost,
    roiPct: platformCost ? Math.round(((value - platformCost) / platformCost) * 100) : null,
    assumptions: { avoidedIncidents, hoursSaved, hourlyRate, incidentCost },
  };
}

export function recordPublicationCheck(name, payload = {}) {
  const check = {
    name,
    status: payload.status || 'unknown',
    detail: payload.detail || '',
    checkedAt: nowIso(),
  };
  publicationChecks.set(name, check);
  recordOpsEvent('governance.publication.check_recorded', { name, status: check.status });
  persistGovernanceOpsState();
  return check;
}

export function buildPublicationStatus(objects = new Map(), lineageGraph = new Map()) {
  const kpis = buildKpis(objects, lineageGraph);
  const required = ['catalog-refresh', 'runtime-package', 'devops-publish', 'answer-quality'];
  const checks = required.map(
    (name) =>
      publicationChecks.get(name) || {
        name,
        status: 'not_checked',
        detail: 'No publication check has been recorded in this app session.',
      }
  );
  const ready = checks.every((check) => check.status === 'pass') && kpis.totalAssets > 0;
  return { ready, checks, kpis };
}

export function buildGovernanceOpsOverview(objects = new Map(), lineageGraph = new Map(), terms = []) {
  return {
    kpis: buildKpis(objects, lineageGraph),
    glossaryHealth: buildGlossaryHealth(terms),
    openTasks: listGovernanceTasks({ status: 'open' }).slice(0, 10),
    openIncidents: listIncidents({ status: 'open' }).slice(0, 10),
    adoptionLeaders: buildAdoptionScorecards(objects, lineageGraph).slice(0, 10),
    retirementCandidates: recommendRetirementCandidates(objects, lineageGraph).slice(0, 10),
    publication: buildPublicationStatus(objects, lineageGraph),
  };
}

export function listGovernanceOpsEventDeliveries(options = {}) {
  const limit = Number(options.limit || 100);
  return eventDeliveryStore.slice(-limit).reverse();
}

loadGovernanceOpsState();

export default {
  clearGovernanceOps,
  persistGovernanceOpsState,
  loadGovernanceOpsState,
  setGovernanceOpsStorePath,
  exportGovernanceOpsState,
  importGovernanceOpsState,
  getGovernanceOpsStoreStatus,
  createGovernanceTask,
  listGovernanceTasks,
  transitionGovernanceTask,
  generateStewardshipTasks,
  addAssetComment,
  listAssetComments,
  recordDecision,
  listDecisions,
  recordUsageEvent,
  buildUsageAnalytics,
  buildAdoptionScorecards,
  recommendRetirementCandidates,
  evaluateServiceLevel,
  evaluateAnomaly,
  detectSchemaChange,
  createIncident,
  listIncidents,
  transitionIncident,
  addIncidentCommunication,
  assessChangeRisk,
  resolveGovernanceQuestion,
  createGlossaryReview,
  decideGlossaryReview,
  buildGlossaryHealth,
  certifyAsset,
  endorseAsset,
  getTrustActions,
  buildKpis,
  calculateRoi,
  recordPublicationCheck,
  buildPublicationStatus,
  buildGovernanceOpsOverview,
  listGovernanceOpsEventDeliveries,
};
