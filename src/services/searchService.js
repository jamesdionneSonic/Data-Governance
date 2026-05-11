/**
 * Search Service
 * Integrates Meilisearch, lineage, and metadata for advanced discovery
 */

import { searchObjects, facetedSearch } from './indexService.js';
import { getUpstreamDependencies, getDownstreamDependents } from './lineageService.js';

/**
 * Execute enhanced search with lineage information
 * @param {string} indexName - Meilisearch index name
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @param {Map} lineageGraph - Lineage graph (optional)
 * @param {Map} objects - Object metadata map (optional)
 * @returns {Promise} Enhanced search results with lineage
 */
export async function enhancedSearch(
  indexName,
  query,
  options = {},
  lineageGraph = null,
  objects = null
) {
  try {
    // Execute base search
    const searchResults = await searchObjects(indexName, query, options);

    // Enhance results with lineage if available
    if (lineageGraph && objects) {
      const enhanced = searchResults.hits.map((hit) => {
        const upstream = getUpstreamDependencies(hit.id, lineageGraph);
        const downstream = getDownstreamDependents(hit.id, lineageGraph);

        return {
          ...hit,
          dependencies: {
            upstream: upstream.slice(0, 5), // Limit to top 5
            downstream: downstream.slice(0, 5),
            totalUpstream: upstream.length,
            totalDownstream: downstream.length,
          },
        };
      });

      searchResults.hits = enhanced;
    }

    return searchResults;
  } catch (err) {
    console.error('Enhanced search failed:', err.message);
    throw err;
  }
}

/**
 * Faceted search with lineage context
 * @param {string} indexName - Index name
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @param {Map} lineageGraph - Lineage graph
 * @param {Map} objects - Object metadata map
 * @returns {Promise} Faceted results with lineage
 */
export async function enhancedFacetedSearch(
  indexName,
  query,
  options = {},
  lineageGraph = null,
  objects = null
) {
  try {
    const results = await facetedSearch(indexName, query, options);

    // Enhance with lineage
    if (lineageGraph && objects) {
      results.hits = results.hits.map((hit) => {
        const upstream = getUpstreamDependencies(hit.id, lineageGraph);
        const downstream = getDownstreamDependents(hit.id, lineageGraph);

        return {
          ...hit,
          dependencies: {
            upstream: upstream.slice(0, 5),
            downstream: downstream.slice(0, 5),
            totalUpstream: upstream.length,
            totalDownstream: downstream.length,
          },
        };
      });
    }

    return results;
  } catch (err) {
    console.error('Enhanced faceted search failed:', err.message);
    throw err;
  }
}

/**
 * Search by lineage proximity
 * Find objects related to a source object through dependencies
 * @param {string} objectId - Source object ID
 * @param {string} direction - 'upstream' | 'downstream'
 * @param {number} depth - How many levels to traverse
 * @param {Map} lineageGraph - Lineage graph
 * @param {Map} objects - Object metadata map
 * @returns {Array} Related objects
 */
export function searchByProximity(objectId, direction, depth, lineageGraph, objects) {
  try {
    let relatedIds = [];

    if (direction === 'upstream') {
      relatedIds = getUpstreamDependencies(objectId, lineageGraph, depth);
    } else if (direction === 'downstream') {
      relatedIds = getDownstreamDependents(objectId, lineageGraph, depth);
    }

    // Map to full objects
    const related = relatedIds
      .map((id) => objects.get(id))
      .filter((obj) => !!obj)
      .map((obj) => ({
        id: obj.id,
        name: obj.name,
        database: obj.database,
        type: obj.type,
        owner: obj.owner,
        description: obj.description,
      }));

    return related;
  } catch (err) {
    console.error('Proximity search failed:', err.message);
    throw err;
  }
}

/**
 * Get object suggestions for autocomplete
 * @param {string} prefix - Search prefix
 * @param {Map} objects - Object metadata map
 * @param {number} limit - Max suggestions
 * @returns {Array} Matching object suggestions
 */
