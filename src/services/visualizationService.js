/**
 * Visualization Service
 * Transforms data lineage into graph formats for visualization
 * Supports Cytoscape.js, D3.js, and Mermaid
 */

import {
  getUpstreamDependencies,
  getDownstreamDependents,
  analyzeImpact,
} from './lineageService.js';

/**
 * Build Cytoscape.js graph format
 * https://js.cytoscape.org/
 * @param {string} objectId - Central object ID
 * @param {Map} lineageGraph - Lineage graph
 * @param {Map} objects - Object metadata map
 * @param {number} depth - Radius of graph (default 2)
 * @returns {Object} Cytoscape format {nodes, edges}
 */
export function buildCytoscapeGraph(objectId, lineageGraph, objects, depth = 2) {
  const nodes = [];
  const edges = [];
  const seen = new Set();

  // Add central node
  const centralObj = objects.get(objectId);
  if (centralObj) {
    nodes.push({
      data: {
        id: objectId,
        label: centralObj.name,
        database: centralObj.database,
        type: centralObj.type,
        sensitivity: centralObj.sensitivity,
      },
      classes: ['central', `type-${centralObj.type}`, `sensitivity-${centralObj.sensitivity}`],
    });
    seen.add(objectId);
  }

  // Add upstream dependencies
  const upstream = getUpstreamDependencies(objectId, lineageGraph, depth);
  for (const depId of upstream) {
    const depObj = objects.get(depId);
    if (depObj && !seen.has(depId)) {
      nodes.push({
        data: {
          id: depId,
          label: depObj.name,
          database: depObj.database,
          type: depObj.type,
          sensitivity: depObj.sensitivity,
        },
        classes: [`type-${depObj.type}`, `sensitivity-${depObj.sensitivity}`],
      });
      edges.push({
        data: {
          id: `${depId}-${objectId}`,
          source: depId,
          target: objectId,
          label: 'depends_on',
        },
        classes: ['dependency'],
      });
      seen.add(depId);
    }
  }

  // Add downstream dependents
  const downstream = getDownstreamDependents(objectId, lineageGraph, depth);
  for (const depId of downstream) {
    const depObj = objects.get(depId);
    if (depObj && !seen.has(depId)) {
      nodes.push({
        data: {
          id: depId,
          label: depObj.name,
          database: depObj.database,
          type: depObj.type,
          sensitivity: depObj.sensitivity,
        },
        classes: [`type-${depObj.type}`, `sensitivity-${depObj.sensitivity}`],
      });
      edges.push({
        data: {
          id: `${objectId}-${depId}`,
          source: objectId,
          target: depId,
          label: 'used_by',
        },
        classes: ['dependent'],
      });
      seen.add(depId);
    }
  }

  return { nodes, edges };
}

/**
 * Build D3.js force-directed graph format
 * https://d3js.org/
 * @param {string} objectId - Central object ID
 * @param {Map} lineageGraph - Lineage graph
 * @param {Map} objects - Object metadata map
 * @param {number} depth - Radius of graph
 * @returns {Object} D3 format {nodes, links}
 */
export function buildD3Graph(objectId, lineageGraph, objects, depth = 2) {
  const nodeMap = new Map();
  const links = [];

  // Add central node
  const centralObj = objects.get(objectId);
  if (centralObj) {
    nodeMap.set(objectId, {
      id: objectId,
      name: centralObj.name,
      database: centralObj.database,
      type: centralObj.type,
      group: centralObj.database,
      value: 30,
    });
  }

  // Add upstream dependencies
  const upstream = getUpstreamDependencies(objectId, lineageGraph, depth);
  for (const depId of upstream) {
    const depObj = objects.get(depId);
    if (depObj && !nodeMap.has(depId)) {
      nodeMap.set(depId, {
        id: depId,
        name: depObj.name,
        database: depObj.database,
        type: depObj.type,
        group: depObj.database,
        value: 20,
      });
    }
    links.push({
      source: depId,
      target: objectId,
      value: 1,
      type: 'depends_on',
    });
  }

  // Add downstream dependents
  const downstream = getDownstreamDependents(objectId, lineageGraph, depth);
  for (const depId of downstream) {
    const depObj = objects.get(depId);
    if (depObj && !nodeMap.has(depId)) {
      nodeMap.set(depId, {
        id: depId,
        name: depObj.name,
        database: depObj.database,
        type: depObj.type,
        group: depObj.database,
        value: 20,
      });
    }
    links.push({
      source: objectId,
      target: depId,
      value: 1,
      type: 'used_by',
    });
  }

  return {
    nodes: Array.from(nodeMap.values()),
    links,
  };
}

