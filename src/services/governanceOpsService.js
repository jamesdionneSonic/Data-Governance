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
export const OWNERSHIP_ROLES = Object.freeze({
  owner: {
    label: 'Business Owner',
    responsibility: 'Owns business purpose, criticality, certification decisions, and funding accountability.',
    escalationRank: 2,
  },
  steward: {
    label: 'Technical Steward',
    responsibility: 'Maintains definitions, metadata completeness, lineage evidence, quality triage, and day-to-day governance tasks.',
    escalationRank: 1,
  },
  domain_manager: {
    label: 'Domain Manager',
    responsibility: 'Resolves escalations across a domain and approves ownership gaps or cross-team conflicts.',
    escalationRank: 3,
  },
  custodian: {
    label: 'Data Custodian',
    responsibility: 'Owns platform operations, access controls, storage posture, and source-system coordination.',
    escalationRank: 0,
  },
});

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

function normalizeIdentity(value) {
  return hasValue(value) ? String(value).trim() : null;
}

function assetParentCandidates(asset = {}) {
  return asArray(
    asset.parent_asset_id ||
      asset.parentAssetId ||
      asset.parent ||
      asset.database ||
      asset.schema_id ||
      asset.schema
  ).filter(Boolean);
}

function resolveParentAsset(asset = {}, objects = new Map()) {
  const candidates = assetParentCandidates(asset);
  for (const candidate of candidates) {
    if (objects.has(candidate)) return { id: candidate, asset: objects.get(candidate) };
  }
  const database = asset.database || asset.database_name;
  const schema = asset.schema || asset.schema_name;
  const fallbackIds = [
    database && schema ? `${database}.${schema}` : null,
    database ? String(database) : null,
  ].filter(Boolean);
  for (const candidate of fallbackIds) {
    if (objects.has(candidate)) return { id: candidate, asset: objects.get(candidate) };
  }
  return null;
}

function roleValue(asset = {}, role) {
  return normalizeIdentity(asset[role] || asset?.ownership?.[role]);
}

function resolveOwnership(asset = {}, objects = new Map(), depth = 0, visited = new Set()) {
  const assetId = asset?.id || asset?.qualifiedName || asset?.name || `asset-${depth}`;
  const roles = {};
  const inherited = [];
  for (const role of Object.keys(OWNERSHIP_ROLES)) {
    const direct = roleValue(asset, role);
    if (direct) {
      roles[role] = {
        value: direct,
        source: 'direct',
        sourceAssetId: assetId,
      };
    }
  }
  if (Object.keys(roles).length === Object.keys(OWNERSHIP_ROLES).length || depth >= 5) {
    return { roles, inherited, complete: Object.keys(roles).length === Object.keys(OWNERSHIP_ROLES).length };
  }
  if (assetId) visited.add(String(assetId));
  const parent = resolveParentAsset(asset, objects);
  if (parent && !visited.has(String(parent.id))) {
    const parentOwnership = resolveOwnership({ ...parent.asset, id: parent.id }, objects, depth + 1, visited);
    for (const [role, assignment] of Object.entries(parentOwnership.roles)) {
      if (!roles[role]) {
        roles[role] = {
          ...assignment,
          source: 'inherited',
          inheritedFrom: parent.id,
        };
        inherited.push({ role, from: parent.id, value: assignment.value });
      }
    }
  }
  return { roles, inherited, complete: Object.keys(roles).length === Object.keys(OWNERSHIP_ROLES).length };
}

function ownershipEscalationChain(ownership = {}) {
  return Object.entries(ownership.roles || {})
    .map(([role, assignment]) => ({
      role,
      label: OWNERSHIP_ROLES[role]?.label || role,
      assignee: assignment.value,
      source: assignment.source,
      inheritedFrom: assignment.inheritedFrom || null,
      responsibility: OWNERSHIP_ROLES[role]?.responsibility || '',
      escalationRank: OWNERSHIP_ROLES[role]?.escalationRank || 0,
    }))
    .sort((a, b) => a.escalationRank - b.escalationRank);
}

