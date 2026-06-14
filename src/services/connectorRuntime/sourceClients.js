import { createHash, createHmac } from 'crypto';
import { ConnectorRuntimeError } from './connectorErrors.js';

const DEFAULT_API_VERSION = {
  salesforce: 'v61.0',
  tableau: '3.22',
};

const SOURCE_PATHS = {
  airflow: {
    pipelines: () => '/api/v1/dags',
    tasks: ({ config }) => `/api/v1/dags/${encodeURIComponent(config.dag_id || '-')}/tasks`,
    datasets: () => '/api/v1/datasets',
  },
  azure_data_factory: {
    pipelines: ({ config }) =>
      `/subscriptions/${config.subscription_id}/resourceGroups/${config.resource_group}/providers/Microsoft.DataFactory/factories/${config.factory_name}/pipelines?api-version=2018-06-01`,
    datasets: ({ config }) =>
      `/subscriptions/${config.subscription_id}/resourceGroups/${config.resource_group}/providers/Microsoft.DataFactory/factories/${config.factory_name}/datasets?api-version=2018-06-01`,
    connections: ({ config }) =>
      `/subscriptions/${config.subscription_id}/resourceGroups/${config.resource_group}/providers/Microsoft.DataFactory/factories/${config.factory_name}/linkedservices?api-version=2018-06-01`,
    schedules: ({ config }) =>
      `/subscriptions/${config.subscription_id}/resourceGroups/${config.resource_group}/providers/Microsoft.DataFactory/factories/${config.factory_name}/triggers?api-version=2018-06-01`,
  },
  azure_purview: {
    assets: () => '/catalog/api/search/query?api-version=2023-09-01',
    glossary: () => '/catalog/api/atlas/v2/glossary',
    lineage: () => '/catalog/api/atlas/v2/lineage',
  },
  azure_storage: {
    containers: () => '?comp=list',
    objects: ({ config }) =>
      `${config.container ? `/${encodeURIComponent(config.container)}` : ''}?restype=container&comp=list`,
    schemas: ({ config }) => config.schema_manifest_url || config.manifest_url || null,
    classifications: ({ config }) =>
      config.classification_manifest_url || config.manifest_url || null,
    lineage: ({ config }) => config.lineage_manifest_url || config.manifest_url || null,
  },
  aws_glue: {
    databases: () => '/',
    tables: () => '/',
    columns: () => '/',
    partitions: () => '/',
    jobs: () => '/',
  },
  aws_s3: {
    buckets: () => '/',
    objects: ({ config }) => `/${encodeURIComponent(config.bucket || '')}`,
  },
  aws_redshift: {
    schemas: () => '/',
    tables: () => '/',
    columns: () => '/',
    usage: () => '/',
  },
  bigquery: {
    datasets: ({ config }) => `/bigquery/v2/projects/${config.project_id}/datasets`,
    tables: ({ config }) =>
      `/bigquery/v2/projects/${config.project_id}/datasets/${config.dataset_id || config.dataset || '-'}/tables`,
    jobs: ({ config }) => `/bigquery/v2/projects/${config.project_id}/jobs`,
  },
  databricks: {
    catalogs: () => '/api/2.1/unity-catalog/catalogs',
    schemas: ({ config }) =>
      `/api/2.1/unity-catalog/schemas?catalog_name=${encodeURIComponent(config.catalog || '')}`,
    tables: ({ config }) =>
      `/api/2.1/unity-catalog/tables?catalog_name=${encodeURIComponent(config.catalog || '')}&schema_name=${encodeURIComponent(config.schema || '')}`,
    jobs: () => '/api/2.1/jobs/list',
  },
  domo: {
    datasets: () => '/v1/datasets',
    cards: () => '/v1/cards',
    dashboards: () => '/v1/pages',
    dataflows: () => '/v1/dataflows',
  },
  gcp_dataplex: {
    lakes: ({ config }) =>
      `/v1/projects/${config.project_id}/locations/${config.location || '-'}/lakes`,
    zones: ({ config }) =>
      `/v1/projects/${config.project_id}/locations/${config.location || '-'}/lakes/${config.lake || '-'}/zones`,
    entries: ({ config }) =>
      `/v1/projects/${config.project_id}/locations/${config.location || '-'}/entryGroups/-/entries`,
  },
  gcs: {
    buckets: ({ config }) => `/storage/v1/b?project=${encodeURIComponent(config.project_id)}`,
    objects: ({ config }) => `/storage/v1/b/${encodeURIComponent(config.bucket || '-')}/o`,
  },
  git_repository: {
    repositories: ({ config }) => gitRepositoryApiUrl(config, 'repository'),
    python_scripts: ({ config }) => gitRepositoryApiUrl(config, 'items'),
    sql_files: ({ config }) => gitRepositoryApiUrl(config, 'items'),
    dbt_artifacts: ({ config }) => gitRepositoryApiUrl(config, 'items'),
    notebooks: ({ config }) => gitRepositoryApiUrl(config, 'items'),
  },
  dbt: {
    models: ({ config }) => config.manifest_url || config.catalog_url,
    sources: ({ config }) => config.manifest_url || config.catalog_url,
    columns: ({ config }) => config.catalog_url || config.manifest_url,
    tests: ({ config }) => config.manifest_url,
    metrics: ({ config }) => config.manifest_url,
    lineage: ({ config }) => config.manifest_url,
  },
  grafana: {
    folders: () => '/api/folders',
    dashboards: () => '/api/search?type=dash-db',
    data_sources: () => '/api/datasources',
    alerts: () => '/api/ruler/grafana/api/v1/rules',
  },
  cognos: {
    packages: () => '/api/v1/content',
    reports: () => '/api/v1/content?type=report',
    dashboards: () => '/api/v1/content?type=dashboard',
    data_modules: () => '/api/v1/content?type=dataModule',
    metrics: () => '/api/v1/content?type=metric',
    lineage: ({ config }) => config.lineage_endpoint || '/api/v1/content',
  },
  looker: {
    models: () => '/api/4.0/lookml_models',
    dashboards: () => '/api/4.0/dashboards',
    looks: () => '/api/4.0/looks',
  },
  metabase: {
    collections: () => '/api/collection',
    dashboards: () => '/api/dashboard',
    cards: () => '/api/card',
    datasets: () => '/api/database',
    data_sources: () => '/api/database',
  },
  microstrategy_cloud: {
    projects: () => '/api/projects',
    dossiers: () => '/api/dossiers',
    documents: () => '/api/documents',
    reports: () => '/api/v2/reports',
    cubes: () => '/api/cubes',
    schema_objects: () => '/api/model/schema/objects',
    data_sources: () => '/api/datasources',
  },
  mode: {
    spaces: () => '/api/analytics/spaces',
    reports: ({ config }) => `/api/${config.organization || 'analytics'}/reports`,
  },
  openapi: {
    openapi_spec: ({ config }) => config.spec_url,
    endpoints: ({ config }) => config.spec_url,
    schemas: ({ config }) => config.spec_url,
    lineage: ({ config }) => config.spec_url,
  },
  power_bi: {
    workspaces: () => '/v1.0/myorg/admin/groups?$top=5000',
    dashboards: () => '/v1.0/myorg/admin/dashboards',
    reports: () => '/v1.0/myorg/admin/reports',
    datasets: () => '/v1.0/myorg/admin/datasets',
    dataflows: () => '/v1.0/myorg/admin/dataflows',
    activity_events: ({ config }) =>
      `/v1.0/myorg/admin/activityevents?startDateTime='${encodeURIComponent(config.activity_start || new Date(Date.now() - 86400000).toISOString())}'&endDateTime='${encodeURIComponent(config.activity_end || new Date().toISOString())}'`,
  },
  power_bi_report_server: {
    folders: () => '/api/v2.0/Folders',
    reports: () => '/api/v2.0/PowerBIReports',
    datasets: () => '/api/v2.0/Datasets',
    data_sources: () => '/api/v2.0/DataSources',
    subscriptions: () => '/api/v2.0/Subscriptions',
  },
  qlik_cloud: {
    spaces: () => '/api/v1/spaces',
    apps: () => '/api/v1/items?resourceType=app',
    sheets: () => '/api/v1/items?resourceType=sheet',
    datasets: () => '/api/v1/data-connections',
    fields: ({ config }) =>
      `/api/v1/apps/${encodeURIComponent(config.app_id || '-')}/data/metadata`,
    metrics: ({ config }) =>
      `/api/v1/apps/${encodeURIComponent(config.app_id || '-')}/data/metadata`,
  },
  qlik_sense: {
    streams: () => '/qrs/stream/full',
    apps: () => '/qrs/app/full',
    connections: () => '/qrs/dataconnection/full',
  },
  quicksight: {
    analyses: ({ config }) =>
      `/accounts/${encodeURIComponent(config.aws_account_id || config.account_id || '-')}/analyses`,
    dashboards: ({ config }) =>
      `/accounts/${encodeURIComponent(config.aws_account_id || config.account_id || '-')}/dashboards`,
    datasets: ({ config }) =>
      `/accounts/${encodeURIComponent(config.aws_account_id || config.account_id || '-')}/data-sets`,
    data_sources: ({ config }) =>
      `/accounts/${encodeURIComponent(config.aws_account_id || config.account_id || '-')}/data-sources`,
    metrics: ({ config }) =>
      config.metrics_endpoint ||
      `/accounts/${encodeURIComponent(config.aws_account_id || config.account_id || '-')}/analyses`,
    lineage: ({ config }) =>
      config.lineage_endpoint ||
      `/accounts/${encodeURIComponent(config.aws_account_id || config.account_id || '-')}/analyses`,
  },
  redash: {
    data_sources: () => '/api/data_sources',
    queries: () => '/api/queries',
    dashboards: () => '/api/dashboards',
    alerts: () => '/api/alerts',
  },
  salesforce: {
    objects: ({ config }) =>
      `/services/data/${config.api_version || DEFAULT_API_VERSION.salesforce}/sobjects`,
    reports: ({ config }) =>
      `/services/data/${config.api_version || DEFAULT_API_VERSION.salesforce}/analytics/reports`,
    dashboards: ({ config }) =>
      `/services/data/${config.api_version || DEFAULT_API_VERSION.salesforce}/analytics/dashboards`,
  },
  sap: {
    objects: () => '/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/ServiceCollection?$format=json',
    fields: ({ config }) =>
      config.fields_endpoint ||
      '/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/ServiceCollection?$format=json',
    relationships: ({ config }) =>
      config.relationships_endpoint ||
      config.lineage_endpoint ||
      '/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/ServiceCollection?$format=json',
    extractors: ({ config }) =>
      config.extractors_endpoint ||
      '/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/ServiceCollection?$format=json',
    lineage: ({ config }) =>
      config.lineage_endpoint ||
      '/sap/opu/odata/IWFND/CATALOGSERVICE;v=2/ServiceCollection?$format=json',
  },
  sigma: {
    workbooks: () => '/v2/workbooks',
    datasets: () => '/v2/datasets',
    connections: () => '/v2/connections',
  },
  ssrs: {
    folders: () => '/api/v2.0/Folders',
    reports: () => '/api/v2.0/Reports',
    datasets: () => '/api/v2.0/Datasets',
    data_sources: () => '/api/v2.0/DataSources',
    subscriptions: () => '/api/v2.0/Subscriptions',
  },
  superset: {
    databases: () => '/api/v1/database/',
    datasets: () => '/api/v1/dataset/',
    charts: () => '/api/v1/chart/',
    dashboards: () => '/api/v1/dashboard/',
  },
  tableau: {
    projects: ({ config }) =>
      `/api/${config.api_version || DEFAULT_API_VERSION.tableau}/sites/${config.site_id}/projects`,
    workbooks: ({ config }) =>
      `/api/${config.api_version || DEFAULT_API_VERSION.tableau}/sites/${config.site_id}/workbooks`,
    views: ({ config }) =>
      `/api/${config.api_version || DEFAULT_API_VERSION.tableau}/sites/${config.site_id}/views`,
    datasources: ({ config }) =>
      `/api/${config.api_version || DEFAULT_API_VERSION.tableau}/sites/${config.site_id}/datasources`,
  },
  thoughtspot: {
    answers: () => '/api/rest/2.0/metadata/search',
    liveboards: () => '/api/rest/2.0/metadata/search',
    worksheets: () => '/api/rest/2.0/metadata/search',
    tables: () => '/api/rest/2.0/metadata/search',
    columns: () => '/api/rest/2.0/metadata/search',
  },
  kafka: {
    clusters: () => '/v3/clusters',
    topics: ({ config }) =>
      `/v3/clusters/${encodeURIComponent(config.cluster_id || config.cluster || '-')}/topics`,
    schemas: () => '/subjects',
    consumers: ({ config }) => `/consumers/${encodeURIComponent(config.group_id || '-')}`,
  },
  oracle_analytics: {
    workbooks: () => '/api/20210901/catalog/workbooks',
    analyses: () => '/api/20210901/catalog/analyses',
    dashboards: () => '/api/20210901/catalog/dashboards',
    datasets: () => '/api/20210901/datasets',
    semantic_models: () => '/api/20210901/semanticModels',
  },
  sap_businessobjects: {
    universes: () => '/biprws/raylight/v1/universes',
    reports: () => '/biprws/raylight/v1/documents',
    folders: () => '/biprws/infostore',
    data_sources: () => '/biprws/raylight/v1/connections',
  },
  sisense: {
    dashboards: () => '/api/v1/dashboards',
    widgets: () => '/api/v1/widgets',
    data_models: () => '/api/v2/datamodels',
    datasets: () => '/api/v2/datamodels',
  },
};

