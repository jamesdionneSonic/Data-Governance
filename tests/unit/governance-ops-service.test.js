import { mkdtemp, rm } from 'fs/promises';
import { tmpdir } from 'os';
import path from 'path';
import {
  assessChangeRisk,
  buildAdoptionScorecards,
  buildKpis,
  buildOwnershipSummary,
  buildStewardPortfolio,
  clearGovernanceOps,
  createGovernanceTask,
  createIncident,
  detectSchemaChange,
  evaluateAnomaly,
  exportGovernanceOpsState,
  generateStewardshipTasks,
  getGovernanceOpsStoreStatus,
  importGovernanceOpsState,
  planBulkOwnershipAssignment,
  recordUsageEvent,
  setGovernanceOpsStorePath,
  transitionGovernanceTask,
} from '../../src/services/governanceOpsService.js';

describe('Phase 7 - Governance Operations Service', () => {
  let objects;
  let lineageGraph;

  beforeEach(() => {
    clearGovernanceOps();
    objects = new Map([
      [
        'sales',
        {
          id: 'sales',
          name: 'Sales domain',
          type: 'domain',
          owner: 'sales-owner@example.com',
          steward: 'sales-steward@example.com',
          domain_manager: 'sales-manager@example.com',
          custodian: 'platform@example.com',
          description: 'Sales data domain.',
          tags: ['domain'],
        },
      ],
      [
        'sales.orders',
        {
          id: 'sales.orders',
          name: 'orders',
          type: 'table',
          owner: 'owner@example.com',
          steward: 'steward@example.com',
          description: 'Certified sales order table used by executive revenue reporting.',
          sensitivity: 'confidential',
          tags: ['finance'],
          certified: true,
          database: 'sales',
        },
      ],
      [
        'sales.raw_orders',
        {
          id: 'sales.raw_orders',
          name: 'raw_orders',
          type: 'table',
          owner: 'unknown',
          description: '',
          tags: [],
          database: 'sales',
        },
      ],
    ]);

    lineageGraph = new Map([
      ['sales.raw_orders', new Set(['sales.orders'])],
      ['mart.revenue', new Set(['sales.orders'])],
    ]);
  });

  test('creates and transitions stewardship tasks', () => {
    const task = createGovernanceTask(
      { assetId: 'sales.orders', title: 'Review certification', priority: 'high' },
      { id: 'steward', roles: ['Steward'] }
    );

    const transitioned = transitionGovernanceTask(
      task.taskId,
      { status: 'done', note: 'Reviewed' },
      { id: 'steward', roles: ['Steward'] }
    );

    expect(transitioned.status).toBe('done');
    expect(transitioned.events).toHaveLength(2);
  });

  test('generates metadata completion work from catalog gaps', () => {
    const result = generateStewardshipTasks(objects, { id: 'admin', roles: ['Admin'] });

    expect(result.count).toBe(1);
    expect(result.tasks[0].assetId).toBe('sales.raw_orders');
    expect(result.tasks[0].description).toContain('owner');
  });

  test('scores change risk from downstream consumers and certified status', () => {
    const risk = assessChangeRisk(
      { assetId: 'sales.orders', changeTypes: ['drop_column'] },
      objects,
      lineageGraph
    );

    expect(risk.approvalRequired).toBe(true);
    expect(risk.riskFactors).toContain('potentially breaking schema change');
    expect(risk.downstreamCount).toBe(2);
  });

  test('detects breaking schema changes and writes migration guidance', () => {
    const result = detectSchemaChange({
      assetId: 'sales.orders',
      beforeColumns: [
        { name: 'order_id', type: 'int' },
        { name: 'amount', type: 'decimal' },
      ],
      afterColumns: [
        { name: 'order_id', type: 'bigint' },
        { name: 'created_at', type: 'datetime' },
      ],
    });

    expect(result.breaking).toBe(true);
    expect(result.changes.removed).toContain('amount');
    expect(result.changes.changed[0].name).toBe('order_id');
  });

  test('builds adoption, KPI, anomaly, and incident outputs', () => {
    recordUsageEvent({ assetId: 'sales.orders', action: 'view' }, { id: 'viewer' });
    const adoption = buildAdoptionScorecards(objects, lineageGraph);
    const kpis = buildKpis(objects, lineageGraph);
    const anomaly = evaluateAnomaly({
      assetId: 'sales.orders',
      baseline: { rowCount: 1000 },
      current: { rowCount: 1500 },
      tolerancePct: 20,
    });
    const incident = createIncident(
      { assetId: 'sales.orders', severity: 'high' },
      { id: 'steward' }
    );

    expect(adoption[0].assetId).toBe('sales.orders');
    expect(kpis.totalAssets).toBe(3);
    expect(anomaly.severity).toBe('medium');
    expect(incident.status).toBe('open');
  });

  test('builds ownership model with inherited roles, portfolio alerts, and assignment plans', () => {
    const summary = buildOwnershipSummary(objects);
    const rawOrders = summary.assignments.find((item) => item.assetId === 'sales.raw_orders');

    expect(summary.coverage.domain_manager.pct).toBeGreaterThan(0);
    expect(rawOrders.roles.steward).toEqual(
      expect.objectContaining({
        value: 'sales-steward@example.com',
        source: 'inherited',
        inheritedFrom: 'sales',
      })
    );
    expect(rawOrders.escalationChain.map((item) => item.role)).toContain('domain_manager');

    const portfolio = buildStewardPortfolio(objects, lineageGraph, 'sales-steward@example.com');
    expect(portfolio.totalAssets).toBeGreaterThanOrEqual(2);
    expect(portfolio.alerts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          assetId: 'sales.raw_orders',
          severity: expect.any(String),
        }),
      ])
    );

    const plan = planBulkOwnershipAssignment(
      {
        assetIds: ['sales.raw_orders'],
        owner: 'new-owner@example.com',
        steward: 'new-steward@example.com',
      },
      objects,
      { id: 'admin', roles: ['Admin'] }
    );
    expect(plan.count).toBe(1);
    expect(plan.task.type).toBe('bulk_ownership_assignment');
    expect(plan.markdownWriteRequired).toBe(true);
  });

  test('persists and restores governance ops workflow state', async () => {
    const tempDir = await mkdtemp(path.join(tmpdir(), 'govops-'));
    const tempPath = path.join(tempDir, 'state.json');
    setGovernanceOpsStorePath(tempPath, { load: false });
    clearGovernanceOps();

    try {
      const task = createGovernanceTask(
        { assetId: 'sales.orders', title: 'Persist me' },
        { id: 'admin' }
      );
      const exported = exportGovernanceOpsState();

      clearGovernanceOps();
      expect(getGovernanceOpsStoreStatus().counts.tasks).toBe(0);

      importGovernanceOpsState(exported);
      const restored = exportGovernanceOpsState();

      expect(restored.tasks[0][0]).toBe(task.taskId);
      expect(getGovernanceOpsStoreStatus().exists).toBe(true);
    } finally {
      await rm(tempDir, { recursive: true, force: true });
      setGovernanceOpsStorePath(path.resolve(process.cwd(), 'data/governance-ops/state.json'), {
        load: false,
        enablePersistence: false,
      });
    }
  });
});
