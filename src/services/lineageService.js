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
  const nameIndex = buildNameIndex(objects);
  const referenceIndex = buildReferenceIndex(objects);

  // Initialize graph with all objects and build a flexible lookup index
  for (const [objectId, metadata] of objects) {
    graph.set(objectId, new Set());
    if (metadata.name) {
      nameIndex.set(metadata.name.toLowerCase(), objectId);
    }
  }

  // Add edges for dependencies
  for (const [objectId, metadata] of objects) {
    if (metadata.depends_on && Array.isArray(metadata.depends_on)) {
      for (const dependency of metadata.depends_on) {
        const depId = resolveObjectId(dependency, metadata, objects, nameIndex, referenceIndex);
        if (depId) {
          graph.get(objectId).add(depId);
        }
      }
    }

    // Make writes_to/calls resolve back to the emitting object so downstream graphs stay connected.
    const forwardEdges = [
      ...(Array.isArray(metadata.writes_to) ? metadata.writes_to : []),
      ...(Array.isArray(metadata.calls) ? metadata.calls : []),
    ];

    if (forwardEdges.length > 0) {
      for (const target of forwardEdges) {
        const targetId = resolveObjectId(target, metadata, objects, nameIndex, referenceIndex);
        if (targetId && graph.has(targetId)) {
          graph.get(targetId).add(objectId);
        }
      }
    }
  }

  return graph;
}

function buildNameIndex(objects) {
  const nameIndex = new Map();
  for (const [objectId, metadata] of objects) {
    if (metadata.name) {
      nameIndex.set(metadata.name.toLowerCase(), objectId);
    }
    if (metadata.packageName) {
      nameIndex.set(metadata.packageName.toLowerCase(), objectId);
    }
    if (metadata.packagePath) {
      nameIndex.set(metadata.packagePath.toLowerCase(), objectId);
    }
    if (metadata.schema && metadata.name) {
      nameIndex.set(`${metadata.schema}.${metadata.name}`.toLowerCase(), objectId);
    }
    nameIndex.set(objectId.toLowerCase(), objectId);
  }
  return nameIndex;
}

function buildReferenceIndex(objects) {
  const referenceIndex = new Map();
  for (const [objectId, metadata] of objects) {
    const references = new Set([
      objectId,
      metadata.name,
      metadata.packageName,
      metadata.packagePath,
      metadata.database && metadata.name ? `${metadata.database}.${metadata.name}` : null,
      metadata.database && metadata.packageName
        ? `${metadata.database}.${metadata.packageName}`
        : null,
      metadata.database && metadata.packagePath
        ? `${metadata.database}.${metadata.packagePath}`
        : null,
      metadata.schema && metadata.name ? `${metadata.schema}.${metadata.name}` : null,
      metadata.database && metadata.schema && metadata.name
        ? `${metadata.database}.${metadata.schema}.${metadata.name}`
        : null,
    ]);

    for (const reference of references) {
      const normalized = normalizeReference(reference);
      if (normalized) {
        referenceIndex.set(normalized, objectId);
      }
    }
  }
  return referenceIndex;
}

