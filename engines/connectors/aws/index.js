import crypto from 'node:crypto';

export const AWS_SOURCE_FAMILY = 'aws';

export const AWS_CONNECTOR_TYPES = new Set(['aws_s3', 'aws_glue', 'aws_athena', 'quicksight']);

export const DEFAULT_AWS_LINEAGE_STREAMS = Object.freeze({
  aws_s3: ['buckets'],
  aws_glue: ['databases', 'tables', 'columns', 'jobs'],
  aws_athena: ['workgroups', 'data_catalogs', 'databases', 'tables', 'named_queries'],
  quicksight: ['dashboards', 'datasets', 'data_sources', 'analyses'],
});

const AWS_PLATFORM = 'AWS';
const UNROUTED_PRODUCT_AREA = 'unrouted';

export function isAwsLineageConnector(connector = {}) {
  return AWS_CONNECTOR_TYPES.has(connector.type);
}

export function defaultAwsLineageStreams(connectorType) {
  return [...(DEFAULT_AWS_LINEAGE_STREAMS[connectorType] || [])];
}

export function normalizeAwsLineagePackage({
  connectorRuns = [],
  generatedAt = new Date().toISOString(),
  lineageConnectorId = '',
  sourceScope = '',
} = {}) {
  const state = {
    generatedAt,
    objects: new Map(),
    edges: new Map(),
    gaps: [],
    contexts: new Map(),
  };

  for (const connectorRun of connectorRuns) {
    const connector = connectorRun.connector || connectorRun;
    if (!isAwsLineageConnector(connector)) continue;
    const context = awsConnectorContext(connector);
    state.contexts.set(`${context.account_id}:${context.region}:${context.service}`, context);
    if (!context.is_product_routed) {
      addGap(state, {
        object_id: `aws://${context.account_id}/${context.region}/connector/${context.connector_id || context.service}`,
        gap_type: 'missing_product_route',
        message:
          'AWS connector is not assigned to a product route. It should stay out of product-specific Confluence trees until product_area and human_catalog_root are declared.',
      });
    }
    addAwsAccountAndService(state, context);
    for (const event of connectorRun.events || connectorRun.run?.extraction?.events || []) {
      if (!event || event.type === 'extraction.warning') continue;
      processAwsEvent(state, context, event);
    }
  }

  inferAthenaGlueEdges(state);

  const objects = [...state.objects.values()]
    .map((object) => finalizeObject(object, state.edges))
    .sort((left, right) => left.canonical_id.localeCompare(right.canonical_id));
  const edges = [...state.edges.values()].sort((left, right) => left.id.localeCompare(right.id));
  const connectorIds = [
    ...new Set(
      connectorRuns.map((item) => item.connector?.id || item.connector_id).filter(Boolean)
    ),
  ].sort();
  const sourceSystems = [lineageConnectorId, ...connectorIds].filter(Boolean);
  const effectiveLineageConnectorId =
    lineageConnectorId || sourceSystems[0] || 'aws-lineage-connector';
  const effectiveScope = sourceScope || awsPackageScope(objects, connectorIds);
  const metadataObjects = toDeltaObjects(objects, edges, effectiveLineageConnectorId);

  return {
    schema_version: '1.0',
    source_family: AWS_SOURCE_FAMILY,
    platform: AWS_PLATFORM,
    generated_at: generatedAt,
    connector_id: effectiveLineageConnectorId,
    source_scope: effectiveScope,
    source_connector_ids: connectorIds,
    product_areas: productAreaSummary(objects),
    primary_product_area: primaryProductArea(objects),
    human_catalog_roots: humanCatalogRoots(objects),
    summary: summarizeAwsPackage({ objects, edges, gaps: state.gaps }),
    objects,
    edges,
    metadata_objects: metadataObjects,
    ai_evidence_packets: objects.map((object) => buildAiEvidencePacket(object, edges)),
    gaps: state.gaps.sort((left, right) => left.object_id.localeCompare(right.object_id)),
  };
}

export function renderAwsLineageReadback(lineagePackage, deltaManifest = null) {
  const edgeRows = lineagePackage.edges
    .slice(0, 30)
    .map(
      (edge) =>
        `| ${edge.relationship_type} | ${edge.from_display || edge.from} | ${edge.to_display || edge.to} | ${edge.confidence} |`
    );
  const gapRows = lineagePackage.gaps
    .slice(0, 30)
    .map((gap) => `| ${gap.object_id} | ${gap.gap_type} | ${gap.message} |`);
  const objectRows = Object.entries(lineagePackage.summary.objects_by_type || {})
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([type, count]) => `| ${type} | ${count} |`);

  return [
    '# AWS Lineage Ingestion Readback',
    '',
    `Generated: ${lineagePackage.generated_at}`,
    '',
    `Source scope: \`${lineagePackage.source_scope}\``,
    '',
    `Lineage connector id: \`${lineagePackage.connector_id}\``,
    '',
    `Source connectors: ${lineagePackage.source_connector_ids.map((id) => `\`${id}\``).join(', ') || '`none`'}`,
    '',
    '## Product Routing',
    '',
    `Primary product area: \`${lineagePackage.primary_product_area || UNROUTED_PRODUCT_AREA}\``,
    '',
    '| Product Area | Objects |',
    '| --- | ---: |',
    ...Object.entries(lineagePackage.product_areas || {})
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([area, count]) => `| ${area} | ${count} |`),
    '',
    'Human catalog roots:',
    '',
    ...((lineagePackage.human_catalog_roots || []).length
      ? lineagePackage.human_catalog_roots.map((root) => `- ${root}`)
      : ['- not routed']),
    '',
    '## Summary',
    '',
    '| Signal | Count |',
    '| --- | ---: |',
    `| Objects | ${lineagePackage.summary.object_count} |`,
    `| Edges | ${lineagePackage.summary.edge_count} |`,
    `| Gaps | ${lineagePackage.summary.gap_count} |`,
    '',
    '## Objects By Type',
    '',
    '| Type | Count |',
    '| --- | ---: |',
    ...objectRows,
    '',
    '## Edge Sample',
    '',
    '| Relationship | From | To | Confidence |',
    '| --- | --- | --- | ---: |',
    ...(edgeRows.length ? edgeRows : ['| none | none | none | 0 |']),
    '',
    '## Lineage Gaps',
    '',
    '| Object | Gap | Message |',
    '| --- | --- | --- |',
    ...(gapRows.length ? gapRows : ['| none | none | none |']),
    '',
    deltaManifest
      ? [
          '## Delta',
          '',
          `Mode: \`${deltaManifest.mode}\``,
          '',
          '| Status | Count |',
          '| --- | ---: |',
          `| new | ${deltaManifest.counts.new} |`,
          `| changed | ${deltaManifest.counts.changed} |`,
          `| unchanged | ${deltaManifest.counts.unchanged} |`,
          `| retained_stale | ${deltaManifest.counts.retained_stale} |`,
          `| removed_stale | ${deltaManifest.counts.removed_stale} |`,
          '',
        ].join('\n')
      : '',
    '## AI Description Rule',
    '',
    'Human-friendly descriptions must use only the bounded evidence packet for each object. If purpose, owner, steward, SLA, freshness, or business process is not surfaced by metadata, say that it is not surfaced in metadata. Do not infer business meaning from an AWS name alone.',
    '',
  ]
    .filter((line, index, list) => line || list[index - 1] !== '')
    .join('\n');
}

