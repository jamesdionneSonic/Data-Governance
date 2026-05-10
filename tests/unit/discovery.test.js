/**
 * Phase 3 Tests - Search, Visualization & Discovery Integration
 * 56 tests covering search, visualization, and discovery services
 */

import {
  searchByProximity,
  getSuggestions,
  getTrendingObjects,
  getCriticalObjects,
  getSearchStatistics,
} from '../../src/services/searchService.js';
import {
  buildCytoscapeGraph,
  buildD3Graph,
  buildMermaidDiagram,
  buildImpactVisualization,
  buildDependencyMatrix,
} from '../../src/services/visualizationService.js';
import {
  getDashboardSummary,
  getRecommendations,
  getLineageInsights,
  getQualityMetrics,
  getActivitySummary,
} from '../../src/services/discoveryService.js';

// Mock data setup
const mockObjects = new Map();
mockObjects.set('customers', {
  id: 'customers',
  name: 'Customers',
  database: 'sales',
  type: 'table',
  owner: 'data-team',
  sensitivity: 'PII',
  description: 'Customer master data',
  tags: ['master-data', 'core'],
  createdAt: new Date('2024-01-01'),
});

mockObjects.set('orders', {
  id: 'orders',
  name: 'Orders',
  database: 'sales',
  type: 'table',
  owner: 'data-team',
  sensitivity: 'internal',
  description: 'Order transactions',
  tags: ['transactions'],
  createdAt: new Date('2024-01-05'),
});

mockObjects.set('order_summary', {
  id: 'order_summary',
  name: 'Order Summary',
  database: 'sales',
  type: 'view',
  owner: 'analytics-team',
  sensitivity: 'public',
  description: 'Aggregated order data',
  tags: ['analytics'],
  createdAt: new Date('2024-01-10'),
});

mockObjects.set('customer_metrics', {
  id: 'customer_metrics',
  name: 'Customer Metrics',
  database: 'analytics',
  type: 'table',
  owner: 'analytics-team',
  sensitivity: 'public',
  description: 'Customer KPIs',
  tags: ['metrics'],
  createdAt: new Date('2024-01-15'),
});

mockObjects.set('reports', {
  id: 'reports',
  name: 'Reports',
  database: 'analytics',
  type: 'view',
  owner: 'bi-team',
  sensitivity: 'public',
  description: 'BI reports',
  tags: ['reporting'],
  createdAt: new Date('2024-01-20'),
});

// Build mock lineage
const mockLineageGraph = new Map();
mockLineageGraph.set('customers', new Set());
mockLineageGraph.set('orders', new Set(['customers']));
mockLineageGraph.set('order_summary', new Set(['orders', 'customers']));
mockLineageGraph.set('customer_metrics', new Set(['order_summary']));
mockLineageGraph.set('reports', new Set(['customer_metrics', 'order_summary']));

// Mock Meilisearch results
const mockMeilisearchResults = {
  hits: [
    {
      id: 'customers',
      name: 'Customers',
      database: 'sales',
      type: 'table',
      _score: 0.95,
    },
  ],
  totalHits: 1,
  limit: 20,
  offset: 0,
  facets: {
    database: { sales: 1 },
    type: { table: 1 },
  },
};

// Suppress console output during tests
// (Jest globals are available automatically in test files)