function taskSla(task = {}, now = new Date()) {
  const due = task.dueAt ? new Date(task.dueAt) : null;
  if (!due || !Number.isFinite(due.getTime()) || ['done', 'canceled'].includes(task.status)) {
    return { status: 'not_tracked', daysRemaining: null, overdue: false };
  }
  const diffDays = Math.ceil((due.getTime() - now.getTime()) / 86_400_000);
  return {
    status: diffDays < 0 ? 'breached' : diffDays <= 2 ? 'at_risk' : 'healthy',
    daysRemaining: diffDays,
    overdue: diffDays < 0,
  };
}

function assignmentOwnerForAsset(asset = {}, objects = new Map()) {
  const ownership = resolveOwnership(asset, objects);
  return (
    ownership.roles.steward?.value ||
    ownership.roles.owner?.value ||
    ownership.roles.domain_manager?.value ||
    ownership.roles.custodian?.value ||
    'unassigned'
  );
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
  const dueDays = Number(payload.dueDays || (payload.priority === 'critical' ? 2 : payload.priority === 'high' ? 5 : 14));
  const dueAt = payload.dueAt || new Date(Date.now() + dueDays * 86_400_000).toISOString();
  const task = {
    taskId: randomUUID(),
    assetId: payload.assetId || null,
    type: payload.type || 'stewardship',
    title: payload.title || 'Governance task',
    description: payload.description || '',
    priority: payload.priority || 'medium',
    status: 'open',
    owner: payload.owner || actor.email || actor.userId,
    assigneeRole: payload.assigneeRole || null,
    escalationTo: payload.escalationTo || null,
    dueAt,
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
  if (filters.assignee) tasks = tasks.filter((task) => task.owner === filters.assignee);
  if (filters.type) tasks = tasks.filter((task) => task.type === filters.type);
  return tasks
    .map((task) => ({ ...task, sla: taskSla(task) }))
    .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
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
    const assetType = String(asset.object_type || asset.type || '').toLowerCase();
    const needsSensitivity = ['table', 'view', 'column', 'dataset', 'report', 'dashboard'].includes(assetType);
    if (needsSensitivity && !hasValue(asset.sensitivity) && !hasValue(asset.classification)) gaps.push('sensitivity');
    if (gaps.length === 0) continue;

    const type = 'metadata_completion';
    const dedupeKey = `${id}:${type}:open`;
    if (existingKeys.has(dedupeKey)) continue;
    const ownership = resolveOwnership({ ...asset, id }, objects);
    const owner = assignmentOwnerForAsset({ ...asset, id }, objects);
    const escalation = ownershipEscalationChain(ownership);

    generated.push(
      createGovernanceTask(
        {
          assetId: id,
          type,
          title: `Complete governance metadata for ${assetDisplay(asset)}`,
          description: `Missing fields: ${gaps.join(', ')}`,
          priority: gaps.includes('owner') || gaps.includes('steward') ? 'high' : 'medium',
          owner,
          assigneeRole: ownership.roles.steward ? 'steward' : ownership.roles.owner ? 'owner' : null,
          escalationTo: escalation.at(-1)?.assignee || null,
          tags: ['phase-7', 'stewardship', ...gaps],
          evidence: [
            ...gaps.map((gap) => ({ gap })),
            ...ownership.inherited.map((item) => ({ inherited_role: item.role, from: item.from })),
          ],
        },
        user
      )
    );
    existingKeys.add(dedupeKey);
  }
  return { count: generated.length, tasks: generated };
}

export function getOwnershipRoleModel() {
  return Object.entries(OWNERSHIP_ROLES).map(([role, config]) => ({
    role,
    ...config,
  }));
}

