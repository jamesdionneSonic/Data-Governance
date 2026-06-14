/**
 * Discovery Service
 * Provides insights and recommendations for data exploration
 */

import { getTrendingObjects, getCriticalObjects, getSearchStatistics } from './searchService.js';
import { getLineageStats } from './lineageService.js';

/**
 * Get discovery dashboard summary
 * High-level overview of data landscape
 * @param {Map} objects - Object metadata map
 * @param {Map} lineageGraph - Lineage graph
 * @returns {Object} Dashboard summary
 */
export function getDashboardSummary(objects, lineageGraph) {
  const searchStats = getSearchStatistics(objects, lineageGraph);
  const lineageStats = getLineageStats(lineageGraph);

  return {
    timestamp: new Date().toISOString(),
    overview: {
      totalObjects: searchStats.totalObjects,
      totalDatabases: Object.keys(searchStats.objectsByDatabase).length,
      totalTypes: Object.keys(searchStats.objectsByType).length,
      totalDependencies: searchStats.totalDependencies,
      connectivity: searchStats.objectsWithDependencies,
      orphanObjects: searchStats.orphanObjects,
    },
    distribution: {
      byDatabase: searchStats.objectsByDatabase,
      byType: searchStats.objectsByType,
    },
    metrics: {
      avgDependenciesPerObject: searchStats.avgDependenciesPerObject,
      maxDependencies: lineageStats.maxDependencies,
      networkDensity: (
        searchStats.totalDependencies /
        (searchStats.totalObjects * (searchStats.totalObjects - 1))
      ).toFixed(4),
    },
  };
}

/**
 * Get recommendations for data discovery
 * Suggests where to start exploring
 * @param {Map} objects - Object metadata map
 * @param {Map} lineageGraph - Lineage graph
 * @returns {Object} Recommendations
 */
export function getRecommendations(objects, lineageGraph) {
  const trending = getTrendingObjects(objects, lineageGraph, 5);
  const critical = getCriticalObjects(objects, lineageGraph, 5);

  return {
    recommended: {
      trending: {
        title: 'Most Referenced Objects',
        description: 'Objects that many other objects depend on',
        items: trending,
      },
      critical: {
        title: 'Most Critical Objects',
        description: 'Objects with the highest downstream impact',
        items: critical,
      },
      newData: {
        title: 'Recently Added',
        description: 'New objects added to the system',
        items: Array.from(objects.values())
          .sort((a, b) => {
            const bTime = new Date(b.createdAt || b.created_at || b.last_updated || 0).getTime();
            const aTime = new Date(a.createdAt || a.created_at || a.last_updated || 0).getTime();
            return bTime - aTime;
          })
          .slice(0, 5)
          .map((obj) => ({
            id: obj.id,
            name: obj.name,
            database: obj.database,
            type: obj.type,
            description: obj.description || '',
            owner: obj.owner || null,
            sensitivity: obj.sensitivity || null,
            createdAt: obj.createdAt || obj.created_at || obj.last_updated || null,
          })),
      },
    },
  };
}

/**
 * Get insights about data lineage
 * @param {Map} objects - Object metadata map
 * @param {Map} lineageGraph - Lineage graph
 * @returns {Object} Lineage insights
 */
