/**
 * Lineage Service
 * Builds and queries data lineage dependency graphs
 */

/**
 * Build lineage graph from object dependencies
 * @param {Map} objects - Map of object ID -> metadata
 * @returns {Map} Lineage graph (object ID -> set of dependencies)
 */
export function buildLineageGraph(objects) {
  const graph = new Map();

  // Initialize graph with all objects
  for (const objectId of objects.keys()) {
    graph.set(objectId, new Set());
  }

  // Add edges for dependencies
  for (const [objectId, metadata] of objects) {
    if (metadata.depends_on && Array.isArray(metadata.depends_on)) {
      for (const dependency of metadata.depends_on) {
        // Parse dependency if it's in format "database.object"
        const depId = dependency.includes('.') ? dependency : `${metadata.database}.${dependency}`;

        if (graph.has(depId)) {
          graph.get(objectId).add(depId);
        }
      }
    }
  }

  return graph;
}

/**
 * Get all upstream dependencies (things this object depends on)
 * @param {string} objectId - Object ID
 * @param {Map} graph - Lineage graph
 * @param {number} maxDepth - Maximum depth to traverse
 * @returns {Array} Array of upstream object IDs
 */
export function getUpstreamDependencies(objectId, graph, maxDepth = 10) {
  const upstream = new Set();
  const visited = new Set();
  const queue = [{ id: objectId, depth: 0 }];

  while (queue.length > 0) {
    const { id, depth } = queue.shift();

    if (visited.has(id) || depth > maxDepth) {
      continue;
    }

    visited.add(id);

    const dependencies = graph.get(id) || new Set();

    for (const depId of dependencies) {
      upstream.add(depId);

      if (depth < maxDepth) {
        queue.push({ id: depId, depth: depth + 1 });
      }
    }
  }

  return Array.from(upstream);
}

/**
 * Get all downstream dependents (things that depend on this object)
 * @param {string} objectId - Object ID
 * @param {Map} graph - Lineage graph
 * @param {number} maxDepth - Maximum depth to traverse
 * @returns {Array} Array of downstream object IDs
 */
export function getDownstreamDependents(objectId, graph, maxDepth = 10) {
  // Build reverse graph (dependents -> dependencies)
  const reverseGraph = new Map();

  for (const [id, deps] of graph) {
    if (!reverseGraph.has(id)) {
      reverseGraph.set(id, new Set());
    }

    for (const depId of deps) {
      if (!reverseGraph.has(depId)) {
        reverseGraph.set(depId, new Set());
      }
      reverseGraph.get(depId).add(id);
    }
  }

  const downstream = new Set();
  const visited = new Set();
  const queue = [{ id: objectId, depth: 0 }];

  while (queue.length > 0) {
    const { id, depth } = queue.shift();

    if (visited.has(id) || depth > maxDepth) {
      continue;
    }

    visited.add(id);

    const dependents = reverseGraph.get(id) || new Set();

    for (const depId of dependents) {
      downstream.add(depId);

      if (depth < maxDepth) {
        queue.push({ id: depId, depth: depth + 1 });
      }
    }
  }

  return Array.from(downstream);
}

/**
 * Analyze impact of changes to an object
 * Shows all affected downstream objects at different distances
 * @param {string} objectId - Object ID
 * @param {Map} graph - Lineage graph
 * @param {Map} objects - Object metadata map
 * @returns {Object} Impact analysis
 */
export function analyzeImpact(objectId, graph, _objects) {
  const impactByRadius = {
    direct: [],
    twoHops: [],
    threeOrMore: [],
  };

  // Build reverse graph
  const reverseGraph = new Map();

  for (const [id, deps] of graph) {
    if (!reverseGraph.has(id)) {
      reverseGraph.set(id, new Set());
    }

    for (const depId of deps) {
      if (!reverseGraph.has(depId)) {
        reverseGraph.set(depId, new Set());
      }
      reverseGraph.get(depId).add(id);
    }
  }

  // BFS to find impact radius for each dependent
  const visited = new Map(); // object ID -> distance
  const queue = [{ id: objectId, distance: 0 }];

  while (queue.length > 0) {
    const { id, distance } = queue.shift();

    if (visited.has(id)) {
      continue;
    }

    visited.set(id, distance);

    const dependents = reverseGraph.get(id) || new Set();

    for (const depId of dependents) {
      if (!visited.has(depId)) {
        queue.push({ id: depId, distance: distance + 1 });
      }
    }
  }

  // Categorize by distance
  for (const [id, distance] of visited) {
    if (id === objectId) {
      continue; // Skip the source object
    }

    if (distance === 1) {
      impactByRadius.direct.push(id);
    } else if (distance === 2) {
      impactByRadius.twoHops.push(id);
    } else {
      impactByRadius.threeOrMore.push(id);
    }
  }

  return {
    objectId,
    totalAffected: visited.size - 1,
    ...impactByRadius,
  };
}

/**
 * Find circular dependencies in lineage
 * @param {Map} graph - Lineage graph
 * @returns {Array} Array of circular dependency cycles
 */
export function findCircularDependencies(graph) {
  const visited = new Set();
  const recStack = new Set();
  const cycles = [];

  function hasCycle(nodeId, path = []) {
    visited.add(nodeId);
    recStack.add(nodeId);
    path.push(nodeId);

    const neighbors = graph.get(nodeId) || new Set();

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor)) {
        if (hasCycle(neighbor, [...path])) {
          return true;
        }
      } else if (recStack.has(neighbor)) {
        // Found a cycle - extract it
        const cycleStart = path.indexOf(neighbor);
        if (cycleStart !== -1) {
          const cycle = path.slice(cycleStart).concat(neighbor);
          cycles.push(cycle);
        }
        return true;
      }
    }

    recStack.delete(nodeId);
    return false;
  }

  for (const nodeId of graph.keys()) {
    if (!visited.has(nodeId)) {
      hasCycle(nodeId, []);
    }
  }

  return cycles;
}

/**
 * Get lineage statistics
 * @param {Map} graph - Lineage graph
 * @returns {Object} Statistics
 */
export function getLineageStats(graph) {
  let totalDependencies = 0;
  let objectsWithDependencies = 0;
  let maxDependencies = 0;

  for (const [, deps] of graph) {
    if (deps.size > 0) {
      objectsWithDependencies += 1;
      totalDependencies += deps.size;
      maxDependencies = Math.max(maxDependencies, deps.size);
    }
  }

  const avgDependencies = objectsWithDependencies > 0
    ? totalDependencies / objectsWithDependencies
    : 0;

  return {
    totalObjects: graph.size,
    objectsWithDependencies,
    totalDependencies,
    averageDependencies: avgDependencies.toFixed(2),
    maxDependencies,
  };
}

export default {
  buildLineageGraph,
  getUpstreamDependencies,
  getDownstreamDependents,
  analyzeImpact,
  findCircularDependencies,
  getLineageStats,
};
