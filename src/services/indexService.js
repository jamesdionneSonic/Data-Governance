/**
 * Index Service
 * Manages Meilisearch indexing for fast search and filtering
 */

import { MeiliSearch } from 'meilisearch';

// Lazy-loaded client instance
let client = null;

/**
 * Initialize Meilisearch client
 * @param {Object} config - Configuration object
 * @returns {MeiliSearch} Meilisearch client
 */
export function initializeClient(config = {}) {
  const url =
    config.url ||
    process.env.MEILISEARCH_URL ||
    process.env.MEILISEARCH_HOST ||
    'http://localhost:7700';
  const apiKey = config.apiKey || process.env.MEILISEARCH_MASTER_KEY || '';

  client = new MeiliSearch({
    host: url,
    apiKey,
  });

  return client;
}

/**
 * Get or create Meilisearch client
 * @returns {MeiliSearch} Meilisearch client
 */
export function getClient() {
  if (!client) {
    initializeClient();
  }

  return client;
}

/**
 * Create or update index
 * @param {string} indexName - Index name
 * @param {Object} settings - Index settings
 * @returns {Promise} Index creation/update result
 */
export async function createIndex(indexName, settings = {}) {
  const c = getClient();

  try {
    const defaultSettings = {
      searchableAttributes: ['name', 'database', 'description', 'owner', 'tags'],
      filterableAttributes: ['database', 'type', 'owner', 'sensitivity', 'tags'],
      sortableAttributes: ['name', 'database', 'type', 'owner'],
      displayedAttributes: ['id', 'name', 'database', 'type', 'owner', 'sensitivity'],
      typoTolerance: {
        enabled: true,
        minWordSizeForTypos: {
          oneTypo: 5,
          twoTypos: 9,
        },
      },
      pagination: {
        maxTotalHits: 10000,
      },
    };

    const finalSettings = { ...defaultSettings, ...settings };
    const index = await c.index(indexName);

    await index.updateSettings(finalSettings);
    return index;
  } catch (err) {
    console.error(`Error creating index ${indexName}:`, err.message);
    throw err;
  }
}

/**
 * Index objects (add or update)
 * @param {string} indexName - Index name
 * @param {Array} objects - Array of objects to index
 * @returns {Promise} Indexing result
 */
export async function indexObjects(indexName, objects) {
  const c = getClient();

  try {
    const index = await c.index(indexName);

    // Transform objects for indexing
    const documents = objects.map((obj) => ({
      id: obj.id,
      name: obj.name,
      database: obj.database,
      type: obj.type,
      owner: obj.owner,
      sensitivity: obj.sensitivity,
      tags: obj.tags || [],
      description: obj.description,
      depends_on: obj.depends_on || [],
    }));

    const task = await index.addDocuments(documents);
    return task;
  } catch (err) {
    console.error(`Error indexing objects in ${indexName}:`, err.message);
    throw err;
  }
}

/**
 * Search objects
 * @param {string} indexName - Index name
 * @param {string} query - Search query
 * @param {Object} options - Search options (limit, offset, filter, sort, facets)
 * @returns {Promise} Search results
 */
export async function searchObjects(indexName, query, options = {}) {
  const c = getClient();

  try {
    const index = await c.index(indexName);

    const searchOptions = {
      limit: options.limit || 20,
      offset: options.offset || 0,
      matchingStrategy: 'all',
      ...options,
    };

    // Build filter string if filters provided
    if (options.filter) {
      searchOptions.filter = buildFilterString(options.filter);
    }

    const results = await index.search(query, searchOptions);

    return results;
  } catch (err) {
    console.error(`Error searching index ${indexName}:`, err.message);
    throw err;
  }
}

/**
 * Build Meilisearch filter string
 * @param {Object} filter - Filter object
 * @returns {string} Filter string
 */
export function buildFilterString(filter) {
  const conditions = [];

  if (filter.database) {
    conditions.push(`database = "${filter.database}"`);
  }

  if (filter.type) {
    if (Array.isArray(filter.type)) {
      conditions.push(`type IN [${filter.type.map((t) => `"${t}"`).join(', ')}]`);
    } else {
      conditions.push(`type = "${filter.type}"`);
    }
  }

  if (filter.owner) {
    conditions.push(`owner = "${filter.owner}"`);
  }

  if (filter.sensitivity) {
    if (Array.isArray(filter.sensitivity)) {
      conditions.push(`sensitivity IN [${filter.sensitivity.map((s) => `"${s}"`).join(', ')}]`);
    } else {
      conditions.push(`sensitivity = "${filter.sensitivity}"`);
    }
  }

  if (filter.tags && filter.tags.length > 0) {
    // Match any tag
    const tagConditions = filter.tags.map((tag) => `tags = "${tag}"`);
    conditions.push(`(${tagConditions.join(' OR ')})`);
  }

  return conditions.join(' AND ');
}

/**
 * Get faceted search results
 * @param {string} indexName - Index name
 * @param {string} query - Search query
 * @param {Object} options - Search options
 * @returns {Promise} Search results with facets
 */
export async function facetedSearch(indexName, query, options = {}) {
  const c = getClient();

  try {
    const index = await c.index(indexName);

    const searchOptions = {
      limit: options.limit || 20,
      offset: options.offset || 0,
      facets: ['database', 'type', 'owner', 'sensitivity', 'tags'],
      matchingStrategy: 'all',
      ...options,
    };

    if (options.filter) {
      searchOptions.filter = buildFilterString(options.filter);
    }

    const results = await index.search(query, searchOptions);

    return results;
  } catch (err) {
    console.error(`Error in faceted search on ${indexName}:`, err.message);
    throw err;
  }
}

/**
 * Delete index
 * @param {string} indexName - Index name
 * @returns {Promise} Deletion result
 */
export async function deleteIndex(indexName) {
  const c = getClient();

  try {
    const result = await c.deleteIndex(indexName);
    return result;
  } catch (err) {
    console.error(`Error deleting index ${indexName}:`, err.message);
    throw err;
  }
}

/**
 * Get index stats
 * @param {string} indexName - Index name
 * @returns {Promise} Index statistics
 */
export async function getIndexStats(indexName) {
  const c = getClient();

  try {
    const stats = await c.index(indexName).getStats();
    return stats;
  } catch (err) {
    console.error(`Error getting stats for index ${indexName}:`, err.message);
    throw err;
  }
}

/**
 * Health check - verify Meilisearch is accessible
 * @returns {Promise<boolean>} True if healthy
 */
export async function healthCheck() {
  try {
    const c = getClient();
    const health = await c.getHealth();
    return health.status === 'available';
  } catch (err) {
    console.error('Meilisearch health check failed:', err.message);
    return false;
  }
}

export default {
  initializeClient,
  getClient,
  createIndex,
  indexObjects,
  searchObjects,
  buildFilterString,
  facetedSearch,
  deleteIndex,
  getIndexStats,
  healthCheck,
};
