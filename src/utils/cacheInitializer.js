import { setObjectsCache } from '../services/objectCacheStore.js';
import { setSearchCache } from '../api/search.js';
import { setDiscoveryCache } from '../api/discovery.js';
import { setAdminCache } from '../api/admin.js';
import { setDashboardCache } from '../api/dashboard.js';
import { setReportingCache } from '../api/reporting.js';
import { setIntegrationCache } from '../api/integrations.js';
import { setMarketplaceCache } from '../api/marketplace.js';
import { setClassificationCache } from '../api/classification.js';
import { setGovernanceCache } from '../api/governance.js';
import { setGlossaryCache } from '../api/glossary.js';
import { setQualityCache } from '../api/quality.js';
import { setCatalogRuntime, setRuntimeLineageGraph } from '../services/catalogRuntimeStore.js';

function normalizeObjects(input) {
  if (input instanceof Map) return input;

  if (Array.isArray(input)) {
    return new Map(
      input
        .filter((obj) => obj && typeof obj === 'object')
        .map((obj) => [obj.id || `${obj.database || 'unknown'}.${obj.name || 'unknown'}`, obj])
    );
  }

  if (input && typeof input === 'object') {
    return new Map(Object.entries(input));
  }

  return new Map();
}

function normalizeLineageGraph(input) {
  if (input instanceof Map) return input;
  if (!input || typeof input !== 'object') return new Map();

  const graph = new Map();
  for (const [id, neighbors] of Object.entries(input)) {
    const normalizedNeighbors =
      neighbors instanceof Set ? neighbors : new Set(Array.isArray(neighbors) ? neighbors : []);
    graph.set(id, normalizedNeighbors);
  }
  return graph;
}

export function initializeCache(...args) {
  const firstArgLooksLikeApp = args[0] && typeof args[0].use === 'function';
  const objects = normalizeObjects(firstArgLooksLikeApp ? args[1] : args[0]);
  const lineageGraph = normalizeLineageGraph(firstArgLooksLikeApp ? args[2] : args[1]);
  const runtime = firstArgLooksLikeApp ? args[3] : args[2];

  const downstreamCounts = new Map();
  for (const id of objects.keys()) {
    downstreamCounts.set(id, 0);
  }

  for (const neighbors of lineageGraph.values()) {
    for (const neighborId of neighbors) {
      downstreamCounts.set(neighborId, (downstreamCounts.get(neighborId) || 0) + 1);
    }
  }

  // Compute cross-file metric totals inside memory in O(nodes + edges).
  for (const [id, obj] of objects.entries()) {
    const deps = lineageGraph.get(id) || new Set();
    obj.upstreamCount = deps.size;
    obj.downstreamCount = downstreamCounts.get(id) || 0;
  }

  setObjectsCache(objects);
  setRuntimeLineageGraph(lineageGraph);
  setCatalogRuntime(runtime || {});
  setSearchCache(objects);
  setDiscoveryCache(objects, lineageGraph);
  setAdminCache(objects);
  setDashboardCache(objects);
  setReportingCache(objects, lineageGraph);
  setIntegrationCache(objects, lineageGraph);
  setMarketplaceCache(objects);
  setClassificationCache(objects);
  setGovernanceCache(objects, lineageGraph);
  setGlossaryCache(objects);
  setQualityCache(objects);
}

export default initializeCache;
