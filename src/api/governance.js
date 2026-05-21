/**
 * Governance Context API Routes
 * Returns a unified governance context for a data asset:
 *   asset metadata + lineage + classification + trust + glossary links
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import {
  buildGovernanceContext,
  buildGovernanceSummaries,
} from '../services/governanceContextService.js';

const router = createApiRouter();

let assetCache = null;
let lineageGraphCache = null;

/**
 * Inject asset and lineage caches from index.js startup
 * @param {Map} assets
 * @param {Map} lineageGraph
 */
export function setGovernanceCache(assets, lineageGraph) {
  assetCache = assets;
  lineageGraphCache = lineageGraph;
}

/**
 * GET /api/v1/governance/context/:assetId
 * Full governance context for a single asset
 * assetId: database.objectname (e.g. sales.orders)
 */
router.get('/context/:assetId', authenticate, (req, res) => {
  const { assetId } = req.params;

  if (!assetCache) {
    return sendErrorResponse(res, req, 503, 'Asset index not yet loaded', {
      code: 'SERVICE_UNAVAILABLE',
    });
  }

  const context = buildGovernanceContext(assetId, assetCache, lineageGraphCache);

  if (!context) {
    return sendErrorResponse(res, req, 404, `Asset '${assetId}' not found`, {
      code: 'NOT_FOUND',
    });
  }

  return res.json({ status: 'success', context });
});

/**
 * GET /api/v1/governance/summary
 * Returns lightweight governance summaries for all assets
 * Sorted descending by trust score
 * Optional query params: min_trust (0-100), trust_level, classification
 */
router.get('/summary', authenticate, (req, res) => {
  if (!assetCache) {
    return sendErrorResponse(res, req, 503, 'Asset index not yet loaded', {
      code: 'SERVICE_UNAVAILABLE',
    });
  }

  let summaries = buildGovernanceSummaries(assetCache);

  const minTrust = req.query.min_trust;
  const trustLevel = req.query.trust_level;
  const { classification } = req.query;

  if (minTrust) {
    const minScore = parseInt(minTrust, 10);
    summaries = summaries.filter((s) => s.trust_score >= minScore);
  }

  if (trustLevel) {
    summaries = summaries.filter((s) => s.trust_level === trustLevel);
  }

  if (classification) {
    summaries = summaries.filter((s) => s.classifications.includes(classification));
  }

  return res.json({
    status: 'success',
    count: summaries.length,
    summaries,
  });
});

/**
 * GET /api/v1/governance/health
 * Returns overall governance health metrics across all assets
 */
router.get('/health', authenticate, (_req, res) => {
  if (!assetCache) {
    return sendErrorResponse(res, _req, 503, 'Asset index not yet loaded', {
      code: 'SERVICE_UNAVAILABLE',
    });
  }

  const summaries = buildGovernanceSummaries(assetCache);
  const total = summaries.length;

  if (total === 0) {
    return res.json({
      status: 'success',
      total_assets: 0,
      health_score: 0,
      metrics: {},
    });
  }

  const certified = summaries.filter((s) => s.certified).length;
  const withOwner = summaries.filter((s) => s.owner && s.owner !== 'unknown').length;
  const withSteward = summaries.filter((s) => s.steward).length;
  const withClassification = summaries.filter((s) => s.classifications.length > 0).length;
  const avgTrust = Math.round(summaries.reduce((sum, s) => sum + s.trust_score, 0) / total);

  const trustDistribution = {
    gold: 0,
    silver: 0,
    bronze: 0,
    unrated: 0,
  };
  for (const s of summaries) {
    const level = s.trust_level || 'unrated';
    if (level in trustDistribution) {
      trustDistribution[level] += 1;
    }
  }

  return res.json({
    status: 'success',
    total_assets: total,
    health_score: avgTrust,
    metrics: {
      ownership_coverage_pct: Math.round((withOwner / total) * 100),
      stewardship_coverage_pct: Math.round((withSteward / total) * 100),
      classification_coverage_pct: Math.round((withClassification / total) * 100),
      certified_pct: Math.round((certified / total) * 100),
      avg_trust_score: avgTrust,
    },
    trust_distribution: trustDistribution,
  });
});

export default router;