export function buildOwnershipSummary(objects = new Map()) {
  const total = objects.size;
  const roleCounts = Object.fromEntries(Object.keys(OWNERSHIP_ROLES).map((role) => [role, 0]));
  const inheritedCounts = Object.fromEntries(Object.keys(OWNERSHIP_ROLES).map((role) => [role, 0]));
  const gaps = [];
  const assignments = [];
  for (const [id, asset] of objects.entries()) {
    const ownership = resolveOwnership({ ...asset, id }, objects);
    const chain = ownershipEscalationChain(ownership);
    for (const role of Object.keys(OWNERSHIP_ROLES)) {
      if (ownership.roles[role]) roleCounts[role] += 1;
      if (ownership.roles[role]?.source === 'inherited') inheritedCounts[role] += 1;
    }
    const missing = Object.keys(OWNERSHIP_ROLES).filter((role) => !ownership.roles[role]);
    if (missing.length) gaps.push({ assetId: id, name: assetDisplay(asset), missing, suggestedOwner: assignmentOwnerForAsset({ ...asset, id }, objects) });
    assignments.push({
      assetId: id,
      name: assetDisplay(asset),
      type: asset.object_type || asset.type || 'object',
      roles: ownership.roles,
      inherited: ownership.inherited,
      escalationChain: chain,
      complete: missing.length === 0,
    });
  }
  return {
    totalAssets: total,
    coverage: Object.fromEntries(
      Object.entries(roleCounts).map(([role, count]) => [
        role,
        {
          count,
          inherited: inheritedCounts[role],
          pct: total ? Math.round((count / total) * 100) : 0,
        },
      ])
    ),
    completeAssets: assignments.filter((item) => item.complete).length,
    gapCount: gaps.length,
    gaps: gaps.slice(0, 100),
    assignments: assignments.slice(0, 250),
  };
}

export function buildStewardPortfolio(objects = new Map(), lineageGraph = new Map(), subject = '', options = {}) {
  const normalized = String(subject || '').toLowerCase();
  const includeAll = !normalized || normalized === 'all';
  const assets = [];
  for (const [id, asset] of objects.entries()) {
    const ownership = resolveOwnership({ ...asset, id }, objects);
    const roleMatches = Object.entries(ownership.roles || {}).filter(([, assignment]) =>
      includeAll ? true : String(assignment.value || '').toLowerCase() === normalized
    );
    if (!roleMatches.length) continue;
    const counts = lineageCounts(id, lineageGraph);
    const trust = computeTrustScore(asset);
    const openTasks = listGovernanceTasks({ assetId: id }).filter((task) => !['done', 'canceled'].includes(task.status));
    const missing = Object.keys(OWNERSHIP_ROLES).filter((role) => !ownership.roles[role]);
    if (!hasValue(asset.description)) missing.push('description');
    if (asArray(asset.tags).length === 0) missing.push('tags');
    if (!hasValue(asset.sensitivity) && !hasValue(asset.classification)) missing.push('sensitivity');
    assets.push({
      assetId: id,
      name: assetDisplay(asset),
      type: asset.object_type || asset.type || 'object',
      roles: roleMatches.map(([role]) => role),
      ownership,
      trust,
      downstreamCount: counts.downstream,
      upstreamCount: counts.upstream,
      openTaskCount: openTasks.length,
      overdueTaskCount: openTasks.filter((task) => task.sla?.overdue).length,
      metadataGaps: [...new Set(missing)],
      qualityStatus: trust.score >= 75 ? 'healthy' : trust.score >= 50 ? 'watch' : 'needs_attention',
    });
  }
  const tasks = listGovernanceTasks({ owner: includeAll ? undefined : subject })
    .filter((task) => !['done', 'canceled'].includes(task.status))
    .slice(0, Number(options.taskLimit || 50));
  return {
    subject: subject || 'all',
    totalAssets: assets.length,
    healthyAssets: assets.filter((asset) => asset.qualityStatus === 'healthy').length,
    assetsAtRisk: assets.filter((asset) => asset.qualityStatus !== 'healthy' || asset.metadataGaps.length).length,
    openTasks: tasks.length,
    overdueTasks: tasks.filter((task) => task.sla?.overdue).length,
    alerts: assets
      .filter((asset) => asset.metadataGaps.length || asset.overdueTaskCount)
      .slice(0, 50)
      .map((asset) => ({
        assetId: asset.assetId,
        severity: asset.overdueTaskCount ? 'high' : asset.metadataGaps.includes('owner') || asset.metadataGaps.includes('steward') ? 'high' : 'medium',
        message: asset.overdueTaskCount
          ? `${asset.overdueTaskCount} overdue stewardship task(s).`
          : `Metadata gaps: ${asset.metadataGaps.join(', ')}.`,
      })),
    assets: assets.slice(0, Number(options.assetLimit || 100)),
    tasks,
  };
}