const SOURCE_BASE_URL = {
  azure_data_factory: () => 'https://management.azure.com',
  bigquery: () => 'https://bigquery.googleapis.com',
  gcp_dataplex: () => 'https://dataplex.googleapis.com',
  gcs: () => 'https://storage.googleapis.com',
  power_bi: () => 'https://api.powerbi.com',
  azure_purview: (config) =>
    config.account ? `https://${config.account}.purview.azure.com` : null,
  azure_storage: (config) =>
    config.account ? `https://${config.account}.blob.core.windows.net` : null,
  aws_glue: (config) => `https://glue.${config.region || 'us-east-1'}.amazonaws.com`,
  aws_s3: (config) => `https://s3.${config.region || 'us-east-1'}.amazonaws.com`,
  aws_redshift: (config) => `https://redshift-data.${config.region || 'us-east-1'}.amazonaws.com`,
  quicksight: (config) => `https://quicksight.${config.region || 'us-east-1'}.amazonaws.com`,
};

const SDK_REQUIRED = new Set(['postgresql', 'snowflake', 'ssas_on_prem']);

export async function fetchSourceMetadata({
  connector,
  stream,
  bridge,
  headers = {},
  options = {},
}) {
  const config = connector.config || {};
  const streamName = stream?.name;

  const local = localMetadataForStream(connector, stream);
  if (local) return local;

  if (['postgresql', 'snowflake', 'ssas_on_prem'].includes(connector.type)) {
    return fetchNativeMetadata({ connector, stream, bridge });
  }

  const endpointOverride = endpointOverrideForStream(config, streamName);
  const pathBuilder = SOURCE_PATHS[connector.type]?.[streamName];
  const baseUrl = resolveBaseUrl(connector);
  const path =
    endpointOverride || (pathBuilder ? pathBuilder({ config, connector, stream }) : null);

  if (!path) {
    if (SDK_REQUIRED.has(connector.type)) {
      throw sdkRequiredError(connector, stream, bridge);
    }
    throw sourceClientMissingError(connector, stream, bridge);
  }

  const url = absoluteUrl(path, baseUrl);
  const responseJson = await fetchJson({ connector, stream, url, headers, options });
  return normalizeSourceResponse({ connector, stream, json: responseJson });
}

