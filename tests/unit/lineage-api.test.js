import request from 'supertest';

import createApp, { initializeCache } from '../../src/app.js';
import { buildLineageGraph } from '../../src/services/lineageService.js';
import { generateToken } from '../../src/utils/tokenManager.js';

function createAuthHeader(roles = ['Viewer']) {
  const token = generateToken({
    id: `lineage-${roles.join('-').toLowerCase()}`,
    email: 'lineage.qa@example.com',
    name: 'Lineage QA',
    roles,
    databases: ['Sonic_DW'],
  });

  return { Authorization: `Bearer ${token}` };
}

describe('Lineage Answer API', () => {
  const tableId = 'L1-5FSQL-01.Sonic_DW.dbo.DimVehicle';
  const procId = 'L1-5FSQL-01.Sonic_DW.dbo.usp_DimVehicle';
  const packageId = 'V1-SSIS25-01.SSISDB.DimVehicle.DimVehicle_DIM_DimVehicle.dtsx';
  const stageId = 'L1-5FSQL-01.Sonic_DW.dbo.SynWrkDimVehicleVehicle';
  const dimVinId = 'L1-5FSQL-01.Sonic_DW.dbo.DimVin';
  const viewId = 'L1-5FSQL-01.Sonic_DW.dbo.vwDimVehicle';

  function buildObjects() {
    return new Map([
      [
        tableId,
        {
          id: tableId,
          name: 'DimVehicle',
          server: 'L1-5FSQL-01',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'table',
          created_by: [procId],
          used_by: [procId, viewId],
        },
      ],
      [
        procId,
        {
          id: procId,
          name: 'usp_DimVehicle',
          server: 'L1-5FSQL-01',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'procedure',
          reads_from: [stageId, dimVinId, tableId],
          writes_to: [tableId],
          definition: `
            UPDATE tgt
               SET tgt.ModelName = src.ModelName
              FROM dbo.SynWrkDimVehicleVehicle AS src
              INNER JOIN dbo.DimVehicle AS tgt
                ON src.VehicleKey = tgt.VehicleKey;

            INSERT INTO dbo.DimVehicle (VehicleKey, ModelName)
            SELECT src.VehicleKey, src.ModelName
              FROM dbo.SynWrkDimVehicleVehicle AS src
              LEFT JOIN dbo.DimVehicle AS tgt
                ON src.VehicleKey = tgt.VehicleKey
             WHERE tgt.VehicleKey IS NULL;
          `,
        },
      ],
      [
        packageId,
        {
          id: packageId,
          name: 'DimVehicle_DIM_DimVehicle.dtsx',
          server: 'V1-SSIS25-01',
          database: 'SSISDB',
          schema: 'dbo',
          packageName: 'DimVehicle_DIM_DimVehicle.dtsx',
          packagePath: '/DimVehicle/DimVehicle_DIM_DimVehicle.dtsx',
          type: 'ssis_package',
          calls: [procId],
        },
      ],
      [
        stageId,
        {
          id: stageId,
          name: 'SynWrkDimVehicleVehicle',
          server: 'L1-5FSQL-01',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'synonym',
        },
      ],
      [
        dimVinId,
        {
          id: dimVinId,
          name: 'DimVin',
          server: 'L1-5FSQL-01',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'table',
        },
      ],
      [
        viewId,
        {
          id: viewId,
          name: 'vwDimVehicle',
          server: 'L1-5FSQL-01',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'view',
          reads_from: [tableId],
        },
      ],
      [
        'webv.vehicle',
        {
          id: 'webv.vehicle',
          name: 'vehicle',
          database: 'WebV',
          schema: 'dbo',
          type: 'table',
        },
      ],
      [
        'webv.lead',
        {
          id: 'webv.lead',
          name: 'lead',
          database: 'WebV',
          schema: 'dbo',
          type: 'table',
        },
      ],
    ]);
  }

  let app;

  beforeAll(() => {
    app = createApp();
  });

  beforeEach(() => {
    const objects = buildObjects();
    initializeCache(objects, buildLineageGraph(objects), {});
  });

  test('returns a semantic lineage answer for a focus object', async () => {
    const response = await request(app)
      .get(`/api/v1/discovery/lineage-answer/${encodeURIComponent(tableId)}?intent=feeds`)
      .set(createAuthHeader(['Viewer']));

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.intent).toBe('feeds');
    expect(response.body.data.plain_english).toContain('DimVehicle is fed by its load chain');
    expect(response.body.data.impacted_objects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          role: 'Orchestrates load',
          id: packageId,
        }),
        expect.objectContaining({
          role: 'Loads target',
          id: procId,
        }),
        expect.objectContaining({
          role: 'Source input',
          id: stageId,
        }),
      ])
    );
  });

  test('returns lineage help examples for new users', async () => {
    const response = await request(app)
      .get('/api/v1/discovery/lineage-help')
      .set(createAuthHeader(['Viewer']));

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.examples).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          prompt: 'what loads DimVehicle?',
        }),
      ])
    );
  });

  test('answers an English lineage question through the API', async () => {
    const response = await request(app)
      .post('/api/v1/discovery/lineage-question')
      .set(createAuthHeader(['Viewer']))
      .send({ question: 'what uses DimVehicle?' });

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('success');
    expect(response.body.data.answer_type).toBe('object_lineage');
    expect(response.body.data.assistant.title).toBe('Lineage for dbo.DimVehicle');
    expect(response.body.data.resolved_object.object_id).toBe(tableId);
    expect(response.body.data.impacted_objects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: viewId }),
        expect.objectContaining({ id: procId }),
      ])
    );
  });

  test('answers a database count question through the API', async () => {
    const response = await request(app)
      .post('/api/v1/discovery/lineage-question')
      .set(createAuthHeader(['Viewer']))
      .send({ question: 'how many tables are in WebV' });

    expect(response.status).toBe(200);
    expect(response.body.data.answer_type).toBe('database_object_count');
    expect(response.body.data.assistant).toEqual(
      expect.objectContaining({
        title: 'Catalog Count',
        has_table: true,
      })
    );
    expect(response.body.data.plain_english).toBe('WebV has 2 tables in the loaded lineage catalog.');
    expect(response.body.data.table.rows[0]).toEqual(
      expect.objectContaining({
        database: 'WebV',
        table_count: 2,
      })
    );
  });
});
