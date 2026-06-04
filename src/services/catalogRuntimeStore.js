import { indexTypedLineageEdges } from './lineageService.js';

let catalogDataPath = '';
let objectFileIndex = new Map();
let typedLineageEdges = [];
let typedLineageEdgeIndex = indexTypedLineageEdges([]);

export function setCatalogRuntime(runtime = {}) {
  catalogDataPath = runtime.dataPath || '';
  objectFileIndex =
    runtime.objectFileIndex instanceof Map ? runtime.objectFileIndex : new Map();
  typedLineageEdges = Array.isArray(runtime.typedEdges) ? runtime.typedEdges : [];
  typedLineageEdgeIndex =
    runtime.typedEdgeIndex?.byNode instanceof Map
      ? runtime.typedEdgeIndex
      : indexTypedLineageEdges(typedLineageEdges);
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

export function getTypedLineageEdges() {
  return typedLineageEdges;
}

export function getTypedLineageEdgeIndex() {
  return typedLineageEdgeIndex;
}

export default {
  getCatalogDataPath,
  getObjectFileIndex,
  getObjectFilePath,
  getTypedLineageEdgeIndex,
  getTypedLineageEdges,
  setCatalogRuntime,
};
