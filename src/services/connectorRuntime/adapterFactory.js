import { BaseConnectorAdapter } from './baseAdapter.js';
import { CANONICAL_EVENT_TYPES, canonicalEvent } from './canonicalMetadata.js';
import { ConnectorConfigError, ConnectorRuntimeError } from './connectorErrors.js';
import { hasDirectSourceClient } from './sourceClients.js';

const STREAM = {
  object: CANONICAL_EVENT_TYPES.OBJECT,
  column: CANONICAL_EVENT_TYPES.COLUMN,
  metric: CANONICAL_EVENT_TYPES.METRIC,
  dashboard: CANONICAL_EVENT_TYPES.DASHBOARD,
  report: CANONICAL_EVENT_TYPES.REPORT,
  dataset: CANONICAL_EVENT_TYPES.DATASET,
  semanticModel: CANONICAL_EVENT_TYPES.SEMANTIC_MODEL,
  dataSource: CANONICAL_EVENT_TYPES.DATA_SOURCE,
  lineage: CANONICAL_EVENT_TYPES.LINEAGE_EDGE,
  usage: CANONICAL_EVENT_TYPES.USAGE_EVENT,
};

function stream(name, canonicalType, endpoint, options = {}) {
  return {
    name,
    label: options.label || name.replace(/_/g, ' '),
    canonical_type: canonicalType,
    endpoint,
    method: options.method || 'GET',
    cursor: options.cursor || null,
    pagination: options.pagination || 'page',
    object_type: options.object_type || name,
    metadata: options.metadata || [],
    aliases: options.aliases || [],
  };
}

class BIConnectorAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['base_url'];
    this.requiredCredentialModes = ['oauth', 'api_token_reference', 'service_account', 'service_principal', 'pat', 'secret_reference'];
    this.capability = {
      ...this.capability,
      supports_usage: true,
      supports_metrics: true,
      supports_semantic_models: true,
    };
    this.streams = [
      stream('folders', STREAM.object, '/folders', { metadata: ['folders', 'projects', 'workspaces'] }),
      stream('dashboards', STREAM.dashboard, '/dashboards', { metadata: ['dashboards', 'tiles', 'visuals'] }),
      stream('reports', STREAM.report, '/reports', { metadata: ['reports', 'pages', 'visuals'] }),
      stream('datasets', STREAM.dataset, '/datasets', { metadata: ['datasets', 'tables', 'columns'] }),
      stream('semantic_models', STREAM.semanticModel, '/semantic-models', { metadata: ['models', 'cubes', 'perspectives'] }),
      stream('metrics', STREAM.metric, '/metrics', { metadata: ['measures', 'metrics', 'calculations'] }),
      stream('data_sources', STREAM.dataSource, '/datasources', { metadata: ['connections', 'datasources'] }),
      stream('lineage', STREAM.lineage, '/lineage', { metadata: ['report -> dataset', 'dataset -> source'] }),
      stream('usage', STREAM.usage, '/activity', { cursor: 'modified_at', metadata: ['views', 'subscribers', 'refreshes'] }),
    ];
  }
}

class PowerBiAdapter extends BIConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['tenant_id'];
    this.requiredCredentialModes = ['service_principal', 'delegated_oauth'];
    this.streams = [
      stream('workspaces', STREAM.object, 'GET /v1.0/myorg/admin/groups?$top=5000', { metadata: ['workspaces', 'capacities'] }),
      stream('dashboards', STREAM.dashboard, 'GET /v1.0/myorg/admin/dashboards', { metadata: ['dashboards', 'tiles'] }),
      stream('reports', STREAM.report, 'GET /v1.0/myorg/admin/reports', { metadata: ['reports', 'datasetId', 'workspaceId'] }),
      stream('datasets', STREAM.dataset, 'GET /v1.0/myorg/admin/datasets', { metadata: ['datasets', 'endorsement', 'sensitivity labels'] }),
      stream('dataflows', STREAM.dataset, 'GET /v1.0/myorg/admin/dataflows', { metadata: ['dataflows', 'datasources'] }),
      stream('datasources', STREAM.dataSource, 'GET /v1.0/myorg/admin/datasets/{datasetId}/datasources', { metadata: ['datasource type', 'connection details'] }),
      stream('scanner_metadata', STREAM.semanticModel, 'POST /v1.0/myorg/admin/workspaces/getInfo', { method: 'POST', metadata: ['tables', 'columns', 'measures', 'expressions'] }),
      stream('activity_events', STREAM.usage, 'GET /v1.0/myorg/admin/activityevents', { cursor: 'activityDateTime', metadata: ['view report', 'refresh', 'share'] }),
      stream('lineage', STREAM.lineage, 'Power BI artifact relationships and external datasource links', { metadata: ['dataflow -> dataset', 'dataset -> report', 'report -> dashboard'] }),
    ];
  }
}

class MicroStrategyAdapter extends BIConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['base_url', 'project_id'];
    this.requiredCredentialModes = ['oauth', 'api_token_reference', 'service_account'];
    this.streams = [
      stream('projects', STREAM.object, 'GET /api/projects', { metadata: ['projects'] }),
      stream('dossiers', STREAM.dashboard, 'GET /api/dossiers', { metadata: ['dossiers', 'chapters', 'visualizations'] }),
      stream('documents', STREAM.report, 'GET /api/documents', { metadata: ['documents'] }),
      stream('reports', STREAM.report, 'GET /api/v2/reports', { metadata: ['reports', 'grids', 'prompts'] }),
      stream('cubes', STREAM.dataset, 'GET /api/cubes', { metadata: ['intelligent cubes', 'attributes', 'metrics'] }),
      stream('schema_objects', STREAM.semanticModel, 'GET /api/model/schema/objects', { metadata: ['facts', 'attributes', 'metrics', 'hierarchies'] }),
      stream('data_sources', STREAM.dataSource, 'GET /api/datasources', { metadata: ['datasource connections'] }),
      stream('lineage', STREAM.lineage, 'MicroStrategy object dependencies', { metadata: ['report -> cube', 'cube -> datasource', 'metric -> fact'] }),
    ];
  }
}

class SsasAdapter extends BIConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['server'];
    this.requiredCredentialModes = ['windows_integrated', 'service_account', 'secret_reference'];
    this.streams = [
      stream('databases', STREAM.object, 'XMLA Discover DBSCHEMA_CATALOGS', { metadata: ['databases'] }),
      stream('models', STREAM.semanticModel, 'XMLA Discover MDSCHEMA_CUBES / TMSCHEMA_MODEL', { metadata: ['tabular models', 'multidimensional cubes'] }),
      stream('dimensions', STREAM.object, 'XMLA Discover MDSCHEMA_DIMENSIONS', { metadata: ['dimensions', 'hierarchies'] }),
      stream('measures', STREAM.metric, 'XMLA Discover MDSCHEMA_MEASURES / TMSCHEMA_MEASURES', { metadata: ['measures', 'DAX or MDX expressions'] }),
      stream('partitions', STREAM.dataset, 'XMLA Discover TMSCHEMA_PARTITIONS', { metadata: ['partitions', 'source queries'] }),
      stream('data_sources', STREAM.dataSource, 'XMLA Discover TMSCHEMA_DATA_SOURCES', { metadata: ['datasource connection metadata'] }),
      stream('roles', STREAM.object, 'XMLA Discover TMSCHEMA_ROLES', { metadata: ['security roles'] }),
      stream('lineage', STREAM.lineage, 'XMLA model datasource and partition dependencies', { metadata: ['model -> datasource', 'measure -> table'] }),
    ];
  }
}

class TableauAdapter extends BIConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['base_url', 'site_id'];
    this.requiredCredentialModes = ['pat', 'service_account'];
    this.streams = [
      stream('projects', STREAM.object, 'REST GET /api/{version}/sites/{siteId}/projects', { metadata: ['projects'] }),
      stream('workbooks', STREAM.dashboard, 'REST GET /api/{version}/sites/{siteId}/workbooks', { metadata: ['workbooks', 'views'] }),
      stream('views', STREAM.report, 'REST GET /api/{version}/sites/{siteId}/views', { metadata: ['views', 'sheets'] }),
      stream('datasources', STREAM.dataSource, 'REST GET /api/{version}/sites/{siteId}/datasources', { metadata: ['published datasources'] }),
      stream('metadata_graphql', STREAM.lineage, 'Metadata API GraphQL', { metadata: ['databases', 'tables', 'columns', 'workbook dependencies'] }),
      stream('usage', STREAM.usage, 'REST view/workbook usage stats', { metadata: ['view counts', 'favorites'] }),
    ];
  }
}

class DataWarehouseAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['database'];
    this.requiredCredentialModes = ['service_account', 'secret_reference', 'managed_identity', 'iam_role', 'workload_identity', 'key_pair'];
    this.capability = {
      ...this.capability,
      supports_profiling: true,
      supports_live_profile: false,
      profile_framework: 'aggregate_profile_execution',
      profile_dialect: args.connector?.type === 'aws_redshift' ? 'redshift' : args.connector?.type,
    };
    this.streams = [
      stream('schemas', STREAM.object, 'information_schema.schemata', { metadata: ['schemas'] }),
      stream('tables', STREAM.object, 'information_schema.tables', { metadata: ['tables', 'views'] }),
      stream('columns', STREAM.column, 'information_schema.columns', { metadata: ['columns', 'types', 'nullability'] }),
      stream('constraints', STREAM.object, 'information_schema constraints', { metadata: ['primary keys', 'foreign keys'] }),
      stream('routines', STREAM.object, 'information_schema routines', { metadata: ['procedures', 'functions'] }),
      stream('usage', STREAM.usage, 'query history / audit views', { cursor: 'event_time', metadata: ['queries', 'access'] }),
      stream('lineage', STREAM.lineage, 'dependency views or parsed SQL', { metadata: ['object dependencies'] }),
    ];
  }
}

function objectName(object = {}) {
  return object.name || object.objectName || object.packageName || object.projectName || object.id || 'unknown';
}

class SqlServerLiveAdapter extends DataWarehouseAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['database'];
    this.requiredCredentialModes = ['service_account', 'secret_reference', 'managed_identity', 'windows_integrated'];
    this.capability = {
      ...this.capability,
      supports_live_read: true,
      supports_profiling: true,
      supports_live_profile: false,
      existing_extractor: 'SqlServerMetadataExtractor',
    };
    this.streams = [
      stream('schemas', STREAM.object, 'sys.schemas and inventory grouping', { metadata: ['schemas'] }),
      stream('tables', STREAM.object, 'SqlServerMetadataExtractor.extractTables', { metadata: ['tables', 'indexes', 'constraints'] }),
      stream('views', STREAM.object, 'SqlServerMetadataExtractor.extractViews', { metadata: ['views', 'dependencies'] }),
      stream('columns', STREAM.column, 'SqlServerMetadataExtractor.extractAllColumns', { metadata: ['columns', 'types', 'nullability'] }),
      stream('procedures', STREAM.object, 'SqlServerMetadataExtractor.extractStoredProcedures', { metadata: ['procedures', 'parameters', 'dependencies'] }),
      stream('functions', STREAM.object, 'SqlServerMetadataExtractor.extractFunctions', { metadata: ['functions', 'parameters', 'dependencies'] }),
      stream('triggers', STREAM.object, 'SqlServerMetadataExtractor.extractTriggers', { metadata: ['triggers', 'dependencies'] }),
      stream('relationships', STREAM.lineage, 'SqlServerMetadataExtractor.relationships', { metadata: ['foreign keys', 'dependency edges', 'procedure load edges'] }),
    ];
  }

  async loadMetadata(options = {}) {
    if (this.metadataPromise) return this.metadataPromise;
    if (options.mockMetadata) {
      this.lastMetadata = options.mockMetadata;
      return options.mockMetadata;
    }
    if (options.dry_run !== false) return null;
    this.metadataPromise = (async () => {
      const SqlServerMetadataExtractor = (await import('../sqlServerExtractor.js')).default;
      const connectionConfig = this.config.connectionConfig || this.config;
      const extractor = new SqlServerMetadataExtractor(connectionConfig, this.config.sqlDriver);
      await extractor.connect();
      try {
        const metadata = await extractor.extractAllMetadata(this.config.database, {
          schemas: this.config.selectedSchemas || this.config.schemas || [],
          tables: this.config.selectedTables || this.config.tables || [],
          excludeSchemas: this.config.excludeSchemas || [],
          excludeTables: this.config.excludeTables || [],
        });
        this.lastMetadata = metadata;
        return metadata;
      } finally {
        await extractor.disconnect().catch(() => {});
      }
    })().catch((err) => {
      throw new ConnectorRuntimeError(`SQL Server extraction failed: ${err.message}`, {
        connector_id: this.id,
        connector_type: this.type,
        details: { original_error: err.message },
      });
    });
    return this.metadataPromise;
  }

  async readStream(streamName, options = {}) {
    const streamConfig = this.streamByName(streamName);
    const metadata = await this.loadMetadata(options);
    if (!metadata) return super.readStream(streamName, options);
    const events = this.eventsForStream(streamName, metadata);
    return {
      stream: streamName,
      events,
      state: { high_watermark: metadata.extractedAt || new Date().toISOString() },
      plan: this.streamPlan(streamConfig),
    };
  }

  eventsForStream(streamName, metadata = {}) {
    const eventBase = (item, type, objectType, extra = {}) =>
      canonicalEvent({
        type,
        connector: this.connector,
        stream: streamName,
        external_id: item.id || item.external_id || `${objectType}/${objectName(item)}`,
        name: objectName(item),
        object_type: objectType,
        attributes: { ...item, ...extra },
        confidence: item.confidence || 0.9,
      });

    if (streamName === 'schemas') {
      const schemas = new Set((metadata.allObjects || []).map((item) => item.schema).filter(Boolean));
      return [...schemas].map((schema) =>
        eventBase({ id: `${metadata.database || this.config.database}.${schema}`, name: schema }, STREAM.object, 'schema')
      );
    }
    if (streamName === 'tables') return (metadata.tables || []).map((item) => eventBase(item, STREAM.object, 'table'));
    if (streamName === 'views') return (metadata.views || []).map((item) => eventBase(item, STREAM.object, 'view'));
    if (streamName === 'procedures') return (metadata.storedProcedures || []).map((item) => eventBase(item, STREAM.object, 'stored_procedure'));
    if (streamName === 'functions') return (metadata.functions || []).map((item) => eventBase(item, STREAM.object, 'function'));
    if (streamName === 'triggers') return (metadata.triggers || []).map((item) => eventBase(item, STREAM.object, 'trigger'));
    if (streamName === 'columns') {
      return [...(metadata.tables || []), ...(metadata.views || [])].flatMap((object) =>
        (object.columns || []).map((column) =>
          canonicalEvent({
            type: STREAM.column,
            connector: this.connector,
            stream: streamName,
            external_id: `${object.id || object.name}/${column.name || column.column_name}`,
            name: column.name || column.column_name,
            object_type: 'column',
            parent_id: object.id || object.name,
            attributes: column,
            confidence: 0.9,
          })
        )
      );
    }
    if (streamName === 'relationships') {
      return (metadata.relationships || []).map((edge) =>
        canonicalEvent({
          type: STREAM.lineage,
          connector: this.connector,
          stream: streamName,
          external_id: edge.id || `${edge.fromTable || edge.from}->${edge.toTable || edge.to}`,
          name: edge.type || edge.edgeType || 'sql_dependency',
          object_type: 'lineage_edge',
          attributes: edge,
          lineage: [{ from: edge.fromTable || edge.from, to: edge.toTable || edge.to, type: edge.type || edge.edgeType }],
          confidence: edge.confidence || 0.75,
        })
      );
    }
    return [];
  }
}

class CloudStorageAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['account'];
    this.requiredCredentialModes = ['managed_identity', 'service_principal', 'iam_role', 'workload_identity', 'access_key_reference', 'sas_reference'];
    this.streams = [
      stream('containers', STREAM.object, 'list buckets/containers', { metadata: ['buckets', 'containers'] }),
      stream('objects', STREAM.object, 'list object metadata', { cursor: 'last_modified', metadata: ['paths', 'size', 'etag', 'last modified'] }),
      stream('schemas', STREAM.dataset, 'infer schema from safe samples or manifests', { metadata: ['file formats', 'schemas'] }),
      stream('classifications', STREAM.object, 'classification tags and labels', { metadata: ['sensitivity', 'policy labels'] }),
      stream('lineage', STREAM.lineage, 'storage path dependencies', { metadata: ['path -> dataset'] }),
    ];
  }
}

class CloudPlatformAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['account'];
    this.requiredCredentialModes = ['managed_identity', 'service_principal', 'iam_role', 'workload_identity', 'service_account'];
    this.streams = [
      stream('assets', STREAM.object, 'catalog/datamap assets', { metadata: ['registered assets'] }),
      stream('schemas', STREAM.dataset, 'catalog schemas', { metadata: ['schemas', 'tables', 'columns'] }),
      stream('classifications', STREAM.object, 'catalog classifications', { metadata: ['tags', 'sensitivity'] }),
      stream('glossary', STREAM.object, 'catalog glossary', { metadata: ['terms', 'relationships'] }),
      stream('lineage', STREAM.lineage, 'catalog lineage APIs', { metadata: ['upstream', 'downstream'] }),
    ];
  }
}

class PipelineAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['base_url'];
    this.requiredCredentialModes = ['managed_identity', 'service_principal', 'basic_auth', 'bearer_token_reference', 'api_token_reference', 'repo_reference'];
    this.streams = [
      stream('pipelines', STREAM.object, 'pipelines/dags/jobs endpoint', { metadata: ['pipelines', 'jobs', 'dags'] }),
      stream('tasks', STREAM.object, 'tasks/activities endpoint', { metadata: ['tasks', 'activities', 'operators'] }),
      stream('datasets', STREAM.dataset, 'datasets endpoint', { metadata: ['pipeline datasets'] }),
      stream('connections', STREAM.dataSource, 'connections/linked services endpoint', { metadata: ['source and target connections'] }),
      stream('schedules', STREAM.object, 'triggers/schedules endpoint', { metadata: ['schedules', 'triggers'] }),
      stream('lineage', STREAM.lineage, 'pipeline dependency graph', { metadata: ['task -> dataset', 'dataset -> task'] }),
    ];
  }
}

class SsisLiveAdapter extends PipelineAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['server'];
    this.requiredCredentialModes = ['windows_integrated', 'service_account', 'secret_reference'];
    this.capability = {
      ...this.capability,
      supports_live_read: true,
      existing_extractor: 'SsisMetadataExtractor',
    };
    this.streams = [
      stream('catalog', STREAM.object, 'SsisMetadataExtractor.extractCatalogInventory', { metadata: ['folders', 'projects', 'packages'] }),
      stream('packages', STREAM.object, 'SsisMetadataExtractor.extractPackageXmlMetadata', { metadata: ['packages', 'control flow', 'data flow'] }),
      stream('tasks', STREAM.object, 'SsisMetadataExtractor XML task parsing', { metadata: ['executables', 'components', 'SQL tasks'] }),
      stream('connections', STREAM.dataSource, 'SSIS connection managers', { metadata: ['connection managers', 'resolved dynamic connections'] }),
      stream('parameters', STREAM.object, 'SsisMetadataExtractor.extractParameters', { metadata: ['project and package parameters'] }),
      stream('environments', STREAM.object, 'SsisMetadataExtractor.extractEnvironments', { metadata: ['environment variables'] }),
      stream('agent_jobs', STREAM.object, 'SsisMetadataExtractor.extractAgentJobs', { metadata: ['SQL Agent jobs', 'SSIS job steps'] }),
      stream('lineage', STREAM.lineage, 'SsisMetadataExtractor.buildLineageEdges', { metadata: ['package calls', 'source-target edges', 'SQL task edges'] }),
    ];
  }

  async loadMetadata(options = {}) {
    if (this.metadataPromise) return this.metadataPromise;
    if (options.mockMetadata) {
      this.lastMetadata = options.mockMetadata;
      return options.mockMetadata;
    }
    if (options.dry_run !== false) return null;
    this.metadataPromise = (async () => {
      const { SsisMetadataExtractor } = await import('../ssisExtractor.js');
      const connectionConfig = this.config.connectionConfig || this.config;
      const extractor = new SsisMetadataExtractor(connectionConfig, this.config.sqlDriver);
      await extractor.connect();
      try {
        const metadata = await extractor.extractAll({
          extractXml: options.extractXml !== false,
        });
        this.lastMetadata = metadata;
        return metadata;
      } finally {
        await extractor.disconnect().catch(() => {});
      }
    })().catch((err) => {
      throw new ConnectorRuntimeError(`SSIS extraction failed: ${err.message}`, {
        connector_id: this.id,
        connector_type: this.type,
        details: { original_error: err.message },
      });
    });
    return this.metadataPromise;
  }

  async readStream(streamName, options = {}) {
    const streamConfig = this.streamByName(streamName);
    const metadata = await this.loadMetadata(options);
    if (!metadata) return super.readStream(streamName, options);
    const events = this.eventsForStream(streamName, metadata);
    return {
      stream: streamName,
      events,
      state: { high_watermark: metadata.extractedAt || new Date().toISOString() },
      plan: this.streamPlan(streamConfig),
    };
  }

  eventsForStream(streamName, metadata = {}) {
    const event = (item, type, objectType, extra = {}) =>
      canonicalEvent({
        type,
        connector: this.connector,
        stream: streamName,
        external_id: item.id || item.packageId || item.packageName || item.project_id || item.project_name || objectName(item),
        name: objectName(item),
        object_type: objectType,
        attributes: { ...item, ...extra },
        confidence: item.confidence || 0.85,
      });

    if (streamName === 'catalog') return (metadata.catalog || []).map((item) => event(item, STREAM.object, 'ssis_catalog_object'));
    if (streamName === 'packages') return (metadata.xmlMetadata || []).map((item) => event(item, STREAM.object, 'ssis_package'));
    if (streamName === 'tasks') {
      return (metadata.xmlMetadata || []).flatMap((pkg) =>
        [
          ...(pkg.sqlTasks || []),
          ...(pkg.packageTasks || []),
          ...(pkg.dataFlowComponents || []),
        ].map((task) => event({ ...task, id: `${pkg.packageId || pkg.packageName}/${task.taskName || task.componentName || objectName(task)}` }, STREAM.object, 'ssis_task', { package_id: pkg.packageId || pkg.packageName }))
      );
    }
    if (streamName === 'connections') {
      return (metadata.xmlMetadata || []).flatMap((pkg) =>
        (pkg.connectionManagers || []).map((connection) => event(connection, STREAM.dataSource, 'ssis_connection', { package_id: pkg.packageId || pkg.packageName }))
      );
    }
    if (streamName === 'parameters') return (metadata.parameters || []).map((item) => event(item, STREAM.object, 'ssis_parameter'));
    if (streamName === 'environments') return (metadata.environments?.variables || []).map((item) => event(item, STREAM.object, 'ssis_environment_variable'));
    if (streamName === 'agent_jobs') return [...(metadata.agentJobs?.jobs || []), ...(metadata.agentJobs?.ssisSteps || [])].map((item) => event(item, STREAM.object, 'sql_agent_job'));
    if (streamName === 'lineage') {
      return (metadata.lineageEdges || []).map((edge) =>
        canonicalEvent({
          type: STREAM.lineage,
          connector: this.connector,
          stream: streamName,
          external_id: edge.id || `${edge.from}->${edge.to}`,
          name: edge.edgeType || 'ssis_lineage',
          object_type: 'lineage_edge',
          attributes: edge,
          lineage: [{ from: edge.from, to: edge.to, type: edge.edgeType }],
          confidence: edge.confidence || 0.8,
        })
      );
    }
    return [];
  }
}

class RepositoryAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['repo_url'];
    this.requiredCredentialModes = ['oauth_app', 'pat_reference', 'ssh_key_reference'];
    this.streams = [
      stream('repositories', STREAM.object, 'provider repository API', { metadata: ['repos', 'branches'] }),
      stream('python_scripts', STREAM.object, 'repository tree *.py', { metadata: ['python ETL scripts', 'DAG files'] }),
      stream('sql_files', STREAM.object, 'repository tree *.sql', { metadata: ['SQL transformations'] }),
      stream('dbt_artifacts', STREAM.semanticModel, 'manifest.json/catalog.json/sources.json', { metadata: ['dbt models', 'sources', 'tests'] }),
      stream('notebooks', STREAM.object, 'repository tree *.ipynb', { metadata: ['notebooks'] }),
      stream('lineage', STREAM.lineage, 'parsed code dependencies', { metadata: ['code -> table', 'model -> source'] }),
    ];
  }
}

class ApiAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['spec_url'];
    this.requiredCredentialModes = ['none', 'api_token_reference', 'oauth'];
    this.streams = [
      stream('openapi_spec', STREAM.object, 'OpenAPI document', { metadata: ['paths', 'components', 'schemas'] }),
      stream('endpoints', STREAM.object, 'OpenAPI paths', { metadata: ['operations', 'methods'] }),
      stream('schemas', STREAM.dataset, 'OpenAPI components.schemas', { metadata: ['request and response schemas'] }),
      stream('lineage', STREAM.lineage, 'API schema to data product links', { metadata: ['endpoint -> schema'] }),
    ];
  }
}

class StreamingAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['cluster'];
    this.requiredCredentialModes = ['service_account', 'api_key_reference', 'secret_reference'];
    this.streams = [
      stream('clusters', STREAM.object, 'cluster metadata endpoint', { metadata: ['clusters', 'brokers'] }),
      stream('topics', STREAM.dataset, 'topic listing endpoint', { metadata: ['topics', 'partitions', 'retention'] }),
      stream('schemas', STREAM.dataset, 'schema registry endpoint', { metadata: ['subjects', 'versions', 'fields'] }),
      stream('consumers', STREAM.object, 'consumer groups endpoint', { metadata: ['consumer groups', 'offsets'] }),
      stream('lineage', STREAM.lineage, 'producer and consumer topic relationships', { metadata: ['producer -> topic', 'topic -> consumer'] }),
    ];
  }
}

class ErpCrmAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['base_url'];
    this.requiredCredentialModes = ['connected_app', 'oauth', 'service_account', 'secret_reference'];
    this.streams = [
      stream('objects', STREAM.object, 'object metadata endpoint', { metadata: ['business objects', 'entities'] }),
      stream('fields', STREAM.column, 'field metadata endpoint', { metadata: ['fields', 'types', 'relationships'] }),
      stream('relationships', STREAM.lineage, 'relationship metadata endpoint', { metadata: ['parent-child relationships'] }),
      stream('reports', STREAM.report, 'report metadata endpoint', { metadata: ['reports', 'folders'] }),
      stream('dashboards', STREAM.dashboard, 'dashboard metadata endpoint', { metadata: ['dashboards', 'components'] }),
      stream('lineage', STREAM.lineage, 'object/report dependency endpoint', { metadata: ['report -> object', 'object -> object'] }),
    ];
  }
}

class MlFeatureAdapter extends BaseConnectorAdapter {
  constructor(args) {
    super(args);
    this.requiredConfig = ['workspace'];
    this.requiredCredentialModes = ['service_account', 'api_token_reference', 'oauth'];
    this.streams = [
      stream('feature_sets', STREAM.dataset, 'feature registry endpoint', { metadata: ['feature sets', 'entities'] }),
      stream('features', STREAM.column, 'feature metadata endpoint', { metadata: ['features', 'types', 'owners'] }),
      stream('models', STREAM.object, 'model registry endpoint', { metadata: ['models', 'versions'] }),
      stream('lineage', STREAM.lineage, 'feature/model lineage endpoint', { metadata: ['source -> feature', 'feature -> model'] }),
    ];
  }
}

function documentedBridge({ requiredConfig, docs = [], kind = 'documented_metadata_bridge', streams = [] }) {
  return { requiredConfig, docs, kind, streams };
}

