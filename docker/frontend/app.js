/* eslint-env browser */
/* global Vue, Vuetify, Chart */

const { createApp, nextTick } = Vue;
const { createVuetify } = Vuetify;

const vuetify = createVuetify();

const navSections = [
  {
    key: 'workspace',
    label: 'Workspace',
    items: [
      { key: 'overview', label: 'Command Center', icon: '⌂' },
      { key: 'browse', label: 'Catalog Search', icon: '◎' },
      { key: 'discovery', label: 'Lineage Explorer', icon: '⟆' },
    ],
  },
  {
    key: 'govern',
    label: 'Govern',
    items: [
      { key: 'glossary', label: 'Business Glossary', icon: '✦' },
      { key: 'governance', label: 'Trust & Compliance', icon: '✓' },
    ],
  },
  {
    key: 'deliver',
    label: 'Deliver',
    items: [
      { key: 'products', label: 'Data Products', icon: '◫' },
      { key: 'reports', label: 'Governance Insights', icon: '▧' },
    ],
  },
  {
    key: 'operate',
    label: 'Operate',
    items: [
      { key: 'integrations', label: 'Connections', icon: '⇄' },
      { key: 'import', label: 'Metadata Ingestion', icon: '↓' },
      { key: 'admin', label: 'Administration', icon: '⚙' },
    ],
  },
  {
    key: 'support',
    label: 'Support',
    items: [{ key: 'docs', label: 'Help Center', icon: 'ⓘ' }],
  },
];

