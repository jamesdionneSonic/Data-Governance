/**
 * Governance Context Service
 * Assembles a unified governance context payload for a data asset.
 * Merges: asset metadata + lineage + classification + trust + glossary links
 *
 * This is a pure markdown/in-memory computation — no SQL required.
 */

import { computeTrustScore } from './trustService.js';
import { classifyAsset } from './classificationService.js';
import { resolveAssetGlossaryLinks } from './glossaryService.js';

/**
 * Resolve upstream and downstream assets from a lineage graph Map
 * @param {string} assetId
 * @param {Map} lineageGraph
 * @returns {{ upstream: string[], downstream: string[] }}
 */
function resolveLineage(assetId, lineageGraph) {
  const node = lineageGraph ? lineageGraph.get(assetId) : null;

  if (!node) {
    return { upstream: [], downstream: [] };
  }

  const upstream = node instanceof Set ? Array.from(node) : node.upstream || node.depends_on || [];

  const downstream = [];
  if (lineageGraph) {
    for (const [candidateId, deps] of lineageGraph.entries()) {
      if (deps instanceof Set && deps.has(assetId)) {
        downstream.push(candidateId);
      }
    }
  }

  return {
    upstream,
    downstream,
  };
}

/**
 * Build the full governance context for a single asset
 *
 * @param {string} assetId - e.g. "sales.orders"
 * @param {Map} assets - All loaded asset objects
 * @param {Map} lineageGraph - Lineage graph (may be null)
 * @param {Array} glossaryTerms - Optional glossary terms for semantic links
 * @returns {Object} Full governance context payload
 */
export function buildGovernanceContext(assetId, assets, lineageGraph, glossaryTerms = []) {
  const asset = assets ? assets.get(assetId) : null;

  if (!asset) {
    return null;
  }

  const trust = computeTrustScore(asset);
  const classifications = classifyAsset(asset);
  const lineage = resolveLineage(assetId, lineageGraph);
  const glossaryLinks = resolveAssetGlossaryLinks(assetId, asset, glossaryTerms);

  return {
    asset_id: assetId,
    asset: {
      name: asset.name,
      database: asset.database,
      type: asset.type,
      owner: asset.owner || null,
      steward: asset.steward || null,
      domain_manager: asset.domain_manager || null,
      custodian: asset.custodian || null,
      sensitivity: asset.sensitivity,
      tags: asset.tags || [],
      description: asset.description || '',
      last_updated: asset.last_updated || null,
      certified: asset.certified === true,
      trust_level: asset.trust_level || trust.trust_level,
    },
    trust,
    classifications,
    lineage,
    glossary_links: glossaryLinks,
    generated_at: new Date().toISOString(),
  };
}

/**
 * Build governance summaries for all assets (lighter payload for lists)
 * @param {Map} assets
 * @returns {Array}
 */
export function buildGovernanceSummaries(assets) {
  if (!assets) return [];

  const summaries = [];
  for (const [id, asset] of assets) {
    const trust = computeTrustScore(asset);
    const classifications = classifyAsset(asset);

    summaries.push({
      asset_id: id,
      name: asset.name,
      database: asset.database,
      type: asset.type,
      owner: asset.owner || null,
      steward: asset.steward || null,
      sensitivity: asset.sensitivity,
      classifications,
      trust_score: trust.score,
      trust_level: trust.trust_level,
      certified: trust.certified,
    });
  }

  return summaries.sort((a, b) => b.trust_score - a.trust_score);
}

export default {
  buildGovernanceContext,
  buildGovernanceSummaries,
};
