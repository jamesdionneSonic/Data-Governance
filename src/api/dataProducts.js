import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import {
  DATA_PRODUCT_STATE,
  createDataProduct,
  getDataProduct,
  listDataProducts,
  addContractVersion,
  transitionDataProductState,
  recordContractViolation,
  exportContractCompliance,
} from '../services/dataProductContractService.js';

const router = createApiRouter();

function isAdmin(user = {}) {
  return Array.isArray(user.roles) && user.roles.includes('Admin');
}

function actorFromUser(user = {}) {
  return {
    userId: user.sub,
    email: user.email,
    name: user.name,
  };
}

function canManageProduct(user, product) {
  if (!product) {
    return false;
  }

  if (isAdmin(user)) {
    return true;
  }

  const subjectId = user?.sub;
  if (!subjectId) {
    return false;
  }

  return product.owner?.userId === subjectId || product.steward?.userId === subjectId;
}

router.use(authenticate);

router.post('/products', (req, res) => {
  try {
    const created = createDataProduct(req.body, actorFromUser(req.user));
    return res.status(201).json({
      status: 'success',
      message: 'Data product created',
      data: created,
    });
  } catch (err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message,
    });
  }
});

router.get('/products', (req, res) => {
  const { state, domain, ownerUserId, stewardUserId } = req.query;

  const products = listDataProducts({
    state,
    domain,
    ownerUserId,
    stewardUserId,
  });

  return res.json({
    status: 'success',
    data: {
      products,
      count: products.length,
    },
  });
});

router.get('/products/:productId', (req, res) => {
  const product = getDataProduct(req.params.productId);

  if (!product) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Data product not found',
    });
  }

  return res.json({
    status: 'success',
    data: product,
  });
});

router.post('/products/:productId/contracts', (req, res) => {
  const product = getDataProduct(req.params.productId);

  if (!product) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Data product not found',
    });
  }

  if (!canManageProduct(req.user, product)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Owner, steward, or admin role required',
    });
  }

  try {
    const updated = addContractVersion(req.params.productId, req.body, actorFromUser(req.user));

    return res.status(201).json({
      status: 'success',
      message: 'Contract version added',
      data: updated,
    });
  } catch (err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message,
    });
  }
});

router.post('/products/:productId/state', (req, res) => {
  const product = getDataProduct(req.params.productId);

  if (!product) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Data product not found',
    });
  }

  if (!canManageProduct(req.user, product)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Owner, steward, or admin role required',
    });
  }

  const { state, reason = '' } = req.body;

  if (!state) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'state is required',
    });
  }

  try {
    const updated = transitionDataProductState(
      req.params.productId,
      state,
      actorFromUser(req.user),
      reason
    );

    return res.json({
      status: 'success',
      message: `Data product moved to ${updated.state}`,
      data: updated,
    });
  } catch (err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message,
    });
  }
});

router.post('/products/:productId/violations', (req, res) => {
  const product = getDataProduct(req.params.productId);

  if (!product) {
    return res.status(404).json({
      error: 'Not Found',
      message: 'Data product not found',
    });
  }

  if (!canManageProduct(req.user, product)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Owner, steward, or admin role required',
    });
  }

  try {
    const updated = recordContractViolation(
      req.params.productId,
      req.body,
      actorFromUser(req.user)
    );

    return res.status(201).json({
      status: 'success',
      message: 'Contract violation recorded',
      data: updated,
    });
  } catch (err) {
    return res.status(400).json({
      error: 'Bad Request',
      message: err.message,
    });
  }
});

router.get('/contracts/export/compliance', (req, res) => {
  if (!isAdmin(req.user)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin role required to export contract compliance',
    });
  }

  const exportData = exportContractCompliance(req.query || {});

  return res.json({
    status: 'success',
    data: exportData,
  });
});

router.get('/schema', (_req, res) => {
  res.json({
    description: 'Data Product Contracts & SLA Management Schema',
    enums: {
      state: Object.values(DATA_PRODUCT_STATE),
      severity: ['low', 'medium', 'high', 'critical'],
    },
    endpoints: {
      createProduct: 'POST /api/v1/data-products/products',
      listProducts: 'GET /api/v1/data-products/products',
      getProduct: 'GET /api/v1/data-products/products/:productId',
      addContractVersion: 'POST /api/v1/data-products/products/:productId/contracts',
      transitionState: 'POST /api/v1/data-products/products/:productId/state',
      recordViolation: 'POST /api/v1/data-products/products/:productId/violations',
      exportCompliance: 'GET /api/v1/data-products/contracts/export/compliance',
    },
  });
});

export default router;