export function getSuggestions(prefix, objects, limit = 10) {
  const suggestions = [];
  const prefixLower = prefix.toLowerCase();

  for (const [, obj] of objects) {
    if (obj.name.toLowerCase().startsWith(prefixLower)) {
      suggestions.push({
        id: obj.id,
        name: obj.name,
        database: obj.database,
        type: obj.type,
      });

      if (suggestions.length >= limit) {
        break;
      }
    }
  }

  return suggestions;
}

/**
 * Get trending objects (most referenced)
 * @param {Map} objects - Object metadata map
 * @param {Map} lineageGraph - Lineage graph
 * @param {number} limit - Number of results
 * @returns {Array} Most referenced objects
 */
export function getTrendingObjects(objects, lineageGraph, limit = 10) {
  const referenceCount = new Map();

  // Count how many objects depend on each object (incoming references)
  for (const [, dependencies] of lineageGraph) {
    for (const depId of dependencies) {
      referenceCount.set(depId, (referenceCount.get(depId) || 0) + 1);
    }
  }

  // Sort by reference count
  const trending = Array.from(referenceCount.entries())
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, limit)
    .map(([objectId, refCount]) => {
      const obj = objects.get(objectId);
      return {
        id: objectId,
        name: obj.name,
        database: obj.database,
        type: obj.type,
        owner: obj.owner,
        referencedByCount: refCount,
      };
    });

  return trending;
}

/**
 * Get critical objects (highest impact)
 * Objects with most downstream dependents
 * @param {Map} objects - Object metadata map
 * @param {Map} lineageGraph - Lineage graph
 * @param {number} limit - Number of results
 * @returns {Array} Most critical objects
 */
export function getCriticalObjects(objects, lineageGraph, limit = 10) {
  const impactCounts = new Map();

  // For each object, count downstream dependents
  for (const [objectId] of lineageGraph) {
    const downstream = getDownstreamDependents(objectId, lineageGraph);
    impactCounts.set(objectId, downstream.length);
  }

  // Sort by impact (downstream count)
  const critical = Array.from(impactCounts.entries())
    .filter(([, count]) => count > 0) // Only objects with dependents
    .sort(([, countA], [, countB]) => countB - countA)
    .slice(0, limit)
    .map(([objectId, impactCount]) => {
      const obj = objects.get(objectId);
      return {
        id: objectId,
        name: obj.name,
        database: obj.database,
        type: obj.type,
        owner: obj.owner,
        impactCount, // Number of downstream dependents
      };
    });

  return critical;
}

/**
 * Search statistics
 * @param {Map} objects - Object metadata map
 * @param {Map} lineageGraph - Lineage graph
 * @returns {Object} Search statistics
 */
export function getSearchStatistics(objects, lineageGraph) {
  const stats = {
    totalObjects: objects.size,
    totalDependencies: 0,
    objectsByDatabase: {},
    objectsByType: {},
    objectsWithDependencies: 0,
    orphanObjects: 0,
  };

  for (const [objectId, obj] of objects) {
    const deps = lineageGraph.get(objectId) || new Set();

    // Count dependencies
    stats.totalDependencies += deps.size;

    // Count by database
    if (!stats.objectsByDatabase[obj.database]) {
      stats.objectsByDatabase[obj.database] = 0;
    }
    stats.objectsByDatabase[obj.database] += 1;

    // Count by type
    if (!stats.objectsByType[obj.type]) {
      stats.objectsByType[obj.type] = 0;
    }
    stats.objectsByType[obj.type] += 1;

    // Count objects with dependencies
    if (deps.size > 0) {
      stats.objectsWithDependencies += 1;
    } else {
      stats.orphanObjects += 1;
    }
  }

  stats.avgDependenciesPerObject =
    stats.objectsWithDependencies > 0
      ? (stats.totalDependencies / stats.objectsWithDependencies).toFixed(2)
      : 0;

  return stats;
}

export default {
  enhancedSearch,
  enhancedFacetedSearch,
  searchByProximity,
  getSuggestions,
  getTrendingObjects,
  getCriticalObjects,
  getSearchStatistics,
};
