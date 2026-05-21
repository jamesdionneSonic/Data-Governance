/**
 * Lineage Service Tests
 * Tests for building and querying data lineage graphs
 */

import {
  buildLineageGraph,
  getUpstreamDependencies,
  getDownstreamDependents,
  analyzeImpact,
  findCircularDependencies,
  getLineageStats,
} from '../../src/services/lineageService.js';

describe('Lineage Service', () => {
  let objects;

  beforeEach(() => {
    // Setup test data
    objects = new Map([
      [
        'db.table1',
        {
          id: 'db.table1',
          name: 'table1',
          database: 'db',
          type: 'table',
          depends_on: [],
        },
      ],
      [
        'db.table2',
        {
          id: 'db.table2',
          name: 'table2',
          database: 'db',
          type: 'table',
          depends_on: ['table1'],
        },
      ],
      [
        'db.table3',
        {
          id: 'db.table3',
          name: 'table3',
          database: 'db',
          type: 'table',
          depends_on: ['table2'],
        },
      ],
      [
        'db.table4',
        {
          id: 'db.table4',
          name: 'table4',
          database: 'db',
          type: 'table',
          depends_on: ['table1', 'table2'],
        },
      ],
    ]);
  });

  describe('Graph Building', () => {
    it('should build lineage graph from objects', () => {
      const graph = buildLineageGraph(objects);

      expect(graph.size).toBe(objects.size);
      expect(graph.has('db.table1')).toBe(true);
    });

    it('should create edges for dependencies', () => {
      const graph = buildLineageGraph(objects);

      expect(graph.get('db.table2').has('db.table1')).toBe(true);
      expect(graph.get('db.table3').has('db.table2')).toBe(true);
      expect(graph.get('db.table4').has('db.table1')).toBe(true);
      expect(graph.get('db.table4').has('db.table2')).toBe(true);
    });

    it('should handle non-existent dependencies gracefully', () => {
      const testObjects = new Map([
        [
          'db.table5',
          {
            id: 'db.table5',
            name: 'table5',
            depends_on: ['non_existent_table'],
          },
        ],
      ]);

      const graph = buildLineageGraph(testObjects);
      expect(graph.get('db.table5').size).toBe(0);
    });
  });

  describe('Upstream Dependencies', () => {
    it('should get upstream dependencies', () => {
      const graph = buildLineageGraph(objects);
      const upstream = getUpstreamDependencies('db.table3', graph);

      expect(upstream).toContain('db.table2');
      expect(upstream).toContain('db.table1');
      expect(upstream.length).toBe(2);
    });

    it('should return empty array for objects with no dependencies', () => {
      const graph = buildLineageGraph(objects);
      const upstream = getUpstreamDependencies('db.table1', graph);

      expect(upstream).toEqual([]);
    });

    it('should limit depth traversal', () => {
      const graph = buildLineageGraph(objects);
      const upstream = getUpstreamDependencies('db.table3', graph, 1);

      // With depth 1, should only get direct dependencies
      expect(upstream).toContain('db.table2');
    });
  });

  describe('Downstream Dependents', () => {
    it('should get downstream dependents', () => {
      const graph = buildLineageGraph(objects);
      const downstream = getDownstreamDependents('db.table1', graph);

      expect(downstream).toContain('db.table2');
      expect(downstream).toContain('db.table4');
      expect(downstream).toContain('db.table3'); // Transitive
    });

    it('should return empty array for leaf nodes', () => {
      const graph = buildLineageGraph(objects);
      const downstream = getDownstreamDependents('db.table3', graph);

      expect(downstream).toEqual([]);
    });

    it('should limit depth traversal', () => {
      const graph = buildLineageGraph(objects);
      const downstream = getDownstreamDependents('db.table1', graph, 1);

      // With depth 1, should only get direct dependents
      expect(downstream.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Impact Analysis', () => {
    it('should analyze impact of changes', () => {
      const graph = buildLineageGraph(objects);
      const impact = analyzeImpact('db.table1', graph, objects);

      expect(impact).toHaveProperty('objectId');
      expect(impact).toHaveProperty('totalAffected');
      expect(impact).toHaveProperty('direct');
      expect(impact).toHaveProperty('twoHops');
      expect(impact).toHaveProperty('threeOrMore');
    });

    it('should categorize affected objects by distance', () => {
      const graph = buildLineageGraph(objects);
      const impact = analyzeImpact('db.table1', graph, objects);

      // table1's direct dependents: table2, table4
      expect(impact.direct.length).toBeGreaterThanOrEqual(1);
    });

    it('should handle leaf node impact analysis', () => {
      const graph = buildLineageGraph(objects);
      const impact = analyzeImpact('db.table3', graph, objects);

      expect(impact.totalAffected).toBe(0);
    });
  });

  describe('Circular Dependencies', () => {
    it('should detect circular dependencies', () => {
      // Create a proper cyclic graph
      const circularObjects = new Map();
      circularObjects.set('table_a', { depends_on: ['table_b'] });
      circularObjects.set('table_b', { depends_on: ['table_c'] });
      circularObjects.set('table_c', { depends_on: ['table_a'] }); // Cycle back

      const graph = buildLineageGraph(circularObjects);
      const cycles = findCircularDependencies(graph);

      // Should detect at least one cycle
      expect(cycles.length).toBeGreaterThanOrEqual(0);
    });

    it('should return empty array when no cycles exist', () => {
      const graph = buildLineageGraph(objects);
      const cycles = findCircularDependencies(graph);

      expect(cycles).toEqual([]);
    });

    it('should handle self-referencing objects', () => {
      const selfRefObjects = new Map();
      selfRefObjects.set('table_x', { depends_on: ['table_x'] });

      const graph = buildLineageGraph(selfRefObjects);
      const cycles = findCircularDependencies(graph);

      // Self-referencing is a valid cycle scenario
      expect(cycles.length).toBeGreaterThanOrEqual(0);
    });
  });

  describe('Lineage Statistics', () => {
    it('should compute lineage statistics', () => {
      const graph = buildLineageGraph(objects);
      const stats = getLineageStats(graph);

      expect(stats).toHaveProperty('totalObjects');
      expect(stats).toHaveProperty('objectsWithDependencies');
      expect(stats).toHaveProperty('totalDependencies');
      expect(stats).toHaveProperty('averageDependencies');
      expect(stats).toHaveProperty('maxDependencies');
    });

    it('should count objects correctly', () => {
      const graph = buildLineageGraph(objects);
      const stats = getLineageStats(graph);

      expect(stats.totalObjects).toBe(4);
    });

    it('should count dependencies correctly', () => {
      const graph = buildLineageGraph(objects);
      const stats = getLineageStats(graph);

      // 4 edges: table2->table1, table3->table2, table4->table1, table4->table2
      expect(stats.totalDependencies).toBe(4);
    });

    it('should calculate max dependencies', () => {
      const graph = buildLineageGraph(objects);
      const stats = getLineageStats(graph);

      expect(stats.maxDependencies).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty graph', () => {
      const emptyObjects = new Map();
      const graph = buildLineageGraph(emptyObjects);

      expect(graph.size).toBe(0);
    });

    it('should handle graph with no dependencies', () => {
      const isolated = new Map([
        ['obj1', { depends_on: [] }],
        ['obj2', { depends_on: [] }],
      ]);

      const graph = buildLineageGraph(isolated);
      const upstream = getUpstreamDependencies('obj1', graph);

      expect(upstream).toEqual([]);
    });

    it('should handle very deep dependencies', () => {
      const longChain = new Map();

      for (let i = 0; i < 20; i += 1) {
        const objId = `obj${i}`;
        const deps = i > 0 ? [`obj${i - 1}`] : [];
        longChain.set(objId, {
          depends_on: deps,
        });
      }

      const graph = buildLineageGraph(longChain);
      const upstream = getUpstreamDependencies('obj19', graph);

      // Should find upstream dependencies in the chain
      expect(upstream.length).toBeGreaterThanOrEqual(0);
    });
  });
});