const DOCUMENTED_BRIDGES = {
  sql_server: documentedBridge({
    kind: 'existing_extractor_bridge',
    docs: ['https://learn.microsoft.com/sql/relational-databases/system-information-schema-views/system-information-schema-views-transact-sql'],
  }),
  ssis: documentedBridge({
    kind: 'existing_extractor_bridge',
    docs: ['https://learn.microsoft.com/sql/integration-services/catalog/integration-services-ssis-catalog'],
  }),
  postgresql: documentedBridge({
    requiredConfig: ['host', 'database'],
    docs: ['https://www.postgresql.org/docs/current/infoschema.html'],
    streams: [
      stream('schemas', STREAM.object, 'information_schema.schemata', { metadata: ['schemas'] }),
      stream('tables', STREAM.object, 'information_schema.tables', { aliases: ['tables', 'views'], metadata: ['tables', 'views'] }),
      stream('columns', STREAM.column, 'information_schema.columns', { aliases: ['columns', 'fields'], metadata: ['columns', 'data types'] }),
      stream('constraints', STREAM.object, 'information_schema.table_constraints', { metadata: ['primary keys', 'foreign keys'] }),
      stream('routines', STREAM.object, 'information_schema.routines', { metadata: ['functions', 'procedures'] }),
      stream('lineage', STREAM.lineage, 'pg_depend / parsed SQL dependencies', { metadata: ['dependencies'] }),
    ],
  }),
  snowflake: documentedBridge({
    requiredConfig: ['account', 'database'],
    docs: ['https://docs.snowflake.com/en/sql-reference/info-schema', 'https://docs.snowflake.com/en/sql-reference/account-usage'],
    streams: [
      stream('databases', STREAM.object, 'SHOW DATABASES / ACCOUNT_USAGE.DATABASES', { metadata: ['databases'] }),
      stream('schemas', STREAM.object, 'INFORMATION_SCHEMA.SCHEMATA', { metadata: ['schemas'] }),
      stream('tables', STREAM.object, 'INFORMATION_SCHEMA.TABLES', { metadata: ['tables', 'views'] }),
      stream('columns', STREAM.column, 'INFORMATION_SCHEMA.COLUMNS', { metadata: ['columns', 'data types'] }),
      stream('tags', STREAM.object, 'ACCOUNT_USAGE.TAG_REFERENCES', { metadata: ['tags', 'classifications'] }),
      stream('usage', STREAM.usage, 'ACCOUNT_USAGE.QUERY_HISTORY', { metadata: ['query usage'] }),
      stream('lineage', STREAM.lineage, 'ACCESS_HISTORY / OBJECT_DEPENDENCIES', { metadata: ['object dependencies'] }),
    ],
  }),
  bigquery: documentedBridge({
    requiredConfig: ['project_id'],
    docs: ['https://cloud.google.com/bigquery/docs/information-schema-intro'],
    streams: [
      stream('datasets', STREAM.object, 'BigQuery datasets.list / INFORMATION_SCHEMA.SCHEMATA', { metadata: ['datasets'] }),
      stream('tables', STREAM.object, 'INFORMATION_SCHEMA.TABLES', { metadata: ['tables', 'views'] }),
      stream('columns', STREAM.column, 'INFORMATION_SCHEMA.COLUMNS', { metadata: ['columns', 'policy tags'] }),
      stream('jobs', STREAM.usage, 'INFORMATION_SCHEMA.JOBS_BY_PROJECT', { metadata: ['query jobs'] }),
      stream('lineage', STREAM.lineage, 'Data Lineage API / parsed query jobs', { metadata: ['job lineage'] }),
    ],
  }),
  databricks: documentedBridge({
    requiredConfig: ['workspace_url'],
    docs: ['https://docs.databricks.com/api/workspace/catalogs', 'https://docs.databricks.com/api/workspace/tables'],
    streams: [
      stream('catalogs', STREAM.object, 'Unity Catalog GET /api/2.1/unity-catalog/catalogs', { metadata: ['catalogs'] }),
      stream('schemas', STREAM.object, 'Unity Catalog schemas endpoint', { metadata: ['schemas'] }),
      stream('tables', STREAM.object, 'Unity Catalog tables endpoint', { metadata: ['tables', 'views'] }),
      stream('columns', STREAM.column, 'Unity Catalog table schema', { metadata: ['columns'] }),
      stream('jobs', STREAM.object, 'Jobs API list jobs', { metadata: ['jobs'] }),
      stream('notebooks', STREAM.object, 'Workspace API list/export metadata', { metadata: ['notebooks'] }),
      stream('lineage', STREAM.lineage, 'Unity Catalog lineage API', { metadata: ['lineage'] }),
    ],
  }),
  azure_purview: documentedBridge({
    requiredConfig: ['account'],
    docs: ['https://learn.microsoft.com/purview/data-map-search-apis', 'https://learn.microsoft.com/purview/catalog-lineage-user-guide'],
    streams: [
      stream('assets', STREAM.object, 'Purview Data Map search/query APIs', { metadata: ['assets'] }),
      stream('schemas', STREAM.dataset, 'Purview entity relationships', { metadata: ['schemas'] }),
      stream('classifications', STREAM.object, 'Purview classifications', { metadata: ['classifications'] }),
      stream('glossary', STREAM.object, 'Purview glossary APIs', { metadata: ['terms'] }),
      stream('lineage', STREAM.lineage, 'Purview lineage APIs', { metadata: ['process lineage'] }),
    ],
  }),
  azure_storage: documentedBridge({
    requiredConfig: ['account'],
    docs: ['https://learn.microsoft.com/rest/api/storageservices/list-containers2', 'https://learn.microsoft.com/rest/api/storageservices/list-blobs'],
    streams: [
      stream('containers', STREAM.object, 'Blob service List Containers', { metadata: ['containers'] }),
      stream('objects', STREAM.object, 'Blob service List Blobs', { metadata: ['paths', 'last modified'] }),
      stream('schemas', STREAM.dataset, 'safe file manifest/schema inference', { metadata: ['schemas'] }),
      stream('classifications', STREAM.object, 'tags / index tags / policy labels', { metadata: ['classifications'] }),
      stream('lineage', STREAM.lineage, 'path-to-dataset mappings', { metadata: ['storage lineage'] }),
    ],
  }),
  azure_data_factory: documentedBridge({
    requiredConfig: ['subscription_id', 'resource_group', 'factory_name'],
    docs: ['https://learn.microsoft.com/rest/api/datafactory/pipelines/list-by-factory', 'https://learn.microsoft.com/rest/api/datafactory/datasets/list-by-factory'],
    streams: [
      stream('pipelines', STREAM.object, 'ADF Pipelines_ListByFactory', { metadata: ['pipelines'] }),
      stream('tasks', STREAM.object, 'ADF pipeline activities', { aliases: ['activities', 'tasks'], metadata: ['activities'] }),
      stream('datasets', STREAM.dataset, 'ADF Datasets_ListByFactory', { metadata: ['datasets'] }),
      stream('connections', STREAM.dataSource, 'ADF LinkedServices_ListByFactory', { aliases: ['linked_services', 'connections'], metadata: ['linked services'] }),
      stream('schedules', STREAM.object, 'ADF Triggers_ListByFactory', { aliases: ['triggers'], metadata: ['triggers'] }),
      stream('lineage', STREAM.lineage, 'pipeline activity input/output dependencies', { metadata: ['pipeline lineage'] }),
    ],
  }),
  aws_glue: documentedBridge({
    requiredConfig: ['region'],
    docs: ['https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-catalog-databases.html', 'https://docs.aws.amazon.com/glue/latest/dg/aws-glue-api-catalog-tables.html'],
    streams: [
      stream('databases', STREAM.object, 'Glue GetDatabases', { metadata: ['databases'] }),
      stream('tables', STREAM.object, 'Glue GetTables', { metadata: ['tables'] }),
      stream('columns', STREAM.column, 'Glue table StorageDescriptor.Columns', { metadata: ['columns'] }),
      stream('partitions', STREAM.object, 'Glue GetPartitions', { metadata: ['partitions'] }),
      stream('jobs', STREAM.object, 'Glue GetJobs', { metadata: ['jobs'] }),
      stream('lineage', STREAM.lineage, 'Glue job/catalog dependencies', { metadata: ['lineage'] }),
    ],
  }),
  aws_s3: documentedBridge({
    requiredConfig: ['region'],
    docs: ['https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListBuckets.html', 'https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html'],
    streams: [
      stream('buckets', STREAM.object, 'S3 ListBuckets', { metadata: ['buckets'] }),
      stream('objects', STREAM.object, 'S3 ListObjectsV2', { metadata: ['objects', 'prefixes'] }),
      stream('schemas', STREAM.dataset, 'manifest/schema inference', { metadata: ['schemas'] }),
      stream('classifications', STREAM.object, 'object tags / Macie findings', { metadata: ['classifications'] }),
      stream('lineage', STREAM.lineage, 'bucket/prefix dataset links', { metadata: ['lineage'] }),
    ],
  }),
  aws_redshift: documentedBridge({
    requiredConfig: ['cluster', 'database'],
    docs: ['https://docs.aws.amazon.com/redshift/latest/dg/c_intro_catalog_views.html'],
    streams: [
      stream('schemas', STREAM.object, 'SVV_ALL_SCHEMAS', { metadata: ['schemas'] }),
      stream('tables', STREAM.object, 'SVV_ALL_TABLES / SVV_VIEWS', { metadata: ['tables', 'views'] }),
      stream('columns', STREAM.column, 'SVV_ALL_COLUMNS', { metadata: ['columns'] }),
      stream('usage', STREAM.usage, 'SYS_QUERY_HISTORY', { metadata: ['query history'] }),
      stream('lineage', STREAM.lineage, 'SVV_TABLE_INFO / parsed SQL dependencies', { metadata: ['dependencies'] }),
    ],
  }),
  gcp_dataplex: documentedBridge({
    requiredConfig: ['project_id'],
    docs: ['https://cloud.google.com/dataplex/docs/reference/rest', 'https://cloud.google.com/data-catalog/docs/reference/rest'],
    streams: [
      stream('lakes', STREAM.object, 'Dataplex projects.locations.lakes.list', { metadata: ['lakes'] }),
      stream('zones', STREAM.object, 'Dataplex zones.list', { metadata: ['zones'] }),
      stream('entries', STREAM.object, 'Data Catalog entries.search', { aliases: ['assets', 'entries'], metadata: ['entries'] }),
      stream('schemas', STREAM.dataset, 'Entry schema metadata', { metadata: ['schemas'] }),
      stream('classifications', STREAM.object, 'policy tags / aspects', { metadata: ['policy tags'] }),
      stream('lineage', STREAM.lineage, 'Data Lineage API processes/runs/events', { metadata: ['lineage'] }),
    ],
  }),
  gcs: documentedBridge({
    requiredConfig: ['project_id'],
    docs: ['https://cloud.google.com/storage/docs/json_api/v1/buckets/list', 'https://cloud.google.com/storage/docs/json_api/v1/objects/list'],
    streams: [
      stream('buckets', STREAM.object, 'GCS buckets.list', { metadata: ['buckets'] }),
      stream('objects', STREAM.object, 'GCS objects.list', { metadata: ['objects'] }),
      stream('schemas', STREAM.dataset, 'manifest/schema inference', { metadata: ['schemas'] }),
      stream('classifications', STREAM.object, 'object metadata / policy tags', { metadata: ['classifications'] }),
      stream('lineage', STREAM.lineage, 'bucket/object dataset links', { metadata: ['lineage'] }),
    ],
  }),
  power_bi: documentedBridge({
    requiredConfig: ['tenant_id'],
    docs: ['https://learn.microsoft.com/rest/api/power-bi/admin/workspace-info-post-workspace-info'],
    streams: [
      stream('workspaces', STREAM.object, 'GET /v1.0/myorg/admin/groups?$top=5000', { metadata: ['workspaces'] }),
      stream('dashboards', STREAM.dashboard, 'GET /v1.0/myorg/admin/dashboards', { metadata: ['dashboards'] }),
      stream('reports', STREAM.report, 'GET /v1.0/myorg/admin/reports', { metadata: ['reports'] }),
      stream('datasets', STREAM.dataset, 'GET /v1.0/myorg/admin/datasets', { metadata: ['datasets'] }),
      stream('scanner_metadata', STREAM.semanticModel, 'POST /v1.0/myorg/admin/workspaces/getInfo', { aliases: ['semantic_models', 'models'], method: 'POST', metadata: ['tables', 'columns', 'measures'] }),
      stream('datasources', STREAM.dataSource, 'GET dataset datasources', { metadata: ['datasources'] }),
      stream('activity_events', STREAM.usage, 'GET /v1.0/myorg/admin/activityevents', { metadata: ['activity events'] }),
      stream('lineage', STREAM.lineage, 'Power BI artifact relationships', { metadata: ['dataset-report-dashboard lineage'] }),
    ],
  }),
  microstrategy_cloud: documentedBridge({
    requiredConfig: ['base_url', 'project_id'],
    docs: ['https://microstrategy.github.io/rest-api-docs/getting-started/rest-api-families/'],
    streams: [
      stream('projects', STREAM.object, 'GET /api/projects', { metadata: ['projects'] }),
      stream('dossiers', STREAM.dashboard, 'GET /api/dossiers', { metadata: ['dossiers'] }),
      stream('documents', STREAM.report, 'GET /api/documents', { metadata: ['documents'] }),
      stream('reports', STREAM.report, 'GET /api/v2/reports', { metadata: ['reports'] }),
      stream('cubes', STREAM.dataset, 'GET /api/cubes', { metadata: ['cubes'] }),
      stream('schema_objects', STREAM.semanticModel, 'GET /api/model/schema/objects', { metadata: ['schema objects'] }),
      stream('data_sources', STREAM.dataSource, 'GET /api/datasources', { metadata: ['data sources'] }),
      stream('lineage', STREAM.lineage, 'object dependency metadata', { metadata: ['dependencies'] }),
    ],
  }),
  ssas_on_prem: documentedBridge({
    requiredConfig: ['server'],
    docs: ['https://learn.microsoft.com/analysis-services/xmla/xml-elements-methods-discover', 'https://learn.microsoft.com/analysis-services/instances/use-dynamic-management-views-dmvs-to-monitor-analysis-services'],
    streams: [
      stream('databases', STREAM.object, 'XMLA Discover DBSCHEMA_CATALOGS', { metadata: ['databases'] }),
      stream('models', STREAM.semanticModel, 'XMLA Discover MDSCHEMA_CUBES / TMSCHEMA_MODEL', { metadata: ['models'] }),
      stream('dimensions', STREAM.object, 'XMLA Discover MDSCHEMA_DIMENSIONS', { metadata: ['dimensions'] }),
      stream('measures', STREAM.metric, 'XMLA Discover MDSCHEMA_MEASURES / TMSCHEMA_MEASURES', { metadata: ['measures'] }),
      stream('partitions', STREAM.dataset, 'XMLA Discover TMSCHEMA_PARTITIONS', { metadata: ['partitions'] }),
      stream('data_sources', STREAM.dataSource, 'XMLA Discover TMSCHEMA_DATA_SOURCES', { metadata: ['data sources'] }),
      stream('roles', STREAM.object, 'XMLA Discover TMSCHEMA_ROLES', { metadata: ['roles'] }),
      stream('lineage', STREAM.lineage, 'model datasource/partition dependencies', { metadata: ['lineage'] }),
    ],
  }),
  power_bi_report_server: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://learn.microsoft.com/sql/reporting-services/developer/rest-api/report-server-rest-api'],
    streams: [
      stream('folders', STREAM.object, 'GET /api/v2.0/Folders', { metadata: ['folders'] }),
      stream('reports', STREAM.report, 'GET /api/v2.0/PowerBIReports / Reports', { metadata: ['reports'] }),
      stream('datasets', STREAM.dataset, 'GET /api/v2.0/Datasets', { metadata: ['datasets'] }),
      stream('data_sources', STREAM.dataSource, 'GET item data sources', { metadata: ['data sources'] }),
      stream('subscriptions', STREAM.object, 'GET /api/v2.0/Subscriptions', { metadata: ['subscriptions'] }),
      stream('lineage', STREAM.lineage, 'report-dataset-datasource links', { metadata: ['lineage'] }),
    ],
  }),
  ssrs: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://learn.microsoft.com/sql/reporting-services/developer/rest-api/report-server-rest-api'],
    streams: [
      stream('folders', STREAM.object, 'GET /api/v2.0/Folders', { metadata: ['folders'] }),
      stream('reports', STREAM.report, 'GET /api/v2.0/Reports', { metadata: ['RDL reports'] }),
      stream('datasets', STREAM.dataset, 'GET /api/v2.0/Datasets', { metadata: ['shared datasets'] }),
      stream('data_sources', STREAM.dataSource, 'GET /api/v2.0/DataSources', { metadata: ['shared data sources'] }),
      stream('subscriptions', STREAM.object, 'GET /api/v2.0/Subscriptions', { metadata: ['subscriptions'] }),
      stream('lineage', STREAM.lineage, 'report-dataset-datasource links', { metadata: ['lineage'] }),
    ],
  }),
  tableau: documentedBridge({
    requiredConfig: ['base_url', 'site_id'],
    docs: ['https://help.tableau.com/current/api/rest_api/en-us/REST/rest_api.htm', 'https://help.tableau.com/current/api/metadata_api/en-us/index.html'],
    streams: [
      stream('projects', STREAM.object, 'REST projects endpoint', { metadata: ['projects'] }),
      stream('workbooks', STREAM.dashboard, 'REST workbooks endpoint', { metadata: ['workbooks'] }),
      stream('views', STREAM.report, 'REST views endpoint', { metadata: ['views'] }),
      stream('datasources', STREAM.dataSource, 'REST datasources endpoint', { metadata: ['datasources'] }),
      stream('metadata_graphql', STREAM.lineage, 'Metadata API GraphQL', { aliases: ['lineage'], metadata: ['metadata graph'] }),
      stream('usage', STREAM.usage, 'REST usage/statistics metadata', { metadata: ['usage'] }),
    ],
  }),
  looker: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://cloud.google.com/looker/docs/reference/looker-api/latest'],
    streams: [
      stream('models', STREAM.semanticModel, 'Looker API lookml_models', { metadata: ['models'] }),
      stream('explores', STREAM.dataset, 'Looker API explores', { metadata: ['explores'] }),
      stream('dashboards', STREAM.dashboard, 'Looker API dashboards', { metadata: ['dashboards'] }),
      stream('looks', STREAM.report, 'Looker API looks', { metadata: ['looks'] }),
      stream('fields', STREAM.column, 'Looker explore fields', { metadata: ['fields'] }),
      stream('metrics', STREAM.metric, 'LookML measures', { metadata: ['measures'] }),
      stream('lineage', STREAM.lineage, 'model/explore/dashboard dependencies', { metadata: ['lineage'] }),
    ],
  }),
  qlik_cloud: documentedBridge({
    requiredConfig: ['tenant_url'],
    docs: ['https://qlik.dev/apis/rest/'],
    streams: [
      stream('spaces', STREAM.object, 'Qlik spaces API', { metadata: ['spaces'] }),
      stream('apps', STREAM.dashboard, 'Qlik items/apps APIs', { metadata: ['apps'] }),
      stream('sheets', STREAM.report, 'Qlik app object metadata', { metadata: ['sheets'] }),
      stream('datasets', STREAM.dataset, 'Qlik data lineage/dataset metadata', { metadata: ['datasets'] }),
      stream('fields', STREAM.column, 'Qlik app fields', { metadata: ['fields'] }),
      stream('metrics', STREAM.metric, 'Qlik measures', { metadata: ['measures'] }),
      stream('lineage', STREAM.lineage, 'Qlik lineage APIs', { metadata: ['lineage'] }),
    ],
  }),
  qlik_sense: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://help.qlik.com/en-US/sense-developer/'],
    streams: [
      stream('streams', STREAM.object, 'QRS streams endpoint', { metadata: ['streams'] }),
      stream('apps', STREAM.dashboard, 'QRS apps endpoint', { metadata: ['apps'] }),
      stream('sheets', STREAM.report, 'Engine app object metadata', { metadata: ['sheets'] }),
      stream('connections', STREAM.dataSource, 'QRS data connections endpoint', { metadata: ['connections'] }),
      stream('fields', STREAM.column, 'Engine field metadata', { metadata: ['fields'] }),
      stream('metrics', STREAM.metric, 'Engine measure metadata', { metadata: ['measures'] }),
      stream('lineage', STREAM.lineage, 'reload script/data connection dependencies', { metadata: ['lineage'] }),
    ],
  }),
  domo: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://developer.domo.com/portal'],
    streams: [
      stream('datasets', STREAM.dataset, 'Domo DataSet API', { metadata: ['datasets'] }),
      stream('cards', STREAM.report, 'Domo Cards API', { metadata: ['cards'] }),
      stream('dashboards', STREAM.dashboard, 'Domo Pages/Dashboards APIs', { metadata: ['dashboards'] }),
      stream('dataflows', STREAM.object, 'Domo DataFlow API', { metadata: ['dataflows'] }),
      stream('metrics', STREAM.metric, 'Beast Mode/calculation metadata', { metadata: ['calculations'] }),
      stream('lineage', STREAM.lineage, 'dataset-card-dataflow dependencies', { metadata: ['lineage'] }),
    ],
  }),
  sigma: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://help.sigmacomputing.com/reference'],
    streams: [
      stream('workbooks', STREAM.dashboard, 'Sigma workbooks API', { metadata: ['workbooks'] }),
      stream('pages', STREAM.report, 'Workbook pages', { metadata: ['pages'] }),
      stream('elements', STREAM.report, 'Workbook elements', { metadata: ['elements'] }),
      stream('datasets', STREAM.dataset, 'Sigma datasets API', { metadata: ['datasets'] }),
      stream('connections', STREAM.dataSource, 'Sigma connections API', { metadata: ['connections'] }),
      stream('metrics', STREAM.metric, 'calculations/formulas', { metadata: ['calculations'] }),
      stream('lineage', STREAM.lineage, 'workbook-dataset-connection dependencies', { metadata: ['lineage'] }),
    ],
  }),
  mode: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://mode.com/developer/api-reference/'],
    streams: [
      stream('spaces', STREAM.object, 'Mode spaces API', { metadata: ['spaces'] }),
      stream('reports', STREAM.report, 'Mode reports API', { metadata: ['reports'] }),
      stream('queries', STREAM.dataset, 'Mode queries API', { metadata: ['queries'] }),
      stream('charts', STREAM.dashboard, 'Mode charts metadata', { metadata: ['charts'] }),
      stream('lineage', STREAM.lineage, 'query-report-datasource dependencies', { metadata: ['lineage'] }),
    ],
  }),
  metabase: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://www.metabase.com/docs/latest/api-documentation'],
    streams: [
      stream('collections', STREAM.object, 'Metabase collections API', { metadata: ['collections'] }),
      stream('dashboards', STREAM.dashboard, 'Metabase dashboards API', { metadata: ['dashboards'] }),
      stream('cards', STREAM.report, 'Metabase cards/questions API', { metadata: ['cards'] }),
      stream('datasets', STREAM.dataset, 'Metabase models/databases metadata', { metadata: ['models'] }),
      stream('data_sources', STREAM.dataSource, 'Metabase database API', { metadata: ['databases'] }),
      stream('lineage', STREAM.lineage, 'card-dashboard-database dependencies', { metadata: ['lineage'] }),
    ],
  }),
  superset: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://superset.apache.org/docs/api/'],
    streams: [
      stream('databases', STREAM.dataSource, 'Superset databases API', { metadata: ['databases'] }),
      stream('datasets', STREAM.dataset, 'Superset datasets API', { metadata: ['datasets'] }),
      stream('charts', STREAM.report, 'Superset charts API', { metadata: ['charts'] }),
      stream('dashboards', STREAM.dashboard, 'Superset dashboards API', { metadata: ['dashboards'] }),
      stream('metrics', STREAM.metric, 'dataset metrics/calculated columns', { metadata: ['metrics'] }),
      stream('lineage', STREAM.lineage, 'chart-dashboard-dataset dependencies', { metadata: ['lineage'] }),
    ],
  }),
  redash: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://redash.io/help/user-guide/integrations-and-api/api/'],
    streams: [
      stream('data_sources', STREAM.dataSource, 'Redash data sources API', { metadata: ['data sources'] }),
      stream('queries', STREAM.dataset, 'Redash queries API', { metadata: ['queries'] }),
      stream('visualizations', STREAM.report, 'Redash visualizations API', { metadata: ['visualizations'] }),
      stream('dashboards', STREAM.dashboard, 'Redash dashboards API', { metadata: ['dashboards'] }),
      stream('alerts', STREAM.object, 'Redash alerts API', { metadata: ['alerts'] }),
      stream('lineage', STREAM.lineage, 'query-visualization-dashboard dependencies', { metadata: ['lineage'] }),
    ],
  }),
  quicksight: documentedBridge({
    requiredConfig: ['aws_account_id', 'region'],
    docs: ['https://docs.aws.amazon.com/quicksight/latest/APIReference/Welcome.html'],
    streams: [
      stream('analyses', STREAM.report, 'QuickSight ListAnalyses', { metadata: ['analyses'] }),
      stream('dashboards', STREAM.dashboard, 'QuickSight ListDashboards', { metadata: ['dashboards'] }),
      stream('datasets', STREAM.dataset, 'QuickSight ListDataSets', { metadata: ['datasets'] }),
      stream('data_sources', STREAM.dataSource, 'QuickSight ListDataSources', { metadata: ['data sources'] }),
      stream('metrics', STREAM.metric, 'calculated fields in definitions', { metadata: ['calculated fields'] }),
      stream('lineage', STREAM.lineage, 'analysis-dashboard-dataset-datasource dependencies', { metadata: ['lineage'] }),
    ],
  }),
  grafana: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://grafana.com/docs/grafana/latest/developers/http_api/'],
    streams: [
      stream('folders', STREAM.object, 'Grafana folders API', { metadata: ['folders'] }),
      stream('dashboards', STREAM.dashboard, 'Grafana dashboards API', { metadata: ['dashboards'] }),
      stream('panels', STREAM.report, 'Dashboard panel JSON', { metadata: ['panels'] }),
      stream('data_sources', STREAM.dataSource, 'Grafana data sources API', { metadata: ['data sources'] }),
      stream('alerts', STREAM.object, 'Grafana alerting API', { metadata: ['alerts'] }),
      stream('lineage', STREAM.lineage, 'dashboard-panel-datasource dependencies', { metadata: ['lineage'] }),
    ],
  }),
  cognos: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://www.ibm.com/docs/en/cognos-analytics'],
    streams: [
      stream('packages', STREAM.semanticModel, 'Cognos content/package metadata', { metadata: ['packages'] }),
      stream('reports', STREAM.report, 'Cognos reports metadata', { metadata: ['reports'] }),
      stream('dashboards', STREAM.dashboard, 'Cognos dashboards metadata', { metadata: ['dashboards'] }),
      stream('data_modules', STREAM.dataset, 'Cognos data modules', { metadata: ['data modules'] }),
      stream('metrics', STREAM.metric, 'dimensions/measures metadata', { metadata: ['measures'] }),
      stream('lineage', STREAM.lineage, 'package-report-datasource dependencies', { metadata: ['lineage'] }),
    ],
  }),
  sap_businessobjects: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://help.sap.com/docs/SAP_BUSINESSOBJECTS_BUSINESS_INTELLIGENCE_PLATFORM'],
    streams: [
      stream('universes', STREAM.semanticModel, 'BI platform universes metadata', { metadata: ['universes'] }),
      stream('reports', STREAM.report, 'Web Intelligence / Crystal reports metadata', { metadata: ['reports'] }),
      stream('folders', STREAM.object, 'BI platform folders metadata', { metadata: ['folders'] }),
      stream('data_foundations', STREAM.dataset, 'universe data foundations', { metadata: ['data foundations'] }),
      stream('data_sources', STREAM.dataSource, 'connections metadata', { metadata: ['connections'] }),
      stream('lineage', STREAM.lineage, 'universe-report-connection dependencies', { metadata: ['lineage'] }),
    ],
  }),
  oracle_analytics: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://docs.oracle.com/en/cloud/paas/analytics-cloud/'],
    streams: [
      stream('workbooks', STREAM.dashboard, 'Oracle Analytics workbook metadata', { metadata: ['workbooks'] }),
      stream('analyses', STREAM.report, 'analyses metadata', { metadata: ['analyses'] }),
      stream('dashboards', STREAM.dashboard, 'dashboards metadata', { metadata: ['dashboards'] }),
      stream('datasets', STREAM.dataset, 'datasets metadata', { metadata: ['datasets'] }),
      stream('semantic_models', STREAM.semanticModel, 'semantic model metadata', { metadata: ['semantic models'] }),
      stream('lineage', STREAM.lineage, 'workbook-dataset-semantic model dependencies', { metadata: ['lineage'] }),
    ],
  }),
  thoughtspot: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://developers.thoughtspot.com/docs/rest-apiv2-reference'],
    streams: [
      stream('answers', STREAM.report, 'ThoughtSpot answers metadata', { metadata: ['answers'] }),
      stream('liveboards', STREAM.dashboard, 'ThoughtSpot liveboards metadata', { metadata: ['liveboards'] }),
      stream('worksheets', STREAM.semanticModel, 'worksheets metadata', { metadata: ['worksheets'] }),
      stream('tables', STREAM.dataset, 'tables metadata', { metadata: ['tables'] }),
      stream('columns', STREAM.column, 'columns metadata', { metadata: ['columns'] }),
      stream('metrics', STREAM.metric, 'formulas metadata', { metadata: ['formulas'] }),
      stream('lineage', STREAM.lineage, 'answer-liveboard-worksheet dependencies', { metadata: ['lineage'] }),
    ],
  }),
  sisense: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://developer.sisense.com/'],
    streams: [
      stream('dashboards', STREAM.dashboard, 'Sisense dashboards API', { metadata: ['dashboards'] }),
      stream('widgets', STREAM.report, 'dashboard widgets metadata', { metadata: ['widgets'] }),
      stream('data_models', STREAM.semanticModel, 'data models / ElastiCubes', { metadata: ['data models'] }),
      stream('datasets', STREAM.dataset, 'datasets metadata', { metadata: ['datasets'] }),
      stream('metrics', STREAM.metric, 'formulas metadata', { metadata: ['formulas'] }),
      stream('lineage', STREAM.lineage, 'widget-dashboard-datamodel dependencies', { metadata: ['lineage'] }),
    ],
  }),
  airflow: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://airflow.apache.org/docs/apache-airflow/stable/stable-rest-api-ref.html'],
    streams: [
      stream('pipelines', STREAM.object, 'GET /api/v1/dags', { aliases: ['dags', 'pipelines'], metadata: ['DAGs'] }),
      stream('tasks', STREAM.object, 'GET /api/v1/dags/{dag_id}/tasks', { metadata: ['tasks'] }),
      stream('datasets', STREAM.dataset, 'GET /api/v1/datasets', { metadata: ['datasets'] }),
      stream('connections', STREAM.dataSource, 'connections metadata endpoint', { metadata: ['connections'] }),
      stream('schedules', STREAM.object, 'DAG schedules/timetables', { metadata: ['schedules'] }),
      stream('lineage', STREAM.lineage, 'DAG task inlets/outlets and dataset dependencies', { metadata: ['lineage'] }),
    ],
  }),
  dbt: documentedBridge({
    requiredConfig: ['repo_url'],
    docs: ['https://docs.getdbt.com/reference/artifacts/manifest-json', 'https://docs.getdbt.com/reference/artifacts/catalog-json'],
    streams: [
      stream('models', STREAM.semanticModel, 'manifest.json nodes', { aliases: ['dbt_artifacts', 'models'], metadata: ['models'] }),
      stream('sources', STREAM.dataSource, 'manifest.json sources', { metadata: ['sources'] }),
      stream('columns', STREAM.column, 'catalog.json columns', { metadata: ['columns'] }),
      stream('tests', STREAM.object, 'manifest.json tests', { metadata: ['tests'] }),
      stream('metrics', STREAM.metric, 'manifest.json metrics', { metadata: ['metrics'] }),
      stream('lineage', STREAM.lineage, 'manifest parent_map/child_map', { metadata: ['lineage'] }),
    ],
  }),
  openapi: documentedBridge({
    requiredConfig: ['spec_url'],
    docs: ['https://spec.openapis.org/oas/latest.html'],
    streams: [
      stream('openapi_spec', STREAM.object, 'OpenAPI document', { metadata: ['spec'] }),
      stream('endpoints', STREAM.object, 'paths operations', { metadata: ['paths', 'operations'] }),
      stream('schemas', STREAM.dataset, 'components.schemas', { metadata: ['schemas'] }),
      stream('lineage', STREAM.lineage, 'endpoint-schema relationships', { metadata: ['lineage'] }),
    ],
  }),
  git_repository: documentedBridge({
    requiredConfig: ['repo_url'],
    docs: ['https://docs.github.com/rest/repos/contents', 'https://learn.microsoft.com/rest/api/azure/devops/git/items/list'],
    streams: [
      stream('repositories', STREAM.object, 'repository provider API', { metadata: ['repositories'] }),
      stream('python_scripts', STREAM.object, 'repository tree *.py', { metadata: ['python ETL scripts'] }),
      stream('sql_files', STREAM.object, 'repository tree *.sql', { metadata: ['SQL files'] }),
      stream('dbt_artifacts', STREAM.semanticModel, 'dbt manifest/catalog/sources artifacts', { metadata: ['dbt artifacts'] }),
      stream('notebooks', STREAM.object, 'repository tree *.ipynb', { metadata: ['notebooks'] }),
      stream('lineage', STREAM.lineage, 'parsed code dependency facts', { metadata: ['lineage'] }),
    ],
  }),
  kafka: documentedBridge({
    requiredConfig: ['cluster'],
    docs: ['https://docs.confluent.io/platform/current/kafka-rest/api.html', 'https://docs.confluent.io/platform/current/schema-registry/develop/api.html'],
    streams: [
      stream('clusters', STREAM.object, 'Kafka cluster metadata', { metadata: ['clusters'] }),
      stream('topics', STREAM.dataset, 'Kafka topics metadata', { metadata: ['topics'] }),
      stream('schemas', STREAM.dataset, 'Schema Registry subjects/versions', { metadata: ['schemas'] }),
      stream('consumers', STREAM.object, 'consumer groups metadata', { metadata: ['consumers'] }),
      stream('lineage', STREAM.lineage, 'producer-topic-consumer relationships', { metadata: ['lineage'] }),
    ],
  }),
  salesforce: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/resources_sobject_describe.htm'],
    streams: [
      stream('objects', STREAM.object, 'Salesforce sObject describe/list', { metadata: ['objects'] }),
      stream('fields', STREAM.column, 'sObject fields describe', { metadata: ['fields'] }),
      stream('relationships', STREAM.lineage, 'childRelationships / referenceTo', { metadata: ['relationships'] }),
      stream('reports', STREAM.report, 'Analytics reports metadata', { metadata: ['reports'] }),
      stream('dashboards', STREAM.dashboard, 'Analytics dashboards metadata', { metadata: ['dashboards'] }),
      stream('lineage', STREAM.lineage, 'report-object dependency facts', { metadata: ['lineage'] }),
    ],
  }),
  sap: documentedBridge({
    requiredConfig: ['base_url'],
    docs: ['https://help.sap.com/docs/ABAP_PLATFORM', 'https://help.sap.com/docs/SAP_NETWEAVER'],
    streams: [
      stream('objects', STREAM.object, 'SAP business objects / OData services', { aliases: ['tables', 'objects'], metadata: ['objects'] }),
      stream('fields', STREAM.column, 'DDIC table/view fields', { metadata: ['fields'] }),
      stream('relationships', STREAM.lineage, 'DDIC foreign keys / CDS associations', { metadata: ['relationships'] }),
      stream('extractors', STREAM.object, 'BW extractors / ODP metadata', { metadata: ['extractors'] }),
      stream('lineage', STREAM.lineage, 'table-view-CDS-extractor dependencies', { metadata: ['lineage'] }),
    ],
  }),
};

