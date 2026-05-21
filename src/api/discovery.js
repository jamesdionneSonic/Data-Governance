/**
 * Discovery Routes
 * Discovery dashboard and insights endpoints
 */

import { createApiRouter } from '../utils/apiRouter.js';
import { authenticate } from '../middleware/auth.js';
import { sendErrorResponse } from '../middleware/errorHandler.js';
import {
  getDashboardSummary,
  getRecommendations,
  getLineageInsights,
  getQualityMetrics,
  getActivitySummary,
} from '../services/discoveryService.js';
import {
  buildCytoscapeGraph,
  buildCenteredLineageGraph,
  buildD3Graph,
  buildMermaidDiagram,
  buildImpactVisualization,
  buildDependencyMatrix,
} from '../services/visualizationService.js';
import { createTtlCache } from '../utils/ttlCache.js';

const router = createApiRouter();

// Storage (will be set by app context when endpoints are called)
let cachedObjects = new Map();
let cachedLineageGraph = new Map();
const discoveryCache = createTtlCache({ ttlMs: 30000, maxSize: 300 });

function getOrSetCache(key, buildValue) {
  const cached = discoveryCache.get(key);
  if (cached) {
    return cached;
  }

  const value = buildValue();
  discoveryCache.set(key, value);
  return value;
}

/**
 * Set cache data
 * Called by app.js after loading markdown
 */
export function setDiscoveryCache(objects, lineageGraph) {
  cachedObjects = objects;
  cachedLineageGraph = lineageGraph;
  discoveryCache.clear();
}

/**
 * GET /api/v1/discovery/dashboard
 * Main discovery dashboard summary
 * Requires authentication
 */
router.get('/dashboard', authenticate, (req, res) => {
  try {
    if (cachedObjects.size === 0) {
      return sendErrorResponse(
        res,
        req,
        503,
        'Data not yet loaded. Run ingestion endpoint first.',
        {
          code: 'SERVICE_UNAVAILABLE',
        }
      );
    }

    const summary = getOrSetCache('dashboard', () =>
      getDashboardSummary(cachedObjects, cachedLineageGraph)
    );

    return res.json({
      status: 'success',
      message: 'Dashboard summary retrieved',
      data: summary,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'DASHBOARD_ERROR',
    });
  }
});

/**
 * GET /api/v1/discovery/recommendations
 * Recommended objects to explore
 * Requires authentication
 */
router.get('/recommendations', authenticate, (req, res) => {
  try {
    if (cachedObjects.size === 0) {
      return sendErrorResponse(res, req, 503, 'Data not yet loaded', {
        code: 'SERVICE_UNAVAILABLE',
      });
    }

    const recommendations = getOrSetCache('recommendations', () =>
      getRecommendations(cachedObjects, cachedLineageGraph)
    );

    return res.json({
      status: 'success',
      message: 'Recommendations retrieved',
      data: recommendations,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'RECOMMENDATIONS_ERROR',
    });
  }
});

/**
 * GET /api/v1/discovery/insights
 * Lineage insights and warnings
 * Requires authentication
 */
router.get('/insights', authenticate, (req, res) => {
  try {
    if (cachedObjects.size === 0) {
      return sendErrorResponse(res, req, 503, 'Data not yet loaded', {
        code: 'SERVICE_UNAVAILABLE',
      });
    }

    const insights = getOrSetCache('insights', () =>
      getLineageInsights(cachedObjects, cachedLineageGraph)
    );

    return res.json({
      status: 'success',
      message: 'Insights retrieved',
      data: insights,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'INSIGHTS_ERROR',
    });
  }
});

/**
 * GET /api/v1/discovery/quality
 * Data quality metrics
 * Requires authentication
 */
router.get('/quality', authenticate, (req, res) => {
  try {
    const metrics = getOrSetCache('quality', () =>
      getQualityMetrics(cachedObjects, cachedLineageGraph)
    );

    return res.json({
      status: 'success',
      message: 'Quality metrics retrieved',
      data: metrics,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'QUALITY_METRICS_ERROR',
    });
  }
});

/**
 * GET /api/v1/discovery/activity
 * Recent activity summary
 * Requires authentication
 */
router.get('/activity', authenticate, (req, res) => {
  try {
    const activity = getOrSetCache('activity', () => getActivitySummary(cachedObjects));

    return res.json({
      status: 'success',
      message: 'Activity summary retrieved',
      data: activity,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'ACTIVITY_ERROR',
    });
  }
});

/**
 * GET /api/v1/discovery/graph/:objectId
 * Get visualization data for object lineage
 * Query params: format (centered|cytoscape|d3|mermaid), depth (1-5)
 * Requires authentication
 */
/**
 * GET /api/v1/discovery/graph/:objectId
 * Get visualization data for object lineage
 * Query params: format (centered|cytoscape|d3|mermaid), depth (1-5)
 * Requires authentication
 */