export function getLineageInsights(objects, lineageGraph) {
  const insights = [];

  // Check for complex dependency chains
  const longChains = [];
  for (const [objId] of lineageGraph) {
    let depth = 0;
    let current = objId;
    const visited = new Set();

    while (current && depth < 50) {
      const deps = lineageGraph.get(current) || new Set();
      if (deps.size === 0) break;

      const firstDep = Array.from(deps)[0];
      if (visited.has(firstDep)) break; // Circular dependency

      current = firstDep;
      depth += 1;
      visited.add(firstDep);
    }

    if (depth >= 5) {
      longChains.push({
        objectId: objId,
        depth,
        object: objects.get(objId),
      });
    }
  }

  if (longChains.length > 0) {
    insights.push({
      type: 'warning',
      title: 'Complex Dependency Chains',
      description: `${longChains.length} object(s) have deep dependency chains (5+ levels)`,
      severity: 'medium',
      items: longChains.slice(0, 3),
    });
  }

  // Check for highly connected central objects
  const highlyConnected = getCriticalObjects(objects, lineageGraph, 3);
  if (highlyConnected.length > 0 && highlyConnected[0].impactCount > 10) {
    insights.push({
      type: 'info',
      title: 'Highly Connected Objects',
      description: 'These objects are dependencies for many other objects',
      severity: 'info',
      items: highlyConnected,
    });
  }

  // Check for orphaned objects
  const orphans = Array.from(objects.values())
    .filter((obj) => {
      const deps = lineageGraph.get(obj.id) || new Set();
      return deps.size === 0;
    })
    .slice(0, 5);

  if (orphans.length > 0) {
    insights.push({
      type: 'notice',
      title: 'Orphaned Objects',
      description: `${orphans.length} object(s) have no dependencies and may be unused`,
      severity: 'low',
      items: orphans.map((obj) => ({
        id: obj.id,
        name: obj.name,
        database: obj.database,
      })),
    });
  }

  return { insights };
}

/**
 * Get data quality metrics
 * @param {Map} objects - Object metadata map
 * @param {Map} lineageGraph - Lineage graph
 * @returns {Object} Quality metrics
 */