const TYPE_ADAPTERS = {
  sql_server: SqlServerLiveAdapter,
  ssis: SsisLiveAdapter,
  power_bi: PowerBiAdapter,
  power_bi_report_server: BIConnectorAdapter,
  microstrategy_cloud: MicroStrategyAdapter,
  ssas_on_prem: SsasAdapter,
  tableau: TableauAdapter,
  looker: BIConnectorAdapter,
  qlik_cloud: BIConnectorAdapter,
  qlik_sense: BIConnectorAdapter,
  domo: BIConnectorAdapter,
  sigma: BIConnectorAdapter,
  mode: BIConnectorAdapter,
  metabase: BIConnectorAdapter,
  superset: BIConnectorAdapter,
  redash: BIConnectorAdapter,
  quicksight: BIConnectorAdapter,
  grafana: BIConnectorAdapter,
  cognos: BIConnectorAdapter,
  sap_businessobjects: BIConnectorAdapter,
  oracle_analytics: BIConnectorAdapter,
  thoughtspot: BIConnectorAdapter,
  sisense: BIConnectorAdapter,
  ssrs: BIConnectorAdapter,
  git_repository: RepositoryAdapter,
  openapi: ApiAdapter,
  azure_data_factory: PipelineAdapter,
  airflow: PipelineAdapter,
  databricks: DataWarehouseAdapter,
  dbt: RepositoryAdapter,
};

