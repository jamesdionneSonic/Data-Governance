import { normalizeAwsLineagePackage, toDeltaObjects } from '../../engines/connectors/aws/index.js';

function connector(id, type, service, options = {}) {
  const productRoute =
    options.productRoute === false
      ? {}
      : {
          product_area: 'MDP',
          business_domain: 'Marketing Data Platform',
          product_route_id: 'mdp-aws-lineage-context',
          human_catalog_root:
            'Sonic Data Lineage / Data Product Catalog / MDP / MDP AWS Lineage Context',
          system_owner: 'MDP team',
          data_team_role: 'feed contributor and lineage consumer',
        };
  return {
    id,
    type,
    config: {
      account_id: '123456789012',
      aws_account_id: '123456789012',
      account_name: 'svc_dev_mdp',
      region: 'us-east-1',
      service,
      aws_profile: 'sonic-dev-mdp',
      ...productRoute,
      ...(options.config || {}),
    },
    credential: {
      mode: 'aws_cli_profile',
      aws_profile: 'sonic-dev-mdp',
    },
  };
}

function event(connectorRecord, stream, item) {
  return {
    type: 'metadata.object',
    connector_id: connectorRecord.id,
    connector_type: connectorRecord.type,
    stream,
    external_id: item.id,
    name: item.name,
    object_type: item.object_type,
    parent_id: item.parent_id || null,
    attributes: item,
    confidence: 0.9,
    evidence: {
      bridge_kind: 'documented_metadata_bridge',
      docs: ['https://docs.aws.amazon.com/'],
    },
  };
}