export function toDeltaObjects(objects = [], edges = [], sourceSystem = 'aws-lineage') {
  const edgesByObject = new Map();
  for (const edge of edges) {
    for (const id of [edge.from, edge.to]) {
      if (!edgesByObject.has(id)) edgesByObject.set(id, []);
      edgesByObject.get(id).push(edge);
    }
  }
  return objects.map((object) => ({
    canonical_id: object.canonical_id,
    display_name: object.display_name,
    object_type: object.object_type,
    database: object.database || '',
    schema: object.schema || '',
    object_name: object.object_name || object.name || object.display_name,
    source_family: AWS_SOURCE_FAMILY,
    source_system: sourceSystem,
    product_area: object.product_area || UNROUTED_PRODUCT_AREA,
    metadata: {
      platform: AWS_PLATFORM,
      product_area: object.product_area || UNROUTED_PRODUCT_AREA,
      business_domain: object.business_domain || '',
      product_route_id: object.product_route_id || '',
      human_catalog_root: object.human_catalog_root || '',
      ownership_boundary: object.ownership_boundary || {},
      lineage_tags: object.lineage_tags || [],
      account_id: object.account_id,
      account_name: object.account_name,
      region: object.region,
      service: object.service,
      native_id: object.native_id,
      parent_id: object.parent_id,
      attributes: object.attributes || {},
      columns: object.columns || [],
      missing_facts: object.missing_facts || [],
      lineage_edges: (edgesByObject.get(object.canonical_id) || []).map(edgeForSignature),
      evidence: object.evidence || {},
    },
  }));
}

function processAwsEvent(state, context, event) {
  const objectType = awsObjectTypeForEvent(context, event);
  if (!objectType) return;
  if (context.service === 's3') {
    processS3Event(state, context, event, objectType);
    return;
  }
  if (context.service === 'glue') {
    processGlueEvent(state, context, event, objectType);
    return;
  }
  if (context.service === 'athena') {
    processAthenaEvent(state, context, event, objectType);
    return;
  }
  if (context.service === 'quicksight') {
    processQuickSightEvent(state, context, event, objectType);
    return;
  }
  addGap(state, {
    object_id: `${context.service}:${event.external_id || event.name}`,
    gap_type: 'unsupported_aws_service',
    message: `AWS service ${context.service} is not mapped to canonical lineage objects yet.`,
  });
}

function processS3Event(state, context, event, objectType) {
  const attributes = event.attributes || {};
  if (objectType === 's3_bucket') {
    const bucketName = attributes.bucket || event.name || event.external_id;
    const bucket = addObject(state, context, {
      canonical_id: awsId(context, 's3', 'bucket', bucketName),
      display_name: bucketName,
      object_type: 's3_bucket',
      service: 's3',
      object_name: bucketName,
      native_id: bucketName,
      attributes: pickStable(attributes, ['created_at']),
      evidence: eventEvidence(event),
    });
    addContainsEdge(state, serviceId(context, 's3'), bucket.canonical_id, event);
    return;
  }

  if (objectType === 's3_object') {
    const bucketName = attributes.bucket || event.parent_id;
    const key = attributes.path || event.name || event.external_id;
    const bucket = ensureS3Bucket(state, context, bucketName, event);
    const prefix = ensureS3Prefix(state, context, bucketName, prefixFromKey(key), event);
    const object = addObject(state, context, {
      canonical_id: awsId(context, 's3', 'object', bucketName, key),
      display_name: `s3://${bucketName}/${key}`,
      object_type: 's3_object',
      service: 's3',
      parent_id: prefix.canonical_id,
      object_name: key,
      native_id: `s3://${bucketName}/${key}`,
      attributes: pickStable(attributes, ['size', 'last_modified']),
      evidence: eventEvidence(event),
    });
    addContainsEdge(state, bucket.canonical_id, prefix.canonical_id, event);
    addContainsEdge(state, prefix.canonical_id, object.canonical_id, event);
  }
}