export function getQualityMetrics(objects, _lineageGraph) {
  const objectList = Array.from(objects.values());
  const total = objects.size;
  const safePct = (count) => (total > 0 ? Math.round((count / total) * 1000) / 10 : 0);
  const hasText = (value) => String(value || '').trim().length > 0;
  const hasArray = (value) => Array.isArray(value) && value.length > 0;
  const isKnown = (value) => {
    const text = String(value || '')
      .trim()
      .toLowerCase();
    return text && !['unknown', 'unassigned', 'n/a', 'none', '-'].includes(text);
  };
  const lineageGraph = _lineageGraph || new Map();
  const downstreamCounts = new Map();
  for (const neighbors of lineageGraph.values()) {
    const values = neighbors instanceof Set ? Array.from(neighbors) : neighbors || [];
    for (const id of values) {
      downstreamCounts.set(id, (downstreamCounts.get(id) || 0) + 1);
    }
  }

  const counts = {
    descriptions: objectList.filter((obj) => hasText(obj.description)).length,
    owners: objectList.filter((obj) => isKnown(obj.owner)).length,
    stewards: objectList.filter((obj) => isKnown(obj.steward)).length,
    tags: objectList.filter((obj) => hasArray(obj.tags)).length,
    sensitivity: objectList.filter((obj) => isKnown(obj.sensitivity)).length,
    lineage: objectList.filter((obj) => {
      const upstream = lineageGraph.get(obj.id);
      const upstreamCount =
        upstream instanceof Set ? upstream.size : Array.isArray(upstream) ? upstream.length : 0;
      return (
        upstreamCount > 0 ||
        (downstreamCounts.get(obj.id) || 0) > 0 ||
        obj.upstreamCount > 0 ||
        obj.downstreamCount > 0
      );
    }).length,
    glossary: objectList.filter(
      (obj) =>
        hasArray(obj.glossary_terms) || hasArray(obj.semantic_terms) || hasArray(obj.business_terms)
    ).length,
    certified: objectList.filter((obj) => obj.certified === true || isKnown(obj.trust_level))
      .length,
  };

  const signals = [
    {
      key: 'descriptions',
      label: 'Descriptions',
      count: counts.descriptions,
      total,
      percentage: safePct(counts.descriptions),
      threshold: 70,
      category: 'completeness',
    },
    {
      key: 'owners',
      label: 'Owners',
      count: counts.owners,
      total,
      percentage: safePct(counts.owners),
      threshold: 70,
      category: 'stewardship',
    },
    {
      key: 'stewards',
      label: 'Stewards',
      count: counts.stewards,
      total,
      percentage: safePct(counts.stewards),
      threshold: 50,
      category: 'stewardship',
    },
    {
      key: 'tags',
      label: 'Tags',
      count: counts.tags,
      total,
      percentage: safePct(counts.tags),
      threshold: 50,
      category: 'classification',
    },
    {
      key: 'sensitivity',
      label: 'Sensitivity',
      count: counts.sensitivity,
      total,
      percentage: safePct(counts.sensitivity),
      threshold: 80,
      category: 'classification',
    },
    {
      key: 'lineage',
      label: 'Lineage',
      count: counts.lineage,
      total,
      percentage: safePct(counts.lineage),
      threshold: 50,
      category: 'lineage',
    },
    {
      key: 'glossary',
      label: 'Business Terms',
      count: counts.glossary,
      total,
      percentage: safePct(counts.glossary),
      threshold: 20,
      category: 'semantic',
    },
    {
      key: 'certified',
      label: 'Trust Signals',
      count: counts.certified,
      total,
      percentage: safePct(counts.certified),
      threshold: 30,
      category: 'trust',
    },
  ].map((signal) => ({
    ...signal,
    value: `${signal.count}/${signal.total}`,
    status: signal.percentage >= signal.threshold ? 'good' : 'warning',
    passing: signal.percentage >= signal.threshold,
  }));

  const score =
    signals.length > 0
      ? Math.round(signals.reduce((sum, signal) => sum + signal.percentage, 0) / signals.length)
      : 0;

  const checks = Object.fromEntries(signals.map((signal) => [signal.key, signal.passing]));
  const metrics = {
    completeness: {
      title: 'Metadata Completeness',
      checks: signals.filter((signal) => ['descriptions', 'tags'].includes(signal.key)),
    },
    consistency: {
      title: 'Data Consistency',
      checks: [],
    },
    stewardship: {
      title: 'Ownership & Stewardship',
      checks: signals.filter((signal) => ['owners', 'stewards'].includes(signal.key)),
    },
    governance: {
      title: 'Governance Signals',
      checks: signals.filter((signal) =>
        ['sensitivity', 'lineage', 'glossary', 'certified'].includes(signal.key)
      ),
    },
  };

  // Check sensitivity classification
  const sensitivities = new Map();
  for (const obj of objectList) {
    sensitivities.set(
      obj.sensitivity || 'unknown',
      (sensitivities.get(obj.sensitivity || 'unknown') || 0) + 1
    );
  }

  metrics.consistency.checks.push({
    name: 'Sensitivity Distribution',
    value: Object.fromEntries(sensitivities),
    status: sensitivities.has('public') ? 'good' : 'warning',
  });

  return {
    score,
    checks,
    signals,
    summary: {
      total_objects: total,
      passing_checks: signals.filter((signal) => signal.passing).length,
      warning_checks: signals.filter((signal) => !signal.passing).length,
    },
    ...metrics,
  };
}

/**
 * Get recent activity summary
 * @param {Map} objects - Object metadata map
 * @returns {Object} Activity summary
 */
export function getActivitySummary(objects) {
  const now = new Date();
  const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

  const thisWeek = Array.from(objects.values()).filter((obj) => obj.createdAt >= oneWeekAgo).length;
  const thisMonth = Array.from(objects.values()).filter(
    (obj) => obj.createdAt >= oneMonthAgo
  ).length;

  return {
    period: {
      week: {
        label: 'This Week',
        count: thisWeek,
      },
      month: {
        label: 'This Month',
        count: thisMonth,
      },
    },
  };
}

export default {
  getDashboardSummary,
  getRecommendations,
  getLineageInsights,
  getQualityMetrics,
  getActivitySummary,
};