describe('AWS lineage engine', () => {
  test('normalizes S3, Glue, and Athena metadata into assets and edges', () => {
    const s3 = connector('aws-s3-dev', 'aws_s3', 's3');
    const glue = connector('aws-glue-dev', 'aws_glue', 'glue');
    const athena = connector('aws-athena-dev', 'aws_athena', 'athena');

    const lineage = normalizeAwsLineagePackage({
      generatedAt: '2026-06-29T12:00:00.000Z',
      lineageConnectorId: 'aws-account-123456789012-us-east-1',
      sourceScope: 'aws-account:123456789012:us-east-1',
      connectorRuns: [
        {
          connector: s3,
          events: [
            event(s3, 'buckets', {
              id: 'sonic-dms-dev',
              name: 'sonic-dms-dev',
              object_type: 's3_bucket',
            }),
          ],
        },
        {
          connector: glue,
          events: [
            event(glue, 'databases', {
              id: 'dms',
              name: 'dms',
              object_type: 'glue_database',
            }),
            event(glue, 'tables', {
              id: 'dms.repair_order_raw',
              name: 'repair_order_raw',
              table_name: 'repair_order_raw',
              object_type: 'glue_table',
              parent_id: 'dms',
              database_name: 'dms',
              location: 's3://sonic-dms-dev/repair_orders/raw/',
              column_count: 2,
            }),
            event(glue, 'columns', {
              id: 'dms.repair_order_raw.ro_number',
              name: 'ro_number',
              column_name: 'ro_number',
              object_type: 'glue_column',
              parent_id: 'dms.repair_order_raw',
              database_name: 'dms',
              table_name: 'repair_order_raw',
              data_type: 'string',
              ordinal_position: 1,
            }),
          ],
        },
        {
          connector: athena,
          events: [
            event(athena, 'data_catalogs', {
              id: 'AwsDataCatalog',
              name: 'AwsDataCatalog',
              object_type: 'athena_data_catalog',
              type: 'GLUE',
            }),
            event(athena, 'databases', {
              id: 'AwsDataCatalog.dms',
              name: 'dms',
              object_type: 'athena_database',
              parent_id: 'AwsDataCatalog',
              catalog_name: 'AwsDataCatalog',
            }),
            event(athena, 'tables', {
              id: 'AwsDataCatalog.dms.repair_order_raw',
              name: 'repair_order_raw',
              table_name: 'repair_order_raw',
              object_type: 'athena_table',
              parent_id: 'AwsDataCatalog.dms',
              catalog_name: 'AwsDataCatalog',
              database_name: 'dms',
              columns: [{ name: 'ro_number', type: 'string' }],
            }),
            event(athena, 'named_queries', {
              id: 'query-1',
              name: 'Repair order daily',
              object_type: 'athena_named_query',
              database_name: 'dms',
              query_string: 'select ro_number from dms.repair_order_raw',
            }),
          ],
        },
      ],
    });

    expect(lineage.summary.object_count).toBeGreaterThan(8);
    expect(lineage.primary_product_area).toBe('MDP');
    expect(lineage.product_areas).toMatchObject({ MDP: lineage.summary.object_count });
    expect(lineage.objects.map((object) => object.canonical_id)).toEqual(
      expect.arrayContaining([
        'aws://123456789012/us-east-1/s3/bucket/sonic-dms-dev',
        'aws://123456789012/us-east-1/glue/table/dms/repair_order_raw',
        'aws://123456789012/us-east-1/athena/table/AwsDataCatalog/dms/repair_order_raw',
      ])
    );
    expect(lineage.edges.map((edge) => edge.relationship_type)).toEqual(
      expect.arrayContaining([
        'storage_registered_by',
        'has_column',
        'queried_by_athena',
        'referenced_by_named_query',
        'metadata_catalog_used_by_athena',
      ])
    );

    const namedQuery = lineage.objects.find(
      (object) => object.object_type === 'athena_named_query'
    );
    expect(namedQuery.attributes.query_hash).toBeTruthy();
    expect(namedQuery.attributes.query_string).toBeUndefined();
    expect(JSON.stringify(lineage.ai_evidence_packets)).not.toContain('select ro_number');
  });

  test('produces source-agnostic delta objects with AWS source family', () => {
    const lineage = normalizeAwsLineagePackage({
      generatedAt: '2026-06-29T12:00:00.000Z',
      lineageConnectorId: 'aws-account-123456789012-us-east-1',
      connectorRuns: [
        {
          connector: connector('aws-s3-dev', 'aws_s3', 's3'),
          events: [
            event(connector('aws-s3-dev', 'aws_s3', 's3'), 'buckets', {
              id: 'sonic-dms-dev',
              name: 'sonic-dms-dev',
              object_type: 's3_bucket',
            }),
          ],
        },
      ],
    });
    const deltaObjects = toDeltaObjects(
      lineage.objects,
      lineage.edges,
      'aws-account-123456789012-us-east-1'
    );

    expect(deltaObjects[0]).toMatchObject({
      source_family: 'aws',
      source_system: 'aws-account-123456789012-us-east-1',
      product_area: 'MDP',
    });
    expect(deltaObjects.some((object) => object.metadata.product_area === 'MDP')).toBe(true);
    expect(deltaObjects.some((object) => object.metadata.platform === 'AWS')).toBe(true);
  });

  test('flags AWS lineage packages that do not declare a product route', () => {
    const unrouted = connector('aws-s3-unrouted', 'aws_s3', 's3', { productRoute: false });
    const lineage = normalizeAwsLineagePackage({
      generatedAt: '2026-06-29T12:00:00.000Z',
      lineageConnectorId: 'aws-account-123456789012-us-east-1',
      connectorRuns: [
        {
          connector: unrouted,
          events: [
            event(unrouted, 'buckets', {
              id: 'unknown-product-bucket',
              name: 'unknown-product-bucket',
              object_type: 's3_bucket',
            }),
          ],
        },
      ],
    });

    expect(lineage.primary_product_area).toBe('unrouted');
    expect(lineage.gaps).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          gap_type: 'missing_product_route',
        }),
      ])
    );
    expect(lineage.metadata_objects.some((object) => object.product_area === 'unrouted')).toBe(
      true
    );
  });
});