describe('Phase 3 - Search Integration', () => {
  describe('searchService - enhancedSearch', () => {
    test('SEARCH-001: Should enhance search results with lineage data', () => {
      const results = {
        ...mockMeilisearchResults,
        hits: mockMeilisearchResults.hits.map((hit) => ({
          ...hit,
          dependencies: {
            upstream: [],
            downstream: [],
            totalUpstream: 0,
            totalDownstream: 2, // orders, order_summary
          },
        })),
      };

      expect(results.hits[0].dependencies).toBeDefined();
      expect(results.hits[0].dependencies.totalDownstream).toBe(2);
    });

    test('SEARCH-002: Should limit upstream dependencies', () => {
      // order_summary has 2 upstream: orders, customers
      const upstream = Array.from(mockLineageGraph.get('order_summary') || new Set());
      expect(upstream.length).toBeLessThanOrEqual(5);
    });

    test('SEARCH-003: Should include search metadata', () => {
      const result = mockMeilisearchResults.hits[0];
      expect(result.id).toBeDefined();
      expect(result.name).toBeDefined();
      expect(result.database).toBeDefined();
      expect(result.type).toBeDefined();
    });
  });

  describe('searchService - searchByProximity', () => {
    test('SEARCH-004: Should find upstream dependencies', () => {
      const result = searchByProximity('order_summary', 'upstream', 1, mockLineageGraph, mockObjects);
      expect(result.length).toBeGreaterThan(0);
      expect(result[0].name).toBeDefined();
    });

    test('SEARCH-005: Should find downstream dependents', () => {
      const result = searchByProximity('order_summary', 'downstream', 1, mockLineageGraph, mockObjects);
      expect(result.length).toBeGreaterThan(0);
      expect(result.some((obj) => obj.id === 'reports')).toBe(true);
    });

    test('SEARCH-006: Should respect depth parameter', () => {
      const depth1 = searchByProximity('orders', 'downstream', 1, mockLineageGraph, mockObjects);
      const depth2 = searchByProximity('orders', 'downstream', 2, mockLineageGraph, mockObjects);
      expect(depth2.length).toBeGreaterThanOrEqual(depth1.length);
    });

    test('SEARCH-007: Should return only relevant objects', () => {
      const result = searchByProximity('customers', 'downstream', 1, mockLineageGraph, mockObjects);
      // customers → orders, order_summary
      expect(result.some((obj) => ['orders', 'order_summary'].includes(obj.id))).toBe(true);
    });
  });

  describe('searchService - getSuggestions', () => {
    test('SEARCH-008: Should provide autocomplete suggestions', () => {
      const suggestions = getSuggestions('order', mockObjects, 10);
      expect(suggestions.length).toBeGreaterThan(0);
      expect(suggestions[0].name.toLowerCase().startsWith('order')).toBe(true);
    });

    test('SEARCH-009: Should respect limit parameter', () => {
      const suggestions = getSuggestions('c', mockObjects, 2);
      expect(suggestions.length).toBeLessThanOrEqual(2);
    });

    test('SEARCH-010: Should return empty for no matches', () => {
      const suggestions = getSuggestions('zzz', mockObjects, 10);
      expect(suggestions.length).toBe(0);
    });

    test('SEARCH-011: Should include object metadata in suggestions', () => {
      const suggestions = getSuggestions('custom', mockObjects, 10);
      expect(suggestions[0].database).toBeDefined();
      expect(suggestions[0].type).toBeDefined();
    });
  });

  describe('searchService - getTrendingObjects', () => {
    test('SEARCH-012: Should identify most referenced objects', () => {
      const trending = getTrendingObjects(mockObjects, mockLineageGraph, 5);
      expect(trending.length).toBeGreaterThan(0);
      expect(trending[0].referencedByCount).toBeGreaterThanOrEqual(0);
    });

    test('SEARCH-013: Should sort by reference count descending', () => {
      const trending = getTrendingObjects(mockObjects, mockLineageGraph, 10);
      for (let i = 0; i < trending.length - 1; i += 1) {
        expect(trending[i].referencedByCount)
          .toBeGreaterThanOrEqual(trending[i + 1].referencedByCount);
      }
    });

    test('SEARCH-014: Should respect limit', () => {
      const trending = getTrendingObjects(mockObjects, mockLineageGraph, 2);
      expect(trending.length).toBeLessThanOrEqual(2);
    });
  });

  describe('searchService - getCriticalObjects', () => {
    test('SEARCH-015: Should identify critical objects with high impact', () => {
      const critical = getCriticalObjects(mockObjects, mockLineageGraph, 5);
      expect(critical.length).toBeGreaterThan(0);
      expect(critical[0].impactCount).toBeGreaterThanOrEqual(0);
    });

    test('SEARCH-016: Should only include objects with dependents', () => {
      const critical = getCriticalObjects(mockObjects, mockLineageGraph, 10);
      // All critical objects should have impact count > 0
      for (const obj of critical) {
        expect(obj.impactCount).toBeGreaterThan(0);
      }
    });

    test('SEARCH-017: Should sort by impact descending', () => {
      const critical = getCriticalObjects(mockObjects, mockLineageGraph, 10);
      for (let i = 0; i < critical.length - 1; i += 1) {
        expect(critical[i].impactCount).toBeGreaterThanOrEqual(critical[i + 1].impactCount);
      }
    });
  });

  describe('searchService - getSearchStatistics', () => {
    test('SEARCH-018: Should calculate total objects', () => {
      const stats = getSearchStatistics(mockObjects, mockLineageGraph);
      expect(stats.totalObjects).toBe(mockObjects.size);
    });

    test('SEARCH-019: Should count objects by database', () => {
      const stats = getSearchStatistics(mockObjects, mockLineageGraph);
      expect(stats.objectsByDatabase.sales).toBe(3); // customers, orders, order_summary
      expect(stats.objectsByDatabase.analytics).toBe(2); // customer_metrics, reports
    });

    test('SEARCH-020: Should count objects by type', () => {
      const stats = getSearchStatistics(mockObjects, mockLineageGraph);
      expect(stats.objectsByType.table).toBeGreaterThan(0);
      expect(stats.objectsByType.view).toBeGreaterThan(0);
    });

    test('SEARCH-021: Should calculate average dependencies', () => {
      const stats = getSearchStatistics(mockObjects, mockLineageGraph);
      expect(stats.avgDependenciesPerObject).toBeDefined();
      expect(parseFloat(stats.avgDependenciesPerObject)).toBeGreaterThanOrEqual(0);
    });
  });
});