function processGlueEvent(state, context, event, objectType) {
  const attributes = event.attributes || {};
  if (objectType === 'glue_database') {
    const databaseName = attributes.database_name || event.name || event.external_id;
    const database = ensureGlueDatabase(state, context, databaseName, event, {
      description: attributes.description || null,
      location_uri: attributes.location_uri || null,
      created_at: attributes.created_at || null,
    });
    addContainsEdge(state, serviceId(context, 'glue'), database.canonical_id, event);
    addS3StorageEdges(state, context, attributes.location_uri, database, event);
    return;
  }

  if (objectType === 'glue_table') {
    const databaseName = attributes.database_name || event.parent_id;
    const tableName = attributes.table_name || event.name || event.external_id;
    const database = ensureGlueDatabase(state, context, databaseName, event);
    const table = addObject(state, context, {
      canonical_id: glueTableId(context, databaseName, tableName),
      display_name: `${databaseName}.${tableName}`,
      object_type: 'glue_table',
      service: 'glue',
      database: databaseName,
      schema: 'glue',
      object_name: tableName,
      native_id: `${databaseName}.${tableName}`,
      parent_id: database.canonical_id,
      attributes: pickStable(attributes, [
        'table_type',
        'column_count',
        'created_at',
        'updated_at',
        'location',
        'location_uri',
        'storage_location',
        'input_format',
        'output_format',
        'serde_library',
      ]),
      evidence: eventEvidence(event),
    });
    addContainsEdge(state, database.canonical_id, table.canonical_id, event);
    addS3StorageEdges(
      state,
      context,
      attributes.location || attributes.location_uri || attributes.storage_location,
      table,
      event
    );
    return;
  }

  if (objectType === 'glue_column') {
    const databaseName = attributes.database_name || String(event.parent_id || '').split('.')[0];
    const tableName = attributes.table_name || String(event.parent_id || '').split('.')[1];
    const table = ensureGlueTable(state, context, databaseName, tableName, event);
    const columnName = attributes.column_name || event.name || event.external_id;
    const column = addObject(state, context, {
      canonical_id: awsId(context, 'glue', 'column', databaseName, tableName, columnName),
      display_name: `${databaseName}.${tableName}.${columnName}`,
      object_type: 'glue_column',
      service: 'glue',
      database: databaseName,
      schema: tableName,
      object_name: columnName,
      native_id: `${databaseName}.${tableName}.${columnName}`,
      parent_id: table.canonical_id,
      attributes: pickStable(attributes, ['data_type', 'ordinal_position', 'comment']),
      evidence: eventEvidence(event),
    });
    addEdge(state, {
      from: table.canonical_id,
      to: column.canonical_id,
      relationship_type: 'has_column',
      confidence: event.confidence || 0.9,
      evidence: edgeEvidence(event, 'Glue table column metadata.'),
    });
    table.columns = mergeColumns(table.columns, {
      name: columnName,
      data_type: attributes.data_type || 'unknown',
      ordinal_position: attributes.ordinal_position || null,
      comment: attributes.comment || null,
    });
    return;
  }

  if (objectType === 'glue_job') {
    const jobName = event.name || event.external_id;
    const job = addObject(state, context, {
      canonical_id: awsId(context, 'glue', 'job', jobName),
      display_name: jobName,
      object_type: 'glue_job',
      service: 'glue',
      schema: 'jobs',
      object_name: jobName,
      native_id: jobName,
      attributes: pickStable(attributes, ['role', 'command_name', 'created_at', 'modified_at']),
      evidence: eventEvidence(event),
      missing_facts: [
        'Glue job source and target datasets are not surfaced by list/get-jobs metadata alone.',
      ],
    });
    addContainsEdge(state, serviceId(context, 'glue'), job.canonical_id, event);
    addGap(state, {
      object_id: job.canonical_id,
      gap_type: 'job_lineage_not_surfaced',
      message:
        'Glue job inventory was captured, but source/target lineage requires script parsing or job run metadata.',
    });
  }
}

