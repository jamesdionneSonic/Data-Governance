/**
 * Trust Service
 * Computes trust scores and certification status for data assets
 * from existing YAML frontmatter fields — no SQL required.
 *
 * Score breakdown (100 points total):
 *  - Ownership completeness  : 25 pts  (owner, steward, domain_manager, custodian)
 *  - Description quality     : 20 pts  (description length / richness)
 *  - Classification present  : 15 pts  (sensitivity + classification tags)
 *  - Lineage completeness    : 20 pts  (depends_on populated)
 *  - Tag coverage            : 10 pts  (≥1 tag)
 *  - Certified flag          : 10 pts  (certified: true in frontmatter)
 */

/**
 * Score ownership fields
 * @param {Object} asset
 * @returns {number} 0-25
 */
function scoreOwnership(asset) {
  let pts = 0;
  if (asset.owner && asset.owner !== 'unknown') pts += 10;
  if (asset.steward) pts += 5;
  if (asset.domain_manager) pts += 5;
  if (asset.custodian) pts += 5;
  return pts;
}

/**
 * Score description richness
 * @param {Object} asset
 * @returns {number} 0-20
 */
function scoreDescription(asset) {
  const desc = asset.description || '';
  if (desc.length === 0) return 0;
  if (desc.length < 50) return 5;
  if (desc.length < 150) return 10;
  if (desc.length < 300) return 15;
  return 20;
}

/**
 * Score classification completeness
 * @param {Object} asset
 * @returns {number} 0-15
 */
function scoreClassification(asset) {
  let pts = 0;
  if (asset.sensitivity && asset.sensitivity !== 'public') pts += 5;
  if (asset.sensitivity) pts += 5;
  const tags = asset.tags || [];
  const classificationTags = ['pii', 'gdpr', 'financial', 'hipaa', 'confidential', 'restricted'];
  if (tags.some((t) => classificationTags.includes(t.toLowerCase()))) pts += 5;
  return Math.min(pts, 15);
}

/**
 * Score lineage completeness
 * @param {Object} asset
 * @returns {number} 0-20
 */
function scoreLineage(asset) {
  const deps = asset.depends_on || [];
  if (deps.length === 0) return 5; // bonus for being a source
  if (deps.length <= 3) return 15;
  return 20;
}

/**
 * Score tag coverage
 * @param {Object} asset
 * @returns {number} 0-10
 */
function scoreTags(asset) {
  const tags = asset.tags || [];
  if (tags.length === 0) return 0;
  if (tags.length >= 3) return 10;
  return 5;
}

/**
 * Score certification flag
 * @param {Object} asset
 * @returns {number} 0-10
 */
function scoreCertification(asset) {
  return asset.certified === true ? 10 : 0;
}

/**
 * Derive a trust level label from a numeric score
 * @param {number} score
 * @returns {string} 'gold' | 'silver' | 'bronze' | 'unrated'
 */
function deriveTrustLevel(score) {
  if (score >= 85) return 'gold';
  if (score >= 65) return 'silver';
  if (score >= 40) return 'bronze';
  return 'unrated';
}

/**
 * Compute trust score for a single asset
 * @param {Object} asset - Parsed asset from markdownService
 * @returns {Object} { score, trustLevel, breakdown, certified }
 */
export function computeTrustScore(asset) {
  const breakdown = {
    ownership: scoreOwnership(asset),
    description: scoreDescription(asset),
    classification: scoreClassification(asset),
    lineage: scoreLineage(asset),
    tags: scoreTags(asset),
    certification: scoreCertification(asset),
  };

  const score = Object.values(breakdown).reduce((a, b) => a + b, 0);
  const trustLevel = asset.trust_level || deriveTrustLevel(score);
  const certified = asset.certified === true;

  return {
    score,
    trust_level: trustLevel,
    certified,
    certified_by: asset.certified_by || null,
    certification_date: asset.certification_date || null,
    breakdown,
  };
}

/**
 * Compute trust scores for all assets in a Map
 * @param {Map} assets
 * @returns {Map} assetId -> trust score object
 */
export function computeAllTrustScores(assets) {
  const result = new Map();
  for (const [id, asset] of assets) {
    result.set(id, computeTrustScore(asset));
  }
  return result;
}

/**
 * Get top N most trusted assets
 * @param {Map} assets
 * @param {number} n
 * @returns {Array}
 */
export function getTopTrustedAssets(assets, n = 10) {
  const scored = Array.from(assets.entries()).map(([id, asset]) => ({
    id,
    ...asset,
    trust: computeTrustScore(asset),
  }));

  return scored.sort((a, b) => b.trust.score - a.trust.score).slice(0, n);
}

export default {
  computeTrustScore,
  computeAllTrustScores,
  getTopTrustedAssets,
};
