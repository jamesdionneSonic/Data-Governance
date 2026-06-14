/**
 * Search Routes
 * Full-text search with faceted filtering
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import { computeTrustScore } from '../services/trustService.js';
import { classifyAsset } from '../services/classificationService.js';
import { searchObjects } from '../services/indexService.js';
import { createTtlCache } from '../utils/ttlCache.js';
import { ensureCatalogCacheHydrated } from '../utils/catalogCacheHydrator.js';
import { resolveBusinessQuery } from '../services/glossaryService.js';
import {
  canonicalDatabaseName,
  databaseNameMatches,
  withCanonicalDatabase,
} from '../utils/catalogNaming.js';

const router = createApiRouter();
let objectCache = new Map();
const searchCache = createTtlCache({ ttlMs: 15000, maxSize: 200 });
const enrichmentCache = createTtlCache({ ttlMs: 300000, maxSize: 2000 });
const facetsCache = createTtlCache({ ttlMs: 60000, maxSize: 5 });
const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 200;
const NO_MATCH_REFRESH_MS = 30000;
const DEFAULT_ES_TIMEOUT_MS = 1500;
let lastNoMatchRefreshAt = 0;

export function setSearchCache(objects) {
  objectCache = objects || new Map();
  searchCache.clear();
  enrichmentCache.clear();
  facetsCache.clear();
}

function enrichSearchItem(item) {
  const cacheKey = item.id || `${item.database || ''}.${item.name || ''}`;
  const cached = enrichmentCache.get(cacheKey);
  const liveObj = objectCache.get(item.id) || {};
  if (cached) {
    return { ...item, ...cached, downstreamCount: liveObj.downstreamCount || 0 };
  }

  const trust = computeTrustScore(item);
  const enriched = {
    trust_score: trust.score,
    trust_level: trust.trust_level,
    certified: trust.certified,
    classifications: classifyAsset(item),
    quality_score: readQualityScore(item),
  };

  enrichmentCache.set(cacheKey, enriched);
  return { ...item, ...enriched, downstreamCount: liveObj.downstreamCount || 0 };
}

function readClassifications(item) {
  const existing = Array.isArray(item.classifications) ? item.classifications : [];
  return [...new Set([...existing, ...classifyAsset(item)])];
}

function parseBoundedInt(value, fallback, min, max) {
  const parsed = parseInt(value, 10);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function normalizeList(value) {
  return String(value || '')
    .split(',')
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function normalizeType(value) {
  const type = String(value || '')
    .trim()
    .toLowerCase();
  if (type === 'storedprocedure' || type === 'procedure') return 'storedprocedure';
  return type;
}

function readTrustLevel(item) {
  return String(item.trust_level || computeTrustScore(item).trust_level || 'unrated').toLowerCase();
}

function readQualityScore(item) {
  const value =
    item.quality_score ??
    item.qualityScore ??
    item.quality?.score ??
    item.quality?.overall_score ??
    item.scorecard?.overall_score;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.max(0, Math.min(100, parsed)) : 0;
}

function itemSearchText(item) {
  return [
    item.id,
    item.name,
    item.packageName,
    item.packagePath,
    item.database,
    item.schema,
    item.type,
    item.owner,
    item.sensitivity,
    item.description,
    ...readClassifications(item),
    ...(item.tags || []),
    ...(item.depends_on || []),
    ...(item.reads_from || []),
    ...(item.writes_to || []),
  ]
    .filter((value) => value !== undefined && value !== null)
    .join(' ')
    .toLowerCase();
}

function normalizeSearchText(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/[_./\\-]+/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function compactSearchText(value) {
  return normalizeSearchText(value).replace(/\s+/g, '');
}

function getSearchTerms(value) {
  return normalizeSearchText(value).split(/\s+/).filter(Boolean);
}

function applyCatalogFilters(items, filters) {
  const databases = normalizeList(filters.database);
  const types = normalizeList(filters.type).map(normalizeType);
  const owners = normalizeList(filters.owner);
  const sensitivities = normalizeList(filters.sensitivity);
  const requestedTags = normalizeList(filters.tags);
  const trustLevels = normalizeList(filters.trustLevel);
  const classifications = normalizeList(filters.classification);

  return items.filter((item) => {
    const itemDatabase = item.database || item.schema || '';
    const type = normalizeType(item.type);
    const owner = String(item.owner || '').toLowerCase();
    const sensitivity = String(item.sensitivity || '').toLowerCase();
    const itemTags = (item.tags || []).map((tag) => String(tag).toLowerCase());
    const trustLevel = readTrustLevel(item);
    const itemClassifications = readClassifications(item).map((label) =>
      String(label).toLowerCase()
    );

    return (
      (databases.length === 0 ||
        databases.some((database) => databaseNameMatches(itemDatabase, database))) &&
      (types.length === 0 || types.includes(type)) &&
      (owners.length === 0 || owners.includes(owner)) &&
      (sensitivities.length === 0 || sensitivities.includes(sensitivity)) &&
      (trustLevels.length === 0 || trustLevels.includes(trustLevel)) &&
      (classifications.length === 0 ||
        classifications.every((label) => itemClassifications.includes(label))) &&
      (requestedTags.length === 0 ||
        requestedTags.every((tag) => itemTags.some((itemTag) => itemTag === tag)))
    );
  });
}

function scoreCatalogItem(item, query) {
  if (!query) return 0;

  const rawQuery = query.toLowerCase();
  const normalizedQuery = normalizeSearchText(query);
  const compactQuery = compactSearchText(query);
  const terms = getSearchTerms(query);
  const rawHaystack = itemSearchText(item);
  const normalizedHaystack = normalizeSearchText(rawHaystack);
  const compactHaystack = compactSearchText(rawHaystack);
  const termMatch = terms.every(
    (term) => normalizedHaystack.includes(term) || rawHaystack.includes(term)
  );
  const compactMatch = compactQuery && compactHaystack.includes(compactQuery);
  if (!termMatch && !compactMatch) return null;

  const idRaw = String(item.id || '').toLowerCase();
  const nameRaw = String(item.name || '').toLowerCase();
  const packageNameRaw = String(item.packageName || '').toLowerCase();
  const id = normalizeSearchText(item.id);
  const name = normalizeSearchText(item.name);
  const packageName = normalizeSearchText(item.packageName);
  const idCompact = compactSearchText(item.id);
  const nameCompact = compactSearchText(item.name);
  const packageNameCompact = compactSearchText(item.packageName);
  const database = normalizeSearchText(canonicalDatabaseName(item.database));
  const owner = normalizeSearchText(item.owner);
  const description = normalizeSearchText(item.description);
  let score = 0;

  if (
    idRaw === rawQuery ||
    nameRaw === rawQuery ||
    packageNameRaw === rawQuery ||
    id === normalizedQuery ||
    name === normalizedQuery ||
    packageName === normalizedQuery ||
    idCompact === compactQuery ||
    nameCompact === compactQuery ||
    packageNameCompact === compactQuery
  ) {
    score += 200;
  }
  if (
    idRaw.startsWith(rawQuery) ||
    nameRaw.startsWith(rawQuery) ||
    packageNameRaw.startsWith(rawQuery) ||
    id.startsWith(normalizedQuery) ||
    name.startsWith(normalizedQuery) ||
    packageName.startsWith(normalizedQuery) ||
    idCompact.startsWith(compactQuery) ||
    nameCompact.startsWith(compactQuery) ||
    packageNameCompact.startsWith(compactQuery)
  ) {
    score += 120;
  }
  if (
    idRaw.includes(rawQuery) ||
    nameRaw.includes(rawQuery) ||
    id.includes(normalizedQuery) ||
    name.includes(normalizedQuery) ||
    idCompact.includes(compactQuery) ||
    nameCompact.includes(compactQuery)
  ) {
    score += 70;
  }
  if (
    packageNameRaw.includes(rawQuery) ||
    packageName.includes(normalizedQuery) ||
    packageNameCompact.includes(compactQuery)
  ) {
    score += 60;
  }
  if (database.includes(normalizedQuery)) score += 35;
  if (owner.includes(normalizedQuery)) score += 25;
  if (description.includes(normalizedQuery)) score += 10;
  score += Math.min(40, (item.downstreamCount || 0) * 2);
  score += Math.round(readQualityScore(item) / 10);

  return score;
}

function searchCatalogCache({ query, limit, offset, filters }) {
  const filtered = applyCatalogFilters(Array.from(objectCache.values()), filters);

  if (!query) {
    const results = filtered.slice(offset, offset + limit).map((item, index) => ({
      ...withCanonicalDatabase(item),
      score: 0,
      resultIndex: offset + index,
    }));

    return { results, totalHits: filtered.length };
  }

  const ranked = filtered
    .map((item, index) => ({
      item,
      index,
      score: scoreCatalogItem(item, query),
    }))
    .filter((entry) => entry.score !== null)
    .sort((first, second) => {
      const scoreDelta = second.score - first.score;
      if (scoreDelta !== 0) return scoreDelta;
      return String(first.item.id || first.item.name || '').localeCompare(
        String(second.item.id || second.item.name || '')
      );
    });

  const totalHits = ranked.length;
  const results = ranked.slice(offset, offset + limit).map((entry) => ({
    ...withCanonicalDatabase(entry.item),
    score: entry.score,
    resultIndex: entry.index,
  }));

  return { results, totalHits };
}

function buildFacetsResponse() {
  const cached = facetsCache.get('catalog-facets');
  if (cached) return cached;

  const values = Array.from(objectCache.values());
  const countValues = (reader) =>
    values.reduce((counts, item) => {
      const value = reader(item);
      if (!value) return counts;
      counts[value] = (counts[value] || 0) + 1;
      return counts;
    }, {});
  const countArrayValues = (reader) =>
    values.reduce((counts, item) => {
      for (const value of reader(item) || []) {
        if (!value) continue;
        counts[value] = (counts[value] || 0) + 1;
      }
      return counts;
    }, {});
  const facets = {
    databases: [...new Set(values.map((o) => canonicalDatabaseName(o.database)))]
      .filter(Boolean)
      .sort(),
    types: [...new Set(values.map((o) => o.type))].filter(Boolean).sort(),
    owners: [...new Set(values.map((o) => o.owner))].filter(Boolean).sort(),
    sensitivity: ['public', 'internal', 'confidential', 'restricted'],
    tags: [...new Set(values.flatMap((o) => o.tags || []))].sort(),
    quality: ['gold', 'silver', 'bronze', 'unrated'],
    classifications: [...new Set(values.flatMap((o) => readClassifications(o)))].sort(),
    counts: {
      databases: countValues((item) => canonicalDatabaseName(item.database)),
      types: countValues((item) => item.type),
      owners: countValues((item) => item.owner),
      sensitivity: countValues((item) => item.sensitivity),
      tags: countArrayValues((item) => item.tags),
      quality: countValues((item) => readTrustLevel(item)),
      classifications: countArrayValues((item) => readClassifications(item)),
      total: values.length,
    },
  };

  facetsCache.set('catalog-facets', facets);
  return facets;
}

function normalizeElasticsearchTotal(esResponse, hits) {
  const total = esResponse?.estimatedTotalHits;
  if (Number.isFinite(total)) return total;
  return hits.length;
}

async function searchObjectsWithTimeout(indexName, query, options) {
  const timeoutMs = parseBoundedInt(
    process.env.ELASTICSEARCH_SEARCH_TIMEOUT_MS,
    DEFAULT_ES_TIMEOUT_MS,
    250,
    10000
  );
  let timer;

  try {
    return await Promise.race([
      searchObjects(indexName, query, options),
      new Promise((_, reject) => {
        timer = setTimeout(
          () => reject(new Error(`Elasticsearch search timed out after ${timeoutMs}ms`)),
          timeoutMs
        );
      }),
    ]);
  } finally {
    clearTimeout(timer);
  }
}

async function refreshCatalogCacheForMiss(searchRequest) {
  const refreshSetting = process.env.SEARCH_REFRESH_ON_MISS;
  const shouldRefresh =
    refreshSetting === undefined ? process.env.NODE_ENV !== 'test' : refreshSetting !== 'false';
  if (!shouldRefresh) return null;

  const now = Date.now();
  if (process.env.NODE_ENV !== 'test' && now - lastNoMatchRefreshAt < NO_MATCH_REFRESH_MS) {
    return null;
  }

  lastNoMatchRefreshAt = now;
  const hydration = await ensureCatalogCacheHydrated({ force: true });
  if (!hydration.hydrated) return null;

  return searchCatalogCache(searchRequest);
}

/**
 * GET /api/v1/search
 * Full-text search across all accessible objects
 * Requires authentication
 *
 * Query parameters:
 * - q: Search query (required)
 * - limit: Results per page (default: 20)
 * - offset: Pagination offset (default: 0)
 * - database: Filter by database name
 * - type: Filter by object type (table, procedure, package, etc.)
 * - owner: Filter by owner
 * - sensitivity: Filter by sensitivity level
 * - tags: Filter by tags (comma-separated)
 */
