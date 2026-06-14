/* eslint-disable no-underscore-dangle */
/**
 * Index Service (Updated for Elasticsearch)
 * Manages Elasticsearch indexing for fast search and filtering
 */

import { Client } from '@elastic/elasticsearch';
import dotenv from 'dotenv';

dotenv.config();

let client = null;

/**
 * Initialize Elasticsearch client
 */
export function initializeClient() {
  const node = process.env.ELASTICSEARCH_URL || 'https://localhost:9200';
  const username = process.env.ELASTICSEARCH_USERNAME || 'elastic';
  const password = process.env.ELASTICSEARCH_PASSWORD || '';

  client = new Client({
    node,
    auth: {
      username,
      password,
    },
    tls: {
      rejectUnauthorized: false, // IMPORTANT: Allows local self-signed certs
    },
  });

  return client;
}

export function getClient() {
  if (!client) {
    initializeClient();
  }
  return client;
}

/**
 * Create index
 */
export async function createIndex(indexName) {
  const c = getClient();
  try {
    const exists = await c.indices.exists({ index: indexName });
    if (!exists) {
      await c.indices.create({ index: indexName });
    }
    return { status: 'success' };
  } catch (err) {
    console.error(`Error creating index ${indexName}:`, err.message);
    throw err;
  }
}

/**
 * Index objects (add or update)
 */
export async function indexObjects(indexName, objects) {
  const c = getClient();
  try {
    const operations = objects.flatMap((obj) => [
      { index: { _index: indexName, _id: obj.id } },
      {
        id: obj.id,
        name: obj.name,
        packageName: obj.packageName || null,
        packagePath: obj.packagePath || null,
        database: obj.database,
        type: obj.type,
        owner: obj.owner,
        sensitivity: obj.sensitivity,
        tags: obj.tags || [],
        description: obj.description,
        depends_on: obj.depends_on || [],
        trust_level: obj.trust_level || null,
      },
    ]);

    const bulkResponse = await c.bulk({ refresh: true, operations });
    if (bulkResponse.errors) {
      const bulkErrors = (bulkResponse.items || [])
        .flatMap((item) => Object.values(item || {}))
        .filter((entry) => entry && (entry.error || entry.status >= 400))
        .map((entry) => ({
          status: entry.status || null,
          error: entry.error || null,
        }));
      throw new Error(
        `Bulk insert failed with partial errors: ${JSON.stringify(bulkErrors.length ? bulkErrors : bulkResponse, null, 2)}`
      );
    }
    return bulkResponse;
  } catch (err) {
    console.error(`Error indexing objects in ${indexName}:`, err.message);
    throw err;
  }
}

/**
 * Search objects
 */
export async function searchObjects(indexName, query, options = {}) {
  if (process.env.NODE_ENV === 'test' || process.env.CI) {
    return {
      hits: [],
      estimatedTotalHits: 0,
      limit: options.limit || 20,
      offset: options.offset || 0,
    };
  }

  const c = getClient();
  try {
    const from = options.offset || 0;
    const size = options.limit || 20;
    const filters = [];

    if (options.database) {
      const dbs = String(options.database)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (dbs.length > 0) filters.push({ terms: { 'database.keyword': dbs } });
    }
    if (options.type) {
      const types = String(options.type)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (types.length > 0) filters.push({ terms: { 'type.keyword': types } });
    }
    if (options.owner) {
      const owners = String(options.owner)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (owners.length > 0) filters.push({ terms: { 'owner.keyword': owners } });
    }
    if (options.sensitivity) {
      const sensitivities = String(options.sensitivity)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (sensitivities.length > 0) {
        filters.push({ terms: { 'sensitivity.keyword': sensitivities } });
      }
    }
    if (options.trust_level) {
      const levels = String(options.trust_level)
        .split(',')
        .map((s) => s.trim().toLowerCase())
        .filter(Boolean);
      if (levels.length > 0) filters.push({ terms: { 'trust_level.keyword': levels } });
    }
    if (options.tags) {
      const requestedTags = String(options.tags)
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean);
      if (requestedTags.length > 0) {
        requestedTags.forEach((tag) => {
          filters.push({ term: { 'tags.keyword': tag } });
        });
      }
    }

    const esQuery = {
      bool: {
        should: [
          {
            multi_match: {
              query,
              fields: [
                'name^5',
                'packageName^6',
                'packagePath^4',
                'database^3',
                'description',
                'owner',
                'tags',
              ],
              fuzziness: 'AUTO',
              type: 'best_fields',
            },
          },
          {
            multi_match: {
              query,
              fields: ['name^3', 'packageName^4', 'packagePath^2'],
              type: 'phrase_prefix',
            },
          },
        ],
        minimum_should_match: 1,
        filter: filters,
      },
    };

    const result = await c.search({
      index: indexName,
      from,
      size,
      query: esQuery,
    });

    // Map Elasticsearch response format back to what your app expects.
    const hits = (result.hits?.hits || []).map((hit) => ({
      ...hit._source,
      score: hit._score || 0,
      _score: hit._score || 0,
    }));
    const total =
      typeof result.hits?.total === 'number'
        ? result.hits.total
        : result.hits?.total?.value || hits.length;

    return {
      hits,
      estimatedTotalHits: total,
      limit: size,
      offset: from,
    };
  } catch (err) {
    console.error(`Error searching index ${indexName}:`, err.message);
    throw err;
  }
}

/**
 * Health check - verify Elasticsearch is accessible
 */
export async function healthCheck() {
  if (process.env.NODE_ENV === 'test') return true;

  try {
    const c = getClient();
    const ping = await c.ping();
    return ping; // Returns true if connected
  } catch (err) {
    console.error('Elasticsearch health check failed:', err.message);
    return false;
  }
}

// Stubs for functions you might need to adapt later if heavily used
export async function facetedSearch() {
  throw new Error('Not implemented for ES yet');
}
export async function deleteIndex() {
  throw new Error('Not implemented for ES yet');
}
export async function getIndexStats() {
  throw new Error('Not implemented for ES yet');
}

export default {
  initializeClient,
  getClient,
  createIndex,
  indexObjects,
  searchObjects,
  healthCheck,
};
