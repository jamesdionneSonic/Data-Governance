import { indexTypedLineageEdges } from './lineageService.js';

let catalogDataPath = '';
let objectFileIndex = new Map();
let lineageGraph = new Map();
let typedLineageEdges = [];
let typedLineageEdgeIndex = indexTypedLineageEdges([]);

export function setCatalogRuntime(runtime = {}) {
  catalogDataPath = runtime.dataPath || '';
  objectFileIndex =
    runtime.objectFileIndex instanceof Map ? runtime.objectFileIndex : new Map();
  lineageGraph = runtime.lineageGraph instanceof Map ? runtime.lineageGraph : lineageGraph;
  typedLineageEdges = Array.isArray(runtime.typedEdges) ? runtime.typedEdges : [];
  typedLineageEdgeIndex =
    runtime.typedEdgeIndex?.byNode instanceof Map
      ? runtime.typedEdgeIndex
      : indexTypedLineageEdges(typedLineageEdges);
}

export function setRuntimeLineageGraph(graph) {
  lineageGraph = graph instanceof Map ? graph : new Map();
}

export function getCatalogDataPath() {
  return catalogDataPath;
}

export function getObjectFileIndex() {
  return objectFileIndex;
}

export function getObjectFilePath(objectId) {
  return objectFileIndex.get(objectId) || null;
}

export function getLineageGraph() {
  return lineageGraph;
}

export function getTypedLineageEdges() {
  return typedLineageEdges;
}

export function getTypedLineageEdgeIndex() {
  return typedLineageEdgeIndex;
}

export default {
  getCatalogDataPath,
  getLineageGraph,
  getObjectFileIndex,
  getObjectFilePath,
  getTypedLineageEdgeIndex,
  getTypedLineageEdges,
  setCatalogRuntime,
  setRuntimeLineageGraph,
};
