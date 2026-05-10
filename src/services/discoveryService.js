/**
 * Discovery Service
 * Provides insights and recommendations for data exploration
 */

import {
  getTrendingObjects,
  getCriticalObjects,
  getSearchStatistics,
} from './searchService.js';
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
        searchStats.totalDependencies
        / (searchStats.totalObjects * (searchStats.totalObjects - 1))
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
          .sort((a, b) => b.createdAt - a.createdAt)
          .slice(0, 5)
          .map((obj) => ({
            id: obj.id,
            name: obj.name,
            database: obj.database,
            type: obj.type,
            createdAt: obj.createdAt,
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
  const metrics = {
    completeness: {
      title: 'Metadata Completeness',
      checks: [],
    },
    consistency: {
      title: 'Data Consistency',
      checks: [],
    },
  };

  // Check for objects with descriptions
  const withDescription = Array.from(objects.values()).filter((obj) => obj.description).length;
  const descriptionRate = ((withDescription / objects.size) * 100).toFixed(1);

  metrics.completeness.checks.push({
    name: 'Objects with Descriptions',
    value: `${withDescription}/${objects.size}`,
    percentage: parseFloat(descriptionRate),
    status: descriptionRate >= 80 ? 'good' : 'warning',
  });

  // Check for objects with tags
  const withTags = Array.from(objects.values()).filter((obj) => obj.tags && obj.tags.length > 0)
    .length;
  const tagRate = ((withTags / objects.size) * 100).toFixed(1);

  metrics.completeness.checks.push({
    name: 'Objects with Tags',
    value: `${withTags}/${objects.size}`,
    percentage: parseFloat(tagRate),
    status: tagRate >= 60 ? 'good' : 'warning',
  });

  // Check sensitivity classification
  const sensitivities = new Map();
  for (const obj of objects.values()) {
    sensitivities.set(obj.sensitivity, (sensitivities.get(obj.sensitivity) || 0) + 1);
  }

  metrics.consistency.checks.push({
    name: 'Sensitivity Distribution',
    value: Object.fromEntries(sensitivities),
    status: sensitivities.has('public') ? 'good' : 'warning',
  });

  return metrics;
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

  const thisWeek = Array.from(objects.values()).filter(
    (obj) => obj.createdAt >= oneWeekAgo,
  ).length;
  const thisMonth = Array.from(objects.values()).filter(
    (obj) => obj.createdAt >= oneMonthAgo,
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
