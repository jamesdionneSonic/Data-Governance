/**
 * Visualization Service
 * Transforms data lineage into graph formats for visualization
 * Supports Cytoscape.js, D3.js, and Mermaid
 */

import {
  getUpstreamDependencies,
  getDownstreamDependents,
  analyzeImpact,
  getTypedLineageNeighborhood,
  buildTypedLineageEdges,
} from './lineageService.js';

/**
 * Build Cytoscape.js graph format
 * https://js.cytoscape.org/
 */
export function buildCytoscapeGraph(objectId, lineageGraph, objects, depth = 2) {
  const nodes = [];
  const edges = [];
  const seenNodes = new Set();
  const seenEdges = new Set();
  const typedEdges = buildTypedLineageEdges(objects);
  const renderEdges = typedEdges.length > 0 ? typedEdges : buildFallbackLineageEdges(lineageGraph);
  const frontier = [{ id: objectId, depth: 0 }];
  const visited = new Set([objectId]);
  const edgeLabelByType = {
    depends_on: 'depends_on',
    reads: 'reads',
    extracts: 'extracts',
    loads: 'loads',
    calls: 'calls',
    created_by: 'created_by',
    created_via: 'created_via',
    contextual_read: 'contextual_read',
    used_by: 'used_by',
  };

  const addNode = (id, nodeType, level) => {
    if (!id || seenNodes.has(id)) return;
    const obj = objects.get(id);
    if (!obj) return;
    nodes.push({
      data: {
        id,
        label: obj.name || id,
        database: obj.database,
        type: obj.type,
        sensitivity: obj.sensitivity,
        nodeType,
        level,
      },
      classes: [nodeType, `type-${obj.type}`, `sensitivity-${obj.sensitivity}`],
    });
    seenNodes.add(id);
  };

  const addEdge = (source, target, label, classes) => {
    if (!source || !target || source === target) return;
    const key = `${source}->${target}:${label}`;
    if (seenEdges.has(key)) return;
    edges.push({
      data: {
        id: key.replace(/[^a-zA-Z0-9_-]/g, '_'),
        source,
        target,
        label,
      },
      classes,
    });
    seenEdges.add(key);
  };

  const edgeNeighbors = (id) =>
    renderEdges
      .filter((edge) => edge.source === id || edge.target === id)
      .map((edge) => ({
        nextId: edge.source === id ? edge.target : edge.source,
        edge,
        direction: edge.source === id ? 'outgoing' : 'incoming',
      }));

  addNode(objectId, 'central', 0);

  while (frontier.length > 0) {
    const current = frontier.shift();
    if (!current || current.depth >= depth) continue;

    const neighbors = edgeNeighbors(current.id);
    for (const { nextId, edge, direction } of neighbors) {
      const nextDepth = current.depth + 1;
      const obj = objects.get(nextId);
      if (!obj) continue;

      const objType = String(obj.type || '').toLowerCase();
      const isTransformProcess = ['procedure', 'function', 'package'].includes(objType);
      let nodeType = 'downstream';
      if (nextId === objectId) {
        nodeType = 'central';
      } else if (isTransformProcess) {
        nodeType = objType;
      } else if (direction === 'incoming') {
        nodeType = 'upstream';
      }
      addNode(nextId, nodeType, direction === 'incoming' ? -nextDepth : nextDepth);

      const edgeClass =
        edge.type === 'loads' || edge.type === 'reads' || edge.type === 'extracts'
          ? 'producer-edge'
          : 'consumer-edge';
      addEdge(
        direction === 'incoming' ? nextId : current.id,
        direction === 'incoming' ? current.id : nextId,
        edgeLabelByType[edge.type] || edge.type || 'lineage',
        [edgeClass]
      );

      if (!visited.has(nextId)) {
        visited.add(nextId);
        frontier.push({ id: nextId, depth: nextDepth });
      }
    }
  }

  return { nodes, edges };
}