export function planBulkOwnershipAssignment(payload = {}, objects = new Map(), user = {}) {
  const assetIds = asArray(payload.assetIds || payload.assets || payload.asset_id);
  const filters = payload.filters || {};
  const matchedIds = assetIds.length
    ? assetIds
    : [...objects.entries()]
        .filter(([, asset]) => !filters.database || asset.database === filters.database)
        .filter(([, asset]) => !filters.domain || asset.business_domain === filters.domain)
        .filter(([, asset]) => !filters.type || asset.type === filters.type || asset.object_type === filters.type)
        .map(([id]) => id);
  const assignments = {
    owner: normalizeIdentity(payload.owner),
    steward: normalizeIdentity(payload.steward),
    domain_manager: normalizeIdentity(payload.domain_manager),
    custodian: normalizeIdentity(payload.custodian),
  };
  const setRoles = Object.entries(assignments).filter(([, value]) => value);
  const changes = matchedIds
    .filter((id) => objects.has(id))
    .map((id) => {
      const asset = objects.get(id);
      return {
        assetId: id,
        name: assetDisplay(asset),
        before: Object.fromEntries(Object.keys(OWNERSHIP_ROLES).map((role) => [role, roleValue(asset, role)])),
        after: Object.fromEntries(setRoles.map(([role, value]) => [role, value])),
      };
    });
  const task = payload.createTask === false || changes.length === 0
    ? null
    : createGovernanceTask(
        {
          assetId: changes.length === 1 ? changes[0].assetId : null,
          type: 'bulk_ownership_assignment',
          title: `Apply ownership assignment to ${changes.length} asset${changes.length === 1 ? '' : 's'}`,
          description: setRoles.map(([role, value]) => `${role}: ${value}`).join('; '),
          priority: 'high',
          owner: setRoles.find(([role]) => role === 'steward')?.[1] || setRoles[0]?.[1],
          tags: ['phase-7', 'ownership', 'bulk-assignment'],
          evidence: changes.map((change) => ({ assetId: change.assetId, before: change.before, after: change.after })),
        },
        user
      );
  return {
    count: changes.length,
    roles: Object.fromEntries(setRoles),
    changes,
    task,
    markdownWriteRequired: true,
    note: 'This endpoint creates an auditable assignment plan. Apply changes through the markdown metadata write path or catalog repo workflow.',
  };
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
  const withSteward = [...objects.values()].filter((asset) => hasValue(asset.steward)).length;
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
    stewardshipCoveragePct: total ? Math.round((withSteward / total) * 100) : 0,
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
  const ownership = buildOwnershipSummary(objects);
  return {
    kpis: buildKpis(objects, lineageGraph),
    ownership,
    glossaryHealth: buildGlossaryHealth(terms),
    stewardPortfolio: buildStewardPortfolio(objects, lineageGraph, 'all', { assetLimit: 10, taskLimit: 10 }),
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
  getOwnershipRoleModel,
  buildOwnershipSummary,
  buildStewardPortfolio,
  planBulkOwnershipAssignment,
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
