let objectCache = new Map();

export function getObjectsCache() {
  return objectCache;
}

export function setObjectsCache(objects) {
  objectCache = objects || new Map();
}

export default {
  getObjectsCache,
  setObjectsCache,
};