/**
 * Build a strict, centered lineage graph.
 * This intentionally avoids broad neighborhood crawling: direct builders sit
 * left of the focus object, direct consumers sit right of it, and SSIS/staging
 * bridge chains are included only when they support a direct builder.
 */
export function buildCenteredLineageGraph(objectId, objects, options = {}) {
  const focusObj = objects.get(objectId);
  const typedEdges = buildTypedLineageEdges(objects);
  const nodes = [];
  const edges = [];
  const seenNodes = new Set();
  const seenEdges = new Set();
  const laneCounts = new Map();
  const includeSsisGroup = options.groupSsis !== false;
  const maxBridgeDepth = Math.max(1, Number(options.maxBridgeDepth) || 3);
  const focusType = String(focusObj?.type || '').toLowerCase();
  const focusStem = normalizeToken(focusObj?.name || objectId);
  const ssisGroupId = 'group:ssis-producers';
  let ssisPackageCount = 0;

  const isDataFocus = ['table', 'view', 'synonym'].includes(focusType);

  const nextPosition = (lane) => {
    const key = String(lane);
    const index = laneCounts.get(key) || 0;
    laneCounts.set(key, index + 1);
    return {
      x: 720 + lane * 280,
      y: 120 + index * 112,
    };
  };

  const objectLabel = (id) => {
    const obj = objects.get(id);
    if (!obj) return id;
    if (obj.type === 'package') {
      return (
        obj.packageName ||
        String(obj.name || id)
          .split('.')
          .pop()
      );
    }
    if (obj.schema && obj.name && obj.schema !== 'dbo') {
      return `${obj.schema}.${obj.name}`;
    }
    return obj.name || id;
  };

  const addNode = (id, nodeType, lane, extraData = {}) => {
    if (!id || seenNodes.has(id)) return;
    const obj = objects.get(id) || {};
    const type = String(extraData.type || obj.type || 'unknown').toLowerCase();
    const data = {
      id,
      label: extraData.label || objectLabel(id),
      database: obj.database || extraData.database || null,
      type,
      sensitivity: obj.sensitivity || 'internal',
      nodeType,
      level: lane,
      lane,
      packageName: obj.packageName || null,
      packagePath: obj.packagePath || null,
      ...extraData,
    };

    if (includeSsisGroup && type === 'package') {
      data.parent = ssisGroupId;
      ssisPackageCount += 1;
    }

    nodes.push({
      data,
      position: extraData.isGroup ? undefined : nextPosition(lane),
      classes: [nodeType, `type-${type}`, `sensitivity-${data.sensitivity}`],
    });
    seenNodes.add(id);
  };

  const addEdge = (source, target, label, classes = ['lineage-edge'], confidence = 0.95) => {
    if (!source || !target || source === target) return;
    const key = `${source}->${target}:${label}`;
    if (seenEdges.has(key)) return;
    edges.push({
      data: {
        id: key.replace(/[^a-zA-Z0-9_-]/g, '_'),
        source,
        target,
        label,
        confidence,
      },
      classes,
    });
    seenEdges.add(key);
  };

  const isPackage = (id) => String(objects.get(id)?.type || '').toLowerCase() === 'package';
  const isProcess = (id) =>
    ['procedure', 'function'].includes(String(objects.get(id)?.type || '').toLowerCase());
  const isBridgeCandidate = (id) => {
    const obj = objects.get(id);
    if (!obj) return false;
    const type = String(obj.type || '').toLowerCase();
    const database = String(obj.database || '').toLowerCase();
    const idToken = normalizeToken(id);
    const nameToken = normalizeToken(obj.name);

    if (type === 'synonym') return true;
    if (
      database === 'etl_staging' &&
      (idToken.includes(focusStem) || nameToken.includes(focusStem))
    ) {
      return true;
    }
    return false;
  };

  const directIncoming = typedEdges.filter((edge) => edge.target === objectId);
  const directOutgoing = typedEdges.filter((edge) => edge.source === objectId);
  const producerEdges = dedupeEdges(
    isDataFocus
      ? directIncoming.filter((edge) =>
          ['loads', 'reads', 'extracts', 'created_by', 'created_via'].includes(edge.type)
        )
      : directIncoming.filter((edge) => ['reads', 'extracts', 'loads', 'calls'].includes(edge.type))
  );
  const fallbackProducerEdges =
    producerEdges.length > 0 ? producerEdges : dedupeEdges(directIncoming);
  const producerIds = new Set(fallbackProducerEdges.map((edge) => edge.source));

  const consumerEdges = dedupeEdges(
    isDataFocus
      ? directOutgoing.filter(
          (edge) => ['reads', 'extracts'].includes(edge.type) && !producerIds.has(edge.target)
        )
      : directOutgoing.filter((edge) => ['loads', 'calls'].includes(edge.type))
  );

  if (includeSsisGroup) {
    addNode(ssisGroupId, 'package-group', -4, {
      label: 'SSIS Packages',
      type: 'group',
      isGroup: true,
      sensitivity: 'internal',
    });
  }

  addNode(objectId, 'central', 0);
  const bridgeVisited = new Set();

  const addBridgeUpstream = (targetId, depthLeft) => {
    if (bridgeVisited.has(targetId) || depthLeft <= 0) return;
    bridgeVisited.add(targetId);

    const incoming = typedEdges.filter((edge) => edge.target === targetId);
    for (const edge of incoming) {
      const sourceObj = objects.get(edge.source);
      if (!sourceObj || edge.source === objectId) continue;

      if (isPackage(edge.source)) {
        addNode(edge.source, 'ssis-package', -4);
        addEdge(edge.source, targetId, 'loads', ['ssis-load-edge'], 0.9);
        continue;
      }

      if (isProcess(edge.source)) {
        addNode(edge.source, 'upstream-process', -2);
        addEdge(
          edge.source,
          targetId,
          edge.type === 'calls' ? 'calls' : 'loads',
          ['producer-edge'],
          0.85
        );
        continue;
      }

      if (isBridgeCandidate(edge.source)) {
        const lane = String(sourceObj.type || '').toLowerCase() === 'synonym' ? -2 : -3;
        addNode(edge.source, 'bridge', lane);
        addEdge(
          edge.source,
          targetId,
          edge.type === 'extracts' ? 'resolves' : edge.type,
          ['bridge-edge'],
          0.88
        );
        addBridgeUpstream(edge.source, depthLeft - 1);
      }
    }
  };

  const addPackageCallers = (packageId, depthLeft) => {
    if (depthLeft <= 0) return;

    const callers = typedEdges.filter(
      (edge) => edge.target === packageId && edge.type === 'calls' && isPackage(edge.source)
    );

    for (const caller of callers) {
      addNode(caller.source, 'ssis-package', -4);
      addEdge(caller.source, packageId, 'runs', ['ssis-load-edge'], 0.88);
      addPackageCallers(caller.source, depthLeft - 1);
    }
  };

  for (const edge of fallbackProducerEdges) {
    const producerLane = isPackage(edge.source) ? -4 : -1;
    addNode(edge.source, isPackage(edge.source) ? 'ssis-package' : 'producer', producerLane);
    addEdge(
      edge.source,
      objectId,
      edge.type === 'loads' ? 'loads' : edge.type,
      ['producer-edge'],
      0.98
    );

    const producerInputs = typedEdges.filter(
      (candidate) =>
        candidate.target === edge.source &&
        candidate.source !== objectId &&
        ['reads', 'extracts', 'loads', 'calls'].includes(candidate.type)
    );

    for (const input of producerInputs) {
      if (isPackage(input.source)) {
        addNode(input.source, 'ssis-package', -4);
        addEdge(
          input.source,
          edge.source,
          input.type === 'calls' ? 'calls' : input.type,
          ['ssis-load-edge'],
          0.95
        );
        addPackageCallers(input.source, maxBridgeDepth);
        continue;
      }

      const inputObj = objects.get(input.source);
      const inputType = String(inputObj?.type || '').toLowerCase();
      if (['table', 'view'].includes(inputType)) {
        addNode(input.source, 'producer', -1);
        addEdge(
          input.source,
          edge.source,
          input.type === 'extracts' ? 'reads' : input.type,
          ['producer-edge'],
          0.9
        );
        continue;
      }

      if (!isBridgeCandidate(input.source)) continue;
      const lane = inputType === 'synonym' ? -2 : -3;
      addNode(input.source, 'bridge', lane);
      addEdge(
        input.source,
        edge.source,
        input.type === 'extracts' ? 'reads' : input.type,
        ['bridge-edge'],
        0.9
      );
      addBridgeUpstream(input.source, maxBridgeDepth);
    }
  }

  for (const edge of consumerEdges) {
    addNode(edge.target, 'consumer', 1);
    addEdge(objectId, edge.target, 'used by', ['consumer-edge'], 0.92);
  }

  if (includeSsisGroup && ssisPackageCount > 0) {
    const groupNode = nodes.find((node) => node.data.id === ssisGroupId);
    if (groupNode) {
      groupNode.data.label = `SSIS Packages (${ssisPackageCount})`;
    }
  }

  if (includeSsisGroup && ssisPackageCount === 0) {
    const groupIndex = nodes.findIndex((node) => node.data.id === ssisGroupId);
    if (groupIndex >= 0) {
      nodes.splice(groupIndex, 1);
      seenNodes.delete(ssisGroupId);
    }
  }

  return {
    nodes,
    edges,
    meta: {
      mode: 'centered',
      focusObject: objectId,
      directProducers: producerIds.size,
      directConsumers: new Set(consumerEdges.map((edge) => edge.target)).size,
      ssisPackages: ssisPackageCount,
      bridgeNodes: nodes.filter((node) => node.data.nodeType === 'bridge').length,
    },
  };
}