function processAthenaEvent(state, context, event, objectType) {
  const attributes = event.attributes || {};
  if (objectType === 'athena_workgroup') {
    const name = event.name || event.external_id;
    const workgroup = addObject(state, context, {
      canonical_id: awsId(context, 'athena', 'workgroup', name),
      display_name: name,
      object_type: 'athena_workgroup',
      service: 'athena',
      schema: 'workgroups',
      object_name: name,
      native_id: name,
      attributes: pickStable(attributes, ['state']),
      evidence: eventEvidence(event),
    });
    addContainsEdge(state, serviceId(context, 'athena'), workgroup.canonical_id, event);
    return;
  }

  if (objectType === 'athena_data_catalog') {
    const catalogName = attributes.catalog_name || event.name || event.external_id;
    const catalog = ensureAthenaCatalog(state, context, catalogName, event, {
      type: attributes.type || null,
    });
    addContainsEdge(state, serviceId(context, 'athena'), catalog.canonical_id, event);
    return;
  }

  if (objectType === 'athena_database') {
    const catalogName = attributes.catalog_name || parentCatalogName(event) || 'AwsDataCatalog';
    const databaseName =
      attributes.database_name || event.name || lastPathSegment(event.external_id);
    const catalog = ensureAthenaCatalog(state, context, catalogName, event);
    const database = addObject(state, context, {
      canonical_id: awsId(context, 'athena', 'database', catalogName, databaseName),
      display_name: `${catalogName}.${databaseName}`,
      object_type: 'athena_database',
      service: 'athena',
      database: databaseName,
      schema: catalogName,
      object_name: databaseName,
      native_id: `${catalogName}.${databaseName}`,
      parent_id: catalog.canonical_id,
      attributes: pickStable(attributes, ['catalog_name']),
      evidence: eventEvidence(event),
    });
    addContainsEdge(state, catalog.canonical_id, database.canonical_id, event);
    return;
  }

  if (objectType === 'athena_table') {
    const catalogName = attributes.catalog_name || 'AwsDataCatalog';
    const databaseName = attributes.database_name || parseAthenaParent(event.parent_id).database;
    const tableName = attributes.table_name || event.name || lastPathSegment(event.external_id);
    const database = ensureAthenaDatabase(state, context, catalogName, databaseName, event);
    const table = addObject(state, context, {
      canonical_id: awsId(context, 'athena', 'table', catalogName, databaseName, tableName),
      display_name: `${catalogName}.${databaseName}.${tableName}`,
      object_type: 'athena_table',
      service: 'athena',
      database: databaseName,
      schema: catalogName,
      object_name: tableName,
      native_id: `${catalogName}.${databaseName}.${tableName}`,
      parent_id: database.canonical_id,
      columns: toArray(attributes.columns).map((column, index) => ({
        name: column.Name || column.name,
        data_type: column.Type || column.type || 'unknown',
        ordinal_position: index + 1,
      })),
      attributes: pickStable(attributes, ['table_type', 'column_count', 'catalog_name']),
      evidence: eventEvidence(event),
    });
    addContainsEdge(state, database.canonical_id, table.canonical_id, event);
    const glueTable = ensureGlueTable(state, context, databaseName, tableName, event, {
      inferred: true,
      missing_facts: ['Glue table detail was inferred from Athena table metadata.'],
    });
    addEdge(state, {
      from: glueTable.canonical_id,
      to: table.canonical_id,
      relationship_type: 'queried_by_athena',
      confidence: 0.72,
      evidence: edgeEvidence(
        event,
        'Athena table in AwsDataCatalog is backed by the Glue Data Catalog table with the same database and table name.'
      ),
    });
    return;
  }

  if (objectType === 'athena_named_query') {
    const queryId = event.external_id || event.name;
    const databaseName = attributes.database_name || attributes.database || null;
    const catalogName = attributes.catalog_name || 'AwsDataCatalog';
    const queryText = attributes.query_string || attributes.query || '';
    const refs = toArray(attributes.referenced_tables).length
      ? toArray(attributes.referenced_tables)
          .map((ref) => ({
            catalog: ref.catalog || ref.catalog_name || catalogName,
            database: ref.database || ref.database_name || databaseName,
            table: ref.table || ref.table_name,
          }))
          .filter((ref) => ref.database && ref.table)
      : extractAthenaSqlReferences(queryText, { catalogName, databaseName });
    const namedQuery = addObject(state, context, {
      canonical_id: awsId(context, 'athena', 'named-query', queryId),
      display_name: event.name || queryId,
      object_type: 'athena_named_query',
      service: 'athena',
      database: databaseName || '',
      schema: 'named_queries',
      object_name: event.name || queryId,
      native_id: queryId,
      attributes: {
        database_name: databaseName,
        catalog_name: catalogName,
        query_hash: attributes.query_hash || (queryText ? hashText(queryText) : null),
        referenced_tables: refs,
        description: attributes.description || null,
      },
      evidence: eventEvidence(event),
      missing_facts:
        refs.length || queryText
          ? []
          : ['Named query table references were not surfaced, so lineage could not be extracted.'],
    });
    addContainsEdge(state, serviceId(context, 'athena'), namedQuery.canonical_id, event);
    for (const ref of refs) {
      const table = ensureAthenaTable(state, context, ref.catalog, ref.database, ref.table, event, {
        inferred: true,
      });
      addEdge(state, {
        from: table.canonical_id,
        to: namedQuery.canonical_id,
        relationship_type: 'referenced_by_named_query',
        confidence: 0.7,
        evidence: edgeEvidence(event, 'Named query SQL references this Athena table.'),
      });
    }
  }
}

function processQuickSightEvent(state, context, event, objectType) {
  const attributes = event.attributes || {};
  const name = event.name || event.external_id;
  const object = addObject(state, context, {
    canonical_id: quickSightId(context, objectType, attributes.arn || event.external_id || name),
    display_name: name,
    object_type: objectType,
    service: 'quicksight',
    schema: objectType.replace('quicksight_', ''),
    object_name: name,
    native_id: attributes.arn || event.external_id || name,
    attributes: pickStable(attributes, ['arn', 'created_at', 'updated_at']),
    evidence: eventEvidence(event),
    missing_facts: [
      'QuickSight upstream dataset/source relationships are not surfaced by the current bounded list metadata.',
    ],
  });
  addContainsEdge(state, serviceId(context, 'quicksight'), object.canonical_id, event);
  addGap(state, {
    object_id: object.canonical_id,
    gap_type: 'quicksight_relationships_not_surfaced',
    message:
      'QuickSight inventory was captured, but detailed dashboard/dataset/source relationships require describe APIs or asset bundle metadata.',
  });
}

function inferAthenaGlueEdges(state) {
  for (const object of state.objects.values()) {
    if (object.object_type !== 'athena_data_catalog') continue;
    if (String(object.object_name || object.display_name).toLowerCase() !== 'awsdatacatalog')
      continue;
    const context = {
      account_id: object.account_id,
      account_name: object.account_name,
      region: object.region,
      service: 'glue',
      connector_id: object.evidence?.source_connector_ids?.[0],
      connector_type: 'aws_glue',
    };
    const glueService = ensureAwsService(state, context, 'glue');
    addEdge(state, {
      from: glueService.canonical_id,
      to: object.canonical_id,
      relationship_type: 'metadata_catalog_used_by_athena',
      confidence: 0.72,
      evidence: {
        reason:
          'Athena AwsDataCatalog uses the AWS Glue Data Catalog as its metadata catalog in the same account and region.',
        source: 'aws_lineage_inference',
      },
    });
  }
}

function addAwsAccountAndService(state, context) {
  const account = addObject(state, context, {
    canonical_id: accountId(context),
    display_name: context.account_name || context.account_id,
    object_type: 'aws_account',
    service: 'account',
    object_name: context.account_name || context.account_id,
    native_id: context.account_id,
    attributes: {
      account_id: context.account_id,
      account_name: context.account_name,
      aws_profile: context.aws_profile,
      role_name: context.role_name,
    },
    evidence: {
      source_connector_ids: [context.connector_id].filter(Boolean),
      source_connector_types: [context.connector_type].filter(Boolean),
    },
  });
  const service = ensureAwsService(state, context, context.service);
  addEdge(state, {
    from: account.canonical_id,
    to: service.canonical_id,
    relationship_type: 'contains',
    confidence: 0.95,
    evidence: {
      reason: 'Saved connector binds this AWS service to the account scope.',
      source_connector_ids: [context.connector_id].filter(Boolean),
    },
  });
}