/**
 * Build Mermaid diagram markup
 * https://mermaid.js.org/
 * @param {string} objectId - Central object ID
 * @param {Map} lineageGraph - Lineage graph
 * @param {Map} objects - Object metadata map
 * @returns {string} Mermaid markup
 */
export function buildMermaidDiagram(objectId, lineageGraph, objects) {
  let diagram = 'graph TD\n';

  const centralObj = objects.get(objectId);
  const safeName = (id) => id.replace(/[.-]/g, '_');

  // Add central node
  diagram += `  ${safeName(objectId)}["${centralObj.name}<br/>(${centralObj.type})"]:::central\n`;

  // Add upstream dependencies
  const upstream = getUpstreamDependencies(objectId, lineageGraph, 2);
  for (const depId of upstream.slice(0, 5)) {
    const depObj = objects.get(depId);
    if (depObj) {
      diagram += `  ${safeName(depId)}["${depObj.name}<br/>(${depObj.type})"]:::dependency\n`;
      diagram += `  ${safeName(depId)} -->|depends_on| ${safeName(objectId)}\n`;
    }
  }

  // Add downstream dependents
  const downstream = getDownstreamDependents(objectId, lineageGraph, 2);
  for (const depId of downstream.slice(0, 5)) {
    const depObj = objects.get(depId);
    if (depObj) {
      diagram += `  ${safeName(depId)}["${depObj.name}<br/>(${depObj.type})"]:::dependent\n`;
      diagram += `  ${safeName(objectId)} -->|used_by| ${safeName(depId)}\n`;
    }
  }

  // Add styling
  diagram += '\n  classDef central fill:#4CAF50,stroke:#333,stroke-width:3px,color:#fff\n';
  diagram += '  classDef dependency fill:#2196F3,stroke:#333,stroke-width:2px,color:#fff\n';
  diagram += '  classDef dependent fill:#FF9800,stroke:#333,stroke-width:2px,color:#fff\n';

  return diagram;
}

/**
 * Build impact analysis visualization data
 * @param {string} objectId - Central object ID
 * @param {Map} lineageGraph - Lineage graph
 * @param {Map} objects - Object metadata map
 * @returns {Object} Impact visualization data
 */
export function buildImpactVisualization(objectId, lineageGraph, objects) {
  const impact = analyzeImpact(objectId, lineageGraph, objects);

  const visualization = {
    source: {
      id: objectId,
      ...objects.get(objectId),
    },
    impact,
    levels: {
      direct: impact.direct.map((id) => ({
        id,
        ...objects.get(id),
      })),
      twoHops: impact.twoHops.map((id) => ({
        id,
        ...objects.get(id),
      })),
      threeOrMore: impact.threeOrMore.map((id) => ({
        id,
        ...objects.get(id),
      })),
    },
    stats: {
      directCount: impact.direct.length,
      twoHopsCount: impact.twoHops.length,
      threeOrMoreCount: impact.threeOrMore.length,
      totalAffected: impact.totalAffected,
    },
  };

  return visualization;
}

/**
 * Build table/matrix view of dependencies
 * @param {string} database - Database name to visualize
 * @param {Map} objects - Object metadata map
 * @param {Map} lineageGraph - Lineage graph
 * @returns {Object} Matrix format data
 */
export function buildDependencyMatrix(database, objects, lineageGraph) {
  const dbObjects = Array.from(objects.values()).filter((obj) => obj.database === database);

  const matrix = {
    database,
    rows: dbObjects.map((obj) => obj.name),
    columns: dbObjects.map((obj) => obj.name),
    data: [],
  };

  // Build dependency matrix (1 = depends_on, 0 = no dependency)
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
  buildD3Graph,
  buildMermaidDiagram,
  buildImpactVisualization,
  buildDependencyMatrix,
};
