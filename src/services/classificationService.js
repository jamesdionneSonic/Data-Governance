/**
 * Classification Service
 * Loads classification taxonomy from data/classification/taxonomy.yml
 * and auto-classifies data assets based on name/tag pattern matching.
 */

import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';
import yaml from 'yaml';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const TAXONOMY_PATH = path.resolve(dirName, '../../data/classification/taxonomy.yml');

let taxonomyCache = null;

/**
 * Load the classification taxonomy YAML
 * @returns {Object} Taxonomy definition
 */
export function loadTaxonomy() {
  if (taxonomyCache) return taxonomyCache;

  if (!existsSync(TAXONOMY_PATH)) {
    console.warn('[classificationService] taxonomy.yml not found, returning empty taxonomy');
    return { categories: [] };
  }

  try {
    const raw = readFileSync(TAXONOMY_PATH, 'utf-8');
    taxonomyCache = yaml.parse(raw);
    return taxonomyCache;
  } catch (err) {
    console.error('[classificationService] Failed to parse taxonomy.yml:', err.message);
    return { categories: [] };
  }
}

/**
 * Classify a single asset based on taxonomy pattern matching.
 * Checks asset name, tags, description, and sensitivity against each category's rules.
 *
 * @param {Object} asset - Parsed asset object from markdownService
 * @returns {string[]} Array of matched classification labels
 */
export function classifyAsset(asset) {
  const taxonomy = loadTaxonomy();
  const matched = [];

  const searchText = [asset.name || '', asset.description || '', ...(asset.tags || [])]
    .join(' ')
    .toLowerCase();

  for (const category of taxonomy.categories || []) {
    let hit = false;

    // Check name/text patterns
    for (const pattern of category.name_patterns || []) {
      if (new RegExp(pattern, 'i').test(searchText)) {
        hit = true;
        break;
      }
    }

    // Check sensitivity mapping
    if (!hit && category.sensitivity_triggers) {
      if (category.sensitivity_triggers.includes(asset.sensitivity)) {
        hit = true;
      }
    }

    // Check tag triggers
    if (!hit && category.tag_triggers) {
      const assetTags = asset.tags || [];
      if (category.tag_triggers.some((t) => assetTags.includes(t))) {
        hit = true;
      }
    }

    if (hit) matched.push(category.label);
  }

  return matched;
}

/**
 * Classify all assets in a Map and return a classification summary map
 * @param {Map} assets - Map of assetId -> asset objects
 * @returns {Map} assetId -> string[] classifications
 */
export function classifyAllAssets(assets) {
  const result = new Map();
  for (const [id, asset] of assets) {
    result.set(id, classifyAsset(asset));
  }
  return result;
}

/**
 * Reset taxonomy cache (useful for hot-reload in tests)
 */
export function resetTaxonomyCache() {
  taxonomyCache = null;
}

export default {
  loadTaxonomy,
  classifyAsset,
  classifyAllAssets,
  resetTaxonomyCache,
};