function normalizeToken(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function dedupeEdges(edges) {
  const byPair = new Map();
  const priority = {
    loads: 5,
    calls: 4,
    reads: 3,
    extracts: 2,
  };

  for (const edge of edges) {
    const key = `${edge.source}->${edge.target}`;
    const current = byPair.get(key);
    if (!current || (priority[edge.type] || 0) > (priority[current.type] || 0)) {
      byPair.set(key, edge);
    }
  }

  return Array.from(byPair.values());
}

function buildFallbackLineageEdges(lineageGraph = new Map()) {
  const edges = [];
  const seen = new Set();

  for (const [target, dependencies] of lineageGraph.entries()) {
    for (const source of dependencies || []) {
      if (!source || !target || source === target) continue;
      const key = `${source}->${target}`;
      if (seen.has(key)) continue;
      edges.push({ source, target, type: 'depends_on' });
      seen.add(key);
    }
  }

  return edges;
}

/**
 * Build D3.js force-directed graph format
 * https://d3js.org/
 */
export function buildD3Graph(objectId, lineageGraph, objects, depth = 2) {
  const nodeMap = new Map();
  const links = [];

  const centralObj = objects.get(objectId);
  if (centralObj) {
    nodeMap.set(objectId, {
      id: objectId,
      name: centralObj.name,
      database: centralObj.database,
      type: centralObj.type,
      group: 'central',
      level: 0,
      value: 30,
    });
  }

  const upstream = getUpstreamDependencies(objectId, lineageGraph, depth);
  for (const depId of upstream) {
    const depObj = objects.get(depId);
    if (depObj && !nodeMap.has(depId)) {
      nodeMap.set(depId, {
        id: depId,
        name: depObj.name,
        database: depObj.database,
        type: depObj.type,
        group: 'upstream',
        level: -1,
        value: 20,
      });
    }
    links.push({ source: depId, target: objectId, value: 1, type: 'depends_on' });
  }

  const downstream = getDownstreamDependents(objectId, lineageGraph, depth);
  for (const depId of downstream) {
    const depObj = objects.get(depId);
    if (depObj && !nodeMap.has(depId)) {
      nodeMap.set(depId, {
        id: depId,
        name: depObj.name,
        database: depObj.database,
        type: depObj.type,
        group: 'downstream',
        level: 1,
        value: 20,
      });
    }
    links.push({ source: objectId, target: depId, value: 1, type: 'used_by' });
  }

  return { nodes: Array.from(nodeMap.values()), links };
}

/**
 * Build Mermaid diagram markup
 * https://mermaid.js.org/
 */
export function buildMermaidDiagram(objectId, lineageGraph, objects, depth = 2) {
  let diagram = 'graph TD\n';

  const centralObj = objects.get(objectId);

  const nodeIds = new Map();
  let nodeSequence = 0;

  const safeNodeId = (id) => {
    const key = String(id || 'unknown');
    if (!nodeIds.has(key)) {
      const safeBase = key.replace(/[^a-zA-Z0-9_]/g, '_').replace(/^_+/, '') || 'object';
      nodeIds.set(key, `node_${safeBase}_${nodeSequence}`);
      nodeSequence += 1;
    }
    return nodeIds.get(key);
  };

  const safeLabel = (text) =>
    String(text || 'Unknown')
      .replace(/[\r\n]+/g, ' ')
      .replace(/"/g, "'")
      .trim();

  const nodeLabel = (obj, fallbackId) =>
    `${safeLabel(obj?.name || fallbackId)} (${safeLabel(obj?.type || 'object')})`;

  diagram += `  ${safeNodeId(objectId)}["${nodeLabel(centralObj, objectId)}"]:::central\n`;

  const typedNeighborhood = getTypedLineageNeighborhood(objectId, objects, depth);

  if (typedNeighborhood.edges.length > 0) {
    const MAX_MERMAID_NODES = 40;
    const MAX_MERMAID_EDGES = 60;
    const cappedEdges = typedNeighborhood.edges.slice(0, MAX_MERMAID_EDGES);
    const activeNodeIds = new Set([objectId]);

    cappedEdges.forEach((edge) => {
      activeNodeIds.add(edge.source);
      activeNodeIds.add(edge.target);
    });

    const candidateNodeIds = Array.from(activeNodeIds);
    const priorityNodeIds = [];
    const seenPriority = new Set();

    for (const typedNodeId of candidateNodeIds) {
      const typedObj = objects.get(typedNodeId);
      const nodeType = String(typedObj?.type || '').toLowerCase();
      const nodeId = String(typedNodeId || '').toLowerCase();
      if (nodeType === 'package' || nodeId.startsWith('ssisdb.')) {
        if (!seenPriority.has(typedNodeId)) {
          priorityNodeIds.push(typedNodeId);
          seenPriority.add(typedNodeId);
        }
      }
    }

    for (const typedNodeId of candidateNodeIds) {
      if (priorityNodeIds.length >= MAX_MERMAID_NODES) break;
      if (!seenPriority.has(typedNodeId)) {
        priorityNodeIds.push(typedNodeId);
        seenPriority.add(typedNodeId);
      }
    }

    const trimmedNodeIds = priorityNodeIds.slice(0, MAX_MERMAID_NODES);
    const renderNodeIds = new Set(trimmedNodeIds);

    for (const typedNodeId of renderNodeIds) {
      if (typedNodeId === objectId) continue;
      const typedObj = objects.get(typedNodeId);
      if (!typedObj) continue;

      let nodeClass = 'data';
      if (typedObj.type === 'procedure' || typedObj.type === 'function') nodeClass = 'process';
      if (typedObj.type === 'package') nodeClass = 'ssis';

      diagram += `  ${safeNodeId(typedNodeId)}["${nodeLabel(typedObj, typedNodeId)}"]:::${nodeClass}\n`;
    }

    for (const edge of cappedEdges) {
      if (!renderNodeIds.has(edge.source) || !renderNodeIds.has(edge.target)) {
        continue;
      }
      diagram += `  ${safeNodeId(edge.source)} -->|${edge.type}| ${safeNodeId(edge.target)}\n`;
    }

    diagram += '\n  classDef central fill:#4CAF50,stroke:#333,stroke-width:3px,color:#fff\n';
    diagram += '  classDef data fill:#2196F3,stroke:#333,stroke-width:2px,color:#fff\n';
    diagram += '  classDef process fill:#FF9800,stroke:#333,stroke-width:2px,color:#fff\n';
    diagram += '  classDef ssis fill:#7c3aed,stroke:#333,stroke-width:2px,color:#fff\n';

    return diagram;
  }

  // Fallback for simple edges
  const upstream = getUpstreamDependencies(objectId, lineageGraph, depth);
  for (const depId of upstream.slice(0, 5)) {
    const depObj = objects.get(depId);
    if (depObj) {
      diagram += `  ${safeNodeId(depId)}["${nodeLabel(depObj, depId)}"]:::dependency\n`;
      diagram += `  ${safeNodeId(depId)} -->|depends_on| ${safeNodeId(objectId)}\n`;
    }
  }

  const downstream = getDownstreamDependents(objectId, lineageGraph, depth);
  for (const depId of downstream.slice(0, 5)) {
    const depObj = objects.get(depId);
    if (depObj) {
      diagram += `  ${safeNodeId(depId)}["${nodeLabel(depObj, depId)}"]:::dependent\n`;
      diagram += `  ${safeNodeId(objectId)} -->|used_by| ${safeNodeId(depId)}\n`;
    }
  }

  diagram += '\n  classDef central fill:#4CAF50,stroke:#333,stroke-width:3px,color:#fff\n';
  diagram += '  classDef dependency fill:#2196F3,stroke:#333,stroke-width:2px,color:#fff\n';
  diagram += '  classDef dependent fill:#FF9800,stroke:#333,stroke-width:2px,color:#fff\n';

  return diagram;
}

export function buildImpactVisualization(objectId, lineageGraph, objects) {
  const impact = analyzeImpact(objectId, lineageGraph, objects);

  return {
    source: { id: objectId, ...objects.get(objectId) },
    impact,
    levels: {
      direct: impact.direct.map((id) => ({ id, ...objects.get(id) })),
      twoHops: impact.twoHops.map((id) => ({ id, ...objects.get(id) })),
      threeOrMore: impact.threeOrMore.map((id) => ({ id, ...objects.get(id) })),
    },
    stats: {
      directCount: impact.direct.length,
      twoHopsCount: impact.twoHops.length,
      threeOrMoreCount: impact.threeOrMore.length,
      totalAffected: impact.totalAffected,
    },
  };
}

export function buildDependencyMatrix(database, objects, lineageGraph) {
  const dbObjects = Array.from(objects.values()).filter((obj) => obj.database === database);

  const matrix = {
    database,
    rows: dbObjects.map((obj) => obj.name),
    columns: dbObjects.map((obj) => obj.name),
    data: [],
  };

  for (let i = 0; i < dbObjects.length; i += 1) {
    const rowObj = dbObjects[i];
    const row = [];

    for (let j = 0; j < dbObjects.length; j += 1) {
      const colObj = dbObjects[j];
      const deps = lineageGraph.get(rowObj.id) || new Set();
      const value = deps.has(colObj.id) ? 1 : 0;
      row.push(value);
    }
    matrix.data.push(row);
  }

  return matrix;
}

export default {
  buildCytoscapeGraph,
  buildCenteredLineageGraph,
  buildD3Graph,
  buildMermaidDiagram,
  buildImpactVisualization,
  buildDependencyMatrix,
};