router.get('/graph/:objectId', authenticate, (req, res) => {
  try {
    const { objectId } = req.params;
    const { format = 'cytoscape', depth = 2 } = req.query;

    if (!cachedObjects.has(objectId)) {
      return sendErrorResponse(res, req, 404, `Object not found: ${objectId}`, {
        code: 'NOT_FOUND',
      });
    }

    const normalizedFormat = format.toLowerCase();
    const parsedDepth = parseInt(depth, 10);
    const focusObject = cachedObjects.get(objectId);
    const isDataObject = ['table', 'view'].includes(String(focusObject?.type || '').toLowerCase());
    let effectiveDepth = 2;
    if (Number.isFinite(parsedDepth)) {
      effectiveDepth = parsedDepth;
    }
    if (isDataObject && effectiveDepth < 4) {
      effectiveDepth = 4;
    }
    const graphCacheKey = `graph:${objectId}:${normalizedFormat}:${effectiveDepth}`;

    const graphData = getOrSetCache(graphCacheKey, () => {
      switch (normalizedFormat) {
        case 'centered':
          return buildCenteredLineageGraph(objectId, cachedObjects, {
            maxBridgeDepth: effectiveDepth,
            groupSsis: true,
          });
        case 'd3':
          return buildD3Graph(objectId, cachedLineageGraph, cachedObjects, effectiveDepth);
        case 'mermaid':
          return buildMermaidDiagram(objectId, cachedLineageGraph, cachedObjects, effectiveDepth);
        case 'cytoscape':
        default:
          return buildCytoscapeGraph(objectId, cachedLineageGraph, cachedObjects, effectiveDepth);
      }
    });

    return res.json({
      status: 'success',
      message: 'Graph data retrieved',
      format: normalizedFormat,
      data: graphData,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'GRAPH_ERROR',
    });
  }
});

/**
 * GET /api/v1/discovery/impact/:objectId
 * Get impact analysis for object
 * Requires authentication
 */
router.get('/impact/:objectId', authenticate, (req, res) => {
  try {
    const { objectId } = req.params;

    if (!cachedObjects.has(objectId)) {
      return sendErrorResponse(res, req, 404, `Object not found: ${objectId}`, {
        code: 'NOT_FOUND',
      });
    }

    const impact = getOrSetCache(`impact:${objectId}`, () =>
      buildImpactVisualization(objectId, cachedLineageGraph, cachedObjects)
    );

    return res.json({
      status: 'success',
      message: 'Impact analysis retrieved',
      data: impact,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'IMPACT_ERROR',
    });
  }
});

/**
 * GET /api/v1/discovery/audit/:objectId
 * Build a strict edge audit for a focus object
 * Requires authentication
 */
router.get('/audit/:objectId', authenticate, (req, res) => {
  try {
    const { objectId } = req.params;
    const { depth = 5 } = req.query;

    if (!cachedObjects.has(objectId)) {
      return sendErrorResponse(res, req, 404, `Object not found: ${objectId}`, {
        code: 'NOT_FOUND',
      });
    }

    const parsedDepth = parseInt(depth, 10);
    const effectiveDepth = Number.isFinite(parsedDepth) ? parsedDepth : 5;
    const centeredGraph = buildCenteredLineageGraph(objectId, cachedObjects, {
      maxBridgeDepth: effectiveDepth,
      groupSsis: true,
    });

    const auditEdges = centeredGraph.edges.map((edge) => {
      const sourceId = edge.data.source;
      const targetId = edge.data.target;
      const source = cachedObjects.get(sourceId);
      const target = cachedObjects.get(targetId);
      const sourceType = String(source?.type || 'unknown').toLowerCase();
      const targetType = String(target?.type || 'unknown').toLowerCase();
      const classes = Array.isArray(edge.classes)
        ? edge.classes
        : String(edge.classes || '').split(/\s+/);
      const lowerSourceId = sourceId.toLowerCase();
      const lowerTargetId = targetId.toLowerCase();

      let classification = 'related';
      if (sourceId === objectId || targetId === objectId) {
        classification = 'direct';
      } else if (
        classes.includes('bridge-edge') ||
        classes.includes('ssis-load-edge') ||
        sourceType === 'synonym' ||
        targetType === 'synonym' ||
        sourceType === 'package' ||
        targetType === 'package' ||
        lowerSourceId.startsWith('ssisdb.') ||
        lowerTargetId.startsWith('ssisdb.') ||
        lowerSourceId.includes('etl_staging') ||
        lowerTargetId.includes('etl_staging')
      ) {
        classification = 'bridge';
      } else if (classes.includes('producer-edge') || classes.includes('consumer-edge')) {
        classification = 'derived';
      }

      return {
        source: sourceId,
        target: targetId,
        type: edge.data.label,
        classification,
        sourceType,
        targetType,
        sourceLabel: source?.packageName || source?.name || sourceId,
        targetLabel: target?.packageName || target?.name || targetId,
        sourceDatabase: source?.database || null,
        targetDatabase: target?.database || null,
      };
    });

    return res.json({
      status: 'success',
      message: 'Audit retrieved',
      data: {
        objectId,
        depth: effectiveDepth,
        totalEdges: auditEdges.length,
        directEdges: auditEdges.filter((edge) => edge.classification === 'direct').length,
        bridgeEdges: auditEdges.filter((edge) => edge.classification === 'bridge').length,
        derivedEdges: auditEdges.filter((edge) => edge.classification === 'derived').length,
        relatedEdges: auditEdges.filter((edge) => edge.classification === 'related').length,
        edges: auditEdges,
      },
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'AUDIT_ERROR',
    });
  }
});

/**
 * GET /api/v1/discovery/matrix/:database
 * Get dependency matrix for database
 * Requires authentication
 */
router.get('/matrix/:database', authenticate, (req, res) => {
  try {
    const { database } = req.params;

    const matrix = getOrSetCache(`matrix:${database}`, () =>
      buildDependencyMatrix(database, cachedObjects, cachedLineageGraph)
    );

    return res.json({
      status: 'success',
      message: 'Dependency matrix retrieved',
      data: matrix,
    });
  } catch (err) {
    return sendErrorResponse(res, req, 500, err.message, {
      code: 'MATRIX_ERROR',
    });
  }
});

export default router;
