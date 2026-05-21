/**
 * Products API Routes
 * Serves Data Product definitions from data/products/*.md
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import {
  loadAllProducts,
  getProductById,
  getProductsByDomain,
  getCertifiedProducts,
  saveProduct,
} from '../services/productService.js';

const router = createApiRouter();

/**
 * GET /api/v1/products
 * List all data products
 * Query params: domain, certified, status
 */
router.get('/', authenticate, (req, res) => {
  const { domain, certified, status } = req.query;

  let products = loadAllProducts();

  if (domain) {
    products = getProductsByDomain(domain);
  }

  if (certified === 'true') {
    products = products.filter((p) => p.certified);
  }

  if (status) {
    products = products.filter((p) => p.status === status);
  }

  return res.json({
    status: 'success',
    count: products.length,
    products: products.map((p) => ({
      slug: p.slug,
      product_id: p.product_id,
      name: p.name,
      version: p.version,
      status: p.status,
      domain: p.domain,
      owner: p.owner,
      steward: p.steward,
      assets: p.assets,
      sla: p.sla,
      tags: p.tags,
      certified: p.certified,
      trust_level: p.trust_level,
      consumers: p.consumers,
      last_updated: p.last_updated,
    })),
  });
});

/**
 * GET /api/v1/products/certified
 * List only certified products
 */
router.get('/certified', authenticate, (_req, res) => {
  const products = getCertifiedProducts();
  return res.json({ status: 'success', count: products.length, products });
});

/**
 * GET /api/v1/products/:id
 * Get a single data product by slug or product_id
 */
router.get('/:id', authenticate, (req, res) => {
  const product = getProductById(req.params.id);

  if (!product) {
    return sendErrorResponse(res, req, 404, `Data Product '${req.params.id}' not found`, {
      code: 'NOT_FOUND',
    });
  }

  return res.json({ status: 'success', product });
});

/**
 * POST /api/v1/products
 * Create a new data product
 * Body: { name, domain, owner, assets, sla, tags, description, ... }
 */
router.post('/', authenticate, (req, res) => {
  const { name, domain } = req.body;

  if (!name) {
    return sendErrorResponse(res, req, 400, 'name is required', {
      code: 'BAD_REQUEST',
    });
  }

  const slug = name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const existing = getProductById(slug);
  if (existing) {
    return sendErrorResponse(res, req, 409, `Product '${name}' already exists`, {
      code: 'CONFLICT',
    });
  }

  try {
    const saved = saveProduct(slug, { ...req.body, domain: domain || 'General' });
    return res.status(201).json({ status: 'success', product: saved });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'PRODUCT_CREATE_ERROR',
    });
  }
});

/**
 * PUT /api/v1/products/:id
 * Update an existing data product
 */
router.put('/:id', authenticate, (req, res) => {
  const product = getProductById(req.params.id);

  if (!product) {
    return sendErrorResponse(res, req, 404, `Data Product '${req.params.id}' not found`, {
      code: 'NOT_FOUND',
    });
  }

  try {
    const updated = saveProduct(product.slug, { ...product, ...req.body });
    return res.json({ status: 'success', product: updated });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'PRODUCT_UPDATE_ERROR',
    });
  }
});

export default router;
