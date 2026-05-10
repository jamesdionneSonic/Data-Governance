/**
 * Metadata Service
 * Manage object metadata, tags, ownership, and classifications
 */

/**
 * Update object metadata
 * @param {string} objectId - Object ID
 * @param {Object} updates - Metadata updates
 * @param {Map} objects - Objects map
 * @returns {Object|null} Updated object or null
 */
export function updateObjectMetadata(objectId, updates, objects) {
  const obj = objects.get(objectId);
  if (!obj) {
    return null;
  }

  // Only allow certain fields to be updated
  const allowedFields = ['name', 'description', 'owner', 'tags', 'sensitivity', 'metadata'];

  const updated = { ...obj };

  for (const field of allowedFields) {
    if (field in updates) {
      // Validate sensitive field changes
      if (field === 'sensitivity') {
        const validSensitivities = ['public', 'internal', 'confidential', 'PII', 'restricted'];
        if (!validSensitivities.includes(updates[field])) {
          throw new Error(`Invalid sensitivity level: ${updates[field]}`);
        }
      }

      if (field === 'tags' && !Array.isArray(updates[field])) {
        throw new Error('Tags must be an array');
      }

      updated[field] = updates[field];
    }
  }

  objects.set(objectId, updated);
  return updated;
}

/**
 * Add tag to object
 * @param {string} objectId - Object ID
 * @param {string} tag - Tag to add
 * @param {Map} objects - Objects map
 * @returns {Array|null} Updated tags or null
 */
export function addTag(objectId, tag, objects) {
  const obj = objects.get(objectId);
  if (!obj) {
    return null;
  }

  if (!obj.tags) {
    obj.tags = [];
  }

  if (!obj.tags.includes(tag)) {
    obj.tags.push(tag);
  }

  objects.set(objectId, obj);
  return obj.tags;
}

/**
 * Remove tag from object
 * @param {string} objectId - Object ID
 * @param {string} tag - Tag to remove
 * @param {Map} objects - Objects map
 * @returns {Array|null} Updated tags or null
 */
export function removeTag(objectId, tag, objects) {
  const obj = objects.get(objectId);
  if (!obj) {
    return null;
  }

  if (obj.tags) {
    obj.tags = obj.tags.filter((t) => t !== tag);
  }

  objects.set(objectId, obj);
  return obj.tags;
}

/**
 * Change object owner
 * @param {string} objectId - Object ID
 * @param {string} newOwner - New owner ID/name
 * @param {Map} objects - Objects map
 * @returns {string|null} New owner or null
 */
export function changeOwner(objectId, newOwner, objects) {
  const obj = objects.get(objectId);
  if (!obj) {
    return null;
  }

  obj.owner = newOwner;
  objects.set(objectId, obj);
  return newOwner;
}

/**
 * Update sensitivity classification
 * @param {string} objectId - Object ID
 * @param {string} sensitivity - New sensitivity level
 * @param {Map} objects - Objects map
 * @returns {string|null} New sensitivity or null
 */
export function updateSensitivity(objectId, sensitivity, objects) {
  const validSensitivities = ['public', 'internal', 'confidential', 'PII', 'restricted'];

  if (!validSensitivities.includes(sensitivity)) {
    throw new Error(`Invalid sensitivity: ${sensitivity}`);
  }

  const obj = objects.get(objectId);
  if (!obj) {
    return null;
  }

  obj.sensitivity = sensitivity;
  objects.set(objectId, obj);
  return sensitivity;
}

/**
 * Bulk update metadata
 * @param {Array} updates - Array of {objectId, changes}
 * @param {Map} objects - Objects map
 * @returns {Array} Results of updates
 */
export function bulkUpdateMetadata(updates, objects) {
  const results = [];

  for (const { objectId, changes } of updates) {
    try {
      const updated = updateObjectMetadata(objectId, changes, objects);
      results.push({
        objectId,
        success: true,
        updated,
      });
    } catch (err) {
      results.push({
        objectId,
        success: false,
        error: err.message,
      });
    }
  }

  return results;
}

/**
 * Get metadata change summary
 * @param {string} objectId - Object ID
 * @param {Object} before - Previous metadata
 * @param {Object} after - Current metadata
 * @returns {Object} Changes summary
 */