function ensureAwsService(state, context, serviceName) {
  return addObject(
    state,
    { ...context, service: serviceName },
    {
      canonical_id: serviceId(context, serviceName),
      display_name: `${serviceLabel(serviceName)} - ${context.account_name || context.account_id}`,
      object_type: `aws_${serviceName}_service`,
      service: serviceName,
      schema: serviceName,
      object_name: serviceName,
      native_id: serviceName,
      attributes: {
        account_id: context.account_id,
        region: context.region,
        service: serviceName,
      },
      evidence: {
        source_connector_ids: [context.connector_id].filter(Boolean),
        source_connector_types: [context.connector_type].filter(Boolean),
      },
    }
  );
}

function ensureS3Bucket(state, context, bucketName, event = null) {
  return addObject(state, context, {
    canonical_id: awsId(context, 's3', 'bucket', bucketName),
    display_name: bucketName,
    object_type: 's3_bucket',
    service: 's3',
    object_name: bucketName,
    native_id: bucketName,
    evidence: event ? eventEvidence(event) : {},
  });
}

function ensureS3Prefix(state, context, bucketName, prefix, event = null) {
  const normalizedPrefix = String(prefix || '').replace(/^\/+|\/+$/g, '') || '/';
  const bucket = ensureS3Bucket(state, context, bucketName, event);
  const object = addObject(state, context, {
    canonical_id: awsId(context, 's3', 'prefix', bucketName, normalizedPrefix),
    display_name: `s3://${bucketName}/${normalizedPrefix === '/' ? '' : normalizedPrefix}`,
    object_type: 's3_prefix',
    service: 's3',
    parent_id: bucket.canonical_id,
    object_name: normalizedPrefix,
    native_id: `s3://${bucketName}/${normalizedPrefix === '/' ? '' : normalizedPrefix}`,
    evidence: event ? eventEvidence(event) : {},
  });
  addContainsEdge(state, bucket.canonical_id, object.canonical_id, event);
  return object;
}

function ensureGlueDatabase(state, context, databaseName, event = null, attributes = {}) {
  const database = addObject(state, context, {
    canonical_id: awsId(context, 'glue', 'database', databaseName),
    display_name: databaseName,
    object_type: 'glue_database',
    service: 'glue',
    database: databaseName,
    schema: 'glue',
    object_name: databaseName,
    native_id: databaseName,
    attributes,
    evidence: event ? eventEvidence(event) : {},
  });
  addContainsEdge(state, serviceId(context, 'glue'), database.canonical_id, event);
  return database;
}

function ensureGlueTable(state, context, databaseName, tableName, event = null, options = {}) {
  const database = ensureGlueDatabase(state, context, databaseName, event);
  const table = addObject(state, context, {
    canonical_id: glueTableId(context, databaseName, tableName),
    display_name: `${databaseName}.${tableName}`,
    object_type: 'glue_table',
    service: 'glue',
    database: databaseName,
    schema: 'glue',
    object_name: tableName,
    native_id: `${databaseName}.${tableName}`,
    parent_id: database.canonical_id,
    attributes: options.inferred ? { inferred_reference: true } : {},
    evidence: event ? eventEvidence(event) : {},
    missing_facts: options.missing_facts || [],
    confidence: options.inferred ? 0.55 : undefined,
  });
  addContainsEdge(state, database.canonical_id, table.canonical_id, event);
  return table;
}

function ensureAthenaCatalog(state, context, catalogName, event = null, attributes = {}) {
  const catalog = addObject(state, context, {
    canonical_id: awsId(context, 'athena', 'catalog', catalogName),
    display_name: catalogName,
    object_type: 'athena_data_catalog',
    service: 'athena',
    schema: 'catalogs',
    object_name: catalogName,
    native_id: catalogName,
    attributes,
    evidence: event ? eventEvidence(event) : {},
  });
  addContainsEdge(state, serviceId(context, 'athena'), catalog.canonical_id, event);
  return catalog;
}

function ensureAthenaDatabase(state, context, catalogName, databaseName, event = null) {
  const catalog = ensureAthenaCatalog(state, context, catalogName, event);
  const database = addObject(state, context, {
    canonical_id: awsId(context, 'athena', 'database', catalogName, databaseName),
    display_name: `${catalogName}.${databaseName}`,
    object_type: 'athena_database',
    service: 'athena',
    database: databaseName,
    schema: catalogName,
    object_name: databaseName,
    native_id: `${catalogName}.${databaseName}`,
    parent_id: catalog.canonical_id,
    evidence: event ? eventEvidence(event) : {},
  });
  addContainsEdge(state, catalog.canonical_id, database.canonical_id, event);
  return database;
}

function ensureAthenaTable(state, context, catalogName, databaseName, tableName, event = null) {
  const database = ensureAthenaDatabase(state, context, catalogName, databaseName, event);
  const table = addObject(state, context, {
    canonical_id: awsId(context, 'athena', 'table', catalogName, databaseName, tableName),
    display_name: `${catalogName}.${databaseName}.${tableName}`,
    object_type: 'athena_table',
    service: 'athena',
    database: databaseName,
    schema: catalogName,
    object_name: tableName,
    native_id: `${catalogName}.${databaseName}.${tableName}`,
    parent_id: database.canonical_id,
    attributes: { inferred_reference: true },
    evidence: event ? eventEvidence(event) : {},
    missing_facts: [
      'Athena table detail was inferred from query text and needs table metadata refresh.',
    ],
    confidence: 0.55,
  });
  addContainsEdge(state, database.canonical_id, table.canonical_id, event);
  return table;
}

function addS3StorageEdges(state, context, uri, targetObject, event) {
  const parsed = parseS3Uri(uri);
  if (!parsed) return;
  const prefix = ensureS3Prefix(state, context, parsed.bucket, parsed.prefix, event);
  addEdge(state, {
    from: prefix.canonical_id,
    to: targetObject.canonical_id,
    relationship_type: 'storage_registered_by',
    confidence: event?.confidence || 0.86,
    evidence: edgeEvidence(event, `AWS metadata surfaces storage location ${uri}.`),
  });
}