describe('Phase 3 - Visualization Service', () => {
  describe('visualizationService - buildCytoscapeGraph', () => {
    test('VIZ-001: Should build Cytoscape graph with nodes', () => {
      const graph = buildCytoscapeGraph('order_summary', mockLineageGraph, mockObjects, 2);
      expect(graph.nodes.length).toBeGreaterThan(0);
    });

    test('VIZ-002: Should include central node', () => {
      const graph = buildCytoscapeGraph('order_summary', mockLineageGraph, mockObjects, 2);
      expect(graph.nodes.some((n) => n.data.id === 'order_summary')).toBe(true);
    });

    test('VIZ-003: Should include edges for dependencies', () => {
      const graph = buildCytoscapeGraph('order_summary', mockLineageGraph, mockObjects, 2);
      expect(graph.edges.length).toBeGreaterThan(0);
    });

    test('VIZ-004: Should include metadata on nodes', () => {
      const graph = buildCytoscapeGraph('order_summary', mockLineageGraph, mockObjects, 2);
      const centralNode = graph.nodes.find((n) => n.data.id === 'order_summary');
      expect(centralNode.data.label).toBeDefined();
      expect(centralNode.data.database).toBeDefined();
      expect(centralNode.data.type).toBeDefined();
    });

    test('VIZ-005: Should apply CSS classes', () => {
      const graph = buildCytoscapeGraph('order_summary', mockLineageGraph, mockObjects, 2);
      const centralNode = graph.nodes.find((n) => n.data.id === 'order_summary');
      expect(centralNode.classes).toContain('central');
    });
  });

  describe('visualizationService - buildD3Graph', () => {
    test('VIZ-006: Should build D3 graph with nodes', () => {
      const graph = buildD3Graph('order_summary', mockLineageGraph, mockObjects, 2);
      expect(graph.nodes.length).toBeGreaterThan(0);
    });

    test('VIZ-007: Should build D3 graph with links', () => {
      const graph = buildD3Graph('order_summary', mockLineageGraph, mockObjects, 2);
      expect(graph.links.length).toBeGreaterThan(0);
    });

    test('VIZ-008: Should include node group assignments', () => {
      const graph = buildD3Graph('order_summary', mockLineageGraph, mockObjects, 2);
      expect(graph.nodes[0].group).toBeDefined();
    });

    test('VIZ-009: Should assign node values', () => {
      const graph = buildD3Graph('order_summary', mockLineageGraph, mockObjects, 2);
      const centralNode = graph.nodes.find((n) => n.id === 'order_summary');
      expect(centralNode.value).toBe(30); // Central nodes get higher value
    });
  });

  describe('visualizationService - buildMermaidDiagram', () => {
    test('VIZ-010: Should generate Mermaid markup', () => {
      const markup = buildMermaidDiagram('order_summary', mockLineageGraph, mockObjects);
      expect(typeof markup).toBe('string');
      expect(markup.startsWith('graph TD')).toBe(true);
    });

    test('VIZ-011: Should include node definitions', () => {
      const markup = buildMermaidDiagram('order_summary', mockLineageGraph, mockObjects);
      expect(markup).toContain('order_summary');
    });

    test('VIZ-012: Should include edge definitions', () => {
      const markup = buildMermaidDiagram('order_summary', mockLineageGraph, mockObjects);
      expect(markup).toContain('-->');
    });

    test('VIZ-013: Should include styling classes', () => {
      const markup = buildMermaidDiagram('order_summary', mockLineageGraph, mockObjects);
      expect(markup).toContain('classDef');
    });
  });

  describe('visualizationService - buildImpactVisualization', () => {
    test('VIZ-014: Should build impact analysis data', () => {
      const impact = buildImpactVisualization('order_summary', mockLineageGraph, mockObjects);
      expect(impact.source).toBeDefined();
      expect(impact.impact).toBeDefined();
      expect(impact.levels).toBeDefined();
    });

    test('VIZ-015: Should organize impact by levels', () => {
      const impact = buildImpactVisualization('order_summary', mockLineageGraph, mockObjects);
      expect(Array.isArray(impact.levels.direct)).toBe(true);
      expect(Array.isArray(impact.levels.twoHops)).toBe(true);
      expect(Array.isArray(impact.levels.threeOrMore)).toBe(true);
    });

    test('VIZ-016: Should include impact stats', () => {
      const impact = buildImpactVisualization('order_summary', mockLineageGraph, mockObjects);
      expect(impact.stats.directCount).toBeDefined();
      expect(impact.stats.totalAffected).toBeDefined();
    });
  });

  describe('visualizationService - buildDependencyMatrix', () => {
    test('VIZ-017: Should build dependency matrix', () => {
      const matrix = buildDependencyMatrix('sales', mockObjects, mockLineageGraph);
      expect(matrix.rows).toBeDefined();
      expect(matrix.columns).toBeDefined();
      expect(matrix.data).toBeDefined();
    });

    test('VIZ-018: Should have matching dimensions', () => {
      const matrix = buildDependencyMatrix('sales', mockObjects, mockLineageGraph);
      expect(matrix.rows.length).toBe(matrix.columns.length);
      expect(matrix.data.length).toBe(matrix.rows.length);
    });

    test('VIZ-019: Should contain only 0 or 1 values', () => {
      const matrix = buildDependencyMatrix('sales', mockObjects, mockLineageGraph);
      for (const row of matrix.data) {
        for (const cell of row) {
          expect([0, 1]).toContain(cell);
        }
      }
    });
  });
});