export function getMetadataChanges(objectId, before, after) {
  const changes = {
    objectId,
    changedFields: [],
  };

  const allKeys = new Set([...Object.keys(before), ...Object.keys(after)]);

  for (const key of allKeys) {
    const beforeValue = before[key];
    const afterValue = after[key];

    // Skip if same
    if (JSON.stringify(beforeValue) === JSON.stringify(afterValue)) {
      continue;
    }

    changes.changedFields.push({
      field: key,
      before: beforeValue,
      after: afterValue,
    });
  }

  return changes;
}

/**
 * Validate metadata
 * @param {Object} metadata - Metadata to validate
 * @returns {Object} Validation result
 */
export function validateMetadata(metadata) {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (!metadata.name || typeof metadata.name !== 'string') {
    errors.push('Name is required and must be a string');
  }

  if (!metadata.owner || typeof metadata.owner !== 'string') {
    errors.push('Owner is required and must be a string');
  }

  // Check sensitivity level
  const validSensitivities = ['public', 'internal', 'confidential', 'PII', 'restricted'];
  if (metadata.sensitivity && !validSensitivities.includes(metadata.sensitivity)) {
    errors.push(`Invalid sensitivity level: ${metadata.sensitivity}`);
  }

  // Check tags
  if (metadata.tags && !Array.isArray(metadata.tags)) {
    errors.push('Tags must be an array');
  }

  // Warnings for missing fields
  if (!metadata.description) {
    warnings.push('Description is recommended but missing');
  }

  if (!metadata.tags || metadata.tags.length === 0) {
    warnings.push('No tags assigned');
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Get all objects with specific tag
 * @param {string} tag - Tag to search for
 * @param {Map} objects - Objects map
 * @returns {Array} Objects with tag
 */
export function getObjectsByTag(tag, objects) {
  const results = [];

  for (const [, obj] of objects) {
    if (obj.tags && obj.tags.includes(tag)) {
      results.push(obj);
    }
  }

  return results;
}

/**
 * Get all objects by owner
 * @param {string} owner - Owner name/ID
 * @param {Map} objects - Objects map
 * @returns {Array} Objects owned by person
 */
export function getObjectsByOwner(owner, objects) {
  const results = [];

  for (const [, obj] of objects) {
    if (obj.owner === owner) {
      results.push(obj);
    }
  }

  return results;
}

/**
 * Get all objects by sensitivity
 * @param {string} sensitivity - Sensitivity level
 * @param {Map} objects - Objects map
 * @returns {Array} Objects with sensitivity level
 */
export function getObjectsBySensitivity(sensitivity, objects) {
  const results = [];

  for (const [, obj] of objects) {
    if (obj.sensitivity === sensitivity) {
      results.push(obj);
    }
  }

  return results;
}

/**
 * Get metadata statistics
 * @param {Map} objects - Objects map
 * @returns {Object} Metadata statistics
 */
export function getMetadataStatistics(objects) {
  const stats = {
    totalObjects: objects.size,
    tags: {},
    owners: {},
    sensitivities: {},
    missingDescriptions: 0,
    untagged: 0,
  };

  for (const [, obj] of objects) {
    // Count tags
    if (obj.tags && obj.tags.length > 0) {
      for (const tag of obj.tags) {
        stats.tags[tag] = (stats.tags[tag] || 0) + 1;
      }
    } else {
      stats.untagged += 1;
    }

    // Count owners
    stats.owners[obj.owner] = (stats.owners[obj.owner] || 0) + 1;

    // Count sensitivities
    stats.sensitivities[obj.sensitivity] = (stats.sensitivities[obj.sensitivity] || 0) + 1;

    // Count missing descriptions
    if (!obj.description || obj.description.trim() === '') {
      stats.missingDescriptions += 1;
    }
  }

  return stats;
}

export default {
  updateObjectMetadata,
  addTag,
  removeTag,
  changeOwner,
  updateSensitivity,
  bulkUpdateMetadata,
  getMetadataChanges,
  validateMetadata,
  getObjectsByTag,
  getObjectsByOwner,
  getObjectsBySensitivity,
  getMetadataStatistics,
};