export function hasDirectSourceClient(type) {
  return Boolean(SOURCE_PATHS[type]);
}

function endpointOverrideForStream(config = {}, streamName) {
  return (
    config?.stream_endpoints?.[streamName] ||
    config?.source_endpoints?.[streamName] ||
    config?.endpoints?.[streamName] ||
    null
  );
}

function resolveBaseUrl(connector) {
  const config = connector.config || {};
  return (
    config.base_url ||
    config.tenant_url ||
    config.workspace_url ||
    config.server_url ||
    config.api_base_url ||
    SOURCE_BASE_URL[connector.type]?.(config) ||
    null
  );
}

function absoluteUrl(path, baseUrl) {
  if (/^https?:\/\//i.test(String(path))) return String(path);
  if (!baseUrl) return null;
  return `${String(baseUrl).replace(/\/+$/, '')}/${String(path).replace(/^\/+/, '')}`;
}

async function fetchJson({ connector, stream, url, headers, options }) {
  if (!url) {
    throw sourceClientMissingError(connector, stream);
  }
  const requestHeaders = await sourceHeaders({ connector, stream, url, headers });
  const response = await fetch(url, {
    method: options.method || stream.method || 'GET',
    headers: requestHeaders,
  });
  if (!response.ok) {
    throw new ConnectorRuntimeError(
      `${connector.type} source API returned HTTP ${response.status} for stream '${stream.name}'.`,
      {
        connector_id: connector.id,
        connector_type: connector.type,
        stream: stream.name,
        remediation:
          'Check source URL, API version, tenant/site/project IDs, service-account permissions, and network/firewall access.',
        details: { status: response.status, endpoint: safeUrl(url) },
      }
    );
  }
  try {
    return response.json();
  } catch (err) {
    throw new ConnectorRuntimeError(
      `${connector.type} source API did not return JSON for stream '${stream.name}'.`,
      {
        connector_id: connector.id,
        connector_type: connector.type,
        stream: stream.name,
        remediation:
          'Use a JSON metadata API endpoint or add a source-specific parser for this response format.',
        details: { endpoint: safeUrl(url), parse_error: err.message },
      }
    );
  }
}

async function sourceHeaders({ connector, stream, url, headers }) {
  const baseHeaders = {
    Accept: 'application/json',
    ...headers,
  };
  if (connector.type.startsWith('aws_') || connector.type === 'quicksight') {
    return signAwsHeaders({ connector, stream, url, headers: baseHeaders });
  }
  return baseHeaders;
}

function normalizeSourceResponse({ connector, stream, json }) {
  if (connector.type === 'openapi') return normalizeOpenApi(stream, json);
  if (connector.type === 'salesforce') return normalizeSalesforce(stream, json);
  if (connector.type === 'git_repository') return normalizeGitRepository(connector, stream, json);
  if (connector.type === 'dbt') return normalizeDbt(connector, stream, json);

  return {
    extracted_at: new Date().toISOString(),
    source: 'source_api_client',
    [stream.name]: extractArray(json),
  };
}

async function fetchNativeMetadata({ connector, stream, bridge }) {
  if (connector.type === 'postgresql') return fetchPostgresMetadata({ connector, stream, bridge });
  if (connector.type === 'snowflake') return fetchSnowflakeMetadata({ connector, stream, bridge });
  if (connector.type === 'ssas_on_prem') return fetchSsasMetadata({ connector, stream, bridge });
  throw sdkRequiredError(connector, stream, bridge);
}

async function fetchPostgresMetadata({ connector, stream, bridge }) {
  let pg;
  try {
    pg = await import('pg');
  } catch {
    throw nativeDependencyError(connector, stream, bridge, {
      packageName: 'pg',
      clientFamily: 'postgresql-native-driver',
      installHint: 'npm install pg',
    });
  }

  const { Client } = pg.default || pg;
  const client = new Client({
    host: connector.config.host,
    port: connector.config.port || 5432,
    database: connector.config.database,
    user: connector.credential.username || connector.config.username,
    password: connector.credential.password || connector.config.password,
    ssl: connector.config.ssl || undefined,
  });
  try {
    await client.connect();
    const result = await client.query(postgresQueryForStream(stream.name));
    return {
      [stream.name]: result.rows || [],
      extracted_at: new Date().toISOString(),
      source: 'postgresql_driver',
    };
  } finally {
    await client.end().catch(() => {});
  }
}

async function fetchSnowflakeMetadata({ connector, stream, bridge }) {
  let snowflake;
  try {
    snowflake = await import('snowflake-sdk');
  } catch {
    throw nativeDependencyError(connector, stream, bridge, {
      packageName: 'snowflake-sdk',
      clientFamily: 'snowflake-native-driver',
      installHint: 'npm install snowflake-sdk',
    });
  }

  const connection = snowflake.createConnection({
    account: connector.config.account,
    username: connector.credential.username || connector.config.username,
    password: connector.credential.password || connector.config.password,
    warehouse: connector.config.warehouse,
    database: connector.config.database,
    schema: connector.config.schema,
    role: connector.config.role,
  });

  await new Promise((resolve, reject) =>
    connection.connect((err) => (err ? reject(err) : resolve()))
  );
  try {
    const rows = await new Promise((resolve, reject) => {
      connection.execute({
        sqlText: snowflakeQueryForStream(stream.name),
        complete: (err, _statement, resultRows) => (err ? reject(err) : resolve(resultRows || [])),
      });
    });
    return {
      [stream.name]: rows,
      extracted_at: new Date().toISOString(),
      source: 'snowflake_driver',
    };
  } finally {
    connection.destroy(() => {});
  }
}

async function fetchSsasMetadata({ connector, stream, bridge }) {
  if (!connector.config.xmla_endpoint && !connector.config.metadata_endpoint) {
    throw nativeDependencyError(connector, stream, bridge, {
      packageName: 'xmla-or-adomd-client',
      clientFamily: 'ssas-xmla-client',
      installHint: 'configure xmla_endpoint/metadata_endpoint or add an XMLA/ADOMD client package',
    });
  }
  throw nativeDependencyError(connector, stream, bridge, {
    packageName: 'xmla-or-adomd-client',
    clientFamily: 'ssas-xmla-client',
    installHint:
      'add XMLA SOAP request support or an ADOMD/XMLA client module before live SSAS extraction',
  });
}

function postgresQueryForStream(streamName) {
  const queries = {
    schemas:
      "select schema_name as id, schema_name as name from information_schema.schemata where schema_name not in ('pg_catalog','information_schema')",
    tables:
      "select table_schema, table_name, table_schema || '.' || table_name as id, table_name as name, table_type as type from information_schema.tables where table_schema not in ('pg_catalog','information_schema')",
    columns:
      "select table_schema, table_name, column_name as id, column_name as name, data_type, is_nullable from information_schema.columns where table_schema not in ('pg_catalog','information_schema')",
    constraints:
      'select constraint_schema, constraint_name as id, constraint_name as name, table_name, constraint_type from information_schema.table_constraints',
    routines:
      'select routine_schema, routine_name as id, routine_name as name, routine_type from information_schema.routines',
  };
  return queries[streamName] || queries.tables;
}

function snowflakeQueryForStream(streamName) {
  const queries = {
    databases: 'show databases',
    schemas:
      'select catalog_name, schema_name as id, schema_name as name from information_schema.schemata',
    tables:
      'select table_catalog, table_schema, table_name as id, table_name as name, table_type from information_schema.tables',
    columns:
      'select table_catalog, table_schema, table_name, column_name as id, column_name as name, data_type, is_nullable from information_schema.columns',
    tags: 'select * from table(information_schema.tag_references_all_columns())',
  };
  return queries[streamName] || queries.tables;
}

function nativeDependencyError(
  connector,
  stream,
  bridge,
  { packageName, clientFamily, installHint }
) {
  return new ConnectorRuntimeError(
    `${connector.type} native live extraction requires ${packageName} for stream '${stream?.name}'.`,
    {
      connector_id: connector.id,
      connector_type: connector.type,
      stream: stream?.name,
      remediation: installHint,
      details: {
        required_package: packageName,
        required_client_family: clientFamily,
        documented_endpoint: stream?.endpoint || null,
        docs: bridge?.docs || [],
      },
    }
  );
}

function normalizeOpenApi(stream, spec = {}) {
  if (stream.name === 'openapi_spec') {
    return {
      openapi_spec: [
        {
          id: spec.info?.title || 'openapi',
          name: spec.info?.title || 'OpenAPI spec',
          version: spec.info?.version,
        },
      ],
    };
  }
  if (stream.name === 'endpoints') {
    const endpoints = Object.entries(spec.paths || {}).flatMap(([path, methods]) =>
      Object.entries(methods || {}).map(([method, operation]) => ({
        id: `${method.toUpperCase()} ${path}`,
        name: operation.operationId || `${method.toUpperCase()} ${path}`,
        method: method.toUpperCase(),
        path,
        tags: operation.tags || [],
      }))
    );
    return { endpoints };
  }
  if (stream.name === 'schemas') {
    return {
      schemas: Object.entries(spec.components?.schemas || {}).map(([name, schema]) => ({
        id: name,
        name,
        type: schema.type || 'object',
        properties: Object.keys(schema.properties || {}),
      })),
    };
  }
  if (stream.name === 'lineage') {
    return {
      lineage: Object.entries(spec.paths || {}).flatMap(([path, methods]) =>
        Object.entries(methods || {}).flatMap(([method, operation]) =>
          Object.values(operation.responses || {}).flatMap((response) => {
            const ref = response?.content?.['application/json']?.schema?.$ref;
            return ref
              ? [
                  {
                    id: `${method}:${path}->${ref}`,
                    from: `${method.toUpperCase()} ${path}`,
                    to: ref.split('/').pop(),
                    type: 'returns_schema',
                  },
                ]
              : [];
          })
        )
      ),
    };
  }
  return { [stream.name]: [] };
}

function normalizeSalesforce(stream, json = {}) {
  if (stream.name === 'objects') {
    return {
      objects: (json.sobjects || json.objects || []).map((item) => ({
        ...item,
        id: item.name,
        object_type: 'salesforce_object',
      })),
    };
  }
  if (stream.name === 'fields') {
    return {
      fields: (json.fields || []).map((item) => ({
        ...item,
        id: item.name,
        object_type: 'salesforce_field',
      })),
    };
  }
  if (stream.name === 'relationships') {
    return {
      relationships: (json.childRelationships || []).map((item) => ({
        id: `${item.childSObject}.${item.field}->${item.relationshipName}`,
        from: item.childSObject,
        to: item.relationshipName,
        type: 'salesforce_child_relationship',
      })),
    };
  }
  return { [stream.name]: extractArray(json) };
}

function normalizeGitRepository(connector, stream, json) {
  const files = extractRepositoryFiles(connector.config, json);
  const filters = {
    python_scripts: /\.py$/i,
    sql_files: /\.sql$/i,
    notebooks: /\.ipynb$/i,
    dbt_artifacts: /(^|\/)(manifest|catalog|sources)\.json$/i,
  };
  if (stream.name === 'repositories') {
    return {
      repositories: [
        {
          id: connector.config.repo_url,
          name: connector.label || connector.config.repo_url,
          url: connector.config.repo_url,
        },
      ],
    };
  }
  if (filters[stream.name]) {
    return {
      [stream.name]: files
        .filter((file) => filters[stream.name].test(file.path || file.name || ''))
        .map(fileObject),
    };
  }
  return { [stream.name]: files.map(fileObject) };
}

function normalizeDbt(connector, stream, json) {
  const manifest = connector.config.manifest_json || json;
  if (stream.name === 'models') return { models: valuesOfType(manifest.nodes, 'model') };
  if (stream.name === 'sources') return { sources: Object.values(manifest.sources || {}) };
  if (stream.name === 'tests') return { tests: valuesOfType(manifest.nodes, 'test') };
  if (stream.name === 'metrics') return { metrics: Object.values(manifest.metrics || {}) };
  if (stream.name === 'lineage') {
    return {
      lineage: Object.entries(manifest.parent_map || {}).flatMap(([child, parents]) =>
        (parents || []).map((parent) => ({
          id: `${parent}->${child}`,
          from: parent,
          to: child,
          type: 'dbt_depends_on',
        }))
      ),
    };
  }
  return { [stream.name]: [] };
}

function localMetadataForStream(connector, stream) {
  if (connector.type === 'git_repository' && Array.isArray(connector.config?.files)) {
    return normalizeGitRepository(connector, stream, { files: connector.config.files });
  }
  if (connector.type === 'dbt' && connector.config?.manifest_json) {
    return normalizeDbt(connector, stream, connector.config.manifest_json);
  }
  return null;
}

function extractRepositoryFiles(config = {}, json = {}) {
  const configured = Array.isArray(config.files) ? config.files.map((path) => ({ path })) : [];
  const source = configured.length ? configured : extractArray(json);
  return source.map((item) => (typeof item === 'string' ? { path: item } : item));
}

function fileObject(file) {
  const path = file.path || file.name || file.url;
  return {
    ...file,
    id: path,
    name: path?.split('/').pop() || path,
    path,
    object_type: path?.endsWith('.py')
      ? 'python_script'
      : path?.endsWith('.sql')
        ? 'sql_file'
        : 'repository_file',
  };
}

function valuesOfType(nodes = {}, resourceType) {
  return Object.entries(nodes || {})
    .filter(([, node]) => node.resource_type === resourceType)
    .map(([id, node]) => ({ id, name: node.name || id, ...node }));
}

function extractArray(json) {
  if (Array.isArray(json)) return json;
  for (const key of [
    'value',
    'items',
    'data',
    'result',
    'results',
    'records',
    'sobjects',
    'files',
  ]) {
    if (Array.isArray(json?.[key])) return json[key];
  }
  if (json && typeof json === 'object') return [json];
  return [];
}

function sourceClientMissingError(connector, stream, bridge) {
  return new ConnectorRuntimeError(
    `${connector.type} has no direct source API endpoint configured for stream '${stream?.name}'.`,
    {
      connector_id: connector.id,
      connector_type: connector.type,
      stream: stream?.name,
      remediation:
        'Add stream_endpoints/source_endpoints for this stream, provide metadata_payload/seed_metadata, or implement the next vendor-specific client method in sourceClients.js.',
      details: {
        documented_endpoint: stream?.endpoint || null,
        docs: bridge?.docs || [],
      },
    }
  );
}

function sdkRequiredError(connector, stream, bridge) {
  return new ConnectorRuntimeError(
    `${connector.type} requires a native SDK/driver-backed live extractor for stream '${stream?.name}'.`,
    {
      connector_id: connector.id,
      connector_type: connector.type,
      stream: stream?.name,
      remediation:
        'Use metadata_payload/seed_metadata now, or add the vendor SDK/driver client for signed/native access while keeping the shared parser and canonical event contract.',
      details: {
        documented_endpoint: stream?.endpoint || null,
        docs: bridge?.docs || [],
        required_client_family: connector.type.startsWith('aws_')
          ? 'aws-sdk-v3-with-sigv4'
          : 'native-driver-or-vendor-sdk',
      },
    }
  );
}

function safeUrl(url) {
  try {
    const parsed = new URL(url);
    return parsed.origin + parsed.pathname;
  } catch {
    return String(url);
  }
}

function gitRepositoryApiUrl(config = {}, mode = 'items') {
  const repoUrl = config.repo_url || '';
  const branch = config.branch || 'main';
  const path = config.path || '/';

  const github = repoUrl.match(/^https:\/\/github\.com\/([^/]+)\/([^/.]+)(?:\.git)?/i);
  if (github) {
    const [, owner, repo] = github;
    if (mode === 'repository') return `https://api.github.com/repos/${owner}/${repo}`;
    return `https://api.github.com/repos/${owner}/${repo}/contents/${path.replace(/^\/+/, '')}?ref=${encodeURIComponent(branch)}`;
  }

  const azure = repoUrl.match(/^https:\/\/dev\.azure\.com\/([^/]+)\/([^/]+)\/_git\/([^/]+)/i);
  if (azure) {
    const [, org, project, repo] = azure;
    const encodedProject = encodeURIComponent(project);
    const encodedRepo = encodeURIComponent(repo);
    if (mode === 'repository') {
      return `https://dev.azure.com/${org}/${encodedProject}/_apis/git/repositories/${encodedRepo}?api-version=7.1`;
    }
    return `https://dev.azure.com/${org}/${encodedProject}/_apis/git/repositories/${encodedRepo}/items?recursionLevel=Full&includeContentMetadata=true&versionDescriptor.version=${encodeURIComponent(branch)}&api-version=7.1`;
  }

  return config.repository_api_url || null;
}

function signAwsHeaders({ connector, stream, url, headers }) {
  const config = connector.config || {};
  const credential = connector.credential || {};
  const accessKeyId =
    credential.access_key_id ||
    credential.accessKeyId ||
    config.access_key_id ||
    config.accessKeyId;
  const secretAccessKey =
    credential.secret_access_key ||
    credential.secretAccessKey ||
    credential.secret_key ||
    config.secret_access_key ||
    config.secretAccessKey;
  const sessionToken =
    credential.session_token ||
    credential.sessionToken ||
    config.session_token ||
    config.sessionToken;

  if (!accessKeyId || !secretAccessKey) {
    throw new ConnectorRuntimeError(
      `${connector.type} live extraction needs AWS credentials resolved before signing stream '${stream?.name}'.`,
      {
        connector_id: connector.id,
        connector_type: connector.type,
        stream: stream?.name,
        remediation:
          'Resolve the connector secret_ref into access_key_id and secret_access_key, or run with an IAM role/metadata sidecar that supplies signed stream_endpoints.',
        details: {
          accepted_credentials: ['access_key_id', 'secret_access_key', 'session_token'],
          credential_mode: credential.mode || credential.kind || null,
        },
      }
    );
  }

  const parsed = new URL(url);
  const region = config.region || 'us-east-1';
  const service = awsServiceForType(connector.type);
  const now = new Date();
  const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
  const dateStamp = amzDate.slice(0, 8);
  const canonicalUri = parsed.pathname || '/';
  const canonicalQuery = parsed.searchParams.toString();
  const { host } = parsed;
  const signedHeaders = 'host;x-amz-date';
  const payloadHash = createHash('sha256').update('').digest('hex');
  const canonicalRequest = [
    'GET',
    canonicalUri,
    canonicalQuery,
    `host:${host}`,
    `x-amz-date:${amzDate}`,
    '',
    signedHeaders,
    payloadHash,
  ].join('\n');
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const stringToSign = [
    'AWS4-HMAC-SHA256',
    amzDate,
    credentialScope,
    createHash('sha256').update(canonicalRequest).digest('hex'),
  ].join('\n');
  const signingKey = getAwsSignatureKey(secretAccessKey, dateStamp, region, service);
  const signature = createHmac('sha256', signingKey).update(stringToSign).digest('hex');

  return {
    ...headers,
    Host: host,
    'x-amz-date': amzDate,
    ...(sessionToken ? { 'x-amz-security-token': sessionToken } : {}),
    Authorization: `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`,
  };
}

function awsServiceForType(type) {
  if (type === 'aws_s3') return 's3';
  if (type === 'aws_redshift') return 'redshift-data';
  if (type === 'quicksight') return 'quicksight';
  return 'glue';
}

function getAwsSignatureKey(secretAccessKey, dateStamp, region, service) {
  const kDate = createHmac('sha256', `AWS4${secretAccessKey}`).update(dateStamp).digest();
  const kRegion = createHmac('sha256', kDate).update(region).digest();
  const kService = createHmac('sha256', kRegion).update(service).digest();
  return createHmac('sha256', kService).update('aws4_request').digest();
}
