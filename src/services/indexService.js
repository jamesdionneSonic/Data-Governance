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
        database: obj.database,
        type: obj.type,
        owner: obj.owner,
        sensitivity: obj.sensitivity,
        tags: obj.tags || [],
        description: obj.description,
        depends_on: obj.depends_on || [],
      },
    ]);

    const bulkResponse = await c.bulk({ refresh: true, operations });
    if (bulkResponse.errors) {
      console.error('Bulk insert had errors');
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
  const c = getClient();
  try {
    const from = options.offset || 0;
    const size = options.limit || 20;

    const esQuery = {
      multi_match: {
        query,
        fields: ['name^3', 'database', 'description', 'owner', 'tags'],
        fuzziness: 'AUTO', // Gives typo tolerance like Meilisearch
      },
    };

    const result = await c.search({
      index: indexName,
      from,
      size,
      query: esQuery,
    });

    // Map Elasticsearch response format back to what your app expects
    const hits = result.hits.hits.map((hit) => hit._source);

    return {
      hits,
      estimatedTotalHits: result.hits.total.value,
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