function addContainsEdge(state, from, to, event = null) {
  if (!from || !to || from === to) return;
  addEdge(state, {
    from,
    to,
    relationship_type: 'contains',
    confidence: event?.confidence || 0.9,
    evidence: edgeEvidence(event, 'Parent-child relationship surfaced by AWS metadata.'),
  });
}

function addObject(state, context, input) {
  const id = input.canonical_id;
  const existing = state.objects.get(id);
  const next = existing || {
    canonical_id: id,
    display_name: input.display_name || id,
    name: input.object_name || input.display_name || id,
    object_type: input.object_type || 'aws_asset',
    platform: AWS_PLATFORM,
    product_area: context.product_area || UNROUTED_PRODUCT_AREA,
    business_domain: context.business_domain || '',
    product_route_id: context.product_route_id || '',
    human_catalog_root: context.human_catalog_root || '',
    ownership_boundary: context.ownership_boundary || {},
    lineage_tags: context.lineage_tags || [],
    account_id: context.account_id,
    account_name: context.account_name,
    region: context.region,
    service: input.service || context.service,
    database: input.database || '',
    schema: input.schema || '',
    object_name: input.object_name || input.display_name || id,
    native_id: input.native_id || '',
    parent_id: input.parent_id || null,
    attributes: {},
    columns: [],
    evidence: {
      source_connector_ids: [],
      source_connector_types: [],
      streams: [],
    },
    missing_facts: [],
    confidence: input.confidence || 0.8,
  };
  next.display_name = input.display_name || next.display_name;
  next.object_type = input.object_type || next.object_type;
  next.product_area = preferredProductValue(next.product_area, context.product_area);
  next.business_domain = preferredProductValue(next.business_domain, context.business_domain);
  next.product_route_id = preferredProductValue(next.product_route_id, context.product_route_id);
  next.human_catalog_root = preferredProductValue(
    next.human_catalog_root,
    context.human_catalog_root
  );
  next.ownership_boundary = stripEmpty({
    ...(next.ownership_boundary || {}),
    ...(context.ownership_boundary || {}),
  });
  next.lineage_tags = [
    ...new Set([...(next.lineage_tags || []), ...(context.lineage_tags || [])]),
  ].sort();
  next.database = input.database || next.database || '';
  next.schema = input.schema || next.schema || '';
  next.object_name = input.object_name || next.object_name || next.display_name;
  next.native_id = input.native_id || next.native_id || '';
  next.parent_id = input.parent_id || next.parent_id || null;
  next.attributes = stripEmpty({ ...next.attributes, ...(input.attributes || {}) });
  next.columns = mergeColumnArrays(next.columns, input.columns || []);
  next.missing_facts = [
    ...new Set([...(next.missing_facts || []), ...(input.missing_facts || [])]),
  ];
  next.confidence = Math.max(next.confidence || 0, input.confidence || 0);
  mergeEvidence(next.evidence, input.evidence, context);
  state.objects.set(id, next);
  return next;
}

function addEdge(state, input) {
  if (!input.from || !input.to) return null;
  const relationshipType = input.relationship_type || input.type || 'depends_on';
  const id = edgeId(input.from, input.to, relationshipType);
  const existing = state.edges.get(id);
  const next = existing || {
    id,
    from: input.from,
    to: input.to,
    relationship_type: relationshipType,
    type: relationshipType,
    confidence: 0,
    evidence: {},
  };
  next.confidence = Math.max(next.confidence || 0, input.confidence || 0.7);
  next.evidence = stripEmpty({ ...next.evidence, ...(input.evidence || {}) });
  next.from_display = state.objects.get(input.from)?.display_name || input.from;
  next.to_display = state.objects.get(input.to)?.display_name || input.to;
  state.edges.set(id, next);
  return next;
}

function addGap(state, gap) {
  if (!gap?.object_id) return;
  const key = `${gap.object_id}:${gap.gap_type}:${gap.message}`;
  if (state.gaps.some((item) => `${item.object_id}:${item.gap_type}:${item.message}` === key))
    return;
  state.gaps.push(gap);
}

function awsConnectorContext(connector = {}) {
  const config = connector.config || {};
  const accountId =
    config.aws_account_id || config.account_id || config.accountId || 'unknown-account';
  const service = config.service || connectorService(connector.type);
  const productRoute = awsProductRoute(connector, config);
  return {
    connector_id: connector.id,
    connector_type: connector.type,
    ...productRoute,
    account_id: String(accountId),
    account_name: config.account_name || config.account || accountId,
    aws_profile:
      config.aws_profile ||
      connector.credential?.aws_profile ||
      connector.credential?.profile ||
      null,
    role_name: config.role_name || null,
    region: config.region || config.aws_region || 'us-east-1',
    service,
  };
}

function awsProductRoute(connector = {}, config = {}) {
  const productArea = cleanProductValue(
    config.product_area || config.lineage_product || config.productArea || connector.product_area
  );
  const businessDomain = cleanProductValue(
    config.business_domain || config.lineage_business_domain || connector.business_domain
  );
  const productRouteId = cleanProductValue(
    config.product_route_id || config.lineage_product_route_id || connector.product_route_id
  );
  const humanCatalogRoot = cleanProductValue(
    config.human_catalog_root || config.confluence_human_root || connector.human_catalog_root
  );
  const ownershipBoundary = stripEmpty({
    system_owner: cleanProductValue(config.system_owner || config.owner_boundary_system_owner),
    data_team_role: cleanProductValue(
      config.data_team_role || config.owner_boundary_data_team_role
    ),
    ownership_note: cleanProductValue(config.ownership_note),
  });
  const lineageTags = [
    'aws',
    productArea ? `product:${productArea}` : 'product:unrouted',
    ...(Array.isArray(config.lineage_tags) ? config.lineage_tags : []),
  ]
    .map(cleanProductValue)
    .filter(Boolean);

  return {
    product_area: productArea || UNROUTED_PRODUCT_AREA,
    business_domain: businessDomain,
    product_route_id: productRouteId,
    human_catalog_root: humanCatalogRoot,
    ownership_boundary: ownershipBoundary,
    lineage_tags: [...new Set(lineageTags)].sort(),
    is_product_routed: Boolean(productArea && humanCatalogRoot),
  };
}