router.get('/', authenticate, async (req, res) => {
  try {
    const {
      q = '',
      limit = DEFAULT_LIMIT,
      offset = 0,
      database,
      type,
      owner,
      sensitivity,
      tags,
      trust_level: trustLevelFilter,
      classification,
    } = req.query;

    const query = q.toLowerCase().trim();
    const parsedLimit = parseBoundedInt(limit, DEFAULT_LIMIT, 1, MAX_LIMIT);
    const parsedOffset = parseBoundedInt(offset, 0, 0, Number.MAX_SAFE_INTEGER);
    const filters = {
      database,
      type,
      owner,
      sensitivity,
      tags,
      trustLevel: trustLevelFilter,
      classification,
    };

    let results = [];
    let totalHits = 0;
    let searchEngine = 'memory';
    let warnings = [];

    if (objectCache.size === 0) {
      await ensureCatalogCacheHydrated();
    }

    if (query) {
      const cacheKey = JSON.stringify({
        q: query,
        limit: parsedLimit,
        offset: parsedOffset,
        database: database || null,
        type: type || null,
        owner: owner || null,
        sensitivity: sensitivity || null,
        tags: tags || null,
        trust_level: trustLevelFilter || null,
        classification: classification || null,
      });

      const cached = searchCache.get(cacheKey);
      if (cached) {
        results = cached.results;
        totalHits = cached.totalHits;
        searchEngine = cached.searchEngine || searchEngine;
        warnings = cached.warnings || warnings;
      } else if (objectCache.size > 0) {
        const canonical = searchCatalogCache({
          query,
          limit: parsedLimit,
          offset: parsedOffset,
          filters,
        });

        if (canonical.totalHits === 0) {
          const refreshed = await refreshCatalogCacheForMiss({
            query,
            limit: parsedLimit,
            offset: parsedOffset,
            filters,
          });
          if (refreshed) {
            canonical.results = refreshed.results;
            canonical.totalHits = refreshed.totalHits;
          }
        }

        results = canonical.results;
        totalHits = canonical.totalHits;
        searchEngine = 'memory_canonical';
        searchCache.set(cacheKey, { results, totalHits, searchEngine, warnings });
      } else {
        let esResponse = null;
        let esError = null;

        try {
          esResponse = await searchObjectsWithTimeout('objects', query, {
            limit: parsedLimit,
            offset: parsedOffset,
            database,
            type,
            owner,
            sensitivity,
            tags,
            trust_level: trustLevelFilter,
            classification,
          });
        } catch (err) {
          esError = err;
        }

        const esHits = Array.isArray(esResponse?.hits) ? esResponse.hits : [];
        const canonical =
          objectCache.size > 0
            ? searchCatalogCache({
                query,
                limit: parsedLimit,
                offset: parsedOffset,
                filters,
              })
            : null;

        if (canonical) {
          if (canonical.totalHits === 0) {
            const refreshed = await refreshCatalogCacheForMiss({
              query,
              limit: parsedLimit,
              offset: parsedOffset,
              filters,
            });
            if (refreshed) {
              canonical.results = refreshed.results;
              canonical.totalHits = refreshed.totalHits;
            }
          }

          results = canonical.results;
          totalHits = canonical.totalHits;
          searchEngine = esError ? 'memory_fallback' : 'memory_canonical';

          if (esError) {
            warnings = [
              `Elasticsearch unavailable (${esError.message}); searched the markdown catalog instead.`,
            ];
          } else if (esHits.length === 0 && canonical.totalHits > 0) {
            warnings = ['Elasticsearch returned no hits; searched the markdown catalog instead.'];
          }
        } else if (esHits.length > 0 || (!esError && objectCache.size === 0)) {
          results = esHits;
          totalHits = normalizeElasticsearchTotal(esResponse, esHits);
          searchEngine = 'elasticsearch';
        } else {
          const fallback = searchCatalogCache({
            query,
            limit: parsedLimit,
            offset: parsedOffset,
            filters,
          });
          results = fallback.results;
          totalHits = fallback.totalHits;
          searchEngine = esError ? 'memory_fallback' : 'memory_fallback_empty_index';

          if (esError) {
            warnings = [
              `Elasticsearch unavailable (${esError.message}); searched the in-memory catalog instead.`,
            ];
          } else if (fallback.totalHits > 0) {
            warnings = ['Elasticsearch returned no hits; searched the in-memory catalog instead.'];
          }
        }

        searchCache.set(cacheKey, { results, totalHits, searchEngine, warnings });
      }
    } else {
      const browsing = searchCatalogCache({
        query,
        limit: parsedLimit,
        offset: parsedOffset,
        filters,
      });
      results = browsing.results;
      totalHits = browsing.totalHits;
    }

    let semanticResolution = null;
    if (query && objectCache.size > 0) {
      semanticResolution = await resolveBusinessQuery(q, objectCache, { limit: parsedLimit });

      if (semanticResolution.assets.length > 0) {
        const existingIds = new Set(results.map((item) => item.id || item.asset_id));
        const semanticItems = semanticResolution.assets
          .filter((match) => !existingIds.has(match.asset_id))
          .map((match) => ({
            ...(objectCache.get(match.asset_id) || {}),
            id: match.asset_id,
            name: objectCache.get(match.asset_id)?.name || match.name,
            database: objectCache.get(match.asset_id)?.database || match.database,
            schema: objectCache.get(match.asset_id)?.schema || match.schema,
            type: objectCache.get(match.asset_id)?.type || match.type,
            semantic_match: {
              score: match.score,
              reason: match.reason,
              terms: match.terms,
            },
          }));

        if (semanticItems.length > 0) {
          results = [...semanticItems, ...results].slice(0, parsedLimit);
          totalHits = Math.max(totalHits, results.length);
          searchEngine = `${searchEngine}+semantic`;
        }
      }
    }

    // Enrich the results with your platform's trust scores
    const enriched = results.map(enrichSearchItem);

    return res.json({
      status: 'success',
      message: 'Search results',
      query: q,
      searchEngine,
      warnings,
      pagination: {
        limit: parsedLimit,
        offset: parsedOffset,
        total: totalHits,
      },
      facets: {
        database: database || null,
        type: type || null,
        owner: owner || null,
        sensitivity: sensitivity || null,
        tags: tags ? tags.split(',') : [],
        classification: classification || null,
      },
      semantic_matches: semanticResolution
        ? {
            terms: semanticResolution.terms,
            assets: semanticResolution.assets,
          }
        : null,
      results: enriched,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'SEARCH_ERROR',
    });
  }
});

/**
 * GET /api/v1/search/facets
 * Get available facet values for filtering
 * Requires authentication
 */
router.get('/facets', authenticate, async (req, res) => {
  try {
    if (objectCache.size === 0) {
      await ensureCatalogCacheHydrated();
    }

    return res.json({
      status: 'success',
      message: 'Available facets',
      facets: buildFacetsResponse(),
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'SEARCH_FACETS_ERROR',
    });
  }
});

export default router;