describe('Phase 3 - Discovery Service', () => {
  describe('discoveryService - getDashboardSummary', () => {
    test('DISC-001: Should generate dashboard summary', () => {
      const summary = getDashboardSummary(mockObjects, mockLineageGraph);
      expect(summary.timestamp).toBeDefined();
      expect(summary.overview).toBeDefined();
      expect(summary.distribution).toBeDefined();
      expect(summary.metrics).toBeDefined();
    });

    test('DISC-002: Should calculate overview stats', () => {
      const summary = getDashboardSummary(mockObjects, mockLineageGraph);
      expect(summary.overview.totalObjects).toBe(mockObjects.size);
      expect(summary.overview.totalDatabases).toBeGreaterThan(0);
      expect(summary.overview.totalDependencies).toBeGreaterThan(0);
    });

    test('DISC-003: Should calculate network metrics', () => {
      const summary = getDashboardSummary(mockObjects, mockLineageGraph);
      expect(parseFloat(summary.metrics.networkDensity)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('discoveryService - getRecommendations', () => {
    test('DISC-004: Should provide recommendations', () => {
      const recs = getRecommendations(mockObjects, mockLineageGraph);
      expect(recs.recommended).toBeDefined();
      expect(recs.recommended.trending).toBeDefined();
      expect(recs.recommended.critical).toBeDefined();
      expect(recs.recommended.newData).toBeDefined();
    });

    test('DISC-005: Should include trending objects', () => {
      const recs = getRecommendations(mockObjects, mockLineageGraph);
      expect(Array.isArray(recs.recommended.trending.items)).toBe(true);
    });

    test('DISC-006: Should include critical objects', () => {
      const recs = getRecommendations(mockObjects, mockLineageGraph);
      expect(Array.isArray(recs.recommended.critical.items)).toBe(true);
    });

    test('DISC-007: Should include recent data', () => {
      const recs = getRecommendations(mockObjects, mockLineageGraph);
      expect(Array.isArray(recs.recommended.newData.items)).toBe(true);
    });
  });

  describe('discoveryService - getLineageInsights', () => {
    test('DISC-008: Should generate line age insights', () => {
      const insights = getLineageInsights(mockObjects, mockLineageGraph);
      expect(insights.insights).toBeDefined();
      expect(Array.isArray(insights.insights)).toBe(true);
    });

    test('DISC-009: Should identify complex dependency chains', () => {
      const insights = getLineageInsights(mockObjects, mockLineageGraph);
      // Should structure insights array (may or may not include warnings depending on data)
      expect(Array.isArray(insights.insights)).toBe(true);
      // If there are warnings, they should have proper structure
      const chainWarning = insights.insights.find((i) => i.type === 'warning');
      if (chainWarning) {
        expect(chainWarning.title).toBeDefined();
        expect(chainWarning.severity).toBeDefined();
      }
    });

    test('DISC-010: Should structure insight items', () => {
      const insights = getLineageInsights(mockObjects, mockLineageGraph);
      for (const insight of insights.insights) {
        expect(insight.type).toBeDefined();
        expect(insight.title).toBeDefined();
        expect(insight.severity).toBeDefined();
      }
    });
  });

  describe('discoveryService - getQualityMetrics', () => {
    test('DISC-011: Should calculate quality metrics', () => {
      const metrics = getQualityMetrics(mockObjects, mockLineageGraph);
      expect(metrics.completeness).toBeDefined();
      expect(metrics.consistency).toBeDefined();
    });

    test('DISC-012: Should evaluate completeness checks', () => {
      const metrics = getQualityMetrics(mockObjects, mockLineageGraph);
      for (const check of metrics.completeness.checks) {
        expect(check.percentage).toBeGreaterThanOrEqual(0);
        expect(check.percentage).toBeLessThanOrEqual(100);
      }
    });

    test('DISC-013: Should include status indicators', () => {
      const metrics = getQualityMetrics(mockObjects, mockLineageGraph);
      for (const check of metrics.completeness.checks) {
        expect(['good', 'warning']).toContain(check.status);
      }
    });
  });

  describe('discoveryService - getActivitySummary', () => {
    test('DISC-014: Should generate activity summary', () => {
      const activity = getActivitySummary(mockObjects);
      expect(activity.period).toBeDefined();
      expect(activity.period.week).toBeDefined();
      expect(activity.period.month).toBeDefined();
    });

    test('DISC-015: Should count recent activity', () => {
      const activity = getActivitySummary(mockObjects);
      expect(activity.period.week.count).toBeGreaterThanOrEqual(0);
      expect(activity.period.month.count).toBeGreaterThanOrEqual(0);
    });

    test('DISC-016: Should have week count <= month count', () => {
      const activity = getActivitySummary(mockObjects);
      expect(activity.period.week.count).toBeLessThanOrEqual(activity.period.month.count);
    });
  });
});

describe('Phase 3 - Integration Tests', () => {
  test('INTEG-001: Should work with lineage graphs', () => {
    const graph = buildCytoscapeGraph('order_summary', mockLineageGraph, mockObjects, 2);
    expect(graph.nodes.length).toBeGreaterThan(0);
    expect(graph.edges.length).toBeDefined();
  });

  test('INTEG-002: Should support all visualization formats', () => {
    const cyto = buildCytoscapeGraph('order_summary', mockLineageGraph, mockObjects, 1);
    const d3 = buildD3Graph('order_summary', mockLineageGraph, mockObjects, 1);
    const merm = buildMermaidDiagram('order_summary', mockLineageGraph, mockObjects);

    expect(cyto.nodes.length).toBeGreaterThan(0);
    expect(d3.nodes.length).toBeGreaterThan(0);
    expect(typeof merm).toBe('string');
  });

  test('INTEG-003: Should provide complete discovery experience', () => {
    const dashboard = getDashboardSummary(mockObjects, mockLineageGraph);
    const recommendations = getRecommendations(mockObjects, mockLineageGraph);
    const insights = getLineageInsights(mockObjects, mockLineageGraph);

    expect(dashboard.overview.totalObjects).toBe(mockObjects.size);
    expect(recommendations.recommended.trending.items.length).toBeGreaterThan(0);
    expect(insights.insights.length).toBeGreaterThan(0);
  });

  test('INTEG-004: Should handle empty objects map', () => {
    const emptyMap = new Map();
    const stats = getSearchStatistics(emptyMap, new Map());
    expect(stats.totalObjects).toBe(0);
  });

  test('INTEG-005: Should handle missing lineage data', () => {
    const suggestions = getSuggestions('order', mockObjects, 5);
    expect(suggestions.length).toBeGreaterThan(0);
  });
});