function cleanProductValue(value) {
  return String(value || '').trim();
}

function preferredProductValue(existing, incoming) {
  if (!incoming || incoming === UNROUTED_PRODUCT_AREA) return existing || '';
  if (!existing || existing === UNROUTED_PRODUCT_AREA) return incoming;
  return existing;
}

function awsObjectTypeForEvent(context, event) {
  const { stream } = event;
  if (context.service === 's3') {
    if (stream === 'buckets') return 's3_bucket';
    if (stream === 'objects') return 's3_object';
  }
  if (context.service === 'glue') {
    if (stream === 'databases') return 'glue_database';
    if (stream === 'tables') return 'glue_table';
    if (stream === 'columns') return 'glue_column';
    if (stream === 'jobs') return 'glue_job';
  }
  if (context.service === 'athena') {
    if (stream === 'workgroups') return 'athena_workgroup';
    if (stream === 'data_catalogs') return 'athena_data_catalog';
    if (stream === 'databases') return 'athena_database';
    if (stream === 'tables') return 'athena_table';
    if (stream === 'named_queries') return 'athena_named_query';
  }
  if (context.service === 'quicksight') {
    if (stream === 'dashboards') return 'quicksight_dashboard';
    if (stream === 'datasets') return 'quicksight_dataset';
    if (stream === 'data_sources') return 'quicksight_data_source';
    if (stream === 'analyses') return 'quicksight_analysis';
  }
  return event.object_type || null;
}

function connectorService(type) {
  if (type === 'aws_s3') return 's3';
  if (type === 'aws_glue') return 'glue';
  if (type === 'aws_athena') return 'athena';
  if (type === 'quicksight') return 'quicksight';
  return String(type || 'aws').replace(/^aws_/, '');
}

function accountId(context) {
  return awsId(context, 'account', context.account_id);
}

function serviceId(context, serviceName) {
  return awsId(context, serviceName, 'service');
}

function glueTableId(context, databaseName, tableName) {
  return awsId(context, 'glue', 'table', databaseName, tableName);
}

function quickSightId(context, objectType, nativeId) {
  return awsId(context, 'quicksight', objectType.replace(/^quicksight_/, ''), nativeId);
}

function awsId(context, ...parts) {
  return [
    'aws:/',
    encodePart(context.account_id),
    encodePart(context.region),
    ...parts.map(encodePart),
  ].join('/');
}

function encodePart(value) {
  return encodeURIComponent(String(value ?? '').trim() || '-').replace(/%2F/gi, '/');
}

function edgeId(from, to, relationshipType) {
  return `edge:aws:${hashText(`${relationshipType}|${from}|${to}`)}`;
}

function parseS3Uri(uri) {
  const text = String(uri || '').trim();
  const match = text.match(/^s3:\/\/([^/]+)\/?(.*)$/i);
  if (!match) return null;
  return {
    bucket: match[1],
    prefix: String(match[2] || '').replace(/^\/+|\/+$/g, '') || '/',
  };
}

function prefixFromKey(key) {
  const text = String(key || '').replace(/^\/+/, '');
  if (!text.includes('/')) return '/';
  return text.split('/').slice(0, -1).join('/') || '/';
}

function parentCatalogName(event) {
  return String(event.parent_id || '').split('.')[0] || null;
}

function parseAthenaParent(value) {
  const [catalog, database] = String(value || '').split('.');
  return { catalog: catalog || null, database: database || null };
}

function lastPathSegment(value) {
  return (
    String(value || '')
      .split('.')
      .filter(Boolean)
      .pop() || String(value || '')
  );
}

function extractAthenaSqlReferences(sql, defaults = {}) {
  const text = stripSqlComments(sql);
  const refs = new Map();
  const identifier = '(?:"[^"]+"|`[^`]+`|\\[[^\\]]+\\]|[A-Za-z0-9_$-]+)';
  const pattern = new RegExp(
    `\\b(?:from|join)\\s+(${identifier}(?:\\s*\\.\\s*${identifier}){0,2})`,
    'gi'
  );
  for (const match of text.matchAll(pattern)) {
    const parts = match[1].split('.').map(cleanSqlIdentifier).filter(Boolean);
    if (!parts.length) continue;
    let catalog = defaults.catalogName || 'AwsDataCatalog';
    let database = defaults.databaseName || '';
    let table = '';
    if (parts.length === 3) [catalog, database, table] = parts;
    if (parts.length === 2) [database, table] = parts;
    if (parts.length === 1) [table] = parts;
    if (!database || !table) continue;
    const key = `${catalog}.${database}.${table}`.toLowerCase();
    refs.set(key, { catalog, database, table });
  }
  return [...refs.values()].sort((left, right) =>
    `${left.catalog}.${left.database}.${left.table}`.localeCompare(
      `${right.catalog}.${right.database}.${right.table}`
    )
  );
}

