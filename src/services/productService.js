/**
 * Product Service
 * Reads Data Product markdown files from data/products/*.md
 */

import { readFileSync, readdirSync, writeFileSync } from 'fs';
import path, { join, extname, basename } from 'path';
import yaml from 'yaml';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const dirName = path.dirname(fileName);

const PRODUCTS_DIR = path.resolve(dirName, '../../data/products');

/**
 * Parse a single data product markdown file
 * @param {string} filePath
 * @returns {Object}
 */
function parseProductFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);

  if (!fmMatch) {
    throw new Error(`No YAML frontmatter in ${filePath}`);
  }

  const meta = yaml.parse(fmMatch[1]);
  const body = content.substring(fmMatch[0].length).trim();
  const slug = basename(filePath, '.md');

  return {
    slug,
    product_id: meta.product_id || slug,
    name: meta.name || slug,
    version: meta.version || '1.0.0',
    status: meta.status || 'draft',
    domain: meta.domain || 'General',
    owner: meta.owner || 'unknown',
    steward: meta.steward || null,
    assets: meta.assets || [],
    sla: meta.sla || {},
    tags: meta.tags || [],
    certified: meta.certified === true,
    certified_by: meta.certified_by || null,
    certification_date: meta.certification_date || null,
    trust_level: meta.trust_level || 'unrated',
    consumers: meta.consumers || [],
    output_port: meta.output_port || {},
    created_at: meta.created_at || null,
    last_updated: meta.last_updated || null,
    description: body,
    filePath,
  };
}

/**
 * Load all data product markdown files
 * @returns {Array}
 */
export function loadAllProducts() {
  const products = [];

  let entries;
  try {
    entries = readdirSync(PRODUCTS_DIR, { withFileTypes: true });
  } catch {
    return [];
  }

  for (const entry of entries) {
    if (entry.isFile() && extname(entry.name) === '.md') {
      try {
        products.push(parseProductFile(join(PRODUCTS_DIR, entry.name)));
      } catch (err) {
        console.error(`[productService] Error parsing ${entry.name}:`, err.message);
      }
    }
  }

  return products.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Get a single product by slug or product_id
 * @param {string} id - slug or product_id
 * @returns {Object|null}
 */
export function getProductById(id) {
  const all = loadAllProducts();
  return all.find((p) => p.slug === id || p.product_id === id) || null;
}

/**
 * Get all products in a given domain
 * @param {string} domain
 * @returns {Array}
 */
export function getProductsByDomain(domain) {
  return loadAllProducts().filter((p) => p.domain.toLowerCase() === domain.toLowerCase());
}

/**
 * Get certified (trust_level=gold/silver) products
 * @returns {Array}
 */
export function getCertifiedProducts() {
  return loadAllProducts().filter((p) => p.certified);
}

/**
 * Save/update a data product markdown file
 * @param {string} slug
 * @param {Object} productData
 * @returns {Object}
 */
export function saveProduct(slug, productData) {
  const frontmatter = yaml.stringify({
    name: productData.name,
    product_id: productData.product_id || slug,
    version: productData.version || '1.0.0',
    status: productData.status || 'draft',
    domain: productData.domain || 'General',
    owner: productData.owner || 'unknown',
    steward: productData.steward || null,
    assets: productData.assets || [],
    sla: productData.sla || {},
    tags: productData.tags || [],
    certified: productData.certified || false,
    certified_by: productData.certified_by || null,
    certification_date: productData.certification_date || null,
    trust_level: productData.trust_level || 'unrated',
    consumers: productData.consumers || [],
    output_port: productData.output_port || {},
    created_at: productData.created_at || new Date().toISOString().split('T')[0],
    last_updated: new Date().toISOString().split('T')[0],
  });

  const body = productData.description || `# ${productData.name}\n\n## Overview\n\n`;
  const content = `---\n${frontmatter}---\n\n${body}\n`;

  const filePath = join(PRODUCTS_DIR, `${slug}.md`);
  writeFileSync(filePath, content, 'utf-8');

  return parseProductFile(filePath);
}

export default {
  loadAllProducts,
  getProductById,
  getProductsByDomain,
  getCertifiedProducts,
  saveProduct,
};