const navItems = navSections.flatMap((section) => section.items);

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
      toast: '',
      apiErrors: [],
      health: null,
      overview: null,
      quality: null,
      activity: null,
      recommendations: null,
      insights: null,
      browseQuery: 'sales.orders',
      browseResults: [],
      searchFacets: null,
      browseSort: 'relevance',
      selectedFacetFilters: {
        types: [],
        quality: [],
        databases: [],
      },
      objectList: [],
      selectedObjectDetail: null,
      selectedObjectId: 'sales.orders',
      selectedObjectGovernance: null,
      editableObjectMetadata: {
        description: '',
        owner: '',
        steward: '',
        domain_manager: '',
        custodian: '',
        sensitivity: 'public',
        tags: '',
      },
      glossary: {
        terms: [],
        domains: [],
        query: '',
        selected: null,
      },
      governance: {
        summaries: [],
        health: null,
      },
      productsCatalog: {
        products: [],
        selected: null,
      },
      docsLibrary: [],
      selectedDocKey: 'help-center',
      selectedDoc: null,
      docsLoading: false,
      discoveryFormat: 'cytoscape',
      discoveryDepth: 2,
      discoveryGraph: null,
      impactData: null,
      lineageRaw: {
        upstream: null,
        downstream: null,
        impact: null,
      },
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
      importer: {
        files: [],
        parsed: [],
        validatePath: './docs',
        loadPath: './docs',
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
          expandedSchemas: {},
          schemaTableLists: {},
          topSchemaCount: 5,
          discoveredObjectCount: 0,
          result: null,
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
    isAuthenticated() {
      return !!this.token;
    },
    authHeader() {
      return this.token ? { Authorization: `Bearer ${this.token}` } : {};
    },
    isMeilisearchHealthy() {
      return this.importer.status?.meilisearchHealthy === true;
    },
    canLoadToIndex() {
      return this.isMeilisearchHealthy;
    },
    meilisearchStatusLabel() {
      if (this.importer.status?.meilisearchHealthy === true) {
        return 'Connected';
      }
      if (this.importer.status?.meilisearchHealthy === false) {
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
      const discovered = Number(this.importer.sqlServer.discoveredObjectCount || 0) > 0;
      const extracted = Number(this.importer.sqlServer.result?.totalObjectsExtracted || 0) > 0;
      const validated = Number(this.importer.validationResult?.valid || 0) > 0;
      const loaded = Number(this.importer.status?.loadedObjectCount || 0) > 0;
      const analyzed = Number(this.reports.blastRows?.length || 0) > 0;

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
      };
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
        indexedObjects: lastLoad.totalObjects || this.importer.status?.loadedObjectCount || 0,
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
            `Meilisearch: ${this.meilisearchStatusLabel}`,
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
      return this.browseResults.length ? this.browseResults : this.objectList;
    },
    browseFacetOptions() {
      const normalizeType = (value) => {
        const type = String(value || '').toLowerCase();
        if (type === 'storedprocedure' || type === 'procedure') return 'storedProcedure';
        return type || 'unknown';
      };

      const source = this.catalogBaseResults || [];
      const sourceTypes = new Set(source.map((item) => normalizeType(item.type)).filter(Boolean));
      const sourceDatabases = new Set(
        source.map((item) => item.database || item.schema).filter(Boolean)
      );

      const facetTypes = this.searchFacets?.types
        ? Object.keys(this.searchFacets.types)
            .map((value) => normalizeType(value))
            .filter(Boolean)
        : Array.from(sourceTypes);

      const facetDatabases = this.searchFacets?.databases
        ? Object.keys(this.searchFacets.databases).filter(Boolean)
        : Array.from(sourceDatabases);

      return {
        types: [...new Set(facetTypes)].sort(),
        quality: ['verified', 'warning', 'draft'],
        databases: [...new Set(facetDatabases)].sort(),
      };
    },
    filteredCatalogResults() {
      const query = String(this.browseQuery || '')
        .trim()
        .toLowerCase();
      const selectedTypes = this.selectedFacetFilters.types || [];
      const selectedQuality = this.selectedFacetFilters.quality || [];
      const selectedDatabases = this.selectedFacetFilters.databases || [];

      const normalizeType = (value) => {
        const type = String(value || '').toLowerCase();
        if (type === 'storedprocedure' || type === 'procedure') return 'storedProcedure';
        return type || 'unknown';
      };

      const trustLevel = (item) => {
        const sensitivity = String(item?.sensitivity || '').toLowerCase();
        if (sensitivity === 'restricted' || sensitivity === 'confidential') return 'warning';
        if (sensitivity === 'draft') return 'draft';
        return 'verified';
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
          if (owner.includes(query)) score += 18;
          if (description.includes(query)) score += 12;
        }

        const quality = trustLevel(item);
        if (quality === 'verified') score += 10;
        if (quality === 'warning') score -= 4;

        return score;
      };

      const filtered = (this.catalogBaseResults || []).filter((item) => {
        const itemType = normalizeType(item.type);
        const itemQuality = trustLevel(item);
        const itemDatabase = item.database || item.schema || '';

        const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(itemType);
        const qualityMatch = selectedQuality.length === 0 || selectedQuality.includes(itemQuality);
        const databaseMatch =
          selectedDatabases.length === 0 || selectedDatabases.includes(itemDatabase);

        return typeMatch && qualityMatch && databaseMatch;
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
            const qualityWeight = { verified: 3, warning: 2, draft: 1 };
            const secondWeight = qualityWeight[second.trustLevel] || 0;
            const firstWeight = qualityWeight[first.trustLevel] || 0;
            const qualityDelta = secondWeight - firstWeight;
            if (qualityDelta !== 0) return qualityDelta;
          }

          if (this.browseSort === 'impact') {
            const secondImpact = Number(second.downstreamCount || second.score || 0);
            const firstImpact = Number(first.downstreamCount || first.score || 0);
            return secondImpact - firstImpact;
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

      const trustLevel = (item) => {
        const sensitivity = String(item?.sensitivity || '').toLowerCase();
        if (sensitivity === 'restricted' || sensitivity === 'confidential') return 'warning';
        if (sensitivity === 'draft') return 'draft';
        return 'verified';
      };

      const countByGroup = {
        types: {},
        quality: {},
        databases: {},
      };

      const source = this.catalogBaseResults || [];
      source.forEach((item) => {
        const type = normalizeType(item.type);
        const quality = trustLevel(item);
        const database = item.database || item.schema || 'unknown';

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
  },
  methods: {
    showToast(message) {
      this.toast = message;
      setTimeout(() => {
        if (this.toast === message) {
          this.toast = '';
        }
      }, 3000);
    },
    makeUiErrorId() {
      return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
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
    setDemoMode(enabled) {
      this.demoModeEnabled = enabled;
      localStorage.setItem('dg_demo_mode', enabled ? 'on' : 'off');
      if (enabled && !this.hasRealData) {
        this.useDemoFallback('manual toggle');
      } else {
        this.bootstrapData();
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
        const status = await this.api('/api/v1/ingestion/status');
        const loadedCount = status.data?.loadedObjectCount || 0;

        if (loadedCount > 0) {
          this.hasRealData = true;
          if (this.demoModeEnabled) {
            this.setDemoMode(false);
            this.showToast('Real data detected. Demo mode automatically disabled.');
          }
          return;
        }

        const dashboard = await this.api('/api/v1/discovery/dashboard');
        const total = dashboard.data?.overview?.totalObjects || 0;
        if (total > 0) {
          this.hasRealData = true;
          if (this.demoModeEnabled) {
            this.setDemoMode(false);
            this.showToast('Discovery data detected. Demo mode automatically disabled.');
          }
        }
      } catch (_err) {
        this.hasRealData = false;
      }
    },
    async api(path, options = {}) {
      const { includeAuth = true, trackError = true, ...fetchOptions } = options;

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

        localStorage.setItem('dg_token', this.token);
        localStorage.setItem('dg_refresh', this.refreshToken);
        localStorage.setItem('dg_user', JSON.stringify(this.currentUser));

        this.showToast(`Welcome ${this.currentUser?.name || this.currentUser?.email}`);
        await this.bootstrapData();
      } catch (err) {
        this.showToast(`Login failed: ${err.message}`);
      }
    },
    logout() {
      this.stopImportStatusPolling();
      this.token = '';
      this.refreshToken = '';
      this.currentUser = null;
      localStorage.removeItem('dg_token');
      localStorage.removeItem('dg_refresh');
      localStorage.removeItem('dg_user');
      this.showToast('Logged out');
    },
    async bootstrapData() {
      // Auto-enable demo mode if no real data or token issues
      if (!this.token || this.token === '') {
        this.setDemoMode(true);
        return;
      }

      await this.detectRealDataAvailability();
      await Promise.allSettled([
        this.loadProfile(),
        this.loadHealth(),
        this.loadOverview(),
        this.loadBrowse(),
        this.loadGlossary(),
        this.loadGovernanceSummary(),
        this.loadProductsCatalog(),
        this.loadDiscovery(),
        this.loadIntegrations(),
        this.loadMarketplaceRequests(),
        this.loadImportStatus(),
        this.loadAdmin(),
      ]);
      this.startImportStatusPolling();
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
      if (!requestItem?.requestId) {
        return;
      }

      const comment =
        window.prompt(`Comment for ${action.replace('_', ' ')} (optional):`, '') || '';

      try {
        await this.api(
          `/api/v1/marketplace/requests/${encodeURIComponent(requestItem.requestId)}/review`,
          {
            method: 'POST',
            body: JSON.stringify({ action, comment }),
          }
        );
        this.showToast(`Request moved to ${action}.`);
        await this.loadMarketplaceRequests();
      } catch (err) {
        this.showToast(`Review action failed: ${err.message}`);
      }
    },
    async fulfillMarketplaceRequest(requestItem) {
      if (!requestItem?.requestId) {
        return;
      }

      const assignmentReference = window.prompt('Assignment reference (optional):', '') || '';
      const notes = window.prompt('Fulfillment notes (optional):', '') || '';

      try {
        await this.api(
          `/api/v1/marketplace/requests/${encodeURIComponent(requestItem.requestId)}/fulfill`,
          {
            method: 'POST',
            body: JSON.stringify({ assignmentReference, notes }),
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
      const canvas = document.getElementById('quality-chart');
      if (!canvas || !window.Chart || !this.quality) {
        return;
      }

      if (this.chartInstance) {
        this.chartInstance.destroy();
      }

      const checks = this.quality.checks || {};
      this.chartInstance = new Chart(canvas, {
        type: 'radar',
        data: {
          labels: Object.keys(checks),
          datasets: [
            {
              label: 'Quality Coverage',
              data: Object.values(checks).map((value) => (value ? 100 : 0)),
              fill: true,
              backgroundColor: 'rgba(37, 99, 235, 0.2)',
              borderColor: '#2563eb',
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            r: {
              suggestedMin: 0,
              suggestedMax: 100,
            },
          },
        },
      });
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
      const normalized = this.normalizeGraphData(this.discoveryGraph?.data);
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
      if (!canvas || !window.Chart || !this.reports.blastRows?.length) {
        return;
      }

      if (this.blastChartInstance) {
        this.blastChartInstance.destroy();
      }

      const topRows = this.reports.blastRows.slice(0, 12);
      this.blastChartInstance = new Chart(canvas, {
        type: 'bar',
        data: {
          labels: topRows.map((row) => row.id),
          datasets: [
            {
              label: 'Downstream Reach',
              data: topRows.map((row) =>
                row.downstreamDepth === null ? 0 : Math.max(0, 6 - row.downstreamDepth) * 2
              ),
              backgroundColor: 'rgba(239, 68, 68, 0.75)',
              borderColor: '#dc2626',
              borderWidth: 1,
            },
            {
              label: 'Upstream Reach',
              data: topRows.map((row) =>
                row.upstreamDepth === null ? 0 : Math.max(0, 6 - row.upstreamDepth)
              ),
              backgroundColor: 'rgba(37, 99, 235, 0.75)',
              borderColor: '#1d4ed8',
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
            },
          },
          scales: {
            x: {
              ticks: {
                maxRotation: 65,
                minRotation: 45,
              },
            },
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Reach Weight',
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
    async loadBrowse() {
      try {
        const [objects, search, facets] = await Promise.all([
          this.api('/api/v1/objects?limit=100'),
          this.api(`/api/v1/search?q=${encodeURIComponent(this.browseQuery)}&limit=50`),
          this.api('/api/v1/search/facets'),
        ]);

        this.objectList = objects.data || [];
        this.browseResults = search.results || [];
        this.searchFacets = facets.facets || null;
        await this.loadObjectContext();
      } catch (err) {
        if (this.demoModeEnabled && !this.hasRealData) {
          this.useDemoFallback('browse APIs unavailable');
          return;
        }
        this.showToast(`Browse load issue: ${err.message}`);
      }
    },
    async runSearch() {
      try {
        const search = await this.api(
          `/api/v1/search?q=${encodeURIComponent(this.browseQuery)}&limit=50`
        );
        this.browseResults = search.results || [];
      } catch (err) {
        if (this.demoModeEnabled && !this.hasRealData) {
          this.browseResults = demoSnapshot.objects.filter((item) =>
            item.id.includes(this.browseQuery)
          );
          return;
        }
        this.showToast(`Search failed: ${err.message}`);
      }
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
    },
    clearBrowseFacets() {
      this.selectedFacetFilters = {
        types: [],
        quality: [],
        databases: [],
      };
      this.browseSort = 'relevance';
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
        return '—';
      }
      return Object.entries(details)
        .slice(0, 3)
        .map(([key, value]) => `${key}: ${String(value)}`)
        .join(' · ');
    },
    formatTimestamp(value) {
      if (!value) return '—';
      const parsed = new Date(value);
      if (Number.isNaN(parsed.getTime())) return String(value);
      return parsed.toLocaleString();
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
      try {
        const [detail, upstream, downstream, impact, governanceContext] = await Promise.all([
          this.api(`/api/v1/objects/${encodeURIComponent(this.selectedObjectId)}`),
          this.api(
            `/api/v1/lineage/${encodeURIComponent(this.selectedObjectId)}/upstream?depth=${this.discoveryDepth}`
          ),
          this.api(
            `/api/v1/lineage/${encodeURIComponent(this.selectedObjectId)}/downstream?depth=${this.discoveryDepth}`
          ),
          this.api(`/api/v1/lineage/${encodeURIComponent(this.selectedObjectId)}/impact`),
          this.api(`/api/v1/governance/context/${encodeURIComponent(this.selectedObjectId)}`),
        ]);

        this.selectedObjectDetail = detail.data || null;
        this.selectedObjectGovernance = governanceContext.context || null;
        this.editableObjectMetadata = {
          description: detail.data?.description || '',
          owner: detail.data?.owner || '',
          steward: detail.data?.steward || '',
          domain_manager: detail.data?.domain_manager || '',
          custodian: detail.data?.custodian || '',
          sensitivity: detail.data?.sensitivity || 'public',
          tags: (detail.data?.tags || []).join(', '),
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
      }
    },
    async saveSelectedObjectMetadata() {
      if (!this.selectedObjectId) {
        return;
      }

      try {
        const payload = await this.api(
          `/api/v1/objects/${encodeURIComponent(this.selectedObjectId)}`,
          {
            method: 'PUT',
            body: JSON.stringify({
              description: this.editableObjectMetadata.description,
              owner: this.editableObjectMetadata.owner,
              steward: this.editableObjectMetadata.steward,
              domain_manager: this.editableObjectMetadata.domain_manager,
              custodian: this.editableObjectMetadata.custodian,
              sensitivity: this.editableObjectMetadata.sensitivity,
              tags: this.editableObjectMetadata.tags
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean),
            }),
          }
        );

        this.selectedObjectDetail = payload.data || this.selectedObjectDetail;
        this.showToast('Metadata updated in markdown.');
        await this.loadObjectContext();
        await this.loadBrowse();
      } catch (err) {
        this.showToast(`Metadata update failed: ${err.message}`);
      }
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
        if (!this.glossary.selected && this.glossary.terms.length > 0) {
          const [firstTerm] = this.glossary.terms;
          this.glossary.selected = firstTerm;
        }
      } catch (err) {
        this.showToast(`Glossary load failed: ${err.message}`);
      }
    },
    async openGlossaryTerm(slug) {
      try {
        const payload = await this.api(`/api/v1/glossary/${encodeURIComponent(slug)}`);
        this.glossary.selected = payload.term || null;
      } catch (err) {
        this.showToast(`Glossary term load failed: ${err.message}`);
      }
    },
    async loadGovernanceSummary() {
      try {
        const [summaryPayload, healthPayload] = await Promise.all([
          this.api('/api/v1/governance/summary'),
          this.api('/api/v1/governance/health'),
        ]);

        this.governance.summaries = summaryPayload.summaries || [];
        this.governance.health = healthPayload || null;
      } catch (err) {
        this.showToast(`Governance summary load failed: ${err.message}`);
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
    async loadDiscovery() {
      try {
        const [graph, impact, matrix] = await Promise.all([
          this.api(
            `/api/v1/discovery/graph/${encodeURIComponent(this.selectedObjectId)}?format=${this.discoveryFormat}&depth=${this.discoveryDepth}`
          ),
          this.api(`/api/v1/discovery/impact/${encodeURIComponent(this.selectedObjectId)}`),
          this.api(`/api/v1/discovery/matrix/${encodeURIComponent(this.matrixDatabase)}`),
        ]);

        this.discoveryGraph = graph;
        this.impactData = impact.data;
        this.matrixData = matrix.data;
        await this.loadObjectContext();
        this.buildBlastRadiusReport();

        await nextTick();
        this.renderGraph();
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
    renderGraph() {
      if (!this.discoveryGraph) {
        return;
      }

      const normalized = this.normalizeGraphData(this.discoveryGraph.data);
      const impactScoreById = new Map(
        (this.reports.blastRows || []).map((row) => [row.id, row.reachScore])
      );

      if (this.discoveryFormat === 'cytoscape') {
        const cyEl = document.getElementById('cy-graph');
        if (!cyEl || !window.cytoscape) {
          return;
        }

        if (this.graphInstance?.destroy) {
          this.graphInstance.destroy();
        }

        this.graphInstance = window.cytoscape({
          container: cyEl,
          elements: [
            ...normalized.nodes.map((node) => ({
              ...node,
              data: {
                ...node.data,
                impactScore: impactScoreById.get(node.data.id) || 1,
                isCentral: node.data.id === this.selectedObjectId,
              },
            })),
            ...normalized.edges,
          ],
          style: [
            {
              selector: 'node',
              style: {
                label: 'data(label)',
                'background-color': '#1d4ed8',
                color: '#fff',
                'font-size': '10px',
                width: 'mapData(impactScore, 1, 14, 30, 72)',
                height: 'mapData(impactScore, 1, 14, 30, 72)',
                'text-wrap': 'wrap',
                'text-max-width': '110px',
                'text-valign': 'center',
                'text-halign': 'center',
                'border-width': 2,
                'border-color': '#dbeafe',
              },
            },
            {
              selector: 'node[isCentral]',
              style: {
                'background-color': '#16a34a',
                'border-color': '#14532d',
                width: 78,
                height: 78,
                'font-size': '11px',
                'font-weight': 'bold',
              },
            },
            {
              selector: 'node[type = "table"]',
              style: { shape: 'round-rectangle', 'background-color': '#2563eb' },
            },
            {
              selector: 'node[type = "view"]',
              style: { shape: 'diamond', 'background-color': '#7c3aed' },
            },
            {
              selector: 'node[type = "procedure"]',
              style: { shape: 'hexagon', 'background-color': '#ea580c' },
            },
            {
              selector: 'node[type = "function"]',
              style: { shape: 'ellipse', 'background-color': '#0d9488' },
            },
            {
              selector: 'node[type = "trigger"]',
              style: { shape: 'triangle', 'background-color': '#be123c' },
            },
            {
              selector: 'edge',
              style: {
                width: 'mapData(confidence, 0, 1, 1, 5)',
                'line-color': '#94a3b8',
                'target-arrow-shape': 'triangle',
                'target-arrow-color': '#94a3b8',
                'curve-style': 'bezier',
                opacity: 0.8,
              },
            },
          ],
          layout: {
            name: 'cose',
            animate: true,
            fit: true,
            padding: 32,
            idealEdgeLength: 130,
            nodeRepulsion: 120000,
            gravity: 0.25,
          },
        });

        this.graphInstance.on('tap', 'node', (event) => {
          const node = event.target?.data?.();
          if (node?.id) {
            this.selectedObjectId = node.id;
            this.reports.shareObjectId = node.id;
            this.buildBlastRadiusReport();
            this.$nextTick(() => this.renderBlastRadiusChart());
            this.showToast(`Selected ${node.id}`);
          }
        });
      }

      if (this.discoveryFormat === 'mermaid') {
        const mermaidEl = document.getElementById('mermaid-graph');
        if (!mermaidEl || !window.mermaid) {
          return;
        }

        mermaidEl.innerHTML = `<pre class="mono">${this.discoveryGraph.data}</pre>`;
        window.mermaid.run({ nodes: [mermaidEl] }).catch(() => {});
      }
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
      } catch (err) {
        this.showToast(`Integrations load issue: ${err.message}`);
      }
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
          sqlPayload.selectedTables = this.importer.sqlServer.selectedTables.map((id) => ({
            schema: id.split('.')[0],
            name: id.split('.')[1],
          }));
        } else {
          // Schema mode: extract entire schemas
          sqlPayload.selectedSchemas = this.importer.sqlServer.selectedSchemas;
        }

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
        const outputHint = payload.data.markdownOutputPath
          ? ` Files saved to ${payload.data.markdownOutputPath}`
          : '';
        this.showToast(
          `SQL Server extraction complete: ${objectSummary}, ${payload.data.relationshipsDetected} relationships.${outputHint}`
        );
      } catch (err) {
        this.showToast(`SQL Server extraction failed: ${err.message}`);
      } finally {
        this.importer.sqlServer.connecting = false;
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
          const meiliUrl = this.importer.status?.meilisearchUrl || 'http://localhost:7700';
          this.showToast(
            `Load blocked: Meilisearch is unavailable at ${meiliUrl}. Start it and refresh status.`
          );
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
      if (view === 'browse') {
        this.loadBrowse();
      }
      if (view === 'glossary') {
        this.loadGlossary();
      }
      if (view === 'products') {
        this.loadProductsCatalog();
      }
      if (view === 'governance') {
        this.loadGovernanceSummary();
      }
      if (view === 'discovery') {
        await nextTick();
        this.renderGraph();
        this.loadDiscovery();
      }
      if (view === 'reports') {
        this.loadSchedules();
        this.buildBlastRadiusReport();
        this.loadMarketplaceRequests();
        await nextTick();
        this.renderBlastRadiusChart();
      }
      if (view === 'integrations') {
        this.loadLinks();
      }
      if (view === 'import') {
        this.loadImportStatus(true);
      }
      if (view === 'docs') {
        await this.loadDocsLibrary();
      }
    },
  },
  async mounted() {
    // Auto-initialize: if no token, enable demo mode; otherwise try to load real data
    if (!this.token || this.token === '') {
      this.setDemoMode(true);
    } else {
      await this.bootstrapData();
    }
  },
  beforeUnmount() {
    this.stopImportStatusPolling();
  },
  template: `
    <v-app>
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
          color="#0f172a"
          theme="dark"
          :model-value="$vuetify.display.smAndDown ? mobileSidebarOpen : true"
          @update:model-value="handleDrawerModelUpdate"
          :permanent="!$vuetify.display.smAndDown"
          :temporary="$vuetify.display.smAndDown"
          :rail="sidebarCollapsed && !$vuetify.display.smAndDown"
          width="216"
        >
          <div class="brand">
            <div class="brand-icon">⬡</div>
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
                  <span class="nav-icon">{{ item.icon }}</span>
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
                <v-btn v-if="$vuetify.display.smAndDown" icon variant="text" size="small" @click="toggleMobileSidebar" title="Open navigation">☰</v-btn>
                <v-btn v-else icon variant="text" size="small" @click="toggleSidebar" title="Collapse sidebar">
                  {{ sidebarCollapsed ? '⤢' : '⤡' }}
                </v-btn>
              </div>
              <h4>{{ activeNavItem?.label || 'Workspace' }}</h4>
              <div class="user-meta">{{ activeNavSection?.label || 'Workspace' }} · {{ currentUser?.email }} · {{ (currentUser?.roles || []).join(', ') }}</div>
              <div class="workflow-inline">
                <span class="workflow-inline-label">{{ workflowProgressPercent }}% complete</span>
                <span class="workflow-inline-next">→ {{ recommendedWorkflowAction.label }}</span>
              </div>
            </div>
            <div class="btn-row">
              <v-btn color="primary" size="small" @click="runRecommendedWorkflowAction">Run Next Step</v-btn>
              <v-chip size="small" :color="demoModeEnabled ? 'info' : 'success'" variant="flat">
                {{ demoModeEnabled ? 'Demo Data: ON' : 'Demo Data: OFF' }}
              </v-chip>
              <v-btn v-if="!hasRealData" size="small" variant="tonal" @click="setDemoMode(!demoModeEnabled)">
                {{ demoModeEnabled ? 'Disable Demo Data' : 'Enable Demo Data' }}
              </v-btn>
              <v-btn size="small" variant="tonal" @click="bootstrapData">Refresh All</v-btn>
              <v-btn size="small" color="secondary" variant="tonal" @click="logout">Logout</v-btn>
            </div>
          </v-app-bar>

          <v-container fluid class="content">
            <div v-if="activeView === 'overview'">
              <!-- Search Hero (Atlan/Alation style) -->
              <div class="search-hero" style="margin-bottom:14px;">
                <h2>&#128269; Find anything in your data catalog</h2>
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
                <!-- Persona KPIs Header -->
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

                <!-- Quality Radar -->
                <v-col cols="12" sm="12" md="7" lg="8">
                  <v-card variant="outlined">
                    <v-card-title style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);margin-bottom:12px;">Quality Radar</v-card-title>
                    <v-card-text style="min-height:290px;"><canvas id="quality-chart"></canvas></v-card-text>
                  </v-card>
                </v-col>

                <!-- Insights + Activity -->
                <v-col cols="12" sm="12" md="5" lg="4">
                  <v-card variant="outlined">
                    <v-card-title style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);margin-bottom:12px;">Persona Insights</v-card-title>
                    <v-card-text>
                      <ul class="persona-insight-list">
                        <li v-for="insight in personaInsights" :key="'insight-' + insight">{{ insight }}</li>
                      </ul>

                      <h4 style="margin:12px 0 8px;font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;">Quality Checks</h4>
                      <div class="check-list" v-if="quality && quality.checks">
                        <div v-for="(val, key) in quality.checks" :key="key" class="check-item" :class="val ? 'pass' : 'fail'">
                          <span class="check-icon">{{ val ? '&#10003;' : '&#10007;' }}</span>
                          <span class="check-label">{{ key.replace(/([A-Z])/g,' $1').replace(/^./,s=>s.toUpperCase()) }}</span>
                          <v-chip size="x-small" :class="val ? 'analyst' : 'admin'" variant="flat">{{ val ? 'Pass' : 'Fail' }}</v-chip>
                        </div>
                        <div v-if="!quality.checks" class="empty">No quality data yet.</div>
                      </div>
                      <div v-else class="empty">Load data to see quality checks.</div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Recent Assets -->
                <v-col cols="12" sm="12" md="8" lg="8">
                  <v-card variant="outlined">
                    <v-card-title style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);margin-bottom:12px;">Recent Catalog Objects</v-card-title>
                    <v-card-text>
                      <div class="asset-results">
                        <div
                          v-for="obj in (objectList.length ? objectList : (demoModeEnabled ? demoSnapshot.objects : [])).slice(0,6)"
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
                              <span class="trust-verified badge" v-if="obj.sensitivity !== 'confidential'">&#10003; Verified</span>
                              <span class="trust-deprecated badge" v-else-if="obj.sensitivity === 'confidential'">&#128274; Confidential</span>
                            </div>
                            <div class="asset-description">{{ obj.description || 'No description available.' }}</div>
                            <div class="asset-meta">
                              <v-chip size="x-small" variant="tonal" class="schema-badge">{{ obj.database || 'unknown' }}</v-chip>
                              <v-chip size="x-small" variant="outlined" class="owner-chip">&#128100; {{ obj.owner || 'unassigned' }}</v-chip>
                              <v-chip size="x-small" variant="outlined" class="type-chip">{{ obj.type || 'object' }}</v-chip>
                            </div>
                          </div>
                          <div class="asset-actions">
                            <v-btn size="small" variant="outlined" @click.stop="selectedObjectId = obj.id; onViewChange('discovery'); $nextTick(loadDiscovery)">↗ Lineage</v-btn>
                          </div>
                        </div>
                        <div v-if="!(objectList.length || (demoModeEnabled && demoSnapshot.objects.length))" class="empty-state">
                          <div class="empty-state-icon">&#128193;</div>
                          <h4>No catalog objects yet</h4>
                          <p>Connect to SQL Server or upload markdown files to populate your catalog.</p>
                          <v-btn color="primary" @click="onViewChange('import')">Go to Ingestion</v-btn>
                        </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-col>

                <!-- Workflow progress sidebar -->
                <v-col cols="12" sm="12" md="4" lg="4">
                  <v-card variant="outlined">
                    <v-card-title style="font-size:13px;font-weight:700;text-transform:uppercase;letter-spacing:0.05em;color:var(--text-muted);margin-bottom:12px;">Pipeline Progress</v-card-title>
                    <v-card-text>
                      <div class="workflow-progress" style="margin-bottom:10px;">
                        <div class="workflow-progress-bar" :style="{ width: workflowProgressPercent + '%' }"></div>
                      </div>
                      <div style="font-size:11px;color:var(--text-muted);margin-bottom:10px;">{{ workflowProgressPercent }}% of governance pipeline complete</div>
                      <div class="mini-stack">
                        <div
                          v-for="step in importWorkflowSteps"
                          :key="'ov-wf-' + step.key"
                          class="mini-metric"
                          style="cursor:pointer;"
                          @click="jumpToWorkflowStep(step)"
                        >
                          <span>{{ step.label }}</span>
                          <v-chip size="x-small" :class="step.done ? 'pill-green' : 'pill-gray'" variant="flat">{{ step.done ? 'Done' : 'Pending' }}</v-chip>
                        </div>
                      </div>
                      <div class="btn-row" style="margin-top:10px;">
                        <v-btn block color="primary" @click="runRecommendedWorkflowAction">
                          &#9658; {{ recommendedWorkflowAction.label }}
                        </v-btn>
                      </div>

                      <h4 style="margin:12px 0 8px;font-size:12px;font-weight:600;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;">Platform Health</h4>
                      <div class="mini-stack">
                        <div class="mini-metric">
                          <span>Search Index</span>
                          <v-chip size="x-small" :class="isMeilisearchHealthy ? 'pill-green' : 'pill-red'" variant="flat">{{ meilisearchStatusLabel }}</v-chip>
                        </div>
                        <div class="mini-metric">
                          <span>Demo Mode</span>
                          <v-chip size="x-small" :class="demoModeEnabled ? 'pill-blue' : 'pill-gray'" variant="flat">{{ demoModeEnabled ? 'ON' : 'OFF' }}</v-chip>
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
              <!-- Search bar -->
              <div class="search-hero" style="margin-bottom:14px;">
                <h2>&#125; Search &amp; Catalog</h2>
                <p>Find, explore, and understand every asset in your data ecosystem</p>
                <div class="search-bar-wrap">
                  <v-text-field
                    v-model="browseQuery"
                    placeholder="Search assets, owners, schemas, tags..."
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    @keyup.enter="runSearch"
                  ></v-text-field>
                  <v-btn color="primary" @click="runSearch">Search</v-btn>
                </div>
                <div class="search-hint">{{ filteredCatalogResults.length }} visible · {{ catalogBaseResults.length }} total candidates</div>
              </div>

              <v-row>
                <!-- Facet Rail (Atlan / DataHub style) -->
                <v-col cols="12" md="3" lg="2">
                <div class="facet-rail">
                  <div class="facet-rail-title">Filters</div>

                  <div class="facet-group">
                    <div class="facet-group-title">Asset Type</div>
                    <div class="btn-row" style="gap:6px;flex-wrap:wrap;">
                      <v-chip
                        v-for="typeName in browseFacetOptions.types"
                        :key="typeName"
                        size="small"
                        :color="selectedFacetFilters.types.includes(typeName) ? 'primary' : undefined"
                        :variant="selectedFacetFilters.types.includes(typeName) ? 'flat' : 'outlined'"
                        style="cursor:pointer;"
                        @click="toggleBrowseFacet('types', typeName)"
                      >
                        {{ typeName === 'storedProcedure' ? 'Procedure' : typeName.charAt(0).toUpperCase() + typeName.slice(1) }} ({{ browseFacetCounts.types[typeName] || 0 }})
                      </v-chip>
                    </div>
                  </div>

                  <div class="facet-group">
                    <div class="facet-group-title">Quality</div>
                    <div class="btn-row" style="gap:6px;flex-wrap:wrap;">
                      <v-chip
                        size="small"
                        :color="selectedFacetFilters.quality.includes('verified') ? 'success' : undefined"
                        :variant="selectedFacetFilters.quality.includes('verified') ? 'flat' : 'outlined'"
                        style="cursor:pointer;"
                        @click="toggleBrowseFacet('quality', 'verified')"
                      >Verified ({{ browseFacetCounts.quality.verified || 0 }})</v-chip>
                      <v-chip
                        size="small"
                        :color="selectedFacetFilters.quality.includes('warning') ? 'warning' : undefined"
                        :variant="selectedFacetFilters.quality.includes('warning') ? 'flat' : 'outlined'"
                        style="cursor:pointer;"
                        @click="toggleBrowseFacet('quality', 'warning')"
                      >Warning ({{ browseFacetCounts.quality.warning || 0 }})</v-chip>
                      <v-chip
                        size="small"
                        :color="selectedFacetFilters.quality.includes('draft') ? 'info' : undefined"
                        :variant="selectedFacetFilters.quality.includes('draft') ? 'flat' : 'outlined'"
                        style="cursor:pointer;"
                        @click="toggleBrowseFacet('quality', 'draft')"
                      >Draft ({{ browseFacetCounts.quality.draft || 0 }})</v-chip>
                    </div>
                  </div>

                  <div class="facet-group" v-if="browseFacetOptions.databases.length">
                    <div class="facet-group-title">Database</div>
                    <div class="btn-row" style="gap:6px;flex-wrap:wrap;">
                      <v-chip
                        v-for="dbName in browseFacetOptions.databases"
                        :key="dbName"
                        size="small"
                        :color="selectedFacetFilters.databases.includes(dbName) ? 'primary' : undefined"
                        :variant="selectedFacetFilters.databases.includes(dbName) ? 'flat' : 'outlined'"
                        style="cursor:pointer;"
                        @click="toggleBrowseFacet('databases', dbName)"
                      >{{ dbName }} ({{ browseFacetCounts.databases[dbName] || 0 }})</v-chip>
                    </div>
                  </div>

                  <div class="facet-group" v-if="searchFacets">
                    <div class="facet-group-title">Type Distribution</div>
                    <div class="facet-item" v-for="(cnt, typ) in (searchFacets.types || {})" :key="typ">
                      <span>{{ typ }}</span>
                      <span class="facet-count">{{ cnt }}</span>
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
                    <v-btn block size="small" variant="outlined" @click="clearBrowseFacets">Clear Filters</v-btn>
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

                <!-- Main Results Area -->
                <v-col cols="12" md="9" lg="10">
                <div>
                  <!-- Results header -->
                  <div class="section-header" style="margin-bottom:10px;">
                    <span class="section-title">
                      {{ filteredCatalogResults.length }} filtered results
                    </span>
                    <div class="btn-row">
                      <v-btn size="small" variant="outlined" @click="runSearch">↻ Refresh</v-btn>
                      <v-btn size="small" variant="outlined" @click="bootstrapData">Load Catalog</v-btn>
                    </div>
                  </div>

                  <!-- Search Results (as asset cards - Atlan style) -->
                  <div class="asset-results" v-if="filteredCatalogResults.length > 0">
                    <!-- Search hits first -->
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
                          <v-chip size="x-small" class="trust-verified" variant="flat" v-if="item.sensitivity !== 'confidential' && item.sensitivity !== 'restricted'">✓ Verified</v-chip>
                          <v-chip size="x-small" class="trust-warning" variant="flat" v-else-if="item.sensitivity === 'restricted'">⚠ Restricted</v-chip>
                          <v-chip size="x-small" class="trust-deprecated" variant="flat" v-else-if="item.sensitivity === 'confidential'">🔒 Confidential</v-chip>
                        </div>
                        <div class="asset-description">{{ item.description || 'No description available — help improve coverage by adding one.' }}</div>
                        <div class="asset-meta">
                          <v-chip size="x-small" variant="tonal" class="schema-badge">{{ item.database || item.schema || 'unknown' }}</v-chip>
                          <v-chip size="x-small" variant="outlined" class="owner-chip">&#128100; {{ item.owner || 'unassigned' }}</v-chip>
                          <v-chip size="x-small" variant="outlined" class="type-chip">{{ item.type || 'object' }}</v-chip>
                          <v-chip v-if="item.sensitivity" size="x-small" :class="'sens-' + item.sensitivity" variant="flat">{{ item.sensitivity }}</v-chip>
                          <v-chip v-if="item.trust_level" size="x-small" class="analyst" variant="flat">Trust: {{ item.trust_level }}</v-chip>
                          <v-chip v-if="item.certified" size="x-small" class="poweruser" variant="flat">Certified</v-chip>
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
                        <v-btn size="small" variant="outlined" @click.stop="selectedObjectId = item.id || item.name; onViewChange('discovery'); $nextTick(loadDiscovery)">
                          ↗ Lineage
                        </v-btn>
                      </div>
                    </div>
                  </div>

                  <!-- Empty state (Alation / DataHub style) -->
                  <div v-else class="card">
                    <div class="empty-state">
                      <div class="empty-state-icon">&#128269;</div>
                      <h4>No catalog objects found</h4>
                      <p>Adjust filters or connect to SQL Server to extract metadata and populate your catalog.</p>
                      <v-btn color="primary" @click="clearBrowseFacets">Clear Filters</v-btn>
                    </div>
                  </div>

                  <!-- Detail panel when object selected -->
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
                            <v-chip size="x-small" class="trust-verified" variant="flat">✓ Verified</v-chip>
                            <v-chip size="x-small" class="type-chip" variant="outlined">{{ selectedObjectDetail.type }}</v-chip>
                            <v-chip size="x-small" class="owner-chip" variant="outlined">&#128100; {{ selectedObjectDetail.owner || 'unassigned' }}</v-chip>
                            <v-chip v-if="selectedObjectGovernance?.trust?.trust_level" size="x-small" class="analyst" variant="flat">{{ selectedObjectGovernance.trust.trust_level }}</v-chip>
                            <v-chip v-if="selectedObjectGovernance?.trust?.certified" size="x-small" class="poweruser" variant="flat">Certified</v-chip>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="detail-body">
                      <div class="tab-row">
                        <v-btn size="small" variant="flat" color="primary">Overview</v-btn>
                        <v-btn size="small" variant="outlined" @click="onViewChange('discovery'); $nextTick(loadDiscovery)">Lineage</v-btn>
                      </div>
                      <p style="font-size:13px;color:var(--text-muted);">{{ selectedObjectDetail.description || 'No description available.' }}</p>
                      <div class="stat-row">
                        <div class="stat-item"><div class="stat-value">{{ selectedObjectDetail.upstreamCount || '—' }}</div><div class="stat-label">Upstream</div></div>
                        <div class="stat-item"><div class="stat-value">{{ selectedObjectDetail.downstreamCount || '—' }}</div><div class="stat-label">Downstream</div></div>
                        <div class="stat-item"><div class="stat-value">{{ selectedObjectDetail.sensitivity || '—' }}</div><div class="stat-label">Sensitivity</div></div>
                        <div class="stat-item"><div class="stat-value">{{ selectedObjectGovernance?.trust?.score || '—' }}</div><div class="stat-label">Trust Score</div></div>
                      </div>
                      <div class="grid mt-12" style="grid-template-columns:1fr 1fr;gap:12px;">
                        <v-card class="card" style="box-shadow:none;" variant="outlined">
                          <h4>Metadata Enrichment</h4>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.owner" placeholder="Owner" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.steward" placeholder="Steward" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.domain_manager" placeholder="Domain Manager" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.custodian" placeholder="Custodian" density="compact" variant="outlined" hide-details></v-text-field></div>
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
                          <div class="form-row"><v-textarea v-model="editableObjectMetadata.description" rows="5" variant="outlined" density="compact" hide-details placeholder="Description"></v-textarea></div>
                          <div class="btn-row"><v-btn color="primary" @click="saveSelectedObjectMetadata">Save Markdown Metadata</v-btn></div>
                        </v-card>
                        <v-card class="card" style="box-shadow:none;" variant="outlined">
                          <h4>Governance Context</h4>
                          <div class="mini-stack">
                            <div class="mini-metric"><span>Owner</span><strong>{{ selectedObjectGovernance?.asset?.owner || '—' }}</strong></div>
                            <div class="mini-metric"><span>Steward</span><strong>{{ selectedObjectGovernance?.asset?.steward || '—' }}</strong></div>
                            <div class="mini-metric"><span>Domain Manager</span><strong>{{ selectedObjectGovernance?.asset?.domain_manager || '—' }}</strong></div>
                            <div class="mini-metric"><span>Custodian</span><strong>{{ selectedObjectGovernance?.asset?.custodian || '—' }}</strong></div>
                          </div>
                          <div class="mt-8" v-if="selectedObjectGovernance?.classifications?.length">
                            <div class="section-title" style="font-size:11px;margin-bottom:6px;">Classifications</div>
                            <div class="btn-row">
                              <v-chip v-for="cls in selectedObjectGovernance.classifications" :key="'detail-cls-' + cls" class="viewer" size="x-small" variant="flat">{{ cls }}</v-chip>
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
              <v-row>
              <v-col cols="12" md="3" lg="2">
              <v-card class="card" variant="outlined">
                <div class="section-header" style="margin-bottom:10px;">
                  <span class="section-title">Business Glossary</span>
                </div>
                <div class="form-row">
                  <v-text-field
                    v-model="glossary.query"
                    placeholder="Search glossary terms..."
                    density="compact"
                    variant="outlined"
                    hide-details
                    @keyup.enter="loadGlossary"
                  ></v-text-field>
                </div>
                <div class="btn-row" style="margin-bottom:10px;">
                  <v-btn size="small" color="primary" @click="loadGlossary">Search</v-btn>
                </div>
                <div class="facet-group" v-if="glossary.domains.length">
                  <div class="facet-group-title">Domains</div>
                  <div class="facet-item" v-for="domain in glossary.domains" :key="'glossary-domain-' + domain">
                    <span>{{ domain }}</span>
                  </div>
                </div>
                <div class="mini-stack" style="margin-top:12px;">
                  <v-btn
                    v-for="term in glossary.terms"
                    :key="term.slug"
                    size="small"
                    variant="outlined"
                    style="justify-content:flex-start;"
                    @click="openGlossaryTerm(term.slug)"
                  >{{ term.term }}</v-btn>
                </div>
              </v-card>
              </v-col>
              <v-col cols="12" md="9" lg="10">
              <v-card class="card" variant="outlined">
                <div v-if="glossary.selected">
                  <div class="section-header" style="margin-bottom:8px;">
                    <span class="section-title">{{ glossary.selected.term }}</span>
                    <div class="btn-row">
                      <v-chip class="analyst" size="x-small" variant="flat">{{ glossary.selected.domain }}</v-chip>
                      <v-chip class="viewer" size="x-small" variant="flat">{{ glossary.selected.status }}</v-chip>
                    </div>
                  </div>
                  <div class="asset-meta" style="margin-bottom:8px;">
                    <v-chip class="owner-chip" size="x-small" variant="outlined">&#128100; {{ glossary.selected.owner || 'unassigned' }}</v-chip>
                    <v-chip class="owner-chip" size="x-small" variant="outlined">Steward: {{ glossary.selected.steward || '—' }}</v-chip>
                    <v-chip v-if="glossary.selected.abbreviation" class="type-chip" size="x-small" variant="outlined">{{ glossary.selected.abbreviation }}</v-chip>
                  </div>
                  <div v-html="renderDocHtml(glossary.selected.body || '')"></div>
                </div>
                <div v-else class="empty">Select a glossary term.</div>
              </v-card>
              </v-col>
              </v-row>
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

            <div v-if="activeView === 'governance'">
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

            <div v-if="activeView === 'discovery'">
              <v-row>
              <!-- Graph controls -->
              <v-col cols="12">
              <v-card class="card" style="padding:12px 16px;" variant="outlined">
                <div class="section-header" style="margin-bottom:8px;">
                  <span class="section-title">&#x27C6; Lineage &amp; Dependency Graph</span>
                  <div class="btn-row">
                    <v-btn size="small" variant="outlined" @click="buildBlastRadiusReport(); $nextTick(renderBlastRadiusChart)">⚡ Blast Radius</v-btn>
                    <v-btn size="small" color="primary" @click="loadDiscovery">⇄ Render</v-btn>
                  </div>
                </div>
                <div class="form-row" style="grid-template-columns:1fr auto auto auto;">
                  <v-text-field v-model="selectedObjectId" placeholder="Object ID (e.g. sales.orders)" density="compact" variant="outlined" hide-details></v-text-field>
                  <v-select
                    v-model="discoveryFormat"
                    density="compact"
                    variant="outlined"
                    hide-details
                    style="width:130px;"
                    :items="[
                      { title: 'Cytoscape', value: 'cytoscape' },
                      { title: 'Mermaid', value: 'mermaid' },
                    ]"
                  ></v-select>
                  <v-text-field type="number" min="1" max="5" v-model.number="discoveryDepth" density="compact" variant="outlined" hide-details style="width:70px;" title="Depth"></v-text-field>
                  <v-btn color="primary" @click="loadDiscovery">Render Graph</v-btn>
                </div>
                <!-- Node legend -->
                <div class="graph-legend">
                  <span class="legend-item"><span class="legend-dot" style="background:#2563eb;border-radius:2px;"></span>Table</span>
                  <span class="legend-item"><span class="legend-dot" style="background:#7c3aed;transform:rotate(45deg);"></span>View</span>
                  <span class="legend-item"><span class="legend-dot" style="background:#ea580c;clip-path:polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%);"></span>Procedure</span>
                  <span class="legend-item"><span class="legend-dot" style="background:#0d9488;border-radius:50%;"></span>Function</span>
                  <span class="legend-item"><span class="legend-dot" style="background:#be123c;clip-path:polygon(50% 0%,100% 100%,0% 100%);"></span>Trigger</span>
                  <span class="legend-item" style="margin-left:auto;font-size:10px;color:var(--text-faint);">Node size = impact score &nbsp;·&nbsp; Edge width = confidence</span>
                </div>
              </v-card>
              </v-col>

              <!-- Blast Radius KPIs -->
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

              <!-- Graph canvas and Impact side panel -->
              <v-row>
              <v-col cols="12" md="8" lg="8">
              <v-card class="card" style="padding:12px;" variant="outlined">
                <div class="section-header" style="margin-bottom:8px;">
                  <span class="section-title">Lineage Graph — {{ selectedObjectId }}</span>
                  <div class="btn-row">
                    <v-btn size="small" variant="outlined" @click="loadDiscovery">↻</v-btn>
                  </div>
                </div>
                <div class="graph-box" v-if="discoveryFormat === 'cytoscape'"><div id="cy-graph"></div></div>
                <div class="graph-box" v-else-if="discoveryFormat === 'mermaid'" id="mermaid-graph"></div>
                <div class="graph-box" v-else style="padding:12px;"><pre class="mono" style="overflow:auto;margin:0;">{{ JSON.stringify(discoveryGraph?.data, null, 2) }}</pre></div>
              </v-card>
              </v-col>

              <!-- Impact side panel -->
              <v-col cols="12" md="4" lg="4">
              <v-card class="card" style="padding:12px;" variant="outlined">
                <h3>Impact Summary</h3>
                <div class="mini-stack" style="margin-bottom:10px;">
                  <div class="mini-metric"><span>Focus Object</span><strong style="font-family:monospace;font-size:11px;">{{ selectedObjectId }}</strong></div>
                  <div class="mini-metric"><span>Top Reach Score</span><strong>{{ reports.blastRows?.[0]?.reachScore || 0 }}</strong></div>
                  <div class="mini-metric"><span>Highest Tier</span><strong>{{ reports.blastRows?.[0]?.tier || '—' }}</strong></div>
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

              <!-- Heat map / matrix -->
              <v-row>
              <v-col cols="12">
              <v-card class="card" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Dependency Matrix &amp; Tier Distribution</span>
                  <div class="btn-row">
                    <v-text-field v-model="matrixDatabase" placeholder="Database" density="compact" variant="outlined" hide-details style="width:140px;"></v-text-field>
                    <v-btn size="small" variant="outlined" @click="loadDiscovery">Reload</v-btn>
                  </div>
                </div>
                <div class="table-wrap" style="max-height:260px;" v-if="reports.blastHeatmap && reports.blastHeatmap.length">
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
                <div v-else class="empty-state">
                  <div class="empty-state-icon">&#128202;</div>
                  <h4>No heat map data yet</h4>
                  <p>Run a blast radius analysis to see tier and type distribution.</p>
                </div>
              </v-card>
              </v-col>
              </v-row>
            </div>

            <div v-if="activeView === 'reports'">
              <v-row>
              <!-- Executive KPIs -->
              <v-col cols="12">
              <v-card class="card" style="padding:12px 16px;" variant="outlined">
                <div class="section-header" style="margin-bottom:10px;">
                  <span class="section-title">&#x25A7; Executive Reporting Suite</span>
                  <v-chip size="small" color="info" variant="tonal">{{ resolvedPersona.charAt(0).toUpperCase() + resolvedPersona.slice(1) }} View</v-chip>
                </div>
                <v-row>
                  <v-col cols="12" sm="6" md="3"><v-card class="card kpi" variant="outlined"><div class="value">{{ executiveReportMetrics.objects }}</div><div class="label">Governed Objects</div></v-card></v-col>
                  <v-col cols="12" sm="6" md="3"><v-card class="card kpi" variant="outlined"><div class="value">{{ executiveReportMetrics.dependencies }}</div><div class="label">Total Dependencies</div></v-card></v-col>
                  <v-col cols="12" sm="6" md="3"><v-card class="card kpi" variant="outlined"><div class="value">{{ executiveReportMetrics.qualityScore || '—' }}</div><div class="label">Quality Score</div></v-card></v-col>
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
                          <v-chip size="x-small" :class="requestItem.sla?.overdue ? 'pill-red' : 'pill-blue'" variant="flat">{{ requestItem.status }}</v-chip>
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

              <!-- Blast radius chart -->
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

              <!-- Heat map -->
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

              <!-- Critical Dependency Leaderboard (Select Star / Alation style) -->
              <v-card class="card span-12" variant="outlined">
                <div class="section-header">
                  <span class="section-title">&#127942; Critical Dependency Leaderboard</span>
                  <span class="text-muted text-small">Top 10 objects by reach score — highest risk targets</span>
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

              <!-- Top Dependency Table -->
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
                        <td>{{ row.downstreamDepth === null ? '—' : row.downstreamDepth }}</td>
                        <td>{{ row.upstreamDepth === null ? '—' : row.upstreamDepth }}</td>
                        <td><strong style="color:var(--primary);">{{ row.reachScore }}</strong></td>
                      </tr>
                      <tr v-if="!reports.blastRows || reports.blastRows.length === 0">
                        <td colspan="6" class="empty">No blast radius data yet — render a graph first.</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>

              <!-- Export Center & One-Click Packs -->
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

              <!-- One-Click Persona Packs -->
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
                        <td><v-chip size="x-small" :class="item.active ? 'pill-green' : 'pill-gray'" variant="flat">{{ item.active ? 'Active' : 'Paused' }}</v-chip></td>
                        <td><v-btn size="small" variant="outlined" @click="runSchedule(item.scheduleId)">Run</v-btn></td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
                <div v-else class="empty">No schedules configured.</div>
              </v-card>
            </div>

            <div v-if="activeView === 'integrations'" class="grid">
              <v-card class="card span-12 help-strip" variant="outlined">
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
                    <v-chip size="x-small" :class="val && val.enabled ? 'pill-green' : 'pill-gray'" variant="flat">{{ val && val.enabled ? 'Enabled' : 'Disabled' }}</v-chip>
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

            <div v-if="activeView === 'import'">
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
              <v-card class="card" variant="outlined">
                <h3>SQL Server Connector</h3>
                <p style="margin-bottom: 15px; font-size: 0.9em; color: #666;">Extract table metadata from SQL Server and auto-generate governance markdown with relationship confidence scoring.</p>
                <div class="form-row" style="margin-bottom: 10px;">
                  <div class="col-2"><v-label>Auth Method</v-label><v-select v-model="importer.sqlServer.authentication" density="compact" variant="outlined" hide-details :items="[{ title: 'SQL Server Auth', value: 'sql-server' }, { title: 'Windows Auth', value: 'windows' }, { title: 'Azure AD', value: 'azure-ad' }]" item-title="title" item-value="value"></v-select></div>
                  <div class="col-3"><v-label>Server</v-label><v-text-field v-model="importer.sqlServer.server" placeholder="localhost or server.database.windows.net" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-2"><v-label>Port</v-label><v-text-field v-model.number="importer.sqlServer.port" type="number" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-3"><v-label>Database</v-label><v-text-field v-model="importer.sqlServer.database" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <div class="form-row" style="margin-bottom: 8px;" v-if="importer.sqlServer.authentication === 'sql-server'">
                  <div class="col-6"><v-label>Username</v-label><v-text-field v-model="importer.sqlServer.username" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-6"><v-label>Password</v-label><v-text-field v-model="importer.sqlServer.password" type="password" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <div class="form-row" style="margin-bottom: 8px;" v-if="importer.sqlServer.authentication === 'windows'">
                  <div class="col-12">
                    <v-checkbox v-model="importer.sqlServer.useIntegratedAuth" density="compact" hide-details label="Use current Windows user (Integrated Auth)"></v-checkbox>
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
                    <v-checkbox v-model="importer.sqlServer.encrypt" density="compact" hide-details label="Encrypt Connection"></v-checkbox>
                    <v-checkbox v-model="importer.sqlServer.trustServerCertificate" density="compact" hide-details label="Trust Server Cert"></v-checkbox>
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

                    <!-- Schema Mode: Simple checkboxes -->
                    <div v-if="importer.sqlServer.selectionMode === 'schema'" style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; max-height: 45vh; overflow-y: auto;">
                      <div v-for="schema in importer.sqlServer.availableSchemas" :key="schema.schemaName" style="display:flex; justify-content:space-between; align-items:center; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                        <v-checkbox-btn :value="schema.schemaName" v-model="importer.sqlServer.selectedSchemas" density="compact" hide-details></v-checkbox-btn>
                        <span style="font-weight: 500; margin-right:auto;">{{ schema.schemaName }}</span>
                        <span style="font-size: 0.8em; color: #999;">
                          {{ schema.totalObjectCount }} objects ({{ schema.tableCount }}T, {{ schema.viewCount }}V, {{ schema.procedureCount }}P)
                        </span>
                      </div>
                      <div v-if="importer.sqlServer.availableSchemas.length === 0" class="empty">No schemas found.</div>
                    </div>

                    <!-- Table Mode: Expandable schemas with table lists -->
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
                              @update:model-value="toggleSchemaTableSelection(schema.schemaName, { target: { checked: $event } })"
                              :label="'Select all in ' + schema.schemaName"
                            ></v-checkbox>
                          </div>
                          <div v-for="table in (importer.sqlServer.schemaTableLists && importer.sqlServer.schemaTableLists[schema.schemaName]) || []" :key="schema.schemaName + '.' + table.name" style="padding: 6px 30px; border-bottom: 1px solid #f3f4f6;">
                            <div style="display:flex; align-items:center; gap:6px; font-size:0.9em;">
                              <v-checkbox-btn :value="schema.schemaName + '.' + table.name" v-model="importer.sqlServer.selectedTables" density="compact" hide-details></v-checkbox-btn>
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

              <v-card class="card span-12" variant="outlined">
                <h3>Markdown Upload & Parse</h3>
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
              </v-col>

              <v-row>
              <v-col cols="12" md="6">
              <v-card class="card" variant="outlined">
                <v-label>Path to markdown tree</v-label>
                <v-text-field v-model="importer.validatePath" density="compact" variant="outlined" hide-details></v-text-field>
                <div class="btn-row" style="margin-top:10px;"><v-btn color="primary" @click="runValidation">Run Validate</v-btn></div>
              </v-card>
              </v-col>

              <v-col cols="12" md="6">
              <v-card class="card" variant="outlined">
                <v-label>Path to markdown tree</v-label>
                <v-text-field v-model="importer.loadPath" density="compact" variant="outlined" hide-details></v-text-field>
                <div style="margin-top: 8px; font-size: 0.85em; color: #4b5563;">
                  <strong>Meilisearch:</strong>
                  <span :style="{ color: isMeilisearchHealthy ? '#065f46' : '#991b1b', fontWeight: '600' }">{{ meilisearchStatusLabel }}</span>
                  <span v-if="importer.status?.meilisearchUrl"> ({{ importer.status.meilisearchUrl }})</span>
                </div>
                <div class="btn-row" style="margin-top:10px;">
                  <v-btn color="primary" @click="runLoad" :disabled="!canLoadToIndex">Load to Index</v-btn>
                  <v-btn variant="tonal" @click="loadImportStatus">Refresh Status</v-btn>
                  <v-btn variant="tonal" @click="downloadGeneratedMarkdownZip">Download ZIP</v-btn>
                </div>
                <div class="mini-stack mt-8" v-if="importer.status">
                  <div class="mini-metric"><span>Status</span><v-chip size="x-small" :class="importer.status.status === 'ok' ? 'pill-green' : 'pill-gray'" variant="flat">{{ importer.status.status || 'unknown' }}</v-chip></div>
                  <div class="mini-metric"><span>Indexed Objects</span><strong>{{ importer.status.loadedObjectCount || 0 }}</strong></div>
                  <div class="mini-metric"><span>Meilisearch</span><v-chip size="x-small" :class="isMeilisearchHealthy ? 'pill-green' : 'pill-red'" variant="flat">{{ meilisearchStatusLabel }}</v-chip></div>
                  <div class="mini-metric" v-if="importer.status.lastGeneratedPath"><span>Last Generated</span><span class="text-mono text-small">{{ importer.status.lastGeneratedPath }}</span></div>
                </div>
                <div v-else class="empty">No status yet — click Refresh Status.</div>
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
                      <div class="health-desc">{{ admin.dashboardUsers.total || admin.dashboardUsers.users?.length || '—' }}</div>
                    </div>
                  </div>
                  <div class="health-card">
                    <span class="health-icon">&#9989;</span>
                    <div>
                      <div class="health-name">Active</div>
                      <div class="health-desc">{{ admin.dashboardUsers.active || '—' }}</div>
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
                    <span class="health-icon">{{ typeof val === 'boolean' || val === 'ok' || val === 'healthy' ? '&#9989;' : '&#10060;' }}</span>
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
                    <span class="nav-icon" style="margin-right:8px;">ⓘ</span>
                    <span>{{ doc.title }}</span>
                  </v-btn>
                </div>
                <div v-else-if="docsLoading" class="empty">Loading documentation…</div>
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
      </v-layout>

      <div v-if="toast" class="toast">{{ toast }}</div>
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