function normalizeReference(reference) {
  const cleaned = String(reference || '')
    .trim()
    .replace(/\[|\]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/^dbo\./i, '')
    .replace(/^SSIS\//i, '')
    .replace(/^Project\.ConnectionManagers\[/i, '')
    .replace(/\]$/i, '')
    .replace(/^[."']+|[."']+$/g, '')
    .trim();

  if (!cleaned) return '';

  const parts = cleaned.split('.').filter(Boolean);
  if (parts[0] && /^unknown_db$/i.test(parts[0])) {
    return parts.slice(1).join('.') || parts[parts.length - 1] || cleaned;
  }

  return cleaned;
}

function resolveObjectId(reference, metadata, objects, nameIndex, referenceIndex) {
  const ref = String(reference || '').trim();
  if (!ref) return null;

  const unwrapped = normalizeReference(ref);
  const lowerRef = unwrapped.toLowerCase();
  const tokens = unwrapped.split('.').filter(Boolean);
  const tail = tokens[tokens.length - 1] || '';
  const coreTail = tokens.length > 1 ? tokens.slice(-2).join('.') : tail;
  const strippedTail = unwrapped.replace(/^unknown_db\./i, '');

  const candidates = [
    ref,
    unwrapped,
    strippedTail,
    tail,
    coreTail,
    `${metadata.database}.${ref}`,
    `${metadata.database}.${unwrapped}`,
    `${metadata.database}.${strippedTail}`,
    metadata.schema ? `${metadata.database}.${metadata.schema}.${tail}` : null,
    metadata.database && metadata.schema
      ? `${metadata.database}.${metadata.schema}.${coreTail}`
      : null,
  ].filter(Boolean);

  for (const candidate of candidates) {
    if (objects.has(candidate)) return candidate;
    const indexed = nameIndex.get(candidate.toLowerCase());
    if (indexed) return indexed;
    const refIndexed = referenceIndex.get(normalizeReference(candidate).toLowerCase());
    if (refIndexed) return refIndexed;
  }

  if (referenceIndex.has(lowerRef)) return referenceIndex.get(lowerRef);

  return null;
}

/**
 * Build typed lineage edges from explicit markdown fields.
 * @param {Map} objects - Map of object ID -> metadata
 * @returns {Array} Edges with source, target, and relationship type
 */
export function buildTypedLineageEdges(objects) {
  const edges = [];
  const nameIndex = buildNameIndex(objects);
  const referenceIndex = buildReferenceIndex(objects);

  const pushResolvedEdges = (objectId, metadata, references, direction, type) => {
    if (!Array.isArray(references)) return;
    for (const reference of references) {
      const resolvedId = resolveObjectId(reference, metadata, objects, nameIndex, referenceIndex);
      if (!resolvedId || resolvedId === objectId) continue;

      edges.push({
        source: direction === 'incoming' ? resolvedId : objectId,
        target: direction === 'incoming' ? objectId : resolvedId,
        type,
      });
    }
  };

  for (const [objectId, metadata] of objects) {
    pushResolvedEdges(objectId, metadata, metadata.reads_from, 'incoming', 'reads');
    // FIX 3: Tell the visualizer to include SSIS 'depends_on' as an 'extracts' edge!
    pushResolvedEdges(objectId, metadata, metadata.depends_on, 'incoming', 'extracts');
    pushResolvedEdges(objectId, metadata, metadata.writes_to, 'outgoing', 'loads');
    pushResolvedEdges(objectId, metadata, metadata.calls, 'outgoing', 'calls');
  }

  return edges;
}

/**
 * Return typed edges near a focus object.
 */
export function getTypedLineageNeighborhood(objectId, objects, maxDepth = 2) {
  const edges = buildTypedLineageEdges(objects);
  const includedNodes = new Set([objectId]);
  const includedEdges = [];
  let frontier = new Set([objectId]);

  for (let depth = 0; depth < maxDepth; depth += 1) {
    const nextFrontier = new Set();

    for (const edge of edges) {
      if (!frontier.has(edge.source) && !frontier.has(edge.target)) continue;

      includedEdges.push(edge);
      if (!includedNodes.has(edge.source)) {
        includedNodes.add(edge.source);
        nextFrontier.add(edge.source);
      }
      if (!includedNodes.has(edge.target)) {
        includedNodes.add(edge.target);
        nextFrontier.add(edge.target);
      }
    }

    frontier = nextFrontier;
    if (frontier.size === 0) break;
  }

  const uniqueEdges = Array.from(
    new Map(
      includedEdges.map((edge) => [`${edge.source}->${edge.target}:${edge.type}`, edge])
    ).values()
  );

  return {
    nodes: includedNodes,
    edges: uniqueEdges,
  };
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

    if (visited.has(id) || depth >= maxDepth) {
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

    if (visited.has(id) || depth >= maxDepth) {
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

  const avgDependencies =
    objectsWithDependencies > 0 ? totalDependencies / objectsWithDependencies : 0;

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
