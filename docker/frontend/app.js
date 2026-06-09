/* eslint-env browser */
/* global Vue, Vuetify, Chart */

const { createApp, nextTick } = Vue;
const { createVuetify } = Vuetify;

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
});

const navSections = [
  {
    key: 'workspace',
    label: 'Find & Understand',
    items: [
      { key: 'overview', label: 'Command Center', icon: 'mdi-view-dashboard' },
      { key: 'browse', label: 'Search', icon: 'mdi-magnify' },
      { key: 'lineageAsk', label: 'Lineage Assistant', icon: 'mdi-message-question' },
      { key: 'discovery', label: 'Lineage Explorer', icon: 'mdi-graphql' },
    ],
  },
  {
    key: 'govern',
    label: 'Govern & Improve',
    items: [
      { key: 'glossary', label: 'Business Glossary', icon: 'mdi-book-open-variant' },
      { key: 'governance', label: 'Trust & Compliance', icon: 'mdi-shield-check' },
      { key: 'governanceOps', label: 'Governance Ops', icon: 'mdi-clipboard-check' },
      { key: 'metrics', label: 'Metric Intelligence', icon: 'mdi-function-variant' },
    ],
  },
  {
    key: 'deliver',
    label: 'Package & Report',
    items: [
      { key: 'products', label: 'Data Products', icon: 'mdi-package-variant-closed' },
      { key: 'reports', label: 'Governance Insights', icon: 'mdi-chart-box' },
    ],
  },
  {
    key: 'operate',
    label: 'Connect & Operate',
    items: [
      { key: 'integrations', label: 'Connector Admin', icon: 'mdi-swap-horizontal' },
      { key: 'import', label: 'Ingestion Studio', icon: 'mdi-database-import' },
      { key: 'scheduler', label: 'Profile Scheduler', icon: 'mdi-calendar-clock' },
      { key: 'admin', label: 'Platform Admin', icon: 'mdi-cog' },
    ],
  },
  {
    key: 'support',
    label: 'Support',
    items: [{ key: 'docs', label: 'Help Center', icon: 'mdi-help-circle' }],
  },
];

const navItems = navSections.flatMap((section) => section.items);

const pageWorkflowMeta = {
  overview: {
    title: 'Command Center',
    subtitle: 'Start with health, coverage, recent activity, and the next best governance action.',
    workflow: 'Orient',
    primaryAction: 'Run next step',
  },
  browse: {
    title: 'Search',
    subtitle: 'Find governed assets, inspect metadata, and jump into lineage or stewardship work.',
    workflow: 'Find',
    primaryAction: 'Search catalog',
  },
  lineageAsk: {
    title: 'Lineage Assistant',
    subtitle: 'Ask plain-English lineage questions and get source-backed impacted object tables.',
    workflow: 'Ask',
    primaryAction: 'Ask question',
  },
  discovery: {
    title: 'Lineage Explorer',
    subtitle: 'Trace producers, consumers, SSIS packages, load procedures, and blast radius.',
    workflow: 'Trace',
    primaryAction: 'Render graph',
  },
  glossary: {
    title: 'Business Glossary',
    subtitle: 'Define business language and connect terms to technical assets.',
    workflow: 'Define',
    primaryAction: 'Search terms',
  },
  governance: {
    title: 'Trust & Compliance',
    subtitle: 'Manage classification, masking policy, data quality, and compliance coverage.',
    workflow: 'Control',
    primaryAction: 'Run rules',
  },
  governanceOps: {
    title: 'Governance Ops',
    subtitle: 'Route ownership, stewardship tasks, trust actions, exceptions, and publication readiness.',
    workflow: 'Operate',
    primaryAction: 'Refresh ops',
  },
  metrics: {
    title: 'Metric Intelligence',
    subtitle: 'Resolve metric columns, business formulas, profile evidence, and change impact.',
    workflow: 'Measure',
    primaryAction: 'Analyze metric',
  },
  products: {
    title: 'Data Products',
    subtitle: 'Package certified assets, contracts, access posture, and product readiness.',
    workflow: 'Package',
    primaryAction: 'Review products',
  },
  reports: {
    title: 'Governance Insights',
    subtitle: 'Review impact analysis, generated reports, leaderboards, and executive evidence.',
    workflow: 'Report',
    primaryAction: 'Refresh reports',
  },
  integrations: {
    title: 'Connector Admin',
    subtitle: 'Create reusable source connections, run one-time profiles, schedule refreshes, and grant safe access.',
    workflow: 'Connect',
    primaryAction: 'Save connection',
  },
  import: {
    title: 'Ingestion Studio',
    subtitle: 'Extract metadata, generate markdown, validate, index, and publish governance evidence.',
    workflow: 'Ingest',
    primaryAction: 'Run next step',
  },
  scheduler: {
    title: 'Profile Scheduler',
    subtitle: 'Create, monitor, and run recurring aggregate, BI, and metadata profile jobs.',
    workflow: 'Schedule',
    primaryAction: 'Create schedule',
  },
  admin: {
    title: 'Platform Admin',
    subtitle: 'Manage users, audit trail, platform health, settings, and API diagnostics.',
    workflow: 'Administer',
    primaryAction: 'Review health',
  },
  docs: {
    title: 'Help Center',
    subtitle: 'Find operating guides, implementation references, and user help.',
    workflow: 'Learn',
    primaryAction: 'Open guide',
  },
};

const demoSnapshot = {
  overview: {
    overview: {
      totalObjects: 128,
      totalDatabases: 5,
      totalDependencies: 412,
      avgDependencies: 3.2,
    },
    network: {
      maxUpstreamDepth: 6,
      maxDownstreamDepth: 9,
      criticalObjects: 14,
    },
  },
  quality: {
    checks: {
      ownershipCoverage: true,
      descriptionCoverage: true,
      piiTagged: true,
      dependencyCompleteness: false,
      freshnessSla: true,
    },
    score: 82,
  },
  activity: {
    totalEvents: 346,
    period: '30d',
  },
  objects: [
    {
      id: 'sales.orders',
      name: 'orders',
      database: 'sales',
      type: 'table',
      owner: 'sales-data-team',
      sensitivity: 'internal',
      description: 'Customer order fact table',
    },
    {
      id: 'sales.order_items',
      name: 'order_items',
      database: 'sales',
      type: 'table',
      owner: 'sales-data-team',
      sensitivity: 'internal',
      description: 'Line items by order',
    },
    {
      id: 'finance.revenue_daily',
      name: 'revenue_daily',
      database: 'finance',
      type: 'view',
      owner: 'finance-analytics',
      sensitivity: 'confidential',
      description: 'Daily recognized revenue summary',
    },
  ],
  graph: {
    status: 'success',
    data: {
      nodes: [
        { data: { id: 'sales.orders', label: 'orders' }, classes: ['central'] },
        { data: { id: 'sales.order_items', label: 'order_items' } },
        { data: { id: 'finance.revenue_daily', label: 'revenue_daily' } },
      ],
      edges: [
        {
          data: {
            id: 'sales.order_items-sales.orders',
            source: 'sales.order_items',
            target: 'sales.orders',
          },
        },
        {
          data: {
            id: 'sales.orders-finance.revenue_daily',
            source: 'sales.orders',
            target: 'finance.revenue_daily',
          },
        },
      ],
    },
  },
};

const appConfig = {
  data() {
    return {
      navSections,
      navItems,
      activeView: 'overview',
      sidebarCollapsed: localStorage.getItem('dg_sidebar_collapsed') === 'true',
      mobileSidebarOpen: false,
      demoModeEnabled: localStorage.getItem('dg_demo_mode') !== 'off',
      hasRealData: false,
      email: 'admin@platform.local',
      token: localStorage.getItem('dg_token') || '',
      refreshToken: localStorage.getItem('dg_refresh') || '',
      currentUser: JSON.parse(localStorage.getItem('dg_user') || 'null'),
      isLoggingOut: false,
      isRefreshingToken: false,
      authRefreshPromise: null,
      showProfileSecrets: false,
      toast: { show: false, message: '' },
      apiErrors: [],
      health: null,
      overview: null,
      quality: null,
      activity: null,
      recommendations: null,
      insights: null,
      graphDrawerOpen: false,
      graphDrawerNode: null,
      graphAnimationFrame: null,
      graphDashOffset: 0,
      browseQuery: '',
      browseResults: [],
      browseLoading: false,
      browseSearchLoading: false,
      browseSearchSubmitted: false,
      browseSearchWarning: '',
      browseSearchEngine: '',
      browseSearchTotal: null,
      browseCatalogTotal: null,
      browseLoadError: '',
      browseMode: 'search',
      searchFacets: null,
      browseSort: 'relevance',
      selectedFacetFilters: {
        types: [],
        quality: [],
        databases: [],
        owners: [],
        sensitivity: [],
        tags: [],
      },
      objectList: [],
      selectedObjectDetail: null,
      selectedObjectId: '',
      selectedObjectGovernance: null,
      selectedObjectPiiPolicy: null,
      selectedObjectColumnSemantics: null,
      selectedObjectDictionary: null,
      editableObjectMetadata: {
        description: '',
        owner: '',
        steward: '',
        domain_manager: '',
        custodian: '',
        sensitivity: 'public',
        tags: '',
        business_domain: '',
        business_justification: '',
        business_processes: '',
        use_cases: '',
        documentation_links: '',
        related_dashboards: '',
      },
      glossary: {
        terms: [],
        domains: [],
        query: '',
        selected: null,
        editing: false,
        editMode: 'create',
        editor: {
          term: '',
          domain: 'General',
          status: 'draft',
          owner: '',
          business_owner: '',
          steward: '',
          parent: '',
          synonyms: '',
          related_terms: '',
          tags: '',
          definition: '',
        },
        semanticQuery: '',
        semanticResolution: null,
        assetSearchQuery: '',
        assetSearchResults: [],
        assetSearchLoading: false,
        newMapping: {
          asset_id: '',
          relationship: 'defines',
          type: 'asset',
          confidence: 0.9,
          notes: '',
        },
      },
      governance: {
        summaries: [],
        health: null,
        qualityRules: {
          rules: [],
          incidents: [],
          executions: [],
          scorecard: null,
          scorecardExport: null,
          trend: null,
          loading: false,
          selectedRuleId: '',
          editor: {
            id: '',
            name: '',
            asset_id: '*',
            column_name: '',
            type: 'null_percent',
            severity: 'warning',
            threshold_min: '',
            threshold_max: '5',
            threshold_min_percent: '',
            threshold_min_match_percent: '',
            schedule: '',
            alert_routes: '',
            enabled: true,
          },
          runProfile: {
            asset_id: '',
            column_name: '',
            row_count: '',
            null_count: '',
            distinct_count: '',
            min: '',
            max: '',
            pattern_match_percent: '',
          },
        },
        classification: {
          taxonomy: null,
          summary: null,
          policyEffectiveness: null,
          run: null,
          loading: false,
          selectedCategoryId: '',
          selectedRuleId: '',
          categoryEditor: {
            id: '',
            label: '',
            parent: '',
            level: 1,
            description: '',
            regulatory_frameworks: '',
            name_patterns: '',
            sensitivity_triggers: '',
            tag_triggers: '',
          },
          ruleEditor: {
            id: '',
            label: '',
            target: 'column',
            classification: 'PII',
            pattern: '',
            min_column_hits: '',
            confidence: 0.8,
            enabled: true,
            description: '',
          },
        },
      },
      governanceOps: {
        loading: false,
        overview: null,
        ownershipModel: [],
        ownershipSummary: null,
        stewardPortfolio: null,
        portfolioSubject: 'all',
        bulkOwner: '',
        bulkSteward: '',
        bulkDomainManager: '',
        bulkCustodian: '',
        bulkAssetIds: '',
        bulkAssignmentPlan: null,
        tasks: [],
        incidents: [],
        usage: null,
        publication: null,
        storeStatus: null,
        eventDeliveries: [],
        selectedTaskStatus: '',
        selectedIncidentStatus: '',
        contextQuery: 'which governed assets mention revenue?',
        contextAnswer: null,
        taskAssetId: 'sales.orders',
        taskTitle: 'Review governance metadata',
        incidentAssetId: 'sales.orders',
        incidentTitle: 'Data quality investigation',
      },
      metrics: {
        loading: false,
        registry: null,
        query: '',
        objectId: '',
        selectedColumn: '',
        tableAnswer: null,
        logicAnswer: null,
        impactAnswer: null,
        profileAnswer: null,
        runtimePack: null,
        profiling: {
          loading: false,
          dialect: 'sql_server',
          mode: 'metadata_only',
          executionMode: 'live',
          maxTables: 1,
          maxColumns: 40,
          samplePercent: 1,
          lockTimeoutMs: 5000,
          queryTimeoutMs: 30000,
          plan: null,
          run: null,
          answer: null,
          confluence: null,
        },
      },
      productsCatalog: {
        products: [],
        selected: null,
      },
      docsLibrary: [],
      selectedDocKey: 'help-center',
      selectedDoc: null,
      docsLoading: false,
      discoveryFormat: 'centered',
      discoveryDepth: 2,
      discoveryGraph: null,
      impactData: null,
      lineageAnswerIntent: 'full_lineage',
      lineageAnswer: null,
      lineageHelp: null,
      lineageAnswerLoading: false,
      lineageRaw: {
        upstream: null,
        downstream: null,
        impact: null,
      },
      lineageQuestion: 'what uses DimVehicle?',
      lineageQuestionAnswer: null,
      lineageQuestionLoading: false,
      lineageQuestionHistory: [],
      lineageAssistantMessages: [
        {
          id: 'welcome',
          role: 'assistant',
          title: 'Sonic Lineage Assistant',
          text: 'Ask me about lineage, catalog counts, SSIS load paths, or where an object is used. I will answer in plain English and show the technical objects behind the answer.',
          answer: null,
        },
      ],
      matrixDatabase: 'sales',
      matrixData: null,
      reports: {
        shareObjectId: 'sales.orders',
        shareFormat: 'svg',
        sharedLink: null,
        schedules: [],
        recipient: 'data-team@company.com',
        blastRadius: null,
        blastRows: [],
        blastHeatmap: [],
        blastRadiusLoading: false,
        blastRadiusStatus: '',
        persona: 'auto',
        lastPackRun: null,
        runningPack: false,
      },
      integrations: {
        settings: null,
        notifyChannel: 'email',
        notifyEventType: 'documentation.updated',
        webhooks: [],
        newWebhook: {
          name: 'Default Webhook',
          url: 'https://example.com/webhook',
          events: 'integration.test',
        },
        linkObjectId: 'sales.orders',
        linkType: 'jira',
        linkUrl: 'https://jira.example.com/browse/DG-123',
        links: [],
        connectorDefinitions: [],
        managedConnectors: [],
        connectorRuns: [],
        connectorSnapshot: null,
        connectorLoading: false,
        connectorPublishLoading: false,
        connectorPublicationResult: null,
        selectedConnectorRun: null,
        connectorWorkflowTab: 'connection',
        selectedConnectorId: '',
        profileRunResult: null,
        profileRunEditor: {
          connectorId: '',
          profileType: 'aggregate',
          executionMode: 'live',
          assetIds: '',
          streams: '',
          coverageMode: 'all_objects',
          includeViews: true,
          livePriority: 'most_used_first',
          maxLiveTables: 1,
        },
        profileSchedules: [],
        profileSchedulerStatus: null,
        profileScheduleRuns: [],
        profileScheduleRunScheduleId: '',
        profileScheduleLoading: false,
        profileScheduleResult: null,
        profileScheduleEditor: {
          id: '',
          connectorId: '',
          name: '',
          profileType: 'auto',
          status: 'ACTIVE',
          cadence: 'daily',
          date: '',
          time: '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          intervalMinutes: 1440,
          maxFailures: 3,
          streams: '',
          dryRun: true,
          assetIds: '',
          coverageMode: 'all_objects',
          includeViews: true,
          livePriority: 'most_used_first',
          maxLiveTables: 1,
        },
        connectorEditor: {
          id: 'sonic-managed-connector',
          type: 'sql_server',
          label: 'Sonic Managed Connector',
          description: '',
          configJson: '{\n  "server": "L1-5FSQL-01",\n  "database": "Sonic_DW"\n}',
          credentialMode: 'windows_integrated',
          secretRef: '',
          rawSecret: '',
        },
        connectorGrant: {
          connectorId: '',
          scope: 'roles',
          subject: 'Analyst',
          actions: 'view,run',
        },
      },
      marketplace: {
        form: {
          assetId: 'sales.orders',
          requestedRole: 'Viewer',
          justification: '',
          approverId: '',
          approverEmail: '',
        },
        requests: [],
        scope: 'mine',
        loading: false,
      },
      promptDialog: {
        show: false,
        title: '',
        message: '',
        fields: [],
        resolve: null,
      },
      graphFocusDialog: {
        show: false,
      },
      lineageObjectSearch: {
        query: '',
        results: [],
        loading: false,
        open: false,
      },
      graphSearchText: '',
      graphSearchMatchCount: 0,
      graphHasSSISNodes: false,
      graphShowHiddenHint: false,
      graphShowOnlySSIS: false,
      graphReportData: null,
      edgeAudit: null,
      edgeAuditDialog: false,
      graphTabLinkAvailable: typeof window !== 'undefined',
      importer: {
        activeConnector: 'sql-server',
        files: [],
        parsed: [],
        validatePath: './data/markdown',
        loadPath: './data/markdown',
        status: null,
        validationResult: null,
        lastLoadStats: null,
        sqlServer: {
          server: 'localhost',
          port: 1433,
          database: 'master',
          username: '',
          password: '',
          authentication: 'sql-server',
          useIntegratedAuth: true,
          domain: '',
          clientId: '',
          clientSecret: '',
          tenantId: '',
          encrypt: true,
          trustServerCertificate: false,
          discovering: false,
          connecting: false,
          showScopeSelector: false,
          selectionMode: 'schema', // 'schema' | 'table'
          availableSchemas: [],
          selectedSchemas: [],
          selectedTables: [],
          excludeSchemas: [],
          excludeTables: [],
          expandedSchemas: {},
          schemaTableLists: {},
          topSchemaCount: 5,
          discoveredObjectCount: 0,
          result: null,
          availableDatabases: [],
          discoveringDatabases: false,
          databaseDiscoveryError: '',
          databaseDiscoverySignature: '',
          databaseDiscoveryTimer: null,
          databaseDiscoveryRequestId: 0,
        },
        // ADD THIS NEW SSIS STATE BLOCK:
        ssis: {
          server: 'localhost',
          port: 1433,
          database: 'master', // SSIS queries switch to SSISDB internally
          username: '',
          password: '',
          authentication: 'sql-server',
          useIntegratedAuth: true,
          domain: '',
          clientId: '',
          clientSecret: '',
          tenantId: '',
          encrypt: true,
          trustServerCertificate: false,

          // SSIS Specific Options
          historyDays: 30,
          phaseDays: 7,
          extractXml: true,

          // UI State
          discovering: false,
          connecting: false,
          result: null,
          inventory: null,
        },
        dataFactory: {
          subscriptionId: '',
          resourceGroupName: '',
          factoryName: '',
          tenantId: '',
          clientId: '',
          clientSecret: '',
          accessToken: '',
          discovering: false,
          connecting: false,
          result: null,
          inventory: null,
        },
        airflow: {
          baseUrl: '',
          apiVersion: 'v1',
          token: '',
          username: '',
          password: '',
          limit: 100,
          discovering: false,
          connecting: false,
          result: null,
          inventory: null,
        },
        databricks: {
          workspaceUrl: '',
          token: '',
          limit: 100,
          discovering: false,
          connecting: false,
          result: null,
          inventory: null,
        },
      },
      admin: {
        users: [],
        audit: [],
        dashboardUsers: null,
        dashboardHealth: null,
        dashboardSettings: null,
        newUser: {
          email: 'analyst@platform.local',
          name: 'New Analyst',
          role: 'Analyst',
        },
      },
      chartInstance: null,
      graphInstance: null,
      blastChartInstance: null,
      importStatusPoller: null,
      bootstrapInProgress: false,
      bootstrapPromise: null,
      browseSearchDebounceTimer: null,
      browseSearchRequestId: 0,
    };
  },
  computed: {
    activeNavItem() {
      return this.navItems.find((item) => item.key === this.activeView) || null;
    },
    activeNavSection() {
      return (
        this.navSections.find((section) =>
          section.items.some((item) => item.key === this.activeView)
        ) || null
      );
    },
    activePageMeta() {
      return pageWorkflowMeta[this.activeView] || {
        title: this.activeNavItem?.label || 'Workspace',
        subtitle: 'Review the selected governance workflow.',
        workflow: this.activeNavSection?.label || 'Workspace',
        primaryAction: this.recommendedWorkflowAction?.label || 'Run next step',
      };
    },
    pageQuickActions() {
      const actions = {
        overview: [
          { label: 'Search Catalog', icon: 'mdi-magnify', view: 'browse' },
          { label: 'Ask Lineage', icon: 'mdi-message-question', view: 'lineageAsk' },
          { label: 'Ingest Metadata', icon: 'mdi-database-import', view: 'import' },
        ],
        browse: [
          { label: 'Lineage Explorer', icon: 'mdi-graphql', view: 'discovery' },
          { label: 'Governance Ops', icon: 'mdi-clipboard-check', view: 'governanceOps' },
        ],
        integrations: [
          { label: 'Ingestion Studio', icon: 'mdi-database-import', view: 'import' },
          { label: 'Profile Scheduler', icon: 'mdi-calendar-clock', view: 'scheduler' },
        ],
        scheduler: [
          { label: 'Connector Admin', icon: 'mdi-swap-horizontal', view: 'integrations' },
          { label: 'Governance Ops', icon: 'mdi-clipboard-check', view: 'governanceOps' },
        ],
        import: [
          { label: 'Connector Admin', icon: 'mdi-swap-horizontal', view: 'integrations' },
          { label: 'Lineage Explorer', icon: 'mdi-graphql', view: 'discovery' },
        ],
      };
      return actions[this.activeView] || [];
    },
    isAuthenticated() {
      return !!this.token;
    },
    authHeader() {
      return this.token ? { Authorization: `Bearer ${this.token}` } : {};
    },
    profileInitials() {
      const name = this.currentUser?.name || this.currentUser?.email || 'User';
      const parts = String(name)
        .split(/\s+|@|\.|_/)
        .filter(Boolean);
      if (parts.length === 0) {
        return 'U';
      }
      if (parts.length === 1) {
        return parts[0].slice(0, 2).toUpperCase();
      }
      return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
    },
    accessTokenPayload() {
      return this.decodeTokenPayload(this.token);
    },
    refreshTokenPayload() {
      return this.decodeTokenPayload(this.refreshToken);
    },
    profileOverviewRows() {
      const accessExp = this.accessTokenPayload?.exp
        ? this.formatEpochSeconds(this.accessTokenPayload.exp)
        : 'Unavailable';
      const refreshExp = this.refreshTokenPayload?.exp
        ? this.formatEpochSeconds(this.refreshTokenPayload.exp)
        : 'Unavailable';
      const issuedAt = this.accessTokenPayload?.iat
        ? this.formatEpochSeconds(this.accessTokenPayload.iat)
        : 'Unavailable';

      return [
        {
          label: 'User ID',
          value: this.currentUser?.id || this.accessTokenPayload?.sub || 'Unavailable',
        },
        { label: 'Issued At', value: issuedAt },
        { label: 'Access Expires', value: accessExp },
        { label: 'Refresh Expires', value: refreshExp },
        {
          label: 'Databases',
          value: (this.currentUser?.databases || []).length
            ? this.currentUser.databases.join(', ')
            : 'All / Not Scoped',
        },
      ];
    },
    profileScheduleStats() {
      const schedules = this.integrations.profileSchedules || [];
      return {
        total: schedules.length,
        active: schedules.filter((item) => item.status === 'ACTIVE').length,
        paused: schedules.filter((item) => item.status === 'PAUSED').length,
        dueSoon: schedules.filter((item) => this.isScheduleDueSoon(item)).length,
      };
    },
    profileScheduleConnectorOptions() {
      return (this.integrations.managedConnectors || []).map((connector) => ({
        title: `${connector.label || connector.id} (${connector.type})`,
        value: connector.id,
      }));
    },
    profileScheduleTypeOptions() {
      return [
        { title: 'Auto route', value: 'auto' },
        { title: 'Aggregate database profile', value: 'aggregate' },
        { title: 'BI report profile', value: 'bi' },
        { title: 'Metadata profile', value: 'metadata' },
      ];
    },
    profileScheduleCadenceOptions() {
      return [
        { title: 'Every hour', value: 'hourly' },
        { title: 'Daily', value: 'daily' },
        { title: 'Weekly', value: 'weekly' },
        { title: 'Custom minutes', value: 'custom' },
      ];
    },
    selectedManagedConnector() {
      const selectedId =
        this.integrations.selectedConnectorId ||
        this.integrations.profileRunEditor.connectorId ||
        this.integrations.profileScheduleEditor.connectorId;
      return (this.integrations.managedConnectors || []).find((connector) => connector.id === selectedId) || null;
    },
    selectedConnectorSupportsProfiling() {
      const connector = this.selectedManagedConnector;
      return ['sql_server', 'postgresql', 'snowflake', 'bigquery', 'databricks', 'aws_redshift'].includes(
        connector?.type
      );
    },
    connectorWorkflowSteps() {
      const hasConnector = Boolean(this.selectedManagedConnector);
      const hasProfile = Boolean(this.integrations.profileRunResult);
      const hasSchedule = (this.integrations.profileSchedules || []).some(
        (schedule) => schedule.connector_id === this.selectedManagedConnector?.id
      );
      return [
        { key: 'connection', label: '1. Save connection', done: hasConnector },
        { key: 'run', label: '2. Run one-time profile', done: hasProfile },
        { key: 'schedule', label: '3. Schedule refresh', done: hasSchedule },
        { key: 'access', label: '4. Grant access', done: hasConnector },
        { key: 'history', label: '5. Review history', done: this.integrations.connectorRuns.length > 0 },
      ];
    },
    accessTokenPreview() {
      return this.showProfileSecrets ? this.token : this.maskToken(this.token);
    },
    refreshTokenPreview() {
      return this.showProfileSecrets ? this.refreshToken : this.maskToken(this.refreshToken);
    },
    isElasticsearchHealthy() {
      // Changed to look for the elasticsearch key
      return this.importer.status?.elasticsearchHealthy === true;
    },
    canLoadToIndex() {
      return this.isElasticsearchHealthy;
    },
    ingestionConnectorOptions() {
      const sqlObjects = Number(this.importer.sqlServer.result?.totalObjectsExtracted || 0);
      const ssisPackages = Number(this.importer.ssis.result?.summary?.counts?.packages || 0);
      const parsedMarkdown = Number(this.importer.parsed?.length || 0);
      const dataFactoryPipelines = Number(this.importer.dataFactory.result?.pipelines?.length || 0);
      const dataFactoryDiscovered = Number(
        this.importer.dataFactory.inventory?.pipelines?.length || 0
      );
      const airflowDags = Number(this.importer.airflow.result?.dags?.length || 0);
      const airflowDiscovered = Number(this.importer.airflow.inventory?.dags?.length || 0);
      const databricksJobs = Number(this.importer.databricks.result?.jobs?.length || 0);
      const databricksDiscovered = Number(this.importer.databricks.inventory?.jobs?.length || 0);

      return [
        {
          key: 'sql-server',
          icon: 'mdi-database',
          label: 'SQL Server',
          type: 'Database',
          status: sqlObjects > 0 ? 'Extracted' : 'Ready',
          statusColor: sqlObjects > 0 ? 'success' : 'primary',
          metric: sqlObjects > 0 ? `${sqlObjects.toLocaleString()} objects` : `${this.importer.sqlServer.database || 'No database'} selected`,
          description: 'Discover schemas, tables, views, procedures, and relationship confidence.',
        },
        {
          key: 'ssis',
          icon: 'mdi-package-variant',
          label: 'SSIS',
          type: 'ETL',
          status: ssisPackages > 0 ? 'Extracted' : this.importer.ssis.inventory ? 'Discovered' : 'Ready',
          statusColor: ssisPackages > 0 ? 'success' : this.importer.ssis.inventory ? 'warning' : 'primary',
          metric: ssisPackages > 0 ? `${ssisPackages.toLocaleString()} packages` : `${this.importer.ssis.server || 'No server'} configured`,
          description: 'Extract packages, jobs, execution history, XML lineage, and generated markdown.',
        },
        {
          key: 'markdown',
          icon: 'mdi-file-document-multiple',
          label: 'Markdown',
          type: 'File ingest',
          status: parsedMarkdown > 0 ? 'Parsed' : 'Ready',
          statusColor: parsedMarkdown > 0 ? 'success' : 'primary',
          metric: parsedMarkdown > 0 ? `${parsedMarkdown.toLocaleString()} files` : 'Upload governance markdown',
          description: 'Upload curated markdown files and inspect parse results before validation.',
        },
        {
          key: 'data-factory',
          icon: 'mdi-factory',
          label: 'Data Factory',
          type: 'Cloud pipeline',
          status: dataFactoryPipelines > 0 ? 'Extracted' : dataFactoryDiscovered > 0 ? 'Discovered' : 'Ready',
          statusColor: dataFactoryPipelines > 0 ? 'success' : dataFactoryDiscovered > 0 ? 'warning' : 'primary',
          metric:
            dataFactoryPipelines > 0
              ? `${dataFactoryPipelines.toLocaleString()} pipelines`
              : this.importer.dataFactory.factoryName || 'Azure pipelines',
          description: 'Discover ADF pipelines, activities, datasets, linked services, and triggers.',
        },
        {
          key: 'airflow',
          icon: 'mdi-source-branch',
          label: 'Airflow',
          type: 'Orchestrator',
          status: airflowDags > 0 ? 'Extracted' : airflowDiscovered > 0 ? 'Discovered' : 'Ready',
          statusColor: airflowDags > 0 ? 'success' : airflowDiscovered > 0 ? 'warning' : 'primary',
          metric:
            airflowDags > 0
              ? `${airflowDags.toLocaleString()} DAGs`
              : this.importer.airflow.baseUrl || 'DAG lineage',
          description: 'Discover DAGs, connections, schedules, and orchestration metadata.',
        },
        {
          key: 'databricks',
          icon: 'mdi-cube-outline',
          label: 'Databricks',
          type: 'Lakehouse',
          status: databricksJobs > 0 ? 'Extracted' : databricksDiscovered > 0 ? 'Discovered' : 'Ready',
          statusColor: databricksJobs > 0 ? 'success' : databricksDiscovered > 0 ? 'warning' : 'primary',
          metric:
            databricksJobs > 0
              ? `${databricksJobs.toLocaleString()} jobs`
              : this.importer.databricks.workspaceUrl || 'Jobs and notebooks',
          description: 'Discover jobs, clusters, Unity Catalog catalogs, and workspace metadata.',
        },
      ];
    },
    activeIngestionConnector() {
      return (
        this.ingestionConnectorOptions.find(
          (connector) => connector.key === this.importer.activeConnector
        ) || this.ingestionConnectorOptions[0]
      );
    },
    elasticsearchStatusLabel() {
      if (this.importer.status?.elasticsearchHealthy === true) {
        return 'Connected';
      }
      if (this.importer.status?.elasticsearchHealthy === false) {
        return 'Unavailable';
      }
      return 'Checking...';
    },
    workflowProgressPercent() {
      const steps = this.importWorkflowSteps;
      const completedCount = steps.filter((step) => step.done).length;
      return Math.round((completedCount / steps.length) * 100);
    },
    importWorkflowSteps() {
      const governedObjects = Number(this.overview?.overview?.totalObjects || 0);
      const dependencies = Number(this.overview?.overview?.totalDependencies || 0);
      const qualityScore = Number(this.quality?.score || 0);
      const indexedObjects =
        Number(this.importer.lastLoadStats?.totalObjects || 0) ||
        Number(this.importer.status?.loadedObjectCount || 0) ||
        governedObjects;
      const discovered =
        Number(this.importer.sqlServer.discoveredObjectCount || 0) > 0 || governedObjects > 0;
      const extracted =
        Number(this.importer.sqlServer.result?.totalObjectsExtracted || 0) > 0 || governedObjects > 0;
      const validated =
        Number(this.importer.validationResult?.valid || 0) > 0 || qualityScore > 0 || governedObjects > 0;
      const loaded = indexedObjects > 0;
      const analyzed = Number(this.reports.blastRows?.length || 0) > 0 || dependencies > 0;

      return [
        {
          key: 'discover',
          label: 'Discover Scope',
          done: discovered,
          view: 'import',
        },
        {
          key: 'extract',
          label: 'Extract Metadata',
          done: extracted,
          view: 'import',
        },
        {
          key: 'validate',
          label: 'Validate Markdown',
          done: validated,
          view: 'import',
        },
        {
          key: 'load',
          label: 'Load to Index',
          done: loaded,
          view: 'import',
        },
        {
          key: 'analyze',
          label: 'Blast Radius Analysis',
          done: analyzed,
          view: 'reports',
        },
      ];
    },
    recommendedWorkflowAction() {
      const next = this.importWorkflowSteps.find((step) => !step.done);
      return next || { key: 'complete', label: 'Workflow Complete', view: 'reports' };
    },
    executiveReportMetrics() {
      return {
        objects: this.overview?.overview?.totalObjects || 0,
        databases: this.overview?.overview?.totalDatabases || 0,
        dependencies: this.overview?.overview?.totalDependencies || 0,
        qualityScore: this.quality?.score || 0,
        blastObjects: this.reports?.blastRadius?.impactedObjects || 0,
        blastDepth: this.reports?.blastRadius?.maxDepth || 0,
        indexedObjects:
          this.importer.lastLoadStats?.totalObjects ||
          this.importer.status?.loadedObjectCount ||
          this.overview?.overview?.totalObjects ||
          0,
      };
    },
    lineageAnswerIntentOptions() {
      return [
        { title: 'Full lineage', value: 'full_lineage' },
        { title: 'What feeds this?', value: 'feeds' },
        { title: 'What loads this?', value: 'loads' },
        { title: 'What uses this?', value: 'uses' },
      ];
    },
    isMarketplaceAdmin() {
      const roles = (this.currentUser?.roles || []).map((role) => String(role).toLowerCase());
      return roles.includes('admin');
    },
    criticalDependencyLeaderboard() {
      return (this.reports.blastRows || [])
        .slice()
        .sort((a, b) => b.reachScore - a.reachScore)
        .slice(0, 10);
    },
    resolvedPersona() {
      if (this.reports.persona && this.reports.persona !== 'auto') {
        return this.reports.persona;
      }

      const roles = (this.currentUser?.roles || []).map((role) => String(role).toLowerCase());
      if (roles.includes('admin')) return 'executive';
      if (roles.includes('poweruser')) return 'steward';
      if (roles.includes('analyst')) return 'analyst';
      return 'engineer';
    },
    personaKpis() {
      const metrics = this.executiveReportMetrics;
      const validation = this.importer.validationResult || {};
      const lastLoad = this.importer.lastLoadStats || {};
      const common = {
        objects: metrics.objects,
        dependencies: metrics.dependencies,
        qualityScore: metrics.qualityScore,
        blastObjects: metrics.blastObjects,
        validationIssues: validation.invalid || 0,
        indexedObjects: metrics.indexedObjects || lastLoad.totalObjects || this.importer.status?.loadedObjectCount || 0,
      };

      switch (this.resolvedPersona) {
        case 'executive':
          return [
            { label: 'Governed Objects', value: common.objects },
            { label: 'Quality Score', value: common.qualityScore },
            { label: 'Blast Exposure', value: common.blastObjects },
            { label: 'Indexed Objects', value: common.indexedObjects },
          ];
        case 'steward':
          return [
            { label: 'Validation Issues', value: common.validationIssues },
            { label: 'Dependencies', value: common.dependencies },
            { label: 'Blast Exposure', value: common.blastObjects },
            { label: 'Quality Score', value: common.qualityScore },
          ];
        case 'analyst':
          return [
            { label: 'Searchable Objects', value: common.indexedObjects },
            { label: 'Dependencies', value: common.dependencies },
            { label: 'Blast Objects', value: common.blastObjects },
            { label: 'Databases', value: metrics.databases },
          ];
        default:
          return [
            { label: 'Validation Issues', value: common.validationIssues },
            { label: 'Indexed Objects', value: common.indexedObjects },
            { label: 'Dependencies', value: common.dependencies },
            { label: 'Blast Depth', value: metrics.blastDepth },
          ];
      }
    },
    personaInsights() {
      const action = this.recommendedWorkflowAction?.label || 'Run workflow';
      switch (this.resolvedPersona) {
        case 'executive':
          return [
            `Focus object: ${this.selectedObjectId}`,
            `Primary action: ${action}`,
            'Use Blast Radius and Leaderboard for critical dependency governance.',
          ];
        case 'steward':
          return [
            `Validation path: ${this.importer.validatePath}`,
            `Load status: ${this.importer.status?.status || 'unknown'}`,
            'Prioritize unresolved validation issues before new extraction runs.',
          ];
        case 'analyst':
          return [
            `Browse query: ${this.browseQuery}`,
            `Graph depth: ${this.discoveryDepth}`,
            'Use report packs to export catalog + visualization in one step.',
          ];
        default:
          return [
            `Elasticsearch: ${this.elasticsearchStatusLabel}`,
            `Last generated path: ${this.importer.status?.lastGeneratedPath || 'n/a'}`,
            'Use workflow controls to keep pipeline healthy end to end.',
          ];
      }
    },
    personaOptions() {
      return [
        { label: 'Auto', value: 'auto' },
        { label: 'Executive', value: 'executive' },
        { label: 'Steward', value: 'steward' },
        { label: 'Analyst', value: 'analyst' },
        { label: 'Engineer', value: 'engineer' },
      ];
    },
    personaQuickActions() {
      const persona = this.resolvedPersona;
      if (persona === 'executive') {
        return [
          { label: 'Open Governance Insights', view: 'reports' },
          { label: 'Review Trust & Compliance', view: 'governance' },
          { label: 'Run Next Workflow Step', action: 'workflow' },
        ];
      }
      if (persona === 'steward') {
        return [
          { label: 'Open Trust & Compliance', view: 'governance' },
          { label: 'Inspect Business Glossary', view: 'glossary' },
          { label: 'Run Next Workflow Step', action: 'workflow' },
        ];
      }
      if (persona === 'analyst') {
        return [
          { label: 'Search Catalog', view: 'browse' },
          { label: 'Open Data Products', view: 'products' },
          { label: 'Open Lineage Explorer', view: 'discovery' },
        ];
      }
      return [
        { label: 'Open Metadata Ingestion', view: 'import' },
        { label: 'Open Lineage Explorer', view: 'discovery' },
        { label: 'Run Next Workflow Step', action: 'workflow' },
      ];
    },
    catalogBaseResults() {
      if (this.browseSearchSubmitted) {
        return this.browseResults;
      }
      if (this.browseMode === 'browse' && this.selectedFacetFilters.databases.length) {
        return this.objectList;
      }
      return [];
    },
    catalogSearchHasStarted() {
      return this.browseSearchSubmitted || this.browseMode === 'browse';
    },
    selectedBrowseDatabase() {
      return this.selectedFacetFilters.databases[0] || '';
    },
    catalogDatabaseOptions() {
      const facetCounts = this.searchFacets?.counts?.databases || {};
      const counts = new Map(Object.entries(facetCounts));
      if (counts.size === 0 && Array.isArray(this.searchFacets?.databases)) {
        return this.searchFacets.databases
          .filter(Boolean)
          .map((database) => this.catalogDatabaseLabel(database))
          .filter((database, index, values) => values.indexOf(database) === index)
          .sort((a, b) => a.localeCompare(b))
          .map((database) => ({
            title: database,
            value: database,
            count: null,
          }));
      }
      if (counts.size === 0 && this.browseMode === 'browse') {
        (this.objectList || []).forEach((item) => {
          const database = this.catalogDatabaseLabel(item.database || item.schema);
          if (!database) return;
          counts.set(database, (counts.get(database) || 0) + 1);
        });
      }
      return Array.from(counts.entries())
        .filter(([, count]) => count > 0)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([database, count]) => ({
          title: `${this.catalogDatabaseLabel(database)} (${count})`,
          value: this.catalogDatabaseLabel(database),
          count,
        }));
    },
    browseTypeTabs() {
      const counts = this.browseFacetCounts.types || {};
      const labels = {
        storedProcedure: 'Procedures',
        table: 'Tables',
        view: 'Views',
        function: 'Functions',
        package: 'Packages',
        dataset: 'Datasets',
        column: 'Columns',
      };
      return Object.entries(counts)
        .filter(([, count]) => count > 0)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([type, count]) => ({
          type,
          label: labels[type] || type.charAt(0).toUpperCase() + type.slice(1),
          count,
        }));
    },
    catalogResultSummary() {
      if (this.browseMode === 'browse') {
        if (!this.selectedBrowseDatabase) return 'Choose a database to browse catalog objects.';
        const total = this.browseSearchTotal ?? this.filteredCatalogResults.length;
        const visible = this.filteredCatalogResults.length;
        return `Showing ${visible} of ${total} object(s) in ${this.catalogDatabaseLabel(this.selectedBrowseDatabase)}.`;
      }
      if (!this.browseSearchSubmitted) return 'Search by object name, column, owner, tag, or business meaning.';
      const query = String(this.browseQuery || '').trim();
      return `Showing ${this.filteredCatalogResults.length} result(s)${query ? ` for "${query}"` : ''}.`;
    },
    catalogSearchPlaceholder() {
      const selectedTypes = this.selectedFacetFilters.types || [];
      if (selectedTypes.includes('table')) return 'Enter a table name, like DimVehicle...';
      if (selectedTypes.includes('column')) return 'Enter a column name, like email, amount, or customer_id...';
      if (selectedTypes.includes('storedProcedure')) return 'Enter a procedure name, like usp_DimVehicle...';
      return 'Search tables, columns, procedures, owners, tags...';
    },
    catalogHelperActions() {
      return [
        { key: 'find-table', label: 'Find table', icon: 'mdi-table', description: 'Search only table assets.' },
        { key: 'find-column', label: 'Find column', icon: 'mdi-table-column', description: 'Search column names and metadata.' },
        { key: 'find-pii', label: 'Find PII', icon: 'mdi-shield-lock', description: 'Look for sensitive or restricted data.' },
        { key: 'find-metric', label: 'Find metric', icon: 'mdi-function-variant', description: 'Search for metric columns and measures.' },
        { key: 'browse-database', label: 'Browse database', icon: 'mdi-database-search', description: 'Choose a database and browse its objects.' },
        { key: 'needs-owner', label: 'Needs owner', icon: 'mdi-account-alert', description: 'Find assets missing owner or steward context.' },
      ];
    },
    overviewRecentObjects() {
      const candidates = [
        ...(this.objectList || []),
        ...(this.recommendations?.recommended?.newData?.items || []),
        ...(this.recommendations?.recommended?.trending?.items || []),
        ...(this.recommendations?.recommended?.critical?.items || []),
      ];
      const seen = new Set();
      return candidates
        .filter((obj) => obj && (obj.id || obj.name))
        .filter((obj) => {
          const id = obj.id || obj.name;
          if (seen.has(id)) return false;
          seen.add(id);
          return true;
        })
        .slice(0, 6);
    },
    qualityRadarSignals() {
      if (Array.isArray(this.quality?.signals)) {
        return this.quality.signals;
      }
      return Object.entries(this.quality?.checks || {}).map(([key, passing]) => ({
        key,
        label: key.replace(/([A-Z])/g, ' $1').replace(/^./, (s) => s.toUpperCase()),
        percentage: passing ? 100 : 0,
        value: passing ? 'Pass' : 'Gap',
        passing,
      }));
    },
    qualityTrendBars() {
      const scorePoints = this.governance.qualityRules.trend?.score_points || [];
      const profilePoints = this.governance.qualityRules.trend?.profile_points || [];
      const points = scorePoints.length
        ? scorePoints.map((point) => ({
            label: this.formatTrendTimestamp(point.generated_at),
            value: Number(point.overall_score || 0),
            metric: 'Score',
          }))
        : profilePoints.map((point) => ({
            label: this.formatTrendTimestamp(point.generated_at),
            value: Math.max(0, 100 - Number(point.average_null_percent || 0)),
            metric: 'Completeness',
          }));
      return points.slice(0, 12).reverse();
    },
    catalogHasLoadedObjects() {
      return Number(this.overview?.overview?.totalObjects || 0) > 0 || this.overviewRecentObjects.length > 0;
    },
    hasStaleDemoCatalogState() {
      return (
        !this.demoModeEnabled &&
        (this.isDemoCatalogSnapshot(this.objectList) || this.isDemoCatalogSnapshot(this.browseResults))
      );
    },
    browseCatalogStatusText() {
      if (this.browseLoading) {
        return 'Loading markdown catalog...';
      }
      if (this.browseSearchLoading) {
        return 'Searching markdown catalog...';
      }
      if (this.browseSearchSubmitted) {
        const total = this.browseSearchTotal ?? this.catalogBaseResults.length;
        const engine = this.browseSearchEngine || 'catalog';
        return `${total} match(es) from ${engine}`;
      }
      if (this.browseCatalogTotal !== null) {
        return `${this.browseCatalogTotal} markdown catalog object(s) loaded`;
      }
      return 'Catalog not loaded yet';
    },
    browseFacetOptions() {
      const source = this.catalogBaseResults || [];
      const normalizeType = (v) => {
        const t = String(v || '').toLowerCase();
        return t === 'storedprocedure' || t === 'procedure' ? 'storedProcedure' : t || 'unknown';
      };
      const sourceTypes = new Set(source.map((item) => item.type).filter(Boolean));
      const sourceDatabases = new Set(
        source.map((item) => item.database || item.schema).filter(Boolean)
      );

      const facetTypes = this.searchFacets?.types
        ? this.searchFacets.types.map((value) => normalizeType(value)).filter(Boolean)
        : Array.from(sourceTypes);
      const facetDatabases = this.searchFacets?.databases
        ? this.searchFacets.databases.filter(Boolean).map((database) => this.catalogDatabaseLabel(database))
        : Array.from(sourceDatabases).map((database) => this.catalogDatabaseLabel(database));

      return {
        types: [...new Set(facetTypes)].sort(),
        quality: ['gold', 'silver', 'bronze', 'unrated'],
        databases: [...new Set(facetDatabases)].sort(),
      };
    },
    filteredCatalogResults() {
      const query = String(this.browseQuery || '')
        .trim()
        .toLowerCase();
      const normalizeSearchText = (value) =>
        String(value || '')
          .toLowerCase()
          .replace(/[_./\\-]+/g, ' ')
          .replace(/[^a-z0-9]+/g, ' ')
          .replace(/\s+/g, ' ')
          .trim();
      const compactSearchText = (value) => normalizeSearchText(value).replace(/\s+/g, '');
      const normalizedQuery = normalizeSearchText(query);
      const compactQuery = compactSearchText(query);
      const selectedTypes = this.selectedFacetFilters.types || [];
      const selectedQuality = this.selectedFacetFilters.quality || [];
      const selectedDatabases = this.selectedFacetFilters.databases || [];

      const normalizeType = (value) => {
        const type = String(value || '').toLowerCase();
        if (type === 'storedprocedure' || type === 'procedure') return 'storedProcedure';
        return type || 'unknown';
      };

      const trustLevel = (item) => String(item?.trust_level || 'unrated').toLowerCase();
      const searchTerms = normalizedQuery.split(/\s+/).filter(Boolean);

      const matchesQuery = (item) => {
        if (!query) return true;
        if (this.browseSearchSubmitted) {
          return true;
        }

        const searchableText = [
          item.id,
          item.name,
          item.packageName,
          item.packagePath,
          item.database,
          item.schema,
          item.type,
          item.owner,
          item.sensitivity,
          item.description,
          ...(item.tags || []),
          ...(item.classifications || []),
        ]
          .filter((value) => value !== undefined && value !== null)
          .join(' ')
          .toLowerCase();

        const normalizedSearchableText = normalizeSearchText(searchableText);
        const compactSearchableText = compactSearchText(searchableText);
        const termMatch = searchTerms.every(
          (term) => normalizedSearchableText.includes(term) || searchableText.includes(term)
        );
        const compactMatch = compactQuery && compactSearchableText.includes(compactQuery);

        return termMatch || compactMatch;
      };

      const scoreResult = (item) => {
        const objectId = String(item.id || '').toLowerCase();
        const name = String(item.name || '').toLowerCase();
        const owner = String(item.owner || '').toLowerCase();
        const description = String(item.description || '').toLowerCase();
        const base = Number(item.score || 0);
        let score = base;

        if (!query) {
          score += 30;
        } else {
          if (objectId === query || name === query) score += 120;
          if (objectId.includes(query) || name.includes(query)) score += 40;
          if (compactSearchText(objectId).includes(compactQuery)) score += 35;
          if (compactSearchText(name).includes(compactQuery)) score += 35;
          if (owner.includes(query)) score += 18;
          if (description.includes(query)) score += 12;
        }

        const quality = trustLevel(item);
        if (quality === 'gold') score += 15;
        if (quality === 'silver') score += 8;
        if (quality === 'bronze') score -= 2;

        return score;
      };

      const filtered = (this.catalogBaseResults || []).filter((item) => {
        const itemType = normalizeType(item.type);
        const itemQuality = trustLevel(item);
        const itemDatabase = this.catalogDatabaseLabel(item.database || item.schema || '');

        const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(itemType);
        const qualityMatch = selectedQuality.length === 0 || selectedQuality.includes(itemQuality);
        const databaseMatch =
          selectedDatabases.length === 0 ||
          selectedDatabases.some((database) =>
            this.catalogDatabaseMatches(itemDatabase, database)
          );

        return typeMatch && qualityMatch && databaseMatch && matchesQuery(item);
      });

      const ranked = filtered
        .map((item, idx) => ({
          // Lineage ranking for relevant assets
          ...item,
          rankScore: scoreResult(item),
          rankIndex: idx + 1,
          trustLevel: trustLevel(item),
        }))
        .sort((first, second) => {
          if (this.browseSort === 'alphabetical') {
            return String(first.id || first.name || '').localeCompare(
              String(second.id || second.name || '')
            );
          }

          if (this.browseSort === 'quality') {
            const qualityWeight = { gold: 4, silver: 3, bronze: 2, unrated: 1 };
            const secondWeight = qualityWeight[second.trustLevel] || 0;
            const firstWeight = qualityWeight[first.trustLevel] || 0;
            const qualityDelta = secondWeight - firstWeight;
            if (qualityDelta !== 0) return qualityDelta;
          }

          if (this.browseSort === 'impact') {
            const secondImpact = Number(second.downstreamCount || second.reachScore || 0);
            const firstImpact = Number(first.downstreamCount || first.reachScore || 0);
            const impactDelta = secondImpact - firstImpact;
            if (impactDelta !== 0) return impactDelta;
          }

          return second.rankScore - first.rankScore;
        })
        .map((item, index) => ({
          ...item,
          resultRank: index + 1,
        }));

      return ranked;
    },
    browseFacetCounts() {
      const normalizeType = (value) => {
        const type = String(value || '').toLowerCase();
        if (type === 'storedprocedure' || type === 'procedure') return 'storedProcedure';
        return type || 'unknown';
      };

      const trustLevel = (item) => String(item?.trust_level || 'unrated').toLowerCase();

      const countByGroup = {
        types: {},
        quality: {},
        databases: {},
      };

      const source = this.catalogBaseResults || [];
      source.forEach((item) => {
        const type = normalizeType(item.type);
        const quality = trustLevel(item);
        const database = this.catalogDatabaseLabel(item.database || item.schema || 'unknown');

        countByGroup.types[type] = (countByGroup.types[type] || 0) + 1;
        countByGroup.quality[quality] = (countByGroup.quality[quality] || 0) + 1;
        countByGroup.databases[database] = (countByGroup.databases[database] || 0) + 1;
      });

      return countByGroup;
    },
    selectedDocTitle() {
      const match = (this.docsLibrary || []).find((item) => item.key === this.selectedDocKey);
      return match?.title || 'Help Center';
    },
    lineageStatusLabel(value) {
      const status = String(value || '').toLowerCase();
      if (status === 'creator_found') return 'Creator Found';
      if (status === 'source_external') return 'Source External';
      if (status === 'creator_unresolved') return 'Creator Unresolved';
      if (status === 'external_or_unresolved') return 'External or Unresolved';
      return value || 'Unresolved';
    },
    sqlServerDatabaseHint() {
      const sql = this.importer.sqlServer;
      if (sql.discoveringDatabases) {
        return 'Refreshing database list for the current server...';
      }
      if (sql.databaseDiscoveryError) {
        return `Database discovery failed: ${sql.databaseDiscoveryError}. You can type a database name manually.`;
      }
      if (!this.hasSqlServerDatabaseDiscoveryInputs()) {
        return 'Enter server and authentication details to refresh databases, or type a database name manually.';
      }
      if (sql.availableDatabases.length > 0) {
        return `${sql.availableDatabases.length} database(s) found for this server. Start typing to filter.`;
      }
      return 'Start typing to filter or enter a database name. The list refreshes when server settings change.';
    },
    sqlServerDatabaseHintColor() {
      const sql = this.importer.sqlServer;
      if (sql.databaseDiscoveryError) return '#b71c1c';
      if (sql.discoveringDatabases) return '#2563eb';
      if (sql.availableDatabases.length > 0) return '#166534';
      return '#666';
    },
  },
  watch: {
    browseQuery() {
      this.queueBrowseSearch();
    },
    'importer.sqlServer.server': 'handleSqlServerConnectionChange',
    'importer.sqlServer.port': 'handleSqlServerConnectionChange',
    'importer.sqlServer.authentication': 'handleSqlServerConnectionChange',
    'importer.sqlServer.useIntegratedAuth': 'handleSqlServerConnectionChange',
    'importer.sqlServer.username': 'handleSqlServerConnectionChange',
    'importer.sqlServer.password': 'handleSqlServerConnectionChange',
    'importer.sqlServer.domain': 'handleSqlServerConnectionChange',
    'importer.sqlServer.clientId': 'handleSqlServerConnectionChange',
    'importer.sqlServer.clientSecret': 'handleSqlServerConnectionChange',
    'importer.sqlServer.tenantId': 'handleSqlServerConnectionChange',
    'importer.sqlServer.encrypt': 'handleSqlServerConnectionChange',
    'importer.sqlServer.trustServerCertificate': 'handleSqlServerConnectionChange',
  },
  methods: {
    showToast(message) {
      this.toast.message = message;
      this.toast.show = true;
      setTimeout(() => {
        if (this.toast.message === message) {
          this.toast.show = false;
        }
      }, 3000);
    },
    makeUiErrorId() {
      return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
    },
    confluenceSummaryPreview(content) {
      return String(content || '')
        .split(/\r?\n/)
        .slice(0, 8)
        .join(' ');
    },
    normalizeApiError({ path, method, status, payload, fallbackMessage }) {
      const errorNode = payload?.errorInfo || payload?.error;
      const message =
        payload?.message ||
        (typeof errorNode === 'string' ? errorNode : errorNode?.message) ||
        (typeof payload?.error === 'string' ? payload.error : null) ||
        fallbackMessage ||
        `Request failed: ${status || 'network error'}`;

      return {
        id: this.makeUiErrorId(),
        timestamp: payload?.timestamp || errorNode?.timestamp || new Date().toISOString(),
        endpoint: path,
        method: String(method || 'GET').toUpperCase(),
        status: status || errorNode?.status || payload?.status || 0,
        code: payload?.code || errorNode?.code || 'API_ERROR',
        message,
        requestId: payload?.requestId || errorNode?.requestId || 'n/a',
        details: payload?.details || errorNode?.details || payload?.errors || null,
      };
    },
    recordApiError(entry) {
      this.apiErrors = [entry, ...this.apiErrors].slice(0, 50);
    },
    clearApiErrors() {
      this.apiErrors = [];
    },
    decodeTokenPayload(token) {
      if (!token || typeof token !== 'string') {
        return null;
      }

      const parts = token.split('.');
      if (parts.length < 2) {
        return null;
      }

      try {
        const encoded = parts[1].replace(/-/g, '+').replace(/_/g, '/');
        const padded = encoded.padEnd(encoded.length + ((4 - (encoded.length % 4)) % 4), '=');
        const decoded = atob(padded);
        return JSON.parse(decoded);
      } catch (_err) {
        return null;
      }
    },
    formatEpochSeconds(value) {
      const asNumber = Number(value || 0);
      if (!asNumber) {
        return 'Unavailable';
      }

      const asDate = new Date(asNumber * 1000);
      if (Number.isNaN(asDate.getTime())) {
        return 'Unavailable';
      }

      return asDate.toLocaleString();
    },
    maskToken(token) {
      if (!token) {
        return 'Unavailable';
      }

      if (token.length <= 16) {
        return '********';
      }

      return `${token.slice(0, 10)}...${token.slice(-8)}`;
    },
    async copyTextToClipboard(value, label) {
      if (!value) {
        this.showToast(`${label} is not available`);
        return;
      }

      try {
        await navigator.clipboard.writeText(value);
        this.showToast(`${label} copied`);
      } catch (_err) {
        this.showToast(`Unable to copy ${label.toLowerCase()}`);
      }
    },
    async refreshAccessTokenFromProfile() {
      if (!this.refreshToken || this.isRefreshingToken) {
        return;
      }

      this.isRefreshingToken = true;
      try {
        const payload = await this.api('/api/v1/auth/refresh', {
          method: 'POST',
          includeAuth: false,
          body: JSON.stringify({ refreshToken: this.refreshToken }),
        });

        if (payload?.token) {
          this.token = payload.token;
          localStorage.setItem('dg_token', this.token);
        }

        if (payload?.refreshToken) {
          this.refreshToken = payload.refreshToken;
          localStorage.setItem('dg_refresh', this.refreshToken);
        }

        if (payload?.user) {
          this.currentUser = payload.user;
          localStorage.setItem('dg_user', JSON.stringify(this.currentUser));
        }

        if (payload?.token || payload?.refreshToken) {
          this.showToast('Token refresh completed.');
          return;
        }

        this.showToast(payload?.message || 'Refresh endpoint responded without new token.');
      } catch (err) {
        this.showToast(`Token refresh failed: ${err.message}`);
      } finally {
        this.isRefreshingToken = false;
      }
    },
    setPersona(persona) {
      this.reports.persona = persona;
    },
    runPersonaQuickAction(item) {
      if (!item) {
        return;
      }

      if (item.action === 'workflow') {
        this.runRecommendedWorkflowAction();
        return;
      }

      if (item.view) {
        this.onViewChange(item.view);
      }
    },
    openCustomPrompt(title, message, fields) {
      return new Promise((resolve) => {
        this.promptDialog.title = title;
        this.promptDialog.message = message;
        this.promptDialog.fields = fields.map((f) => ({ ...f, value: '' }));
        this.promptDialog.resolve = resolve;
        this.promptDialog.show = true;
      });
    },
    submitCustomPrompt() {
      this.promptDialog.show = false;
      const result = this.promptDialog.fields.reduce((acc, field) => {
        acc[field.key] = field.value;
        return acc;
      }, {});
      if (this.promptDialog.resolve) this.promptDialog.resolve(result);
    },
    cancelCustomPrompt() {
      this.promptDialog.show = false;
      if (this.promptDialog.resolve) this.promptDialog.resolve(null);
    },
    toggleSidebar() {
      this.sidebarCollapsed = !this.sidebarCollapsed;
      localStorage.setItem('dg_sidebar_collapsed', String(this.sidebarCollapsed));
    },
    toggleMobileSidebar() {
      this.mobileSidebarOpen = !this.mobileSidebarOpen;
    },
    handleDrawerModelUpdate(value) {
      if (this.$vuetify.display.smAndDown) {
        this.mobileSidebarOpen = value;
      }
    },
    closeMobileSidebar() {
      this.mobileSidebarOpen = false;
    },
    setDemoMode(enabled, options = {}) {
      const shouldReload = options.reload !== false;
      this.demoModeEnabled = enabled;
      localStorage.setItem('dg_demo_mode', enabled ? 'on' : 'off');
      if (enabled && !this.hasRealData) {
        this.useDemoFallback('manual toggle');
      } else {
        this.clearDemoCatalogState();
        if (shouldReload) {
          this.bootstrapData();
        }
      }
    },
    isDemoCatalogSnapshot(items) {
      if (!Array.isArray(items) || items.length !== demoSnapshot.objects.length) {
        return false;
      }

      const demoIds = new Set(demoSnapshot.objects.map((item) => item.id));
      return items.every((item) => demoIds.has(item?.id));
    },
    clearDemoCatalogState() {
      if (this.isDemoCatalogSnapshot(this.objectList)) {
        this.objectList = [];
      }
      if (this.isDemoCatalogSnapshot(this.browseResults)) {
        this.browseResults = [];
      }
      this.browseSearchSubmitted = false;
      this.browseSearchWarning = '';
      this.browseSearchTotal = null;
      this.browseSearchEngine = '';
      if (!this.demoModeEnabled || this.hasRealData) {
        this.discoveryGraph = this.discoveryGraph === demoSnapshot.graph ? null : this.discoveryGraph;
      }
    },
    async refreshSessionToken() {
      if (this.authRefreshPromise) {
        return this.authRefreshPromise;
      }

      const email = this.currentUser?.email || this.email;
      if (!email) {
        throw new Error('No user email available for session refresh');
      }

      this.isRefreshingToken = true;
      this.authRefreshPromise = fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
        .then(async (response) => {
          const payload = await response.json();
          if (!response.ok || !payload.token) {
            throw new Error(payload?.message || `Session refresh failed (${response.status})`);
          }

          this.token = payload.token;
          this.refreshToken = payload.refreshToken || '';
          this.currentUser = payload.user || this.currentUser;
          this.demoModeEnabled = false;
          localStorage.setItem('dg_token', this.token);
          localStorage.setItem('dg_refresh', this.refreshToken);
          localStorage.setItem('dg_user', JSON.stringify(this.currentUser));
          localStorage.setItem('dg_demo_mode', 'off');
          this.clearDemoCatalogState();
          return this.token;
        })
        .finally(() => {
          this.isRefreshingToken = false;
          this.authRefreshPromise = null;
        });

      return this.authRefreshPromise;
    },
    clearLocalSession(reason = '') {
      this.token = '';
      this.refreshToken = '';
      this.currentUser = null;
      localStorage.removeItem('dg_token');
      localStorage.removeItem('dg_refresh');
      localStorage.removeItem('dg_user');
      if (reason) {
        this.showToast(reason);
      }
    },
    useDemoFallback(reason) {
      if (!this.demoModeEnabled || this.hasRealData) {
        return;
      }

      this.overview = demoSnapshot.overview;
      this.quality = demoSnapshot.quality;
      this.activity = demoSnapshot.activity;
      this.objectList = demoSnapshot.objects;
      this.browseResults = demoSnapshot.objects;
      this.browseCatalogTotal = demoSnapshot.objects.length;
      this.browseSearchEngine = 'demo';
      this.browseSearchTotal = demoSnapshot.objects.length;
      this.discoveryGraph = demoSnapshot.graph;
      this.impactData = {
        stats: {
          totalAffected: 2,
          directCount: 1,
          twoHopsCount: 1,
          threeOrMoreCount: 0,
        },
        levels: {
          direct: [{ id: 'finance.revenue_daily', name: 'revenue_daily' }],
          twoHops: [{ id: 'analytics.exec_kpi', name: 'exec_kpi' }],
          threeOrMore: [],
        },
      };
      this.matrixData = {
        database: 'sales',
        rows: ['orders', 'order_items', 'customers'],
        columns: ['orders', 'order_items', 'customers'],
        data: [
          [0, 1, 1],
          [0, 0, 1],
          [0, 0, 0],
        ],
      };

      this.showToast(`Demo mode active: ${reason}`);
    },
    async detectRealDataAvailability() {
      try {
        const status = await this.api('/api/v1/ingestion/status', { trackError: false });
        const loadedCount = status.data?.loadedObjectCount || 0;

        if (loadedCount > 0) {
          this.hasRealData = true;
          if (this.demoModeEnabled) {
            this.setDemoMode(false, { reload: false });
            this.showToast('Real data detected. Demo mode automatically disabled.');
          }
          return;
        }

        const dashboard = await this.api('/api/v1/discovery/dashboard', { trackError: false });
        const total = dashboard.data?.overview?.totalObjects || 0;
        if (total > 0) {
          this.hasRealData = true;
          if (this.demoModeEnabled) {
            this.setDemoMode(false, { reload: false });
            this.showToast('Discovery data detected. Demo mode automatically disabled.');
          }
        }
      } catch (_err) {
        this.hasRealData = false;
      }
    },
    async api(path, options = {}) {
      const {
        includeAuth = true,
        trackError = true,
        allowAuthRetry = true,
        ...fetchOptions
      } = options;

      const headers = {
        ...(includeAuth ? this.authHeader : {}),
        ...(fetchOptions.headers || {}),
      };

      if (
        !headers['Content-Type'] &&
        fetchOptions.body &&
        !(fetchOptions.body instanceof FormData)
      ) {
        headers['Content-Type'] = 'application/json';
      }

      let response;
      try {
        response = await fetch(path, {
          ...fetchOptions,
          headers,
        });
      } catch (err) {
        const entry = this.normalizeApiError({
          path,
          method: fetchOptions.method,
          status: 0,
          payload: null,
          fallbackMessage: err.message || 'Network request failed',
        });
        if (trackError) {
          this.recordApiError(entry);
        }
        const networkError = new Error(entry.message);
        Object.assign(networkError, entry);
        throw networkError;
      }

      const contentType = response.headers.get('content-type') || '';
      const isJson = contentType.includes('application/json');
      const payload = isJson ? await response.json() : null;

      if (
        response.status === 401 &&
        includeAuth &&
        allowAuthRetry &&
        !String(path).includes('/api/v1/auth/login')
      ) {
        try {
          await this.refreshSessionToken();
          return this.api(path, {
            includeAuth,
            trackError,
            allowAuthRetry: false,
            ...fetchOptions,
          });
        } catch (refreshErr) {
          this.clearLocalSession('Your saved session expired. Sign in again to continue.');
          const refreshError = new Error(refreshErr.message || 'Session refresh failed');
          Object.assign(refreshError, {
            path,
            method: fetchOptions.method || 'GET',
            status: 401,
            code: 'SESSION_EXPIRED',
          });
          throw refreshError;
        }
      }

      if (!response.ok) {
        const entry = this.normalizeApiError({
          path,
          method: fetchOptions.method,
          status: response.status,
          payload,
          fallbackMessage: `Request failed (${response.status})`,
        });
        if (trackError) {
          this.recordApiError(entry);
        }
        const requestError = new Error(entry.message);
        Object.assign(requestError, entry);
        throw requestError;
      }

      if (isJson) {
        return payload;
      }

      return response;
    },
    async login() {
      try {
        const payload = await this.api('/api/v1/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email: this.email }),
        });

        if (!payload.token) {
          throw new Error('No token returned by login endpoint');
        }

        this.token = payload.token;
        this.refreshToken = payload.refreshToken || '';
        this.currentUser = payload.user;
        this.demoModeEnabled = false;
        this.clearDemoCatalogState();

        localStorage.setItem('dg_token', this.token);
        localStorage.setItem('dg_refresh', this.refreshToken);
        localStorage.setItem('dg_user', JSON.stringify(this.currentUser));
        localStorage.setItem('dg_demo_mode', 'off');

        this.showToast(`Welcome ${this.currentUser?.name || this.currentUser?.email}`);
        await this.bootstrapData();
      } catch (err) {
        this.showToast(`Login failed: ${err.message}`);
      }
    },
    clearSessionState() {
      this.stopImportStatusPolling();
      this.token = '';
      this.refreshToken = '';
      this.currentUser = null;
      this.showProfileSecrets = false;
      this.apiErrors = [];
      localStorage.removeItem('dg_token');
      localStorage.removeItem('dg_refresh');
      localStorage.removeItem('dg_user');
    },
    async logout() {
      if (this.isLoggingOut) {
        return;
      }

      this.isLoggingOut = true;
      const { token } = this;
      this.clearSessionState();
      try {
        if (token) {
          this.api('/api/v1/auth/logout', {
            method: 'POST',
            trackError: false,
          }).catch(() => {
            // Logout is best-effort; local session has already been cleared.
          });
        }
      } catch (_err) {
        // Ignore logout endpoint failures and always clear local session
      } finally {
        this.isLoggingOut = false;
      }

      this.showToast('Logged out. Sign in again to get a fresh token.');
    },
    async bootstrapData() {
      if (this.bootstrapInProgress && this.bootstrapPromise) {
        return this.bootstrapPromise;
      }

      // Auto-enable demo mode if no real data or token issues
      if (!this.token || this.token === '') {
        try {
          await this.refreshSessionToken();
        } catch (_err) {
          if (this.demoModeEnabled) {
            this.setDemoMode(true, { reload: false });
          } else {
            this.clearDemoCatalogState();
            this.showToast('Sign in to load the markdown catalog.');
          }
          return;
        }
      }

      this.bootstrapInProgress = true;
      this.bootstrapPromise = (async () => {
        await this.detectRealDataAvailability();
        await Promise.allSettled([
          this.loadProfile(),
          this.loadHealth(),
          this.loadImportStatus(true),
        ]);
        await this.loadActiveViewData();
        this.startImportStatusPolling();
      })();

      try {
        await this.bootstrapPromise;
      } finally {
        this.bootstrapInProgress = false;
        this.bootstrapPromise = null;
      }
    },
    async loadActiveViewData(view = this.activeView) {
      if (view === 'browse') {
        await this.loadBrowse();
        return;
      }
      if (view === 'glossary') {
        await this.loadGlossary();
        return;
      }
      if (view === 'products') {
        await this.loadProductsCatalog();
        return;
      }
      if (view === 'governance') {
        await this.loadGovernanceSummary();
        return;
      }
      if (view === 'governanceOps') {
        await this.loadGovernanceOps();
        return;
      }
      if (view === 'metrics') {
        await this.loadMetricRegistry();
        return;
      }
      if (view === 'discovery') {
        await nextTick();
        this.renderGraph();
        await this.loadDiscovery();
        return;
      }
      if (view === 'reports') {
        await Promise.allSettled([
          this.loadSchedules(),
          this.loadMarketplaceRequests(),
        ]);
        this.buildBlastRadiusReport();
        await nextTick();
        this.renderBlastRadiusChart();
        return;
      }
      if (view === 'integrations') {
        await Promise.allSettled([
          this.loadIntegrations(),
          this.loadLinks(),
        ]);
        return;
      }
      if (view === 'scheduler') {
        await Promise.allSettled([
          this.loadManagedConnectors(),
          this.loadProfileSchedules(),
          this.loadProfileSchedulerStatus(),
        ]);
        return;
      }
      if (view === 'import') {
        await this.loadImportStatus(true);
        return;
      }
      if (view === 'docs') {
        await this.loadDocsLibrary();
        return;
      }
      if (view === 'admin') {
        await this.loadAdmin();
        return;
      }

      await this.loadOverview();
    },
    async loadMetricRegistry() {
      try {
        this.metrics.loading = true;
        const params = new URLSearchParams();
        if (this.metrics.query) params.set('q', this.metrics.query);
        params.set('limit', '100');
        const payload = await this.api(`/api/v1/metrics/registry?${params.toString()}`);
        this.metrics.registry = payload.data || null;
        if (!this.metrics.objectId && this.metrics.registry?.metrics?.length) {
          this.metrics.objectId = this.metrics.registry.metrics[0].object_id;
        }
        await this.loadMetricTableAnswer({ silent: true });
      } catch (err) {
        this.showToast(`Metric registry load failed: ${err.message}`);
      } finally {
        this.metrics.loading = false;
      }
    },
    async loadMetricTableAnswer({ silent = false } = {}) {
      if (!this.metrics.objectId) return;
      try {
        const payload = await this.api(
          `/api/v1/metrics/tables/${encodeURIComponent(this.metrics.objectId)}`
        );
        this.metrics.tableAnswer = payload.data || null;
        if (!this.metrics.selectedColumn && this.metrics.tableAnswer?.rows?.length) {
          this.metrics.selectedColumn = this.metrics.tableAnswer.rows[0].column;
        }
      } catch (err) {
        if (!silent) this.showToast(`Metric table answer failed: ${err.message}`);
      }
    },
    async explainSelectedMetric() {
      if (!this.metrics.objectId || !this.metrics.selectedColumn) {
        this.showToast('Choose a table and metric column first.');
        return;
      }
      try {
        const payload = await this.api('/api/v1/metrics/logic', {
          method: 'POST',
          body: JSON.stringify({
            object_id: this.metrics.objectId,
            column_name: this.metrics.selectedColumn,
          }),
        });
        this.metrics.logicAnswer = payload.data || null;
      } catch (err) {
        this.showToast(`Metric logic failed: ${err.message}`);
      }
    },
    async assessSelectedMetricImpact() {
      if (!this.metrics.objectId || !this.metrics.selectedColumn) {
        this.showToast('Choose a table and metric column first.');
        return;
      }
      try {
        const payload = await this.api('/api/v1/metrics/formula-impact', {
          method: 'POST',
          body: JSON.stringify({
            object_id: this.metrics.objectId,
            column_name: this.metrics.selectedColumn,
            change_type: 'change_data_type',
          }),
        });
        this.metrics.impactAnswer = payload.data || null;
      } catch (err) {
        this.showToast(`Metric impact failed: ${err.message}`);
      }
    },
    async loadSelectedMetricProfile() {
      if (!this.metrics.objectId || !this.metrics.selectedColumn) {
        this.showToast('Choose a table and metric column first.');
        return;
      }
      try {
        const payload = await this.api('/api/v1/metrics/profile', {
          method: 'POST',
          body: JSON.stringify({
            object_id: this.metrics.objectId,
            column_name: this.metrics.selectedColumn,
            freshness_days: 30,
          }),
        });
        this.metrics.profileAnswer = payload.data || null;
      } catch (err) {
        this.showToast(`Metric profile failed: ${err.message}`);
      }
    },
    profilingRequestPayload(overrides = {}) {
      return {
        asset_id: this.metrics.objectId,
        dialect: this.metrics.profiling.dialect,
        profile_mode: this.metrics.profiling.mode,
        execution_mode: this.metrics.profiling.executionMode,
        max_tables: Number(this.metrics.profiling.maxTables) || 1,
        max_columns_per_table: Number(this.metrics.profiling.maxColumns) || 40,
        sample_percent: Number(this.metrics.profiling.samplePercent) || 1,
        lock_timeout_ms: Number(this.metrics.profiling.lockTimeoutMs) || 5000,
        query_timeout_ms: Number(this.metrics.profiling.queryTimeoutMs) || 30000,
        ...overrides,
      };
    },
    async planMetricTableProfile() {
      if (!this.metrics.objectId) {
        this.showToast('Choose a table object first.');
        return;
      }
      try {
        this.metrics.profiling.loading = true;
        const payload = await this.api('/api/v1/profiling/plan', {
          method: 'POST',
          body: JSON.stringify(this.profilingRequestPayload()),
        });
        this.metrics.profiling.plan = payload.plan || null;
        this.metrics.profiling.answer = null;
        this.metrics.profiling.run = null;
        this.showToast('Profiling plan generated.');
      } catch (err) {
        this.showToast(`Profiling plan failed: ${err.message}`);
      } finally {
        this.metrics.profiling.loading = false;
      }
    },
    async runMetricTableProfile() {
      if (!this.metrics.objectId) {
        this.showToast('Choose a table object first.');
        return;
      }
      try {
        this.metrics.profiling.loading = true;
        const payload = await this.api('/api/v1/profiling/run', {
          method: 'POST',
          body: JSON.stringify(this.profilingRequestPayload()),
        });
        this.metrics.profiling.plan = payload.data?.plan || null;
        this.metrics.profiling.run = payload.data?.run || null;
        this.metrics.profiling.answer = payload.data?.answer || null;
        this.metrics.profiling.confluence = payload.data?.confluence || null;
        this.showToast('Profiling framework run completed.');
      } catch (err) {
        this.showToast(`Profiling run failed: ${err.message}`);
      } finally {
        this.metrics.profiling.loading = false;
      }
    },
    async loadMetricRuntimePack() {
      try {
        const payload = await this.api('/api/v1/metrics/runtime-pack?limit=25');
        this.metrics.runtimePack = payload.data || null;
        this.showToast('Metric runtime pack loaded.');
      } catch (err) {
        this.showToast(`Metric runtime pack failed: ${err.message}`);
      }
    },
    syncMarketplaceFormWithSelection() {
      const selected = this.selectedObjectDetail || {};
      const fallbackId = this.selectedObjectId || this.marketplace.form.assetId;
      this.marketplace.form.assetId = selected.id || fallbackId;
    },
    async submitMarketplaceAccessRequest() {
      this.syncMarketplaceFormWithSelection();

      if (!this.marketplace.form.assetId) {
        this.showToast('Select an asset before requesting access.');
        return;
      }

      try {
        this.marketplace.loading = true;
        await this.api('/api/v1/marketplace/requests', {
          method: 'POST',
          body: JSON.stringify({
            assetId: this.marketplace.form.assetId,
            requestedRole: this.marketplace.form.requestedRole,
            justification: this.marketplace.form.justification,
            approverId: this.marketplace.form.approverId || undefined,
            approverEmail: this.marketplace.form.approverEmail || undefined,
          }),
        });

        this.marketplace.form.justification = '';
        this.showToast('Access request submitted.');
        await this.loadMarketplaceRequests();
      } catch (err) {
        this.showToast(`Request submit failed: ${err.message}`);
      } finally {
        this.marketplace.loading = false;
      }
    },
    async loadMarketplaceRequests(forceScope) {
      const chosenScope = forceScope || this.marketplace.scope || 'mine';
      const scope = !this.isMarketplaceAdmin && chosenScope === 'all' ? 'mine' : chosenScope;
      this.marketplace.scope = scope;

      try {
        this.marketplace.loading = true;
        const payload = await this.api(
          `/api/v1/marketplace/requests?scope=${encodeURIComponent(scope)}`
        );
        this.marketplace.requests = payload.data?.requests || [];
      } catch (err) {
        this.showToast(`Marketplace load failed: ${err.message}`);
      } finally {
        this.marketplace.loading = false;
      }
    },
    canReviewMarketplaceRequest(requestItem) {
      if (this.isMarketplaceAdmin) {
        return true;
      }

      const approverId = requestItem?.approver?.userId;
      const currentUserId = this.currentUser?.id;
      return !!approverId && !!currentUserId && approverId === currentUserId;
    },
    async reviewMarketplaceRequest(requestItem, action) {
      if (!requestItem?.requestId) return;

      const result = await this.openCustomPrompt(
        'Review Request',
        `Action: ${action.replace('_', ' ')}`,
        [{ key: 'comment', label: 'Comment (optional)', type: 'textarea' }]
      );

      if (!result) return; // User clicked Cancel

      try {
        await this.api(
          `/api/v1/marketplace/requests/${encodeURIComponent(requestItem.requestId)}/review`,
          {
            method: 'POST',
            body: JSON.stringify({ action, comment: result.comment }),
          }
        );
        this.showToast(`Request moved to ${action}.`);
        await this.loadMarketplaceRequests();
      } catch (err) {
        this.showToast(`Review action failed: ${err.message}`);
      }
    },
    async fulfillMarketplaceRequest(requestItem) {
      if (!requestItem?.requestId) return;

      const result = await this.openCustomPrompt('Fulfill Request', 'Enter fulfillment details.', [
        { key: 'assignmentReference', label: 'Assignment reference (optional)', type: 'text' },
        { key: 'notes', label: 'Fulfillment notes (optional)', type: 'textarea' },
      ]);

      if (!result) return; // User clicked Cancel

      try {
        await this.api(
          `/api/v1/marketplace/requests/${encodeURIComponent(requestItem.requestId)}/fulfill`,
          {
            method: 'POST',
            body: JSON.stringify({
              assignmentReference: result.assignmentReference,
              notes: result.notes,
            }),
          }
        );
        this.showToast('Request fulfilled.');
        await this.loadMarketplaceRequests();
      } catch (err) {
        this.showToast(`Fulfillment failed: ${err.message}`);
      }
    },
    startImportStatusPolling() {
      if (this.importStatusPoller || !this.token) {
        return;
      }

      this.importStatusPoller = setInterval(async () => {
        if (!this.token || this.activeView !== 'import') {
          return;
        }
        await this.loadImportStatus(true);
      }, 10000);
    },
    stopImportStatusPolling() {
      if (this.importStatusPoller) {
        clearInterval(this.importStatusPoller);
        this.importStatusPoller = null;
      }
    },
    async runRecommendedWorkflowAction() {
      const next = this.recommendedWorkflowAction;
      if (
        next.key === 'discover' ||
        next.key === 'extract' ||
        next.key === 'validate' ||
        next.key === 'load'
      ) {
        this.activeView = 'import';
      }

      if (next.key === 'analyze') {
        this.activeView = 'reports';
        await this.refreshBlastRadiusReport();
        return;
      }

      if (next.key === 'complete') {
        this.activeView = 'reports';
        return;
      }

      this.showToast(`Next action: ${next.label}`);
    },
    async jumpToWorkflowStep(step) {
      this.activeView = step.view;
      if (step.key === 'analyze') {
        await this.refreshBlastRadiusReport();
      }
    },
    async loadHealth() {
      try {
        this.health = await this.api('/health', { includeAuth: false });
      } catch (err) {
        this.showToast(`Health check failed: ${err.message}`);
      }
    },
    async loadProfile() {
      try {
        const payload = await this.api('/api/v1/auth/me');
        this.currentUser = payload.user;
        localStorage.setItem('dg_user', JSON.stringify(this.currentUser));
      } catch (_err) {
        this.currentUser = this.currentUser || null;
      }
    },
    async loadOverview() {
      try {
        const [dashboard, quality, activity, recommendations, insights] = await Promise.all([
          this.api('/api/v1/discovery/dashboard'),
          this.api('/api/v1/discovery/quality'),
          this.api('/api/v1/discovery/activity'),
          this.api('/api/v1/discovery/recommendations'),
          this.api('/api/v1/discovery/insights'),
        ]);
        this.overview = dashboard.data;
        this.quality = quality.data;
        this.activity = activity.data;
        this.recommendations = recommendations.data;
        this.insights = insights.data;
        await nextTick();
        this.renderOverviewChart();
      } catch (err) {
        if (this.demoModeEnabled && !this.hasRealData) {
          this.useDemoFallback('overview endpoints unavailable');
          await nextTick();
          this.renderOverviewChart();
          return;
        }
        this.showToast(`Overview data unavailable: ${err.message}`);
      }
    },
    renderOverviewChart() {
      if (this.chartInstance) {
        try {
          this.chartInstance.destroy();
        } catch (_err) {
          // Chart.js can throw if Vue has already detached the canvas during view changes.
        }
        this.chartInstance = null;
      }
    },
    normalizeGraphData(rawGraphData) {
      if (!rawGraphData) {
        return { nodes: [], edges: [] };
      }

      const nodes = Array.isArray(rawGraphData.nodes) ? rawGraphData.nodes : [];
      const edges = Array.isArray(rawGraphData.edges) ? rawGraphData.edges : [];

      const normalizedNodes = nodes
        .map((node) => {
          const data = node?.data || {};
          const id = data.id || node.id;
          if (!id) {
            return null;
          }

          return {
            ...node,
            data: {
              ...data,
              id,
              label: data.label || id,
              type: (data.type || 'unknown').toLowerCase(),
            },
          };
        })
        .filter(Boolean);

      const normalizedEdges = edges
        .map((edge) => {
          const data = edge?.data || {};
          const source = data.source || edge.source;
          const target = data.target || edge.target;
          if (!source || !target) {
            return null;
          }

          const confidence = Number(data.confidence);
          return {
            ...edge,
            data: {
              ...data,
              source,
              target,
              confidence: Number.isFinite(confidence) ? confidence : 0.5,
            },
          };
        })
        .filter(Boolean);

      return {
        nodes: normalizedNodes,
        edges: normalizedEdges,
      };
    },
    buildBlastRadiusReport() {
      const normalized = this.normalizeGraphData(this.graphReportData || this.discoveryGraph?.data);
      const { nodes } = normalized;
      const { edges } = normalized;

      if (!nodes.length) {
        this.reports.blastRadius = null;
        this.reports.blastRows = [];
        this.reports.blastHeatmap = [];
        return;
      }

      const objectId = this.selectedObjectId;
      const nodeSet = new Set(nodes.map((node) => node.data.id));
      if (!nodeSet.has(objectId)) {
        this.reports.blastRadius = {
          selectedObjectId: objectId,
          directUpstream: 0,
          directDownstream: 0,
          impactedObjects: 0,
          maxDepth: 0,
        };
        this.reports.blastRows = [];
        this.reports.blastHeatmap = [];
        return;
      }

      const outAdj = new Map();
      const inAdj = new Map();
      nodes.forEach((node) => {
        outAdj.set(node.data.id, []);
        inAdj.set(node.data.id, []);
      });

      edges.forEach((edge) => {
        const { source } = edge.data;
        const { target } = edge.data;
        if (!outAdj.has(source)) outAdj.set(source, []);
        if (!inAdj.has(target)) inAdj.set(target, []);
        outAdj.get(source).push(target);
        inAdj.get(target).push(source);
      });

      const bfsDistances = (start, adjacency) => {
        const distances = new Map([[start, 0]]);
        const queue = [start];

        while (queue.length > 0) {
          const current = queue.shift();
          const currentDistance = distances.get(current);
          const neighbors = adjacency.get(current) || [];

          neighbors.forEach((neighbor) => {
            if (!distances.has(neighbor)) {
              distances.set(neighbor, currentDistance + 1);
              queue.push(neighbor);
            }
          });
        }

        return distances;
      };

      const downDistances = bfsDistances(objectId, outAdj);
      const upDistances = bfsDistances(objectId, inAdj);

      const rows = nodes
        .map((node) => {
          const { id } = node.data;
          if (id === objectId) {
            return null;
          }

          const downstreamDepth = downDistances.has(id) ? downDistances.get(id) : null;
          const upstreamDepth = upDistances.has(id) ? upDistances.get(id) : null;

          if (downstreamDepth === null && upstreamDepth === null) {
            return null;
          }

          const outDegree = (outAdj.get(id) || []).length;
          const inDegree = (inAdj.get(id) || []).length;
          const ddNull = downstreamDepth === null;
          const udNull = upstreamDepth === null;
          const downstreamWeight = ddNull ? 0 : Math.max(0, 6 - downstreamDepth) * 2;
          const upstreamWeight = udNull ? 0 : Math.max(0, 6 - upstreamDepth);
          const score = downstreamWeight + upstreamWeight + outDegree + inDegree;
          const minDepth = Math.min(
            downstreamDepth === null ? Number.MAX_SAFE_INTEGER : downstreamDepth,
            upstreamDepth === null ? Number.MAX_SAFE_INTEGER : upstreamDepth
          );

          let tier = 'T3+';
          if (minDepth <= 1) {
            tier = 'T1';
          } else if (minDepth <= 2) {
            tier = 'T2';
          }

          return {
            id,
            label: node.data.label || id,
            type: node.data.type || 'unknown',
            downstreamDepth,
            upstreamDepth,
            outDegree,
            inDegree,
            reachScore: score,
            tier,
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.reachScore - a.reachScore);

      const directDownstream = (outAdj.get(objectId) || []).length;
      const directUpstream = (inAdj.get(objectId) || []).length;
      const maxDepth = rows.reduce((max, row) => {
        const rowMax = Math.max(row.downstreamDepth || 0, row.upstreamDepth || 0);
        return Math.max(max, rowMax);
      }, 0);

      const typeByTier = new Map();
      rows.forEach((row) => {
        const key = `${row.tier}::${row.type}`;
        typeByTier.set(key, (typeByTier.get(key) || 0) + 1);
      });

      this.reports.blastHeatmap = Array.from(typeByTier.entries())
        .map(([key, count]) => {
          const [tier, type] = key.split('::');
          return { tier, type, count };
        })
        .sort((a, b) => b.count - a.count);

      this.reports.blastRadius = {
        selectedObjectId: objectId,
        directUpstream,
        directDownstream,
        impactedObjects: rows.length,
        maxDepth,
      };
      this.reports.blastRows = rows;
    },
    renderBlastRadiusChart() {
      const canvas = document.getElementById('blast-radius-chart');
      if (!canvas || !canvas.isConnected || !window.Chart || !this.reports.blastRows?.length) {
        return;
      }

      if (this.blastChartInstance) {
        try {
          this.blastChartInstance.destroy();
        } catch (_err) {
          // Chart.js can throw if Vue has already detached the canvas during view changes.
        }
        this.blastChartInstance = null;
      }

      const topRows = this.reports.blastRows.slice(0, 12);
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        return;
      }
      canvas.width = Math.max(320, canvas.clientWidth || canvas.parentElement?.clientWidth || 640);
      canvas.height = Math.max(240, canvas.clientHeight || canvas.parentElement?.clientHeight || 320);
      const blastGradient = ctx.createLinearGradient(0, 0, 420, 0);
      blastGradient.addColorStop(0, 'rgba(14, 165, 233, 0.92)');
      blastGradient.addColorStop(0.5, 'rgba(99, 102, 241, 0.86)');
      blastGradient.addColorStop(1, 'rgba(239, 68, 68, 0.88)');
      this.blastChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: topRows.map((row) => row.id),
          datasets: [
            {
              label: 'Upstream Extraction Velocity',
              data: topRows.map((row) =>
                row.upstreamDepth === null ? 0 : Math.max(0, 7 - row.upstreamDepth) * 10
              ),
              backgroundColor: 'rgba(56, 189, 248, 0.75)',
              borderColor: '#0ea5e9',
              borderWidth: 1,
              stack: 'blast',
              borderRadius: 10,
            },
            {
              label: 'Downstream Impact Footprint',
              data: topRows.map((row) =>
                row.downstreamDepth === null ? 0 : Math.max(0, 7 - row.downstreamDepth) * 12
              ),
              backgroundColor: blastGradient,
              borderColor: '#f97316',
              borderWidth: 1,
              stack: 'blast',
              borderRadius: 10,
            },
          ],
        },
        options: {
          responsive: false,
          maintainAspectRatio: false,
          indexAxis: 'y',
          interaction: {
            mode: 'index',
            intersect: false,
          },
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#cbd5e1',
              },
            },
            tooltip: {
              backgroundColor: 'rgba(15, 23, 42, 0.95)',
              titleColor: '#f8fafc',
              bodyColor: '#e2e8f0',
              borderColor: 'rgba(148, 163, 184, 0.35)',
              borderWidth: 1,
            },
          },
          scales: {
            x: {
              stacked: true,
              grid: {
                color: 'rgba(148, 163, 184, 0.12)',
              },
              ticks: {
                color: '#94a3b8',
              },
            },
            y: {
              stacked: true,
              grid: {
                color: 'rgba(148, 163, 184, 0.08)',
              },
              ticks: {
                color: '#cbd5e1',
              },
            },
          },
        },
      });
    },
    async refreshBlastRadiusReport() {
      this.buildBlastRadiusReport();
      await nextTick();
      this.renderBlastRadiusChart();
    },
    catalogDatabaseLabel(value) {
      const raw = String(value || '').trim();
      if (!raw) return raw;
      const key = raw.toLowerCase().replace(/[^a-z0-9]+/g, '');
      if (key === 'dbsonicdw' || key === 'sonicdw') return 'SONIC_DW';
      return raw;
    },
    catalogDatabaseMatches(actual, requested) {
      const normalize = (value) =>
        this.catalogDatabaseLabel(value)
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '');
      return normalize(actual) === normalize(requested);
    },
    setBrowseMode(mode) {
      this.browseMode = mode === 'browse' ? 'browse' : 'search';
      this.browseSearchWarning = '';
      this.browseSearchEngine = '';
      this.browseSearchTotal = null;
      if (this.browseMode === 'search') {
        this.selectedFacetFilters.databases = [];
        this.browseResults = [];
        this.browseSearchSubmitted = false;
      } else {
        this.browseQuery = '';
        this.browseResults = [];
        this.browseSearchSubmitted = false;
      }
    },
    async selectBrowseDatabase(database) {
      this.browseMode = 'browse';
      this.selectedFacetFilters = {
        ...this.selectedFacetFilters,
        databases: database ? [database] : [],
      };
      this.browseQuery = '';
      this.browseResults = [];
      this.browseSearchSubmitted = false;
      this.browseSearchWarning = '';
      this.browseSearchEngine = '';
      this.browseSearchTotal = null;
      if (!database) return;
      await this.loadBrowseDatabaseObjects(database);
    },
    async loadBrowseDatabaseObjects(database) {
      try {
        this.browseSearchLoading = true;
        const payload = await this.api(
          `/api/v1/objects?database=${encodeURIComponent(database)}&limit=500`
        );
        this.objectList = payload.data || [];
        this.browseSearchTotal = payload.pagination?.total ?? this.objectList.length;
      } catch (err) {
        this.browseLoadError = err.message;
        this.showToast(`Database browse failed: ${err.message}`);
      } finally {
        this.browseSearchLoading = false;
      }
    },
    async applyCatalogHelper(actionKey) {
      const resetSearch = () => {
        this.browseMode = 'search';
        this.browseResults = [];
        this.browseSearchSubmitted = false;
        this.browseSearchWarning = '';
        this.browseSearchEngine = '';
        this.browseSearchTotal = null;
      };

      if (actionKey === 'browse-database') {
        this.setBrowseMode('browse');
        return;
      }

      resetSearch();
      this.selectedFacetFilters = {
        types: [],
        quality: [],
        databases: [],
        owners: [],
        sensitivity: [],
        tags: [],
      };

      if (actionKey === 'find-table') {
        this.selectedFacetFilters.types = ['table'];
        this.browseQuery = '';
        return;
      }
      if (actionKey === 'find-column') {
        this.selectedFacetFilters.types = ['column'];
        this.browseQuery = '';
        return;
      }
      if (actionKey === 'find-pii') {
        this.selectedFacetFilters.sensitivity = ['confidential', 'restricted'];
        this.browseQuery = 'pii';
        await this.runSearch();
        return;
      }
      if (actionKey === 'find-metric') {
        this.browseQuery = 'metric measure amount count total revenue';
        await this.runSearch();
        return;
      }
      if (actionKey === 'needs-owner') {
        this.browseQuery = 'unassigned owner steward';
        await this.runSearch();
      }
    },
    hasBrowseSearchCriteria() {
      const hasQuery = String(this.browseQuery || '').trim().length > 0;
      const hasFilters = Object.values(this.selectedFacetFilters || {}).some(
        (values) => Array.isArray(values) && values.length > 0
      );
      return hasQuery || hasFilters;
    },
    captureBrowseSearchMetadata(search) {
      this.browseSearchSubmitted = this.hasBrowseSearchCriteria();
      this.browseSearchWarning = Array.isArray(search?.warnings) ? search.warnings[0] || '' : '';
    },
    queueBrowseSearch() {
      if (this.browseSearchDebounceTimer) {
        clearTimeout(this.browseSearchDebounceTimer);
        this.browseSearchDebounceTimer = null;
      }

      if (this.activeView !== 'browse') {
        return;
      }

      if (!this.hasBrowseSearchCriteria()) {
        this.browseResults = [];
        this.browseSearchSubmitted = false;
        this.browseSearchWarning = '';
        this.browseSearchEngine = '';
        this.browseSearchTotal = null;
        return;
      }

      this.browseSearchDebounceTimer = setTimeout(() => {
        this.browseSearchDebounceTimer = null;
        if (this.activeView === 'browse' && this.hasBrowseSearchCriteria()) {
          this.runSearch();
        }
      }, 350);
    },
    async loadBrowse() {
      this.browseLoading = true;
      this.browseLoadError = '';
      try {
        if (!this.demoModeEnabled || this.hasRealData) {
          this.clearDemoCatalogState();
        }

        const [objects, facets] = await Promise.all([
          this.api('/api/v1/objects?limit=100'),
          this.api('/api/v1/search/facets'),
        ]);

        this.objectList = objects.data || [];
        this.browseCatalogTotal = objects.pagination?.total ?? this.objectList.length;
        this.browseResults = [];
        this.browseSearchSubmitted = false;
        this.browseSearchWarning = '';
        this.browseSearchEngine = '';
        this.browseSearchTotal = null;
        this.searchFacets = facets.facets || null;
        await this.loadObjectContext();
      } catch (err) {
        if (this.demoModeEnabled && !this.hasRealData) {
          this.useDemoFallback('browse APIs unavailable');
          return;
        }
        this.browseLoadError = err.message;
        this.clearDemoCatalogState();
        this.showToast(`Browse load issue: ${err.message}`);
      } finally {
        this.browseLoading = false;
      }
    },
    async runSearch() {
      this.browseSearchLoading = true;
      this.browseLoadError = '';
      try {
        if (!this.demoModeEnabled || this.hasRealData) {
          this.clearDemoCatalogState();
        }

        if (this.browseSearchDebounceTimer) {
          clearTimeout(this.browseSearchDebounceTimer);
          this.browseSearchDebounceTimer = null;
        }

        if (!this.hasBrowseSearchCriteria()) {
          this.browseResults = [];
          this.browseSearchSubmitted = false;
          this.browseSearchWarning = '';
          this.browseSearchEngine = '';
          this.browseSearchTotal = null;
          return;
        }

        const requestId = ++this.browseSearchRequestId;
        const database = encodeURIComponent(this.selectedFacetFilters.databases.join(','));
        const type = encodeURIComponent(this.selectedFacetFilters.types.join(','));
        const owner = encodeURIComponent((this.selectedFacetFilters.owners || []).join(','));
        const sensitivity = encodeURIComponent((this.selectedFacetFilters.sensitivity || []).join(','));
        const tags = encodeURIComponent((this.selectedFacetFilters.tags || []).join(','));
        const quality = encodeURIComponent((this.selectedFacetFilters.quality || []).join(','));
        const search = await this.api(
          `/api/v1/search?q=${encodeURIComponent(this.browseQuery)}&limit=50&database=${database}&type=${type}&owner=${owner}&sensitivity=${sensitivity}&tags=${tags}&trust_level=${quality}`
        );
        if (requestId !== this.browseSearchRequestId) {
          return;
        }
        this.browseResults = search.results || [];
        this.browseSearchEngine = search.searchEngine || 'catalog';
        this.browseSearchTotal = search.pagination?.total ?? this.browseResults.length;
        this.captureBrowseSearchMetadata(search);
      } catch (err) {
        if (this.demoModeEnabled && !this.hasRealData) {
          this.browseResults = demoSnapshot.objects.filter((item) =>
            item.id.includes(this.browseQuery)
          );
          this.browseSearchSubmitted = this.hasBrowseSearchCriteria();
          this.browseSearchWarning = '';
          this.browseSearchEngine = 'demo';
          this.browseSearchTotal = this.browseResults.length;
          return;
        }
        this.browseLoadError = err.message;
        this.clearDemoCatalogState();
        this.showToast(`Search failed: ${err.message}`);
      } finally {
        this.browseSearchLoading = false;
      }
    },
    browseTreeRoots() {
      const items = this.filteredCatalogResults || [];
      const roots = new Map();
      items.forEach((item) => {
        const parts = String(item.id || '').split('.');
        const server = parts.length > 3 ? parts[0] : item.server || 'local';
        const database = this.catalogDatabaseLabel(item.database || parts[0] || 'default');
        const schema = item.schema || parts[Math.max(0, parts.length - 2)] || 'dbo';
        const key = `${server}.${database}.${schema}`;
        if (!roots.has(key)) {
          roots.set(key, []);
        }
        roots.get(key).push(item);
      });
      return Array.from(roots.entries()).map(([key, children]) => ({ key, children }));
    },
    toggleBrowseFacet(group, value) {
      if (!this.selectedFacetFilters[group]) {
        return;
      }

      const existing = this.selectedFacetFilters[group];
      if (existing.includes(value)) {
        this.selectedFacetFilters[group] = existing.filter((item) => item !== value);
      } else {
        this.selectedFacetFilters[group] = [...existing, value];
      }
      if (this.browseMode === 'browse') {
        return;
      }
      this.queueBrowseSearch();
    },
    async clearBrowseFacets() {
      this.selectedFacetFilters = {
        types: [],
        quality: [],
        databases: [],
        owners: [],
        sensitivity: [],
        tags: [],
      };
      this.browseSort = 'relevance';
      this.browseQuery = '';
      this.browseMode = 'search';
      this.browseResults = [];
      this.browseSearchSubmitted = false;
      this.browseSearchWarning = '';
      this.browseSearchEngine = '';
      this.browseSearchTotal = null;
      this.browseLoadError = '';
      this.browseSearchRequestId += 1;

      if (this.demoModeEnabled && !this.hasRealData) {
        this.objectList = demoSnapshot.objects;
        this.browseResults = demoSnapshot.objects;
        this.browseCatalogTotal = demoSnapshot.objects.length;
        return;
      }

      if (this.token) {
        await this.loadBrowse();
      }
    },
    formatSettingValue(value) {
      if (typeof value === 'boolean') {
        return value ? 'Enabled' : 'Disabled';
      }
      if (typeof value === 'number') {
        return value.toLocaleString();
      }
      if (typeof value === 'string') {
        return value;
      }
      if (Array.isArray(value)) {
        return `${value.length} configured`;
      }
      if (value && typeof value === 'object') {
        if (value.status) {
          return String(value.status);
        }
        return `${Object.keys(value).length} fields configured`;
      }
      return 'n/a';
    },
    formatAuditDetails(details) {
      if (!details || typeof details !== 'object') {
        return '-';
      }
      return Object.entries(details)
        .slice(0, 3)
        .map(([key, value]) => `${key}: ${String(value)}`)
        .join(' · ');
    },
    formatTimestamp(value) {
      if (!value) return '-';
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return String(value);
      return parsed.toLocaleString();
    },
    csvFromValue(value) {
      if (Array.isArray(value)) {
        return value.filter(Boolean).join(', ');
      }
      return String(value || '');
    },
    async loadDocsLibrary() {
      this.docsLoading = true;
      try {
        const payload = await this.api('/api/v1/docs/library');
        this.docsLibrary = payload.data?.documents || [];
        if (!this.docsLibrary.find((item) => item.key === this.selectedDocKey)) {
          this.selectedDocKey = this.docsLibrary[0]?.key || 'help-center';
        }
        await this.loadSelectedDoc();
      } catch (err) {
        this.showToast(`Docs load failed: ${err.message}`);
      } finally {
        this.docsLoading = false;
      }
    },
    async loadSelectedDoc() {
      if (!this.selectedDocKey) {
        return;
      }

      try {
        const payload = await this.api(
          `/api/v1/docs/library/${encodeURIComponent(this.selectedDocKey)}`
        );
        this.selectedDoc = payload.data || null;
      } catch (err) {
        this.showToast(`Document open failed: ${err.message}`);
      }
    },
    openDocByKey(key) {
      this.selectedDocKey = key;
      this.loadSelectedDoc();
    },
    renderDocHtml(markdown) {
      if (!markdown) {
        return '<p>No documentation content available.</p>';
      }
      if (window.marked && typeof window.marked.parse === 'function') {
        return window.marked.parse(markdown);
      }
      return markdown
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br/>');
    },
    async loadObjectContext() {
      // Guard clause: Stop if no object is selected
      if (!this.selectedObjectId) {
        this.selectedObjectDetail = null;
        this.selectedObjectGovernance = null;
        this.selectedObjectPiiPolicy = null;
        this.selectedObjectColumnSemantics = null;
        this.selectedObjectDictionary = null;
        return;
      }

      try {
        const [detail, upstream, downstream, impact, governanceContext, piiPolicy, columnSemantics, dictionary] = await Promise.all([
          this.api(`/api/v1/objects/${encodeURIComponent(this.selectedObjectId)}`),
          this.api(
            `/api/v1/lineage/${encodeURIComponent(this.selectedObjectId)}/upstream?depth=${this.discoveryDepth}`
          ),
          this.api(
            `/api/v1/lineage/${encodeURIComponent(this.selectedObjectId)}/downstream?depth=${this.discoveryDepth}`
          ),
          this.api(`/api/v1/lineage/${encodeURIComponent(this.selectedObjectId)}/impact`),
          this.api(`/api/v1/governance/context/${encodeURIComponent(this.selectedObjectId)}`),
          this.api(`/api/v1/classification/pii/${encodeURIComponent(this.selectedObjectId)}`),
          this.api(`/api/v1/classification/columns/${encodeURIComponent(this.selectedObjectId)}/semantics`),
          this.api(`/api/v1/dictionary/${encodeURIComponent(this.selectedObjectId)}`),
        ]);

        this.selectedObjectDetail = detail.data || null;
        this.selectedObjectGovernance = governanceContext.context || null;
        this.selectedObjectPiiPolicy = piiPolicy.pii_policy || null;
        this.selectedObjectColumnSemantics = columnSemantics.semantics || null;
        this.selectedObjectDictionary = dictionary.data || null;
        this.editableObjectMetadata = {
          description: detail.data?.description || '',
          owner: detail.data?.owner || '',
          steward: detail.data?.steward || '',
          domain_manager: detail.data?.domain_manager || '',
          custodian: detail.data?.custodian || '',
          sensitivity: detail.data?.sensitivity || 'public',
          tags: this.csvFromValue(detail.data?.tags),
          business_domain: detail.data?.business_domain || detail.data?.domain || '',
          business_justification: detail.data?.business_justification || '',
          business_processes: this.csvFromValue(detail.data?.business_processes || detail.data?.business_process),
          use_cases: this.csvFromValue(detail.data?.use_cases),
          documentation_links: this.csvFromValue(detail.data?.documentation_links || detail.data?.links),
          related_dashboards: this.csvFromValue(detail.data?.related_dashboards || detail.data?.dashboards),
        };
        this.lineageRaw = {
          upstream,
          downstream,
          impact,
        };
        this.syncMarketplaceFormWithSelection();
      } catch (_err) {
        this.selectedObjectDetail = null;
        this.selectedObjectGovernance = null;
        this.selectedObjectPiiPolicy = null;
        this.selectedObjectColumnSemantics = null;
        this.selectedObjectDictionary = null;
      }
    },
    saveSelectedObjectMetadata() {
      if (!this.selectedObjectId) {
        this.showToast('Select an object first.');
        return Promise.resolve();
      }

      const bodyPayload = {
        ...this.editableObjectMetadata,
        tags: String(this.editableObjectMetadata.tags || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        business_processes: String(this.editableObjectMetadata.business_processes || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        use_cases: String(this.editableObjectMetadata.use_cases || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        documentation_links: String(this.editableObjectMetadata.documentation_links || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        related_dashboards: String(this.editableObjectMetadata.related_dashboards || '')
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      return this.api(`/api/v1/objects/${encodeURIComponent(this.selectedObjectId)}`, {
          method: 'PUT',
          body: JSON.stringify(bodyPayload),
        })
        .then(async () => {
          this.showToast('Metadata updated successfully');
          await this.loadObjectContext();
          await this.loadBrowse();
        })
        .catch((err) => {
          this.showToast(`Metadata update failed: ${err.message}`);
        });
    },
    downloadObjectDictionary() {
      if (!this.selectedObjectId) {
        this.showToast('Select an object first.');
        return;
      }
      const encodedId = encodeURIComponent(this.selectedObjectId);
      this.downloadProtected(
        `/api/v1/dictionary/${encodedId}/export.md`,
        `${this.selectedObjectId}-dictionary.md`
      );
    },
    async loadGlossary() {
      try {
        const [termsPayload, domainsPayload] = await Promise.all([
          this.api(
            `/api/v1/glossary${this.glossary.query ? `?q=${encodeURIComponent(this.glossary.query)}` : ''}`
          ),
          this.api('/api/v1/glossary/domains'),
        ]);

        this.glossary.terms = termsPayload.terms || [];
        this.glossary.domains = domainsPayload.domains || [];
        if (this.glossary.terms.length > 0) {
          const [firstTerm] = this.glossary.terms;
          const selectedStillVisible = this.glossary.terms.some(
            (term) => term.slug === this.glossary.selected?.slug
          );
          await this.openGlossaryTerm(selectedStillVisible ? this.glossary.selected.slug : firstTerm.slug);
        } else {
          this.glossary.selected = null;
        }
      } catch (err) {
        this.showToast(`Glossary load failed: ${err.message}`);
      }
    },
    async openGlossaryTerm(slug) {
      try {
        const payload = await this.api(`/api/v1/glossary/${encodeURIComponent(slug)}`);
        this.glossary.selected = payload.term || null;
        this.glossary.newMapping.asset_id = '';
        this.glossary.newMapping.notes = '';
        this.glossary.assetSearchResults = [];
      } catch (err) {
        this.showToast(`Glossary term load failed: ${err.message}`);
      }
    },
    glossaryArrayField(value = '') {
      return String(value || '')
        .split(/[|,;]/)
        .map((item) => item.trim())
        .filter(Boolean);
    },
    startGlossaryCreate() {
      this.glossary.editMode = 'create';
      this.glossary.editing = true;
      this.glossary.editor = {
        term: '',
        domain: this.glossary.domains[0] || 'General',
        status: 'draft',
        owner: '',
        business_owner: '',
        steward: '',
        parent: '',
        synonyms: '',
        related_terms: '',
        tags: '',
        definition: '',
      };
    },
    startGlossaryEdit() {
      if (!this.glossary.selected) {
        this.showToast('Select a glossary term first.');
        return;
      }

      const selected = this.glossary.selected;
      this.glossary.editMode = 'edit';
      this.glossary.editing = true;
      this.glossary.editor = {
        term: selected.term || '',
        domain: selected.domain || 'General',
        status: selected.status || 'draft',
        owner: selected.owner || '',
        business_owner: selected.business_owner || '',
        steward: selected.steward || '',
        parent: selected.parent || '',
        synonyms: (selected.synonyms || []).join(', '),
        related_terms: (selected.related_terms || []).join(', '),
        tags: (selected.tags || []).join(', '),
        definition: selected.definition || '',
      };
    },
    cancelGlossaryEdit() {
      this.glossary.editing = false;
    },
    async saveGlossaryTerm() {
      const editor = this.glossary.editor;
      if (!editor.term.trim()) {
        this.showToast('Term name is required.');
        return;
      }
      if (!editor.definition.trim()) {
        this.showToast('Definition is required.');
        return;
      }

      const payload = {
        ...editor,
        term: editor.term.trim(),
        definition: editor.definition.trim(),
        synonyms: this.glossaryArrayField(editor.synonyms),
        related_terms: this.glossaryArrayField(editor.related_terms),
        tags: this.glossaryArrayField(editor.tags),
      };

      try {
        const isEdit = this.glossary.editMode === 'edit' && this.glossary.selected?.slug;
        const response = await this.api(
          isEdit
            ? `/api/v1/glossary/${encodeURIComponent(this.glossary.selected.slug)}`
            : '/api/v1/glossary',
          {
            method: isEdit ? 'PUT' : 'POST',
            body: JSON.stringify(payload),
          }
        );
        this.glossary.selected = response.term || null;
        this.glossary.editing = false;
        await this.loadGlossary();
        this.showToast(isEdit ? 'Glossary term updated.' : 'Glossary term created.');
      } catch (err) {
        this.showToast(`Glossary save failed: ${err.message}`);
      }
    },
    async deleteGlossaryTerm() {
      if (!this.glossary.selected?.slug) {
        this.showToast('Select a glossary term first.');
        return;
      }

      try {
        await this.api(`/api/v1/glossary/${encodeURIComponent(this.glossary.selected.slug)}`, {
          method: 'DELETE',
        });
        this.glossary.selected = null;
        this.glossary.editing = false;
        await this.loadGlossary();
        this.showToast('Glossary term deleted.');
      } catch (err) {
        this.showToast(`Glossary delete failed: ${err.message}`);
      }
    },
    async searchGlossaryMappingAssets() {
      const query = String(this.glossary.assetSearchQuery || '').trim();
      if (!query) {
        this.glossary.assetSearchResults = [];
        return;
      }

      this.glossary.assetSearchLoading = true;
      try {
        const payload = await this.api(`/api/v1/search?q=${encodeURIComponent(query)}&limit=8`);
        this.glossary.assetSearchResults = payload.results || [];
      } catch (err) {
        this.showToast(`Asset search failed: ${err.message}`);
      } finally {
        this.glossary.assetSearchLoading = false;
      }
    },
    chooseGlossaryMappingAsset(asset) {
      this.glossary.newMapping.asset_id = asset.id || asset.asset_id || asset.name || '';
      this.glossary.newMapping.type = asset.type || 'asset';
    },
    async resolveGlossarySemanticQuery() {
      if (!this.glossary.semanticQuery.trim()) {
        this.showToast('Enter a business term or synonym to resolve.');
        return;
      }

      try {
        const payload = await this.api(
          `/api/v1/glossary/resolve?q=${encodeURIComponent(this.glossary.semanticQuery)}`
        );
        this.glossary.semanticResolution = payload.resolution || null;
      } catch (err) {
        this.showToast(`Semantic resolution failed: ${err.message}`);
      }
    },
    async linkGlossaryAsset() {
      if (!this.glossary.selected?.slug) {
        this.showToast('Select a glossary term first.');
        return;
      }
      if (!this.glossary.newMapping.asset_id.trim()) {
        this.showToast('Enter an asset id to link.');
        return;
      }

      try {
        const payload = await this.api(
          `/api/v1/glossary/${encodeURIComponent(this.glossary.selected.slug)}/assets`,
          {
            method: 'POST',
            body: JSON.stringify({
              ...this.glossary.newMapping,
              asset_id: this.glossary.newMapping.asset_id.trim(),
            }),
          }
        );
        this.glossary.selected = payload.term || this.glossary.selected;
        this.glossary.newMapping.asset_id = '';
        this.glossary.newMapping.notes = '';
        this.showToast('Glossary mapping saved.');
        await this.loadGlossary();
      } catch (err) {
        this.showToast(`Glossary mapping failed: ${err.message}`);
      }
    },
    async loadGovernanceSummary() {
      try {
        const optionalApi = (url, fallback) => this.api(url).catch(() => fallback);
        const [
          summaryPayload,
          healthPayload,
          taxonomyPayload,
          classificationSummary,
          policyEffectivenessPayload,
        ] = await Promise.all([
          optionalApi('/api/v1/governance/summary', { summaries: [] }),
          optionalApi('/api/v1/governance/health', null),
          optionalApi('/api/v1/classification/taxonomy', { taxonomy: null }),
          optionalApi('/api/v1/classification/summary', null),
          optionalApi('/api/v1/classification/policies/effectiveness', { report: null }),
        ]);

        this.governance.summaries = summaryPayload.summaries || [];
        this.governance.health = healthPayload || null;
        this.governance.classification.taxonomy = taxonomyPayload.taxonomy || null;
        this.governance.classification.summary = classificationSummary || null;
        this.governance.classification.policyEffectiveness =
          policyEffectivenessPayload.report || null;
        if (!this.governance.classification.selectedCategoryId) {
          this.startClassificationCategoryCreate();
        }
        if (!this.governance.classification.selectedRuleId) {
          this.startClassificationRuleCreate();
        }
        await this.loadQualityRulesPanel();
      } catch (err) {
        this.showToast(`Governance summary load failed: ${err.message}`);
      }
    },
    async loadGovernanceOps() {
      try {
        this.governanceOps.loading = true;
        const [
          overview,
          tasks,
          incidents,
          usage,
          publication,
          storeStatus,
          eventDeliveries,
          ownershipModel,
          ownershipSummary,
          stewardPortfolio,
        ] = await Promise.all([
          this.api('/api/v1/governance-ops/overview'),
          this.api('/api/v1/governance-ops/tasks'),
          this.api('/api/v1/governance-ops/incidents'),
          this.api('/api/v1/governance-ops/usage/analytics'),
          this.api('/api/v1/governance-ops/publication/status'),
          this.api('/api/v1/governance-ops/store/status').catch(() => ({ data: null })),
          this.api('/api/v1/governance-ops/events/deliveries').catch(() => ({ data: { deliveries: [] } })),
          this.api('/api/v1/governance-ops/ownership/model').catch(() => ({ data: { roles: [] } })),
          this.api('/api/v1/governance-ops/ownership/summary').catch(() => ({ data: null })),
          this.api(`/api/v1/governance-ops/ownership/portfolio?subject=${encodeURIComponent(this.governanceOps.portfolioSubject || 'all')}`).catch(() => ({ data: null })),
        ]);
        this.governanceOps.overview = overview.data || null;
        this.governanceOps.ownershipModel = ownershipModel.data?.roles || [];
        this.governanceOps.ownershipSummary = ownershipSummary.data || overview.data?.ownership || null;
        this.governanceOps.stewardPortfolio = stewardPortfolio.data || overview.data?.stewardPortfolio || null;
        this.governanceOps.tasks = tasks.data?.tasks || [];
        this.governanceOps.incidents = incidents.data?.incidents || [];
        this.governanceOps.usage = usage.data || null;
        this.governanceOps.publication = publication.data || null;
        this.governanceOps.storeStatus = storeStatus.data || null;
        this.governanceOps.eventDeliveries = eventDeliveries.data?.deliveries || [];
      } catch (err) {
        this.showToast(`Governance Ops load failed: ${err.message}`);
      } finally {
        this.governanceOps.loading = false;
      }
    },
    async generateGovernanceTasks() {
      try {
        this.governanceOps.loading = true;
        const payload = await this.api('/api/v1/governance-ops/tasks/generate', {
          method: 'POST',
          body: JSON.stringify({ limit: 100 }),
        });
        this.showToast(`Generated ${payload.data?.count || 0} stewardship task(s).`);
        await this.loadGovernanceOps();
      } catch (err) {
        this.showToast(`Task generation failed: ${err.message}`);
      } finally {
        this.governanceOps.loading = false;
      }
    },
    async loadStewardPortfolio() {
      try {
        this.governanceOps.loading = true;
        const payload = await this.api(`/api/v1/governance-ops/ownership/portfolio?subject=${encodeURIComponent(this.governanceOps.portfolioSubject || 'all')}`);
        this.governanceOps.stewardPortfolio = payload.data || null;
      } catch (err) {
        this.showToast(`Portfolio load failed: ${err.message}`);
      } finally {
        this.governanceOps.loading = false;
      }
    },
    async planBulkOwnershipAssignment() {
      try {
        this.governanceOps.loading = true;
        const payload = await this.api('/api/v1/governance-ops/ownership/bulk-assignment-plan', {
          method: 'POST',
          body: JSON.stringify({
            assetIds: String(this.governanceOps.bulkAssetIds || '')
              .split(',')
              .map((value) => value.trim())
              .filter(Boolean),
            owner: this.governanceOps.bulkOwner || undefined,
            steward: this.governanceOps.bulkSteward || undefined,
            domain_manager: this.governanceOps.bulkDomainManager || undefined,
            custodian: this.governanceOps.bulkCustodian || undefined,
          }),
        });
        this.governanceOps.bulkAssignmentPlan = payload.data || null;
        this.showToast(`Planned ownership assignment for ${payload.data?.count || 0} asset(s).`);
        await this.loadGovernanceOps();
      } catch (err) {
        this.showToast(`Ownership assignment plan failed: ${err.message}`);
      } finally {
        this.governanceOps.loading = false;
      }
    },
    async createGovernanceOpsTask() {
      try {
        await this.api('/api/v1/governance-ops/tasks', {
          method: 'POST',
          body: JSON.stringify({
            assetId: this.governanceOps.taskAssetId,
            title: this.governanceOps.taskTitle,
            priority: 'medium',
            type: 'stewardship',
          }),
        });
        this.showToast('Governance task created.');
        await this.loadGovernanceOps();
      } catch (err) {
        this.showToast(`Task create failed: ${err.message}`);
      }
    },
    async transitionGovernanceOpsTask(task, status) {
      if (!task?.taskId) return;
      try {
        await this.api(`/api/v1/governance-ops/tasks/${encodeURIComponent(task.taskId)}/transition`, {
          method: 'POST',
          body: JSON.stringify({ status }),
        });
        await this.loadGovernanceOps();
      } catch (err) {
        this.showToast(`Task update failed: ${err.message}`);
      }
    },
    async transitionGovernanceIncident(incident, status) {
      if (!incident?.incidentId) return;
      try {
        await this.api(
          `/api/v1/governance-ops/incidents/${encodeURIComponent(incident.incidentId)}/transition`,
          {
            method: 'POST',
            body: JSON.stringify({ status }),
          }
        );
        await this.loadGovernanceOps();
      } catch (err) {
        this.showToast(`Incident update failed: ${err.message}`);
      }
    },
    async createGovernanceIncident() {
      try {
        await this.api('/api/v1/governance-ops/incidents', {
          method: 'POST',
          body: JSON.stringify({
            assetId: this.governanceOps.incidentAssetId,
            title: this.governanceOps.incidentTitle,
            severity: 'medium',
          }),
        });
        this.showToast('Governance incident created.');
        await this.loadGovernanceOps();
      } catch (err) {
        this.showToast(`Incident create failed: ${err.message}`);
      }
    },
    async askGovernanceOpsContext() {
      try {
        const payload = await this.api('/api/v1/governance-ops/context/query', {
          method: 'POST',
          body: JSON.stringify({ query: this.governanceOps.contextQuery }),
        });
        this.governanceOps.contextAnswer = payload.data || null;
      } catch (err) {
        this.showToast(`Context query failed: ${err.message}`);
      }
    },
    async recordPublicationCheck(name, status) {
      try {
        await this.api(`/api/v1/governance-ops/publication/checks/${encodeURIComponent(name)}`, {
          method: 'POST',
          body: JSON.stringify({ status, detail: `Marked ${status} from Governance Ops UI.` }),
        });
        await this.loadGovernanceOps();
      } catch (err) {
        this.showToast(`Publication check failed: ${err.message}`);
      }
    },
    formatTrendTimestamp(value) {
      if (!value) return 'n/a';
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return String(value);
      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
    },
    qualityScoreForItem(item) {
      const raw =
        item?.quality_score ??
        item?.qualityScore ??
        item?.quality?.score ??
        item?.scorecard?.overall_score ??
        item?.trust_score ??
        item?.trust?.score;
      const score = Number(raw);
      return Number.isFinite(score) ? Math.round(score) : null;
    },
    qualityScoreColor(score) {
      const value = Number(score);
      if (!Number.isFinite(value)) return 'blue-grey-lighten-4';
      if (value >= 85) return 'success';
      if (value >= 70) return 'info';
      if (value >= 50) return 'warning';
      return 'error';
    },
    qualityTrendLabel(item) {
      const trend =
        item?.quality_trend ??
        item?.qualityTrend ??
        item?.quality?.trend ??
        item?.scorecard?.trend;
      if (typeof trend === 'number') {
        if (trend > 0) return `+${trend}`;
        if (trend < 0) return String(trend);
        return 'flat';
      }
      return trend || 'baseline';
    },
    thresholdFromQualityEditor() {
      const editor = this.governance.qualityRules.editor;
      const threshold = {};
      if (editor.threshold_min !== '') threshold.min = Number(editor.threshold_min);
      if (editor.threshold_max !== '') threshold.max = Number(editor.threshold_max);
      if (editor.threshold_min_percent !== '') {
        threshold.min_percent = Number(editor.threshold_min_percent);
      }
      if (editor.threshold_min_match_percent !== '') {
        threshold.min_match_percent = Number(editor.threshold_min_match_percent);
      }
      return threshold;
    },
    startQualityRuleCreate() {
      this.governance.qualityRules.selectedRuleId = '';
      this.governance.qualityRules.editor = {
        id: '',
        name: '',
        asset_id: '*',
        column_name: '',
        type: 'null_percent',
        severity: 'warning',
        threshold_min: '',
        threshold_max: '5',
        threshold_min_percent: '',
        threshold_min_match_percent: '',
        schedule: '',
        alert_routes: '',
        enabled: true,
      };
    },
    editQualityRule(rule) {
      if (!rule) return;
      const threshold = rule.threshold || {};
      this.governance.qualityRules.selectedRuleId = rule.id || '';
      this.governance.qualityRules.editor = {
        id: rule.id || '',
        name: rule.name || '',
        asset_id: rule.asset_id || '*',
        column_name: rule.column_name || '',
        type: rule.type || 'null_percent',
        severity: rule.severity || 'warning',
        threshold_min: threshold.min ?? '',
        threshold_max: threshold.max ?? threshold.max_percent ?? '',
        threshold_min_percent: threshold.min_percent ?? '',
        threshold_min_match_percent: threshold.min_match_percent ?? '',
        schedule: rule.schedule || '',
        alert_routes: (rule.alert_routes || []).join(', '),
        enabled: rule.enabled !== false,
      };
    },
    qualityRuleTypeLabel(type) {
      return String(type || '').replace(/_/g, ' ');
    },
    async loadQualityRulesPanel() {
      try {
        const [rules, executions, incidents] = await Promise.all([
          this.api('/api/v1/quality/rules'),
          this.api('/api/v1/quality/executions'),
          this.api('/api/v1/quality/incidents'),
        ]);
        this.governance.qualityRules.rules = rules.rules || [];
        this.governance.qualityRules.executions = executions.executions || [];
        this.governance.qualityRules.incidents = incidents.incidents || [];
        if (!this.governance.qualityRules.selectedRuleId) {
          this.startQualityRuleCreate();
        }
      } catch (err) {
        this.showToast(`Quality rules load failed: ${err.message}`);
      }
    },
    async saveQualityRule() {
      const editor = this.governance.qualityRules.editor;
      if (!editor.name.trim()) {
        this.showToast('Quality rule name is required.');
        return;
      }
      try {
        this.governance.qualityRules.loading = true;
        await this.api('/api/v1/quality/rules', {
          method: 'POST',
          body: JSON.stringify({
            id: editor.id || undefined,
            name: editor.name.trim(),
            asset_id: editor.asset_id || '*',
            column_name: editor.column_name.trim(),
            type: editor.type,
            severity: editor.severity,
            threshold: this.thresholdFromQualityEditor(),
            schedule: editor.schedule.trim() || null,
            alert_routes: this.classificationArrayField(editor.alert_routes),
            enabled: editor.enabled,
          }),
        });
        this.showToast('Quality rule saved.');
        await this.loadQualityRulesPanel();
      } catch (err) {
        this.showToast(`Quality rule save failed: ${err.message}`);
      } finally {
        this.governance.qualityRules.loading = false;
      }
    },
    async deleteQualityRule(rule = null) {
      const target = rule || this.governance.qualityRules.rules.find(
        (item) => item.id === this.governance.qualityRules.selectedRuleId
      );
      if (!target?.id) {
        this.showToast('Select a quality rule to delete.');
        return;
      }
      try {
        await this.api(`/api/v1/quality/rules/${encodeURIComponent(target.id)}`, {
          method: 'DELETE',
        });
        this.showToast('Quality rule deleted.');
        this.startQualityRuleCreate();
        await this.loadQualityRulesPanel();
      } catch (err) {
        this.showToast(`Quality rule delete failed: ${err.message}`);
      }
    },
    profilePayloadFromQualityRunner() {
      const profile = this.governance.qualityRules.runProfile;
      if (!profile.asset_id || !profile.column_name) return {};
      const columnStats = {};
      ['row_count', 'null_count', 'distinct_count', 'min', 'max', 'pattern_match_percent'].forEach(
        (key) => {
          if (profile[key] !== '') columnStats[key] = Number(profile[key]);
        }
      );
      return {
        profiles: {
          [profile.asset_id]: {
            columns: {
              [profile.column_name]: columnStats,
            },
          },
        },
      };
    },
    profileForQualityScorecard() {
      const profile = this.governance.qualityRules.runProfile;
      if (!profile.asset_id || !profile.column_name) return {};
      const columnStats = {};
      ['row_count', 'null_count', 'distinct_count', 'min', 'max', 'pattern_match_percent'].forEach(
        (key) => {
          if (profile[key] !== '') columnStats[key] = Number(profile[key]);
        }
      );
      return {
        asset_id: profile.asset_id,
        row_count: profile.row_count !== '' ? Number(profile.row_count) : undefined,
        columns: {
          [profile.column_name]: columnStats,
        },
      };
    },
    async buildQualityScorecard() {
      const profile = this.profileForQualityScorecard();
      if (!profile.asset_id) {
        this.showToast('Enter a profile asset and column first.');
        return null;
      }
      try {
        this.governance.qualityRules.loading = true;
        const payload = await this.api('/api/v1/quality/scorecard', {
          method: 'POST',
          body: JSON.stringify({ profile }),
        });
        this.governance.qualityRules.scorecard = payload.scorecard || null;
        await this.loadQualityTrend(profile.asset_id);
        this.showToast(`Quality scorecard built for ${profile.asset_id}.`);
        return payload.scorecard || null;
      } catch (err) {
        this.showToast(`Quality scorecard failed: ${err.message}`);
        return null;
      } finally {
        this.governance.qualityRules.loading = false;
      }
    },
    async exportQualityScorecard(format = 'json') {
      let scorecard = this.governance.qualityRules.scorecard;
      if (!scorecard) {
        scorecard = await this.buildQualityScorecard();
      }
      if (!scorecard) return;
      try {
        const payload = await this.api('/api/v1/quality/scorecard/export', {
          method: 'POST',
          body: JSON.stringify({ scorecard, format }),
        });
        this.governance.qualityRules.scorecardExport = payload.export || null;
        this.showToast(`Quality scorecard export ready (${payload.export?.content_type || format}).`);
      } catch (err) {
        this.showToast(`Scorecard export failed: ${err.message}`);
      }
    },
    async loadQualityTrend(assetId = '') {
      const target = assetId || this.governance.qualityRules.runProfile.asset_id;
      if (!target) {
        this.showToast('Enter an asset ID to load quality trend.');
        return;
      }
      try {
        const payload = await this.api(`/api/v1/quality/profiles/${encodeURIComponent(target)}/trend`);
        this.governance.qualityRules.trend = payload.trend || null;
      } catch (err) {
        this.showToast(`Quality trend load failed: ${err.message}`);
      }
    },
    async runQualityValidation() {
      try {
        this.governance.qualityRules.loading = true;
        const payload = await this.api('/api/v1/quality/run', {
          method: 'POST',
          body: JSON.stringify(this.profilePayloadFromQualityRunner()),
        });
        this.governance.qualityRules.executions = [
          payload.execution,
          ...this.governance.qualityRules.executions.filter((item) => item.id !== payload.execution.id),
        ];
        await this.buildQualityScorecard();
        await this.loadQualityRulesPanel();
        this.showToast(`Quality validation ${payload.execution.status}: ${payload.execution.failed} issue(s).`);
      } catch (err) {
        this.showToast(`Quality validation failed: ${err.message}`);
      } finally {
        this.governance.qualityRules.loading = false;
      }
    },
    classificationArrayField(value) {
      return String(value || '')
        .split(/[\n,]+/)
        .map((item) => item.trim())
        .filter(Boolean);
    },
    startClassificationCategoryCreate() {
      this.governance.classification.selectedCategoryId = '';
      this.governance.classification.categoryEditor = {
        id: '',
        label: '',
        parent: '',
        level: 1,
        description: '',
        regulatory_frameworks: '',
        name_patterns: '',
        sensitivity_triggers: '',
        tag_triggers: '',
      };
    },
    editClassificationCategory(category) {
      if (!category) return;
      this.governance.classification.selectedCategoryId = category.id || '';
      this.governance.classification.categoryEditor = {
        id: category.id || '',
        label: category.label || '',
        parent: category.parent || '',
        level: category.level || 1,
        description: category.description || '',
        regulatory_frameworks: (category.regulatory_frameworks || []).join(', '),
        name_patterns: (category.name_patterns || []).join('\n'),
        sensitivity_triggers: (category.sensitivity_triggers || []).join(', '),
        tag_triggers: (category.tag_triggers || []).join(', '),
      };
    },
    async saveClassificationCategory() {
      const editor = this.governance.classification.categoryEditor;
      if (!editor.label.trim()) {
        this.showToast('Classification category label is required.');
        return;
      }

      try {
        const payload = {
          ...editor,
          label: editor.label.trim(),
          parent: editor.parent.trim() || null,
          level: Number(editor.level) || 1,
          regulatory_frameworks: this.classificationArrayField(editor.regulatory_frameworks),
          name_patterns: this.classificationArrayField(editor.name_patterns),
          sensitivity_triggers: this.classificationArrayField(editor.sensitivity_triggers),
          tag_triggers: this.classificationArrayField(editor.tag_triggers),
        };
        const response = await this.api('/api/v1/classification/taxonomy/categories', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        this.governance.classification.taxonomy = response.taxonomy || null;
        this.governance.classification.selectedCategoryId =
          payload.id || payload.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        this.showToast('Classification category saved.');
      } catch (err) {
        this.showToast(`Category save failed: ${err.message}`);
      }
    },
    async deleteClassificationCategory(category) {
      if (!category?.id) {
        this.showToast('Select a custom category to delete.');
        return;
      }
      if (category.built_in) {
        this.showToast('Built-in categories cannot be deleted.');
        return;
      }

      try {
        const response = await this.api(
          `/api/v1/classification/taxonomy/categories/${encodeURIComponent(category.id)}`,
          { method: 'DELETE' }
        );
        this.governance.classification.taxonomy = response.taxonomy || null;
        this.startClassificationCategoryCreate();
        this.showToast('Classification category deleted.');
      } catch (err) {
        this.showToast(`Category delete failed: ${err.message}`);
      }
    },
    startClassificationRuleCreate() {
      this.governance.classification.selectedRuleId = '';
      this.governance.classification.ruleEditor = {
        id: '',
        label: '',
        target: 'column',
        classification: 'PII',
        pattern: '',
        min_column_hits: '',
        confidence: 0.8,
        enabled: true,
        description: '',
      };
    },
    editClassificationRule(rule) {
      if (!rule) return;
      this.governance.classification.selectedRuleId = rule.id || '';
      this.governance.classification.ruleEditor = {
        id: rule.id || '',
        label: rule.label || '',
        target: rule.target || 'asset',
        classification: rule.classification || '',
        pattern: rule.pattern || '',
        min_column_hits: rule.min_column_hits || '',
        confidence: rule.confidence || 0.8,
        enabled: rule.enabled !== false,
        description: rule.description || '',
      };
    },
    async saveClassificationRule() {
      const editor = this.governance.classification.ruleEditor;
      if (!editor.label.trim() || !editor.classification.trim() || !editor.pattern.trim()) {
        this.showToast('Rule name, classification, and pattern are required.');
        return;
      }

      try {
        const payload = {
          ...editor,
          label: editor.label.trim(),
          classification: editor.classification.trim(),
          pattern: editor.pattern.trim(),
          confidence: Number(editor.confidence) || 0.75,
          min_column_hits: editor.min_column_hits ? Number(editor.min_column_hits) : null,
        };
        const response = await this.api('/api/v1/classification/rules', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        this.governance.classification.taxonomy = response.taxonomy || null;
        this.governance.classification.selectedRuleId =
          payload.id || payload.label.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        this.showToast('Classification rule saved.');
      } catch (err) {
        this.showToast(`Rule save failed: ${err.message}`);
      }
    },
    async deleteClassificationRule(rule) {
      if (!rule?.id) {
        this.showToast('Select a rule to delete.');
        return;
      }

      try {
        const response = await this.api(`/api/v1/classification/rules/${encodeURIComponent(rule.id)}`, {
          method: 'DELETE',
        });
        this.governance.classification.taxonomy = response.taxonomy || null;
        this.startClassificationRuleCreate();
        this.showToast('Classification rule deleted.');
      } catch (err) {
        this.showToast(`Rule delete failed: ${err.message}`);
      }
    },
    async runClassificationRules() {
      try {
        this.governance.classification.loading = true;
        const payload = await this.api('/api/v1/classification/run', {
          method: 'POST',
          body: JSON.stringify({ limit: 100 }),
        });
        this.governance.classification.run = payload;
        this.showToast(`Classification rules evaluated ${payload.evaluated_assets || 0} assets.`);
        await this.loadGovernanceSummary();
      } catch (err) {
        this.showToast(`Classification run failed: ${err.message}`);
      } finally {
        this.governance.classification.loading = false;
      }
    },
    async loadProductsCatalog() {
      try {
        const payload = await this.api('/api/v1/products');
        this.productsCatalog.products = payload.products || [];
        if (!this.productsCatalog.selected && this.productsCatalog.products.length > 0) {
          const [firstProduct] = this.productsCatalog.products;
          this.productsCatalog.selected = firstProduct;
        }
      } catch (err) {
        this.showToast(`Products load failed: ${err.message}`);
      }
    },
    async searchLineageObjects(query = this.lineageObjectSearch.query || this.selectedObjectId) {
      const searchText = String(query || '').trim();
      this.lineageObjectSearch.query = searchText;

      if (!searchText) {
        this.lineageObjectSearch.results = [];
        this.lineageObjectSearch.open = false;
        return;
      }

      try {
        this.lineageObjectSearch.loading = true;
        const payload = await this.api(
          `/api/v1/search?q=${encodeURIComponent(searchText)}&limit=12`
        );
        this.lineageObjectSearch.results = (payload.results || []).map((item) => ({
          id: item.id || item.asset_id || item.name,
          name: item.name || item.id,
          database: item.database || item.schema || '',
          type: item.type || 'object',
          description: item.description || '',
        }));
        this.lineageObjectSearch.open = this.lineageObjectSearch.results.length > 0;
      } catch (err) {
        this.lineageObjectSearch.results = [];
        this.lineageObjectSearch.open = false;
        this.showToast(`Lineage object search failed: ${err.message}`);
      } finally {
        this.lineageObjectSearch.loading = false;
      }
    },
    chooseLineageObject(item) {
      if (!item?.id) return;
      this.selectedObjectId = item.id;
      this.lineageObjectSearch.query = item.id;
      this.lineageObjectSearch.open = false;
      if (item.database) {
        this.matrixDatabase = item.database;
      } else if (item.id.includes('.')) {
        const parts = item.id.split('.');
        this.matrixDatabase = (parts.length >= 4 ? parts[1] : parts[0]) || this.matrixDatabase;
      }
    },
    chooseExactLineageObjectMatch() {
      const query = String(this.lineageObjectSearch.query || '').trim().toLowerCase();
      if (!query) return false;
      const exact = this.lineageObjectSearch.results.find(
        (item) => String(item.id || '').toLowerCase() === query
      );
      if (!exact) return false;
      this.chooseLineageObject(exact);
      return true;
    },
    async renderSelectedLineage() {
      if (!this.selectedObjectId && this.lineageObjectSearch.results.length === 1) {
        this.chooseLineageObject(this.lineageObjectSearch.results[0]);
      }
      if (!this.selectedObjectId) {
        this.chooseExactLineageObjectMatch();
      }
      if (!this.selectedObjectId && this.lineageObjectSearch.query) {
        await this.searchLineageObjects(this.lineageObjectSearch.query);
        if (this.chooseExactLineageObjectMatch()) {
          // Exact typed object id selected.
        } else if (this.lineageObjectSearch.results.length === 1) {
          this.chooseLineageObject(this.lineageObjectSearch.results[0]);
        }
      }
      if (!this.selectedObjectId) {
        this.showToast('Choose a catalog object before rendering lineage.');
        return;
      }
      await this.loadDiscovery();
    },
    async runBlastRadiusAnalysis() {
      if (!this.selectedObjectId && this.lineageObjectSearch.query) {
        await this.renderSelectedLineage();
      }
      if (!this.selectedObjectId) {
        const matchCount = this.lineageObjectSearch.results?.length || 0;
        this.lineageObjectSearch.open = matchCount > 0;
        this.reports.blastRadiusStatus = matchCount
          ? `Choose one of the ${matchCount} matching catalog objects, then run Blast Radius.`
          : 'Choose a catalog object before running blast radius.';
        this.showToast(this.reports.blastRadiusStatus);
        return;
      }

      this.reports.blastRadiusLoading = true;
      this.reports.blastRadiusStatus = `Analyzing impact for ${this.selectedObjectId}...`;

      try {
        if (!this.discoveryGraph || !this.graphReportData) {
          await this.loadDiscovery();
        } else {
          this.buildBlastRadiusReport();
          await nextTick();
          this.renderBlastRadiusChart();
        }

        const impactedCount = this.reports.blastRows?.length || 0;
        const downstreamCount = this.reports.blastRadius?.directDownstream || 0;
        this.reports.blastRadiusStatus = impactedCount
          ? `Blast radius ready: ${impactedCount} impacted object${impactedCount === 1 ? '' : 's'} found, including ${downstreamCount} direct downstream object${downstreamCount === 1 ? '' : 's'}.`
          : `Blast radius complete: no downstream impact objects were found for ${this.selectedObjectId}.`;
        this.showToast(this.reports.blastRadiusStatus);
        await this.scrollToBlastRadiusResults();
      } catch (err) {
        this.reports.blastRadiusStatus = `Blast radius failed: ${err.message}`;
        this.showToast(this.reports.blastRadiusStatus);
      } finally {
        this.reports.blastRadiusLoading = false;
      }
    },
    async scrollToBlastRadiusResults() {
      await nextTick();
      const target = this.$refs.impactSummaryCard?.$el || this.$refs.impactSummaryCard;
      if (target?.scrollIntoView) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
    async loadDiscovery() {
      // Guard clause: Stop if no object is selected
      if (!this.selectedObjectId) {
        this.discoveryGraph = null;
        this.graphReportData = null;
        this.impactData = null;
        this.lineageAnswer = null;
        return;
      }

      try {
        if (!this.lineageObjectSearch.query) {
          this.lineageObjectSearch.query = this.selectedObjectId;
        }
        const graphFormat = String(this.discoveryFormat || 'cytoscape').toLowerCase();
        const reportGraphFormat = graphFormat === 'centered' ? 'centered' : 'cytoscape';
        const requests = [
          this.api(
            `/api/v1/discovery/graph/${encodeURIComponent(this.selectedObjectId)}?format=${graphFormat}&depth=${this.discoveryDepth}`
          ),
          this.api(`/api/v1/discovery/impact/${encodeURIComponent(this.selectedObjectId)}`),
          this.api(`/api/v1/discovery/matrix/${encodeURIComponent(this.matrixDatabase)}`),
        ];

        if (graphFormat !== reportGraphFormat) {
          requests.push(
            this.api(
              `/api/v1/discovery/graph/${encodeURIComponent(this.selectedObjectId)}?format=${reportGraphFormat}&depth=${this.discoveryDepth}`
            )
          );
        }

        const [graph, impact, matrix, reportGraph] = await Promise.all(requests);

        this.discoveryGraph = graph;
        this.graphReportData =
          graphFormat === reportGraphFormat ? graph.data : reportGraph?.data || null;
        this.impactData = impact.data;
        this.matrixData = matrix.data;
        if (!this.matrixDatabase && this.selectedObjectId.includes('.')) {
          const [databaseName] = this.selectedObjectId.split('.');
          this.matrixDatabase = databaseName;
        }
        await Promise.all([this.loadObjectContext(), this.loadLineageAnswer()]);
        this.buildBlastRadiusReport();

        await nextTick();
        this.renderGraph();
        if (this.graphFocusDialog.show) {
          this.renderGraph('cy-graph-focus', 'mermaid-graph-focus');
        }
        this.renderBlastRadiusChart();
      } catch (err) {
        if (this.demoModeEnabled && !this.hasRealData) {
          this.useDemoFallback('discovery APIs unavailable');
          await nextTick();
          this.renderGraph();
          return;
        }
        this.showToast(`Discovery load issue: ${err.message}`);
      }
    },
    async loadLineageAnswer() {
      if (!this.selectedObjectId) {
        this.lineageAnswer = null;
        return;
      }

      this.lineageAnswerLoading = true;
      try {
        const requests = [
          this.api(
            `/api/v1/discovery/lineage-answer/${encodeURIComponent(this.selectedObjectId)}?intent=${encodeURIComponent(this.lineageAnswerIntent)}`
          ),
        ];
        if (!this.lineageHelp) {
          requests.push(this.api('/api/v1/discovery/lineage-help'));
        }

        const [answerPayload, helpPayload] = await Promise.all(requests);
        this.lineageAnswer = answerPayload.data || null;
        if (helpPayload) {
          this.lineageHelp = helpPayload.data || null;
        }
      } catch (err) {
        this.lineageAnswer = null;
        this.showToast(`Lineage answer load failed: ${err.message}`);
      } finally {
        this.lineageAnswerLoading = false;
      }
    },
    async askLineageQuestion(question = this.lineageQuestion) {
      const trimmedQuestion = String(question || '').trim();
      if (!trimmedQuestion) {
        this.showToast('Type a lineage question first.');
        return;
      }

      this.lineageQuestion = trimmedQuestion;
      this.lineageQuestionLoading = true;
      const requestId = `lineage-user-${Date.now()}`;
      this.lineageAssistantMessages.push({
        id: requestId,
        role: 'user',
        text: trimmedQuestion,
      });
      try {
        const payload = await this.api('/api/v1/discovery/lineage-question', {
          method: 'POST',
          body: JSON.stringify({ question: trimmedQuestion }),
        });
        this.lineageQuestionAnswer = payload.data || null;
        this.lineageAssistantMessages.push({
          id: `lineage-assistant-${Date.now()}`,
          role: 'assistant',
          title: this.lineageQuestionAnswer?.assistant?.title || 'Lineage Answer',
          text: this.lineageQuestionAnswer?.assistant?.message || this.lineageQuestionAnswer?.plain_english || '',
          answer: this.lineageQuestionAnswer,
        });
        this.lineageQuestionHistory = [
          trimmedQuestion,
          ...this.lineageQuestionHistory.filter((item) => item !== trimmedQuestion),
        ].slice(0, 6);

        if (this.lineageQuestionAnswer?.resolved_object?.object_id) {
          this.selectedObjectId = this.lineageQuestionAnswer.resolved_object.object_id;
          this.lineageAnswer = this.lineageQuestionAnswer;
        }
      } catch (err) {
        this.lineageQuestionAnswer = null;
        this.lineageAssistantMessages.push({
          id: `lineage-error-${Date.now()}`,
          role: 'assistant',
          title: 'I hit a snag',
          text: err.message,
          answer: null,
        });
        this.showToast(`Lineage question failed: ${err.message}`);
      } finally {
        this.lineageQuestionLoading = false;
      }
    },
    clearLineageAssistant() {
      this.lineageQuestionAnswer = null;
      this.lineageAssistantMessages = [
        {
          id: 'welcome',
          role: 'assistant',
          title: 'Sonic Lineage Assistant',
          text: 'Ask me about lineage, catalog counts, SSIS load paths, or where an object is used. I will answer in plain English and show the technical objects behind the answer.',
          answer: null,
        },
      ];
    },
    lineageQuestionRows(answer = null) {
      if (!answer) return [];
      if (answer.table?.rows?.length) return answer.table.rows;
      return answer.impacted_objects || [];
    },
    lineageQuestionColumns(answer = null) {
      if (!answer) return [];
      if (answer.table?.columns?.length) return answer.table.columns;
      if (answer.impacted_objects?.length) return ['Role', 'Object', 'Type', 'Location'];
      return [];
    },
    lineageQuestionCell(row = {}, column = '') {
      const key = String(column || '').toLowerCase().replace(/[^a-z0-9]+/g, '_').replace(/^_|_$/g, '');
      const aliases = {
        objects: 'object_count',
        tables: 'table_count',
        views: 'view_count',
        procedures: 'procedure_count',
        packages: 'package_count',
        what_it_answers: 'description',
        example: 'prompt',
        object: 'label',
        where: 'location',
      };
      return row[key] ?? row[aliases[key]] ?? row[column] ?? '';
    },
    lineageAnswerRoleGroups(answer = this.lineageQuestionAnswer) {
      const rows = answer?.impacted_objects || [];
      if (!rows.length) return [];

      const groups = [
        {
          title: 'Business Consumers',
          match: (row) => String(row.role || '').toLowerCase().includes('business consumer'),
        },
        {
          title: 'Maintenance / Load-Path Reads',
          match: (row) => String(row.role || '').toLowerCase().includes('maintenance'),
        },
        {
          title: 'Load Orchestration',
          match: (row) => /orchestrates|loads target/i.test(String(row.role || '')),
        },
        {
          title: 'Upstream Sources & Lookups',
          match: (row) => /source input|lookup/i.test(String(row.role || '')),
        },
      ];

      const matched = new Set();
      const built = groups
        .map((group) => {
          const groupRows = rows.filter((row, index) => {
            const isMatch = group.match(row);
            if (isMatch) matched.add(index);
            return isMatch;
          });
          return { title: group.title, rows: groupRows };
        })
        .filter((group) => group.rows.length);

      const otherRows = rows.filter((_row, index) => !matched.has(index));
      if (otherRows.length) {
        built.push({ title: 'Other Related Objects', rows: otherRows });
      }

      return built;
    },
    lineageAnswerTableColumns(answer = this.lineageQuestionAnswer) {
      if (!answer) return [];
      if (answer.impacted_objects?.length) return ['Role', 'Object', 'Type', 'Location'];
      return answer.table?.columns || [];
    },
    async loadEdgeAudit() {
      if (!this.selectedObjectId) {
        this.showToast('Select an object first.');
        return;
      }

      try {
        const payload = await this.api(
          `/api/v1/discovery/audit/${encodeURIComponent(this.selectedObjectId)}?depth=${this.discoveryDepth}`
        );
        this.edgeAudit = payload.data || null;
        this.edgeAuditDialog = true;
      } catch (err) {
        this.showToast(`Edge audit failed: ${err.message}`);
      }
    },
    renderGraph(cytoscapeContainerId = 'cy-graph', mermaidContainerId = 'mermaid-graph') {
      if (!this.discoveryGraph) {
        return;
      }

      const normalized = this.normalizeGraphData(this.discoveryGraph.data);
      this.graphHasSSISNodes = normalized.nodes.some((node) => {
        const type = String(node.data?.type || '').toLowerCase();
        const id = String(node.data?.id || '').toLowerCase();
        return type === 'package' || id.startsWith('ssisdb.');
      });
      this.graphShowHiddenHint = !this.graphHasSSISNodes && this.discoveryDepth < 5;
      const impactScoreById = new Map(
        (this.reports.blastRows || []).map((row) => [row.id, row.reachScore])
      );
      const isSsisNode = (node) => {
        const type = String(node?.data?.type || '').toLowerCase();
        const id = String(node?.data?.id || '').toLowerCase();
        return type === 'package' || id.startsWith('ssisdb.');
      };
      const displayNodes = this.graphShowOnlySSIS
        ? normalized.nodes.filter(
            (node) => isSsisNode(node) || node.data.id === this.selectedObjectId
          )
        : normalized.nodes;
      const displayNodeIds = new Set(displayNodes.map((node) => node.data.id));
      const displayEdges = normalized.edges.filter(
        (edge) => displayNodeIds.has(edge.data.source) && displayNodeIds.has(edge.data.target)
      );

      const rendersWithCytoscape =
        this.discoveryFormat === 'cytoscape' || this.discoveryFormat === 'centered';
      const rendersCenteredFlow = this.discoveryFormat === 'centered';
      const buildNodeLabel = (node) => {
        const label = String(node.data?.label || node.data?.id || 'Object').trim();
        const type = String(node.data?.type || 'object').trim();
        if (!type || type === 'unknown' || type === 'group') {
          return label;
        }
        return `${label}\n(${type})`;
      };

      if (rendersWithCytoscape) {
        const cyEl = document.getElementById(cytoscapeContainerId);
        if (!cyEl || !window.cytoscape) {
          return;
        }
        cyEl.classList.toggle('lineage-flow-canvas', rendersCenteredFlow);

        if (this.graphInstance?.destroy) {
          this.graphInstance.destroy();
        }

        const hasPresetPositions = displayNodes.some((node) => {
          const { position } = node;
          return (
            position && Number.isFinite(Number(position.x)) && Number.isFinite(Number(position.y))
          );
        });

        const layoutConfig = hasPresetPositions
          ? {
              name: 'preset',
              fit: true,
              padding: 56,
              animate: true,
            }
          : {
              name: 'breadthfirst',
              directed: true,
              roots: `#${CSS.escape(this.selectedObjectId)}`,
              padding: 48,
              spacingFactor: 1.85,
              nodeSep: 60,
              rankSep: 140,
              avoidOverlap: true,
              animate: true,
              fit: true,
              circle: false,
              grid: false,
            };

        this.graphInstance = window.cytoscape({
          container: cyEl,
          elements: [
            ...displayNodes.map((node) => ({
              ...node,
              data: {
                ...node.data,
                displayLabel: buildNodeLabel(node),
                impactScore: impactScoreById.get(node.data.id) || 1,
                isCentral: node.data.id === this.selectedObjectId,
              },
            })),
            ...displayEdges,
          ],
          style: [
            {
              selector: 'node',
              style: {
                label: 'data(displayLabel)',
                shape: 'round-rectangle',
                'background-color': '#0f172a',
                color: '#f8fafc',
                'font-size': '10px',
                'font-family': 'ui-sans-serif, system-ui, sans-serif',
                'font-weight': 700,
                width: 184,
                height: 72,
                'text-wrap': 'wrap',
                'text-max-width': '158px',
                'text-valign': 'center',
                'text-halign': 'center',
                'border-width': 2.5,
                'border-color': '#475569',
                'border-radius': 12,
                'background-opacity': 0.94,
                'text-outline-color': '#020617',
                'text-outline-width': 1,
                'shadow-blur': 16,
                'shadow-color': '#0f172a',
                'shadow-opacity': 0.28,
                'overlay-opacity': 0,
              },
            },
            {
              selector: 'node[type = "group"]',
              style: {
                label: 'data(label)',
                shape: 'round-rectangle',
                'background-color': '#111827',
                'background-opacity': 0.18,
                'border-color': '#a78bfa',
                'border-style': 'dashed',
                'border-width': 2,
                'border-radius': 12,
                color: '#c4b5fd',
                'font-size': '12px',
                'font-weight': 'bold',
                'text-valign': 'top',
                'text-halign': 'center',
                padding: '28px',
              },
            },
            {
              selector: 'node[isCentral]',
              style: {
                'background-color': '#052e16',
                'border-color': '#22c55e',
                'border-width': 4,
                width: 196,
                height: 76,
                'font-size': '11px',
                'font-weight': 'bold',
                color: '#dcfce7',
              },
            },
            {
              selector: 'node[type = "table"]',
              style: {
                shape: 'round-rectangle',
                'background-color': '#172554',
                'border-color': '#60a5fa',
                color: '#dbeafe',
                'border-radius': 12,
              },
            },
            {
              selector: 'node[type = "view"]',
              style: {
                shape: 'round-rectangle',
                'background-color': '#2e1065',
                'border-color': '#c084fc',
                color: '#f5d0fe',
                'border-radius': 12,
              },
            },
            {
              selector: 'node[type = "procedure"]',
              style: {
                shape: 'round-rectangle',
                'background-color': '#431407',
                'border-color': '#fb923c',
                color: '#ffedd5',
                'border-radius': 12,
                width: 190,
                height: 72,
              },
            },
            {
              selector: 'node[type = "function"]',
              style: {
                shape: 'round-rectangle',
                'background-color': '#042f2e',
                'border-color': '#2dd4bf',
                color: '#ccfbf1',
                'border-radius': 12,
              },
            },
            {
              selector: 'node[type = "trigger"]',
              style: {
                shape: 'round-rectangle',
                'background-color': '#4c0519',
                'border-color': '#fb7185',
                color: '#ffe4e6',
                'border-radius': 12,
              },
            },
            {
              selector: 'node[type = "package"]',
              style: {
                shape: 'round-rectangle',
                'background-color': '#1e1b4b',
                'border-color': '#8b5cf6',
                'border-width': 3,
                width: 188,
                height: 72,
                'font-size': '11px',
                'font-weight': 'bold',
                color: '#ede9fe',
                'border-radius': 12,
              },
            },
            {
              selector: 'node.semantic-mapped',
              style: {
                'border-color': '#22c55e',
                'border-width': 4,
                'shadow-color': '#22c55e',
                'shadow-opacity': 0.34,
                'shadow-blur': 18,
              },
            },
            {
              selector: 'node.semantic-propagated',
              style: {
                'border-color': '#f59e0b',
                'border-width': 3,
                'border-style': 'dashed',
              },
            },
            {
              selector: 'node:selected',
              style: {
                'border-color': '#fbbf24',
                'border-width': 5,
                'shadow-blur': 16,
                'shadow-color': '#fbbf24',
                'shadow-opacity': 0.55,
              },
            },
            {
              selector: 'edge',
              style: {
                width: 'mapData(confidence, 0, 1, 1, 5)',
                'line-color': '#38bdf8',
                'target-arrow-shape': 'triangle',
                'target-arrow-color': '#38bdf8',
                'curve-style': 'taxi',
                'taxi-direction': 'rightward',
                'taxi-turn': '50%',
                'taxi-turn-min-distance': 28,
                label: 'data(label)',
                color: '#cbd5e1',
                'font-size': '9px',
                'font-weight': 700,
                'text-background-color': '#ffffff',
                'text-background-opacity': 0.78,
                'text-background-padding': '3px',
                'text-border-color': '#e2e8f0',
                'text-border-width': 1,
                'text-border-opacity': 0.85,
                'text-rotation': 'autorotate',
                opacity: 0.92,
                'line-style': 'dashed',
                'line-dash-pattern': [9, 7],
                'line-dash-offset': 0,
              },
            },
            {
              selector: 'edge.producer-edge',
              style: {
                'line-color': '#22d3ee',
                'target-arrow-color': '#22d3ee',
                width: 3.4,
              },
            },
            {
              selector: 'edge.bridge-edge',
              style: {
                'line-color': '#64748b',
                'target-arrow-color': '#64748b',
                'line-style': 'dashed',
                width: 2.4,
              },
            },
            {
              selector: 'edge.ssis-load-edge',
              style: {
                'line-color': '#c084fc',
                'target-arrow-color': '#c084fc',
                width: 3.5,
              },
            },
            {
              selector: 'edge.consumer-edge',
              style: {
                'line-color': '#fb7185',
                'target-arrow-color': '#fb7185',
                width: 3.2,
              },
            },
            {
              selector: 'edge.semantic-edge',
              style: {
                'line-color': '#22c55e',
                'target-arrow-color': '#22c55e',
                'line-style': 'solid',
                width: 4,
              },
            },
            {
              selector: 'edge:selected',
              style: {
                'line-color': '#fbbf24',
                'target-arrow-color': '#fbbf24',
                width: 5,
                opacity: 1,
              },
            },
          ],
          layout: layoutConfig,
          wheelSensitivity: 0.16,
          minZoom: 0.12,
          maxZoom: 2.8,
          boxSelectionEnabled: true,
          autoungrabify: false,
        });
        this.focusGraphToFit();

        this.graphInstance.on('tap', 'node', (event) => {
          const node = event.target?.data?.();
          if (node?.id) {
            this.selectedObjectId = node.id;
            this.reports.shareObjectId = node.id;
            this.graphDrawerNode = node;
            this.graphDrawerOpen = true;
            this.buildBlastRadiusReport();
            this.$nextTick(() => this.renderBlastRadiusChart());
            this.showToast(`Selected ${node.id}`);
          }
        });

        this.graphInstance.on('dbltap', 'node', (event) => {
          const node = event.target?.data?.();
          if (node?.id && node.id !== this.selectedObjectId) {
            this.selectedObjectId = node.id;
            this.reports.shareObjectId = node.id;
            this.graphDrawerNode = node;
            this.graphDrawerOpen = true;
            this.loadDiscovery();
          }
        });

        if (this.graphAnimationFrame) {
          cancelAnimationFrame(this.graphAnimationFrame);
        }
        const animateEdges = () => {
          this.graphDashOffset = (this.graphDashOffset + 1) % 64;
          if (this.graphInstance?.edges) {
            this.graphInstance.edges().style('line-dash-offset', this.graphDashOffset);
          }
          this.graphAnimationFrame = requestAnimationFrame(animateEdges);
        };
        this.graphAnimationFrame = requestAnimationFrame(animateEdges);
      }

      if (this.discoveryFormat === 'mermaid') {
        const mermaidEl = document.getElementById(mermaidContainerId);
        if (!mermaidEl || !window.mermaid) {
          return;
        }

        mermaidEl.replaceChildren();
        const diagramEl = document.createElement('div');
        diagramEl.className = 'mermaid';
        diagramEl.textContent = this.discoveryGraph.data || '';
        mermaidEl.appendChild(diagramEl);
        window.mermaid.run({ nodes: [diagramEl] }).catch(() => {
          diagramEl.textContent = this.discoveryGraph.data || '';
        });
      }
    },
    focusGraphToFit() {
      if (this.graphInstance?.fit) {
        const nodes = this.graphInstance.nodes();
        const target = this.graphShowOnlySSIS
          ? nodes.filter((node) => {
              const type = String(node.data('type') || '').toLowerCase();
              const id = String(node.data('id') || '').toLowerCase();
              return type === 'package' || id.startsWith('ssisdb.');
            })
          : nodes;
        this.graphInstance.fit(target && target.length > 0 ? target : undefined, 32);
      }
    },
    openDiscoveryInNewTab() {
      const params = new URLSearchParams({
        view: 'discovery',
        object: this.selectedObjectId || '',
        format: this.discoveryFormat || 'cytoscape',
        depth: String(this.discoveryDepth || 2),
      });
      const url = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
      window.open(url, '_blank', 'noopener,noreferrer');
    },
    openGraphDrawer(node) {
      this.graphDrawerNode = node;
      this.graphDrawerOpen = true;
    },
    closeGraphDrawer() {
      this.graphDrawerOpen = false;
    },
    resetGraphView() {
      this.graphShowOnlySSIS = false;
      if (this.graphInstance?.fit) {
        this.graphInstance.fit(undefined, 32);
      }
      if (this.graphInstance?.center) {
        this.graphInstance.center();
      }
      if (this.graphSearchText) {
        this.graphSearchText = '';
      }
      this.graphSearchMatchCount = 0;
    },
    highlightGraphMatches() {
      const query = String(this.graphSearchText || '')
        .trim()
        .toLowerCase();
      if (!this.graphInstance) {
        return;
      }

      this.graphInstance.nodes().style({
        'border-width': 2,
        'border-color': '#dbeafe',
        opacity: 1,
      });
      this.graphInstance.edges().style({ opacity: 0.8 });

      if (!query) {
        this.graphSearchMatchCount = 0;
        return;
      }

      const matches = this.graphInstance.nodes().filter((node) => {
        const label = String(node.data('label') || '').toLowerCase();
        const id = String(node.data('id') || '').toLowerCase();
        return label.includes(query) || id.includes(query);
      });

      this.graphSearchMatchCount = matches.length;
      this.graphInstance.nodes().not(matches).style({ opacity: 0.22 });
      matches.style({
        'border-width': 4,
        'border-color': '#f59e0b',
        opacity: 1,
      });

      if (matches.length > 0) {
        this.graphInstance.fit(matches, 48);
      }
    },
    showOnlySsisPackages() {
      const hasSsis = this.graphHasSSISNodes;
      this.graphShowOnlySSIS = true;
      this.renderGraph(
        this.graphFocusDialog.show ? 'cy-graph-focus' : 'cy-graph',
        this.graphFocusDialog.show ? 'mermaid-graph-focus' : 'mermaid-graph'
      );
      if (!hasSsis) {
        this.showToast(
          'No SSIS package nodes are present at the current depth. Increase depth or open the focused view.'
        );
      } else {
        this.$nextTick(() => this.focusGraphToFit());
      }
    },
    showAllGraphNodes() {
      this.graphShowOnlySSIS = false;
      this.renderGraph(
        this.graphFocusDialog.show ? 'cy-graph-focus' : 'cy-graph',
        this.graphFocusDialog.show ? 'mermaid-graph-focus' : 'mermaid-graph'
      );
      this.$nextTick(() => this.focusGraphToFit());
    },
    openGraphFocus() {
      this.graphFocusDialog.show = true;
      nextTick(() => this.renderGraph('cy-graph-focus', 'mermaid-graph-focus'));
    },
    closeGraphFocus() {
      this.graphFocusDialog.show = false;
      this.$nextTick(() => this.renderGraph());
    },
    async downloadProtected(url, filename) {
      try {
        const response = await fetch(url, { headers: this.authHeader });
        if (!response.ok) {
          const contentType = response.headers.get('content-type') || '';
          const payload = contentType.includes('application/json') ? await response.json() : null;
          const fallbackMessage = payload
            ? null
            : (await response.text()) || `Download failed (${response.status})`;
          const entry = this.normalizeApiError({
            path: url,
            method: 'GET',
            status: response.status,
            payload,
            fallbackMessage,
          });
          this.recordApiError(entry);
          throw new Error(entry.message);
        }

        const blob = await response.blob();
        const href = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = href;
        link.download = filename;
        link.click();
        URL.revokeObjectURL(href);
      } catch (err) {
        this.showToast(err.message);
      }
    },
    async runReportPack(packType = 'executive') {
      if (this.reports.runningPack) {
        return;
      }

      const objectId = encodeURIComponent(this.selectedObjectId);
      const packDefinitions = {
        executive: [
          { url: '/api/v1/reporting/export/catalog.xlsx', fileName: 'executive-catalog.xlsx' },
          {
            url: `/api/v1/reporting/export/dependency/${objectId}.pdf`,
            fileName: `executive-dependency-${this.selectedObjectId}.pdf`,
          },
          {
            url: `/api/v1/reporting/export/visualization/${objectId}?format=svg`,
            fileName: `executive-visual-${this.selectedObjectId}.svg`,
          },
        ],
        steward: [
          { url: '/api/v1/reporting/export/catalog.csv', fileName: 'steward-catalog.csv' },
          {
            url: `/api/v1/reporting/export/dependency/${objectId}.pdf`,
            fileName: `steward-dependency-${this.selectedObjectId}.pdf`,
          },
        ],
        analyst: [
          { url: '/api/v1/reporting/export/catalog.csv', fileName: 'analyst-catalog.csv' },
          {
            url: `/api/v1/reporting/export/visualization/${objectId}?format=svg`,
            fileName: `analyst-visual-${this.selectedObjectId}.svg`,
          },
        ],
      };

      const downloads = packDefinitions[packType] || packDefinitions.executive;

      try {
        this.reports.runningPack = true;
        for (const item of downloads) {
          // eslint-disable-next-line no-await-in-loop
          await this.downloadProtected(item.url, item.fileName);
        }
        this.reports.lastPackRun = {
          packType,
          objectId: this.selectedObjectId,
          downloadedAt: new Date().toISOString(),
          fileCount: downloads.length,
        };
        this.showToast(`${packType} report pack downloaded (${downloads.length} files)`);
      } catch (err) {
        this.showToast(`Report pack failed: ${err.message}`);
      } finally {
        this.reports.runningPack = false;
      }
    },
    async createShareLink() {
      try {
        const payload = await this.api(
          `/api/v1/reporting/share/visualization/${encodeURIComponent(this.reports.shareObjectId)}`,
          {
            method: 'POST',
            body: JSON.stringify({
              format: this.reports.shareFormat,
              ttlMinutes: 1440,
              baseUrl: window.location.origin,
            }),
          }
        );

        const shareUrl = payload.data?.url || payload.data?.link;
        this.reports.sharedLink = shareUrl || JSON.stringify(payload.data);
      } catch (err) {
        this.showToast(`Share link failed: ${err.message}`);
      }
    },
    async createSchedule() {
      try {
        await this.api('/api/v1/reporting/schedules', {
          method: 'POST',
          body: JSON.stringify({
            recipient: this.reports.recipient,
            reportType: 'catalog.csv',
            frequency: 'daily',
          }),
        });
        await this.loadSchedules();
      } catch (err) {
        this.showToast(`Schedule creation failed: ${err.message}`);
      }
    },
    async loadSchedules() {
      try {
        const payload = await this.api('/api/v1/reporting/schedules');
        this.reports.schedules = payload.data?.schedules || [];
      } catch (err) {
        this.showToast(`Schedule load failed: ${err.message}`);
      }
    },
    async runSchedule(scheduleId) {
      try {
        await this.api(`/api/v1/reporting/schedules/${scheduleId}/run`, { method: 'POST' });
        this.showToast('Schedule executed');
      } catch (err) {
        this.showToast(`Run failed: ${err.message}`);
      }
    },
    async loadIntegrations() {
      try {
        const [settings, webhooks] = await Promise.all([
          this.api('/api/v1/integrations/settings'),
          this.api('/api/v1/integrations/webhooks'),
        ]);

        this.integrations.settings = settings.data;
        this.integrations.webhooks = webhooks.data?.webhooks || [];
        await this.loadManagedConnectors();
      } catch (err) {
        this.showToast(`Integrations load issue: ${err.message}`);
      }
    },
    parseConnectorConfigJson() {
      const raw = this.integrations.connectorEditor.configJson || '{}';
      try {
        return JSON.parse(raw);
      } catch (_err) {
        this.showToast('Connector config must be valid JSON.');
        return null;
      }
    },
    async loadManagedConnectors() {
      try {
        this.integrations.connectorLoading = true;
        const [definitions, connectors] = await Promise.all([
          this.api('/api/v1/connectors/definitions'),
          this.api('/api/v1/connectors'),
        ]);
        this.integrations.connectorDefinitions = definitions.definitions || [];
        this.integrations.managedConnectors = connectors.connectors || [];
        if (!this.integrations.selectedConnectorId && this.integrations.managedConnectors.length) {
          this.integrations.selectedConnectorId = this.integrations.managedConnectors[0].id;
        }
        if (!this.integrations.profileRunEditor.connectorId && this.integrations.managedConnectors.length) {
          this.integrations.profileRunEditor.connectorId = this.integrations.selectedConnectorId;
        }
        if (!this.integrations.connectorGrant.connectorId && this.integrations.managedConnectors.length) {
          this.integrations.connectorGrant.connectorId = this.integrations.managedConnectors[0].id;
        }
        if (!this.integrations.profileScheduleEditor.connectorId && this.integrations.managedConnectors.length) {
          this.integrations.profileScheduleEditor.connectorId = this.integrations.managedConnectors[0].id;
        }
        this.initializeProfileScheduleEditor();
        await this.loadProfileSchedules();
      } catch (err) {
        this.showToast(`Managed connector load failed: ${err.message}`);
      } finally {
        this.integrations.connectorLoading = false;
      }
    },
    initializeProfileScheduleEditor(force = false) {
      const editor = this.integrations.profileScheduleEditor;
      if (!force && editor.date && editor.time) return;
      const nextRun = new Date(Date.now() + 60 * 60 * 1000);
      nextRun.setMinutes(0, 0, 0);
      editor.date = this.formatDateInput(nextRun);
      editor.time = this.formatTimeInput(nextRun);
      if (!editor.connectorId && this.integrations.managedConnectors.length) {
        editor.connectorId = this.integrations.managedConnectors[0].id;
      }
    },
    formatDateInput(value) {
      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) return '';
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },
    formatTimeInput(value) {
      const date = value instanceof Date ? value : new Date(value);
      if (Number.isNaN(date.getTime())) return '';
      return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    },
    profileScheduleStartIso() {
      const editor = this.integrations.profileScheduleEditor;
      if (!editor.date || !editor.time) return null;
      const date = new Date(`${editor.date}T${editor.time}:00`);
      if (Number.isNaN(date.getTime())) return null;
      return date.toISOString();
    },
    syncProfileScheduleInterval() {
      const editor = this.integrations.profileScheduleEditor;
      if (editor.cadence === 'hourly') editor.intervalMinutes = 60;
      if (editor.cadence === 'daily') editor.intervalMinutes = 1440;
      if (editor.cadence === 'weekly') editor.intervalMinutes = 10080;
    },
    profileScheduleOptionsPayload() {
      const editor = this.integrations.profileScheduleEditor;
      const payload = {
        dry_run: editor.dryRun !== false,
        fail_fast: false,
        ids: String(editor.assetIds || '')
          .split(/[\n,]+/)
          .map((value) => value.trim())
          .filter(Boolean),
        streams: String(editor.streams || '')
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
      };
      if (editor.profileType === 'aggregate' || editor.profileType === 'auto') {
        payload.coverage_mode = editor.coverageMode || 'all_objects';
        payload.include_views = editor.includeViews === true;
        payload.live_priority = editor.livePriority || 'most_used_first';
        payload.max_live_tables = Math.max(1, Number(editor.maxLiveTables || 1));
      }
      return payload;
    },
    async loadProfileSchedules() {
      try {
        this.integrations.profileScheduleLoading = true;
        const payload = await this.api('/api/v1/connectors/profile-schedules');
        this.integrations.profileSchedules = payload.schedules || [];
        await this.loadProfileSchedulerStatus();
      } catch (err) {
        this.showToast(`Profile schedule load failed: ${err.message}`);
      } finally {
        this.integrations.profileScheduleLoading = false;
      }
    },
    async loadProfileSchedulerStatus() {
      try {
        const payload = await this.api('/api/v1/connectors/profile-schedules/status');
        this.integrations.profileSchedulerStatus = payload.scheduler || null;
      } catch (err) {
        this.integrations.profileSchedulerStatus = {
          running: false,
          enabled: false,
          last_error: { message: err.message },
        };
      }
    },
    async loadProfileScheduleRuns(scheduleId) {
      if (!scheduleId) return;
      try {
        const payload = await this.api(`/api/v1/connectors/profile-schedules/${encodeURIComponent(scheduleId)}/runs?limit=25`);
        this.integrations.profileScheduleRuns = payload.runs || [];
        this.integrations.profileScheduleRunScheduleId = scheduleId;
      } catch (err) {
        this.showToast(`Schedule history load failed: ${err.message}`);
      }
    },
    async startProfileSchedulerWorker() {
      try {
        this.integrations.profileScheduleLoading = true;
        const payload = await this.api('/api/v1/connectors/profile-schedules/worker/start', {
          method: 'POST',
          body: JSON.stringify({ enabled: true }),
        });
        this.integrations.profileSchedulerStatus = payload.scheduler || null;
        this.showToast('Profile scheduler worker started.');
      } catch (err) {
        this.showToast(`Scheduler start failed: ${err.message}`);
      } finally {
        this.integrations.profileScheduleLoading = false;
      }
    },
    async stopProfileSchedulerWorker() {
      try {
        this.integrations.profileScheduleLoading = true;
        const payload = await this.api('/api/v1/connectors/profile-schedules/worker/stop', { method: 'POST' });
        this.integrations.profileSchedulerStatus = payload.scheduler || null;
        this.showToast('Profile scheduler worker stopped.');
      } catch (err) {
        this.showToast(`Scheduler stop failed: ${err.message}`);
      } finally {
        this.integrations.profileScheduleLoading = false;
      }
    },
    async saveProfileSchedule() {
      const editor = this.integrations.profileScheduleEditor;
      if (!editor.connectorId) {
        this.showToast('Choose a connector before saving a schedule.');
        return;
      }
      const startAt = this.profileScheduleStartIso();
      if (!startAt) {
        this.showToast('Choose a valid start date and time.');
        return;
      }
      this.syncProfileScheduleInterval();
      const method = editor.id ? 'PUT' : 'POST';
      const path = editor.id
        ? `/api/v1/connectors/profile-schedules/${encodeURIComponent(editor.id)}`
        : '/api/v1/connectors/profile-schedules';
      try {
        this.integrations.profileScheduleLoading = true;
        const payload = await this.api(path, {
          method,
          body: JSON.stringify({
            connector_id: editor.connectorId,
            name: editor.name || undefined,
            profile_type: editor.profileType,
            status: editor.status,
            cadence: editor.cadence,
            interval_minutes: Number(editor.intervalMinutes || 1440),
            timezone: editor.timezone || 'UTC',
            start_at: startAt,
            max_failures: Number(editor.maxFailures || 3),
            options: this.profileScheduleOptionsPayload(),
          }),
        });
        this.integrations.profileScheduleResult = payload.schedule || null;
        await this.loadProfileSchedules();
        if (payload.schedule?.id) await this.loadProfileScheduleRuns(payload.schedule.id);
        this.showToast(editor.id ? 'Profile schedule updated.' : 'Profile schedule created.');
      } catch (err) {
        this.showToast(`Profile schedule save failed: ${err.message}`);
      } finally {
        this.integrations.profileScheduleLoading = false;
      }
    },
    async editProfileSchedule(schedule) {
      const editor = this.integrations.profileScheduleEditor;
      const start = new Date(schedule.start_at || schedule.next_run_at || Date.now());
      editor.id = schedule.id;
      editor.connectorId = schedule.connector_id;
      editor.name = schedule.name || '';
      editor.profileType = schedule.profile_type || 'auto';
      editor.status = schedule.status || 'ACTIVE';
      editor.cadence = schedule.cadence || 'daily';
      editor.date = this.formatDateInput(start);
      editor.time = this.formatTimeInput(start);
      editor.timezone = schedule.timezone || editor.timezone || 'UTC';
      editor.intervalMinutes = schedule.interval_minutes || 1440;
      editor.maxFailures = schedule.max_failures || 3;
      editor.streams = (schedule.options?.streams || []).join(', ');
      editor.dryRun = schedule.options?.dry_run !== false;
      editor.assetIds = (schedule.options?.ids || []).join('\n');
      editor.coverageMode = schedule.options?.coverage_mode || 'all_objects';
      editor.includeViews = schedule.options?.include_views !== false;
      editor.livePriority = schedule.options?.live_priority || 'most_used_first';
      editor.maxLiveTables = Math.max(1, Number(schedule.options?.max_live_tables || 1));
      await this.loadProfileScheduleRuns(schedule.id);
      this.showToast(`Editing ${schedule.name || schedule.id}.`);
    },
    resetProfileScheduleEditor() {
      const firstConnector = this.integrations.managedConnectors[0]?.id || '';
      this.integrations.profileScheduleEditor = {
        id: '',
        connectorId: firstConnector,
        name: '',
        profileType: 'auto',
        status: 'ACTIVE',
        cadence: 'daily',
        date: '',
        time: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        intervalMinutes: 1440,
        maxFailures: 3,
        streams: '',
        dryRun: true,
        assetIds: '',
        coverageMode: 'all_objects',
        includeViews: true,
        livePriority: 'most_used_first',
        maxLiveTables: 1,
      };
      this.initializeProfileScheduleEditor(true);
      this.integrations.profileScheduleRuns = [];
      this.integrations.profileScheduleRunScheduleId = '';
    },
    async runProfileSchedule(scheduleId) {
      try {
        this.integrations.profileScheduleLoading = true;
        const payload = await this.api(`/api/v1/connectors/profile-schedules/${encodeURIComponent(scheduleId)}/run`, {
          method: 'POST',
        });
        this.integrations.profileScheduleResult = payload.result || null;
        await this.loadProfileSchedules();
        await this.loadProfileScheduleRuns(scheduleId);
        this.showToast(`Schedule run ${payload.result?.run?.status || 'completed'}.`);
      } catch (err) {
        this.showToast(`Profile schedule run failed: ${err.message}`);
      } finally {
        this.integrations.profileScheduleLoading = false;
      }
    },
    async tickProfileSchedules() {
      try {
        this.integrations.profileScheduleLoading = true;
        const payload = await this.api('/api/v1/connectors/profile-schedules/tick', {
          method: 'POST',
          body: JSON.stringify({ limit: 25 }),
        });
        this.integrations.profileScheduleResult = payload.result || null;
        await this.loadProfileSchedules();
        if (this.integrations.profileScheduleRunScheduleId) {
          await this.loadProfileScheduleRuns(this.integrations.profileScheduleRunScheduleId);
        }
        this.showToast(`Scheduler tick processed ${payload.result?.due_count || 0} due schedule(s).`);
      } catch (err) {
        this.showToast(`Scheduler tick failed: ${err.message}`);
      } finally {
        this.integrations.profileScheduleLoading = false;
      }
    },
    async updateProfileScheduleStatus(schedule, status) {
      try {
        this.integrations.profileScheduleLoading = true;
        await this.api(`/api/v1/connectors/profile-schedules/${encodeURIComponent(schedule.id)}`, {
          method: 'PUT',
          body: JSON.stringify({ status }),
        });
        await this.loadProfileSchedules();
        this.showToast(`Schedule ${status === 'ACTIVE' ? 'activated' : 'paused'}.`);
      } catch (err) {
        this.showToast(`Schedule status update failed: ${err.message}`);
      } finally {
        this.integrations.profileScheduleLoading = false;
      }
    },
    async deleteProfileSchedule(scheduleId) {
      try {
        this.integrations.profileScheduleLoading = true;
        await this.api(`/api/v1/connectors/profile-schedules/${encodeURIComponent(scheduleId)}`, {
          method: 'DELETE',
        });
        if (this.integrations.profileScheduleEditor.id === scheduleId) this.resetProfileScheduleEditor();
        if (this.integrations.profileScheduleRunScheduleId === scheduleId) {
          this.integrations.profileScheduleRuns = [];
          this.integrations.profileScheduleRunScheduleId = '';
        }
        await this.loadProfileSchedules();
        this.showToast('Profile schedule deleted.');
      } catch (err) {
        this.showToast(`Schedule delete failed: ${err.message}`);
      } finally {
        this.integrations.profileScheduleLoading = false;
      }
    },
    isScheduleDueSoon(schedule) {
      const next = new Date(schedule.next_run_at || 0);
      if (Number.isNaN(next.getTime())) return false;
      const now = Date.now();
      return schedule.status === 'ACTIVE' && next.getTime() <= now + 24 * 60 * 60 * 1000;
    },
    scheduleStatusColor(status) {
      if (status === 'ACTIVE') return 'success';
      if (status === 'PAUSED') return 'warning';
      return 'secondary';
    },
    profileCoverageModeOptions() {
      return [
        { title: 'All objects', value: 'all_objects' },
        { title: 'All tables', value: 'all_tables' },
      ];
    },
    profileLivePriorityOptions() {
      return [
        { title: 'Most used first', value: 'most_used_first' },
        { title: 'Smallest first', value: 'smallest_first' },
        { title: 'Largest first', value: 'largest_first' },
        { title: 'Alphabetical', value: 'alphabetical' },
      ];
    },
    profileCoverageModeLabel(value) {
      if (value === 'all_objects') return 'All objects';
      if (value === 'all_tables') return 'All tables';
      return value || 'Default';
    },
    profileLivePriorityLabel(value) {
      if (value === 'most_used_first') return 'Most used first';
      if (value === 'smallest_first') return 'Smallest first';
      if (value === 'largest_first') return 'Largest first';
      if (value === 'alphabetical') return 'Alphabetical';
      return value || 'Default';
    },
    connectorRunQueueStatus(run) {
      return run?.summary?.coverage_queue_status || null;
    },
    connectorRunCoverageCounts(run) {
      return {
        live: Number(run?.summary?.coverage_assets_live || 0),
        metadataOnly: Number(run?.summary?.coverage_assets_metadata_only || 0),
        total: Number(run?.summary?.coverage_assets_total || 0),
      };
    },
    scheduleQueueSummary(schedule) {
      const options = schedule?.options || {};
      return {
        coverageMode: options.coverage_mode || 'all_objects',
        livePriority: options.live_priority || 'most_used_first',
        maxLiveTables: Number(options.max_live_tables || 1) || 1,
      };
    },
    connectorDefinitionLabel(type) {
      const definition = this.integrations.connectorDefinitions.find((item) => item.type === type);
      return definition ? `${definition.label} (${definition.cloud})` : type;
    },
    useManagedConnector(connector) {
      if (!connector) return;
      this.integrations.selectedConnectorId = connector.id;
      this.integrations.profileRunEditor.connectorId = connector.id;
      this.integrations.profileScheduleEditor.connectorId = connector.id;
      this.integrations.connectorGrant.connectorId = connector.id;
      this.loadManagedConnectorRuns(connector.id);
    },
    editManagedConnector(connector) {
      if (!connector) return;
      this.useManagedConnector(connector);
      this.integrations.connectorWorkflowTab = 'connection';
      this.integrations.connectorEditor.id = connector.id;
      this.integrations.connectorEditor.type = connector.type;
      this.integrations.connectorEditor.label = connector.label || connector.id;
      this.integrations.connectorEditor.description = connector.description || '';
      this.integrations.connectorEditor.credentialMode = connector.credential?.mode || 'secret_reference';
      this.integrations.connectorEditor.secretRef =
        connector.credential?.secret_ref === 'stored_reference' ? '' : connector.credential?.secret_ref || '';
      this.integrations.connectorEditor.rawSecret = '';
      this.integrations.connectorEditor.configJson = JSON.stringify(connector.config || {}, null, 2);
      this.syncConnectorCredentialMode();
    },
    profileRunOptionsPayload() {
      const editor = this.integrations.profileRunEditor;
      const values = String(editor.assetIds || '')
        .split(/[\n,]+/)
        .map((value) => value.trim())
        .filter(Boolean);
      const payload = {
        execution_mode: editor.executionMode,
        dry_run: editor.executionMode !== 'live',
        fail_fast: false,
        ids: values,
        streams: String(editor.streams || '')
          .split(',')
          .map((value) => value.trim())
          .filter(Boolean),
      };
      if (editor.profileType === 'aggregate') {
        payload.coverage_mode = editor.coverageMode || 'all_objects';
        payload.include_views = editor.includeViews === true;
        payload.live_priority = editor.livePriority || 'most_used_first';
        payload.max_live_tables = Math.max(1, Number(editor.maxLiveTables || 1));
      }
      return payload;
    },
    profileRunEndpoint(connectorId) {
      const type = this.integrations.profileRunEditor.profileType;
      if (type === 'bi') return `/api/v1/connectors/${encodeURIComponent(connectorId)}/bi-profile/run`;
      if (type === 'metadata') return `/api/v1/connectors/${encodeURIComponent(connectorId)}/metadata-profile/run`;
      return `/api/v1/connectors/${encodeURIComponent(connectorId)}/profile/run`;
    },
    async runOneTimeProfile() {
      const editor = this.integrations.profileRunEditor;
      if (!editor.connectorId) {
        this.showToast('Select a saved connector before running a profile.');
        return;
      }
      try {
        this.integrations.connectorLoading = true;
        const payload = await this.api(this.profileRunEndpoint(editor.connectorId), {
          method: 'POST',
          body: JSON.stringify(this.profileRunOptionsPayload()),
        });
        const run = payload.run || null;
        this.integrations.profileRunResult = run;
        this.integrations.connectorRuns = [run, ...this.integrations.connectorRuns.filter(Boolean)].slice(0, 10);
        this.integrations.selectedConnectorRun = run;
        this.integrations.connectorWorkflowTab = 'history';
        this.showToast(`Profile run ${run?.status || 'completed'}.`);
      } catch (err) {
        this.showToast(`Profile run failed: ${err.message}`);
      } finally {
        this.integrations.connectorLoading = false;
      }
    },
    connectorRunFailedAssetIds(run) {
      const errors = run?.errors || run?.profile?.errors || run?.profile?.run?.errors || [];
      return [...new Set(errors
        .map((error) => error?.asset_id || error?.assetId || error?.object_id || error?.objectId)
        .filter(Boolean))];
    },
    canRerunFailedAssets(run) {
      return this.connectorRunKind(run) === 'Aggregate profile' && this.connectorRunFailedAssetIds(run).length > 0;
    },
    connectorRunPublishState(run) {
      return run?.artifact?.profile_publish || {};
    },
    connectorRunPublishStatus(run) {
      const state = this.connectorRunPublishState(run);
      if (state.status) return state.status;
      if ((state.successful_asset_count || 0) > 0 || run?.artifact?.devops_upload_pending) return 'pending';
      return 'not_applicable';
    },
    connectorRunCanPublish(run) {
      const state = this.connectorRunPublishState(run);
      return (state.successful_asset_count || 0) > 0 && !['published', 'partial_published', 'publishing'].includes(this.connectorRunPublishStatus(run));
    },
    connectorRunPublishColor(run) {
      const status = this.connectorRunPublishStatus(run);
      if (['published', 'partial_published'].includes(status)) return 'success';
      if (['publish_failed'].includes(status)) return 'error';
      if (['pending', 'publish_ready', 'publishing'].includes(status)) return 'warning';
      return 'default';
    },
    async rerunFailedProfileAssets(run) {
      const failedAssetIds = this.connectorRunFailedAssetIds(run);
      if (!failedAssetIds.length) {
        this.showToast('This run does not have failed profile assets to rerun.');
        return;
      }
      const connectorId =
        run?.connector_id ||
        this.integrations.selectedConnectorId ||
        this.integrations.profileRunEditor.connectorId;
      if (!connectorId) {
        this.showToast('Select the saved connector before rerunning failed assets.');
        return;
      }
      this.selectConnectorRun(run);
      this.integrations.selectedConnectorId = connectorId;
      this.integrations.profileRunEditor.connectorId = connectorId;
      this.integrations.profileRunEditor.profileType = 'aggregate';
      this.integrations.profileRunEditor.executionMode = 'live';
      this.integrations.profileRunEditor.assetIds = failedAssetIds.join('\n');
      this.integrations.profileRunEditor.streams = '';
      this.showToast(`Rerunning ${failedAssetIds.length} failed asset${failedAssetIds.length === 1 ? '' : 's'}.`);
      await this.runOneTimeProfile();
    },
    async publishConnectorProfiles(run = null) {
      const connectorId = run?.connector_id || this.integrations.selectedConnectorId || this.integrations.profileRunEditor.connectorId;
      const body = {
        targets: ['devops', 'confluence'],
        dry_run: false,
      };
      const endpoint = run?.id && connectorId
        ? `/api/v1/connectors/${encodeURIComponent(connectorId)}/runs/${encodeURIComponent(run.id)}/publish`
        : '/api/v1/connectors/profile-publications/publish';
      try {
        this.integrations.connectorPublishLoading = true;
        const payload = await this.api(endpoint, {
          method: 'POST',
          body: JSON.stringify(body),
        });
        this.integrations.connectorPublicationResult = payload.publication || null;
        if (connectorId) await this.loadManagedConnectorRuns(connectorId);
        this.showToast(`Profile publish ${payload.publication?.status || 'submitted'}.`);
      } catch (err) {
        this.showToast(`Profile publish failed: ${err.message}`);
      } finally {
        this.integrations.connectorPublishLoading = false;
      }
    },
    prepareScheduleForSelectedConnector() {
      const connectorId =
        this.integrations.profileRunEditor.connectorId ||
        this.integrations.selectedConnectorId ||
        this.integrations.managedConnectors[0]?.id ||
        '';
      this.integrations.profileScheduleEditor.connectorId = connectorId;
      this.integrations.profileScheduleEditor.profileType = this.integrations.profileRunEditor.profileType;
      this.integrations.profileScheduleEditor.dryRun =
        this.integrations.profileRunEditor.executionMode !== 'live';
      this.integrations.profileScheduleEditor.assetIds = this.integrations.profileRunEditor.assetIds || '';
      this.integrations.profileScheduleEditor.streams = this.integrations.profileRunEditor.streams || '';
      this.integrations.profileScheduleEditor.coverageMode = this.integrations.profileRunEditor.coverageMode || 'all_objects';
      this.integrations.profileScheduleEditor.includeViews = this.integrations.profileRunEditor.includeViews === true;
      this.integrations.profileScheduleEditor.livePriority = this.integrations.profileRunEditor.livePriority || 'most_used_first';
      this.integrations.profileScheduleEditor.maxLiveTables = Math.max(1, Number(this.integrations.profileRunEditor.maxLiveTables || 1));
      this.initializeProfileScheduleEditor(true);
      this.integrations.connectorWorkflowTab = 'schedule';
    },
    selectedConnectorDefinition() {
      return this.integrations.connectorDefinitions.find(
        (item) => item.type === this.integrations.connectorEditor.type
      ) || null;
    },
    connectorCredentialModeOptions() {
      const modes = this.selectedConnectorDefinition()?.credentialKinds || [
        'managed_identity',
        'service_account',
        'secret_reference',
        'none',
      ];
      const labels = {
        windows_integrated: 'Windows Integrated Auth',
        service_account: 'Service Account',
        managed_identity: 'Managed Identity',
        service_principal: 'Service Principal',
        secret_reference: 'Secret Reference',
        pat_reference: 'PAT Reference',
        oauth_app: 'OAuth App',
        iam_role: 'AWS IAM Role',
        workload_identity: 'Workload Identity',
        key_pair: 'Key Pair',
        sas_reference: 'SAS Reference',
        api_key_reference: 'API Key Reference',
        api_token_reference: 'API Token Reference',
        bearer_token_reference: 'Bearer Token Reference',
        basic_auth: 'Basic Auth',
        repo_reference: 'Repository Reference',
        connected_app: 'Connected App',
        oauth: 'OAuth',
        none: 'None',
      };
      return modes.map((mode) => ({
        title: labels[mode] || mode,
        value: mode,
      }));
    },
    connectorCredentialModeHint() {
      const mode = this.integrations.connectorEditor.credentialMode;
      if (mode === 'windows_integrated') {
        return 'Uses the Windows account running this app process. Leave Secret Reference and One-time Secret Value blank.';
      }
      if (mode === 'service_account' || mode === 'secret_reference') {
        return 'Use a Key Vault or secret-store reference for production service credentials.';
      }
      if (mode === 'managed_identity' || mode === 'iam_role' || mode === 'workload_identity') {
        return 'Uses the runtime identity assigned to the host environment; no password is stored here.';
      }
      return 'Select the credential pattern supported by this source system.';
    },
    connectorSecretReferenceRequired() {
      const mode = this.integrations.connectorEditor.credentialMode;
      return !['windows_integrated', 'managed_identity', 'iam_role', 'workload_identity', 'none'].includes(mode);
    },
    syncConnectorCredentialMode() {
      const editor = this.integrations.connectorEditor;
      const options = this.connectorCredentialModeOptions().map((item) => item.value);
      if (!options.includes(editor.credentialMode)) {
        editor.credentialMode =
          options.includes('windows_integrated') ? 'windows_integrated' : options[0] || 'none';
      }
      if (editor.credentialMode === 'windows_integrated') {
        editor.secretRef = '';
        editor.rawSecret = '';
      }
    },
    async saveManagedConnector() {
      const editor = this.integrations.connectorEditor;
      this.syncConnectorCredentialMode();
      const config = this.parseConnectorConfigJson();
      if (!config) return;
      if (this.connectorSecretReferenceRequired() && !editor.secretRef && !editor.rawSecret) {
        this.showToast('Secret Reference or One-time Secret Value is required for this credential mode.');
        return;
      }
      try {
        this.integrations.connectorLoading = true;
        const credential = {
          mode: editor.credentialMode,
        };
        if (this.connectorSecretReferenceRequired()) {
          credential.secret_ref = editor.secretRef;
          credential.secret = editor.rawSecret || undefined;
        }
        await this.api('/api/v1/connectors', {
          method: 'POST',
          body: JSON.stringify({
            id: editor.id,
            type: editor.type,
            label: editor.label,
            description: editor.description,
            config,
            credential,
          }),
        });
        editor.rawSecret = '';
        await this.loadManagedConnectors();
        this.integrations.selectedConnectorId = editor.id;
        this.integrations.profileRunEditor.connectorId = editor.id;
        this.integrations.profileScheduleEditor.connectorId = editor.id;
        this.integrations.connectorGrant.connectorId = editor.id;
        this.integrations.connectorWorkflowTab = 'run';
        this.showToast('Managed connector saved.');
      } catch (err) {
        this.showToast(`Managed connector save failed: ${err.message}`);
      } finally {
        this.integrations.connectorLoading = false;
      }
    },
    async grantManagedConnectorPermission() {
      const grant = this.integrations.connectorGrant;
      if (!grant.connectorId || !grant.subject) {
        this.showToast('Connector and permission subject are required.');
        return;
      }
      try {
        await this.api(`/api/v1/connectors/${encodeURIComponent(grant.connectorId)}/permissions`, {
          method: 'POST',
          body: JSON.stringify({
            scope: grant.scope,
            subject: grant.subject,
            actions: grant.actions,
          }),
        });
        await this.loadManagedConnectors();
        this.showToast('Connector permission granted.');
      } catch (err) {
        this.showToast(`Connector permission failed: ${err.message}`);
      }
    },
    async runManagedConnector(connectorId) {
      try {
        this.integrations.connectorLoading = true;
        const payload = await this.api(`/api/v1/connectors/${encodeURIComponent(connectorId)}/run`, {
          method: 'POST',
          body: JSON.stringify({ dry_run: true }),
        });
        this.integrations.connectorRuns = [payload.run, ...this.integrations.connectorRuns].slice(0, 10);
        await this.loadManagedConnectorSnapshot(connectorId);
        const planned = payload.run.summary?.planned_objects ?? 0;
        const discovered = payload.run.summary?.discovered_objects ?? 0;
        const suffix = payload.run.summary?.dry_run_only ? `${planned} stream/object type(s) planned; source not contacted.` : `${discovered} metadata object(s) harvested.`;
        this.showToast(`Connector run ${payload.run.status}: ${suffix}`);
      } catch (err) {
        this.showToast(`Connector run failed: ${err.message}`);
      } finally {
        this.integrations.connectorLoading = false;
      }
    },
    async loadManagedConnectorSnapshot(connectorId) {
      try {
        const payload = await this.api(`/api/v1/connectors/${encodeURIComponent(connectorId)}/snapshot`);
        this.integrations.connectorSnapshot = payload.snapshot || null;
      } catch (err) {
        this.showToast(`Connector snapshot failed: ${err.message}`);
      }
    },
    async loadManagedConnectorRuns(connectorId) {
      if (!connectorId) return;
      try {
        const payload = await this.api(`/api/v1/connectors/${encodeURIComponent(connectorId)}/runs?limit=10`);
        this.integrations.connectorRuns = payload.runs || [];
        this.integrations.selectedConnectorRun = this.integrations.connectorRuns[0] || null;
      } catch (err) {
        this.showToast(`Connector run history failed: ${err.message}`);
      }
    },
    selectConnectorRun(run) {
      this.integrations.selectedConnectorRun = run || null;
    },
    connectorRunKind(run) {
      if (run?.summary?.bi_profile_run) return 'BI profile';
      if (run?.summary?.metadata_profile_run) return 'Metadata profile';
      if (run?.summary?.profile_run) return 'Aggregate profile';
      return 'Metadata harvest';
    },
    connectorRunFoundCount(run) {
      if (!run) return 0;
      if (run.summary?.assets_profiled !== undefined) return run.summary.assets_profiled;
      if (run.summary?.reports_profiled !== undefined) return run.summary.reports_profiled;
      if (run.summary?.records_profiled !== undefined) return run.summary.records_profiled;
      if (run.summary?.dry_run_only) return `${run.summary?.planned_objects ?? 0} planned`;
      return run.summary?.discovered_objects ?? 0;
    },
    connectorRunProfileRows(run) {
      const profiles = run?.profile?.run?.profiles || run?.profile?.profiles || {};
      return Object.entries(profiles).map(([assetId, profile]) => ({
        assetId,
        rowCount: profile.row_count ?? '-',
        columnCount: Object.keys(profile.columns || {}).length,
        generatedAt: profile.generated_at || profile.profiled_at || '-',
      }));
    },
    connectorRunColumnRows(run) {
      const profiles = run?.profile?.run?.profiles || run?.profile?.profiles || {};
      return Object.entries(profiles).flatMap(([assetId, profile]) =>
        Object.entries(profile.columns || {}).map(([columnName, stats]) => ({
          assetId,
          columnName,
          rowCount: stats.row_count ?? profile.row_count ?? '-',
          nullCount: stats.null_count ?? '-',
          nullPercent: stats.null_percent ?? '-',
          distinctCount: stats.distinct_count ?? '-',
          min: stats.min ?? '-',
          max: stats.max ?? '-',
          mean: stats.mean ?? '-',
        }))
      );
    },
    connectorRunStreamRows(run) {
      return (run?.extraction?.stream_results || []).map((stream) => ({
        stream: stream.stream,
        status: stream.status,
        eventCount: stream.event_count ?? 0,
        endpoint: stream.plan?.endpoint || '-',
      }));
    },
    async saveNotificationChannel() {
      const channel = this.integrations.notifyChannel;
      const current = this.integrations.settings?.notifications?.[channel] || {};
      try {
        await this.api(`/api/v1/integrations/notifications/${channel}`, {
          method: 'PUT',
          body: JSON.stringify({ ...current, enabled: true }),
        });
        await this.loadIntegrations();
        this.showToast(`${channel} settings updated`);
      } catch (err) {
        this.showToast(`Notification update failed: ${err.message}`);
      }
    },
    async sendNotificationTest() {
      try {
        await this.api('/api/v1/integrations/notifications/send', {
          method: 'POST',
          body: JSON.stringify({
            channel: this.integrations.notifyChannel,
            eventType: this.integrations.notifyEventType,
            payload: { source: 'ui-test' },
          }),
        });
        this.showToast('Notification simulation sent');
      } catch (err) {
        this.showToast(`Notification test failed: ${err.message}`);
      }
    },
    async createWebhook() {
      try {
        await this.api('/api/v1/integrations/webhooks', {
          method: 'POST',
          body: JSON.stringify({
            name: this.integrations.newWebhook.name,
            url: this.integrations.newWebhook.url,
            events: this.integrations.newWebhook.events
              .split(',')
              .map((value) => value.trim())
              .filter(Boolean),
          }),
        });
        await this.loadIntegrations();
      } catch (err) {
        this.showToast(`Webhook creation failed: ${err.message}`);
      }
    },
    async testWebhook(webhookId) {
      try {
        await this.api(`/api/v1/integrations/webhooks/${webhookId}/test`, {
          method: 'POST',
          body: JSON.stringify({ eventType: 'integration.test', payload: { source: 'ui' } }),
        });
        this.showToast('Webhook test dispatched');
      } catch (err) {
        this.showToast(`Webhook test failed: ${err.message}`);
      }
    },
    async deleteWebhook(webhookId) {
      try {
        await this.api(`/api/v1/integrations/webhooks/${webhookId}`, { method: 'DELETE' });
        await this.loadIntegrations();
      } catch (err) {
        this.showToast(`Webhook delete failed: ${err.message}`);
      }
    },
    async addExternalLink() {
      try {
        await this.api(
          `/api/v1/integrations/links/${encodeURIComponent(this.integrations.linkObjectId)}`,
          {
            method: 'POST',
            body: JSON.stringify({
              type: this.integrations.linkType,
              url: this.integrations.linkUrl,
              label: this.integrations.linkType.toUpperCase(),
            }),
          }
        );
        await this.loadLinks();
      } catch (err) {
        this.showToast(`External link add failed: ${err.message}`);
      }
    },
    async loadLinks() {
      try {
        const payload = await this.api(
          `/api/v1/integrations/links/${encodeURIComponent(this.integrations.linkObjectId)}`
        );
        this.integrations.links = payload.data?.links || [];
      } catch (err) {
        this.showToast(`Link load failed: ${err.message}`);
      }
    },
    async removeLink(linkId) {
      try {
        await this.api(
          `/api/v1/integrations/links/${encodeURIComponent(this.integrations.linkObjectId)}/${linkId}`,
          { method: 'DELETE' }
        );
        await this.loadLinks();
      } catch (err) {
        this.showToast(`Link remove failed: ${err.message}`);
      }
    },
    async runPipelineChecks() {
      try {
        const objectIds = [this.selectedObjectId];
        await Promise.all([
          this.api('/api/v1/integrations/cicd/impact-analysis', {
            method: 'POST',
            body: JSON.stringify({ objectIds }),
          }),
          this.api('/api/v1/integrations/cicd/compliance-check', {
            method: 'POST',
            body: JSON.stringify({ objectIds }),
          }),
          this.api('/api/v1/integrations/cicd/post-deploy-docs', {
            method: 'POST',
            body: JSON.stringify({ objectIds }),
          }),
        ]);
        this.showToast('CI/CD checks executed');
      } catch (err) {
        this.showToast(`CI/CD checks failed: ${err.message}`);
      }
    },
    hashText(value) {
      return String(value || '')
        .split('')
        .reduce((hash, char) => (hash * 31 + char.charCodeAt(0)) >>> 0, 0)
        .toString(36);
    },
    normalizeComboboxValue(value) {
      if (typeof value === 'object' && value !== null) {
        return value.value || value.title || '';
      }
      return value || '';
    },
    getSqlServerConnectionSignature() {
      const sql = this.importer.sqlServer;
      return JSON.stringify({
        server: String(sql.server || '').trim().toLowerCase(),
        port: Number(sql.port) || 1433,
        authentication: sql.authentication,
        useIntegratedAuth: Boolean(sql.useIntegratedAuth),
        username: String(sql.username || '').trim().toLowerCase(),
        domain: String(sql.domain || '').trim().toLowerCase(),
        clientId: String(sql.clientId || '').trim().toLowerCase(),
        tenantId: String(sql.tenantId || '').trim().toLowerCase(),
        passwordHash: this.hashText(sql.password),
        clientSecretHash: this.hashText(sql.clientSecret),
        encrypt: Boolean(sql.encrypt),
        trustServerCertificate: Boolean(sql.trustServerCertificate),
      });
    },
    hasSqlServerDatabaseDiscoveryInputs() {
      const sql = this.importer.sqlServer;
      const auth = sql.authentication;
      const hasServer = Boolean(String(sql.server || '').trim());
      if (!hasServer) return false;

      if (auth === 'sql-server') {
        return Boolean(sql.username && sql.password);
      }

      if (auth === 'windows' && !sql.useIntegratedAuth) {
        return Boolean(sql.username && sql.password);
      }

      if (auth === 'azure-ad') {
        return Boolean(sql.clientId && sql.clientSecret && sql.tenantId);
      }

      return true;
    },
    clearSqlServerScopeDiscovery() {
      this.importer.sqlServer.result = null;
      this.importer.sqlServer.showScopeSelector = false;
      this.importer.sqlServer.availableSchemas = [];
      this.importer.sqlServer.selectedSchemas = [];
      this.importer.sqlServer.selectedTables = [];
      this.importer.sqlServer.excludeSchemas = [];
      this.importer.sqlServer.excludeTables = [];
      this.importer.sqlServer.expandedSchemas = {};
      this.importer.sqlServer.schemaTableLists = {};
      this.importer.sqlServer.discoveryTables = [];
      this.importer.sqlServer.discoveredObjectCount = 0;
    },
    clearSqlServerDatabaseDiscovery({ clearDatabase = true } = {}) {
      if (this.importer.sqlServer.databaseDiscoveryTimer) {
        clearTimeout(this.importer.sqlServer.databaseDiscoveryTimer);
        this.importer.sqlServer.databaseDiscoveryTimer = null;
      }

      this.importer.sqlServer.availableDatabases = [];
      this.importer.sqlServer.databaseDiscoveryError = '';
      this.importer.sqlServer.databaseDiscoverySignature = '';
      if (clearDatabase) {
        this.importer.sqlServer.database = '';
      }
    },
    handleSqlServerConnectionChange() {
      const sql = this.importer.sqlServer;
      const nextSignature = this.getSqlServerConnectionSignature();
      const signatureChanged = sql.databaseDiscoverySignature !== nextSignature;

      if (signatureChanged) {
        this.clearSqlServerDatabaseDiscovery({ clearDatabase: true });
        this.clearSqlServerScopeDiscovery();
      }

      if (!this.hasSqlServerDatabaseDiscoveryInputs()) {
        return;
      }

      sql.databaseDiscoveryTimer = setTimeout(() => {
        this.discoverSqlServerDatabases({ force: true, silent: true });
      }, 650);
    },
    validateSqlServerConnectionInputs() {
      const auth = this.importer.sqlServer.authentication;
      const { useIntegratedAuth } = this.importer.sqlServer;

      if (!this.importer.sqlServer.server || !this.importer.sqlServer.database) {
        this.showToast('Server and database are required.');
        return false;
      }

      if (
        auth === 'sql-server' &&
        (!this.importer.sqlServer.username || !this.importer.sqlServer.password)
      ) {
        this.showToast('Username and password are required for this authentication method.');
        return false;
      }

      if (auth === 'windows' && !useIntegratedAuth) {
        const hasUsername = Boolean(this.importer.sqlServer.username);
        const hasPassword = Boolean(this.importer.sqlServer.password);
        if (hasUsername !== hasPassword || !hasUsername) {
          this.showToast('For manual NTLM Windows auth, provide both username and password.');
          return false;
        }
      }

      if (
        auth === 'azure-ad' &&
        (!this.importer.sqlServer.clientId ||
          !this.importer.sqlServer.clientSecret ||
          !this.importer.sqlServer.tenantId)
      ) {
        this.showToast('Client ID, Client Secret, and Tenant ID are required for Azure AD auth.');
        return false;
      }

      return true;
    },
    buildSqlServerPayload() {
      const auth = this.importer.sqlServer.authentication;
      const { useIntegratedAuth } = this.importer.sqlServer;
      const sqlPayload = {
        ...this.importer.sqlServer,
      };

      sqlPayload.database = this.normalizeComboboxValue(sqlPayload.database);

      if (auth === 'windows' && useIntegratedAuth) {
        sqlPayload.username = '';
        sqlPayload.password = '';
        sqlPayload.domain = '';
      }

      return sqlPayload;
    },
    async discoverSqlServerScope() {
      try {
        if (!this.validateSqlServerConnectionInputs()) {
          return;
        }

        this.importer.sqlServer.discovering = true;
        this.importer.sqlServer.result = null;
        this.importer.sqlServer.showScopeSelector = false;
        this.importer.sqlServer.availableSchemas = [];
        this.importer.sqlServer.selectedSchemas = [];
        this.importer.sqlServer.selectedTables = [];
        this.importer.sqlServer.discoveredObjectCount = 0;
        this.importer.sqlServer.expandedSchemas = {};
        this.importer.sqlServer.schemaTableLists = {};

        const payload = await this.api('/api/v1/ingestion/connect-sql-server/discover', {
          method: 'POST',
          body: JSON.stringify(this.buildSqlServerPayload()),
        });

        const schemas = payload?.data?.schemas || [];
        const tables = payload?.data?.tables || [];
        this.importer.sqlServer.availableSchemas = schemas;
        this.importer.sqlServer.discoveryTables = tables;
        this.importer.sqlServer.discoveredObjectCount = payload?.data?.totalObjectCount || 0;
        this.importer.sqlServer.showScopeSelector = true;
        this.importer.sqlServer.selectionMode = 'schema'; // Default to schema mode
        this.showToast(
          `Discovered ${payload?.data?.schemaCount || 0} schemas with ${this.importer.sqlServer.discoveredObjectCount} total objects. Select what to extract.`
        );
      } catch (err) {
        this.showToast(`SQL Server discovery failed: ${err.message}`);
      } finally {
        this.importer.sqlServer.discovering = false;
      }
    },
    async connectSqlServer() {
      try {
        if (!this.validateSqlServerConnectionInputs()) {
          return;
        }

        const isTableMode = this.importer.sqlServer.selectionMode === 'table';
        const hasSchemas =
          this.importer.sqlServer.selectedSchemas &&
          this.importer.sqlServer.selectedSchemas.length > 0;
        const hasTables =
          this.importer.sqlServer.selectedTables &&
          this.importer.sqlServer.selectedTables.length > 0;

        if (!isTableMode && !hasSchemas) {
          this.showToast('Select at least one schema to extract.');
          return;
        }

        if (isTableMode && !hasTables) {
          this.showToast('Select at least one table to extract.');
          return;
        }

        this.importer.sqlServer.connecting = true;
        this.importer.sqlServer.result = null;

        // Build payload with appropriate scope
        const sqlPayload = {
          ...this.buildSqlServerPayload(),
        };

        if (isTableMode) {
          // Table mode: extract specific tables
          sqlPayload.selectedTables = this.importer.sqlServer.selectedTables;
        } else {
          // Schema mode: extract entire schemas
          sqlPayload.selectedSchemas = this.importer.sqlServer.selectedSchemas;
        }
        sqlPayload.excludeSchemas = this.importer.sqlServer.excludeSchemas;
        sqlPayload.excludeTables = this.importer.sqlServer.excludeTables;

        const payload = await this.api('/api/v1/ingestion/connect-sql-server', {
          method: 'POST',
          body: JSON.stringify(sqlPayload),
        });
        this.importer.sqlServer.result = payload.data;
        if (payload.data.markdownOutputPath) {
          this.importer.loadPath = payload.data.markdownOutputPath;
          this.importer.validatePath = payload.data.markdownOutputPath;
        }
        this.importer.sqlServer.showScopeSelector = false;
        const objectSummary = `${payload.data.totalObjectsExtracted} objects (${payload.data.tablesExtracted} tables, ${payload.data.viewsExtracted} views, ${payload.data.proceduresExtracted} procs, ${payload.data.functionsExtracted} functions, ${payload.data.triggersExtracted} triggers)`;
        const frameworkSummary = payload.data.connectorExtraction?.summary;
        const outputHint = payload.data.markdownOutputPath
          ? ` Files saved to ${payload.data.markdownOutputPath}`
          : '';
        this.showToast(
          `SQL Server extraction complete: ${objectSummary}, ${payload.data.relationshipsDetected} relationships, ${frameworkSummary?.event_count || 0} framework event(s).${outputHint}`
        );
      } catch (err) {
        this.showToast(`SQL Server extraction failed: ${err.message}`);
      } finally {
        this.importer.sqlServer.connecting = false;
      }
    },
    buildSqlServerDatabaseDiscoveryPayload() {
      const sql = this.importer.sqlServer;
      return {
        server: sql.server,
        port: sql.port,
        authentication: sql.authentication,
        useIntegratedAuth: sql.useIntegratedAuth,
        username: sql.username,
        password: sql.password,
        domain: sql.domain,
        clientId: sql.clientId,
        clientSecret: sql.clientSecret,
        tenantId: sql.tenantId,
        encrypt: sql.encrypt,
        trustServerCertificate: sql.trustServerCertificate,
      };
    },
    async discoverSqlServerDatabases({ force = false, silent = false } = {}) {
      let requestId = null;
      try {
        if (this.importer.sqlServer.databaseDiscoveryTimer) {
          clearTimeout(this.importer.sqlServer.databaseDiscoveryTimer);
          this.importer.sqlServer.databaseDiscoveryTimer = null;
        }

        if (!this.hasSqlServerDatabaseDiscoveryInputs()) {
          if (!silent) {
            this.showToast('Enter server and authentication details before discovering databases.');
          }
          return;
        }

        const signature = this.getSqlServerConnectionSignature();
        requestId = this.importer.sqlServer.databaseDiscoveryRequestId + 1;
        this.importer.sqlServer.databaseDiscoveryRequestId = requestId;
        const alreadyLoaded =
          this.importer.sqlServer.databaseDiscoverySignature === signature &&
          this.importer.sqlServer.availableDatabases.length > 0;

        if (alreadyLoaded && !force) {
          return;
        }

        this.importer.sqlServer.discoveringDatabases = true;
        this.importer.sqlServer.databaseDiscoveryError = '';

        const payload = await this.api('/api/v1/ingestion/connect-sql-server/databases', {
          method: 'POST',
          body: JSON.stringify(this.buildSqlServerDatabaseDiscoveryPayload()),
        });

        if (
          requestId !== this.importer.sqlServer.databaseDiscoveryRequestId ||
          signature !== this.getSqlServerConnectionSignature()
        ) {
          return;
        }

        const databases = (payload?.data?.databases || []).map((db) => ({
          title: db,
          value: db,
        }));
        this.importer.sqlServer.availableDatabases = databases;
        this.importer.sqlServer.databaseDiscoverySignature = signature;

        const currentDatabase = this.normalizeComboboxValue(this.importer.sqlServer.database);
        const hasCurrentDatabase = databases.some((db) => db.value === currentDatabase);
        if (currentDatabase && !hasCurrentDatabase) {
          this.importer.sqlServer.database = '';
        }

        if (databases.length > 0 && !silent) {
          this.showToast(`Discovered ${databases.length} database(s). Select one to continue.`);
        } else if (databases.length === 0 && !silent) {
          this.showToast('No databases were found. You can still type a database name manually.');
        }
      } catch (err) {
        if (requestId !== this.importer.sqlServer.databaseDiscoveryRequestId) {
          return;
        }
        this.importer.sqlServer.availableDatabases = [];
        this.importer.sqlServer.databaseDiscoveryError = err.message;
        console.warn('Database discovery failed:', err.message);
        if (!silent) {
          this.showToast(`Database discovery failed: ${err.message}`);
        }
      } finally {
        if (requestId === this.importer.sqlServer.databaseDiscoveryRequestId) {
          this.importer.sqlServer.discoveringDatabases = false;
        }
      }
    },

    validateSsisConnectionInputs() {
      const auth = this.importer.ssis.authentication;
      const { useIntegratedAuth } = this.importer.ssis;

      if (!this.importer.ssis.server) {
        this.showToast('Server is required for SSIS extraction.');
        return false;
      }

      if (auth === 'sql-server' && (!this.importer.ssis.username || !this.importer.ssis.password)) {
        this.showToast('Username and password are required for SQL Server auth.');
        return false;
      }

      if (auth === 'windows' && !useIntegratedAuth) {
        const hasUsername = Boolean(this.importer.ssis.username);
        const hasPassword = Boolean(this.importer.ssis.password);
        if (hasUsername !== hasPassword || !hasUsername) {
          this.showToast('For manual NTLM Windows auth, provide both username and password.');
          return false;
        }
      }

      if (
        auth === 'azure-ad' &&
        (!this.importer.ssis.clientId ||
          !this.importer.ssis.clientSecret ||
          !this.importer.ssis.tenantId)
      ) {
        this.showToast('Client ID, Client Secret, and Tenant ID are required for Azure AD auth.');
        return false;
      }

      return true;
    },

    buildSsisPayload() {
      const auth = this.importer.ssis.authentication;
      const { useIntegratedAuth } = this.importer.ssis;
      const payload = { ...this.importer.ssis };

      // Clear credentials if using Integrated Auth
      if (auth === 'windows' && useIntegratedAuth) {
        payload.username = '';
        payload.password = '';
        payload.domain = '';
      }

      // Structure the options exactly how the backend expects them
      payload.options = {
        historyDays: this.importer.ssis.historyDays,
        phaseDays: this.importer.ssis.phaseDays,
        extractXml: this.importer.ssis.extractXml,
      };

      return payload;
    },

    async discoverSsisCatalog() {
      try {
        if (!this.validateSsisConnectionInputs()) return;

        this.importer.ssis.discovering = true;
        this.importer.ssis.inventory = null;

        const payload = await this.api('/api/v1/ssis/catalog', {
          method: 'POST',
          body: JSON.stringify(this.buildSsisPayload()),
        });

        this.importer.ssis.inventory = payload;

        if (!payload.ssisdbPresent) {
          this.showToast('Connected, but SSISDB catalog is not present on this server.');
        } else {
          this.showToast(
            `Found SSISDB with ${payload.packageCount} packages and ${payload.executables?.length || 0} executables.`
          );
        }
      } catch (err) {
        this.showToast(`SSIS discovery failed: ${err.message}`);
      } finally {
        this.importer.ssis.discovering = false;
      }
    },

    async runSsisExtraction() {
      try {
        if (!this.validateSsisConnectionInputs()) return;

        this.importer.ssis.connecting = true;
        this.importer.ssis.result = null;

        const payload = await this.api('/api/v1/ssis/extract', {
          method: 'POST',
          body: JSON.stringify(this.buildSsisPayload()),
        });

        this.importer.ssis.result = payload;

        // Auto-fill the load/validate paths so the user can immediately index the results
        if (payload.markdownOutputPath) {
          this.importer.loadPath = payload.markdownOutputPath;
          this.importer.validatePath = payload.markdownOutputPath;
        }

        const summary = payload.summary?.counts || {};
        const frameworkSummary = payload.connectorExtraction?.summary;
        this.showToast(
          `SSIS extraction complete: ${summary.packages || 0} packages, ${summary.lineageEdges || 0} edges detected, ${frameworkSummary?.event_count || 0} framework event(s). Raw XML dump is always enabled.`
        );
      } catch (err) {
        const detail = err?.details ? ` ${err.details}` : '';
        this.showToast(`SSIS extraction failed: ${err.message}${detail}`);
      } finally {
        this.importer.ssis.connecting = false;
      }
    },

    validateDataFactoryInputs() {
      const cfg = this.importer.dataFactory;
      if (!cfg.subscriptionId || !cfg.resourceGroupName || !cfg.factoryName) {
        this.showToast('Subscription ID, resource group, and factory name are required.');
        return false;
      }
      if (!cfg.accessToken && (!cfg.tenantId || !cfg.clientId || !cfg.clientSecret)) {
        this.showToast('Provide an access token or tenant/client credentials for Data Factory.');
        return false;
      }
      return true;
    },
    buildDataFactoryPayload() {
      return {
        ...this.importer.dataFactory,
        outputPath: this.importer.validatePath || './data/markdown',
      };
    },
    async discoverDataFactory() {
      try {
        if (!this.validateDataFactoryInputs()) return;
        this.importer.dataFactory.discovering = true;
        this.importer.dataFactory.inventory = null;
        const payload = await this.api('/api/v1/ingestion/connect-data-factory/discover', {
          method: 'POST',
          body: JSON.stringify(this.buildDataFactoryPayload()),
        });
        this.importer.dataFactory.inventory = payload.data;
        this.showToast(
          `Discovered ${payload.data.pipelines?.length || 0} ADF pipelines, ${payload.data.datasets?.length || 0} datasets.`
        );
      } catch (err) {
        this.showToast(`Data Factory discovery failed: ${err.message}`);
      } finally {
        this.importer.dataFactory.discovering = false;
      }
    },
    async runDataFactoryExtraction() {
      try {
        if (!this.validateDataFactoryInputs()) return;
        this.importer.dataFactory.connecting = true;
        this.importer.dataFactory.result = null;
        const payload = await this.api('/api/v1/ingestion/connect-data-factory', {
          method: 'POST',
          body: JSON.stringify(this.buildDataFactoryPayload()),
        });
        this.importer.dataFactory.result = payload.data;
        if (payload.data.markdownOutputPath) {
          this.importer.validatePath = payload.data.markdownOutputPath;
          this.importer.loadPath = payload.data.markdownOutputPath;
        }
        this.showToast(
          `Data Factory extraction complete: ${payload.data.pipelines?.length || 0} pipelines, ${payload.data.markdownFilesWritten || 0} markdown files.`
        );
      } catch (err) {
        this.showToast(`Data Factory extraction failed: ${err.message}`);
      } finally {
        this.importer.dataFactory.connecting = false;
      }
    },

    validateAirflowInputs() {
      if (!this.importer.airflow.baseUrl) {
        this.showToast('Airflow base URL is required.');
        return false;
      }
      return true;
    },
    buildAirflowPayload() {
      return {
        ...this.importer.airflow,
        outputPath: this.importer.validatePath || './data/markdown',
      };
    },
    async discoverAirflow() {
      try {
        if (!this.validateAirflowInputs()) return;
        this.importer.airflow.discovering = true;
        this.importer.airflow.inventory = null;
        const payload = await this.api('/api/v1/ingestion/connect-airflow/discover', {
          method: 'POST',
          body: JSON.stringify(this.buildAirflowPayload()),
        });
        this.importer.airflow.inventory = payload.data;
        this.showToast(
          `Discovered ${payload.data.dags?.length || 0} Airflow DAGs and ${payload.data.connections?.length || 0} connections.`
        );
      } catch (err) {
        this.showToast(`Airflow discovery failed: ${err.message}`);
      } finally {
        this.importer.airflow.discovering = false;
      }
    },
    async runAirflowExtraction() {
      try {
        if (!this.validateAirflowInputs()) return;
        this.importer.airflow.connecting = true;
        this.importer.airflow.result = null;
        const payload = await this.api('/api/v1/ingestion/connect-airflow', {
          method: 'POST',
          body: JSON.stringify(this.buildAirflowPayload()),
        });
        this.importer.airflow.result = payload.data;
        if (payload.data.markdownOutputPath) {
          this.importer.validatePath = payload.data.markdownOutputPath;
          this.importer.loadPath = payload.data.markdownOutputPath;
        }
        this.showToast(
          `Airflow extraction complete: ${payload.data.dags?.length || 0} DAGs, ${payload.data.markdownFilesWritten || 0} markdown files.`
        );
      } catch (err) {
        this.showToast(`Airflow extraction failed: ${err.message}`);
      } finally {
        this.importer.airflow.connecting = false;
      }
    },

    validateDatabricksInputs() {
      if (!this.importer.databricks.workspaceUrl || !this.importer.databricks.token) {
        this.showToast('Databricks workspace URL and token are required.');
        return false;
      }
      return true;
    },
    buildDatabricksPayload() {
      return {
        ...this.importer.databricks,
        outputPath: this.importer.validatePath || './data/markdown',
      };
    },
    async discoverDatabricks() {
      try {
        if (!this.validateDatabricksInputs()) return;
        this.importer.databricks.discovering = true;
        this.importer.databricks.inventory = null;
        const payload = await this.api('/api/v1/ingestion/connect-databricks/discover', {
          method: 'POST',
          body: JSON.stringify(this.buildDatabricksPayload()),
        });
        this.importer.databricks.inventory = payload.data;
        this.showToast(
          `Discovered ${payload.data.jobs?.length || 0} Databricks jobs and ${payload.data.catalogs?.length || 0} catalogs.`
        );
      } catch (err) {
        this.showToast(`Databricks discovery failed: ${err.message}`);
      } finally {
        this.importer.databricks.discovering = false;
      }
    },
    async runDatabricksExtraction() {
      try {
        if (!this.validateDatabricksInputs()) return;
        this.importer.databricks.connecting = true;
        this.importer.databricks.result = null;
        const payload = await this.api('/api/v1/ingestion/connect-databricks', {
          method: 'POST',
          body: JSON.stringify(this.buildDatabricksPayload()),
        });
        this.importer.databricks.result = payload.data;
        if (payload.data.markdownOutputPath) {
          this.importer.validatePath = payload.data.markdownOutputPath;
          this.importer.loadPath = payload.data.markdownOutputPath;
        }
        this.showToast(
          `Databricks extraction complete: ${payload.data.jobs?.length || 0} jobs, ${payload.data.markdownFilesWritten || 0} markdown files.`
        );
      } catch (err) {
        this.showToast(`Databricks extraction failed: ${err.message}`);
      } finally {
        this.importer.databricks.connecting = false;
      }
    },

    toggleAllSqlServerSchemas(selectAll) {
      if (selectAll) {
        this.importer.sqlServer.selectedSchemas = this.importer.sqlServer.availableSchemas.map(
          (schema) => schema.schemaName
        );
      } else {
        this.importer.sqlServer.selectedSchemas = [];
      }
    },
    selectTopSqlServerSchemas() {
      const parsedTopN = Number(this.importer.sqlServer.topSchemaCount);
      const topN = Number.isFinite(parsedTopN) ? Math.max(1, Math.floor(parsedTopN)) : 1;

      const topSchemas = [...this.importer.sqlServer.availableSchemas]
        .sort((a, b) => (b.totalObjectCount || 0) - (a.totalObjectCount || 0))
        .slice(0, topN)
        .map((schema) => schema.schemaName);

      this.importer.sqlServer.selectedSchemas = topSchemas;
      this.showToast(`Selected top ${topSchemas.length} schema(s) by object count.`);
    },
    cancelSqlServerScopeSelection() {
      this.importer.sqlServer.showScopeSelector = false;
    },
    toggleSqlServerSchemaExpand(schemaName) {
      if (!this.importer.sqlServer.expandedSchemas) {
        this.importer.sqlServer.expandedSchemas = {};
      }
      const currentState = this.importer.sqlServer.expandedSchemas[schemaName];
      this.importer.sqlServer.expandedSchemas[schemaName] = !currentState;

      // Lazy-load tables for this schema if not already loaded
      if (
        this.importer.sqlServer.expandedSchemas[schemaName] &&
        !this.importer.sqlServer.schemaTableLists[schemaName]
      ) {
        this.loadTablesForSchema(schemaName);
      }
    },
    loadTablesForSchema(schemaName) {
      // Extract tables from the discovery tables list
      const tablesInSchema = (this.importer.sqlServer.discoveryTables || [])
        .filter((table) => table.schema === schemaName)
        .sort((a, b) => a.name.localeCompare(b.name));

      if (!this.importer.sqlServer.schemaTableLists) {
        this.importer.sqlServer.schemaTableLists = {};
      }
      this.importer.sqlServer.schemaTableLists[schemaName] = tablesInSchema;
    },
    toggleSchemaTableSelection(schemaName, event) {
      if (event.target.checked) {
        // Select all tables in schema
        const tables = this.importer.sqlServer.schemaTableLists[schemaName] || [];
        const tableIds = tables.map((t) => `${schemaName}.${t.name}`);
        this.importer.sqlServer.selectedTables = [
          ...new Set([...this.importer.sqlServer.selectedTables, ...tableIds]),
        ];
      } else {
        // Deselect all tables in schema
        const tables = this.importer.sqlServer.schemaTableLists[schemaName] || [];
        const tablesToRemove = new Set(tables.map((t) => `${schemaName}.${t.name}`));
        this.importer.sqlServer.selectedTables = this.importer.sqlServer.selectedTables.filter(
          (id) => !tablesToRemove.has(id)
        );
      }
    },
    isSchemaFullySelected(schemaName) {
      const tables = this.importer.sqlServer.schemaTableLists[schemaName] || [];
      if (tables.length === 0) return false;
      const tableIds = tables.map((t) => `${schemaName}.${t.name}`);
      return tableIds.every((id) => this.importer.sqlServer.selectedTables.includes(id));
    },
    async handleFileUpload(event) {
      const files = Array.from(event.target.files || []);
      this.importer.files = files;
      this.importer.parsed = [];

      const parsedEntries = await Promise.all(
        files.map(async (file) => {
          try {
            const content = await file.text();
            const payload = await this.api('/api/v1/ingestion/parse-content', {
              method: 'POST',
              body: JSON.stringify({ content, fileName: file.name }),
            });

            return {
              fileName: file.name,
              status: 'valid',
              objectId: payload.data.id,
              database: payload.data.database,
              type: payload.data.type,
            };
          } catch (err) {
            return {
              fileName: file.name,
              status: 'invalid',
              error: err.message,
            };
          }
        })
      );

      this.importer.parsed = parsedEntries;
    },
    async runValidation() {
      try {
        if (this.importer.validatePath === './docs' && this.importer.status?.lastGeneratedPath) {
          this.importer.validatePath = this.importer.status.lastGeneratedPath;
        }
        const payload = await this.api('/api/v1/ingestion/validate', {
          method: 'POST',
          body: JSON.stringify({ dataPath: this.importer.validatePath }),
        });
        this.importer.validationResult = payload.data;
        this.showToast(
          `Validation complete: ${payload.data.valid} valid / ${payload.data.invalid} invalid`
        );
      } catch (err) {
        this.showToast(`Validation failed: ${err.message}`);
      }
    },
    async runLoad() {
      try {
        if (!this.canLoadToIndex) {
          const esUrl = this.importer.status?.elasticsearchUrl || 'https://localhost:9200';
          this.showToast(`Load blocked: Elasticsearch index is unavailable at ${esUrl}. Verify service status and retry.`);
          return;
        }
        if (this.importer.loadPath === './docs' && this.importer.status?.lastGeneratedPath) {
          this.importer.loadPath = this.importer.status.lastGeneratedPath;
        }
        const payload = await this.api('/api/v1/ingestion/load', {
          method: 'POST',
          body: JSON.stringify({ dataPath: this.importer.loadPath }),
        });
        this.importer.lastLoadStats = payload.stats;
        this.showToast(`Load complete: ${payload.stats.totalObjects} objects indexed`);
        await this.detectRealDataAvailability();
        await this.bootstrapData();
      } catch (err) {
        this.showToast(`Load failed: ${err.message}`);
      }
    },
    async downloadGeneratedMarkdownZip() {
      try {
        const sourcePath =
          this.importer.loadPath || this.importer.validatePath || './docs/generated/sqlserver';
        const url = `/api/v1/ingestion/export-zip?dataPath=${encodeURIComponent(sourcePath)}`;
        await this.downloadProtected(url, 'sqlserver-markdown.zip');
      } catch (err) {
        this.showToast(`Zip export failed: ${err.message}`);
      }
    },
    async loadImportStatus(silent = false) {
      try {
        const payload = await this.api('/api/v1/ingestion/status');
        this.importer.status = payload.data;
        if (this.importer.status?.lastGeneratedPath) {
          if (this.importer.validatePath === './docs') {
            this.importer.validatePath = this.importer.status.lastGeneratedPath;
          }
          if (this.importer.loadPath === './docs') {
            this.importer.loadPath = this.importer.status.lastGeneratedPath;
          }
        }
      } catch (err) {
        if (!silent) {
          this.showToast(`Status load failed: ${err.message}`);
        }
      }
    },
    async loadAdmin() {
      try {
        const [users, audit, dashUsers, dashHealth, dashSettings] = await Promise.all([
          this.api('/api/v1/admin/users'),
          this.api('/api/v1/dashboard/audit'),
          this.api('/api/v1/dashboard/users'),
          this.api('/api/v1/dashboard/health'),
          this.api('/api/v1/dashboard/settings'),
        ]);
        this.admin.users = users.data?.users || [];
        this.admin.audit = audit.events || [];
        this.admin.dashboardUsers = dashUsers;
        this.admin.dashboardHealth = dashHealth;
        this.admin.dashboardSettings = dashSettings;
      } catch (err) {
        if (this.demoModeEnabled && !this.hasRealData) {
          this.admin.users = [
            {
              userId: 'demo-admin',
              name: 'Platform Admin',
              email: 'admin@platform.local',
              role: 'Admin',
              active: true,
            },
          ];
          this.admin.audit = [
            {
              timestamp: new Date().toISOString(),
              userName: 'Platform Admin',
              action: 'demo_mode_enabled',
              details: { source: 'ui-fallback' },
            },
          ];
          return;
        }
        this.showToast(`Admin data unavailable: ${err.message}`);
      }
    },
    async createUser() {
      try {
        await this.api('/api/v1/admin/users', {
          method: 'POST',
          body: JSON.stringify(this.admin.newUser),
        });
        this.showToast('User created');
        await this.loadAdmin();
      } catch (err) {
        this.showToast(`Create user failed: ${err.message}`);
      }
    },
    async updateUserRole(user) {
      try {
        await this.api(`/api/v1/admin/users/${user.userId}`, {
          method: 'PUT',
          body: JSON.stringify({ role: user.role }),
        });
        this.showToast(`Role updated for ${user.email}`);
      } catch (err) {
        this.showToast(`Role update failed: ${err.message}`);
      }
    },
    async deactivateUser(userId) {
      try {
        await this.api(`/api/v1/admin/users/${userId}/deactivate`, { method: 'POST' });
        await this.loadAdmin();
      } catch (err) {
        this.showToast(`Deactivate failed: ${err.message}`);
      }
    },
    async reactivateUser(userId) {
      try {
        await this.api(`/api/v1/admin/users/${userId}/reactivate`, { method: 'POST' });
        await this.loadAdmin();
      } catch (err) {
        this.showToast(`Reactivate failed: ${err.message}`);
      }
    },
    async deleteUser(userId) {
      try {
        await this.api(`/api/v1/admin/users/${userId}`, { method: 'DELETE' });
        await this.loadAdmin();
      } catch (err) {
        this.showToast(`Delete failed: ${err.message}`);
      }
    },
    roleClass(role) {
      return `badge ${String(role || '').toLowerCase()}`;
    },
    async onViewChange(view) {
      this.activeView = view;
      this.closeMobileSidebar();
      await this.loadActiveViewData(view);
    },
  },
  async mounted() {
    // Auto-initialize: if no token, enable demo mode; otherwise try to load real data
    const params = new URLSearchParams(window.location.search || '');
    const requestedView = params.get('view');
    const requestedObject = params.get('object');
    const requestedFormat = params.get('format');
    const requestedDepth = Number.parseInt(params.get('depth') || '', 10);
    if (requestedObject) {
      this.selectedObjectId = requestedObject;
    }
    if (
      requestedFormat === 'centered' ||
      requestedFormat === 'cytoscape' ||
      requestedFormat === 'mermaid'
    ) {
      this.discoveryFormat = requestedFormat;
    }
    if (Number.isFinite(requestedDepth) && requestedDepth > 0) {
      this.discoveryDepth = Math.min(Math.max(requestedDepth, 1), 5);
    }
    if (
      requestedView &&
      [
        'discovery',
        'lineageAsk',
        'browse',
        'overview',
        'reports',
        'glossary',
        'products',
        'governance',
        'integrations',
        'import',
        'scheduler',
        'docs',
        'admin',
      ].includes(requestedView)
    ) {
      this.activeView = requestedView;
    }
    if (!this.token || this.token === '') {
      this.setDemoMode(true);
    } else {
      await this.bootstrapData();
    }
    if (this.activeView === 'discovery' && this.selectedObjectId) {
      await nextTick();
      this.loadDiscovery();
    }
  },
  beforeUnmount() {
    if (this.browseSearchDebounceTimer) {
      clearTimeout(this.browseSearchDebounceTimer);
      this.browseSearchDebounceTimer = null;
    }
    if (this.graphAnimationFrame) {
      cancelAnimationFrame(this.graphAnimationFrame);
      this.graphAnimationFrame = null;
    }
    this.stopImportStatusPolling();
  },
  template: `
    <v-app>
      <v-snackbar v-model="toast.show" :timeout="3800" location="bottom right" color="surface" variant="elevated">
        {{ toast.message }}
      </v-snackbar>
      <div v-if="!isAuthenticated" class="login-page">
        <div class="login-card">
          <h1>Data Governance Platform</h1>
          <p class="subtitle">Unified 2026-ready interface for lineage, governance, reporting, and imports.</p>
          <div class="login-grid">
            <v-text-field
              v-model="email"
              placeholder="Enter email (use admin@platform.local for full access)"
              density="comfortable"
              variant="outlined"
              hide-details
            ></v-text-field>
            <v-btn color="primary" @click="login">Sign In</v-btn>
          </div>
          <p class="dev-hint">Developer login uses role-based email mapping to unlock full admin experience.</p>
        </div>
      </div>

      <v-layout v-else class="app-shell" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <v-navigation-drawer
          class="sidebar"
          style="backdrop-filter: blur(12px); background: linear-gradient(180deg, rgba(2,6,23,0.96), rgba(15,23,42,0.82)); border-right: 1px solid rgba(255,255,255,0.08); box-shadow: 0 24px 60px rgba(2,6,23,0.35);"
          theme="dark"
          :model-value="$vuetify.display.smAndDown ? mobileSidebarOpen : true"
          @update:model-value="handleDrawerModelUpdate"
          :permanent="!$vuetify.display.smAndDown"
          :temporary="$vuetify.display.smAndDown"
          :rail="sidebarCollapsed && !$vuetify.display.smAndDown"
          width="216"
        >
          <div class="brand">
            <div class="brand-icon"><v-icon>mdi-hexagonal-outline</v-icon></div>
            <div v-if="!sidebarCollapsed || $vuetify.display.smAndDown" class="brand-text">
              <h2>DataGov</h2>
              <p>Enterprise Platform</p>
            </div>
          </div>

          <v-list density="compact" nav class="nav-list">
            <div v-for="section in navSections" :key="section.key" class="nav-section">
              <div v-if="!sidebarCollapsed || $vuetify.display.smAndDown" class="nav-section-label">{{ section.label }}</div>
              <v-list-item
                v-for="item in section.items"
                :key="item.key"
                class="nav-btn"
                :class="{ active: activeView === item.key }"
                @click="onViewChange(item.key)"
              >
                <template #prepend>
                  <v-icon start class="mr-2">{{ item.icon }}</v-icon>
                </template>
                <v-list-item-title v-if="!sidebarCollapsed || $vuetify.display.smAndDown">{{ item.label }}</v-list-item-title>
              </v-list-item>
            </div>
          </v-list>

          <template #append>
            <div class="sidebar-footer" v-if="!sidebarCollapsed || $vuetify.display.smAndDown">DataGov v3 · 2026</div>
          </template>
        </v-navigation-drawer>

        <v-main class="main">
          <v-app-bar class="topbar" flat>
            <div class="topbar-left">
              <div class="topbar-nav-controls">
                <v-btn v-if="$vuetify.display.smAndDown" icon="mdi-menu" variant="text" size="small" @click="toggleMobileSidebar" title="Open navigation"></v-btn>
                <v-btn v-else icon variant="text" size="small" @click="toggleSidebar" title="Collapse sidebar">
                  <v-icon>{{ sidebarCollapsed ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
                </v-btn>
              </div>
              <div class="topbar-title-block">
                <div class="topbar-kicker">{{ activeNavSection?.label || 'Workspace' }}</div>
                <h4>{{ activePageMeta.title }}</h4>
                <div class="user-meta">{{ currentUser?.email }} · {{ (currentUser?.roles || []).join(', ') }}</div>
              </div>
            </div>
            <div class="d-flex align-center" style="gap: 12px; flex-wrap: wrap;">
              <v-btn class="pill-action-btn" color="primary" size="small" @click="runRecommendedWorkflowAction">Run Next Step</v-btn>
              <v-chip size="small" variant="flat" :color="demoModeEnabled ? 'info' : 'blue-grey-lighten-4'" :class="demoModeEnabled ? 'font-weight-bold' : 'text-blue-grey-darken-4 font-weight-bold'">
                {{ demoModeEnabled ? 'Demo Data: ON' : 'Demo Data: OFF' }}
              </v-chip>
              <v-btn v-if="!hasRealData" class="pill-action-btn secondary" size="small" variant="tonal" @click="setDemoMode(!demoModeEnabled)">
                {{ demoModeEnabled ? 'Disable Demo Data' : 'Enable Demo Data' }}
              </v-btn>
              <v-btn class="pill-action-btn secondary" size="small" variant="tonal" @click="bootstrapData">Refresh All</v-btn>
              <v-menu location="bottom end" :close-on-content-click="false" offset="8">
                <template #activator="{ props }">
                  <v-btn
                    v-bind="props"
                    icon
                    variant="text"
                    size="small"
                    class="profile-trigger"
                    :title="currentUser?.email || 'Profile'"
                  >
                    <v-avatar class="profile-avatar" size="30">{{ profileInitials }}</v-avatar>
                  </v-btn>
                </template>

                <v-card class="profile-menu-card" min-width="360" elevation="6">
                  <div class="profile-menu-header">
                    <v-avatar class="profile-avatar" size="38">{{ profileInitials }}</v-avatar>
                    <div class="profile-identity">
                      <strong>{{ currentUser?.name || currentUser?.email || 'User' }}</strong>
                      <span>{{ currentUser?.email || 'No email available' }}</span>
                    </div>
                  </div>

                  <div class="profile-role-row">
                    <v-chip
                      v-for="role in (currentUser?.roles || ['Viewer'])"
                      :key="role"
                      size="x-small"
                      variant="tonal"
                    >{{ role }}</v-chip>
                  </div>

                  <div class="profile-section">
                    <h5>Session Rundown</h5>
                    <div class="profile-info-grid">
                      <div class="profile-info-item" v-for="item in profileOverviewRows" :key="item.label">
                        <span>{{ item.label }}</span>
                        <strong>{{ item.value }}</strong>
                      </div>
                    </div>
                  </div>

                  <div class="profile-section">
                    <h5>Token Center</h5>
                    <v-switch
                      v-model="showProfileSecrets"
                      density="compact"
                      hide-details
                      inset
                      :label="showProfileSecrets ? 'Hide full tokens' : 'Show full tokens'"
                    ></v-switch>

                    <div class="profile-token-block">
                      <span>Access Token</span>
                      <code>{{ accessTokenPreview }}</code>
                    </div>
                    <div class="profile-token-block">
                      <span>Refresh Token</span>
                      <code>{{ refreshTokenPreview }}</code>
                    </div>

                    <div class="btn-row" style="margin-top:8px;">
                      <v-btn size="small" variant="tonal" @click="copyTextToClipboard(token, 'Access token')">Copy Access</v-btn>
                      <v-btn size="small" variant="tonal" @click="copyTextToClipboard(refreshToken, 'Refresh token')">Copy Refresh</v-btn>
                      <v-btn
                        size="small"
                        color="primary"
                        variant="tonal"
                        :loading="isRefreshingToken"
                        :disabled="isRefreshingToken || !refreshToken"
                        @click="refreshAccessTokenFromProfile"
                      >Refresh Token</v-btn>
                    </div>
                  </div>

                  <div class="profile-footer">
                    <v-btn size="small" variant="outlined" @click="loadProfile">Sync Profile</v-btn>
                    <v-btn
                      size="small"
                      color="secondary"
                      variant="tonal"
                      :loading="isLoggingOut"
                      :disabled="isLoggingOut"
                      @click="logout"
                    >Logout</v-btn>
                  </div>
                </v-card>
              </v-menu>
            </div>
          </v-app-bar>

          <v-container fluid :class="['content', 'workflow-surface', 'page-' + activeView]">
            <section class="page-intro">
              <div class="page-intro-main">
                <span class="page-kicker">{{ activePageMeta.workflow }}</span>
                <h1>{{ activePageMeta.title }}</h1>
                <p>{{ activePageMeta.subtitle }}</p>
              </div>
              <div class="page-intro-actions">
                <v-chip size="small" variant="flat" color="primary">{{ workflowProgressPercent }}% pipeline</v-chip>
                <v-chip size="small" variant="tonal" :color="isElasticsearchHealthy ? 'success' : 'warning'">{{ elasticsearchStatusLabel }}</v-chip>
                <v-btn
                  v-for="action in pageQuickActions"
                  :key="'page-action-' + action.view"
                  size="small"
                  variant="outlined"
                  :prepend-icon="action.icon"
                  @click="onViewChange(action.view)"
                >{{ action.label }}</v-btn>
              </div>
            </section>

            <div class="telemetry-banner">
              <div class="telemetry-card">
                <span>Ingestion Health</span>
                <strong>{{ importer.status?.status || 'monitoring' }}</strong>
              </div>
              <div class="telemetry-card">
                <span>Pipeline Progress</span>
                <strong>{{ workflowProgressPercent }}%</strong>
              </div>
              <div class="telemetry-card">
                <span>Search Index</span>
                <strong>{{ elasticsearchStatusLabel }}</strong>
              </div>
            </div>

            <div v-if="activeView === 'overview'">
              <div class="search-hero" style="margin-bottom:14px;">
                <h2>🔍 Find anything in your data catalog</h2>
                <p>Search tables, views, procedures, functions — all in one place</p>
                <div class="search-bar-wrap">
                  <v-text-field
                    v-model="browseQuery"
                    placeholder="Search objects, owners, schemas, tags..."
                    density="comfortable"
                    variant="outlined"
                    hide-details
                    @keyup.enter="onViewChange('browse'); $nextTick(runSearch)"
                  ></v-text-field>
                  <v-btn color="primary" @click="onViewChange('browse'); $nextTick(runSearch)">Search</v-btn>
                </div>
                <div class="search-hint">&#x2318;K &nbsp;·&nbsp; Try: "sales", "revenue", a table name, or an owner</div>
              </div>

              <v-row dense>
                <v-col cols="12">
                  <v-card variant="outlined" style="padding:12px 16px;">
                    <div class="section-header" style="margin-bottom:10px;">
                      <span class="section-title">{{ resolvedPersona.charAt(0).toUpperCase() + resolvedPersona.slice(1) }} Dashboard</span>
                    </div>

                    <v-row dense>
                      <v-col cols="12" sm="6" md="4">
                        <v-select
                          label="Dashboard Persona"
                          density="compact"
                          variant="outlined"
                          :items="personaOptions"
                          item-title="label"
                          item-value="value"
                          :model-value="reports.persona"
                          @update:model-value="setPersona"
                        ></v-select>
                      </v-col>
                      <v-col cols="12" sm="6" md="8" class="d-flex align-center" style="gap:8px;flex-wrap:wrap;">
                        <v-chip
                          v-for="item in personaQuickActions"
                          :key="'persona-action-' + item.label"
                          size="small"
                          color="primary"
                          variant="tonal"
                          style="cursor:pointer;"
                          @click="runPersonaQuickAction(item)"
                        >{{ item.label }}</v-chip>
                      </v-col>
                    </v-row>

                    <v-row dense style="margin-top:8px;">
                      <v-col v-for="kpi in personaKpis" :key="'persona-kpi-' + kpi.label" cols="12" xs="6" sm="4" md="3">
                        <v-card variant="outlined" class="kpi">
                          <div class="value">{{ kpi.value }}</div>
                          <div class="label">{{ kpi.label }}</div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="12" md="7" lg="8">
                  <v-card variant="outlined">
                    <v-card-title style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);margin-bottom:12px;">Quality Radar</v-card-title>
                    <v-card-text style="min-height:290px;">
                      <div class="quality-radar-bars" v-if="qualityRadarSignals.length">
                        <div
                          v-for="signal in qualityRadarSignals"
                          :key="'quality-radar-' + signal.key"
                          class="quality-radar-row"
                        >
                          <div class="quality-radar-label">
                            <strong>{{ signal.label }}</strong>
                            <span>{{ signal.value }}</span>
                          </div>
                          <div class="quality-radar-track">
                            <div
                              class="quality-radar-fill"
                              :class="signal.passing ? 'pass' : 'gap'"
                              :style="{ width: Math.max(3, Number(signal.percentage || 0)) + '%' }"
                            ></div>
                          </div>
                          <div class="quality-radar-score">{{ signal.percentage || 0 }}%</div>
                        </div>
                      </div>
                      <div v-else class="empty">Load data to see quality signals.</div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="12" md="5" lg="4">
                  <v-card variant="outlined">
                    <v-card-title style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);margin-bottom:12px;">Persona Insights</v-card-title>
                    <v-card-text>
                      <ul class="persona-insight-list">
                        <li v-for="insight in personaInsights" :key="'insight-' + insight">{{ insight }}</li>
                      </ul>

                      <h4 style="margin:12px 0 8px;font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;">Quality Checks</h4>
                      <div class="check-list" v-if="quality && (quality.signals?.length || quality.checks)">
                        <div v-for="signal in (quality.signals || [])" :key="signal.key" class="check-item" :class="signal.passing ? 'pass' : 'fail'">
                          <span v-if="signal.passing" class="check-icon">&#10003;</span>
                          <span v-else class="check-icon">&#10007;</span>
                          <span class="check-label">{{ signal.label }} · {{ signal.value }}</span>
                          <v-chip size="x-small" :class="signal.passing ? 'analyst' : 'admin'" variant="flat">{{ signal.percentage }}%</v-chip>
                        </div>
                        <div v-if="!(quality.signals || []).length" v-for="(val, key) in quality.checks" :key="key" class="check-item" :class="val ? 'pass' : 'fail'">
                          <span v-if="val" class="check-icon">&#10003;</span>
                          <span v-else class="check-icon">&#10007;</span>
                          <span class="check-label">{{ key.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase()) }}</span>
                          <v-chip size="x-small" :class="val ? 'analyst' : 'admin'" variant="flat">{{ val ? 'Pass' : 'Fail' }}</v-chip>
                        </div>
                      </div>
                      <div v-else class="empty">Load data to see quality checks.</div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="12" md="8" lg="8">
                  <v-card variant="outlined">
                    <v-card-title style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);margin-bottom:12px;">Recent Catalog Objects</v-card-title>
                    <v-card-text>
                      <div class="asset-results">
                        <div
                          v-for="obj in (overviewRecentObjects.length ? overviewRecentObjects : (demoModeEnabled ? demoSnapshot.objects : []))"
                          :key="obj.id"
                          class="asset-card"
                          :class="{ selected: selectedObjectId === obj.id }"
                          @click="selectedObjectId = obj.id; onViewChange('browse'); $nextTick(()=>{ browseQuery=obj.name; runSearch(); })"
                        >
                          <div class="asset-type-icon" :class="'type-' + (obj.type === 'storedProcedure' ? 'proc' : obj.type === 'function' ? 'fn' : obj.type || 'other')">
                            {{ obj.type === 'table' ? 'T' : obj.type === 'view' ? 'V' : obj.type === 'storedProcedure' ? 'P' : obj.type === 'function' ? 'F' : obj.type === 'trigger' ? 'TR' : '?' }}
                          </div>
                          <div class="asset-body">
                            <div class="asset-name">
                              {{ obj.name || obj.id }}
                              <span class="badge" v-if="obj.sensitivity !== 'confidential'">Verified</span>
                              <span class="trust-deprecated badge" v-else-if="obj.sensitivity === 'confidential'">&#128274; Confidential</span>
                            </div>
                            <div class="asset-description">{{ obj.description || 'No description available.' }}</div>
                            <div class="asset-meta">
                              <v-chip size="x-small" variant="tonal" class="schema-badge">{{ obj.database || 'unknown' }}</v-chip>
                              <v-chip size="x-small" variant="outlined" class="owner-chip">&#128100; {{ obj.owner || 'unassigned' }}</v-chip>
                              <v-chip size="x-small" variant="outlined" class="type-chip">{{ obj.type || 'object' }}</v-chip>
                              <v-chip size="x-small" variant="tonal" :color="qualityScoreColor(qualityScoreForItem(obj))">Quality {{ qualityScoreForItem(obj) ?? 'n/a' }}</v-chip>
                              <v-chip size="x-small" variant="outlined">Trend {{ qualityTrendLabel(obj) }}</v-chip>
                            </div>
                          </div>
                          <div class="asset-actions">
                            <v-btn size="small" variant="outlined" append-icon="mdi-open-in-new" @click.stop="selectedObjectId = obj.id; onViewChange('discovery'); $nextTick(loadDiscovery)">Lineage</v-btn>
                          </div>
                        </div>
                        <div v-if="!(overviewRecentObjects.length || (demoModeEnabled && demoSnapshot.objects.length))" class="empty-state">
                          <div class="empty-state-icon">&#128193;</div>
                          <h4>{{ catalogHasLoadedObjects ? 'Catalog loaded, examples unavailable' : 'No catalog objects yet' }}</h4>
                          <p v-if="catalogHasLoadedObjects">The dashboard has loaded catalog totals, but no sample objects were returned for this card.</p>
                          <p v-else>Connect to SQL Server or upload markdown files to populate your catalog.</p>
                          <v-btn color="primary" @click="catalogHasLoadedObjects ? onViewChange('browse') : onViewChange('import')">{{ catalogHasLoadedObjects ? 'Open Catalog Search' : 'Go to Ingestion' }}</v-btn>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <v-col cols="12" sm="12" md="4" lg="4">
                  <v-card variant="outlined" style="padding:24px;border-radius:16px;box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);margin-bottom:24px;background:rgba(255,255,255,0.74);backdrop-filter:blur(12px);">
                    <v-card-title style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#64748b;margin-bottom:16px;">Pipeline Progress</v-card-title>
                    <v-card-text style="padding:0;">
                      <div class="workflow-progress" style="margin-bottom:16px;border-radius:9999px;overflow:hidden;">
                        <div class="workflow-progress-bar" :style="{ width: workflowProgressPercent + '%' }"></div>
                      </div>
                      <div style="font-size:12px;color:#64748b;line-height:1.6;margin-bottom:16px;">{{ workflowProgressPercent }}% of governance pipeline complete</div>
                      <div class="mini-stack">
                        <div
                          v-for="step in importWorkflowSteps"
                          :key="'ov-wf-' + step.key"
                          class="mini-metric"
                          style="cursor:pointer;padding:16px 20px;border-radius:12px;border:1px solid rgba(226,232,240,0.8);box-shadow:0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03);"
                          @click="jumpToWorkflowStep(step)"
                        >
                          <span>{{ step.label }}</span>
                          <v-chip size="x-small" variant="flat" :color="step.done ? 'success' : 'amber-lighten-2'" :class="step.done ? 'font-weight-bold' : 'text-grey-darken-4 font-weight-bold'">{{ step.done ? 'Done' : 'Pending' }}</v-chip>
                        </div>
                      </div>
                      <div class="btn-row" style="margin-top:16px;">
                        <v-btn block class="pill-action-btn" color="primary" @click="runRecommendedWorkflowAction">
                          ► {{ recommendedWorkflowAction.label }}
                        </v-btn>
                      </div>

                      <h4 style="margin:24px 0 12px;font-size:12px;font-weight:600;color:#64748b;text-transform:uppercase;letter-spacing:0.08em;">Platform Health</h4>
                      <div class="mini-stack">
                        <div class="mini-metric">
                          <span>Search Index</span>
                          <v-chip size="x-small" variant="flat" :color="isElasticsearchHealthy ? 'success' : 'blue-grey-lighten-4'" :class="isElasticsearchHealthy ? 'font-weight-bold' : 'text-blue-grey-darken-4 font-weight-bold'">{{ elasticsearchStatusLabel }}</v-chip>
                        </div>
                        <div class="mini-metric">
                          <span>Demo Mode</span>
                          <v-chip size="x-small" variant="flat" :color="demoModeEnabled ? 'info' : 'blue-grey-lighten-4'" :class="demoModeEnabled ? 'font-weight-bold' : 'text-blue-grey-darken-4 font-weight-bold'">{{ demoModeEnabled ? 'ON' : 'OFF' }}</v-chip>
                        </div>
                        <div class="mini-metric">
                          <span>Data Objects</span>
                          <strong>{{ executiveReportMetrics.objects }}</strong>
                        </div>
                        <div class="mini-metric">
                          <span>Quality Score</span>
                          <strong>{{ executiveReportMetrics.qualityScore || '-' }}</strong>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <div v-if="activeView === 'browse'">
              <div class="search-hero catalog-search-panel" style="margin-bottom:14px;">
                <div class="catalog-search-mode-row">
                  <v-btn-toggle v-model="browseMode" density="comfortable" mandatory variant="outlined">
                    <v-btn value="search" prepend-icon="mdi-magnify" @click="setBrowseMode('search')">Search</v-btn>
                    <v-btn value="browse" prepend-icon="mdi-database-search" @click="setBrowseMode('browse')">Browse by Database</v-btn>
                  </v-btn-toggle>
                  <v-btn size="small" variant="outlined" :loading="browseLoading || bootstrapInProgress" @click="bootstrapData">Refresh Catalog</v-btn>
                </div>

                <div v-if="browseMode === 'search'">
                  <h2>Search</h2>
                  <p>Start with what you know: a table, column, owner, term, tag, or business concept.</p>
                  <div class="search-bar-wrap catalog-search-bar">
                  <v-text-field
                    v-model="browseQuery"
                    :placeholder="catalogSearchPlaceholder"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    @keyup.enter="runSearch"
                  ></v-text-field>
                  <v-btn color="primary" :loading="browseSearchLoading" @click="runSearch">Search</v-btn>
                  </div>
                </div>

                <div v-else>
                  <h2>Browse by database</h2>
                  <p>Choose a cataloged database to inspect its schemas and objects. Empty databases are hidden from this list.</p>
                  <div class="search-bar-wrap catalog-search-bar">
                    <v-select
                      :model-value="selectedBrowseDatabase"
                      :items="catalogDatabaseOptions"
                      item-title="title"
                      item-value="value"
                      placeholder="Choose a database..."
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      @update:model-value="selectBrowseDatabase"
                    ></v-select>
                    <v-btn color="primary" :disabled="!selectedBrowseDatabase" @click="selectBrowseDatabase(selectedBrowseDatabase)">Open</v-btn>
                  </div>
                </div>

                <div class="catalog-helper-grid">
                  <button
                    v-for="helper in catalogHelperActions"
                    :key="'catalog-helper-' + helper.key"
                    type="button"
                    class="catalog-helper-card"
                    @click="applyCatalogHelper(helper.key)"
                  >
                    <v-icon size="18">{{ helper.icon }}</v-icon>
                    <span>
                      <strong>{{ helper.label }}</strong>
                      <small>{{ helper.description }}</small>
                    </span>
                  </button>
                </div>

                <div class="search-hint">
                  {{ catalogResultSummary }} · {{ browseCatalogStatusText }}
                </div>
                <div v-if="browseSearchWarning" class="search-hint" style="color:#fbbf24;">{{ browseSearchWarning }}</div>
                <div v-if="browseLoadError" class="search-hint" style="color:#f87171;">Catalog load issue: {{ browseLoadError }}</div>
                <div
                  v-if="hasStaleDemoCatalogState"
                  class="search-hint"
                  style="color:#fbbf24;font-weight:700;"
                >
                  Demo rows were still in this browser session. Click Load Catalog or refresh to reload the markdown catalog.
                </div>
              </div>

              <v-row>
                <v-col v-if="catalogSearchHasStarted && browseMode === 'search'" cols="12" md="3" lg="2">
                <div class="facet-rail">
                  <div class="facet-rail-title">Filters</div>

                  <div class="facet-group" v-if="browseTypeTabs.length">
                    <div class="facet-group-title">Asset Type</div>
                    <div class="btn-row" style="gap:6px;flex-wrap:wrap;">
                      <v-chip
                        v-for="tab in browseTypeTabs"
                        :key="tab.type"
                        size="small"
                        :color="selectedFacetFilters.types.includes(tab.type) ? 'primary' : undefined"
                        :variant="selectedFacetFilters.types.includes(tab.type) ? 'flat' : 'outlined'"
                        style="cursor:pointer;"
                        @click="toggleBrowseFacet('types', tab.type)"
                      >
                        {{ tab.label }} ({{ tab.count }})
                      </v-chip>
                    </div>
                  </div>

                  <div class="facet-group" v-if="browseFacetOptions.quality.some((qualityName) => (browseFacetCounts.quality[qualityName] || 0) > 0)">
                    <div class="facet-group-title">Quality</div>
                    <div class="btn-row" style="gap:6px;flex-wrap:wrap;">
                      <v-chip
                        v-for="qualityName in browseFacetOptions.quality"
                        v-show="(browseFacetCounts.quality[qualityName] || 0) > 0"
                        :key="qualityName"
                        size="small"
                        :color="selectedFacetFilters.quality.includes(qualityName) ? 'primary' : undefined"
                        :variant="selectedFacetFilters.quality.includes(qualityName) ? 'flat' : 'outlined'"
                        style="cursor:pointer;"
                        @click="toggleBrowseFacet('quality', qualityName)"
                      >{{ qualityName.charAt(0).toUpperCase() + qualityName.slice(1) }} ({{ browseFacetCounts.quality[qualityName] || 0 }})</v-chip>
                    </div>
                  </div>

                  <div class="facet-group" v-if="browseFacetOptions.databases.length">
                    <div class="facet-group-title">Database</div>
                    <div class="btn-row" style="gap:6px;flex-wrap:wrap;">
                      <v-chip
                        v-for="dbName in browseFacetOptions.databases"
                        v-show="(browseFacetCounts.databases[dbName] || 0) > 0"
                        :key="dbName"
                        size="small"
                        :color="selectedFacetFilters.databases.includes(dbName) ? 'primary' : undefined"
                        :variant="selectedFacetFilters.databases.includes(dbName) ? 'flat' : 'outlined'"
                        style="cursor:pointer;"
                        @click="toggleBrowseFacet('databases', dbName)"
                      >{{ dbName }} ({{ browseFacetCounts.databases[dbName] || 0 }})</v-chip>
                    </div>
                  </div>

                  <div class="facet-group">
                    <div class="facet-group-title">Sort Results</div>
                    <v-select
                      v-model="browseSort"
                      density="compact"
                      variant="outlined"
                      hide-details
                      :items="[
                        { title: 'Relevance', value: 'relevance' },
                        { title: 'Quality', value: 'quality' },
                        { title: 'Impact', value: 'impact' },
                        { title: 'Alphabetical', value: 'alphabetical' },
                      ]"
                    ></v-select>
                  </div>

                  <div style="margin-top:14px;">
                    <v-btn block size="small" variant="outlined" @click="clearBrowseFacets">Clear Search &amp; Filters</v-btn>
                  </div>

                  <div style="margin-top:14px;" v-if="selectedFacetFilters.types.length || selectedFacetFilters.quality.length || selectedFacetFilters.databases.length">
                    <div class="section-title" style="font-size:11px;margin-bottom:6px;">Active Filters</div>
                    <div class="mini-stack">
                      <div class="mini-metric" v-for="typeName in selectedFacetFilters.types" :key="'active-type-' + typeName">
                        <span>Type</span>
                        <strong>{{ typeName }}</strong>
                      </div>
                      <div class="mini-metric" v-for="qualityName in selectedFacetFilters.quality" :key="'active-quality-' + qualityName">
                        <span>Quality</span>
                        <strong>{{ qualityName }}</strong>
                      </div>
                      <div class="mini-metric" v-for="databaseName in selectedFacetFilters.databases" :key="'active-db-' + databaseName">
                        <span>DB</span>
                        <strong>{{ databaseName }}</strong>
                      </div>
                    </div>
                  </div>

                  <div style="margin-top:14px;">
                    <div class="section-title" style="font-size:11px;margin-bottom:6px;">Object Detail</div>
                    <div class="form-row" style="grid-template-columns:1fr auto;">
                      <v-text-field v-model="selectedObjectId" placeholder="Object ID" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-btn size="small" color="primary" @click="loadObjectContext">Go</v-btn>
                    </div>
                  </div>
                </div>
                </v-col>

                <v-col cols="12" :md="catalogSearchHasStarted && browseMode === 'search' ? 9 : 12" :lg="catalogSearchHasStarted && browseMode === 'search' ? 10 : 12">
                <div>
                  <div class="section-header" style="margin-bottom:10px;">
                    <span class="section-title">
                      {{ catalogResultSummary }}
                    </span>
                    <div class="btn-row">
                      <v-btn v-if="browseSearchSubmitted" size="small" variant="outlined" append-icon="mdi-refresh" :loading="browseSearchLoading" @click="runSearch">Refresh Results</v-btn>
                      <v-btn v-if="catalogSearchHasStarted" size="small" variant="outlined" @click="clearBrowseFacets">Clear</v-btn>
                    </div>
                  </div>

                  <div v-if="browseMode === 'browse' && selectedBrowseDatabase && browseTreeRoots().length" class="schema-explorer catalog-schema-explorer" style="margin-bottom:14px;">
                    <div class="section-header" style="margin-bottom:10px;">
                      <span class="section-title">Schema Explorer</span>
                      <span class="text-small">{{ browseTreeRoots().length }} namespaces</span>
                    </div>
                    <v-expansion-panels variant="accordion" density="compact">
                      <v-expansion-panel v-for="group in browseTreeRoots()" :key="group.key">
                        <v-expansion-panel-title>
                          <div class="d-flex align-center" style="gap:10px;">
                            <v-icon start class="mr-2">mdi-folder-outline</v-icon>
                            <strong>{{ group.key }}</strong>
                            <v-chip size="x-small" variant="tonal">{{ group.children.length }}</v-chip>
                          </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <div class="mini-stack">
                            <div
                              v-for="item in group.children.slice(0, 6)"
                              :key="'tree-' + item.id"
                              class="mini-metric"
                              style="cursor:pointer;"
                              @click="selectedObjectId = item.id; loadObjectContext(); onViewChange('discovery')"
                            >
                              <span>{{ item.name || item.id }}</span>
                              <strong>{{ item.type || 'object' }}</strong>
                            </div>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>

                  <div class="asset-results" v-if="catalogSearchHasStarted && filteredCatalogResults.length > 0">
                    <div
                      v-for="item in filteredCatalogResults"
                      :key="item.id || item.name"
                      class="asset-card"
                      :class="{ selected: selectedObjectId === (item.id || item.name) }"
                      @click="selectedObjectId = item.id || item.name; loadObjectContext()"
                    >
                      <div class="asset-type-icon" :class="'type-' + (item.type === 'storedProcedure' ? 'proc' : item.type === 'function' ? 'fn' : item.type || 'other')">
                        {{ item.type === 'table' ? 'T' : item.type === 'view' ? 'V' : item.type === 'storedProcedure' ? 'P' : item.type === 'function' ? 'F' : item.type === 'trigger' ? 'TR' : '?' }}
                      </div>
                      <div class="asset-body">
                        <div class="asset-name">
                          <strong>{{ item.name || item.id }}</strong>
                          <v-chip size="x-small" :class="item.resultRank <= 3 ? 'poweruser' : 'viewer'" variant="flat">#{{ item.resultRank }}</v-chip>
                          <v-chip size="x-small" variant="tonal" color="success" v-if="item.sensitivity !== 'confidential' && item.sensitivity !== 'restricted'">Verified</v-chip>
                          <v-chip size="x-small" variant="tonal" color="amber" v-else-if="item.sensitivity === 'restricted'">Restricted</v-chip>
                          <v-chip size="x-small" variant="tonal" color="error" v-else-if="item.sensitivity === 'confidential'">Confidential</v-chip>
                        </div>
                        <div class="asset-description">{{ item.description || 'No description available - help improve coverage by adding one.' }}</div>
                        <div class="asset-meta">
                          <v-chip size="x-small" variant="tonal" class="schema-badge">{{ item.database || item.schema || 'unknown' }}</v-chip>
                          <v-chip size="x-small" variant="outlined" class="owner-chip">&#128100; {{ item.owner || 'unassigned' }}</v-chip>
                          <v-chip size="x-small" variant="outlined" class="type-chip">{{ item.type || 'object' }}</v-chip>
                          <v-chip v-if="item.sensitivity" size="x-small" :class="'sens-' + item.sensitivity" variant="flat">{{ item.sensitivity }}</v-chip>
                          <v-chip v-if="item.trust_level" size="x-small" class="analyst" variant="flat">Trust: {{ item.trust_level }}</v-chip>
                          <v-chip v-if="item.certified" size="x-small" class="poweruser" variant="flat">Certified</v-chip>
                          <v-chip size="x-small" variant="tonal" :color="qualityScoreColor(qualityScoreForItem(item))">Quality {{ qualityScoreForItem(item) ?? 'n/a' }}</v-chip>
                          <v-chip size="x-small" variant="outlined">Trend {{ qualityTrendLabel(item) }}</v-chip>
                          <v-chip
                            v-for="cls in (item.classifications || []).slice(0, 3)"
                            :key="(item.id || item.name) + '-cls-' + cls"
                            class="viewer"
                            size="x-small"
                            variant="flat"
                          >{{ cls }}</v-chip>
                        </div>
                      </div>
                      <div class="asset-actions">
                        <v-btn size="small" variant="outlined" append-icon="mdi-open-in-new" @click.stop="selectedObjectId = item.id || item.name; onViewChange('discovery'); $nextTick(loadDiscovery)">Lineage</v-btn>
                      </div>
                    </div>
                  </div>

                  <div v-else class="card">
                    <div class="empty-state">
                      <div class="empty-state-icon">&#128269;</div>
                      <h4 v-if="!catalogSearchHasStarted">Start with search or browse</h4>
                      <h4 v-else-if="browseMode === 'browse' && !selectedBrowseDatabase">Choose a database</h4>
                      <h4 v-else>No catalog objects found</h4>
                      <p v-if="browseLoadError">The catalog API did not load: {{ browseLoadError }}</p>
                      <p v-else-if="hasStaleDemoCatalogState">This browser was holding demo results. Reload the catalog to replace them with markdown data.</p>
                      <p v-else-if="!catalogSearchHasStarted">Search for an asset, use a helper, or switch to Browse by Database to inspect cataloged databases.</p>
                      <p v-else-if="browseMode === 'browse' && !selectedBrowseDatabase">Only databases with cataloged objects appear in the dropdown above.</p>
                      <p v-else-if="browseSearchSubmitted">No markdown catalog objects matched this search. Try a broader term or clear filters.</p>
                      <p v-else>No objects matched the selected database and filters.</p>
                      <v-btn v-if="catalogSearchHasStarted" color="primary" @click="clearBrowseFacets">Clear Search &amp; Filters</v-btn>
                      <v-btn style="margin-left:8px;" variant="outlined" :loading="browseLoading || bootstrapInProgress" @click="bootstrapData">Refresh Catalog</v-btn>
                    </div>
                  </div>

                  <div class="detail-panel mt-12" v-if="selectedObjectDetail">
                    <div class="detail-header">
                      <div class="detail-header-row">
                        <div class="asset-type-icon" :class="'type-' + (selectedObjectDetail.type === 'storedProcedure' ? 'proc' : selectedObjectDetail.type === 'function' ? 'fn' : selectedObjectDetail.type || 'other')">
                          {{ selectedObjectDetail.type === 'table' ? 'T' : selectedObjectDetail.type === 'view' ? 'V' : selectedObjectDetail.type === 'storedProcedure' ? 'P' : 'F' }}
                        </div>
                        <div>
                          <div class="detail-name">{{ selectedObjectDetail.id || selectedObjectId }}</div>
                          <div class="detail-path">{{ selectedObjectDetail.database }}.{{ selectedObjectDetail.name }}</div>
                          <div class="asset-meta mt-4">
                            <v-chip size="x-small" variant="tonal" color="success">Verified</v-chip>
                            <v-chip size="x-small" class="type-chip" variant="outlined">{{ selectedObjectDetail.type }}</v-chip>
                            <v-chip size="x-small" class="owner-chip" variant="outlined">&#128100; {{ selectedObjectDetail.owner || 'unassigned' }}</v-chip>
                            <v-chip
                              v-if="selectedObjectDetail.lineage_status"
                              size="x-small"
                              :class="selectedObjectDetail.external_source ? 'poweruser' : 'analyst'"
                              variant="flat"
                            >{{ lineageStatusLabel(selectedObjectDetail.lineage_status) }}</v-chip>
                            <v-chip
                              v-if="selectedObjectDetail.external_source"
                              size="x-small"
                              class="viewer"
                              variant="flat"
                            >External Source</v-chip>
                            <v-chip v-if="selectedObjectGovernance?.trust?.trust_level" size="x-small" class="analyst" variant="flat">{{ selectedObjectGovernance.trust.trust_level }}</v-chip>
                            <v-chip v-if="selectedObjectGovernance?.trust?.certified" size="x-small" class="poweruser" variant="flat">Certified</v-chip>
                            <v-chip size="x-small" variant="tonal" :color="qualityScoreColor(qualityScoreForItem(selectedObjectDetail))">Quality {{ qualityScoreForItem(selectedObjectDetail) ?? 'n/a' }}</v-chip>
                            <v-chip size="x-small" variant="outlined">Trend {{ qualityTrendLabel(selectedObjectDetail) }}</v-chip>
                          </div>
                          <div v-if="selectedObjectDetail.external_source" style="margin-top:8px;font-size:12px;color:var(--text-muted);">
                            This table is source-owned in the current corpus, so created_by is intentionally empty until a local writer is discovered.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="detail-body">
                      <div class="tab-row">
                        <v-btn size="small" variant="flat" color="primary">Overview</v-btn>
                        <v-btn size="small" variant="outlined" append-icon="mdi-open-in-new" @click="onViewChange('discovery'); $nextTick(loadDiscovery)">Lineage</v-btn>
                      </div>
                      <p style="font-size:13px;color:var(--text-muted);">{{ selectedObjectDetail.description || 'No description available.' }}</p>
                      <div class="asset-semantic-strip" v-if="selectedObjectGovernance?.glossary_links?.length">
                        <div>
                          <span>Business Terms</span>
                          <strong>{{ selectedObjectGovernance.glossary_links.length }} mapped</strong>
                        </div>
                        <button
                          v-for="term in selectedObjectGovernance.glossary_links"
                          :key="'asset-semantic-' + term.slug"
                          @click="onViewChange('glossary'); $nextTick(() => openGlossaryTerm(term.slug))"
                        >{{ term.term }}</button>
                      </div>
                      <div class="stat-row">
                        <div class="stat-item"><div class="stat-value">{{ selectedObjectDetail.upstreamCount || '-' }}</div><div class="stat-label">Upstream</div></div>
                        <div class="stat-item"><div class="stat-value">{{ selectedObjectDetail.downstreamCount || '-' }}</div><div class="stat-label">Downstream</div></div>
                        <div class="stat-item"><div class="stat-value">{{ selectedObjectDetail.sensitivity || '-' }}</div><div class="stat-label">Sensitivity</div></div>
                        <div class="stat-item"><div class="stat-value">{{ selectedObjectGovernance?.trust?.score || '-' }}</div><div class="stat-label">Trust Score</div></div>
                        <div class="stat-item"><div class="stat-value">{{ qualityScoreForItem(selectedObjectDetail) ?? '-' }}</div><div class="stat-label">Quality Score</div></div>
                        <div class="stat-item"><div class="stat-value">{{ qualityTrendLabel(selectedObjectDetail) }}</div><div class="stat-label">Quality Trend</div></div>
                      </div>
                      <div class="schema-column-browser mt-12" v-if="selectedObjectDictionary">
                        <div class="section-header" style="margin-bottom:10px;">
                          <span class="section-title">Column Dictionary</span>
                          <div class="btn-row">
                            <v-chip size="x-small" variant="tonal">{{ selectedObjectDictionary.columns?.length || 0 }} columns</v-chip>
                            <v-btn
                              size="small"
                              variant="outlined"
                              append-icon="mdi-download"
                              @click="downloadObjectDictionary"
                            >Export</v-btn>
                          </div>
                        </div>
                        <v-table density="compact" class="dictionary-table">
                          <thead>
                            <tr>
                              <th>Column</th>
                              <th>Type</th>
                              <th>Semantic</th>
                              <th>Sensitivity</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="column in (selectedObjectDictionary.columns || []).slice(0, 40)" :key="'dict-column-' + column.column_id">
                              <td><code>{{ column.name }}</code></td>
                              <td>{{ column.data_type || '-' }}</td>
                              <td>
                                <v-chip size="x-small" variant="tonal" :color="column.is_metric ? 'primary' : 'blue-grey-lighten-4'">
                                  {{ column.semantic_type || (column.is_key ? 'key' : '-') }}
                                </v-chip>
                              </td>
                              <td>{{ column.sensitivity || '-' }}</td>
                              <td>{{ column.description || '-' }}</td>
                            </tr>
                            <tr v-if="!(selectedObjectDictionary.columns || []).length">
                              <td colspan="5" class="text-center">No column metadata captured yet.</td>
                            </tr>
                          </tbody>
                        </v-table>
                      </div>
                      <div class="grid mt-12" style="grid-template-columns:1fr 1fr;gap:12px;">
                        <v-card class="card" style="box-shadow:none;" variant="outlined">
                          <h4>Metadata Enrichment</h4>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.owner" placeholder="Owner" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.steward" placeholder="Steward" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.domain_manager" placeholder="Domain Manager" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.custodian" placeholder="Custodian" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.business_domain" placeholder="Business Domain" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.business_processes" placeholder="Business Processes (comma-separated)" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.use_cases" placeholder="Use Cases (comma-separated)" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row">
                            <v-select
                              v-model="editableObjectMetadata.sensitivity"
                              density="compact"
                              variant="outlined"
                              hide-details
                              :items="['public','internal','confidential','restricted']"
                            ></v-select>
                          </div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.tags" placeholder="Tags (comma-separated)" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.documentation_links" placeholder="Documentation Links (comma-separated)" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.related_dashboards" placeholder="Related Dashboards (comma-separated)" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-textarea v-model="editableObjectMetadata.business_justification" rows="3" variant="outlined" density="compact" hide-details placeholder="Business justification"></v-textarea></div>
                          <div class="form-row"><v-textarea v-model="editableObjectMetadata.description" rows="5" variant="outlined" density="compact" hide-details placeholder="Description"></v-textarea></div>
                          <div class="btn-row"><v-btn color="primary" @click="saveSelectedObjectMetadata">Save Markdown Metadata</v-btn></div>
                        </v-card>
                        <v-card class="card" style="box-shadow:none;" variant="outlined">
                          <h4>Governance Context</h4>
                          <div class="mini-stack">
                            <div class="mini-metric"><span>Owner</span><strong>{{ selectedObjectGovernance?.asset?.owner || '-' }}</strong></div>
                            <div class="mini-metric"><span>Steward</span><strong>{{ selectedObjectGovernance?.asset?.steward || '-' }}</strong></div>
                            <div class="mini-metric"><span>Domain Manager</span><strong>{{ selectedObjectGovernance?.asset?.domain_manager || '-' }}</strong></div>
                            <div class="mini-metric"><span>Custodian</span><strong>{{ selectedObjectGovernance?.asset?.custodian || '-' }}</strong></div>
                          </div>
                          <div class="mt-8" v-if="selectedObjectGovernance?.classifications?.length">
                            <div class="section-title" style="font-size:11px;margin-bottom:6px;">Classifications</div>
                            <div class="btn-row">
                              <v-chip v-for="cls in selectedObjectGovernance.classifications" :key="'detail-cls-' + cls" class="viewer" size="x-small" variant="flat">{{ cls }}</v-chip>
                            </div>
                          </div>
                          <div class="mt-8" v-if="selectedObjectPiiPolicy">
                            <div class="section-title" style="font-size:11px;margin-bottom:6px;">PII Masking Policy</div>
                            <div class="policy-summary-strip">
                              <span :class="selectedObjectPiiPolicy.summary?.requires_masking ? 'policy-risk' : 'policy-ok'">
                                {{ selectedObjectPiiPolicy.summary?.requires_masking ? 'Mask required' : 'No PII detected' }}
                              </span>
                              <strong>{{ selectedObjectPiiPolicy.summary?.pii_columns || 0 }} / {{ selectedObjectPiiPolicy.summary?.total_columns || 0 }} columns</strong>
                            </div>
                            <div class="policy-action-list" v-if="selectedObjectPiiPolicy.masking_actions?.length">
                              <div v-for="action in selectedObjectPiiPolicy.masking_actions" :key="'mask-action-' + action.column_name" class="policy-action-row">
                                <code>{{ action.column_name }}</code>
                                <span>{{ action.strategy }}</span>
                                <strong>{{ Math.round((action.confidence || 0) * 100) }}%</strong>
                              </div>
                            </div>
                          </div>
                          <div class="mt-8" v-if="selectedObjectColumnSemantics?.can_answer_metric_question">
                            <div class="section-title" style="font-size:11px;margin-bottom:6px;">Metric Columns</div>
                            <div class="policy-action-list">
                              <div
                                v-for="column in selectedObjectColumnSemantics.metric_columns || []"
                                :key="'metric-column-' + column.column_name"
                                class="policy-action-row"
                              >
                                <code>{{ column.column_name }}</code>
                                <span>{{ column.semantic_type }}</span>
                                <strong>{{ Math.round((column.confidence || 0) * 100) }}%</strong>
                              </div>
                              <div v-if="!(selectedObjectColumnSemantics.metric_columns || []).length" class="policy-empty-row">
                                No metric columns detected from current metadata.
                              </div>
                            </div>
                          </div>
                          <div class="mt-8" v-if="selectedObjectGovernance?.glossary_links?.length">
                            <div class="section-title" style="font-size:11px;margin-bottom:6px;">Related Glossary Terms</div>
                            <div class="btn-row">
                              <v-btn
                                v-for="term in selectedObjectGovernance.glossary_links"
                                :key="term.slug"
                                size="small"
                                variant="outlined"
                                @click="onViewChange('glossary'); $nextTick(() => openGlossaryTerm(term.slug))"
                              >{{ term.term }}</v-btn>
                            </div>
                          </div>
                        </v-card>
                      </div>
                      <div class="btn-row mt-8">
                        <v-btn size="small" variant="outlined" @click="onViewChange('discovery'); $nextTick(loadDiscovery)">View in Lineage</v-btn>
                        <v-btn size="small" variant="outlined" @click="buildBlastRadiusReport(); onViewChange('reports');">Blast Radius</v-btn>
                        <v-btn size="small" color="primary" @click="syncMarketplaceFormWithSelection(); onViewChange('reports');">Request Access</v-btn>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                </v-col>
              </v-row>
            </div>

            <div v-if="activeView === 'glossary'">
              <div class="glossary-workspace">
                <aside class="glossary-rail">
                  <div class="glossary-rail-block">
                    <div class="glossary-rail-title">Business Glossary</div>
                    <div class="form-row">
                      <v-text-field
                        v-model="glossary.query"
                        placeholder="Search terms, owners, synonyms..."
                        density="compact"
                        variant="outlined"
                        hide-details
                        @keyup.enter="loadGlossary"
                      ></v-text-field>
                    </div>
                    <v-btn size="small" color="primary" block @click="loadGlossary">Search</v-btn>
                    <div class="glossary-admin-actions">
                      <v-btn size="small" variant="tonal" color="primary" @click="startGlossaryCreate">New Term</v-btn>
                      <v-btn size="small" variant="tonal" :disabled="!glossary.selected" @click="startGlossaryEdit">Edit</v-btn>
                    </div>
                    <div class="glossary-domain-list" v-if="glossary.domains.length">
                      <div class="glossary-muted-label">Domains</div>
                      <div class="glossary-domain" v-for="domain in glossary.domains" :key="'glossary-domain-' + domain">
                        <span>{{ domain }}</span>
                      </div>
                    </div>
                    <div class="glossary-term-list">
                      <button
                        v-for="term in glossary.terms"
                        :key="term.slug"
                        class="glossary-term-button"
                        :class="{ active: term.slug === glossary.selected?.slug }"
                        @click="openGlossaryTerm(term.slug)"
                      >
                        <span class="glossary-term-name">{{ term.term }}</span>
                        <span class="glossary-term-meta">{{ term.domain }}<template v-if="term.asset_count"> · {{ term.asset_count }} links</template></span>
                      </button>
                    </div>
                  </div>

                  <div class="glossary-resolver">
                    <div class="glossary-rail-title">Semantic Resolver</div>
                    <v-text-field
                      v-model="glossary.semanticQuery"
                      placeholder="Try a business term..."
                      density="compact"
                      variant="outlined"
                      hide-details
                      @keyup.enter="resolveGlossarySemanticQuery"
                    ></v-text-field>
                    <v-btn class="mt-8" size="small" color="primary" block @click="resolveGlossarySemanticQuery">Resolve</v-btn>
                    <div class="glossary-resolver-metrics" v-if="glossary.semanticResolution">
                      <div>
                        <span>Terms</span>
                        <strong>{{ glossary.semanticResolution.terms?.length || 0 }}</strong>
                      </div>
                      <div>
                        <span>Assets</span>
                        <strong>{{ glossary.semanticResolution.assets?.length || 0 }}</strong>
                      </div>
                    </div>
                  </div>
                </aside>

                <main class="glossary-main">
                  <section class="glossary-record compact" v-if="glossary.editing">
                    <div class="glossary-section-heading" style="margin-top:0;">
                      <div>
                        <h3>{{ glossary.editMode === 'edit' ? 'Edit Glossary Term' : 'Create Glossary Term' }}</h3>
                        <p>Maintain the governed business definition and ownership metadata.</p>
                      </div>
                      <div class="btn-row">
                        <v-btn size="small" variant="tonal" @click="cancelGlossaryEdit">Cancel</v-btn>
                        <v-btn size="small" color="primary" @click="saveGlossaryTerm">Save Term</v-btn>
                      </div>
                    </div>
                    <div class="glossary-editor-grid">
                      <v-text-field v-model="glossary.editor.term" label="Term" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-text-field v-model="glossary.editor.domain" label="Domain" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-select v-model="glossary.editor.status" :items="['draft','approved','deprecated']" label="Status" density="compact" variant="outlined" hide-details></v-select>
                      <v-text-field v-model="glossary.editor.parent" label="Parent slug" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-text-field v-model="glossary.editor.owner" label="Technical owner" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-text-field v-model="glossary.editor.business_owner" label="Business owner" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-text-field v-model="glossary.editor.steward" label="Steward" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-text-field v-model="glossary.editor.synonyms" label="Synonyms" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-text-field v-model="glossary.editor.related_terms" label="Related terms" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-text-field v-model="glossary.editor.tags" label="Tags" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-textarea class="glossary-editor-definition" v-model="glossary.editor.definition" label="Definition" rows="4" density="compact" variant="outlined" hide-details></v-textarea>
                    </div>
                    <div class="btn-row mt-12" v-if="glossary.editMode === 'edit'">
                      <v-btn size="small" color="error" variant="tonal" @click="deleteGlossaryTerm">Delete Term</v-btn>
                    </div>
                  </section>

                  <section class="glossary-record">
                    <div v-if="glossary.selected">
                      <div class="glossary-record-header">
                        <div>
                          <div class="glossary-kicker">{{ glossary.selected.domain }}</div>
                          <h2>{{ glossary.selected.term }}</h2>
                          <p v-if="glossary.selected.definition">{{ glossary.selected.definition }}</p>
                        </div>
                        <div class="glossary-status-stack">
                          <span class="glossary-status approved">{{ glossary.selected.status }}</span>
                          <span class="glossary-status">v{{ glossary.selected.version || 1 }}</span>
                        </div>
                      </div>

                      <div class="glossary-owner-strip">
                        <div><span>Technical Owner</span><strong>{{ glossary.selected.owner || 'unassigned' }}</strong></div>
                        <div><span>Business Owner</span><strong>{{ glossary.selected.business_owner || '-' }}</strong></div>
                        <div><span>Steward</span><strong>{{ glossary.selected.steward || '-' }}</strong></div>
                        <div><span>Effective From</span><strong>{{ glossary.selected.effective_from || '-' }}</strong></div>
                      </div>

                      <div class="glossary-content-grid">
                        <article class="glossary-definition">
                          <div v-html="renderDocHtml(glossary.selected.body || '')"></div>
                        </article>
                        <aside class="glossary-facts">
                          <div class="glossary-fact">
                            <span>Parent Term</span>
                            <strong>{{ glossary.selected.parent || '-' }}</strong>
                          </div>
                          <div class="glossary-fact">
                            <span>Synonyms</span>
                            <div class="glossary-chip-row">
                              <span v-for="synonym in glossary.selected.synonyms || []" :key="'synonym-' + synonym" class="glossary-soft-chip">{{ synonym }}</span>
                              <strong v-if="!(glossary.selected.synonyms || []).length">-</strong>
                            </div>
                          </div>
                          <div class="glossary-fact">
                            <span>Related Terms</span>
                            <div class="glossary-chip-row">
                              <span v-for="related in glossary.selected.related_terms || []" :key="'related-' + related" class="glossary-soft-chip">{{ related }}</span>
                              <strong v-if="!(glossary.selected.related_terms || []).length">-</strong>
                            </div>
                          </div>
                        </aside>
                      </div>

                      <div class="glossary-section-heading">
                        <div>
                          <h3>Mapped Technical Assets</h3>
                          <p>Exact physical objects connected to this business term.</p>
                        </div>
                        <span>{{ (glossary.selected.assets || []).length }} links</span>
                      </div>
                      <div class="glossary-table-wrap">
                        <table class="glossary-table">
                          <thead>
                            <tr>
                              <th>Asset</th>
                              <th>Type</th>
                              <th>Relationship</th>
                              <th>Confidence</th>
                              <th>Notes</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="asset in glossary.selected.assets || []" :key="'glossary-asset-' + asset.asset_id">
                              <td><code>{{ asset.asset_id }}</code></td>
                              <td>{{ asset.type || 'asset' }}</td>
                              <td>{{ asset.relationship || 'related' }}</td>
                              <td>{{ asset.confidence || '-' }}</td>
                              <td>{{ asset.notes || '-' }}</td>
                            </tr>
                            <tr v-if="!(glossary.selected.assets || []).length">
                              <td colspan="5" class="glossary-empty-row">No physical assets linked yet.</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div class="glossary-mapping-panel">
                        <div>
                          <h3>Add Mapping</h3>
                          <p>Attach a catalog object, table, column, package, or dashboard to this term.</p>
                        </div>
                        <div class="glossary-asset-search">
                          <v-text-field v-model="glossary.assetSearchQuery" label="Find asset" density="compact" variant="outlined" hide-details @keyup.enter="searchGlossaryMappingAssets"></v-text-field>
                          <v-btn color="primary" variant="tonal" :loading="glossary.assetSearchLoading" @click="searchGlossaryMappingAssets">Find</v-btn>
                        </div>
                        <div class="glossary-asset-results" v-if="glossary.assetSearchResults.length">
                          <button
                            v-for="asset in glossary.assetSearchResults"
                            :key="'glossary-map-result-' + (asset.id || asset.name)"
                            class="glossary-asset-result"
                            @click="chooseGlossaryMappingAsset(asset)"
                          >
                            <strong>{{ asset.id || asset.name }}</strong>
                            <span>{{ asset.type || 'asset' }} · {{ asset.database || 'unknown' }}</span>
                          </button>
                        </div>
                        <div class="glossary-mapping-form">
                          <v-text-field v-model="glossary.newMapping.asset_id" label="Asset id" density="compact" variant="outlined" hide-details></v-text-field>
                          <v-select v-model="glossary.newMapping.relationship" :items="['defines','contains','reports','derived_from','related']" label="Relationship" density="compact" variant="outlined" hide-details></v-select>
                          <v-text-field v-model.number="glossary.newMapping.confidence" label="Confidence" type="number" min="0" max="1" step="0.05" density="compact" variant="outlined" hide-details></v-text-field>
                          <v-btn color="primary" @click="linkGlossaryAsset">Link Asset</v-btn>
                        </div>
                      </div>
                    </div>
                    <div v-else class="empty">Select a glossary term.</div>
                  </section>

                  <section class="glossary-record compact" v-if="glossary.semanticResolution?.assets?.length">
                    <div class="glossary-section-heading">
                      <div>
                        <h3>Resolved Physical Assets</h3>
                        <p>Objects found from the semantic resolver.</p>
                      </div>
                    </div>
                    <div class="glossary-table-wrap">
                      <table class="glossary-table">
                        <thead>
                          <tr>
                            <th>Asset</th>
                            <th>Type</th>
                            <th>Reason</th>
                            <th>Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="asset in glossary.semanticResolution.assets" :key="'semantic-' + asset.asset_id">
                            <td><code>{{ asset.asset_id }}</code></td>
                            <td>{{ asset.type }}</td>
                            <td>{{ asset.reason }}</td>
                            <td>{{ asset.score }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </section>
                </main>
              </div>
            </div>

            <div v-if="activeView === 'products'">
              <v-row>
                <v-col
                  v-for="product in productsCatalog.products"
                  :key="product.product_id || product.slug"
                  cols="12"
                  md="4"
                >
                  <v-card class="card" variant="outlined" @click="productsCatalog.selected = product" style="cursor:pointer;">
                    <div class="section-header" style="margin-bottom:8px;">
                      <span class="section-title">{{ product.name }}</span>
                      <div class="btn-row">
                        <v-chip size="small" color="info" variant="tonal">{{ product.trust_level || 'unrated' }}</v-chip>
                        <v-chip size="small" color="success" variant="flat" v-if="product.certified">Certified</v-chip>
                      </div>
                    </div>
                    <div class="asset-meta" style="margin-bottom:8px;">
                      <v-chip size="x-small" class="schema-badge" variant="tonal">{{ product.domain }}</v-chip>
                      <v-chip size="x-small" class="owner-chip" variant="outlined">&#128100; {{ product.owner }}</v-chip>
                    </div>
                    <div class="asset-description">{{ (product.description || '').slice(0, 180) }}...</div>
                    <div class="btn-row mt-8">
                      <v-chip size="small" variant="outlined">{{ (product.assets || []).length }} assets</v-chip>
                      <v-chip size="small" variant="outlined">v{{ product.version }}</v-chip>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <div v-if="activeView === 'governance'" class="governance-page">
              <v-row>
                <v-col cols="12" sm="6" md="3">
                  <v-card class="card kpi" variant="outlined">
                    <div class="value">{{ governance.health?.health_score || 0 }}</div>
                    <div class="label">Governance Health</div>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card class="card kpi" variant="outlined">
                    <div class="value">{{ governance.health?.metrics?.ownership_coverage_pct || 0 }}%</div>
                    <div class="label">Ownership Coverage</div>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card class="card kpi" variant="outlined">
                    <div class="value">{{ governance.health?.metrics?.classification_coverage_pct || 0 }}%</div>
                    <div class="label">Classification Coverage</div>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card class="card kpi" variant="outlined">
                    <div class="value">{{ governance.health?.metrics?.certified_pct || 0 }}%</div>
                    <div class="label">Certified Assets</div>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Policy Effectiveness</span>
                      <v-chip size="small" variant="tonal" color="primary">
                        {{ governance.classification.policyEffectiveness?.coverage_score || 0 }} score
                      </v-chip>
                    </div>
                    <div class="policy-dashboard-grid">
                      <div class="policy-dashboard-score">
                        <span>Classification Coverage</span>
                        <strong>{{ governance.classification.policyEffectiveness?.classification_coverage?.percent || 0 }}%</strong>
                        <small>{{ governance.classification.policyEffectiveness?.classification_coverage?.assets || 0 }} / {{ governance.classification.policyEffectiveness?.total_assets || 0 }} assets</small>
                      </div>
                      <div class="policy-dashboard-score">
                        <span>Policy Coverage</span>
                        <strong>{{ governance.classification.policyEffectiveness?.policy_coverage?.percent || 0 }}%</strong>
                        <small>{{ governance.classification.policyEffectiveness?.policy_coverage?.assets || 0 }} governed assets</small>
                      </div>
                      <div class="policy-dashboard-score">
                        <span>Masked Assets</span>
                        <strong>{{ governance.classification.policyEffectiveness?.controls?.mask || 0 }}</strong>
                        <small>Dynamic masking recommended</small>
                      </div>
                      <div class="policy-dashboard-score">
                        <span>Restricted Assets</span>
                        <strong>{{ governance.classification.policyEffectiveness?.controls?.restrict_access || 0 }}</strong>
                        <small>Access controls recommended</small>
                      </div>
                    </div>
                    <div class="policy-effectiveness-body">
                      <div>
                        <div class="panel-kicker">Template Coverage</div>
                        <div class="policy-template-list">
                          <div
                            v-for="template in governance.classification.policyEffectiveness?.template_coverage || []"
                            :key="'policy-template-' + template.template_id"
                            class="policy-template-row"
                          >
                            <span>{{ template.template_id }}</span>
                            <strong>{{ template.assets }}</strong>
                          </div>
                          <div v-if="!(governance.classification.policyEffectiveness?.template_coverage || []).length" class="policy-empty-row">
                            No templates matched yet.
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="panel-kicker">Gaps To Fix</div>
                        <div class="policy-gap-list">
                          <div
                            v-for="gap in (governance.classification.policyEffectiveness?.gaps || []).slice(0, 6)"
                            :key="'policy-gap-' + gap.asset_id"
                            class="policy-gap-row"
                          >
                            <strong>{{ gap.asset_id }}</strong>
                            <span>{{ gap.issue }}</span>
                          </div>
                          <div v-if="!(governance.classification.policyEffectiveness?.gaps || []).length" class="policy-empty-row">
                            No current policy coverage gaps.
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Data Quality Rules</span>
                      <div class="btn-row">
                        <v-btn size="small" variant="tonal" @click="startQualityRuleCreate">New Rule</v-btn>
                        <v-btn size="small" color="primary" :loading="governance.qualityRules.loading" @click="runQualityValidation">Run Validation</v-btn>
                        <v-btn size="small" variant="outlined" :loading="governance.qualityRules.loading" @click="buildQualityScorecard">Build Scorecard</v-btn>
                      </div>
                    </div>
                    <div class="quality-rules-grid">
                      <div class="quality-rule-panel">
                        <div class="panel-kicker">Rules</div>
                        <div class="quality-rule-list">
                          <button
                            v-for="rule in governance.qualityRules.rules"
                            :key="'quality-rule-' + rule.id"
                            type="button"
                            class="quality-rule-row"
                            :class="{ selected: governance.qualityRules.selectedRuleId === rule.id }"
                            @click="editQualityRule(rule)"
                          >
                            <strong>{{ rule.name }}</strong>
                            <span>{{ rule.asset_id }} · {{ rule.column_name || 'asset' }} · {{ qualityRuleTypeLabel(rule.type) }}</span>
                            <v-chip size="x-small" :class="rule.severity === 'fail' ? 'admin' : rule.severity === 'critical' ? 'poweruser' : 'analyst'" variant="flat">{{ rule.severity }}</v-chip>
                          </button>
                          <div v-if="!governance.qualityRules.rules.length" class="policy-empty-row">No quality rules defined yet.</div>
                        </div>
                      </div>
                      <div class="quality-rule-panel">
                        <div class="panel-kicker">Rule Editor</div>
                        <div class="quality-editor">
                          <v-text-field v-model="governance.qualityRules.editor.name" density="compact" variant="outlined" label="Rule name" hide-details></v-text-field>
                          <div class="quality-editor-row">
                            <v-text-field v-model="governance.qualityRules.editor.id" density="compact" variant="outlined" label="ID" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.editor.asset_id" density="compact" variant="outlined" label="Asset ID" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.editor.column_name" density="compact" variant="outlined" label="Column" hide-details></v-text-field>
                          </div>
                          <div class="quality-editor-row">
                            <v-select v-model="governance.qualityRules.editor.type" density="compact" variant="outlined" label="Type" :items="['null_percent','cardinality_bounds','range','pattern','uniqueness']" hide-details></v-select>
                            <v-select v-model="governance.qualityRules.editor.severity" density="compact" variant="outlined" label="Severity" :items="['warning','critical','fail']" hide-details></v-select>
                            <v-switch v-model="governance.qualityRules.editor.enabled" density="compact" label="Enabled" hide-details color="primary"></v-switch>
                          </div>
                          <div class="quality-editor-row four">
                            <v-text-field v-model="governance.qualityRules.editor.threshold_min" density="compact" variant="outlined" label="Min" type="number" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.editor.threshold_max" density="compact" variant="outlined" label="Max" type="number" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.editor.threshold_min_percent" density="compact" variant="outlined" label="Min %" type="number" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.editor.threshold_min_match_percent" density="compact" variant="outlined" label="Min match %" type="number" hide-details></v-text-field>
                          </div>
                          <div class="quality-editor-row two">
                            <v-text-field v-model="governance.qualityRules.editor.schedule" density="compact" variant="outlined" label="Schedule" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.editor.alert_routes" density="compact" variant="outlined" label="Alert routes" hide-details></v-text-field>
                          </div>
                          <div class="btn-row">
                            <v-btn size="small" color="primary" :loading="governance.qualityRules.loading" @click="saveQualityRule">Save Rule</v-btn>
                            <v-btn size="small" variant="tonal" color="error" :disabled="!governance.qualityRules.selectedRuleId" @click="deleteQualityRule()">Delete</v-btn>
                          </div>
                        </div>
                      </div>
                      <div class="quality-rule-panel">
                        <div class="panel-kicker">Validation Runner</div>
                        <div class="quality-editor">
                          <v-text-field v-model="governance.qualityRules.runProfile.asset_id" density="compact" variant="outlined" label="Profile asset ID" hide-details></v-text-field>
                          <v-text-field v-model="governance.qualityRules.runProfile.column_name" density="compact" variant="outlined" label="Profile column" hide-details></v-text-field>
                          <div class="quality-editor-row two">
                            <v-text-field v-model="governance.qualityRules.runProfile.row_count" density="compact" variant="outlined" label="Rows" type="number" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.runProfile.null_count" density="compact" variant="outlined" label="Nulls" type="number" hide-details></v-text-field>
                          </div>
                          <div class="quality-editor-row three">
                            <v-text-field v-model="governance.qualityRules.runProfile.distinct_count" density="compact" variant="outlined" label="Distinct" type="number" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.runProfile.min" density="compact" variant="outlined" label="Min" type="number" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.runProfile.max" density="compact" variant="outlined" label="Max" type="number" hide-details></v-text-field>
                          </div>
                          <v-text-field v-model="governance.qualityRules.runProfile.pattern_match_percent" density="compact" variant="outlined" label="Pattern match %" type="number" hide-details></v-text-field>
                        </div>
                        <div class="btn-row mt-8">
                          <v-btn size="small" variant="tonal" color="primary" @click="loadQualityTrend()">Load Trend</v-btn>
                          <v-btn size="small" variant="outlined" @click="exportQualityScorecard('json')">Export JSON</v-btn>
                          <v-btn size="small" variant="outlined" @click="exportQualityScorecard('csv')">Export CSV</v-btn>
                        </div>
                        <div class="quality-execution-summary" v-if="governance.qualityRules.executions.length">
                          <strong>{{ governance.qualityRules.executions[0].status }}</strong>
                          <span>{{ governance.qualityRules.executions[0].passed }} passed · {{ governance.qualityRules.executions[0].failed }} failed</span>
                        </div>
                        <div class="quality-scorecard-strip" v-if="governance.qualityRules.scorecard">
                          <div>
                            <span>Quality Score</span>
                            <strong>{{ governance.qualityRules.scorecard.overall_score }}</strong>
                          </div>
                          <div>
                            <span>Analytics Fitness</span>
                            <strong>{{ governance.qualityRules.scorecard.fitness?.analytics }}</strong>
                          </div>
                          <div>
                            <span>Export</span>
                            <strong>{{ governance.qualityRules.scorecardExport?.content_type || 'not generated' }}</strong>
                          </div>
                        </div>
                        <div class="quality-trend-panel" v-if="governance.qualityRules.trend">
                          <div class="quality-trend-header">
                            <strong>{{ governance.qualityRules.trend.asset_id }}</strong>
                            <span>{{ qualityTrendBars.length }} trend point(s)</span>
                          </div>
                          <div class="quality-sparkline" v-if="qualityTrendBars.length">
                            <div
                              v-for="(point, index) in qualityTrendBars"
                              :key="'quality-trend-' + index + '-' + point.label"
                              class="quality-spark-bar"
                              :title="point.metric + ' ' + point.value + ' on ' + point.label"
                            >
                              <span :style="{ height: Math.max(6, Math.min(100, point.value)) + '%' }"></span>
                              <small>{{ point.label }}</small>
                            </div>
                          </div>
                          <div v-else class="policy-empty-row">No trend history yet. Build a scorecard or run validation to create the first point.</div>
                        </div>
                        <div class="quality-incident-list">
                          <div v-for="incident in governance.qualityRules.incidents.slice(0, 5)" :key="'quality-incident-' + incident.id" class="quality-incident-row">
                            <strong>{{ incident.severity }}</strong>
                            <span>{{ incident.asset_id }} · {{ incident.column_name }}</span>
                          </div>
                          <div v-if="!governance.qualityRules.incidents.length" class="policy-empty-row">No quality incidents.</div>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Classification Taxonomy</span>
                      <v-btn size="small" color="primary" :loading="governance.classification.loading" @click="runClassificationRules">Run Rules</v-btn>
                    </div>
                    <div class="classification-admin-grid">
                      <div class="classification-panel">
                        <div class="panel-kicker">Categories</div>
                        <div class="classification-panel-actions">
                          <v-btn size="x-small" variant="tonal" @click="startClassificationCategoryCreate">New</v-btn>
                        </div>
                        <div class="classification-chip-cloud">
                          <v-chip
                            v-for="category in governance.classification.taxonomy?.categories || []"
                            :key="'classification-category-' + category.id"
                            size="small"
                            variant="tonal"
                            :color="category.parent ? 'indigo' : 'primary'"
                            @click="editClassificationCategory(category)"
                          >
                            {{ category.label }}<span v-if="category.parent">&nbsp;/ {{ category.parent }}</span>
                          </v-chip>
                        </div>
                        <div class="classification-editor">
                          <v-text-field v-model="governance.classification.categoryEditor.label" density="compact" variant="outlined" label="Category label" hide-details></v-text-field>
                          <div class="classification-editor-row">
                            <v-text-field v-model="governance.classification.categoryEditor.id" density="compact" variant="outlined" label="ID" hide-details></v-text-field>
                            <v-text-field v-model="governance.classification.categoryEditor.parent" density="compact" variant="outlined" label="Parent ID" hide-details></v-text-field>
                            <v-text-field v-model="governance.classification.categoryEditor.level" density="compact" variant="outlined" label="Level" type="number" hide-details></v-text-field>
                          </div>
                          <v-textarea v-model="governance.classification.categoryEditor.description" density="compact" variant="outlined" label="Description" rows="2" hide-details></v-textarea>
                          <v-text-field v-model="governance.classification.categoryEditor.regulatory_frameworks" density="compact" variant="outlined" label="Regulatory frameworks" hide-details></v-text-field>
                          <v-textarea v-model="governance.classification.categoryEditor.name_patterns" density="compact" variant="outlined" label="Name patterns" rows="3" hide-details></v-textarea>
                          <div class="classification-editor-row two">
                            <v-text-field v-model="governance.classification.categoryEditor.sensitivity_triggers" density="compact" variant="outlined" label="Sensitivity triggers" hide-details></v-text-field>
                            <v-text-field v-model="governance.classification.categoryEditor.tag_triggers" density="compact" variant="outlined" label="Tag triggers" hide-details></v-text-field>
                          </div>
                          <div class="btn-row">
                            <v-btn size="small" color="primary" @click="saveClassificationCategory">Save Category</v-btn>
                            <v-btn
                              size="small"
                              variant="tonal"
                              color="error"
                              :disabled="!(governance.classification.taxonomy?.categories || []).find((category) => category.id === governance.classification.selectedCategoryId && !category.built_in)"
                              @click="deleteClassificationCategory((governance.classification.taxonomy?.categories || []).find((category) => category.id === governance.classification.selectedCategoryId))"
                            >Delete</v-btn>
                          </div>
                        </div>
                      </div>
                      <div class="classification-panel">
                        <div class="panel-kicker">Rules</div>
                        <div class="classification-panel-actions">
                          <v-btn size="x-small" variant="tonal" @click="startClassificationRuleCreate">New</v-btn>
                        </div>
                        <div class="classification-rule-list">
                          <div
                            v-for="rule in (governance.classification.taxonomy?.rules || [])"
                            :key="'classification-rule-' + rule.id"
                            class="classification-rule"
                            @click="editClassificationRule(rule)"
                          >
                            <strong>{{ rule.classification }}</strong>
                            <span>{{ rule.label }}</span>
                            <v-chip size="x-small" variant="flat">{{ Math.round((rule.confidence || 0) * 100) }}%</v-chip>
                          </div>
                        </div>
                        <div class="classification-editor">
                          <v-text-field v-model="governance.classification.ruleEditor.label" density="compact" variant="outlined" label="Rule name" hide-details></v-text-field>
                          <div class="classification-editor-row">
                            <v-text-field v-model="governance.classification.ruleEditor.id" density="compact" variant="outlined" label="ID" hide-details></v-text-field>
                            <v-select v-model="governance.classification.ruleEditor.target" density="compact" variant="outlined" label="Target" :items="['asset', 'column']" hide-details></v-select>
                            <v-select v-model="governance.classification.ruleEditor.classification" density="compact" variant="outlined" label="Classification" :items="(governance.classification.taxonomy?.categories || []).map((category) => category.label)" hide-details></v-select>
                          </div>
                          <v-textarea v-model="governance.classification.ruleEditor.pattern" density="compact" variant="outlined" label="Regex pattern" rows="2" hide-details></v-textarea>
                          <div class="classification-editor-row">
                            <v-text-field v-model="governance.classification.ruleEditor.confidence" density="compact" variant="outlined" label="Confidence" type="number" step="0.01" min="0" max="1" hide-details></v-text-field>
                            <v-text-field v-model="governance.classification.ruleEditor.min_column_hits" density="compact" variant="outlined" label="Min column hits" type="number" hide-details></v-text-field>
                            <v-switch v-model="governance.classification.ruleEditor.enabled" density="compact" label="Enabled" hide-details color="primary"></v-switch>
                          </div>
                          <v-textarea v-model="governance.classification.ruleEditor.description" density="compact" variant="outlined" label="Description" rows="2" hide-details></v-textarea>
                          <div class="btn-row">
                            <v-btn size="small" color="primary" @click="saveClassificationRule">Save Rule</v-btn>
                            <v-btn
                              size="small"
                              variant="tonal"
                              color="error"
                              :disabled="!governance.classification.selectedRuleId"
                              @click="deleteClassificationRule((governance.classification.taxonomy?.rules || []).find((rule) => rule.id === governance.classification.selectedRuleId))"
                            >Delete</v-btn>
                          </div>
                        </div>
                      </div>
                      <div class="classification-panel">
                        <div class="panel-kicker">Coverage</div>
                        <div class="classification-count-grid">
                          <div
                            v-for="(count, label) in governance.classification.summary?.classification_counts || {}"
                            :key="'classification-count-' + label"
                            class="classification-count"
                          >
                            <span>{{ label }}</span>
                            <strong>{{ count }}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:8px;">
                      <span class="section-title">Governance Leaderboard</span>
                    </div>
                    <div class="asset-results">
                      <div v-for="item in governance.summaries.slice(0, 20)" :key="'gov-' + item.asset_id" class="asset-card">
                        <div class="asset-body">
                          <div class="asset-name">
                            <strong>{{ item.asset_id }}</strong>
                            <v-chip size="x-small" color="info" variant="tonal">{{ item.trust_level }}</v-chip>
                            <v-chip size="x-small" color="success" variant="flat" v-if="item.certified">Certified</v-chip>
                          </div>
                          <div class="asset-meta">
                            <v-chip size="x-small" class="schema-badge" variant="tonal">{{ item.database }}</v-chip>
                            <v-chip size="x-small" class="owner-chip" variant="outlined">&#128100; {{ item.owner || 'unassigned' }}</v-chip>
                            <v-chip size="x-small" class="type-chip" variant="outlined">{{ item.type }}</v-chip>
                            <v-chip size="x-small" variant="outlined">Score {{ item.trust_score }}</v-chip>
                            <v-chip size="x-small" variant="tonal" :color="qualityScoreColor(qualityScoreForItem(item))">Quality {{ qualityScoreForItem(item) ?? 'n/a' }}</v-chip>
                            <v-chip size="x-small" variant="outlined">Trend {{ qualityTrendLabel(item) }}</v-chip>
                          </div>
                        </div>
                        <div class="asset-actions">
                          <v-btn size="small" variant="outlined" @click="selectedObjectId = item.asset_id; onViewChange('browse'); $nextTick(loadObjectContext)">Open</v-btn>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <div v-if="activeView === 'governanceOps'" class="governance-page">
              <v-row>
                <v-col cols="12">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <div>
                        <span class="section-title">Governance Operations</span>
                        <p class="card-help">Stewardship, incidents, usage, publication readiness, and AI context activation from the shared Phase 7 service layer.</p>
                      </div>
                      <div class="btn-row">
                        <v-btn size="small" variant="outlined" :loading="governanceOps.loading" @click="loadGovernanceOps">Refresh</v-btn>
                        <v-btn size="small" color="primary" :loading="governanceOps.loading" @click="generateGovernanceTasks">Generate Tasks</v-btn>
                      </div>
                    </div>
                    <div class="policy-dashboard-grid" style="margin-bottom:12px;" v-if="governanceOps.storeStatus">
                      <div class="policy-dashboard-score">
                        <span>Durable Store</span>
                        <strong>{{ governanceOps.storeStatus.persistenceEnabled ? 'Enabled' : 'Disabled' }}</strong>
                        <small>{{ governanceOps.storeStatus.exists ? 'State file present' : 'No state file yet' }}</small>
                      </div>
                      <div class="policy-dashboard-score">
                        <span>Event Queue</span>
                        <strong>{{ governanceOps.storeStatus.counts?.eventDeliveries || 0 }}</strong>
                        <small>Email, Slack, Teams delivery records</small>
                      </div>
                      <div class="policy-dashboard-score">
                        <span>Comment Threads</span>
                        <strong>{{ governanceOps.storeStatus.counts?.commentThreads || 0 }}</strong>
                        <small>Asset collaboration threads</small>
                      </div>
                      <div class="policy-dashboard-score">
                        <span>Trust Actions</span>
                        <strong>{{ governanceOps.storeStatus.counts?.trustActionThreads || 0 }}</strong>
                        <small>Certification and endorsement histories</small>
                      </div>
                    </div>
                    <v-row>
                      <v-col cols="12" sm="6" md="3">
                        <v-card class="card kpi" variant="outlined">
                          <div class="value">{{ governanceOps.overview?.kpis?.totalAssets || 0 }}</div>
                          <div class="label">Governed Assets</div>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-card class="card kpi" variant="outlined">
                          <div class="value">{{ governanceOps.overview?.kpis?.averageTrustScore || 0 }}</div>
                          <div class="label">Avg Trust</div>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-card class="card kpi" variant="outlined">
                          <div class="value">{{ governanceOps.overview?.kpis?.openTasks || 0 }}</div>
                          <div class="label">Open Tasks</div>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-card class="card kpi" variant="outlined">
                          <div class="value">{{ governanceOps.overview?.kpis?.openIncidents || 0 }}</div>
                          <div class="label">Open Incidents</div>
                        </v-card>
                      </v-col>
                    </v-row>
                  </v-card>
                </v-col>

                <v-col cols="12">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <div>
                        <span class="section-title">Ownership & Stewardship Control</span>
                        <p class="card-help">Resolve business owner, steward, domain manager, and custodian accountability, including inherited roles and escalation paths.</p>
                      </div>
                      <div class="btn-row">
                        <v-text-field v-model="governanceOps.portfolioSubject" density="compact" variant="outlined" hide-details placeholder="owner, steward, or all"></v-text-field>
                        <v-btn size="small" variant="outlined" :loading="governanceOps.loading" @click="loadStewardPortfolio">Load Portfolio</v-btn>
                      </div>
                    </div>
                    <div class="policy-dashboard-grid" style="margin-bottom:12px;">
                      <div
                        v-for="role in governanceOps.ownershipModel"
                        :key="'ownership-role-' + role.role"
                        class="policy-dashboard-score"
                      >
                        <span>{{ role.label }}</span>
                        <strong>{{ governanceOps.ownershipSummary?.coverage?.[role.role]?.pct || 0 }}%</strong>
                        <small>{{ governanceOps.ownershipSummary?.coverage?.[role.role]?.count || 0 }} assigned · {{ governanceOps.ownershipSummary?.coverage?.[role.role]?.inherited || 0 }} inherited</small>
                      </div>
                    </div>
                    <v-row>
                      <v-col cols="12" md="7">
                        <div class="table-wrap">
                          <table class="data-table">
                            <thead>
                              <tr>
                                <th>Asset</th>
                                <th>Roles</th>
                                <th>Risk</th>
                                <th>Tasks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="asset in governanceOps.stewardPortfolio?.assets || []" :key="'portfolio-' + asset.assetId">
                                <td class="text-mono text-small">{{ asset.assetId }}</td>
                                <td>
                                  <v-chip v-for="role in asset.roles" :key="asset.assetId + role" size="x-small" variant="tonal">{{ role }}</v-chip>
                                </td>
                                <td>
                                  <v-chip size="x-small" :color="asset.qualityStatus === 'healthy' ? 'success' : 'warning'" variant="tonal">{{ asset.qualityStatus }}</v-chip>
                                </td>
                                <td>{{ asset.openTaskCount }} open · {{ asset.overdueTaskCount }} overdue</td>
                              </tr>
                              <tr v-if="!(governanceOps.stewardPortfolio?.assets || []).length">
                                <td colspan="4" class="empty">No owned or stewarded assets found for this subject.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </v-col>
                      <v-col cols="12" md="5">
                        <div class="policy-gap-list">
                          <div
                            v-for="alert in governanceOps.stewardPortfolio?.alerts || []"
                            :key="'portfolio-alert-' + alert.assetId"
                            class="policy-gap-row"
                          >
                            <strong>{{ alert.severity }}</strong>
                            <span>{{ alert.assetId }} · {{ alert.message }}</span>
                          </div>
                          <div v-if="!(governanceOps.stewardPortfolio?.alerts || []).length" class="policy-empty-row">No ownership alerts for this portfolio.</div>
                        </div>
                      </v-col>
                    </v-row>
                    <div class="form-row mt-8">
                      <div class="col-3"><v-text-field v-model="governanceOps.bulkAssetIds" density="compact" variant="outlined" hide-details placeholder="asset ids, comma separated"></v-text-field></div>
                      <div class="col-2"><v-text-field v-model="governanceOps.bulkOwner" density="compact" variant="outlined" hide-details placeholder="business owner"></v-text-field></div>
                      <div class="col-2"><v-text-field v-model="governanceOps.bulkSteward" density="compact" variant="outlined" hide-details placeholder="steward"></v-text-field></div>
                      <div class="col-2"><v-text-field v-model="governanceOps.bulkDomainManager" density="compact" variant="outlined" hide-details placeholder="domain manager"></v-text-field></div>
                      <div class="col-2"><v-text-field v-model="governanceOps.bulkCustodian" density="compact" variant="outlined" hide-details placeholder="custodian"></v-text-field></div>
                      <div class="col-1"><v-btn size="small" color="primary" :loading="governanceOps.loading" @click="planBulkOwnershipAssignment">Plan</v-btn></div>
                    </div>
                    <div v-if="governanceOps.bulkAssignmentPlan" class="scheduler-runtime-bar mt-8">
                      <span>{{ governanceOps.bulkAssignmentPlan.count }} asset(s)</span>
                      <span>{{ governanceOps.bulkAssignmentPlan.note }}</span>
                      <span v-if="governanceOps.bulkAssignmentPlan.task">Task {{ governanceOps.bulkAssignmentPlan.task.taskId }}</span>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="7">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Stewardship Work Queue</span>
                      <div class="btn-row">
                        <v-select v-model="governanceOps.selectedTaskStatus" density="compact" variant="outlined" hide-details clearable :items="['open','in_progress','blocked','done','canceled']" placeholder="status"></v-select>
                        <v-text-field v-model="governanceOps.taskAssetId" density="compact" variant="outlined" hide-details placeholder="asset id"></v-text-field>
                        <v-text-field v-model="governanceOps.taskTitle" density="compact" variant="outlined" hide-details placeholder="task title"></v-text-field>
                        <v-btn size="small" color="primary" @click="createGovernanceOpsTask">Add</v-btn>
                      </div>
                    </div>
                    <div class="table-wrap">
                      <table class="data-table">
                        <thead>
                          <tr>
                            <th>Asset</th>
                            <th>Task</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="task in governanceOps.tasks.filter((item) => !governanceOps.selectedTaskStatus || item.status === governanceOps.selectedTaskStatus).slice(0, 12)"
                            :key="'govops-task-' + task.taskId"
                          >
                            <td class="text-mono text-small">{{ task.assetId || '-' }}</td>
                            <td>{{ task.title }}</td>
                            <td><v-chip size="x-small" variant="tonal">{{ task.priority }}</v-chip></td>
                            <td>{{ task.status }}</td>
                            <td>
                              <v-btn v-if="task.status === 'open'" size="x-small" variant="outlined" @click="transitionGovernanceOpsTask(task, 'in_progress')">Start</v-btn>
                              <v-btn v-if="task.status !== 'done'" size="x-small" variant="outlined" @click="transitionGovernanceOpsTask(task, 'done')">Done</v-btn>
                            </td>
                          </tr>
                          <tr v-if="!governanceOps.tasks.length">
                            <td colspan="5" class="empty">No stewardship tasks yet. Generate tasks from metadata gaps to seed the queue.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="5">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Incidents</span>
                    </div>
                    <div class="form-row">
                      <div class="col-2"><v-select v-model="governanceOps.selectedIncidentStatus" density="compact" variant="outlined" hide-details clearable :items="['open','investigating','mitigated','resolved','closed']" placeholder="status"></v-select></div>
                      <div class="col-5"><v-text-field v-model="governanceOps.incidentAssetId" density="compact" variant="outlined" hide-details placeholder="asset id"></v-text-field></div>
                      <div class="col-4"><v-text-field v-model="governanceOps.incidentTitle" density="compact" variant="outlined" hide-details placeholder="incident title"></v-text-field></div>
                      <div class="col-1"><v-btn size="small" color="primary" @click="createGovernanceIncident">Create</v-btn></div>
                    </div>
                    <div class="quality-incident-list">
                      <div
                        v-for="incident in governanceOps.incidents.filter((item) => !governanceOps.selectedIncidentStatus || item.status === governanceOps.selectedIncidentStatus).slice(0, 6)"
                        :key="'govops-incident-' + incident.incidentId"
                        class="quality-incident-row"
                      >
                        <strong>{{ incident.severity }}</strong>
                        <span>{{ incident.assetId || 'unassigned' }} · {{ incident.title }} · {{ incident.status }}</span>
                        <v-btn v-if="incident.status === 'open'" size="x-small" variant="outlined" @click="transitionGovernanceIncident(incident, 'investigating')">Investigate</v-btn>
                        <v-btn v-if="incident.status !== 'resolved' && incident.status !== 'closed'" size="x-small" variant="outlined" @click="transitionGovernanceIncident(incident, 'resolved')">Resolve</v-btn>
                      </div>
                      <div v-if="!governanceOps.incidents.length" class="policy-empty-row">No governance incidents are open.</div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Publication Readiness</span>
                      <v-chip size="small" :color="governanceOps.publication?.ready ? 'success' : 'warning'" variant="tonal">
                        {{ governanceOps.publication?.ready ? 'Ready' : 'Needs Checks' }}
                      </v-chip>
                    </div>
                    <div class="policy-template-list">
                      <div v-for="check in governanceOps.publication?.checks || []" :key="'pub-check-' + check.name" class="policy-template-row">
                        <span>{{ check.name }}</span>
                        <div class="btn-row">
                          <strong>{{ check.status }}</strong>
                          <v-btn size="x-small" variant="outlined" @click="recordPublicationCheck(check.name, 'pass')">Pass</v-btn>
                          <v-btn size="x-small" variant="outlined" color="warning" @click="recordPublicationCheck(check.name, 'fail')">Fail</v-btn>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Adoption Leaders</span>
                    </div>
                    <div class="policy-gap-list">
                      <div v-for="asset in governanceOps.overview?.adoptionLeaders || []" :key="'adoption-' + asset.assetId" class="policy-gap-row">
                        <strong>{{ asset.assetId }}</strong>
                        <span>Score {{ asset.adoptionScore }} · usage {{ asset.usageCount }} · downstream {{ asset.downstreamCount }}</span>
                      </div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="4">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">AI Context Lookup</span>
                    </div>
                    <div class="btn-row">
                      <v-text-field v-model="governanceOps.contextQuery" density="compact" variant="outlined" hide-details placeholder="Ask a governance context question"></v-text-field>
                      <v-btn size="small" color="primary" @click="askGovernanceOpsContext">Ask</v-btn>
                    </div>
                    <div v-if="governanceOps.contextAnswer" class="mt-8">
                      <p class="card-help">{{ governanceOps.contextAnswer.answer }}</p>
                      <div class="policy-gap-list">
                        <div v-for="match in governanceOps.contextAnswer.matches || []" :key="'context-match-' + match.assetId" class="policy-gap-row">
                          <strong>{{ match.assetId }}</strong>
                          <span>{{ match.type }} · {{ match.owner }} · trust {{ match.trust?.score }}</span>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Governance Event Delivery Queue</span>
                      <v-chip size="small" variant="tonal">{{ governanceOps.eventDeliveries.length }} recent</v-chip>
                    </div>
                    <div class="table-wrap">
                      <table class="data-table">
                        <thead>
                          <tr>
                            <th>Event</th>
                            <th>Actor</th>
                            <th>Status</th>
                            <th>Channels</th>
                            <th>Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="event in governanceOps.eventDeliveries.slice(0, 12)" :key="'govops-event-' + event.deliveryId">
                            <td>{{ event.eventType }}</td>
                            <td>{{ event.actor?.email || event.actor?.userId || 'system' }}</td>
                            <td>{{ event.status }}</td>
                            <td>{{ (event.channels || []).join(', ') }}</td>
                            <td>{{ event.createdAt }}</td>
                          </tr>
                          <tr v-if="!governanceOps.eventDeliveries.length">
                            <td colspan="5" class="empty">No governance events have been queued yet.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <div v-if="activeView === 'lineageAsk'">
              <div class="lineage-assistant-shell">
                <section class="lineage-assistant-prompt">
                  <div class="lineage-assistant-title">
                    <v-icon>mdi-auto-fix</v-icon>
                    <div>
                      <h2>Sonic Lineage Assistant</h2>
                      <p>Ask a lineage question and get a plain-English answer with technical evidence.</p>
                    </div>
                  </div>
                  <div class="lineage-assistant-input">
                    <v-text-field
                      v-model="lineageQuestion"
                      density="comfortable"
                      variant="outlined"
                      hide-details
                      placeholder="Ask: what uses DimVehicle? how many tables are in WebV?"
                      prepend-inner-icon="mdi-message-question"
                      @keyup.enter="askLineageQuestion()"
                    ></v-text-field>
                    <v-btn color="primary" :loading="lineageQuestionLoading" @click="askLineageQuestion()">Ask</v-btn>
                  </div>
                  <div class="lineage-question-examples">
                    <v-btn size="small" variant="tonal" @click="askLineageQuestion('what uses DimVehicle?')">what uses DimVehicle?</v-btn>
                    <v-btn size="small" variant="tonal" @click="askLineageQuestion('what loads DimVehicle?')">what loads DimVehicle?</v-btn>
                    <v-btn size="small" variant="tonal" @click="askLineageQuestion('how many tables are in WebV?')">tables in WebV</v-btn>
                    <v-btn size="small" variant="tonal" @click="askLineageQuestion('?help')">?help</v-btn>
                  </div>
                </section>

                <div class="lineage-answer-workspace">
                  <main class="lineage-answer-document">
                    <div class="lineage-answer-toolbar">
                      <span>{{ lineageQuestionAnswer?.assistant?.title || 'Answer Workspace' }}</span>
                      <div class="btn-row">
                        <v-chip size="x-small" variant="tonal" v-if="lineageQuestionAnswer">{{ lineageQuestionAnswer.answer_type }}</v-chip>
                        <v-btn size="small" variant="outlined" @click="askLineageQuestion('?help')">Help</v-btn>
                        <v-btn size="small" variant="outlined" @click="clearLineageAssistant">Clear</v-btn>
                        <v-btn
                          v-if="lineageQuestionAnswer?.resolved_object?.object_id"
                          size="small"
                          variant="outlined"
                          append-icon="mdi-graphql"
                          @click="selectedObjectId = lineageQuestionAnswer.resolved_object.object_id; onViewChange('discovery')"
                        >Open Graph</v-btn>
                      </div>
                    </div>

                    <div v-if="lineageQuestionLoading" class="lineage-answer-empty">
                      <v-icon size="34">mdi-progress-clock</v-icon>
                      <h3>Building the answer</h3>
                      <p>Resolving your question against the loaded lineage catalog.</p>
                    </div>

                    <template v-else-if="lineageQuestionAnswer">
                      <p class="lineage-answer-lead">{{ lineageQuestionAnswer.plain_english }}</p>

                      <div v-if="lineageQuestionAnswer.caveats && lineageQuestionAnswer.caveats.length" class="lineage-caveat-list">
                        <div v-for="caveat in lineageQuestionAnswer.caveats" :key="'qa-doc-caveat-' + caveat" class="lineage-caveat-item">
                          {{ caveat }}
                        </div>
                      </div>

                      <template v-if="lineageAnswerRoleGroups().length">
                        <section v-for="group in lineageAnswerRoleGroups()" :key="'qa-group-' + group.title" class="lineage-answer-section">
                          <div class="lineage-answer-section-header">
                            <h3>{{ group.title }}</h3>
                            <span>{{ group.rows.length }} object{{ group.rows.length === 1 ? '' : 's' }}</span>
                          </div>
                          <div class="table-wrap lineage-answer-section-table">
                            <v-table density="compact">
                              <thead>
                                <tr>
                                  <th>Object</th>
                                  <th>Type</th>
                                  <th>Location</th>
                                  <th>Why it matters</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="row in group.rows" :key="'qa-group-row-' + group.title + '-' + row.id">
                                  <td><span class="lineage-answer-object">{{ row.label || row.id }}</span></td>
                                  <td>{{ row.type }}</td>
                                  <td class="lineage-answer-location">{{ row.location || '-' }}</td>
                                  <td class="lineage-answer-why">{{ row.why_it_matters || row.evidence || '-' }}</td>
                                </tr>
                              </tbody>
                            </v-table>
                          </div>
                        </section>
                      </template>

                      <section v-else-if="lineageQuestionRows(lineageQuestionAnswer).length" class="lineage-answer-section">
                        <div class="lineage-answer-section-header">
                          <h3>Results</h3>
                          <span>{{ lineageQuestionRows(lineageQuestionAnswer).length }} row{{ lineageQuestionRows(lineageQuestionAnswer).length === 1 ? '' : 's' }}</span>
                        </div>
                        <div class="table-wrap lineage-answer-section-table">
                          <v-table density="compact">
                            <thead>
                              <tr>
                                <th v-for="column in lineageQuestionColumns(lineageQuestionAnswer)" :key="'qa-doc-head-' + column">{{ column }}</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="(row, idx) in lineageQuestionRows(lineageQuestionAnswer).slice(0, 60)" :key="'qa-doc-row-' + idx">
                                <td v-for="column in lineageQuestionColumns(lineageQuestionAnswer)" :key="'qa-doc-cell-' + idx + '-' + column">
                                  <span v-if="column === 'Object' || column === 'Database' || column === 'Example'" class="lineage-answer-object">{{ lineageQuestionCell(row, column) }}</span>
                                  <span v-else>{{ lineageQuestionCell(row, column) }}</span>
                                </td>
                              </tr>
                            </tbody>
                          </v-table>
                        </div>
                      </section>

                      <div v-if="lineageQuestionAnswer.assistant?.suggested_followups?.length" class="lineage-followups answer-doc-followups">
                        <v-btn
                          v-for="followup in lineageQuestionAnswer.assistant.suggested_followups"
                          :key="'qa-doc-followup-' + followup"
                          size="small"
                          variant="tonal"
                          @click="askLineageQuestion(followup)"
                        >{{ followup }}</v-btn>
                      </div>
                    </template>

                    <div v-else class="lineage-answer-empty">
                      <v-icon size="34">mdi-message-question</v-icon>
                      <h3>Ask a lineage question</h3>
                      <p>Answers will be formatted like a short technical brief with exact object names and evidence.</p>
                    </div>
                  </main>

                  <aside class="lineage-evidence-rail">
                    <section class="lineage-rail-card">
                      <h3>Question</h3>
                      <p>{{ lineageQuestionAnswer?.question || lineageQuestion }}</p>
                    </section>

                    <section class="lineage-rail-card" v-if="lineageQuestionAnswer?.resolved_object">
                      <h3>Resolved Object</h3>
                      <div class="lineage-rail-kv"><span>ID</span><strong>{{ lineageQuestionAnswer.resolved_object.object_id }}</strong></div>
                      <div class="lineage-rail-kv"><span>Type</span><strong>{{ lineageQuestionAnswer.resolved_object.type }}</strong></div>
                    </section>

                    <section class="lineage-rail-card">
                      <h3>Sources</h3>
                      <div v-if="lineageQuestionAnswer?.sources?.length" class="lineage-source-list">
                        <div v-for="source in lineageQuestionAnswer.sources.slice(0, 12)" :key="'qa-rail-source-' + (source.object_id || source.source) + source.role" class="lineage-source-item">
                          <strong>{{ source.object || source.source }}</strong>
                          <span>{{ source.role || source.detail }}</span>
                          <code v-if="source.location">{{ source.location }}</code>
                        </div>
                      </div>
                      <p v-else class="lineage-rail-muted">Sources appear after an answer is built.</p>
                    </section>

                    <section class="lineage-rail-card" v-if="lineageQuestionHistory.length">
                      <h3>Recent Questions</h3>
                      <div class="lineage-question-history">
                        <button v-for="item in lineageQuestionHistory" :key="'qa-history-' + item" type="button" @click="askLineageQuestion(item)">
                          {{ item }}
                        </button>
                      </div>
                    </section>
                  </aside>
                </div>
              </div>
            </div>

            <div v-if="activeView === 'metrics'">
              <v-row>
                <v-col cols="12">
                  <v-card class="card" variant="outlined" style="padding:16px;">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Metric Intelligence</span>
                      <div class="btn-row">
                        <v-btn size="small" variant="outlined" @click="loadMetricRuntimePack">Runtime Pack</v-btn>
                        <v-btn size="small" color="primary" :loading="metrics.loading" @click="loadMetricRegistry">Refresh</v-btn>
                      </div>
                    </div>
                    <div class="form-row" style="grid-template-columns:1fr auto; margin-bottom:12px;">
                      <v-text-field
                        v-model="metrics.query"
                        placeholder="Search metric, table, business name, or definition"
                        density="compact"
                        variant="outlined"
                        hide-details
                        prepend-inner-icon="mdi-magnify"
                        @keyup.enter="loadMetricRegistry"
                      ></v-text-field>
                      <v-btn variant="outlined" @click="loadMetricRegistry">Search</v-btn>
                    </div>
                    <div class="kpi-grid" style="margin-bottom:12px;">
                      <v-card class="card kpi" variant="outlined"><div class="value">{{ metrics.registry?.summary?.total_metrics || 0 }}</div><div class="label">Metric Columns</div></v-card>
                      <v-card class="card kpi" variant="outlined"><div class="value">{{ metrics.registry?.summary?.confirmed_metrics || 0 }}</div><div class="label">Confirmed</div></v-card>
                      <v-card class="card kpi" variant="outlined"><div class="value">{{ metrics.registry?.summary?.metric_candidates || 0 }}</div><div class="label">Candidates</div></v-card>
                      <v-card class="card kpi" variant="outlined"><div class="value">{{ metrics.registry?.summary?.tables_with_metrics || 0 }}</div><div class="label">Tables With Metrics</div></v-card>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="7">
                  <v-card class="card" variant="outlined" style="padding:12px;">
                    <div class="section-header" style="margin-bottom:8px;">
                      <span class="section-title">Registry</span>
                      <span class="text-small">{{ metrics.registry?.pagination?.total || 0 }} result{{ (metrics.registry?.pagination?.total || 0) === 1 ? '' : 's' }}</span>
                    </div>
                    <div class="table-wrap" style="max-height:520px; overflow:auto;">
                      <v-table density="compact">
                        <thead>
                          <tr>
                            <th>Metric</th>
                            <th>Table</th>
                            <th>State</th>
                            <th>Confidence</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="metric in metrics.registry?.metrics || []"
                            :key="'metric-registry-' + metric.metric_id"
                            style="cursor:pointer;"
                            @click="metrics.objectId = metric.object_id; metrics.selectedColumn = metric.column_name; loadMetricTableAnswer();"
                          >
                            <td>
                              <strong>{{ metric.column_name }}</strong>
                              <div class="text-small">{{ metric.data_type }} · {{ metric.semantic_type }}</div>
                            </td>
                            <td>
                              <span class="text-mono text-small">{{ metric.object_id }}</span>
                              <div class="text-small">{{ metric.business_domain || metric.owner || '-' }}</div>
                            </td>
                            <td><v-chip size="x-small" variant="flat" :color="metric.metric_state === 'confirmed' ? 'success' : metric.metric_state === 'inferred' ? 'info' : 'warning'">{{ metric.metric_state }}</v-chip></td>
                            <td>{{ metric.confidence_label }} · {{ metric.confidence }}</td>
                          </tr>
                          <tr v-if="!(metrics.registry?.metrics || []).length">
                            <td colspan="4">No metric columns found for the current search.</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="5">
                  <v-card class="card" variant="outlined" style="padding:12px; margin-bottom:12px;">
                    <div class="section-header" style="margin-bottom:8px;">
                      <span class="section-title">Ask About A Table</span>
                      <v-btn size="small" variant="outlined" @click="loadMetricTableAnswer">Load</v-btn>
                    </div>
                    <div class="form-row" style="grid-template-columns:1fr; margin-bottom:10px;">
                      <v-text-field v-model="metrics.objectId" placeholder="table object id, e.g. Sonic_DW.dbo.FactSales" density="compact" variant="outlined" hide-details></v-text-field>
                    </div>
                    <p class="lineage-answer-text" v-if="metrics.tableAnswer">{{ metrics.tableAnswer.answer }}</p>
                    <div class="table-wrap" v-if="metrics.tableAnswer?.rows?.length" style="max-height:230px; overflow:auto;">
                      <v-table density="compact">
                        <thead><tr><th>Column</th><th>Why</th></tr></thead>
                        <tbody>
                          <tr
                            v-for="row in metrics.tableAnswer.rows"
                            :key="'metric-table-row-' + row.column"
                            style="cursor:pointer;"
                            @click="metrics.selectedColumn = row.column"
                          >
                            <td><strong>{{ row.column }}</strong><div class="text-small">{{ row.data_type }} · {{ row.state }}</div></td>
                            <td class="text-small">{{ row.why || '-' }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                  </v-card>

                  <v-card class="card" variant="outlined" style="padding:12px;">
                    <div class="section-header" style="margin-bottom:8px;">
                      <span class="section-title">Logic &amp; Impact</span>
                      <div class="btn-row">
                        <v-btn size="small" variant="outlined" @click="explainSelectedMetric">Explain Logic</v-btn>
                        <v-btn size="small" variant="outlined" @click="loadSelectedMetricProfile">Profile</v-btn>
                        <v-btn size="small" color="primary" @click="assessSelectedMetricImpact">Impact</v-btn>
                      </div>
                    </div>
                    <v-text-field v-model="metrics.selectedColumn" placeholder="Metric column" density="compact" variant="outlined" hide-details style="margin-bottom:10px;"></v-text-field>
                    <p v-if="metrics.logicAnswer" class="lineage-answer-text">{{ metrics.logicAnswer.answer }}</p>
                    <div v-if="metrics.logicAnswer?.caveats?.length" class="lineage-caveat-list">
                      <div v-for="caveat in metrics.logicAnswer.caveats" :key="'metric-caveat-' + caveat" class="lineage-caveat-item">{{ caveat }}</div>
                    </div>
                    <div v-if="metrics.impactAnswer" class="mini-stack" style="margin-top:10px;">
                      <div class="mini-metric"><span>Risk</span><strong>{{ metrics.impactAnswer.risk?.severity }}</strong></div>
                      <div class="mini-metric"><span>Impacted Evidence</span><strong>{{ metrics.impactAnswer.risk?.impacted_count }}</strong></div>
                      <div class="mini-metric"><span>Unresolved Risks</span><strong>{{ metrics.impactAnswer.risk?.unresolved_risk_count }}</strong></div>
                    </div>
                    <p v-if="metrics.profileAnswer" class="lineage-answer-text" style="margin-top:10px;">{{ metrics.profileAnswer.answer }}</p>
                    <div v-if="metrics.profileAnswer" class="mini-stack" style="margin-top:10px;">
                      <div class="mini-metric"><span>Rows</span><strong>{{ metrics.profileAnswer.profile?.summary?.row_count || 0 }}</strong></div>
                      <div class="mini-metric"><span>Null %</span><strong>{{ metrics.profileAnswer.profile?.latest?.null_percent ?? '-' }}</strong></div>
                      <div class="mini-metric"><span>Distinct</span><strong>{{ metrics.profileAnswer.profile?.latest?.distinct_count ?? '-' }}</strong></div>
                      <div class="mini-metric"><span>Raw Values</span><strong>{{ metrics.profileAnswer.profile?.raw_values_retained ? 'retained' : 'not retained' }}</strong></div>
                    </div>
                    <div v-if="metrics.profileAnswer?.caveats?.length" class="lineage-caveat-list">
                      <div v-for="caveat in metrics.profileAnswer.caveats" :key="'metric-profile-caveat-' + caveat" class="lineage-caveat-item">{{ caveat }}</div>
                    </div>
                    <div v-if="metrics.impactAnswer?.risk?.categories?.length" class="lineage-help-panel" style="margin-top:10px;">
                      <div class="lineage-help-title">Impact Categories</div>
                      <div class="lineage-help-examples">
                        <div v-for="category in metrics.impactAnswer.risk.categories" :key="'metric-impact-category-' + category.type" class="lineage-help-example">
                          <strong>{{ category.type }}</strong>
                          <span>{{ category.severity }} · {{ category.reason }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-if="metrics.runtimePack" class="lineage-help-panel" style="margin-top:10px;">
                      <div class="lineage-help-title">Runtime Pack</div>
                      <div class="lineage-help-copy">{{ metrics.runtimePack.summary?.total_metrics || 0 }} compact metric answer cards are available for chat/runtime use.</div>
                    </div>
                  </v-card>

                  <v-card class="card" variant="outlined" style="padding:12px; margin-top:12px;">
                    <div class="section-header" style="margin-bottom:8px;">
                      <span class="section-title">Profile Execution</span>
                      <div class="btn-row">
                        <v-btn size="small" variant="outlined" :loading="metrics.profiling.loading" @click="planMetricTableProfile">Plan</v-btn>
                        <v-btn size="small" color="primary" :loading="metrics.profiling.loading" @click="runMetricTableProfile">Run</v-btn>
                      </div>
                    </div>
                    <div class="form-row" style="grid-template-columns:1fr 1fr 1fr; margin-bottom:10px;">
                      <v-select v-model="metrics.profiling.dialect" density="compact" variant="outlined" label="Dialect" :items="['sql_server','postgresql','snowflake','bigquery','databricks','redshift']" hide-details></v-select>
                      <v-select v-model="metrics.profiling.mode" density="compact" variant="outlined" label="Profile mode" :items="['metadata_only','sample','full_scan']" hide-details></v-select>
                      <v-select v-model="metrics.profiling.executionMode" density="compact" variant="outlined" label="Execution" :items="['dry_run','simulate','live']" hide-details></v-select>
                    </div>
                    <div class="form-row" style="grid-template-columns:repeat(4, 1fr); margin-bottom:10px;">
                      <v-text-field v-model="metrics.profiling.maxColumns" density="compact" variant="outlined" label="Columns" type="number" hide-details></v-text-field>
                      <v-text-field v-model="metrics.profiling.samplePercent" density="compact" variant="outlined" label="Sample %" type="number" hide-details></v-text-field>
                      <v-text-field v-model="metrics.profiling.lockTimeoutMs" density="compact" variant="outlined" label="Lock ms" type="number" hide-details></v-text-field>
                      <v-text-field v-model="metrics.profiling.queryTimeoutMs" density="compact" variant="outlined" label="Query ms" type="number" hide-details></v-text-field>
                    </div>
                    <div class="lineage-caveat-item" style="margin-bottom:10px;">
                      Aggregate profile runs retain no raw values. Live runs require approved read-only connector credentials; dry runs only generate the plan.
                    </div>
                    <p v-if="metrics.profiling.answer" class="lineage-answer-text">{{ metrics.profiling.answer.answer }}</p>
                    <div v-if="metrics.profiling.plan || metrics.profiling.run" class="mini-stack" style="margin-top:10px;">
                      <div class="mini-metric"><span>Plan Status</span><strong>{{ metrics.profiling.plan?.status || '-' }}</strong></div>
                      <div class="mini-metric"><span>Planned Assets</span><strong>{{ metrics.profiling.plan?.summary?.planned_assets || 0 }}</strong></div>
                      <div class="mini-metric"><span>Profiled Assets</span><strong>{{ metrics.profiling.run?.summary?.assets_profiled || 0 }}</strong></div>
                      <div class="mini-metric"><span>Raw Values</span><strong>{{ metrics.profiling.run?.summary?.raw_values_retained ? 'retained' : 'not retained' }}</strong></div>
                    </div>
                    <div v-if="metrics.profiling.run?.errors?.length" class="lineage-caveat-list" style="margin-top:10px;">
                      <div v-for="error in metrics.profiling.run.errors" :key="'profile-error-' + error.asset_id + error.message" class="lineage-caveat-item">
                        {{ error.asset_id }}: {{ error.message }}
                      </div>
                    </div>
                    <div v-if="metrics.profiling.confluence" class="lineage-help-panel" style="margin-top:10px;">
                      <div class="lineage-help-title">Confluence Summary</div>
                      <div class="lineage-help-copy">{{ confluenceSummaryPreview(metrics.profiling.confluence.content) }}</div>
                    </div>
                    <pre v-if="metrics.profiling.plan?.actions?.[0]?.query?.sql" class="profile-sql-preview">{{ metrics.profiling.plan.actions[0].query.sql }}</pre>
                  </v-card>
                </v-col>
              </v-row>
            </div>

            <div v-if="activeView === 'discovery'">
              <v-row>
              <v-col cols="12">
              <v-card class="card" style="padding:12px 16px;" variant="outlined">
                <div class="section-header" style="margin-bottom:8px;">
                  <span class="section-title">&#x27C6; Lineage &amp; Dependency Graph</span>
                  <div class="btn-row">
                    <v-btn
                      size="small"
                      variant="outlined"
                      :loading="reports.blastRadiusLoading"
                      @click="runBlastRadiusAnalysis()"
                    >⚡ Blast Radius</v-btn>
                    <v-btn size="small" variant="outlined" @click="loadEdgeAudit">Edge Audit</v-btn>
                    <v-btn size="small" variant="outlined" @click="openGraphFocus">Expand</v-btn>
                    <v-btn size="small" variant="outlined" @click="focusGraphToFit">Fit</v-btn>
                    <v-btn size="small" variant="outlined" @click="openDiscoveryInNewTab">Open tab</v-btn>
                    <v-btn size="small" variant="outlined" @click="showOnlySsisPackages" v-if="graphHasSSISNodes">SSIS only</v-btn>
                    <v-btn size="small" variant="outlined" @click="showAllGraphNodes" v-if="graphHasSSISNodes && graphShowOnlySSIS">Show all</v-btn>
                    <v-btn size="small" color="primary" @click="renderSelectedLineage">↔ Render</v-btn>
                  </div>
                </div>
                <div class="form-row lineage-object-picker-row">
                  <div class="lineage-object-picker">
                    <v-text-field
                      v-model="lineageObjectSearch.query"
                      placeholder="Search table, view, procedure, or package"
                      density="compact"
                      variant="outlined"
                      hide-details
                      prepend-inner-icon="mdi-magnify"
                      :loading="lineageObjectSearch.loading"
                      @update:model-value="searchLineageObjects"
                      @keyup.enter="renderSelectedLineage"
                      @focus="lineageObjectSearch.open = lineageObjectSearch.results.length > 0"
                    ></v-text-field>
                    <div class="lineage-object-suggestions" v-if="lineageObjectSearch.open && lineageObjectSearch.results.length">
                      <button
                        v-for="item in lineageObjectSearch.results"
                        :key="'lineage-object-suggestion-' + item.id"
                        type="button"
                        @click="chooseLineageObject(item)"
                      >
                        <strong>{{ item.id }}</strong>
                        <span>{{ item.type }} · {{ item.database || 'unknown' }}</span>
                      </button>
                    </div>
                  </div>
                  <v-btn variant="outlined" @click="searchLineageObjects()">Search</v-btn>
                  <v-select
                    v-model="lineageAnswerIntent"
                    density="compact"
                    variant="outlined"
                    hide-details
                    style="width:180px;"
                    :items="lineageAnswerIntentOptions"
                    @update:model-value="selectedObjectId ? loadLineageAnswer() : null"
                  ></v-select>
                  <v-select
                    v-model="discoveryFormat"
                    density="compact"
                    variant="outlined"
                    hide-details
                    style="width:130px;"
                    :items="[
                      { title: 'Flowchart', value: 'centered' },
                      { title: 'Cytoscape', value: 'cytoscape' },
                      { title: 'Mermaid', value: 'mermaid' },
                    ]"
                  ></v-select>
                  <v-text-field type="number" min="1" max="5" v-model.number="discoveryDepth" density="compact" variant="outlined" hide-details style="width:70px;" title="Depth"></v-text-field>
                  <v-btn color="primary" @click="renderSelectedLineage">Render Graph</v-btn>
                </div>
                <div class="graph-legend">
                  <span class="legend-item"><span class="legend-dot" style="background:#2563eb;border-radius:2px;"></span>Table</span>
                  <span class="legend-item"><span class="legend-dot" style="background:#7c3aed;border-radius:2px;"></span>View</span>
                  <span class="legend-item"><span class="legend-dot" style="background:#ea580c;border-radius:2px;"></span>Procedure</span>
                  <span class="legend-item"><span class="legend-dot" style="background:#0d9488;border-radius:50%;"></span>Function</span>
                  <span class="legend-item"><span class="legend-dot" style="background:#be123c;border-radius:2px;"></span>Trigger</span>
                  <span class="legend-item"><span class="legend-dot" style="background:#5b21b6;border-radius:6px;"></span>SSIS Package</span>
                  <span class="legend-item"><span class="legend-dot" style="background:#22c55e;border-radius:50%;"></span>Direct business term</span>
                  <span class="legend-item"><span class="legend-dot" style="background:#f59e0b;border-radius:50%;"></span>Propagated term</span>
                  <span class="legend-item" style="margin-left:auto;font-size:10px;color:var(--text-faint);">Flow: producers -> focus -> consumers &nbsp;|&nbsp; Edge width = confidence</span>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:8px; margin:8px 0 10px;">
                  <v-btn size="small" variant="outlined" @click="loadEdgeAudit">Edge Audit</v-btn>
                  <v-btn size="small" variant="outlined" @click="openGraphFocus">Open fullscreen</v-btn>
                  <v-btn size="small" variant="outlined" @click="focusGraphToFit">Zoom to fit</v-btn>
                  <v-btn size="small" variant="outlined" @click="openDiscoveryInNewTab">Open in new tab</v-btn>
                  <v-btn size="small" variant="outlined" @click="showOnlySsisPackages" v-if="graphHasSSISNodes">SSIS only</v-btn>
                  <v-btn size="small" variant="outlined" @click="showAllGraphNodes" v-if="graphHasSSISNodes && graphShowOnlySSIS">Show all</v-btn>
                </div>
                <div v-if="graphHasSSISNodes" style="margin-bottom:8px; font-size:12px; color:#475569;">
                  SSIS package nodes are available in this graph. Use <strong>SSIS only</strong> to isolate them, double-click a package to drill into it, or <strong>Open fullscreen</strong> for a larger workspace.
                </div>
                <div v-if="discoveryFormat === 'centered'" style="margin-bottom:8px; font-size:12px; color:#475569;">
                  Flowchart mode keeps direct producers on the left, the focus object in the middle, and direct consumers on the right. SSIS package groups show the staging bridge that supports the final load.
                </div>
                <div v-if="graphShowHiddenHint" style="margin-top:8px; padding:10px 12px; border:1px solid #fde68a; border-radius:8px; background:#fffbeb; color:#92400e; font-size:12px;">
                  SSIS packages are often beyond the current depth. Try <strong>Expand</strong>, increase depth, or use <strong>Fit</strong> after rendering.
                </div>
              </v-card>
              </v-col>

              <v-row v-if="reports.blastRadius">
                <v-col cols="12" sm="6" md="3">
                  <v-card class="card kpi" variant="outlined"><div class="value">{{ reports.blastRadius.impactedObjects }}</div><div class="label">Blast Radius</div></v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card class="card kpi" variant="outlined"><div class="value">{{ reports.blastRadius.directDownstream }}</div><div class="label">Direct Downstream</div></v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card class="card kpi" variant="outlined"><div class="value">{{ reports.blastRadius.directUpstream }}</div><div class="label">Direct Upstream</div></v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card class="card kpi" variant="outlined"><div class="value">{{ reports.blastRadius.maxDepth }}</div><div class="label">Max Depth</div></v-card>
                </v-col>
              </v-row>

              <v-dialog v-model="graphFocusDialog.show" fullscreen scrollable>
                <v-card style="background:#f8fafc; min-height:100vh;">
                  <v-toolbar density="compact" color="white" flat>
                    <v-toolbar-title>Lineage Focus Mode - {{ selectedObjectId }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-chip v-if="graphHasSSISNodes" size="small" color="purple" variant="flat" style="margin-right:8px;">SSIS included</v-chip>
                    <v-chip v-else-if="graphShowHiddenHint" size="small" color="amber" variant="flat" style="margin-right:8px;">SSIS may be deeper</v-chip>
                    <v-btn size="small" variant="outlined" class="mr-2" @click="focusGraphToFit">Fit to view</v-btn>
                    <v-btn size="small" variant="outlined" class="mr-2" @click="resetGraphView">Reset</v-btn>
                    <v-btn icon="mdi-close" variant="text" @click="closeGraphFocus"></v-btn>
                  </v-toolbar>
                  <v-card-text style="padding:16px;">
                    <div class="form-row" style="grid-template-columns:1fr auto auto auto auto; margin-bottom:12px; align-items:center;">
                      <v-text-field
                        v-model="lineageObjectSearch.query"
                        placeholder="Search object"
                        density="compact"
                        variant="outlined"
                        hide-details
                        prepend-inner-icon="mdi-magnify"
                        @update:model-value="searchLineageObjects"
                        @keyup.enter="renderSelectedLineage"
                      ></v-text-field>
                      <v-text-field
                        v-model="graphSearchText"
                        placeholder="Search graph"
                        density="compact"
                        variant="outlined"
                        hide-details
                        @input="highlightGraphMatches"
                      ></v-text-field>
                      <v-select
                        v-model="discoveryFormat"
                        density="compact"
                        variant="outlined"
                        hide-details
                        style="width:130px;"
                        :items="[
                          { title: 'Flowchart', value: 'centered' },
                          { title: 'Cytoscape', value: 'cytoscape' },
                          { title: 'Mermaid', value: 'mermaid' },
                        ]"
                      ></v-select>
                      <v-text-field type="number" min="1" max="5" v-model.number="discoveryDepth" density="compact" variant="outlined" hide-details style="width:70px;"></v-text-field>
                      <v-btn color="primary" @click="renderSelectedLineage">Render Graph</v-btn>
                    </div>
                    <div v-if="graphSearchText" style="margin-bottom:10px; font-size:12px; color:#64748b;">
                      {{ graphSearchMatchCount }} match{{ graphSearchMatchCount === 1 ? '' : 'es' }} found.
                    </div>
                    <div v-if="discoveryFormat === 'centered'" class="lineage-flow-guide">
                      <span>SSIS packages / source tables</span>
                      <strong>-></strong>
                      <span>transform procedures</span>
                      <strong>-></strong>
                      <span>focus object</span>
                      <strong>-></strong>
                      <span>consumers</span>
                    </div>
                    <div v-if="discoveryFormat === 'cytoscape' || discoveryFormat === 'centered'" style="height:78vh; min-height:700px; border:1px solid #dbeafe; border-radius:12px; overflow:hidden; background:#fff;">
                      <div id="cy-graph-focus" style="width:100%; height:100%;"></div>
                    </div>
                    <div v-else-if="discoveryFormat === 'mermaid'" style="height:78vh; min-height:700px; border:1px solid #dbeafe; border-radius:12px; overflow:auto; background:#fff; padding:16px;" id="mermaid-graph-focus"></div>
                    <div v-else style="height:78vh; min-height:700px; border:1px solid #dbeafe; border-radius:12px; overflow:auto; background:#fff; padding:16px;">
                      <pre class="mono" style="margin:0;">{{ JSON.stringify(discoveryGraph?.data, null, 2) }}</pre>
                    </div>
                  </v-card-text>
                </v-card>
              </v-dialog>

              <v-dialog v-model="edgeAuditDialog" max-width="1200">
                <v-card>
                  <v-toolbar density="compact" color="white" flat>
                    <v-toolbar-title>Edge Audit - {{ selectedObjectId }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" @click="edgeAuditDialog = false"></v-btn>
                  </v-toolbar>
                  <v-card-text>
                    <div v-if="edgeAudit" style="margin-bottom:12px; display:flex; gap:12px; flex-wrap:wrap;">
                      <v-chip size="small" variant="flat">Total {{ edgeAudit.totalEdges }}</v-chip>
                      <v-chip size="small" color="green" variant="flat">Direct {{ edgeAudit.directEdges }}</v-chip>
                      <v-chip size="small" color="amber" variant="flat">Bridge {{ edgeAudit.bridgeEdges }}</v-chip>
                      <v-chip size="small" color="blue" variant="flat">Derived {{ edgeAudit.derivedEdges }}</v-chip>
                      <v-chip size="small" color="grey" variant="flat">Related {{ edgeAudit.relatedEdges }}</v-chip>
                    </div>
                    <div v-if="edgeAudit && edgeAudit.edges && edgeAudit.edges.length" class="table-wrap" style="max-height:70vh; overflow:auto;">
                      <v-table density="compact">
                        <thead>
                          <tr>
                            <th>Classification</th>
                            <th>Type</th>
                            <th>Source</th>
                            <th>Target</th>
                            <th>Source DB</th>
                            <th>Target DB</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="edge in edgeAudit.edges" :key="edge.source + '->' + edge.target + ':' + edge.type">
                            <td><v-chip size="x-small" :color="edge.classification === 'direct' ? 'green' : edge.classification === 'bridge' ? 'amber' : edge.classification === 'derived' ? 'blue' : 'grey'" variant="flat">{{ edge.classification }}</v-chip></td>
                            <td>{{ edge.type }}</td>
                            <td>{{ edge.sourceLabel }}</td>
                            <td>{{ edge.targetLabel }}</td>
                            <td>{{ edge.sourceDatabase || '-' }}</td>
                            <td>{{ edge.targetDatabase || '-' }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                    <div v-else class="empty-state" style="padding:20px;">
                      <div class="empty-state-icon">&#128202;</div>
                      <h4>No audit data yet</h4>
                      <p>Click Edge Audit after loading a graph.</p>
                    </div>
                  </v-card-text>
                </v-card>
              </v-dialog>

              <v-row>
              <v-col cols="12" md="8" lg="8">
              <v-card class="card" style="padding:12px;" variant="outlined">
                <div class="section-header" style="margin-bottom:8px;">
                  <span class="section-title">Lineage Graph - {{ selectedObjectId }}</span>
                  <div class="btn-row">
                    <v-btn size="small" variant="outlined" @click="loadDiscovery">↻</v-btn>
                  </div>
                </div>
                <div v-if="discoveryFormat === 'centered'" class="lineage-flow-guide">
                  <span>SSIS packages / source tables</span>
                  <strong>-></strong>
                  <span>transform procedures</span>
                  <strong>-></strong>
                  <span>focus object</span>
                  <strong>-></strong>
                  <span>consumers</span>
                </div>
                <div class="graph-box" v-if="discoveryFormat === 'cytoscape' || discoveryFormat === 'centered'"><div id="cy-graph"></div></div>
                <div class="graph-box" v-else-if="discoveryFormat === 'mermaid'" id="mermaid-graph"></div>
                <div class="graph-box" v-else style="padding:12px;"><pre class="mono" style="overflow:auto;margin:0;">{{ JSON.stringify(discoveryGraph?.data, null, 2) }}</pre></div>
              </v-card>

              <v-card class="card lineage-compact-matrix" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Dependency Matrix &amp; Tier Distribution</span>
                  <div class="btn-row">
                    <v-text-field v-model="matrixDatabase" placeholder="Database" density="compact" variant="outlined" hide-details style="width:140px;"></v-text-field>
                    <v-btn size="small" variant="outlined" @click="loadDiscovery">Reload</v-btn>
                  </div>
                </div>
                <div class="table-wrap lineage-compact-matrix-table" v-if="reports.blastHeatmap && reports.blastHeatmap.length">
                  <v-table density="compact">
                    <thead><tr><th>Tier</th><th>Object Type</th><th>Count</th></tr></thead>
                    <tbody>
                      <tr v-for="cell in reports.blastHeatmap" :key="'heat-' + cell.tier + '-' + cell.type">
                        <td><v-chip size="x-small" :class="cell.tier === 'T1' ? 'admin' : cell.tier === 'T2' ? 'poweruser' : 'analyst'" variant="flat">{{ cell.tier }}</v-chip></td>
                        <td>{{ cell.type }}</td>
                        <td><strong>{{ cell.count }}</strong></td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
                <div v-else class="empty-state lineage-compact-empty">
                  <div class="empty-state-icon">&#128202;</div>
                  <h4>No heat map data yet</h4>
                  <p>Run a blast radius analysis to see tier and type distribution.</p>
                </div>
              </v-card>
              </v-col>

              <v-col cols="12" md="4" lg="4">
              <v-card class="card" style="padding:12px; margin-bottom:12px;" variant="outlined">
                <div class="section-header" style="margin-bottom:8px;">
                  <span class="section-title">Lineage Answer</span>
                  <div class="btn-row">
                    <v-btn size="small" variant="outlined" @click="loadLineageAnswer" :loading="lineageAnswerLoading">Refresh</v-btn>
                    <v-btn size="small" variant="outlined" @click="onViewChange('docs'); openDocByKey('help-center')">Help</v-btn>
                  </div>
                </div>

                <div class="mini-stack" style="margin-bottom:10px;">
                  <div class="mini-metric"><span>Intent</span><strong>{{ lineageAnswer?.intent_description || 'Choose a lineage question' }}</strong></div>
                  <div class="mini-metric"><span>Focus Object</span><strong style="font-family:monospace;font-size:11px;">{{ selectedObjectId || '-' }}</strong></div>
                </div>

                <div v-if="lineageAnswerLoading" class="empty-state" style="padding:20px;">
                  <div class="empty-state-icon">&#8987;</div>
                  <h4>Building answer</h4>
                  <p>Summarizing the semantic lineage for this object.</p>
                </div>

                <template v-else-if="lineageAnswer">
                  <p class="lineage-answer-text">{{ lineageAnswer.plain_english }}</p>

                  <div v-if="lineageAnswer.caveats && lineageAnswer.caveats.length" class="lineage-caveat-list">
                    <div v-for="caveat in lineageAnswer.caveats" :key="caveat" class="lineage-caveat-item">
                      {{ caveat }}
                    </div>
                  </div>

                  <div class="table-wrap lineage-answer-table" v-if="lineageAnswer.impacted_objects && lineageAnswer.impacted_objects.length">
                    <v-table density="compact">
                      <thead>
                        <tr>
                          <th>Role</th>
                          <th>Object</th>
                          <th>Type</th>
                          <th>Where</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="item in lineageAnswer.impacted_objects.slice(0, 12)" :key="'lineage-answer-' + item.role + '-' + item.id">
                          <td>{{ item.role }}</td>
                          <td>
                            <div class="lineage-answer-object">{{ item.label }}</div>
                            <div class="lineage-answer-why">{{ item.why_it_matters }}</div>
                          </td>
                          <td>{{ item.type }}</td>
                          <td class="lineage-answer-location">{{ item.location || '-' }}</td>
                        </tr>
                      </tbody>
                    </v-table>
                  </div>

                  <div v-if="lineageHelp && lineageHelp.examples && lineageHelp.examples.length" class="lineage-help-panel">
                    <div class="lineage-help-title">How to ask</div>
                    <div class="lineage-help-copy">{{ lineageHelp.plain_english }}</div>
                    <div class="lineage-help-examples">
                      <div v-for="example in lineageHelp.examples.slice(0, 4)" :key="example.prompt" class="lineage-help-example">
                        <strong>{{ example.prompt }}</strong>
                        <span>{{ example.description }}</span>
                      </div>
                    </div>
                  </div>
                </template>

                <div v-else class="empty-state" style="padding:20px;">
                  <div class="empty-state-icon">&#128270;</div>
                  <h4>No lineage answer yet</h4>
                  <p>Render the object to get a plain-English explanation and impacted object list.</p>
                </div>
              </v-card>

              <v-card ref="impactSummaryCard" class="card" style="padding:12px;" variant="outlined">
                <h3>Impact Summary</h3>
                <div
                  v-if="reports.blastRadiusStatus"
                  class="lineage-action-status"
                  :class="{ active: reports.blastRadiusLoading }"
                >
                  {{ reports.blastRadiusStatus }}
                </div>
                <div class="mini-stack" style="margin-bottom:10px;">
                  <div class="mini-metric"><span>Focus Object</span><strong style="font-family:monospace;font-size:11px;">{{ selectedObjectId }}</strong></div>
                  <div class="mini-metric"><span>Top Reach Score</span><strong>{{ reports.blastRows?.[0]?.reachScore || 0 }}</strong></div>
                  <div class="mini-metric"><span>Highest Tier</span><strong>{{ reports.blastRows?.[0]?.tier || '-' }}</strong></div>
                </div>

                <div class="ranked-list">
                  <div
                    v-for="(item, idx) in (reports.blastRows || []).slice(0, 10)"
                    :key="'disc-impact-' + item.id"
                    class="ranked-item"
                    style="cursor:pointer;"
                    @click="selectedObjectId = item.id; loadDiscovery()"
                  >
                    <span class="ranked-num">#{{ idx + 1 }}</span>
                    <span class="ranked-name">{{ item.id }}</span>
                    <span class="ranked-type">{{ item.tier }}</span>
                    <span class="ranked-score">{{ item.reachScore }}</span>
                  </div>
                  <div v-if="!reports.blastRows || reports.blastRows.length === 0" class="empty-state" style="padding:20px;">
                    <div class="empty-state-icon">&#x26A1;</div>
                    <h4>No impact data</h4>
                    <p>Render a graph first, then click Blast Radius.</p>
                  </div>
                </div>
              </v-card>
              </v-col>
              </v-row>

            </div>

            <div v-if="activeView === 'reports'">
              <v-row>
              <v-col cols="12">
              <v-card class="card" style="padding:12px 16px;" variant="outlined">
                <div class="section-header" style="margin-bottom:10px;">
                  <span class="section-title">&#x25A7; Executive Reporting Suite</span>
                  <v-chip size="small" color="info" variant="tonal">{{ resolvedPersona.charAt(0).toUpperCase() + resolvedPersona.slice(1) }} View</v-chip>
                </div>
                <v-row>
                  <v-col cols="12" sm="6" md="3"><v-card class="card kpi" variant="outlined"><div class="value">{{ executiveReportMetrics.objects }}</div><div class="label">Governed Objects</div></v-card></v-col>
                  <v-col cols="12" sm="6" md="3"><v-card class="card kpi" variant="outlined"><div class="value">{{ executiveReportMetrics.dependencies }}</div><div class="label">Total Dependencies</div></v-card></v-col>
                  <v-col cols="12" sm="6" md="3"><v-card class="card kpi" variant="outlined"><div class="value">{{ executiveReportMetrics.qualityScore || '-' }}</div><div class="label">Quality Score</div></v-card></v-col>
                  <v-col cols="12" sm="6" md="3"><v-card class="card kpi" variant="outlined"><div class="value">{{ executiveReportMetrics.blastObjects }}</div><div class="label">High-Risk Objects</div></v-card></v-col>
                </v-row>
              </v-card>
              </v-col>

              <v-col cols="12">
              <v-card class="card" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Data Marketplace Access Workflow</span>
                  <div class="btn-row">
                    <v-select
                      v-model="marketplace.scope"
                      density="compact"
                      variant="outlined"
                      hide-details
                      style="width:170px;"
                      :items="[
                        { title: 'My Requests', value: 'mine' },
                        { title: 'My Approvals', value: 'approvals' },
                        ...(isMarketplaceAdmin ? [{ title: 'All Requests', value: 'all' }] : []),
                      ]"
                      @update:model-value="loadMarketplaceRequests"
                    ></v-select>
                    <v-btn size="small" variant="outlined" @click="loadMarketplaceRequests()">Refresh</v-btn>
                  </div>
                </div>

                <div class="form-row" style="margin-bottom:10px;">
                  <div class="col-3"><v-label>Asset ID</v-label><v-text-field v-model="marketplace.form.assetId" placeholder="sales.orders" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-2"><v-label>Requested Role</v-label><v-select v-model="marketplace.form.requestedRole" density="compact" variant="outlined" hide-details :items="['Viewer','Analyst','PowerUser']"></v-select></div>
                  <div class="col-3"><v-label>Approver User ID</v-label><v-text-field v-model="marketplace.form.approverId" placeholder="user-approver" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Approver Email</v-label><v-text-field v-model="marketplace.form.approverEmail" placeholder="approver@company.com" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <v-label>Business Justification</v-label>
                <v-textarea v-model="marketplace.form.justification" rows="3" variant="outlined" density="compact" hide-details placeholder="Describe why access is required and business impact if delayed."></v-textarea>
                <div class="btn-row" style="margin-top:10px;">
                  <v-btn color="primary" @click="submitMarketplaceAccessRequest" :loading="marketplace.loading" :disabled="marketplace.loading">Submit Request</v-btn>
                  <v-btn variant="tonal" @click="syncMarketplaceFormWithSelection">Use Selected Object</v-btn>
                </div>

                <div class="table-wrap mt-8">
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th>Request</th>
                        <th>Asset</th>
                        <th>Status</th>
                        <th>Requester</th>
                        <th>Approver</th>
                        <th>SLA Due</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="requestItem in marketplace.requests" :key="requestItem.requestId">
                        <td class="text-mono text-small">{{ requestItem.requestId }}</td>
                        <td>{{ requestItem.assetId }}</td>
                        <td>
                        <v-chip size="x-small" variant="tonal" :color="requestItem.sla?.overdue ? 'amber' : 'success'">{{ requestItem.status }}</v-chip>
                        </td>
                        <td>{{ requestItem.requester?.email || requestItem.requester?.userId || '-' }}</td>
                        <td>{{ requestItem.approver?.email || requestItem.approver?.userId || '-' }}</td>
                        <td>{{ formatTimestamp(requestItem.sla?.dueAt) }}</td>
                        <td class="btn-row">
                          <v-btn
                            v-if="canReviewMarketplaceRequest(requestItem) && ['submitted','in-review','request-more-info'].includes(requestItem.status)"
                            size="small"
                            variant="outlined"
                            @click="reviewMarketplaceRequest(requestItem, 'start_review')"
                          >Start</v-btn>
                          <v-btn
                            v-if="canReviewMarketplaceRequest(requestItem) && ['submitted','in-review','request-more-info'].includes(requestItem.status)"
                            size="small"
                            variant="outlined"
                            @click="reviewMarketplaceRequest(requestItem, 'request_more_info')"
                          >More Info</v-btn>
                          <v-btn
                            v-if="canReviewMarketplaceRequest(requestItem) && ['submitted','in-review','request-more-info'].includes(requestItem.status)"
                            size="small"
                            color="success"
                            variant="tonal"
                            @click="reviewMarketplaceRequest(requestItem, 'approve')"
                          >Approve</v-btn>
                          <v-btn
                            v-if="canReviewMarketplaceRequest(requestItem) && ['submitted','in-review','request-more-info'].includes(requestItem.status)"
                            size="small"
                            color="error"
                            variant="tonal"
                            @click="reviewMarketplaceRequest(requestItem, 'reject')"
                          >Reject</v-btn>
                          <v-btn
                            v-if="isMarketplaceAdmin && requestItem.status === 'approved'"
                            size="small"
                            color="primary"
                            @click="fulfillMarketplaceRequest(requestItem)"
                          >Fulfill</v-btn>
                        </td>
                      </tr>
                      <tr v-if="!marketplace.requests.length">
                        <td colspan="7" class="empty">No access requests found for this scope.</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>

              <v-card class="card span-8" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Blast Radius Analysis</span>
                  <div class="btn-row">
                    <v-text-field v-model="selectedObjectId" placeholder="Object ID" density="compact" variant="outlined" hide-details style="width:200px;"></v-text-field>
                    <v-btn size="small" color="primary" @click="loadDiscovery">Recalculate</v-btn>
                    <v-btn size="small" variant="outlined" @click="refreshBlastRadiusReport">Refresh</v-btn>
                  </div>
                </div>
                <div class="stat-row" v-if="reports.blastRadius">
                  <div class="stat-item"><div class="stat-value">{{ reports.blastRadius.impactedObjects }}</div><div class="stat-label">Impacted</div></div>
                  <div class="stat-item"><div class="stat-value">{{ reports.blastRadius.directDownstream }}</div><div class="stat-label">Downstream</div></div>
                  <div class="stat-item"><div class="stat-value">{{ reports.blastRadius.directUpstream }}</div><div class="stat-label">Upstream</div></div>
                  <div class="stat-item"><div class="stat-value">{{ reports.blastRadius.maxDepth }}</div><div class="stat-label">Max Depth</div></div>
                </div>
                <div style="height:280px;margin-top:10px;"><canvas id="blast-radius-chart"></canvas></div>
              </v-card>

              <v-card class="card span-4" variant="outlined">
                <h3>Tier &times; Type Distribution</h3>
                <div class="table-wrap" v-if="reports.blastHeatmap && reports.blastHeatmap.length">
                  <v-table density="compact">
                    <thead><tr><th>Tier</th><th>Type</th><th>#</th></tr></thead>
                    <tbody>
                      <tr v-for="cell in reports.blastHeatmap" :key="'rep-heat-' + cell.tier + '-' + cell.type">
                        <td><v-chip size="x-small" :class="cell.tier==='T1'?'admin':cell.tier==='T2'?'poweruser':'analyst'" variant="flat">{{ cell.tier }}</v-chip></td>
                        <td>{{ cell.type }}</td>
                        <td><strong>{{ cell.count }}</strong></td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
                <div v-else class="empty-state" style="padding:24px;">
                  <div class="empty-state-icon">&#128200;</div>
                  <h4>No heat data</h4>
                  <p>Run blast radius analysis first.</p>
                </div>
              </v-card>

              <v-card class="card span-12" variant="outlined">
                <div class="section-header">
                  <span class="section-title">&#127942; Critical Dependency Leaderboard</span>
                  <span class="text-muted text-small">Top 10 objects by reach score - highest risk targets</span>
                </div>
                <div class="ranked-list" v-if="criticalDependencyLeaderboard.length">
                  <div
                    v-for="(row, idx) in criticalDependencyLeaderboard"
                    :key="'leader-' + row.id"
                    class="ranked-item"
                    style="grid-template-columns:28px 1fr 80px 60px 60px 70px;cursor:pointer;"
                    @click="selectedObjectId = row.id"
                  >
                    <span class="ranked-num" :style="idx < 3 ? 'color:#f59e0b;font-weight:900;' : ''">#{{ idx + 1 }}</span>
                    <span class="ranked-name">{{ row.id }}</span>
                    <span class="ranked-type">
                      <v-chip size="x-small" :class="row.tier==='T1'?'admin':row.tier==='T2'?'poweruser':'analyst'" variant="flat">{{ row.tier }}</v-chip>
                    </span>
                    <span class="text-small text-muted" style="text-align:center;">&#8679; {{ row.inDegree }}</span>
                    <span class="text-small text-muted" style="text-align:center;">&#8681; {{ row.outDegree }}</span>
                    <span class="ranked-score">{{ row.reachScore }}</span>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <div class="empty-state-icon">&#127942;</div>
                  <h4>Leaderboard empty</h4>
                  <p>Load lineage data and run blast radius to populate.</p>
                </div>
              </v-card>

              <v-card class="card span-12" variant="outlined">
                <div class="section-header">
                  <span class="section-title">All Dependency Reach</span>
                  <span class="text-muted text-small">{{ (reports.blastRows || []).length }} objects analyzed</span>
                </div>
                <div class="table-wrap">
                  <v-table density="compact">
                    <thead><tr>
                      <th>Object</th><th>Type</th><th>Tier</th>
                      <th>Downstream</th><th>Upstream</th><th>Reach Score</th>
                    </tr></thead>
                    <tbody>
                      <tr
                        v-for="row in (reports.blastRows || []).slice(0, 30)"
                        :key="'blast-row-' + row.id"
                        class="clickable"
                        @click="selectedObjectId = row.id"
                      >
                        <td><strong>{{ row.id }}</strong></td>
                        <td><v-chip size="x-small" class="type-chip" variant="outlined">{{ row.type }}</v-chip></td>
                        <td><v-chip size="x-small" :class="row.tier==='T1'?'admin':row.tier==='T2'?'poweruser':'analyst'" variant="flat">{{ row.tier }}</v-chip></td>
                        <td>{{ row.downstreamDepth === null ? '-' : row.downstreamDepth }}</td>
                        <td>{{ row.upstreamDepth === null ? '-' : row.upstreamDepth }}</td>
                        <td><strong style="color:var(--primary);">{{ row.reachScore }}</strong></td>
                      </tr>
                      <tr v-if="!reports.blastRows || reports.blastRows.length === 0">
                        <td colspan="6" class="empty">No blast radius data yet - render a graph first.</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>

              <v-card class="card span-7" variant="outlined">
                <h3>Export Center</h3>
                <div class="export-cards">
                  <div class="export-card" @click="downloadProtected('/api/v1/reporting/export/catalog.csv', 'catalog.csv')">
                    <div class="export-icon">&#128202;</div>
                    <div class="export-label">Catalog CSV</div>
                    <div class="export-desc">All objects, flat export</div>
                  </div>
                  <div class="export-card" @click="downloadProtected('/api/v1/reporting/export/catalog.xlsx', 'catalog.xlsx')">
                    <div class="export-icon">&#128209;</div>
                    <div class="export-label">Excel Workbook</div>
                    <div class="export-desc">Formatted spreadsheet</div>
                  </div>
                  <div class="export-card" @click="downloadProtected('/api/v1/reporting/export/dependency/' + encodeURIComponent(selectedObjectId) + '.pdf', 'dependency.pdf')">
                    <div class="export-icon">&#128196;</div>
                    <div class="export-label">Dependency PDF</div>
                    <div class="export-desc">Impact report for {{ selectedObjectId }}</div>
                  </div>
                  <div class="export-card" @click="downloadProtected('/api/v1/reporting/export/visualization/' + encodeURIComponent(selectedObjectId) + '?format=svg', 'visualization.svg')">
                    <div class="export-icon">&#127912;</div>
                    <div class="export-label">Graph SVG</div>
                    <div class="export-desc">Lineage visualization</div>
                  </div>
                </div>

                <div class="section-header mt-8">
                  <span class="section-title">Share Link</span>
                </div>
                <div class="form-row" style="grid-template-columns:1fr auto auto;">
                  <v-text-field v-model="reports.shareObjectId" placeholder="Object ID" density="compact" variant="outlined" hide-details></v-text-field>
                  <v-select v-model="reports.shareFormat" density="compact" variant="outlined" hide-details style="width:80px;" :items="['svg','png']"></v-select>
                  <v-btn size="small" variant="outlined" @click="createShareLink">Generate</v-btn>
                </div>
                <div class="code-block mt-8" v-if="reports.sharedLink" style="word-break:break-all;">{{ reports.sharedLink }}</div>
              </v-card>

              <v-card class="card span-5" variant="outlined">
                <h3>One-Click Report Packs</h3>
                <div class="pack-cards" style="grid-template-columns:1fr;">
                  <div class="pack-card">
                    <div class="pack-card-header">&#127970; Executive Pack</div>
                    <div class="pack-files">Excel catalog + Dependency PDF + Visualization SVG</div>
                    <v-btn block color="primary" :loading="reports.runningPack" :disabled="reports.runningPack" @click="runReportPack('executive')">
                      {{ reports.runningPack ? 'Downloading...' : 'Download Executive Pack' }}
                    </v-btn>
                  </div>
                  <div class="pack-card" style="margin-top:8px;">
                    <div class="pack-card-header">&#128101; Steward Pack</div>
                    <div class="pack-files">CSV catalog + Dependency PDF</div>
                    <v-btn block variant="tonal" :disabled="reports.runningPack" @click="runReportPack('steward')">
                      Download Steward Pack
                    </v-btn>
                  </div>
                  <div class="pack-card" style="margin-top:8px;">
                    <div class="pack-card-header">&#128200; Analyst Pack</div>
                    <div class="pack-files">CSV catalog + Graph SVG</div>
                    <v-btn block variant="outlined" :disabled="reports.runningPack" @click="runReportPack('analyst')">
                      Download Analyst Pack
                    </v-btn>
                  </div>
                </div>

                <div class="pack-status mt-8" v-if="reports.lastPackRun">
                  &#10003; Last run: <strong>{{ reports.lastPackRun.packType }}</strong> pack &nbsp;&middot;&nbsp;
                  {{ reports.lastPackRun.fileCount }} files &nbsp;&middot;&nbsp;
                  {{ new Date(reports.lastPackRun.downloadedAt).toLocaleTimeString() }}
                </div>

                <div class="divider"></div>
                <h4>Scheduled Reports</h4>
                <div class="form-row" style="grid-template-columns:1fr auto;">
                  <v-text-field v-model="reports.recipient" placeholder="Recipient email" density="compact" variant="outlined" hide-details></v-text-field>
                  <v-btn size="small" variant="outlined" @click="createSchedule">Schedule</v-btn>
                </div>
                <div class="table-wrap mt-8" v-if="reports.schedules.length">
                  <v-table density="compact">
                    <thead><tr><th>ID</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                      <tr v-for="item in reports.schedules" :key="item.scheduleId">
                        <td class="text-mono">{{ item.scheduleId }}</td>
                        <td><v-chip size="x-small" variant="tonal" :color="item.active ? 'success' : 'secondary'">{{ item.active ? 'Active' : 'Paused' }}</v-chip></td>
                        <td><v-btn size="small" variant="outlined" @click="runSchedule(item.scheduleId)">Run</v-btn></td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
                <div v-else class="empty">No schedules configured.</div>
              </v-card>
            </div>

            <div v-if="activeView === 'integrations'" class="grid integrations-secondary-grid">
              <v-card v-if="integrations.connectorWorkflowTab === 'integrations'" class="card span-12 help-strip" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Integrations Guide</span>
                  <v-btn size="small" variant="outlined" @click="onViewChange('docs'); openDocByKey('help-center')">Open Help Center</v-btn>
                </div>
                <div class="help-strip-grid">
                  <div class="help-pill"><strong>Notifications</strong><span>Send governance events to email, Slack, or Teams.</span></div>
                  <div class="help-pill"><strong>Webhooks</strong><span>Push event payloads into external systems and test delivery.</span></div>
                  <div class="help-pill"><strong>External Links</strong><span>Attach Jira/Confluence/Runbook links to any catalog object.</span></div>
                  <div class="help-pill"><strong>CI/CD Checks</strong><span>Run impact, compliance, and docs checks before deploy.</span></div>
                </div>
              </v-card>

              <v-card class="card span-12" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Managed Metadata Connectors</span>
                  <div class="btn-row">
                    <v-btn size="small" variant="outlined" :loading="integrations.connectorLoading" @click="loadManagedConnectors">Refresh</v-btn>
                  </div>
                </div>
                <p class="card-help">Create a reusable source connection, then run an immediate profile or schedule a recurring refresh from that same saved connector.</p>
                <div class="connector-workflow-rail">
                  <button
                    v-for="step in connectorWorkflowSteps"
                    :key="'connector-step-' + step.key"
                    type="button"
                    class="connector-workflow-step"
                    :class="{ active: integrations.connectorWorkflowTab === step.key, done: step.done }"
                    @click="integrations.connectorWorkflowTab = step.key"
                  >
                    <span>{{ step.done ? 'Done' : 'Next' }}</span>
                    <strong>{{ step.label }}</strong>
                  </button>
                </div>
                <div class="connector-workflow-tabs">
                  <v-btn-toggle v-model="integrations.connectorWorkflowTab" mandatory density="compact" variant="outlined">
                    <v-btn value="connection" prepend-icon="mdi-database-cog">Connection</v-btn>
                    <v-btn value="run" prepend-icon="mdi-play-circle">Run Profile Now</v-btn>
                    <v-btn value="schedule" prepend-icon="mdi-calendar-clock">Schedule Refresh</v-btn>
                    <v-btn value="access" prepend-icon="mdi-account-key">Access</v-btn>
                    <v-btn value="history" prepend-icon="mdi-history">History</v-btn>
                    <v-btn value="integrations" prepend-icon="mdi-bell">Notifications</v-btn>
                  </v-btn-toggle>
                </div>

                <div v-if="integrations.connectorWorkflowTab === 'connection'" class="connector-workspace-grid">
                  <div class="managed-connector-panel connector-builder-panel">
                    <div class="panel-kicker">Connection Setup</div>
                    <h3>Create or edit a source connection</h3>
                    <p class="card-help">Save the connection first. Profiling and schedules both use this saved connector.</p>
                    <div class="form-row">
                      <div class="col-4"><v-label>ID</v-label><v-text-field v-model="integrations.connectorEditor.id" density="compact" variant="outlined" hide-details></v-text-field></div>
                      <div class="col-4"><v-label>Type</v-label><v-select v-model="integrations.connectorEditor.type" density="compact" variant="outlined" hide-details :items="integrations.connectorDefinitions.map((item) => ({ title: connectorDefinitionLabel(item.type), value: item.type }))" @update:model-value="syncConnectorCredentialMode"></v-select></div>
                      <div class="col-4"><v-label>Label</v-label><v-text-field v-model="integrations.connectorEditor.label" density="compact" variant="outlined" hide-details></v-text-field></div>
                    </div>
                    <div class="form-row mt-8">
                      <div class="col-6">
                        <v-label>Credential Mode</v-label>
                        <v-select
                          v-model="integrations.connectorEditor.credentialMode"
                          density="compact"
                          variant="outlined"
                          hide-details
                          :items="connectorCredentialModeOptions()"
                          item-title="title"
                          item-value="value"
                          @update:model-value="syncConnectorCredentialMode"
                        ></v-select>
                        <div class="field-hint">{{ connectorCredentialModeHint() }}</div>
                      </div>
                      <div class="col-6">
                        <v-label>Secret Reference</v-label>
                        <v-text-field
                          v-model="integrations.connectorEditor.secretRef"
                          density="compact"
                          variant="outlined"
                          hide-details
                          placeholder="kv://metadata/source-name"
                          :disabled="!connectorSecretReferenceRequired()"
                        ></v-text-field>
                      </div>
                    </div>
                    <div class="form-row mt-8" v-if="connectorSecretReferenceRequired()">
                      <div class="col-12"><v-label>One-time Secret Value</v-label><v-text-field v-model="integrations.connectorEditor.rawSecret" density="compact" variant="outlined" hide-details type="password" placeholder="Write-only; not displayed after save"></v-text-field></div>
                    </div>
                    <div class="form-row mt-8">
                      <div class="col-12"><v-label>Connector Config JSON</v-label><v-textarea v-model="integrations.connectorEditor.configJson" rows="7" density="compact" variant="outlined" hide-details></v-textarea></div>
                    </div>
                    <div class="connector-action-strip mt-8">
                      <v-btn color="primary" :loading="integrations.connectorLoading" @click="saveManagedConnector">Save Connection</v-btn>
                      <v-btn variant="outlined" :disabled="!integrations.connectorEditor.id" :loading="integrations.connectorLoading" @click="runManagedConnector(integrations.connectorEditor.id)">Validate Setup</v-btn>
                      <v-btn variant="tonal" :disabled="!selectedManagedConnector" @click="integrations.connectorWorkflowTab = 'run'">Run Profile Now</v-btn>
                    </div>
                  </div>

                  <div class="managed-connector-panel">
                    <div class="panel-kicker">Saved Connections</div>
                    <div class="managed-connector-list">
                      <div
                        v-for="connector in integrations.managedConnectors"
                        :key="'managed-connector-' + connector.id"
                        class="managed-connector-row"
                        :class="{ selected: integrations.selectedConnectorId === connector.id }"
                      >
                        <div>
                          <strong>{{ connector.label }}</strong>
                          <span>{{ connector.id }} · {{ connector.type }} · {{ connector.credential?.mode || 'credential not set' }}</span>
                        </div>
                        <div class="btn-row">
                          <v-chip size="x-small" variant="tonal" :color="connector.credential?.status === 'stored_reference' || connector.credential?.status === 'configured' ? 'success' : 'warning'">{{ connector.credential?.status || 'unknown' }}</v-chip>
                          <v-btn size="small" variant="outlined" @click="useManagedConnector(connector)">Use</v-btn>
                          <v-btn size="small" variant="outlined" @click="editManagedConnector(connector)">Edit</v-btn>
                          <v-btn size="small" variant="tonal" @click="loadManagedConnectorSnapshot(connector.id)">Snapshot</v-btn>
                        </div>
                      </div>
                      <div v-if="!integrations.managedConnectors.length" class="connector-empty-path">
                        <strong>No connection saved yet.</strong>
                        <span>Fill out Connection Setup, then click Save Connection.</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="integrations.connectorWorkflowTab === 'run'" class="connector-workspace-grid">
                  <div class="managed-connector-panel">
                    <div class="panel-kicker">One-Time Profile</div>
                    <h3>Run an immediate profile</h3>
                    <p class="card-help">Use this for testing a new connection or profiling a table/database now. Dry run validates the profile plan. Live runs aggregate-only profiling queries.</p>
                    <div class="form-row">
                      <div class="col-4"><v-label>Saved Connection</v-label><v-select v-model="integrations.profileRunEditor.connectorId" density="compact" variant="outlined" hide-details :items="profileScheduleConnectorOptions" @update:model-value="integrations.selectedConnectorId = integrations.profileRunEditor.connectorId"></v-select></div>
                      <div class="col-3"><v-label>Profile Type</v-label><v-select v-model="integrations.profileRunEditor.profileType" density="compact" variant="outlined" hide-details :items="profileScheduleTypeOptions"></v-select></div>
                      <div class="col-3"><v-label>Run Mode</v-label><v-select v-model="integrations.profileRunEditor.executionMode" density="compact" variant="outlined" hide-details :items="[{ title: 'Dry run / plan only', value: 'dry_run' }, { title: 'Live aggregate profile', value: 'live' }]"></v-select></div>
                      <div class="col-2" style="display:flex;align-items:end;"><v-btn block color="primary" :loading="integrations.connectorLoading" :disabled="!integrations.profileRunEditor.connectorId" @click="runOneTimeProfile">Run Now</v-btn></div>
                    </div>
                    <div class="form-row mt-8">
                      <div class="col-8"><v-label>Tables / Object IDs</v-label><v-textarea v-model="integrations.profileRunEditor.assetIds" rows="4" density="compact" variant="outlined" hide-details placeholder="Optional for metadata/BI. For aggregate database profiling, enter one table object id per line, such as GPA.dbo.SomeTable."></v-textarea></div>
                      <div class="col-4"><v-label>Streams</v-label><v-text-field v-model="integrations.profileRunEditor.streams" density="compact" variant="outlined" hide-details placeholder="reports, dashboards, lineage"></v-text-field><div class="field-hint">Use streams for BI, catalog, pipeline, or metadata profiles. Leave blank for aggregate SQL profiling.</div></div>
                    </div>
                    <div class="form-row mt-8" v-if="integrations.profileRunEditor.profileType === 'aggregate'">
                      <div class="col-3"><v-label>Coverage Mode</v-label><v-select v-model="integrations.profileRunEditor.coverageMode" density="compact" variant="outlined" hide-details :items="profileCoverageModeOptions()"></v-select></div>
                      <div class="col-3"><v-label>Live Queue Order</v-label><v-select v-model="integrations.profileRunEditor.livePriority" density="compact" variant="outlined" hide-details :items="profileLivePriorityOptions()"></v-select></div>
                      <div class="col-2"><v-label>Live Batch Size</v-label><v-text-field v-model.number="integrations.profileRunEditor.maxLiveTables" type="number" min="1" max="25" density="compact" variant="outlined" hide-details></v-text-field></div>
                      <div class="col-2 scheduler-switch-cell"><v-switch v-model="integrations.profileRunEditor.includeViews" color="primary" density="compact" hide-details label="Include views"></v-switch></div>
                      <div class="col-2">
                        <div class="field-hint" style="padding-top: 28px;">Use 1 for a careful daytime queue, then raise off-hours.</div>
                      </div>
                    </div>
                    <div class="connector-action-strip mt-8">
                      <v-btn variant="tonal" :disabled="!integrations.profileRunEditor.connectorId" @click="prepareScheduleForSelectedConnector">Schedule this profile</v-btn>
                      <v-btn variant="outlined" :disabled="!integrations.profileRunEditor.connectorId" @click="loadManagedConnectorRuns(integrations.profileRunEditor.connectorId)">Refresh History</v-btn>
                    </div>
                  </div>
                  <div class="managed-connector-panel">
                    <div class="panel-kicker">What will happen</div>
                    <div class="connector-next-summary">
                      <div><span>Connection</span><strong>{{ selectedManagedConnector?.label || 'Choose a saved connection' }}</strong></div>
                      <div><span>Profile</span><strong>{{ integrations.profileRunEditor.profileType }}</strong></div>
                      <div><span>Mode</span><strong>{{ integrations.profileRunEditor.executionMode === 'live' ? 'Live aggregate query' : 'Dry run / plan' }}</strong></div>
                      <div v-if="integrations.profileRunEditor.profileType === 'aggregate'"><span>Queue Order</span><strong>{{ profileLivePriorityLabel(integrations.profileRunEditor.livePriority) }}</strong></div>
                      <div v-if="integrations.profileRunEditor.profileType === 'aggregate'"><span>Live Batch</span><strong>{{ integrations.profileRunEditor.maxLiveTables }}</strong></div>
                      <div><span>Raw data retained</span><strong>No</strong></div>
                    </div>
                    <div class="connector-guardrail">
                      <v-icon size="small">mdi-shield-lock-outline</v-icon>
                      <span>Profiles store counts, nulls, min/max, distinct counts, and classification signals. Raw values are not stored.</span>
                    </div>
                  </div>
                </div>

                <div v-if="integrations.connectorWorkflowTab === 'schedule'" class="connector-workspace-grid">
                  <div class="managed-connector-panel">
                    <div class="panel-kicker">Scheduled Profile Refresh</div>
                    <h3>Create a recurring profile</h3>
                    <p class="card-help">Use schedules to keep profile metadata fresh. The scheduler runs against the saved connector and keeps secrets hidden.</p>
                    <div class="form-row">
                      <div class="col-4"><v-label>Connection</v-label><v-select v-model="integrations.profileScheduleEditor.connectorId" density="compact" variant="outlined" hide-details :items="profileScheduleConnectorOptions"></v-select></div>
                      <div class="col-4"><v-label>Name</v-label><v-text-field v-model="integrations.profileScheduleEditor.name" density="compact" variant="outlined" hide-details placeholder="Nightly GPA profile"></v-text-field></div>
                      <div class="col-2"><v-label>Profile</v-label><v-select v-model="integrations.profileScheduleEditor.profileType" density="compact" variant="outlined" hide-details :items="profileScheduleTypeOptions"></v-select></div>
                      <div class="col-2"><v-label>Status</v-label><v-select v-model="integrations.profileScheduleEditor.status" density="compact" variant="outlined" hide-details :items="['ACTIVE','PAUSED']"></v-select></div>
                    </div>
                    <div class="profile-date-time-grid mt-8">
                      <div><v-label>Start Date</v-label><v-text-field v-model="integrations.profileScheduleEditor.date" type="date" density="compact" variant="outlined" hide-details prepend-inner-icon="mdi-calendar"></v-text-field></div>
                      <div><v-label>Start Time</v-label><v-text-field v-model="integrations.profileScheduleEditor.time" type="time" density="compact" variant="outlined" hide-details prepend-inner-icon="mdi-clock-outline"></v-text-field></div>
                      <div><v-label>Cadence</v-label><v-select v-model="integrations.profileScheduleEditor.cadence" density="compact" variant="outlined" hide-details :items="profileScheduleCadenceOptions" @update:model-value="syncProfileScheduleInterval"></v-select></div>
                      <div><v-label>Minutes</v-label><v-text-field v-model.number="integrations.profileScheduleEditor.intervalMinutes" type="number" min="5" density="compact" variant="outlined" hide-details :disabled="integrations.profileScheduleEditor.cadence !== 'custom'"></v-text-field></div>
                    </div>
                    <div class="form-row mt-8">
                      <div class="col-4"><v-label>Streams</v-label><v-text-field v-model="integrations.profileScheduleEditor.streams" density="compact" variant="outlined" hide-details placeholder="reports, dashboards, lineage"></v-text-field></div>
                      <div class="col-4"><v-label>Timezone Label</v-label><v-text-field v-model="integrations.profileScheduleEditor.timezone" density="compact" variant="outlined" hide-details></v-text-field></div>
                      <div class="col-2"><v-label>Max Failures</v-label><v-text-field v-model.number="integrations.profileScheduleEditor.maxFailures" type="number" min="1" density="compact" variant="outlined" hide-details></v-text-field></div>
                      <div class="col-2 scheduler-switch-cell"><v-switch v-model="integrations.profileScheduleEditor.dryRun" color="primary" density="compact" hide-details label="Dry run"></v-switch></div>
                    </div>
                    <div class="form-row mt-8" v-if="integrations.profileScheduleEditor.profileType === 'aggregate' || integrations.profileScheduleEditor.profileType === 'auto'">
                      <div class="col-3"><v-label>Coverage Mode</v-label><v-select v-model="integrations.profileScheduleEditor.coverageMode" density="compact" variant="outlined" hide-details :items="profileCoverageModeOptions()"></v-select></div>
                      <div class="col-3"><v-label>Live Queue Order</v-label><v-select v-model="integrations.profileScheduleEditor.livePriority" density="compact" variant="outlined" hide-details :items="profileLivePriorityOptions()"></v-select></div>
                      <div class="col-2"><v-label>Live Batch Size</v-label><v-text-field v-model.number="integrations.profileScheduleEditor.maxLiveTables" type="number" min="1" max="25" density="compact" variant="outlined" hide-details></v-text-field></div>
                      <div class="col-2 scheduler-switch-cell"><v-switch v-model="integrations.profileScheduleEditor.includeViews" color="primary" density="compact" hide-details label="Include views"></v-switch></div>
                      <div class="col-2">
                        <div class="field-hint" style="padding-top: 28px;">Hourly with 1 is the gentlest default.</div>
                      </div>
                    </div>
                    <div class="form-row mt-8">
                      <div class="col-12"><v-label>Tables / Object IDs</v-label><v-textarea v-model="integrations.profileScheduleEditor.assetIds" rows="3" density="compact" variant="outlined" hide-details placeholder="Optional schedule scope. Enter one table object id per line for aggregate profiling."></v-textarea></div>
                    </div>
                    <div class="connector-action-strip mt-8">
                      <v-btn color="primary" :loading="integrations.profileScheduleLoading" @click="saveProfileSchedule">{{ integrations.profileScheduleEditor.id ? 'Update Schedule' : 'Create Schedule' }}</v-btn>
                      <v-btn variant="tonal" @click="resetProfileScheduleEditor">Clear</v-btn>
                      <v-btn variant="outlined" @click="onViewChange('scheduler')">Open Full Scheduler</v-btn>
                    </div>
                  </div>
                  <div class="managed-connector-panel">
                    <div class="panel-kicker">Existing Schedules</div>
                    <div class="profile-schedule-list">
                      <div v-for="schedule in integrations.profileSchedules.slice(0, 6)" :key="'connector-sched-' + schedule.id" class="profile-schedule-row">
                        <div class="profile-schedule-main">
                          <div class="profile-schedule-title"><strong>{{ schedule.name }}</strong><v-chip size="x-small" variant="tonal" :color="scheduleStatusColor(schedule.status)">{{ schedule.status }}</v-chip></div>
                          <span>{{ schedule.connector_id }} · next {{ formatTimestamp(schedule.next_run_at) }}</span>
                        </div>
                        <div class="btn-row"><v-btn size="small" variant="outlined" @click="editProfileSchedule(schedule)">Edit</v-btn><v-btn size="small" variant="tonal" @click="runProfileSchedule(schedule.id)">Run</v-btn></div>
                      </div>
                      <div v-if="!integrations.profileSchedules.length" class="connector-empty-path"><strong>No schedules yet.</strong><span>Create one here or run a one-time profile first.</span></div>
                    </div>
                  </div>
                </div>

                <div v-if="integrations.connectorWorkflowTab === 'access'" class="managed-connector-panel">
                  <div class="panel-kicker">Grant Access</div>
                  <p class="card-help">After a connector is saved, grant users, groups, or roles permission to view/run it without seeing secrets.</p>
                  <div class="form-row">
                    <div class="col-3"><v-label>Connector</v-label><v-select v-model="integrations.connectorGrant.connectorId" density="compact" variant="outlined" hide-details :items="integrations.managedConnectors.map((item) => item.id)"></v-select></div>
                    <div class="col-2"><v-label>Scope</v-label><v-select v-model="integrations.connectorGrant.scope" density="compact" variant="outlined" hide-details :items="['users','roles','groups']"></v-select></div>
                    <div class="col-3"><v-label>Subject</v-label><v-text-field v-model="integrations.connectorGrant.subject" density="compact" variant="outlined" hide-details></v-text-field></div>
                    <div class="col-3"><v-label>Actions</v-label><v-text-field v-model="integrations.connectorGrant.actions" density="compact" variant="outlined" hide-details></v-text-field></div>
                    <div class="col-1" style="display:flex;align-items:end;"><v-btn size="small" color="primary" @click="grantManagedConnectorPermission">Grant</v-btn></div>
                  </div>
                </div>

                <div class="managed-connector-results" v-if="integrations.connectorWorkflowTab === 'history'">
                  <div class="section-header">
                    <div>
                      <span class="section-title">Run History & Results</span>
                      <p class="card-help mb-0">Open a run to see whether it harvested metadata, captured aggregate profile results, and where its markdown artifact was written for DevOps upload.</p>
                    </div>
                    <div class="btn-row">
                      <v-btn size="small" variant="tonal" color="primary" :loading="integrations.connectorPublishLoading" :disabled="integrations.connectorPublishLoading" @click="publishConnectorProfiles()">Publish Pending Profiles</v-btn>
                      <v-btn size="small" variant="outlined" :loading="integrations.connectorLoading" @click="loadManagedConnectorRuns(integrations.selectedConnectorId)">Refresh</v-btn>
                    </div>
                  </div>
                  <div class="mini-stack" v-if="integrations.connectorSnapshot">
                    <div class="mini-metric"><span>Snapshot Connector</span><strong>{{ integrations.connectorSnapshot.connector_id }}</strong></div>
                    <div class="mini-metric"><span>Objects</span><strong>{{ integrations.connectorSnapshot.object_count }}</strong></div>
                    <div class="mini-metric"><span>Columns</span><strong>{{ integrations.connectorSnapshot.column_count }}</strong></div>
                    <div class="mini-metric"><span>Lineage Edges</span><strong>{{ integrations.connectorSnapshot.lineage_edge_count }}</strong></div>
                    <div class="mini-metric"><span>Python Scripts</span><strong>{{ (integrations.connectorSnapshot.python_scripts || []).length }}</strong></div>
                  </div>
                  <div class="table-wrap mt-8" v-if="integrations.connectorRuns.length">
                    <v-table density="compact">
                      <thead><tr><th>Run</th><th>Kind</th><th>Mode</th><th>Status</th><th>Assets / Objects</th><th>Markdown</th><th>Publish</th><th></th></tr></thead>
                      <tbody>
                        <tr v-for="run in integrations.connectorRuns" :key="'connector-run-' + run.id" class="connector-run-row" :class="{ selected: integrations.selectedConnectorRun?.id === run.id }" @click="selectConnectorRun(run)">
                          <td class="mono">{{ run.id }}</td>
                          <td>{{ connectorRunKind(run) }}</td>
                          <td>{{ run.mode }}</td>
                          <td><v-chip size="x-small" variant="tonal" :color="run.status === 'failed' ? 'error' : (run.status === 'partial_failure' ? 'warning' : 'success')">{{ run.status }}</v-chip></td>
                          <td>{{ connectorRunFoundCount(run) }}</td>
                          <td>
                            <v-chip size="x-small" variant="tonal" :color="run.artifact?.markdown_path ? 'success' : 'warning'">
                              {{ run.artifact?.markdown_path ? 'exported' : 'not exported' }}
                            </v-chip>
                          </td>
                          <td>
                            <v-chip size="x-small" variant="tonal" :color="connectorRunPublishColor(run)">
                              {{ connectorRunPublishStatus(run) }}
                            </v-chip>
                          </td>
                          <td>
                            <div class="btn-row connector-run-actions">
                              <v-btn v-if="connectorRunCanPublish(run)" size="small" variant="tonal" color="primary" :loading="integrations.connectorPublishLoading && integrations.selectedConnectorRun?.id === run.id" :disabled="integrations.connectorPublishLoading || integrations.connectorLoading" @click.stop="publishConnectorProfiles(run)">Publish</v-btn>
                              <v-btn v-if="canRerunFailedAssets(run)" size="small" variant="tonal" color="warning" :loading="integrations.connectorLoading && integrations.selectedConnectorRun?.id === run.id" :disabled="integrations.connectorLoading" @click.stop="rerunFailedProfileAssets(run)">Rerun Failed</v-btn>
                              <v-btn size="small" variant="outlined" @click.stop="selectConnectorRun(run)">Details</v-btn>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </v-table>
                  </div>
                  <div class="empty-state compact-empty" v-else>
                    <strong>No connector run history yet</strong>
                    <span>Save a connector, then run a metadata harvest or one-time profile to create drilldown results.</span>
                  </div>
                  <div class="connector-run-detail" v-if="integrations.selectedConnectorRun">
                    <div class="section-header">
                      <span class="section-title">Run Details</span>
                      <div class="btn-row">
                        <v-chip size="small" variant="tonal" color="primary">{{ connectorRunKind(integrations.selectedConnectorRun) }}</v-chip>
                        <v-chip size="small" variant="tonal" :color="connectorRunPublishColor(integrations.selectedConnectorRun)">{{ connectorRunPublishStatus(integrations.selectedConnectorRun) }}</v-chip>
                        <v-btn v-if="connectorRunCanPublish(integrations.selectedConnectorRun)" size="small" variant="tonal" color="primary" :loading="integrations.connectorPublishLoading" :disabled="integrations.connectorPublishLoading || integrations.connectorLoading" @click="publishConnectorProfiles(integrations.selectedConnectorRun)">Publish Successful Profiles</v-btn>
                        <v-btn v-if="canRerunFailedAssets(integrations.selectedConnectorRun)" size="small" variant="tonal" color="warning" :loading="integrations.connectorLoading" :disabled="integrations.connectorLoading" @click="rerunFailedProfileAssets(integrations.selectedConnectorRun)">Rerun {{ connectorRunFailedAssetIds(integrations.selectedConnectorRun).length }} Failed</v-btn>
                      </div>
                    </div>
                    <div class="connector-next-summary">
                      <div><span>Run</span><strong>{{ integrations.selectedConnectorRun.id }}</strong></div>
                      <div><span>Status</span><strong>{{ integrations.selectedConnectorRun.status }}</strong></div>
                      <div><span>Completed</span><strong>{{ formatTimestamp(integrations.selectedConnectorRun.completed_at) }}</strong></div>
                      <div><span>DevOps upload</span><strong>{{ integrations.selectedConnectorRun.artifact?.devops_upload_pending ? 'Pending' : 'Not flagged' }}</strong></div>
                      <div><span>Profile publish</span><strong>{{ connectorRunPublishStatus(integrations.selectedConnectorRun) }}</strong></div>
                      <div><span>Assets / objects</span><strong>{{ connectorRunFoundCount(integrations.selectedConnectorRun) }}</strong></div>
                      <div><span>Columns found</span><strong>{{ integrations.selectedConnectorRun.summary?.discovered_columns ?? '-' }}</strong></div>
                      <div v-if="connectorRunQueueStatus(integrations.selectedConnectorRun)"><span>Live completed</span><strong>{{ connectorRunQueueStatus(integrations.selectedConnectorRun).completed_live_assets }}</strong></div>
                      <div v-if="connectorRunQueueStatus(integrations.selectedConnectorRun)"><span>Live failed</span><strong>{{ connectorRunQueueStatus(integrations.selectedConnectorRun).failed_live_assets }}</strong></div>
                      <div v-if="connectorRunQueueStatus(integrations.selectedConnectorRun)"><span>Metadata-only</span><strong>{{ connectorRunQueueStatus(integrations.selectedConnectorRun).metadata_only_assets }}</strong></div>
                      <div v-if="connectorRunQueueStatus(integrations.selectedConnectorRun)"><span>Queue remaining</span><strong>{{ connectorRunQueueStatus(integrations.selectedConnectorRun).pending_live_queue }}</strong></div>
                    </div>
                    <div class="connector-guardrail" v-if="connectorRunQueueStatus(integrations.selectedConnectorRun)">
                      <strong>Queue progress</strong>
                      <span>
                        {{ connectorRunQueueStatus(integrations.selectedConnectorRun).completed_live_assets }} live completed,
                        {{ connectorRunQueueStatus(integrations.selectedConnectorRun).failed_live_assets }} failed live,
                        {{ connectorRunQueueStatus(integrations.selectedConnectorRun).metadata_only_assets }} metadata-only,
                        {{ connectorRunQueueStatus(integrations.selectedConnectorRun).pending_live_queue }} still queued.
                      </span>
                    </div>
                    <div class="connector-guardrail" v-if="connectorRunKind(integrations.selectedConnectorRun) === 'Metadata harvest'">
                      This run discovered objects, columns, and lineage metadata. It did not execute aggregate data profiling, so row counts, null counts, and distinct counts will appear only after running a one-time or scheduled aggregate profile.
                    </div>
                    <div class="connector-guardrail error-guardrail" v-if="(integrations.selectedConnectorRun.errors || []).length">
                      <strong>{{ integrations.selectedConnectorRun.errors[0].message }}</strong>
                      <span v-if="integrations.selectedConnectorRun.errors[0].remediation">{{ integrations.selectedConnectorRun.errors[0].remediation }}</span>
                    </div>
                    <div class="scheduler-artifact-paths mt-8" v-if="integrations.selectedConnectorRun.artifact">
                      <span>Markdown {{ integrations.selectedConnectorRun.artifact.markdown_path || '-' }}</span>
                      <span>JSON {{ integrations.selectedConnectorRun.artifact.json_path || '-' }}</span>
                    </div>
                    <div class="table-wrap mt-8" v-if="connectorRunProfileRows(integrations.selectedConnectorRun).length">
                      <v-table density="compact">
                        <thead><tr><th>Asset</th><th>Rows</th><th>Columns</th><th>Profiled At</th></tr></thead>
                        <tbody>
                          <tr v-for="row in connectorRunProfileRows(integrations.selectedConnectorRun)" :key="'profile-asset-' + row.assetId">
                            <td class="mono">{{ row.assetId }}</td>
                            <td>{{ row.rowCount }}</td>
                            <td>{{ row.columnCount }}</td>
                            <td>{{ row.generatedAt }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                    <div class="table-wrap mt-8" v-if="connectorRunColumnRows(integrations.selectedConnectorRun).length">
                      <v-table density="compact">
                        <thead><tr><th>Asset</th><th>Column</th><th>Rows</th><th>Nulls</th><th>Null %</th><th>Distinct</th><th>Min</th><th>Max</th><th>Mean</th></tr></thead>
                        <tbody>
                          <tr v-for="row in connectorRunColumnRows(integrations.selectedConnectorRun).slice(0, 100)" :key="'profile-col-' + row.assetId + '-' + row.columnName">
                            <td class="mono">{{ row.assetId }}</td>
                            <td>{{ row.columnName }}</td>
                            <td>{{ row.rowCount }}</td>
                            <td>{{ row.nullCount }}</td>
                            <td>{{ row.nullPercent }}</td>
                            <td>{{ row.distinctCount }}</td>
                            <td>{{ row.min }}</td>
                            <td>{{ row.max }}</td>
                            <td>{{ row.mean }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                    <div class="table-wrap mt-8" v-if="connectorRunStreamRows(integrations.selectedConnectorRun).length">
                      <v-table density="compact">
                        <thead><tr><th>Stream</th><th>Status</th><th>Events</th><th>Endpoint</th></tr></thead>
                        <tbody>
                          <tr v-for="row in connectorRunStreamRows(integrations.selectedConnectorRun)" :key="'stream-' + row.stream">
                            <td>{{ row.stream }}</td>
                            <td>{{ row.status }}</td>
                            <td>{{ row.eventCount }}</td>
                            <td>{{ row.endpoint }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                    <div class="code-block mt-8">Summary: {{ JSON.stringify(integrations.selectedConnectorRun.summary || {}, null, 2) }}</div>
                  </div>
                </div>
              </v-card>

            </div>

            <div v-if="activeView === 'scheduler'" class="workflow-page scheduler-page">
              <v-card class="card span-12 profile-scheduler-card" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Profile Scheduler</span>
                  <div class="btn-row">
                    <v-btn size="small" variant="outlined" :loading="integrations.profileScheduleLoading" @click="loadProfileSchedules">Refresh</v-btn>
                    <v-btn size="small" variant="outlined" :loading="integrations.profileScheduleLoading" @click="startProfileSchedulerWorker">Start Worker</v-btn>
                    <v-btn size="small" variant="outlined" :loading="integrations.profileScheduleLoading" @click="stopProfileSchedulerWorker">Stop Worker</v-btn>
                    <v-btn size="small" variant="outlined" :loading="integrations.profileScheduleLoading" @click="tickProfileSchedules">Run Due</v-btn>
                    <v-btn size="small" color="primary" :loading="integrations.profileScheduleLoading" @click="saveProfileSchedule">
                      {{ integrations.profileScheduleEditor.id ? 'Update Schedule' : 'Create Schedule' }}
                    </v-btn>
                  </div>
                </div>
                <p class="card-help">Automate aggregate, BI report, and metadata profiles from approved managed connectors. Schedules use stored connector credentials and keep raw payloads out of saved options.</p>

                <div class="profile-scheduler-stats">
                  <div class="scheduler-stat"><span>Total</span><strong>{{ profileScheduleStats.total }}</strong></div>
                  <div class="scheduler-stat"><span>Active</span><strong>{{ profileScheduleStats.active }}</strong></div>
                  <div class="scheduler-stat"><span>Paused</span><strong>{{ profileScheduleStats.paused }}</strong></div>
                  <div class="scheduler-stat"><span>Due in 24h</span><strong>{{ profileScheduleStats.dueSoon }}</strong></div>
                  <div class="scheduler-stat"><span>Worker</span><strong>{{ integrations.profileSchedulerStatus?.running ? 'Running' : 'Stopped' }}</strong></div>
                </div>

                <div class="scheduler-runtime-bar">
                  <span>Persistence {{ integrations.profileSchedulerStatus?.persistence_enabled ? 'on' : 'off' }}</span>
                  <span>Interval {{ Math.round((integrations.profileSchedulerStatus?.interval_ms || 0) / 1000) || '-' }}s</span>
                  <span>History {{ integrations.profileSchedulerStatus?.history_count ?? 0 }}</span>
                  <span>Last tick {{ formatTimestamp(integrations.profileSchedulerStatus?.last_tick_at) }}</span>
                  <span v-if="integrations.profileSchedulerStatus?.artifact_dir">Artifacts {{ integrations.profileSchedulerStatus.artifact_dir }}</span>
                  <span v-if="integrations.profileSchedulerStatus?.last_error" class="scheduler-runtime-error">Error {{ integrations.profileSchedulerStatus.last_error.message }}</span>
                </div>

                <div class="profile-scheduler-layout">
                  <div class="managed-connector-panel scheduler-editor-panel">
                    <div class="panel-kicker">{{ integrations.profileScheduleEditor.id ? 'Edit Schedule' : 'New Schedule' }}</div>
                    <div class="form-row">
                      <div class="col-4"><v-label>Connector</v-label><v-select v-model="integrations.profileScheduleEditor.connectorId" density="compact" variant="outlined" hide-details :items="profileScheduleConnectorOptions"></v-select></div>
                      <div class="col-4"><v-label>Name</v-label><v-text-field v-model="integrations.profileScheduleEditor.name" density="compact" variant="outlined" hide-details placeholder="Nightly metadata profile"></v-text-field></div>
                      <div class="col-2"><v-label>Profile</v-label><v-select v-model="integrations.profileScheduleEditor.profileType" density="compact" variant="outlined" hide-details :items="profileScheduleTypeOptions"></v-select></div>
                      <div class="col-2"><v-label>Status</v-label><v-select v-model="integrations.profileScheduleEditor.status" density="compact" variant="outlined" hide-details :items="['ACTIVE','PAUSED']"></v-select></div>
                    </div>
                    <div class="profile-date-time-grid mt-8">
                      <div>
                        <v-label>Start Date</v-label>
                        <v-text-field v-model="integrations.profileScheduleEditor.date" type="date" density="compact" variant="outlined" hide-details prepend-inner-icon="mdi-calendar"></v-text-field>
                      </div>
                      <div>
                        <v-label>Start Time</v-label>
                        <v-text-field v-model="integrations.profileScheduleEditor.time" type="time" density="compact" variant="outlined" hide-details prepend-inner-icon="mdi-clock-outline"></v-text-field>
                      </div>
                      <div>
                        <v-label>Cadence</v-label>
                        <v-select v-model="integrations.profileScheduleEditor.cadence" density="compact" variant="outlined" hide-details :items="profileScheduleCadenceOptions" @update:model-value="syncProfileScheduleInterval"></v-select>
                      </div>
                      <div>
                        <v-label>Minutes</v-label>
                        <v-text-field v-model.number="integrations.profileScheduleEditor.intervalMinutes" type="number" min="5" density="compact" variant="outlined" hide-details :disabled="integrations.profileScheduleEditor.cadence !== 'custom'"></v-text-field>
                      </div>
                    </div>
                    <div class="form-row mt-8">
                      <div class="col-4"><v-label>Timezone Label</v-label><v-text-field v-model="integrations.profileScheduleEditor.timezone" density="compact" variant="outlined" hide-details></v-text-field></div>
                      <div class="col-2"><v-label>Max Failures</v-label><v-text-field v-model.number="integrations.profileScheduleEditor.maxFailures" type="number" min="1" density="compact" variant="outlined" hide-details></v-text-field></div>
                      <div class="col-4"><v-label>Streams</v-label><v-text-field v-model="integrations.profileScheduleEditor.streams" density="compact" variant="outlined" hide-details placeholder="reports, dashboards, lineage"></v-text-field></div>
                      <div class="col-2 scheduler-switch-cell">
                        <v-switch v-model="integrations.profileScheduleEditor.dryRun" color="primary" density="compact" hide-details label="Dry run"></v-switch>
                      </div>
                    </div>
                    <div class="form-row mt-8" v-if="integrations.profileScheduleEditor.profileType === 'aggregate' || integrations.profileScheduleEditor.profileType === 'auto'">
                      <div class="col-3"><v-label>Coverage Mode</v-label><v-select v-model="integrations.profileScheduleEditor.coverageMode" density="compact" variant="outlined" hide-details :items="profileCoverageModeOptions()"></v-select></div>
                      <div class="col-3"><v-label>Live Queue Order</v-label><v-select v-model="integrations.profileScheduleEditor.livePriority" density="compact" variant="outlined" hide-details :items="profileLivePriorityOptions()"></v-select></div>
                      <div class="col-2"><v-label>Live Batch Size</v-label><v-text-field v-model.number="integrations.profileScheduleEditor.maxLiveTables" type="number" min="1" max="25" density="compact" variant="outlined" hide-details></v-text-field></div>
                      <div class="col-2 scheduler-switch-cell">
                        <v-switch v-model="integrations.profileScheduleEditor.includeViews" color="primary" density="compact" hide-details label="Include views"></v-switch>
                      </div>
                      <div class="col-2">
                        <div class="field-hint" style="padding-top: 28px;">Most-used-first with batch 1 is the safest live queue.</div>
                      </div>
                    </div>
                    <div class="form-row mt-8">
                      <div class="col-12"><v-label>Tables / Object IDs</v-label><v-textarea v-model="integrations.profileScheduleEditor.assetIds" rows="3" density="compact" variant="outlined" hide-details placeholder="Optional schedule scope. Leave blank for full queue coverage, or pin one object id per line."></v-textarea></div>
                    </div>
                    <div class="scheduler-guardrail mt-8">
                      <v-icon size="small">mdi-shield-lock-outline</v-icon>
                      <span>Saved schedules strip inline metadata payloads, mocks, tokens, secrets, and credential references before persistence.</span>
                    </div>
                    <div class="btn-row mt-8">
                      <v-btn color="primary" :loading="integrations.profileScheduleLoading" @click="saveProfileSchedule">{{ integrations.profileScheduleEditor.id ? 'Update Schedule' : 'Create Schedule' }}</v-btn>
                      <v-btn variant="tonal" @click="resetProfileScheduleEditor">Clear</v-btn>
                    </div>
                  </div>

                  <div class="managed-connector-panel scheduler-list-panel">
                    <div class="panel-kicker">Created Schedules</div>
                    <div class="profile-schedule-list">
                      <div v-for="schedule in integrations.profileSchedules" :key="'profile-schedule-' + schedule.id" class="profile-schedule-row">
                        <div class="profile-schedule-main">
                          <div class="profile-schedule-title">
                            <strong>{{ schedule.name }}</strong>
                            <v-chip size="x-small" variant="tonal" :color="scheduleStatusColor(schedule.status)">{{ schedule.status }}</v-chip>
                            <v-chip size="x-small" variant="tonal">{{ schedule.profile_type }}</v-chip>
                          </div>
                          <div class="profile-schedule-meta">
                            <span>{{ schedule.connector_id }}</span>
                            <span>{{ schedule.cadence }} / {{ schedule.interval_minutes }} min</span>
                            <span>next {{ formatTimestamp(schedule.next_run_at) }}</span>
                          </div>
                          <div class="profile-schedule-health">
                            <span>Runs {{ schedule.run_count || 0 }}</span>
                            <span>Failures {{ schedule.failure_count || 0 }}/{{ schedule.max_failures || 3 }}</span>
                            <span>Last {{ schedule.last_status || 'never' }}</span>
                          </div>
                          <div class="profile-schedule-health">
                            <span>{{ profileCoverageModeLabel(scheduleQueueSummary(schedule).coverageMode) }}</span>
                            <span>{{ profileLivePriorityLabel(scheduleQueueSummary(schedule).livePriority) }}</span>
                            <span>Batch {{ scheduleQueueSummary(schedule).maxLiveTables }}</span>
                          </div>
                          <div v-if="schedule.last_error" class="profile-schedule-error">
                            {{ schedule.last_error.message || schedule.last_error }}
                          </div>
                        </div>
                        <div class="profile-schedule-actions">
                          <v-btn size="small" variant="outlined" @click="editProfileSchedule(schedule)">Edit</v-btn>
                          <v-btn size="small" variant="outlined" @click="loadProfileScheduleRuns(schedule.id)">History</v-btn>
                          <v-btn size="small" color="primary" variant="tonal" :disabled="schedule.status !== 'ACTIVE'" @click="runProfileSchedule(schedule.id)">Run</v-btn>
                          <v-btn v-if="schedule.status === 'ACTIVE'" size="small" variant="tonal" @click="updateProfileScheduleStatus(schedule, 'PAUSED')">Pause</v-btn>
                          <v-btn v-else size="small" variant="tonal" @click="updateProfileScheduleStatus(schedule, 'ACTIVE')">Activate</v-btn>
                          <v-btn size="small" color="error" variant="tonal" @click="deleteProfileSchedule(schedule.id)">Delete</v-btn>
                        </div>
                      </div>
                      <div v-if="!integrations.profileSchedules.length" class="empty-state scheduler-empty">
                        <div class="empty-state-icon"><v-icon>mdi-calendar-clock</v-icon></div>
                        <h4>No profile schedules yet</h4>
                        <p>Create a schedule from an approved connector to automate metadata, BI, or aggregate profile runs.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div v-if="integrations.profileScheduleResult" class="managed-connector-results">
                  <div class="section-header">
                    <span class="section-title">Last Scheduler Result</span>
                  </div>
                  <div class="mini-stack">
                    <div class="mini-metric"><span>Status</span><strong>{{ integrations.profileScheduleResult.run?.status || integrations.profileScheduleResult.status || 'saved' }}</strong></div>
                    <div class="mini-metric"><span>Due Count</span><strong>{{ integrations.profileScheduleResult.due_count ?? '-' }}</strong></div>
                    <div class="mini-metric"><span>Run Count</span><strong>{{ integrations.profileScheduleResult.schedule?.run_count ?? integrations.profileScheduleResult.run_count ?? '-' }}</strong></div>
                    <div class="mini-metric"><span>Next Run</span><strong>{{ formatTimestamp(integrations.profileScheduleResult.schedule?.next_run_at || integrations.profileScheduleResult.next_run_at) }}</strong></div>
                    <div class="mini-metric" v-if="integrations.profileScheduleResult.run?.summary?.coverage_queue_status"><span>Live Done</span><strong>{{ integrations.profileScheduleResult.run.summary.coverage_queue_status.completed_live_assets }}</strong></div>
                    <div class="mini-metric" v-if="integrations.profileScheduleResult.run?.summary?.coverage_queue_status"><span>Live Failed</span><strong>{{ integrations.profileScheduleResult.run.summary.coverage_queue_status.failed_live_assets }}</strong></div>
                    <div class="mini-metric" v-if="integrations.profileScheduleResult.run?.summary?.coverage_queue_status"><span>Queue Left</span><strong>{{ integrations.profileScheduleResult.run.summary.coverage_queue_status.pending_live_queue }}</strong></div>
                  </div>
                  <div v-if="integrations.profileScheduleResult.artifact" class="scheduler-artifact-paths">
                    <span>JSON {{ integrations.profileScheduleResult.artifact.json_path || '-' }}</span>
                    <span>Markdown {{ integrations.profileScheduleResult.artifact.markdown_path || '-' }}</span>
                  </div>
                </div>

                <div v-if="integrations.profileScheduleRuns.length" class="managed-connector-results scheduler-history-panel">
                  <div class="section-header">
                    <span class="section-title">Schedule Run History</span>
                    <v-chip size="x-small" variant="tonal">{{ integrations.profileScheduleRunScheduleId }}</v-chip>
                  </div>
                  <div class="table-wrap compact-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Completed</th>
                          <th>Run</th>
                          <th>Artifact</th>
                          <th>Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="run in integrations.profileScheduleRuns" :key="run.id">
                          <td><v-chip size="x-small" variant="tonal" :color="scheduleStatusColor(run.status === 'succeeded' ? 'ACTIVE' : 'PAUSED')">{{ run.status }}</v-chip></td>
                          <td>{{ formatTimestamp(run.completed_at) }}</td>
                          <td>{{ run.run_id || run.id }}</td>
                          <td>{{ run.artifact?.markdown_path || run.artifact?.json_path || '-' }}</td>
                          <td>{{ run.error?.message || '-' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </v-card>

            </div>

            <div v-if="activeView === 'integrations' && integrations.connectorWorkflowTab === 'integrations'" class="grid">
              <v-card class="card span-6" variant="outlined">
                <h3>Notification Channels</h3>
                <p class="card-help">Choose a channel and event type, then save settings and send a test event.</p>
                <div class="form-row">
                  <div class="col-4"><v-label>Channel</v-label><v-select v-model="integrations.notifyChannel" density="compact" variant="outlined" hide-details :items="['email','slack','teams']"></v-select></div>
                  <div class="col-8"><v-label>Event Type</v-label><v-text-field v-model="integrations.notifyEventType" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <div class="btn-row" style="margin-top:10px;">
                  <v-btn color="primary" @click="saveNotificationChannel">Enable &amp; Save</v-btn>
                  <v-btn variant="tonal" @click="sendNotificationTest">Send Test Event</v-btn>
                </div>
                <div class="mini-stack mt-8" v-if="integrations.settings">
                  <div class="mini-metric" v-for="(val, key) in (integrations.settings.notifications || {})" :key="key">
                    <span>{{ key }}</span>
                    <v-chip size="x-small" variant="tonal" :color="val && val.enabled ? 'success' : 'secondary'">{{ val && val.enabled ? 'Enabled' : 'Disabled' }}</v-chip>
                  </div>
                  <div class="mini-metric" v-if="!Object.keys(integrations.settings.notifications || {}).length">
                    <span>No channels configured</span>
                  </div>
                </div>
                <div v-else class="empty">No settings loaded.</div>
              </v-card>

              <v-card class="card span-6" variant="outlined">
                <h3>Webhook Registry</h3>
                <p class="card-help">Register callback endpoints for governance events. Use Test before enabling in production.</p>
                <div class="form-row">
                  <div class="col-4"><v-label>Name</v-label><v-text-field v-model="integrations.newWebhook.name" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>URL</v-label><v-text-field v-model="integrations.newWebhook.url" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Events (comma)</v-label><v-text-field v-model="integrations.newWebhook.events" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <div class="btn-row" style="margin-top:10px;"><v-btn color="primary" @click="createWebhook">Create Webhook</v-btn></div>
                <div class="table-wrap" style="margin-top:10px;">
                  <v-table density="compact">
                    <thead><tr><th>Name</th><th>URL</th><th>Actions</th></tr></thead>
                    <tbody>
                      <tr v-for="hook in integrations.webhooks" :key="hook.webhookId">
                        <td>{{ hook.name }}</td><td>{{ hook.url }}</td>
                        <td class="btn-row">
                          <v-btn size="small" variant="tonal" @click="testWebhook(hook.webhookId)">Test</v-btn>
                          <v-btn size="small" color="error" variant="tonal" @click="deleteWebhook(hook.webhookId)">Delete</v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>

              <v-card class="card span-8" variant="outlined">
                <h3>External System Links</h3>
                <p class="card-help">Connect catalog objects to tickets, docs, dashboards, or runbooks for faster triage.</p>
                <div class="form-row">
                  <div class="col-3"><v-label>Object ID</v-label><v-text-field v-model="integrations.linkObjectId" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-3"><v-label>Type</v-label><v-text-field v-model="integrations.linkType" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-6"><v-label>URL</v-label><v-text-field v-model="integrations.linkUrl" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <div class="btn-row" style="margin-top:10px;">
                  <v-btn color="primary" @click="addExternalLink">Add Link</v-btn>
                  <v-btn variant="tonal" @click="loadLinks">Refresh Links</v-btn>
                </div>
                <div class="table-wrap" style="margin-top:10px;">
                  <v-table density="compact">
                    <thead><tr><th>Type</th><th>URL</th><th>Action</th></tr></thead>
                    <tbody>
                      <tr v-for="link in integrations.links" :key="link.linkId">
                        <td>{{ link.type }}</td>
                        <td>{{ link.url }}</td>
                        <td><v-btn size="small" color="error" variant="tonal" @click="removeLink(link.linkId)">Remove</v-btn></td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>

              <v-card class="card span-4" variant="outlined">
                <h3>CI/CD Governance Checks</h3>
                <p class="card-help">Run impact, compliance, and documentation checks for the selected object before release.</p>
                <v-btn color="warning" @click="runPipelineChecks">Run CI/CD Checks</v-btn>
              </v-card>
            </div>

            <div v-if="activeView === 'import'" class="import-page">
              <v-row>
              <v-col cols="12">
              <v-card class="card" variant="outlined">
                <h3>Guided Workflow</h3>
                <p class="workflow-subtitle">Move through the governance pipeline in order: discover, extract, validate, load, then analyze blast radius.</p>
                <div class="workflow-steps">
                  <v-btn
                    v-for="step in importWorkflowSteps"
                    :key="'wf-' + step.key"
                    class="workflow-step"
                    size="small"
                    variant="text"
                    :class="{ done: step.done }"
                    @click="jumpToWorkflowStep(step)"
                  >
                    <span class="workflow-step-status">{{ step.done ? '✓' : '○' }}</span>
                    <span>{{ step.label }}</span>
                  </v-btn>
                </div>
                <div class="workflow-progress">
                  <div class="workflow-progress-bar" :style="{ width: workflowProgressPercent + '%' }"></div>
                </div>
                <div class="btn-row" style="margin-top:10px;">
                  <v-btn color="primary" @click="runRecommendedWorkflowAction">Run Next Recommended Step</v-btn>
                  <v-btn variant="tonal" @click="bootstrapData">Refresh Workflow State</v-btn>
                </div>
              </v-card>
              </v-col>
              </v-row>

              <v-row dense>
              <v-col cols="12" xs="6" sm="4" md="3">
              <v-card class="card kpi" v-if="importer.validationResult" variant="outlined">
                <div class="value">{{ importer.validationResult.valid || 0 }}</div>
                <div class="label">Validated Objects</div>
              </v-card>
              <v-card class="card kpi" v-if="importer.validationResult" variant="outlined">
                <div class="value">{{ importer.validationResult.invalid || 0 }}</div>
                <div class="label">Validation Issues</div>
              </v-card>
              </v-col>
              <v-col cols="12" xs="6" sm="4" md="3">
              <v-card class="card kpi" v-if="importer.lastLoadStats" variant="outlined">
                <div class="value">{{ importer.lastLoadStats.totalObjects || 0 }}</div>
                <div class="label">Indexed Objects</div>
              </v-card>
              </v-col>
              <v-col cols="12" xs="6" sm="4" md="3">
              <v-card class="card kpi" v-if="importer.status" variant="outlined">
                <div class="value">{{ importer.status.loadedObjectCount || 0 }}</div>
                <div class="label">Current Index Size</div>
              </v-card>
              </v-col>
              </v-row>

              

              <v-row>
              <v-col cols="12">
              <v-card class="card ingestion-workspace" variant="outlined">
                <div class="ingestion-workspace-header">
                  <div>
                    <h3>Connector Workspace</h3>
                    <p class="card-help">Choose one source at a time, configure it, then send generated markdown through validation and indexing.</p>
                  </div>
                  <div class="connector-picker">
                    <span>Active Connector</span>
                    <v-select
                      v-model="importer.activeConnector"
                      class="ingestion-connector-select"
                      density="compact"
                      variant="outlined"
                      hide-details
                      :items="ingestionConnectorOptions"
                      item-title="label"
                      item-value="key"
                    ></v-select>
                  </div>
                </div>
                <div class="connector-grid">
                  <button
                    v-for="connector in ingestionConnectorOptions"
                    :key="'connector-' + connector.key"
                    type="button"
                    class="connector-card"
                    :class="{ active: importer.activeConnector === connector.key, planned: connector.planned }"
                    @click="importer.activeConnector = connector.key"
                  >
                    <span class="connector-icon"><v-icon :icon="connector.icon" size="20"></v-icon></span>
                    <span class="connector-body">
                      <span class="connector-topline">
                        <strong>{{ connector.label }}</strong>
                        <v-chip size="x-small" variant="tonal" :color="connector.statusColor">{{ connector.status }}</v-chip>
                      </span>
                      <span class="connector-type">{{ connector.type }} · {{ connector.metric }}</span>
                      <span class="connector-description">{{ connector.description }}</span>
                    </span>
                  </button>
                </div>
              </v-card>

              <v-card v-if="importer.activeConnector === 'sql-server'" class="card connector-detail-card" variant="outlined">
                <h3>SQL Server Connector</h3>
                <p class="card-help">Extract table metadata from SQL Server and auto-generate governance markdown with relationship confidence scoring.</p>
                <div class="form-row" style="margin-bottom: 10px;">
                  <div class="col-2"><v-label>Auth Method</v-label><v-select v-model="importer.sqlServer.authentication" density="compact" variant="outlined" hide-details :items="[{ title: 'SQL Server Auth', value: 'sql-server' }, { title: 'Windows Auth', value: 'windows' }, { title: 'Azure AD', value: 'azure-ad' }]" item-title="title" item-value="value"></v-select></div>
                  <div class="col-3"><v-label>Server</v-label><v-text-field v-model="importer.sqlServer.server" placeholder="localhost or server.database.windows.net" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-2"><v-label>Port</v-label><v-text-field v-model.number="importer.sqlServer.port" type="number" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-3">
                    <v-label>Database</v-label>
                    <div style="display:flex; gap:6px; align-items:flex-start;">
                      <v-combobox
                        v-model="importer.sqlServer.database"
                        :items="importer.sqlServer.availableDatabases"
                        :loading="importer.sqlServer.discoveringDatabases"
                        item-title="title"
                        item-value="value"
                        density="compact"
                        variant="outlined"
                        hide-details
                        style="flex:1;"
                        @focus="discoverSqlServerDatabases({ force: false })"
                        placeholder="Type or auto-discover..."
                      ></v-combobox>
                      <v-btn
                        icon="mdi-refresh"
                        size="small"
                        variant="tonal"
                        :loading="importer.sqlServer.discoveringDatabases"
                        :disabled="!hasSqlServerDatabaseDiscoveryInputs()"
                        @click="discoverSqlServerDatabases({ force: true })"
                        title="Refresh database list"
                      ></v-btn>
                    </div>
                    <div :style="{ fontSize: '0.85em', color: sqlServerDatabaseHintColor, marginTop: '2px' }">{{ sqlServerDatabaseHint }}</div>
                  </div>
                </div>
                <div class="form-row" style="margin-bottom: 8px;" v-if="importer.sqlServer.authentication === 'sql-server'">
                  <div class="col-6"><v-label>Username</v-label><v-text-field v-model="importer.sqlServer.username" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-6"><v-label>Password</v-label><v-text-field v-model="importer.sqlServer.password" type="password" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <div class="form-row" style="margin-bottom: 8px;" v-if="importer.sqlServer.authentication === 'windows'">
                  <div class="col-12">
                    <v-checkbox v-model="importer.sqlServer.useIntegratedAuth" density="compact" hide-details label="Use current Windows user (Integrated Auth)" color="primary" :class="{'checkbox-visible': true}"></v-checkbox>
                  </div>
                </div>
                <div class="form-row" style="margin-bottom: 6px;" v-if="importer.sqlServer.authentication === 'windows' && !importer.sqlServer.useIntegratedAuth">
                  <div class="col-4"><v-label>Domain</v-label><v-text-field v-model="importer.sqlServer.domain" placeholder="CONTOSO" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Username</v-label><v-text-field v-model="importer.sqlServer.username" placeholder="svc_data_gov or CONTOSO\\svc_data_gov" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Password</v-label><v-text-field v-model="importer.sqlServer.password" type="password" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <div v-if="importer.sqlServer.authentication === 'windows'" style="margin-bottom: 10px; font-size: 0.85em; color: #666;">
                  Integrated Auth uses your current Windows login. Turn it off only if you need manual NTLM credentials.
                </div>
                <div class="form-row" style="margin-bottom: 10px;" v-if="importer.sqlServer.authentication === 'azure-ad'">
                  <div class="col-6"><v-label>Client ID</v-label><v-text-field v-model="importer.sqlServer.clientId" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-6"><v-label>Client Secret</v-label><v-text-field v-model="importer.sqlServer.clientSecret" type="password" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-12"><v-label>Tenant ID</v-label><v-text-field v-model="importer.sqlServer.tenantId" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <div class="form-row" style="margin-bottom: 15px;">
                  <div class="col-6" style="display:flex; gap:10px; align-items:center;">
                    <div style="display:flex;align-items:center;gap:18px;">
                      <v-checkbox
                        v-model="importer.sqlServer.encrypt"
                        density="compact"
                        label="Encrypt Connection"
                        color="primary"
                        :class="'checkbox-visible always-show-checkbox'"
                        hide-details="auto"
                        style="min-width: 44px;"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="importer.sqlServer.trustServerCertificate"
                        density="compact"
                        label="Trust Server Cert"
                        color="primary"
                        :class="'checkbox-visible always-show-checkbox'"
                        hide-details="auto"
                        style="min-width: 44px;"
                      ></v-checkbox>
                    </div>
                  </div>
                  <div class="col-6" style="display:flex;align-items:end; gap:10px;">
                    <v-btn color="primary" @click="discoverSqlServerScope" :loading="importer.sqlServer.discovering" :disabled="importer.sqlServer.discovering || importer.sqlServer.connecting" style="flex:1;">{{ importer.sqlServer.discovering ? 'Discovering...' : 'Connect & Select Scope' }}</v-btn>
                  </div>
                </div>
                <v-dialog v-model="importer.sqlServer.showScopeSelector" max-width="900" scrollable>
                  <v-card style="max-height: 85vh; overflow: auto;">
                    <v-card-text>
                    <h3 style="margin-top: 0;">Extract Database Scope</h3>
                    <p style="margin-bottom: 10px; font-size: 0.9em; color: #555;">Discovered {{ importer.sqlServer.availableSchemas.length }} schemas with {{ importer.sqlServer.discoveredObjectCount }} total objects. Choose scope to extract.</p>
                    
                    <div style="margin-bottom: 12px;">
                      <v-radio-group v-model="importer.sqlServer.selectionMode" inline hide-details>
                        <v-radio label="Full Schema Mode (extract entire schemas)" value="schema"></v-radio>
                        <v-radio label="Table-Level Mode (pick individual tables)" value="table"></v-radio>
                      </v-radio-group>
                    </div>

                    <div class="btn-row" style="margin-bottom: 10px;">
                      <v-btn size="small" variant="tonal" @click="toggleAllSqlServerSchemas(true)">Select all</v-btn>
                      <v-btn size="small" variant="tonal" @click="toggleAllSqlServerSchemas(false)">Clear all</v-btn>
                      <div style="display:flex; align-items:center; gap:8px; margin-left:auto;">
                        <v-label style="margin:0; font-size: 0.85em; color: #555;">Top</v-label>
                        <v-text-field v-model.number="importer.sqlServer.topSchemaCount" type="number" min="1" density="compact" variant="outlined" hide-details style="width:72px;"></v-text-field>
                        <v-btn size="small" variant="tonal" @click="selectTopSqlServerSchemas">Select Largest</v-btn>
                      </div>
                    </div>

                    <div v-if="importer.sqlServer.selectionMode === 'schema'" style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; max-height: 45vh; overflow-y: auto;">
                      <div v-for="schema in importer.sqlServer.availableSchemas" :key="schema.schemaName" style="display:flex; justify-content:space-between; align-items:center; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                        <v-checkbox-btn :value="schema.schemaName" v-model="importer.sqlServer.selectedSchemas" density="compact" hide-details color="primary" :class="{'checkbox-visible': true}"></v-checkbox-btn>
                        <span style="font-weight: 500; margin-right:auto;">{{ schema.schemaName }}</span>
                        <span style="font-size: 0.8em; color: #999;">
                          {{ schema.totalObjectCount }} objects ({{ schema.tableCount }}T, {{ schema.viewCount }}V, {{ schema.procedureCount }}P)
                        </span>
                      </div>
                      <div v-if="importer.sqlServer.availableSchemas.length === 0" class="empty">No schemas found.</div>
                    </div>

                    <div v-if="importer.sqlServer.selectionMode === 'table'" style="border: 1px solid #e5e7eb; border-radius: 6px; max-height: 45vh; overflow-y: auto;">
                      <div v-for="schema in importer.sqlServer.availableSchemas" :key="'schema-' + schema.schemaName" style="border-bottom: 1px solid #e5e7eb;">
                        <div @click="toggleSqlServerSchemaExpand(schema.schemaName)" style="padding: 10px; background: #f9fafb; cursor: pointer; display: flex; align-items: center; gap: 8px; user-select: none;">
                          <span style="font-size: 1.2em; width: 20px;">{{ importer.sqlServer.expandedSchemas && importer.sqlServer.expandedSchemas[schema.schemaName] ? '▼' : '▶' }}</span>
                          <span style="font-weight: 500;">{{ schema.schemaName }}</span>
                          <span style="font-size: 0.8em; color: #999; margin-left: auto;">{{ schema.tableCount }} tables</span>
                        </div>
                        
                        <div v-if="importer.sqlServer.expandedSchemas && importer.sqlServer.expandedSchemas[schema.schemaName]" style="background: #fff; max-height: 30vh; overflow-y: auto;">
                          <div style="padding: 8px 0 8px 30px; border-bottom: 1px solid #f3f4f6;">
                            <v-checkbox
                              :model-value="isSchemaFullySelected(schema.schemaName)"
                              density="compact"
                              hide-details
                              color="primary"
                              :class="{'checkbox-visible': true}"
                              @update:model-value="toggleSchemaTableSelection(schema.schemaName, { target: { checked: $event } })"
                              :label="'Select all in ' + schema.schemaName"
                            ></v-checkbox>
                          </div>
                          <div v-for="table in (importer.sqlServer.schemaTableLists && importer.sqlServer.schemaTableLists[schema.schemaName]) || []" :key="schema.schemaName + '.' + table.name" style="padding: 6px 30px; border-bottom: 1px solid #f3f4f6;">
                            <div style="display:flex; align-items:center; gap:6px; font-size:0.9em;">
                              <v-checkbox-btn :value="schema.schemaName + '.' + table.name" v-model="importer.sqlServer.selectedTables" density="compact" hide-details color="primary" :class="{'checkbox-visible': true}"></v-checkbox-btn>
                              <span>{{ table.name }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="importer.sqlServer.availableSchemas.length === 0" class="empty" style="padding: 20px;">No schemas found.</div>
                    </div>

                    <div class="btn-row" style="margin-top: 12px; justify-content: flex-end;">
                      <v-btn variant="tonal" @click="cancelSqlServerScopeSelection">Cancel</v-btn>
                      <v-btn color="primary" @click="connectSqlServer" :loading="importer.sqlServer.connecting" :disabled="importer.sqlServer.connecting">{{ importer.sqlServer.connecting ? 'Extracting...' : 'Extract Selected Scope' }}</v-btn>
                    </div>
                    </v-card-text>
                  </v-card>
                </v-dialog>
                <div v-if="importer.sqlServer.result" style="margin-top: 15px; padding: 10px; background: #f0f8ff; border-left: 4px solid #2563eb; border-radius: 4px;">
                  <div style="font-weight:bold; color:#2563eb;">✓ Extraction Complete</div>
                  <div style="margin-top: 8px; font-size: 0.9em; line-height: 1.6;">
                    <div v-if="importer.sqlServer.result.connectorExtraction" style="margin-bottom: 10px; padding: 8px; border: 1px solid #bfdbfe; border-radius: 6px; background: #eff6ff; color: #1e3a8a;">
                      <div style="font-weight: 700;">Connector Framework</div>
                      <div>
                        <strong>Adapter:</strong> {{ importer.sqlServer.result.connectorExtraction.adapter }}
                        · <strong>Status:</strong> {{ importer.sqlServer.result.connectorExtraction.status }}
                        · <strong>Events:</strong> {{ importer.sqlServer.result.connectorExtraction.summary?.event_count || 0 }}
                        · <strong>Streams:</strong> {{ importer.sqlServer.result.connectorExtraction.streamResults?.length || 0 }}
                      </div>
                      <div v-if="importer.sqlServer.result.connectorExtraction.errors?.length" style="margin-top: 4px; color: #991b1b;">
                        <strong>Framework Errors:</strong> {{ importer.sqlServer.result.connectorExtraction.errors.length }}
                      </div>
                    </div>
                    <div><strong>Objects Extracted:</strong> {{ importer.sqlServer.result.totalObjectsExtracted }} total</div>
                    <div style="margin-left: 16px; font-size: 0.85em; color: #444;">
                      <div v-if="importer.sqlServer.result.tablesExtracted > 0">• {{ importer.sqlServer.result.tablesExtracted }} tables</div>
                      <div v-if="importer.sqlServer.result.viewsExtracted > 0">• {{ importer.sqlServer.result.viewsExtracted }} views</div>
                      <div v-if="importer.sqlServer.result.proceduresExtracted > 0">• {{ importer.sqlServer.result.proceduresExtracted }} stored procedures</div>
                      <div v-if="importer.sqlServer.result.functionsExtracted > 0">• {{ importer.sqlServer.result.functionsExtracted }} functions</div>
                      <div v-if="importer.sqlServer.result.triggersExtracted > 0">• {{ importer.sqlServer.result.triggersExtracted }} triggers</div>
                    </div>
                    <div style="margin-top: 8px;"><strong>Relationships:</strong> {{ importer.sqlServer.result.relationshipsDetected }} detected</div>
                    <div><strong>High Confidence:</strong> {{ importer.sqlServer.result.confidentRelationships }} (≥0.75)</div>
                    <div><strong>Selected Schemas:</strong> {{ (importer.sqlServer.result.selectedSchemas || []).join(', ') || 'n/a' }}</div>
                    <div style="margin-top: 8px; font-size: 0.85em; color: #555;">{{ importer.sqlServer.result.markdownFiles }} markdown files ready to import</div>

                    <div v-if="importer.sqlServer.result.researchReport" style="margin-top: 12px; padding: 8px; border: 1px solid #c7d2fe; border-radius: 6px; background: #eef2ff;">
                      <div style="font-weight: 600; color: #3730a3; margin-bottom: 6px;">Coverage Research</div>
                      <div><strong>Coverage:</strong> {{ importer.sqlServer.result.researchReport.coveragePercent }}%</div>
                      <div><strong>Core Objects:</strong> {{ importer.sqlServer.result.researchReport.extractedCoreObjects }} / {{ importer.sqlServer.result.researchReport.expectedCoreObjects }}</div>
                      <div><strong>Column Lineage Enabled:</strong> {{ importer.sqlServer.result.researchReport.columnLineageEnabled ? 'Yes' : 'No (use narrower scope)' }}</div>

                      <div v-if="importer.sqlServer.result.researchReport.missingOrUncaptured && importer.sqlServer.result.researchReport.missingOrUncaptured.length > 0" style="margin-top: 8px;">
                        <div style="font-weight: 600;">Gaps detected:</div>
                        <div v-for="(item, idx) in importer.sqlServer.result.researchReport.missingOrUncaptured" :key="'gap-' + idx">- {{ item }}</div>
                      </div>

                      <div v-if="importer.sqlServer.result.researchReport.recommendations && importer.sqlServer.result.researchReport.recommendations.length > 0" style="margin-top: 8px;">
                        <div style="font-weight: 600;">Recommended next steps:</div>
                        <div v-for="(item, idx) in importer.sqlServer.result.researchReport.recommendations" :key="'rec-' + idx">- {{ item }}</div>
                      </div>
                    </div>

                    <div v-if="importer.sqlServer.result.objectInventory" style="margin-top: 10px; font-size: 0.85em; color: #374151;">
                      <strong>Inventory:</strong>
                      tables {{ importer.sqlServer.result.objectInventory.table || 0 }},
                      views {{ importer.sqlServer.result.objectInventory.view || 0 }},
                      procedures {{ importer.sqlServer.result.objectInventory.storedProcedure || 0 }},
                      functions {{ ((importer.sqlServer.result.objectInventory.scalarFunction || 0) + (importer.sqlServer.result.objectInventory.inlineTableFunction || 0) + (importer.sqlServer.result.objectInventory.tableFunction || 0)) }},
                      triggers {{ importer.sqlServer.result.objectInventory.trigger || 0 }},
                      synonyms {{ importer.sqlServer.result.objectInventory.synonym || 0 }},
                      sequences {{ importer.sqlServer.result.objectInventory.sequence || 0 }},
                      table types {{ importer.sqlServer.result.objectInventory.tableType || 0 }}
                    </div>

                    <div v-if="importer.sqlServer.result.extractionWarnings && importer.sqlServer.result.extractionWarnings.length > 0" style="margin-top: 8px; font-size: 0.85em; color: #92400e; background: #fffbeb; border-left: 3px solid #f59e0b; padding: 8px;">
                      <div><strong>Limited permissions detected:</strong></div>
                      <div v-for="warning in importer.sqlServer.result.extractionWarnings" :key="warning.code">- {{ warning.message }}</div>
                    </div>
                  </div>
                </div>
              </v-card>

              <v-card v-if="importer.activeConnector === 'ssis'" class="card connector-detail-card" variant="outlined">
                <h3>SSIS Connector</h3>
                <p class="card-help">Extract packages, execution history, and lineage from SSISDB.</p>
                
                <div class="form-row" style="margin-bottom: 10px;">
                  <div class="col-2"><v-label>Auth Method</v-label><v-select v-model="importer.ssis.authentication" density="compact" variant="outlined" hide-details :items="[{ title: 'SQL Server Auth', value: 'sql-server' }, { title: 'Windows Auth', value: 'windows' }, { title: 'Azure AD', value: 'azure-ad' }]" item-title="title" item-value="value"></v-select></div>
                  <div class="col-4"><v-label>Server</v-label><v-text-field v-model="importer.ssis.server" placeholder="localhost" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-2"><v-label>Port</v-label><v-text-field v-model.number="importer.ssis.port" type="number" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Database</v-label><v-text-field v-model="importer.ssis.database" placeholder="master" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>

                <div class="form-row" style="margin-bottom: 8px;" v-if="importer.ssis.authentication === 'sql-server'">
                  <div class="col-6"><v-label>Username</v-label><v-text-field v-model="importer.ssis.username" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-6"><v-label>Password</v-label><v-text-field v-model="importer.ssis.password" type="password" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>

                <div class="form-row" style="margin-bottom: 8px;" v-if="importer.ssis.authentication === 'windows'">
                  <div class="col-12">
                    <v-checkbox v-model="importer.ssis.useIntegratedAuth" density="compact" hide-details label="Use current Windows user (Integrated Auth)" color="primary"></v-checkbox>
                  </div>
                </div>
                <div class="form-row" style="margin-bottom: 6px;" v-if="importer.ssis.authentication === 'windows' && !importer.ssis.useIntegratedAuth">
                  <div class="col-4"><v-label>Domain</v-label><v-text-field v-model="importer.ssis.domain" placeholder="CONTOSO" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Username</v-label><v-text-field v-model="importer.ssis.username" placeholder="svc_ssis" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Password</v-label><v-text-field v-model="importer.ssis.password" type="password" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>

                <div class="form-row" style="margin-bottom: 10px;" v-if="importer.ssis.authentication === 'azure-ad'">
                  <div class="col-4"><v-label>Client ID</v-label><v-text-field v-model="importer.ssis.clientId" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Client Secret</v-label><v-text-field v-model="importer.ssis.clientSecret" type="password" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Tenant ID</v-label><v-text-field v-model="importer.ssis.tenantId" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>

                <div class="form-row" style="margin-bottom: 15px;">
                  <div class="col-3"><v-label>History Days</v-label><v-text-field v-model.number="importer.ssis.historyDays" type="number" min="1" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-3"><v-label>Phase Days</v-label><v-text-field v-model.number="importer.ssis.phaseDays" type="number" min="1" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-6" style="display:flex; gap:10px; align-items:center;">
                    <v-checkbox v-model="importer.ssis.extractXml" density="compact" label="Parse XML Lineage" color="primary" hide-details></v-checkbox>
                    <v-checkbox v-model="importer.ssis.encrypt" density="compact" label="Encrypt" color="primary" hide-details></v-checkbox>
                    <v-checkbox v-model="importer.ssis.trustServerCertificate" density="compact" label="Trust Cert" color="primary" hide-details></v-checkbox>
                  </div>
                </div>

                <div class="btn-row" style="margin-bottom: 15px; justify-content: flex-end;">
                  <v-btn variant="tonal" @click="discoverSsisCatalog" :loading="importer.ssis.discovering" :disabled="importer.ssis.discovering || importer.ssis.connecting">Discover Catalog</v-btn>
                  <v-btn color="primary" @click="runSsisExtraction" :loading="importer.ssis.connecting" :disabled="importer.ssis.discovering || importer.ssis.connecting">{{ importer.ssis.connecting ? 'Extracting SSIS...' : 'Run Full Extraction' }}</v-btn>
                </div>

                <div v-if="importer.ssis.inventory && !importer.ssis.result" style="margin-top: 15px; padding: 10px; background: #fdfae5; border-left: 4px solid #d97706; border-radius: 4px;">
                  <div style="font-weight:bold; color:#d97706;">✓ Discovery Complete</div>
                  <div style="margin-top: 8px; font-size: 0.9em; line-height: 1.6;">
                    SSISDB Present: <strong>{{ importer.ssis.inventory.ssisdbPresent ? 'Yes' : 'No' }}</strong><br/>
                    Packages Found: <strong>{{ importer.ssis.inventory.packageCount }}</strong><br/>
                    Executables: <strong>{{ importer.ssis.inventory.executables?.length || 0 }}</strong>
                  </div>
                </div>

                <div v-if="importer.ssis.result" style="margin-top: 15px; padding: 10px; background: #f0f8ff; border-left: 4px solid #2563eb; border-radius: 4px;">
                  <div style="font-weight:bold; color:#2563eb;">✓ SSIS Extraction Complete</div>
                  <div style="margin-top: 8px; font-size: 0.9em; line-height: 1.6;">
                    <div v-if="importer.ssis.result.connectorExtraction" style="margin-bottom: 10px; padding: 8px; border: 1px solid #bfdbfe; border-radius: 6px; background: #eff6ff; color: #1e3a8a;">
                      <div style="font-weight: 700;">Connector Framework</div>
                      <div>
                        <strong>Adapter:</strong> {{ importer.ssis.result.connectorExtraction.adapter }}
                        · <strong>Status:</strong> {{ importer.ssis.result.connectorExtraction.status }}
                        · <strong>Events:</strong> {{ importer.ssis.result.connectorExtraction.summary?.event_count || 0 }}
                        · <strong>Streams:</strong> {{ importer.ssis.result.connectorExtraction.streamResults?.length || 0 }}
                      </div>
                      <div v-if="importer.ssis.result.connectorExtraction.errors?.length" style="margin-top: 4px; color: #991b1b;">
                        <strong>Framework Errors:</strong> {{ importer.ssis.result.connectorExtraction.errors.length }}
                      </div>
                    </div>
                    <div><strong>Packages:</strong> {{ importer.ssis.result.summary?.counts?.packages || 0 }}</div>
                    <div><strong>Lineage Edges:</strong> {{ importer.ssis.result.summary?.counts?.lineageEdges || 0 }}</div>
                    <div><strong>Agent Jobs:</strong> {{ importer.ssis.result.summary?.counts?.agentJobs || 0 }}</div>
                    <div><strong>XML Parsed:</strong> {{ importer.ssis.result.summary?.counts?.xmlPackagesParsed || 0 }}</div>
                    <div style="margin-top: 8px; font-size: 0.85em; color: #555;">{{ importer.ssis.result.markdownFilesWritten || 0 }} markdown files generated to {{ importer.ssis.result.markdownOutputPath }}</div>
                    
                    <div v-if="importer.ssis.result.summary?.warnings?.length > 0" style="margin-top: 8px; font-size: 0.85em; color: #92400e; background: #fffbeb; border-left: 3px solid #f59e0b; padding: 8px;">
                      <div><strong>Warnings ({{ importer.ssis.result.summary.warningCount }}):</strong></div>
                      <div v-for="(warn, idx) in importer.ssis.result.summary.warnings.slice(0, 5)" :key="'sw-'+idx">- {{ warn }}</div>
                      <div v-if="importer.ssis.result.summary.warnings.length > 5">...and {{ importer.ssis.result.summary.warnings.length - 5 }} more.</div>
                    </div>
                  </div>
                </div>
              </v-card>
              
              <v-card v-if="importer.activeConnector === 'markdown'" class="card connector-detail-card span-12" variant="outlined">
                <h3>Markdown Upload & Parse</h3>
                <p class="card-help">Use this for curated or externally generated markdown that should enter the same validate/load pipeline.</p>
                <v-file-input multiple accept=".md,text/markdown" density="compact" variant="outlined" show-size @change="handleFileUpload" hide-details></v-file-input>
                <div class="table-wrap" style="margin-top:10px;">
                  <v-table density="compact">
                    <thead><tr><th>File</th><th>Status</th><th>Object</th><th>Database</th><th>Error</th></tr></thead>
                    <tbody>
                      <tr v-for="item in importer.parsed" :key="item.fileName">
                        <td>{{ item.fileName }}</td>
                        <td>{{ item.status }}</td>
                        <td>{{ item.objectId || '-' }}</td>
                        <td>{{ item.database || '-' }}</td>
                        <td>{{ item.error || '-' }}</td>
                      </tr>
                      <tr v-if="importer.parsed.length === 0"><td colspan="5" class="empty">No uploaded files parsed yet.</td></tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>

              <v-card
                v-if="importer.activeConnector === 'data-factory'"
                class="card connector-detail-card cloud-connector-panel span-12"
                variant="outlined"
              >
                <div class="cloud-connector-header">
                  <v-icon icon="mdi-factory" size="28"></v-icon>
                  <div>
                    <h3>Data Factory Connector</h3>
                    <p class="card-help">Connect to Azure Data Factory and generate markdown from pipelines, datasets, linked services, and triggers.</p>
                  </div>
                </div>
                <div class="form-row" style="margin-top: 14px;">
                  <div class="col-4">
                    <div class="field-label-row"><v-label>Subscription ID</v-label><v-tooltip location="top" max-width="360" text="The Azure subscription that owns the Data Factory. In Azure Portal, open the Data Factory resource, then copy Subscription ID from Overview or Essentials."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Subscription ID help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.dataFactory.subscriptionId" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-4">
                    <div class="field-label-row"><v-label>Resource Group</v-label><v-tooltip location="top" max-width="360" text="The Azure resource group containing the Data Factory. In Azure Portal, open the factory and copy Resource group from Overview or Essentials."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Resource Group help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.dataFactory.resourceGroupName" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-4">
                    <div class="field-label-row"><v-label>Factory Name</v-label><v-tooltip location="top" max-width="360" text="The exact Azure Data Factory resource name. Find it in Azure Portal by searching Data factories, then open the factory and copy the Name value."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Factory Name help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.dataFactory.factoryName" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                </div>
                <div class="form-row" style="margin-top: 10px;">
                  <div class="col-4">
                    <div class="field-label-row"><v-label>Tenant ID</v-label><v-tooltip location="top" max-width="380" text="The Microsoft Entra tenant for the service principal. In Azure Portal, go to Microsoft Entra ID > Overview and copy Tenant ID. You can skip this if using a pasted access token."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Tenant ID help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.dataFactory.tenantId" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-4">
                    <div class="field-label-row"><v-label>Client ID</v-label><v-tooltip location="top" max-width="380" text="The Application client ID for a Microsoft Entra app registration or managed service principal that has Reader access to the Data Factory. Find it under Microsoft Entra ID > App registrations > your app > Application client ID."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Client ID help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.dataFactory.clientId" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-4">
                    <div class="field-label-row"><v-label>Client Secret</v-label><v-tooltip location="top" max-width="380" text="A secret for the Entra app registration. Create one in Microsoft Entra ID > App registrations > your app > Certificates & secrets. Copy the secret Value immediately; Azure will not show it again."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Client Secret help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.dataFactory.clientSecret" type="password" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                </div>
                <div class="form-row" style="margin-top: 10px;">
                  <div class="col-12">
                    <div class="field-label-row"><v-label>Access Token</v-label><v-tooltip location="top" max-width="390" text="Optional Azure Management API bearer token. Use this instead of tenant/client credentials for short-lived testing. Generate with Azure CLI using az account get-access-token --resource https://management.azure.com/ and paste accessToken only."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Access Token help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.dataFactory.accessToken" type="password" density="compact" variant="outlined" placeholder="Optional bearer token instead of service principal fields" hide-details></v-text-field>
                  </div>
                </div>
                <div class="btn-row" style="margin-top: 14px; justify-content: flex-end;">
                  <v-btn variant="tonal" @click="discoverDataFactory" :loading="importer.dataFactory.discovering" :disabled="importer.dataFactory.discovering || importer.dataFactory.connecting">Discover Factory</v-btn>
                  <v-btn color="primary" @click="runDataFactoryExtraction" :loading="importer.dataFactory.connecting" :disabled="importer.dataFactory.discovering || importer.dataFactory.connecting">{{ importer.dataFactory.connecting ? 'Extracting ADF...' : 'Generate Markdown' }}</v-btn>
                </div>
                <div v-if="importer.dataFactory.inventory || importer.dataFactory.result" class="cloud-connector-body">
                  <div class="mini-metric"><span>Pipelines</span><strong>{{ (importer.dataFactory.result || importer.dataFactory.inventory).pipelines?.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Datasets</span><strong>{{ (importer.dataFactory.result || importer.dataFactory.inventory).datasets?.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Linked Services</span><strong>{{ (importer.dataFactory.result || importer.dataFactory.inventory).linkedServices?.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Triggers</span><strong>{{ (importer.dataFactory.result || importer.dataFactory.inventory).triggers?.length || 0 }}</strong></div>
                  <div class="mini-metric" v-if="importer.dataFactory.result?.markdownOutputPath"><span>Markdown Path</span><span class="text-mono text-small">{{ importer.dataFactory.result.markdownOutputPath }}</span></div>
                  <div class="mini-metric" v-if="importer.dataFactory.result"><span>Files Written</span><strong>{{ importer.dataFactory.result.markdownFilesWritten || 0 }}</strong></div>
                </div>
              </v-card>

              <v-card
                v-if="importer.activeConnector === 'airflow'"
                class="card connector-detail-card cloud-connector-panel span-12"
                variant="outlined"
              >
                <div class="cloud-connector-header">
                  <v-icon icon="mdi-source-branch" size="28"></v-icon>
                  <div>
                    <h3>Airflow Connector</h3>
                    <p class="card-help">Connect to the Airflow REST API and generate markdown from DAGs, schedules, connections, and orchestration metadata.</p>
                  </div>
                </div>
                <div class="form-row" style="margin-top: 14px;">
                  <div class="col-6">
                    <div class="field-label-row"><v-label>Base URL</v-label><v-tooltip location="top" max-width="380" text="The URL for your Airflow webserver, not a DAG page. Open Airflow in the browser and copy the root host, for example https://airflow.company.com. The connector appends /api/v1 automatically."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Airflow Base URL help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.airflow.baseUrl" density="compact" variant="outlined" placeholder="https://airflow.example.com" hide-details></v-text-field>
                  </div>
                  <div class="col-3">
                    <div class="field-label-row"><v-label>API Version</v-label><v-tooltip location="top" max-width="360" text="The Airflow stable REST API version. Use v1 for Airflow 2.x in most deployments. Ask your Airflow admin or check the API docs page at /api/v1/ui if exposed."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Airflow API Version help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.airflow.apiVersion" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-3">
                    <div class="field-label-row"><v-label>Limit</v-label><v-tooltip location="top" max-width="340" text="Maximum number of DAGs and connections to request from Airflow. Start with 100 for discovery; increase it if your Airflow environment has more DAGs."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Airflow Limit help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model.number="importer.airflow.limit" type="number" min="1" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                </div>
                <div class="form-row" style="margin-top: 10px;">
                  <div class="col-6">
                    <div class="field-label-row"><v-label>Bearer Token</v-label><v-tooltip location="top" max-width="390" text="Optional token for Airflow deployments using bearer auth. Get this from your Airflow or identity-provider admin. If your Airflow uses basic auth instead, leave token blank and use username/password."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Airflow Bearer Token help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.airflow.token" type="password" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-3">
                    <div class="field-label-row"><v-label>Username</v-label><v-tooltip location="top" max-width="360" text="Optional Airflow username for basic authentication. Use a service account or user that can read DAGs and, if available, connections through the REST API."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Airflow Username help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.airflow.username" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-3">
                    <div class="field-label-row"><v-label>Password</v-label><v-tooltip location="top" max-width="360" text="Optional password for Airflow basic authentication. Pair it with the username. For production, prefer a read-only service account managed by your Airflow admin."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Airflow Password help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.airflow.password" type="password" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                </div>
                <div class="btn-row" style="margin-top: 14px; justify-content: flex-end;">
                  <v-btn variant="tonal" @click="discoverAirflow" :loading="importer.airflow.discovering" :disabled="importer.airflow.discovering || importer.airflow.connecting">Discover DAGs</v-btn>
                  <v-btn color="primary" @click="runAirflowExtraction" :loading="importer.airflow.connecting" :disabled="importer.airflow.discovering || importer.airflow.connecting">{{ importer.airflow.connecting ? 'Extracting Airflow...' : 'Generate Markdown' }}</v-btn>
                </div>
                <div v-if="importer.airflow.inventory || importer.airflow.result" class="cloud-connector-body">
                  <div class="mini-metric"><span>DAGs</span><strong>{{ (importer.airflow.result || importer.airflow.inventory).dags?.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Connections</span><strong>{{ (importer.airflow.result || importer.airflow.inventory).connections?.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>API Version</span><strong>{{ (importer.airflow.result || importer.airflow.inventory).apiVersion }}</strong></div>
                  <div class="mini-metric" v-if="importer.airflow.result"><span>Files Written</span><strong>{{ importer.airflow.result.markdownFilesWritten || 0 }}</strong></div>
                  <div class="mini-metric span-12" v-if="(importer.airflow.result || importer.airflow.inventory).connectionWarning"><span>Warning</span><span>{{ (importer.airflow.result || importer.airflow.inventory).connectionWarning }}</span></div>
                  <div class="mini-metric" v-if="importer.airflow.result?.markdownOutputPath"><span>Markdown Path</span><span class="text-mono text-small">{{ importer.airflow.result.markdownOutputPath }}</span></div>
                </div>
              </v-card>

              <v-card
                v-if="importer.activeConnector === 'databricks'"
                class="card connector-detail-card cloud-connector-panel span-12"
                variant="outlined"
              >
                <div class="cloud-connector-header">
                  <v-icon icon="mdi-cube-outline" size="28"></v-icon>
                  <div>
                    <h3>Databricks Connector</h3>
                    <p class="card-help">Connect to Databricks workspace APIs and generate markdown from jobs, clusters, and Unity Catalog metadata.</p>
                  </div>
                </div>
                <div class="form-row" style="margin-top: 14px;">
                  <div class="col-7">
                    <div class="field-label-row"><v-label>Workspace URL</v-label><v-tooltip location="top" max-width="380" text="The Databricks workspace root URL. Open Databricks in your browser and copy the host, for example https://adb-0000000000000000.0.azuredatabricks.net. Do not include /jobs or /sql paths."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Databricks Workspace URL help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.databricks.workspaceUrl" density="compact" variant="outlined" placeholder="https://adb-0000000000000000.0.azuredatabricks.net" hide-details></v-text-field>
                  </div>
                  <div class="col-3">
                    <div class="field-label-row"><v-label>Token</v-label><v-tooltip location="top" max-width="390" text="A Databricks personal access token or service principal OAuth token with permission to list jobs, clusters, and Unity Catalog metadata. For a PAT, open Databricks > User Settings > Developer > Access tokens."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Databricks Token help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.databricks.token" type="password" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-2">
                    <div class="field-label-row"><v-label>Limit</v-label><v-tooltip location="top" max-width="340" text="Maximum number of Databricks jobs to request. Start with 100 for discovery; increase it if the workspace has more jobs to evaluate."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Databricks Limit help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model.number="importer.databricks.limit" type="number" min="1" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                </div>
                <div class="btn-row" style="margin-top: 14px; justify-content: flex-end;">
                  <v-btn variant="tonal" @click="discoverDatabricks" :loading="importer.databricks.discovering" :disabled="importer.databricks.discovering || importer.databricks.connecting">Discover Workspace</v-btn>
                  <v-btn color="primary" @click="runDatabricksExtraction" :loading="importer.databricks.connecting" :disabled="importer.databricks.discovering || importer.databricks.connecting">{{ importer.databricks.connecting ? 'Extracting Databricks...' : 'Generate Markdown' }}</v-btn>
                </div>
                <div v-if="importer.databricks.inventory || importer.databricks.result" class="cloud-connector-body">
                  <div class="mini-metric"><span>Jobs</span><strong>{{ (importer.databricks.result || importer.databricks.inventory).jobs?.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Clusters</span><strong>{{ (importer.databricks.result || importer.databricks.inventory).clusters?.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Catalogs</span><strong>{{ (importer.databricks.result || importer.databricks.inventory).catalogs?.length || 0 }}</strong></div>
                  <div class="mini-metric" v-if="importer.databricks.result"><span>Files Written</span><strong>{{ importer.databricks.result.markdownFilesWritten || 0 }}</strong></div>
                  <div class="mini-metric span-12" v-if="(importer.databricks.result || importer.databricks.inventory).clusterWarning"><span>Cluster Warning</span><span>{{ (importer.databricks.result || importer.databricks.inventory).clusterWarning }}</span></div>
                  <div class="mini-metric span-12" v-if="(importer.databricks.result || importer.databricks.inventory).catalogWarning"><span>Catalog Warning</span><span>{{ (importer.databricks.result || importer.databricks.inventory).catalogWarning }}</span></div>
                  <div class="mini-metric" v-if="importer.databricks.result?.markdownOutputPath"><span>Markdown Path</span><span class="text-mono text-small">{{ importer.databricks.result.markdownOutputPath }}</span></div>
                </div>
              </v-card>
              </v-col>

              <v-row>
              <v-col cols="12" md="6">
              <v-card class="card" variant="outlined">
                <h3>Validate Markdown</h3>
                <p class="card-help">Check generated or uploaded markdown before loading it into the searchable catalog.</p>
                <v-label>Path to markdown tree</v-label>
                <v-text-field v-model="importer.validatePath" density="compact" variant="outlined" hide-details></v-text-field>
                <div class="btn-row" style="margin-top:10px;"><v-btn color="primary" @click="runValidation">Run Validate</v-btn></div>
              </v-card>
              </v-col>

              <v-col cols="12" md="6">
              <v-card class="card" variant="outlined">
                <h3>Load & Export</h3>
                <p class="card-help">Publish validated markdown into the search index or export generated artifacts.</p>
                <v-label>Path to markdown tree</v-label>
                <v-text-field v-model="importer.loadPath" density="compact" variant="outlined" hide-details></v-text-field>
                <div style="margin-top: 8px; font-size: 0.85em; color: #4b5563;">
                  <strong>Elasticsearch:</strong>
                  <span :style="{ color: isElasticsearchHealthy ? '#065f46' : '#991b1b', fontWeight: '600' }">{{ elasticsearchStatusLabel }}</span>
                  <span v-if="importer.status?.elasticsearchUrl"> ({{ importer.status.elasticsearchUrl }})</span>
                </div>
                <div class="btn-row" style="margin-top:10px;">
                  <v-btn color="primary" @click="runLoad" :disabled="!canLoadToIndex">Load to Index</v-btn>
                  <v-btn variant="tonal" @click="loadImportStatus">Refresh Status</v-btn>
                  <v-btn variant="tonal" @click="downloadGeneratedMarkdownZip">Download ZIP</v-btn>
                </div>
                <div class="mini-stack mt-8" v-if="importer.status">
                  <div class="mini-metric"><span>Status</span><v-chip size="x-small" variant="tonal" :color="importer.status.status === 'ok' ? 'success' : 'amber'">{{ importer.status.status || 'unknown' }}</v-chip></div>
                  <div class="mini-metric"><span>Indexed Objects</span><strong>{{ importer.status.loadedObjectCount || 0 }}</strong></div>
                  <div class="mini-metric"><span>Elasticsearch</span><v-chip size="x-small" variant="tonal" :color="isElasticsearchHealthy ? 'success' : 'error'">{{ elasticsearchStatusLabel }}</v-chip></div>
                  <div class="mini-metric" v-if="importer.status.lastGeneratedPath"><span>Last Generated</span><span class="text-mono text-small">{{ importer.status.lastGeneratedPath }}</span></div>
                </div>
                <div v-else class="empty">No status yet - click Refresh Status.</div>
              </v-card>
              </v-col>
              </v-row>
            </div>

            <div v-if="activeView === 'admin'">
              <v-row>
              <v-col cols="12" md="6">
              <v-card class="card" variant="outlined">
                <h3>User Administration</h3>
                <div class="form-row" style="margin-bottom:10px;">
                  <div class="col-4"><v-label>Email</v-label><v-text-field v-model="admin.newUser.email" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-3"><v-label>Name</v-label><v-text-field v-model="admin.newUser.name" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-3"><v-label>Role</v-label><v-select v-model="admin.newUser.role" density="compact" variant="outlined" hide-details :items="['Admin','PowerUser','Analyst','Viewer']"></v-select></div>
                  <div class="col-2" style="display:flex;align-items:end;"><v-btn color="primary" @click="createUser">Create</v-btn></div>
                </div>
                <div class="table-wrap">
                  <v-table density="compact">
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Active</th><th>Actions</th></tr></thead>
                    <tbody>
                      <tr v-for="user in admin.users" :key="user.userId">
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                          <v-select
                            v-model="user.role"
                            density="compact"
                            variant="outlined"
                            hide-details
                            :items="['Admin','PowerUser','Analyst','Viewer']"
                            @update:model-value="updateUserRole(user)"
                          ></v-select>
                        </td>
                        <td>{{ user.active ? 'yes' : 'no' }}</td>
                        <td class="btn-row">
                          <v-btn size="small" variant="tonal" v-if="user.active" @click="deactivateUser(user.userId)">Deactivate</v-btn>
                          <v-btn size="small" color="success" variant="tonal" v-else @click="reactivateUser(user.userId)">Reactivate</v-btn>
                          <v-btn size="small" color="error" variant="tonal" @click="deleteUser(user.userId)">Delete</v-btn>
                        </td>
                      </tr>
                      <tr v-if="admin.users.length === 0"><td colspan="5" class="empty">No admin users loaded.</td></tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>
              </v-col>

              <v-col cols="12" md="6">
              <v-card class="card" variant="outlined">
                <h3>Dashboard User Snapshot</h3>
                <div class="health-grid" v-if="admin.dashboardUsers">
                  <div class="health-card">
                    <span class="health-icon">&#128100;</span>
                    <div>
                      <div class="health-name">Total Users</div>
                      <div class="health-desc">{{ admin.dashboardUsers.total || admin.dashboardUsers.users?.length || '-' }}</div>
                    </div>
                  </div>
                  <div class="health-card">
                    <span class="health-icon">&#9989;</span>
                    <div>
                      <div class="health-name">Active</div>
                      <div class="health-desc">{{ admin.dashboardUsers.active || '-' }}</div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty">No user snapshot available.</div>
              </v-card>
              </v-col>
              </v-row>

              

              <v-row>
              <v-col cols="12" md="6">
              <v-card class="card" variant="outlined">
                <h3>Platform Health</h3>
                <div class="health-grid" v-if="admin.dashboardHealth">
                  <div class="health-card" v-for="(val, svc) in admin.dashboardHealth" :key="svc">
                    <span v-if="typeof val === 'boolean' || val === 'ok' || val === 'healthy'" class="health-icon">&#9989;</span>
                    <span v-else class="health-icon">&#10060;</span>
                    <div>
                      <div class="health-name">{{ svc }}</div>
                      <div class="health-desc">{{ typeof val === 'object' ? (val.status || 'configured') : val }}</div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty">Health data unavailable.</div>
              </v-card>
              </v-col>

              <v-col cols="12" md="6">
              <v-card class="card" variant="outlined">
                <h3>Platform Settings</h3>
                <div class="mini-stack" v-if="admin.dashboardSettings">
                  <div class="mini-metric" v-for="(val, key) in admin.dashboardSettings" :key="key" style="font-size:11px;">
                    <span>{{ key }}</span>
                    <strong>{{ formatSettingValue(val) }}</strong>
                  </div>
                </div>
                <div v-else class="empty">No settings loaded.</div>
              </v-card>
              </v-col>
              </v-row>

              

              <v-row>
              <v-col cols="12">
              <v-card class="card" variant="outlined">
                <h3>Audit Trail</h3>
                <div class="table-wrap">
                  <v-table density="compact">
                    <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th></tr></thead>
                    <tbody>
                      <tr v-for="event in admin.audit" :key="event.eventId || event.id">
                        <td>{{ formatTimestamp(event.timestamp) }}</td>
                        <td>{{ event.userName || event.userId }}</td>
                        <td>{{ event.action }}</td>
                        <td>{{ formatAuditDetails(event.details) }}</td>
                      </tr>
                      <tr v-if="admin.audit.length === 0"><td colspan="4" class="empty">No audit events available.</td></tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>
              </v-col>
              </v-row>

              

              <v-row>
              <v-col cols="12">
              <v-card class="card" variant="outlined">
                <div class="btn-row" style="margin-bottom:10px;">
                  <v-btn size="small" variant="tonal" @click="clearApiErrors">Clear Error Log</v-btn>
                </div>
                <div class="table-wrap">
                  <v-table density="compact">
                    <thead><tr><th>Time</th><th>Status</th><th>Method</th><th>Endpoint</th><th>Message</th><th>Request ID</th></tr></thead>
                    <tbody>
                      <tr v-for="item in apiErrors" :key="item.id">
                        <td>{{ item.timestamp }}</td>
                        <td>{{ item.status }}</td>
                        <td>{{ item.method }}</td>
                        <td class="mono">{{ item.endpoint }}</td>
                        <td>{{ item.message }}</td>
                        <td class="mono">{{ item.requestId }}</td>
                      </tr>
                      <tr v-if="apiErrors.length === 0"><td colspan="6" class="empty">No API errors captured in this session.</td></tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>
              </v-col>
              </v-row>
            </div>

            <div v-if="activeView === 'docs'">
              <v-row>
              <v-col cols="12" md="3" lg="2">
              <v-card class="card" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Documentation Library</span>
                  <v-btn size="small" variant="outlined" @click="loadDocsLibrary">Refresh</v-btn>
                </div>
                <div class="mini-stack" v-if="docsLibrary.length">
                  <v-btn
                    v-for="doc in docsLibrary"
                    :key="'doc-nav-' + doc.key"
                    class="doc-nav-btn"
                    :variant="selectedDocKey === doc.key ? 'flat' : 'tonal'"
                    :color="selectedDocKey === doc.key ? 'primary' : undefined"
                    style="justify-content:flex-start;"
                    @click="openDocByKey(doc.key)"
                  >
                    <v-icon start class="mr-2">mdi-help-circle</v-icon>
                    <span>{{ doc.title }}</span>
                  </v-btn>
                </div>
                <div v-else-if="docsLoading" class="empty">Loading documentation...</div>
                <div v-else class="empty">No documentation entries available.</div>
              </v-card>
              </v-col>

              <v-col cols="12" md="9" lg="10">
              <v-card class="card" variant="outlined">
                <div class="section-header" style="margin-bottom:12px;">
                  <span class="section-title">{{ selectedDocTitle }}</span>
                </div>
                <div v-if="selectedDoc" class="doc-content" v-html="renderDocHtml(selectedDoc.content)"></div>
                <div v-else class="empty">Select a guide from the left rail.</div>
              </v-card>
              </v-col>
              </v-row>
            </div>
          </v-container>
        </v-main>

        <v-navigation-drawer
          v-model="graphDrawerOpen"
          location="right"
          temporary
          width="360"
          class="graph-drawer"
          style="backdrop-filter: blur(12px); background: rgba(2,6,23,0.92); border-left: 1px solid rgba(255,255,255,0.08);"
        >
          <div style="padding:18px;">
            <div class="section-header" style="margin-bottom:10px;">
              <span class="section-title">Graph Detail</span>
              <v-btn icon="mdi-close" variant="text" size="small" @click="closeGraphDrawer"></v-btn>
            </div>
            <div v-if="graphDrawerNode">
              <div class="mini-stack" style="margin-bottom:12px;">
                <div class="mini-metric"><span>Object</span><strong>{{ graphDrawerNode.label || graphDrawerNode.id }}</strong></div>
                <div class="mini-metric"><span>Type</span><strong>{{ graphDrawerNode.type || 'object' }}</strong></div>
                <div class="mini-metric"><span>Trust</span><strong>{{ graphDrawerNode.trust_level || graphDrawerNode.sensitivity || 'n/a' }}</strong></div>
              </div>
              <div class="asset-meta">
                <v-chip size="x-small" class="schema-badge" variant="tonal">{{ graphDrawerNode.database || graphDrawerNode.schema || 'unknown' }}</v-chip>
                <v-chip size="x-small" class="owner-chip" variant="outlined">{{ graphDrawerNode.owner || 'unassigned' }}</v-chip>
                <v-chip v-if="graphDrawerNode.certified" size="x-small" class="poweruser" variant="flat">Certified</v-chip>
              </div>
              <div class="asset-description" style="margin-top:12px;">{{ graphDrawerNode.description || 'No additional detail available.' }}</div>
              <div
                class="graph-semantic-panel"
                v-if="(graphDrawerNode.glossaryTerms || []).length || (graphDrawerNode.propagatedGlossaryTerms || []).length"
              >
                <div v-if="(graphDrawerNode.glossaryTerms || []).length">
                  <div class="graph-semantic-title">Direct Business Terms</div>
                  <div class="graph-semantic-list">
                    <button
                      v-for="term in graphDrawerNode.glossaryTerms"
                      :key="'graph-direct-term-' + term.slug"
                      class="graph-semantic-chip direct"
                      @click="graphDrawerOpen = false; onViewChange('glossary'); $nextTick(() => openGlossaryTerm(term.slug))"
                    >{{ term.term }}</button>
                  </div>
                </div>
                <div v-if="(graphDrawerNode.propagatedGlossaryTerms || []).length">
                  <div class="graph-semantic-title">Propagated Through Lineage</div>
                  <div class="graph-semantic-list">
                    <span
                      v-for="term in graphDrawerNode.propagatedGlossaryTerms"
                      :key="'graph-prop-term-' + term.slug + '-' + term.inherited_from"
                      class="graph-semantic-chip propagated"
                    >{{ term.term }} from {{ term.inherited_from }}</span>
                  </div>
                </div>
              </div>
              <div class="btn-row" style="margin-top:14px;">
                <v-btn size="small" color="primary" @click="graphDrawerOpen = false; onViewChange('discovery')">Focus Graph</v-btn>
                <v-btn size="small" variant="tonal" @click="graphDrawerOpen = false; loadObjectContext()">Open Catalog</v-btn>
              </div>
            </div>
          </div>
        </v-navigation-drawer>
      </v-layout>


      <v-dialog v-model="promptDialog.show" max-width="500" persistent>
        <v-card>
          <v-card-title>{{ promptDialog.title }}</v-card-title>
          <v-card-text>
            <p v-if="promptDialog.message" style="margin-bottom: 15px;">{{ promptDialog.message }}</p>
            <template v-for="field in promptDialog.fields" :key="field.key">
              <v-textarea v-if="field.type === 'textarea'" v-model="field.value" :label="field.label" variant="outlined" density="compact" rows="3"></v-textarea>
              <v-text-field v-else v-model="field.value" :label="field.label" variant="outlined" density="compact"></v-text-field>
            </template>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn variant="tonal" @click="cancelCustomPrompt">Cancel</v-btn>
            <v-btn color="primary" @click="submitCustomPrompt">Submit</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

    </v-app>
  `,
};

const appInstance = createApp(appConfig).use(vuetify).mount('#app-root');

function createGlobalUiErrorEntry(message, details = null, code = 'UI_RUNTIME_ERROR') {
  return {
    id: appInstance?.makeUiErrorId?.() || `${Date.now()}-ui-error`,
    timestamp: new Date().toISOString(),
    endpoint: 'client-runtime',
    method: 'CLIENT',
    status: 0,
    code,
    message,
    requestId: 'n/a',
    details,
  };
}

function registerGlobalUiErrorHandlers() {
  if (typeof window === 'undefined') {
    return;
  }

  window.addEventListener('error', (event) => {
    const errorMessage = event?.error?.message || event?.message || 'Unhandled UI error';
    const entry = createGlobalUiErrorEntry(errorMessage, {
      file: event?.filename || null,
      line: event?.lineno || null,
      column: event?.colno || null,
      stack: event?.error?.stack || null,
    });
    appInstance?.recordApiError?.(entry);
    appInstance?.showToast?.(`UI error: ${errorMessage}`);
  });

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event?.reason;
    const rejectionMessage = reason?.message || String(reason || 'Unhandled promise rejection');
    const entry = createGlobalUiErrorEntry(
      rejectionMessage,
      {
        reason: rejectionMessage,
        stack: reason?.stack || null,
      },
      'UI_UNHANDLED_REJECTION'
    );
    appInstance?.recordApiError?.(entry);
    appInstance?.showToast?.(`Unhandled rejection: ${rejectionMessage}`);
  });
}

registerGlobalUiErrorHandlers();