function stripSqlComments(sql) {
  return String(sql || '')
    .replace(/\/\*[\s\S]*?\*\//g, ' ')
    .replace(/--.*$/gm, ' ');
}

function cleanSqlIdentifier(value) {
  return String(value || '')
    .trim()
    .replace(/^\[|\]$/g, '')
    .replace(/^["`]|["`]$/g, '');
}

function finalizeObject(object, edges) {
  const related = [...edges.values()].filter(
    (edge) => edge.from === object.canonical_id || edge.to === object.canonical_id
  );
  return {
    ...object,
    relationship_count: related.length,
    upstream_count: related.filter((edge) => edge.to === object.canonical_id).length,
    downstream_count: related.filter((edge) => edge.from === object.canonical_id).length,
  };
}

function summarizeAwsPackage({ objects, edges, gaps }) {
  return {
    object_count: objects.length,
    edge_count: edges.length,
    gap_count: gaps.length,
    product_areas: productAreaSummary(objects),
    objects_by_type: groupCounts(objects.map((object) => object.object_type)),
    edges_by_type: groupCounts(edges.map((edge) => edge.relationship_type)),
  };
}

function productAreaSummary(objects = []) {
  return groupCounts(objects.map((object) => object.product_area || UNROUTED_PRODUCT_AREA));
}

function primaryProductArea(objects = []) {
  const entries = Object.entries(productAreaSummary(objects)).sort((left, right) => {
    if (left[0] === UNROUTED_PRODUCT_AREA) return 1;
    if (right[0] === UNROUTED_PRODUCT_AREA) return -1;
    return right[1] - left[1] || left[0].localeCompare(right[0]);
  });
  return entries[0]?.[0] || UNROUTED_PRODUCT_AREA;
}

function humanCatalogRoots(objects = []) {
  return [...new Set(objects.map((object) => object.human_catalog_root).filter(Boolean))].sort();
}

function buildAiEvidencePacket(object, edges) {
  const relatedEdges = edges
    .filter((edge) => edge.from === object.canonical_id || edge.to === object.canonical_id)
    .map(edgeForSignature);
  return {
    canonical_id: object.canonical_id,
    display_name: object.display_name,
    object_type: object.object_type,
    platform: AWS_PLATFORM,
    product_area: object.product_area || UNROUTED_PRODUCT_AREA,
    business_domain: object.business_domain || '',
    product_route_id: object.product_route_id || '',
    human_catalog_root: object.human_catalog_root || '',
    ownership_boundary: object.ownership_boundary || {},
    account_id: object.account_id,
    account_name: object.account_name,
    region: object.region,
    service: object.service,
    bounded_evidence: {
      native_id: object.native_id,
      parent_id: object.parent_id,
      columns: object.columns || [],
      attributes: object.attributes || {},
      lineage_edges: relatedEdges,
      missing_facts: object.missing_facts || [],
      lineage_tags: object.lineage_tags || [],
    },
    ai_instructions: [
      'Write plain-English support language only from bounded_evidence.',
      'Do not infer business purpose, owner, steward, SLA, freshness, or certification from an AWS name alone.',
      'Use "not surfaced in metadata" for unsupported facts.',
      'Do not include credentials, tokens, raw S3 object values, or unrestricted payloads.',
    ],
  };
}

function edgeForSignature(edge) {
  return {
    from: edge.from,
    to: edge.to,
    relationship_type: edge.relationship_type,
    confidence: edge.confidence,
    reason: edge.evidence?.reason || '',
  };
}

function eventEvidence(event) {
  return stripEmpty({
    source_connector_ids: [event.connector_id].filter(Boolean),
    source_connector_types: [event.connector_type].filter(Boolean),
    streams: [event.stream].filter(Boolean),
    bridge_kind: event.evidence?.bridge_kind || null,
    docs: event.evidence?.docs || [],
  });
}

function edgeEvidence(event, reason) {
  return stripEmpty({
    reason,
    source_connector_ids: [event?.connector_id].filter(Boolean),
    source_connector_types: [event?.connector_type].filter(Boolean),
    streams: [event?.stream].filter(Boolean),
  });
}

function mergeEvidence(target, input = {}, context = {}) {
  target.source_connector_ids = [
    ...new Set(
      [
        ...(target.source_connector_ids || []),
        ...(input.source_connector_ids || []),
        context.connector_id,
      ].filter(Boolean)
    ),
  ].sort();
  target.source_connector_types = [
    ...new Set(
      [
        ...(target.source_connector_types || []),
        ...(input.source_connector_types || []),
        context.connector_type,
      ].filter(Boolean)
    ),
  ].sort();
  target.streams = [
    ...new Set([...(target.streams || []), ...(input.streams || [])].filter(Boolean)),
  ].sort();
  if (input.bridge_kind) target.bridge_kind = input.bridge_kind;
  if (input.docs?.length)
    target.docs = [...new Set([...(target.docs || []), ...input.docs])].sort();
}

function mergeColumnArrays(left = [], right = []) {
  let columns = [...left];
  for (const column of right) {
    columns = mergeColumns(columns, column);
  }
  return columns;
}

function mergeColumns(columns = [], column) {
  if (!column?.name) return columns;
  const existing = columns.find((item) => item.name === column.name);
  if (existing) Object.assign(existing, stripEmpty({ ...existing, ...column }));
  else columns.push(stripEmpty(column));
  columns.sort((left, right) => (left.ordinal_position || 0) - (right.ordinal_position || 0));
  return columns;
}

function pickStable(object = {}, keys = []) {
  return stripEmpty(Object.fromEntries(keys.map((key) => [key, object[key]])));
}

function stripEmpty(object = {}) {
  return Object.fromEntries(
    Object.entries(object).filter(
      ([, value]) => value !== undefined && value !== null && value !== ''
    )
  );
}

function toArray(value) {
  if (Array.isArray(value)) return value;
  if (value === undefined || value === null) return [];
  return [value];
}

function groupCounts(values = []) {
  return values.reduce((acc, value) => {
    const key = value || 'unknown';
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});
}

function hashText(value) {
  return crypto
    .createHash('sha256')
    .update(String(value || ''))
    .digest('hex')
    .slice(0, 24);
}

function serviceLabel(serviceName) {
  const labels = {
    s3: 'Amazon S3',
    glue: 'AWS Glue Data Catalog',
    athena: 'Amazon Athena',
    quicksight: 'Amazon QuickSight',
  };
  return labels[serviceName] || `AWS ${serviceName}`;
}

function awsPackageScope(objects, connectorIds) {
  const accounts = [...new Set(objects.map((object) => object.account_id).filter(Boolean))].sort();
  if (accounts.length === 1) return `aws-account:${accounts[0]}`;
  if (connectorIds.length === 1) return `aws-connector:${connectorIds[0]}`;
  return 'aws';
}
