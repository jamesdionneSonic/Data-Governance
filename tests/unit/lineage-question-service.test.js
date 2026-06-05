import { answerLineageQuestion } from '../../src/services/lineageQuestionService.js';

describe('Lineage Question Service', () => {
  const tableId = 'L1-5FSQL-01.Sonic_DW.dbo.DimVehicle';
  const procId = 'L1-5FSQL-01.Sonic_DW.dbo.usp_DimVehicle';
  const packageId = 'V1-SSIS25-01.SSISDB.DimVehicle.DimVehicle_DIM_DimVehicle.dtsx';
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
          reads_from: [tableId],
          writes_to: [tableId],
          definition: 'UPDATE dbo.DimVehicle SET ModelName = src.ModelName INSERT INTO dbo.DimVehicle SELECT src.ModelName',
        },
      ],
      [
        packageId,
        {
          id: packageId,
          name: 'DimVehicle_DIM_DimVehicle.dtsx',
          database: 'SSISDB',
          type: 'ssis_package',
          packageName: 'DimVehicle_DIM_DimVehicle.dtsx',
          packagePath: '/DimVehicle/DimVehicle_DIM_DimVehicle.dtsx',
          calls: [procId],
        },
      ],
      [
        viewId,
        {
          id: viewId,
          name: 'vwDimVehicle',
          database: 'Sonic_DW',
          schema: 'dbo',
          type: 'view',
          reads_from: [tableId],
        },
      ],
      ['webv.table1', { id: 'webv.table1', name: 'Vehicle', database: 'WebV', type: 'table' }],
      ['webv.table2', { id: 'webv.table2', name: 'Lead', database: 'WebV', type: 'table' }],
      ['webv.view1', { id: 'webv.view1', name: 'LeadView', database: 'WebV', type: 'view' }],
    ]);
  }

  test('answers object lineage questions with English, exact names, and sources', () => {
    const answer = answerLineageQuestion(buildObjects(), {
      question: 'what uses DimVehicle?',
    });

    expect(answer.answer_type).toBe('object_lineage');
    expect(answer.intent).toBe('uses');
    expect(answer.resolved_object.object_id).toBe(tableId);
    expect(answer.assistant.title).toBe('Lineage for dbo.DimVehicle');
    expect(answer.assistant.message).toContain('downstream business consumer');
    expect(answer.assistant.suggested_followups).toEqual(
      expect.arrayContaining(['what loads dbo.DimVehicle?', 'what feeds dbo.DimVehicle?'])
    );
    expect(answer.plain_english).toContain('downstream business consumer');
    expect(answer.impacted_objects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: viewId, label: 'dbo.vwDimVehicle' }),
        expect.objectContaining({ id: procId, label: 'dbo.usp_DimVehicle' }),
      ])
    );
    expect(answer.sources).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ object_id: viewId }),
      ])
    );
  });

  test('answers database object count questions without requiring ad hoc JSON parsing', () => {
    const answer = answerLineageQuestion(buildObjects(), {
      question: 'tell me how many tables are in WebV',
    });

    expect(answer.answer_type).toBe('database_object_count');
    expect(answer.assistant.title).toBe('Catalog Count');
    expect(answer.assistant.has_table).toBe(true);
    expect(answer.plain_english).toBe('WebV has 2 tables in the loaded lineage catalog.');
    expect(answer.table.rows).toEqual([
      expect.objectContaining({
        database: 'WebV',
        object_count: 3,
        table_count: 2,
        view_count: 1,
      }),
    ]);
  });

  test('returns question help for ?help', () => {
    const answer = answerLineageQuestion(buildObjects(), {
      question: '?help',
    });

    expect(answer.answer_type).toBe('help');
    expect(answer.assistant.title).toBe('How to Ask Lineage Questions');
    expect(answer.plain_english).toContain('Use "feeds"');
    expect(answer.table.rows).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ prompt: 'what loads DimVehicle?' }),
      ])
    );
  });
});