const CATEGORY_ADAPTERS = {
  database: DataWarehouseAdapter,
  warehouse: DataWarehouseAdapter,
  cloud_storage: CloudStorageAdapter,
  cloud_platform: CloudPlatformAdapter,
  pipeline: PipelineAdapter,
  repository: RepositoryAdapter,
  api: ApiAdapter,
  business_intelligence: BIConnectorAdapter,
  streaming: StreamingAdapter,
  erp_crm: ErpCrmAdapter,
  ml_feature_platform: MlFeatureAdapter,
};

export function createConnectorAdapter({ connector, definition }) {
  if (!connector?.type) {
    throw new ConnectorConfigError('Connector type is required to create an extraction adapter.');
  }
  const Adapter = TYPE_ADAPTERS[connector.type] || CATEGORY_ADAPTERS[definition?.category];
  if (!Adapter) {
    throw new ConnectorConfigError(`No extraction adapter registered for connector type '${connector.type}'.`, {
      connector_id: connector.id,
      connector_type: connector.type,
      details: { category: definition?.category || null },
    });
  }
  const adapter = new Adapter({ connector, definition });
  const bridge = DOCUMENTED_BRIDGES[connector.type];
  if (bridge) {
    adapter.configureBridge({
      ...bridge,
      requiredCredentialModes: bridge.requiredCredentialModes || definition?.credentialKinds || adapter.requiredCredentialModes,
    });
  }
  return adapter;
}

export function adapterCoverageReport(definitions = []) {
  return definitions.map((definition) => ({
    type: definition.type,
    label: definition.label,
    category: definition.category,
    adapter: (TYPE_ADAPTERS[definition.type] || CATEGORY_ADAPTERS[definition.category])?.name || null,
    bridge: DOCUMENTED_BRIDGES[definition.type]?.kind || null,
    docs: DOCUMENTED_BRIDGES[definition.type]?.docs || [],
    plumbed: Boolean(TYPE_ADAPTERS[definition.type] || CATEGORY_ADAPTERS[definition.category]),
    bridge_plumbed: Boolean(DOCUMENTED_BRIDGES[definition.type]),
    direct_source_client: hasDirectSourceClient(definition.type),
  }));
}
