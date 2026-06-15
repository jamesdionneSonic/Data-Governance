/* eslint-env browser */
/* global Vue, Vuetify, Chart */

import { workflowComponents } from './workflowComponents.js';
import { workflowQuickActions } from './workflowQuickActions.js';
import { navItems, navSections, pageWorkflowMeta } from './workflowRegistry.js';
import {
  assetDetailPageTemplate,
  catalogSearchPageTemplate,
  homeFindDataPageTemplate,
  lineageExplorerPageTemplate,
} from './workflows/findAndUnderstandTemplates.js';
import {
  businessGlossaryPageTemplate,
  governanceOpsPageTemplate,
  metricIntelligencePageTemplate,
} from './workflows/governAndImproveTemplates.js';
import {
  dataProductsPageTemplate,
  governanceInsightsPageTemplate,
} from './workflows/packageAndReportTemplates.js';
import {
  connectionsPageTemplate,
  connectorWorkflowPageTemplate,
  lineageAcquisitionPageTemplate,
  platformAdminPageTemplate,
  profilingSchedulerPageTemplate,
} from './workflows/connectAndOperateTemplates.js';
import { helpCenterPageTemplate } from './workflows/supportTemplates.js';

const { createApp, nextTick } = Vue;
const { createVuetify } = Vuetify;

const vuetify = createVuetify({
  icons: {
    defaultSet: 'mdi',
  },
});

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
  components: workflowComponents,
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
      catalogRecentSearches: (() => {
        try {
          const parsed = JSON.parse(localStorage.getItem('dg_catalog_recent_searches') || '[]');
          return Array.isArray(parsed) ? parsed.filter(Boolean).slice(0, 6) : [];
        } catch {
          return [];
        }
      })(),
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
      showLineageEvidence: false,
      lineageQuestion: 'what uses DimVehicle?',
      lineageQuestionAnswer: null,
      lineageQuestionLoading: false,
      lineageQuestionHistory: [],
      lineageAssistantMessages: [
        {
          id: 'welcome',
          role: 'assistant',
          title: 'Lineage Answer',
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
        connectorTestStates: {},
        connectorPublishLoading: false,
        connectorPublicationResult: null,
        selectedConnectorRun: null,
        connectorRunDrawerOpen: false,
        connectorWorkflowTab: 'connection',
        selectedConnectorId: localStorage.getItem('dg_profile_connector_id') || '',
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
          maxLiveTables: 15,
        },
        profileSchedules: [],
        profileSchedulerStatus: null,
        profileScheduleRuns: [],
        profileScheduleRunScheduleId: '',
        profileQueuePreview: null,
        profileQueueScheduleId: localStorage.getItem('dg_profile_queue_schedule_id') || '',
        profileQueueLoading: false,
        profilePageIssues: [],
        schedulerOpsTab: localStorage.getItem('dg_profile_ops_tab') || 'overview',
        profileScheduleEditorOpen: false,
        profileScheduleLoading: false,
        profileScheduleResult: null,
        profileScheduleEditor: {
          id: '',
          connectorId: '',
          name: '',
          profileType: 'auto',
          status: 'ACTIVE',
          cadence: 'hourly',
          date: '',
          time: '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
          intervalMinutes: 60,
          maxFailures: 3,
          streams: '',
          dryRun: false,
          assetIds: '',
          coverageMode: 'all_objects',
          includeViews: true,
          livePriority: 'most_used_first',
          maxLiveTables: 15,
          autoPublish: true,
          publishTargets: ['devops'],
        },
        connectorEditor: {
          id: '',
          type: '',
          label: '',
          description: '',
          configJson: '{}',
          credentialMode: 'secret_reference',
          secretRef: '',
          rawSecret: '',
          draftMode: false,
          lastResetAt: null,
          availableDatabases: [],
          discoveringDatabases: false,
          databaseDiscoveryError: '',
          wizardStep: 0,
          showAdvancedJson: false,
          rawJsonEdited: false,
          metadataTargets: [],
          formValues: {},
          testSummary: null,
          discoverySummary: null,
          lastValidationAt: null,
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
        showAdvancedTroubleshooting: false,
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
    normalizedCurrentRoles() {
      return (this.currentUser?.roles || ['Viewer'])
        .map((role) =>
          String(role || '')
            .toLowerCase()
            .replace(/[\s_-]+/g, '')
        )
        .filter(Boolean);
    },
    navigationRole() {
      const roles = this.normalizedCurrentRoles;
      if (roles.some((role) => ['admin', 'administrator', 'platformadmin'].includes(role))) {
        return 'admin';
      }
      if (
        roles.some((role) =>
          ['poweruser', 'steward', 'datasteward', 'governancesteward'].includes(role)
        )
      ) {
        return 'steward';
      }
      if (roles.some((role) => ['analyst', 'bianalyst', 'reportanalyst'].includes(role))) {
        return 'analyst';
      }
      return 'user';
    },
    navigationRoleLabel() {
      const labels = {
        user: 'User',
        analyst: 'Analyst',
        steward: 'Data Steward',
        admin: 'Admin',
      };
      return labels[this.navigationRole] || 'User';
    },
    visibleNavSections() {
      return this.navSections
        .map((section) => ({
          ...section,
          items: section.items.filter((item) => !item.hidden && this.canAccessView(item.key)),
        }))
        .filter((section) => section.items.length > 0);
    },
    visibleNavItems() {
      return this.visibleNavSections.flatMap((section) => section.items);
    },
    activeNavItem() {
      return (
        this.visibleNavItems.find((item) => item.key === this.activeView) ||
        this.navItems.find((item) => item.key === this.activeView) ||
        null
      );
    },
    activeNavSection() {
      return (
        this.visibleNavSections.find((section) =>
          section.items.some((item) => item.key === this.activeView)
        ) ||
        this.navSections.find((section) =>
          section.items.some((item) => item.key === this.activeView)
        ) ||
        null
      );
    },
    activePageMeta() {
      return (
        pageWorkflowMeta[this.activeView] || {
          title: this.activeNavItem?.label || 'Workspace',
          subtitle: 'Review the selected governance workflow.',
          workflow: this.activeNavSection?.label || 'Workspace',
          primaryAction: this.recommendedWorkflowAction?.label || 'Run next step',
        }
      );
    },
    isSimpleWorkflowView() {
      return ['overview', 'discovery', 'assetDetail', 'scheduler'].includes(this.activeView);
    },
    pageQuickActions() {
      return (workflowQuickActions[this.activeView] || []).filter((action) =>
        this.canAccessView(action.view)
      );
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
      const schedules = (this.integrations.profileSchedules || []).filter(
        (item) => item && typeof item === 'object'
      );
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
    profilePublishTargetOptions() {
      return [
        { title: 'DevOps runtime package', value: 'devops' },
        { title: 'Confluence pages', value: 'confluence' },
      ];
    },
    selectedManagedConnector() {
      const selectedId =
        this.integrations.selectedConnectorId ||
        this.integrations.profileRunEditor.connectorId ||
        this.integrations.profileScheduleEditor.connectorId;
      return (
        (this.integrations.managedConnectors || []).find(
          (connector) => connector.id === selectedId
        ) || null
      );
    },
    selectedProfileScheduleEditorConnector() {
      return (
        (this.integrations.managedConnectors || []).find(
          (connector) => connector.id === this.integrations.profileScheduleEditor.connectorId
        ) || null
      );
    },
    selectedConnectorDefinition() {
      return (
        this.integrations.connectorDefinitions.find(
          (item) => item.type === this.integrations.connectorEditor.type
        ) || null
      );
    },
    selectedConnectorWizard() {
      const wizard = this.selectedConnectorDefinition?.wizard || {};
      return {
        supports_test: wizard.supports_test !== false,
        supports_discovery: wizard.supports_discovery === true,
        recommended_test_options: wizard.recommended_test_options || { dry_run: false },
        auth_modes: Array.isArray(wizard.auth_modes) ? wizard.auth_modes : [],
        basic_fields: Array.isArray(wizard.basic_fields) ? wizard.basic_fields : [],
        advanced_fields: Array.isArray(wizard.advanced_fields) ? wizard.advanced_fields : [],
      };
    },
    connectorWizardStepDefinitions() {
      const steps = [
        { key: 'type', label: '1. Choose type' },
        { key: 'auth', label: '2. Authentication' },
        { key: 'connection', label: '3. Connection' },
        { key: 'test', label: '4. Test' },
      ];
      if (this.selectedConnectorWizard.supports_discovery) {
        steps.push({ key: 'discovery', label: '5. Discover' });
      }
      steps.push({
        key: 'advanced',
        label: this.selectedConnectorWizard.supports_discovery ? '6. Advanced' : '5. Advanced',
      });
      steps.push({
        key: 'save',
        label: this.selectedConnectorWizard.supports_discovery ? '7. Save' : '6. Save',
      });
      return steps;
    },
    currentConnectorWizardStep() {
      const index = Math.max(
        0,
        Math.min(
          this.integrations.connectorEditor.wizardStep || 0,
          this.connectorWizardStepDefinitions.length - 1
        )
      );
      return this.connectorWizardStepDefinitions[index] || this.connectorWizardStepDefinitions[0];
    },
    visibleConnectorBasicFields() {
      return this.selectedConnectorWizard.basic_fields.filter((field) =>
        this.connectorWizardFieldVisible(field)
      );
    },
    visibleConnectorAdvancedFields() {
      return this.selectedConnectorWizard.advanced_fields.filter((field) =>
        this.connectorWizardFieldVisible(field)
      );
    },
    selectedConnectorAuthModeMeta() {
      return (
        this.selectedConnectorWizard.auth_modes.find(
          (mode) => mode.value === this.integrations.connectorEditor.credentialMode
        ) || null
      );
    },
    connectorCredentialFields() {
      return this.connectorCredentialFieldsForMode(
        this.integrations.connectorEditor.credentialMode
      );
    },
    connectorGeneratedConfigPreview() {
      return JSON.stringify(this.buildConnectorConfigFromWizard(), null, 2);
    },
    connectorWizardNextLabel() {
      const step = this.currentConnectorWizardStep?.key;
      const labels = {
        type: 'Continue to Authentication',
        auth: 'Continue to Connection',
        connection: 'Continue to Test',
        test: this.selectedConnectorWizard.supports_discovery
          ? 'Continue to Discovery'
          : 'Continue to Advanced',
        discovery: 'Continue to Advanced',
        advanced: 'Continue to Review',
      };
      return labels[step] || 'Next';
    },
    connectorAdvancedConfigPreview() {
      try {
        return JSON.parse(this.integrations.connectorEditor.configJson || '{}');
      } catch (_err) {
        return null;
      }
    },
    connectorWizardManagedConfigKeys() {
      const keys = new Set();
      [
        ...this.selectedConnectorWizard.basic_fields,
        ...this.selectedConnectorWizard.advanced_fields,
      ].forEach((field) => {
        if (field.config_key) keys.add(field.config_key);
      });
      if (
        this.integrations.connectorEditor.type === 'sql_server' ||
        this.integrations.connectorEditor.type === 'ssis'
      ) {
        keys.add('server');
      }
      return [...keys];
    },
    connectorAdvancedExtraKeys() {
      const advanced = this.connectorAdvancedConfigPreview;
      if (!advanced || typeof advanced !== 'object' || Array.isArray(advanced)) return [];
      const managed = new Set(this.connectorWizardManagedConfigKeys);
      return Object.keys(advanced)
        .filter((key) => !managed.has(key))
        .sort();
    },
    connectorDiscoveryCollections() {
      const snapshot = this.integrations.connectorEditor.discoverySummary || {};
      return Object.entries(snapshot)
        .filter(([key, value]) => key !== 'summary' && Array.isArray(value) && value.length)
        .map(([key, value]) => ({
          key,
          count: value.length,
        }))
        .sort((left, right) => right.count - left.count)
        .slice(0, 8);
    },
    connectorDatabaseOptions() {
      return this.integrations.connectorEditor.availableDatabases || [];
    },
    connectorDatabaseHint() {
      const editor = this.integrations.connectorEditor;
      if (!(editor.type === 'sql_server' || editor.type === 'ssis')) return '';
      if (editor.discoveringDatabases) return 'Refreshing database list for the current server...';
      if (editor.databaseDiscoveryError)
        return `Database discovery failed: ${editor.databaseDiscoveryError}. You can still type a database name manually.`;
      if (editor.availableDatabases.length > 0)
        return `${editor.availableDatabases.length} database(s) found. Pick one or type a name manually.`;
      return 'Authenticate first, then refresh databases for this server.';
    },
    selectedConnectorSchedules() {
      const connectorId = this.selectedManagedConnector?.id;
      if (!connectorId) return [];
      return (this.integrations.profileSchedules || []).filter(
        (schedule) =>
          schedule && typeof schedule === 'object' && schedule.connector_id === connectorId
      );
    },
    operatorScheduleCandidates() {
      const selectedConnectorId = this.selectedManagedConnector?.id || '';
      return (this.integrations.profileSchedules || [])
        .filter((schedule) => schedule && typeof schedule === 'object')
        .sort((left, right) => {
          const leftSelected = left.connector_id === selectedConnectorId ? 1 : 0;
          const rightSelected = right.connector_id === selectedConnectorId ? 1 : 0;
          if (leftSelected !== rightSelected) return rightSelected - leftSelected;
          const leftActive = left.status === 'ACTIVE' ? 1 : 0;
          const rightActive = right.status === 'ACTIVE' ? 1 : 0;
          if (leftActive !== rightActive) return rightActive - leftActive;
          const leftLastRun = left.last_run_at ? new Date(left.last_run_at).getTime() : 0;
          const rightLastRun = right.last_run_at ? new Date(right.last_run_at).getTime() : 0;
          if (leftLastRun !== rightLastRun) return rightLastRun - leftLastRun;
          const leftNextRun = left.next_run_at
            ? new Date(left.next_run_at).getTime()
            : Number.MAX_SAFE_INTEGER;
          const rightNextRun = right.next_run_at
            ? new Date(right.next_run_at).getTime()
            : Number.MAX_SAFE_INTEGER;
          if (leftNextRun !== rightNextRun) return leftNextRun - rightNextRun;
          return String(left.name || left.id || '').localeCompare(
            String(right.name || right.id || '')
          );
        });
    },
    sortedProfileSchedules() {
      return (this.integrations.profileSchedules || [])
        .filter((schedule) => schedule && typeof schedule === 'object')
        .sort((left, right) => {
          const leftRank = this.profileScheduleStateMeta(left).rank;
          const rightRank = this.profileScheduleStateMeta(right).rank;
          if (leftRank !== rightRank) return leftRank - rightRank;
          const leftNextRun = left.next_run_at
            ? new Date(left.next_run_at).getTime()
            : Number.MAX_SAFE_INTEGER;
          const rightNextRun = right.next_run_at
            ? new Date(right.next_run_at).getTime()
            : Number.MAX_SAFE_INTEGER;
          if (leftNextRun !== rightNextRun) return leftNextRun - rightNextRun;
          const leftLastRun = left.last_run_at ? new Date(left.last_run_at).getTime() : 0;
          const rightLastRun = right.last_run_at ? new Date(right.last_run_at).getTime() : 0;
          if (leftLastRun !== rightLastRun) return rightLastRun - leftLastRun;
          return String(left.name || left.id || '').localeCompare(
            String(right.name || right.id || '')
          );
        });
    },
    profileScheduleSections() {
      const sections = [
        {
          key: 'running',
          title: 'Running Active',
          helper: 'Active queues that are running now or have active queue work in flight.',
          schedules: [],
        },
        {
          key: 'failed',
          title: 'Active Failed',
          helper: 'Active queues that need attention before the next reliable profile refresh.',
          schedules: [],
        },
        {
          key: 'successful',
          title: 'Active Successful',
          helper: 'Healthy active queues with successful recent profile evidence.',
          schedules: [],
        },
        {
          key: 'deactivated',
          title: 'Deactivated',
          helper: 'Paused or inactive queues that will not run until activated.',
          schedules: [],
        },
        {
          key: 'drafts',
          title: 'Drafts',
          helper:
            'Saved setup work that cannot run until blockers are resolved and the schedule is activated.',
          schedules: [],
        },
      ];
      const sectionMap = Object.fromEntries(sections.map((section) => [section.key, section]));
      this.sortedProfileSchedules.forEach((schedule) => {
        sectionMap[this.profileScheduleStateMeta(schedule).section]?.schedules.push(schedule);
      });
      return sections;
    },
    profileQueueHealthRows() {
      return this.sortedProfileSchedules.map((schedule) => {
        try {
          return this.profileQueueHealthRow(schedule);
        } catch (err) {
          console.error('Unable to render profile queue health row', err);
          return {
            id: schedule?.id || schedule?.name || 'unknown-profile-queue',
            schedule,
            name: schedule?.name || schedule?.id || 'Profile queue needs review',
            source: schedule?.connector_id || 'No connection selected',
            typeLabel: 'Profile queue',
            statusLabel: 'Needs attention',
            statusColor: 'error',
            healthKey: 'attention',
            needsAttention: true,
            nextRunAt: schedule?.next_run_at || null,
            lastRunAt: schedule?.last_run_at || null,
            lastResult: 'Queue status could not be summarized.',
            completedLiveProfiles: null,
            failedLiveProfiles: null,
            pendingLiveQueue: null,
            selectedThisRun: null,
            freshSkippedCount: null,
            timeoutPenaltyCount: null,
            completedLabel: 'Unknown',
            failedLabel: 'Unknown',
            pendingLabel: 'Unknown',
            selectedLabel: 'Unknown',
            freshSkippedLabel: 'Unknown',
            timeoutPenaltyLabel: 'Unknown',
            coverageModeLabel: 'Default',
            livePriorityLabel: 'Default',
            maxLiveTables: '-',
            blockers: [
              'This queue has saved settings the UI could not summarize. Review the schedule settings before running it.',
            ],
            nextAction: 'Review queue settings before running.',
            explanation: 'This queue has saved settings the UI could not summarize.',
          };
        }
      });
    },
    profileQueueHealthSummary() {
      const rows = this.profileQueueHealthRows;
      const nextRuns = rows
        .map((row) => row.nextRunAt)
        .filter(Boolean)
        .map((value) => new Date(value).getTime())
        .filter((value) => Number.isFinite(value))
        .sort((left, right) => left - right);
      return {
        total: rows.length,
        running: rows.filter((row) => row.healthKey === 'running').length,
        completed: rows.filter((row) => row.healthKey === 'completed').length,
        needsAttention: rows.filter((row) => row.needsAttention).length,
        waiting: rows.filter((row) => row.healthKey === 'waiting').length,
        completedLiveProfiles: rows.reduce(
          (sum, row) => sum + (Number(row.completedLiveProfiles) || 0),
          0
        ),
        failedLiveProfiles: rows.reduce(
          (sum, row) => sum + (Number(row.failedLiveProfiles) || 0),
          0
        ),
        timeoutPenalties: rows.reduce(
          (sum, row) => sum + (Number(row.timeoutPenaltyCount) || 0),
          0
        ),
        nextRunAt: nextRuns.length ? new Date(nextRuns[0]).toISOString() : null,
      };
    },
    profileQueueHeroAnswer() {
      const summary = this.profileQueueHealthSummary;
      if (summary.total === 0) return 'No profiling queues are configured yet.';
      if (summary.needsAttention > 0) {
        return `${summary.needsAttention} profiling queue${summary.needsAttention === 1 ? '' : 's'} need attention before the next reliable refresh.`;
      }
      if (summary.running > 0) {
        return `${summary.running} profiling queue${summary.running === 1 ? ' is' : 's are'} running normally.`;
      }
      if (summary.completed > 0 && summary.nextRunAt) {
        return `Profiling is healthy. The next scheduled run starts ${this.formatTimestamp(summary.nextRunAt)}.`;
      }
      return 'Profiling is waiting for the next scheduled run.';
    },
    profileOperatorToolsOpen() {
      return ['runNow', 'runs', 'publishing'].includes(this.integrations.schedulerOpsTab);
    },
    selectedConnectorActiveSchedule() {
      return (
        this.selectedConnectorSchedules.find((schedule) => schedule.status === 'ACTIVE') || null
      );
    },
    preferredProfileScheduleId() {
      return (
        this.integrations.profileQueueScheduleId ||
        this.selectedConnectorActiveSchedule?.id ||
        this.selectedConnectorSchedules[0]?.id ||
        this.operatorScheduleCandidates[0]?.id ||
        ''
      );
    },
    focusedProfileSchedule() {
      const scheduleId = this.preferredProfileScheduleId;
      return (
        (this.integrations.profileSchedules || []).find((schedule) => schedule.id === scheduleId) ||
        null
      );
    },
    focusedProfileQueueStatus() {
      return this.integrations.profileQueuePreview?.queue_status || null;
    },
    focusedProfileRecentRun() {
      return this.integrations.profileQueuePreview?.recent_runs?.[0] || null;
    },
    focusedQueueNextAssets() {
      return this.integrations.profileQueuePreview?.next_assets || [];
    },
    focusedQueueQueuedAssets() {
      return this.integrations.profileQueuePreview?.queued_assets || [];
    },
    focusedQueueFreshSkippedAssets() {
      return this.integrations.profileQueuePreview?.fresh_skipped_assets || [];
    },
    focusedQueueTimeoutAssets() {
      return this.integrations.profileQueuePreview?.timeout_penalty_assets || [];
    },
    focusedQueueDeferredAssets() {
      return this.focusedQueueQueuedAssets
        .filter(
          (asset) =>
            !this.focusedQueueNextAssets.some((nextAsset) => nextAsset.asset_id === asset.asset_id)
        )
        .slice(0, 12);
    },
    connectorPendingPublishRuns() {
      return (this.integrations.connectorRuns || []).filter((run) =>
        this.connectorRunCanPublish(run)
      );
    },
    connectorPublishFailures() {
      return (this.integrations.connectorRuns || []).filter(
        (run) => this.connectorRunPublishStatus(run) === 'publish_failed'
      );
    },
    connectorRecentPublishedRuns() {
      return (this.integrations.connectorRuns || [])
        .filter((run) =>
          ['published', 'partial_published'].includes(this.connectorRunPublishStatus(run))
        )
        .slice(0, 5);
    },
    selectedConnectorRunDetailItems() {
      const run = this.integrations.selectedConnectorRun;
      if (!run) return [];
      const queueStatus = this.connectorRunQueueStatus(run);
      return [
        { label: 'Run', value: run.id },
        { label: 'Kind', value: this.connectorRunKind(run) },
        { label: 'Status', value: this.connectorRunDisplayStatus(run) },
        { label: 'Completed', value: this.formatTimestamp(run.completed_at) },
        { label: 'Publish', value: this.connectorRunPublishStatus(run) },
        { label: 'Assets / objects', value: this.connectorRunFoundCount(run) },
        { label: 'Metadata enrichment', value: this.connectorRunMetadataEnrichmentStatus(run) },
        { label: 'Actions planned', value: run.summary?.actions_planned },
        { label: 'Columns profiled', value: run.summary?.columns_profiled },
        { label: 'Selected this run', value: queueStatus?.selected_for_this_run },
        { label: 'Coverage assets live', value: run.summary?.coverage_assets_live },
        { label: 'Live completed', value: queueStatus?.completed_live_assets },
        { label: 'Live failed', value: queueStatus?.failed_live_assets },
        { label: 'Queue remaining', value: queueStatus?.pending_live_queue },
      ];
    },
    focusedQueueHeader() {
      if (!this.focusedProfileSchedule) return 'No queue selected';
      return `${this.focusedProfileSchedule.connector_id} live queue`;
    },
    schedulerFocusedConnectorId() {
      return (
        this.focusedProfileSchedule?.connector_id || this.integrations.selectedConnectorId || '-'
      );
    },
    selectedConnectorSupportsProfiling() {
      const connector = this.selectedManagedConnector;
      return [
        'sql_server',
        'postgresql',
        'snowflake',
        'bigquery',
        'databricks',
        'aws_redshift',
      ].includes(connector?.type);
    },
    connectorWorkflowSteps() {
      const hasConnector = Boolean(this.selectedManagedConnector);
      const hasProfile = Boolean(this.integrations.profileRunResult);
      const hasSchedule = this.selectedConnectorSchedules.length > 0;
      return [
        { key: 'connection', label: '1. Save connection', done: hasConnector },
        { key: 'run', label: '2. Profile evidence exists', done: hasProfile },
        { key: 'schedule', label: '3. Used by profile queue', done: hasSchedule },
        { key: 'access', label: '4. Grant access', done: hasConnector },
        {
          key: 'history',
          label: '5. Related run evidence',
          done: this.integrations.connectorRuns.length > 0,
        },
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
          metric:
            sqlObjects > 0
              ? `${sqlObjects.toLocaleString()} objects`
              : `${this.importer.sqlServer.database || 'No database'} selected`,
          description: 'Discover schemas, tables, views, procedures, and relationship confidence.',
        },
        {
          key: 'ssis',
          icon: 'mdi-package-variant',
          label: 'SSIS',
          type: 'ETL',
          status:
            ssisPackages > 0 ? 'Extracted' : this.importer.ssis.inventory ? 'Discovered' : 'Ready',
          statusColor:
            ssisPackages > 0 ? 'success' : this.importer.ssis.inventory ? 'warning' : 'primary',
          metric:
            ssisPackages > 0
              ? `${ssisPackages.toLocaleString()} packages`
              : `${this.importer.ssis.server || 'No server'} configured`,
          description:
            'Extract packages, jobs, execution history, XML lineage, and generated markdown.',
        },
        {
          key: 'markdown',
          icon: 'mdi-file-document-multiple',
          label: 'Markdown',
          type: 'File ingest',
          status: parsedMarkdown > 0 ? 'Parsed' : 'Ready',
          statusColor: parsedMarkdown > 0 ? 'success' : 'primary',
          metric:
            parsedMarkdown > 0
              ? `${parsedMarkdown.toLocaleString()} files`
              : 'Upload governance markdown',
          description: 'Upload curated markdown files and inspect parse results before validation.',
        },
        {
          key: 'data-factory',
          icon: 'mdi-factory',
          label: 'Data Factory',
          type: 'Cloud pipeline',
          status:
            dataFactoryPipelines > 0
              ? 'Extracted'
              : dataFactoryDiscovered > 0
                ? 'Discovered'
                : 'Ready',
          statusColor:
            dataFactoryPipelines > 0
              ? 'success'
              : dataFactoryDiscovered > 0
                ? 'warning'
                : 'primary',
          metric:
            dataFactoryPipelines > 0
              ? `${dataFactoryPipelines.toLocaleString()} pipelines`
              : this.importer.dataFactory.factoryName || 'Azure pipelines',
          description:
            'Discover ADF pipelines, activities, datasets, linked services, and triggers.',
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
          status:
            databricksJobs > 0 ? 'Extracted' : databricksDiscovered > 0 ? 'Discovered' : 'Ready',
          statusColor:
            databricksJobs > 0 ? 'success' : databricksDiscovered > 0 ? 'warning' : 'primary',
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
    lineageAcquisitionDomain() {
      return {
        key: 'SONIC_DW',
        label: 'SONIC_DW',
        cadence: 'Monthly refresh, plus manual investigation refresh',
        sources: [
          { key: 'Sonic_DW', connectorKey: 'sql-server', type: 'Warehouse database' },
          { key: 'VendorData', connectorKey: 'sql-server', type: 'Vendor database' },
          { key: 'StagingDB', connectorKey: 'sql-server', type: 'Staging database' },
          { key: 'ETL_Staging', connectorKey: 'sql-server', type: 'ETL staging database' },
          { key: 'SSIS_UAT', connectorKey: 'ssis', type: 'SSIS evidence' },
        ],
      };
    },
    lineageAcquisitionSourceRows() {
      return this.lineageAcquisitionDomain.sources.map((source) => {
        const connector =
          this.ingestionConnectorOptions.find((item) => item.key === source.connectorKey) || {};
        return {
          ...source,
          status: connector.status || 'Ready',
          statusColor: connector.statusColor || 'primary',
          metric: connector.metric || 'Not configured',
        };
      });
    },
    lineageAcquisitionSummary() {
      const sources = this.lineageAcquisitionSourceRows;
      return {
        domain: this.lineageAcquisitionDomain.label,
        sourceCount: sources.length,
        refreshed: sources.filter((source) => ['Extracted', 'Parsed'].includes(source.status))
          .length,
        ready: sources.filter((source) => source.status === 'Ready').length,
        warnings: sources.filter((source) => source.status === 'Discovered').length,
        indexedObjects:
          this.importer.lastLoadStats?.totalObjects ||
          this.importer.status?.loadedObjectCount ||
          this.overview?.overview?.totalObjects ||
          0,
      };
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
        Number(this.importer.sqlServer.result?.totalObjectsExtracted || 0) > 0 ||
        governedObjects > 0;
      const validated =
        Number(this.importer.validationResult?.valid || 0) > 0 ||
        qualityScore > 0 ||
        governedObjects > 0;
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
    lineageExplorerImpactSummary() {
      const counts = this.lineageAnswer?.semantic_lineage?.summary?.counts || {};
      const upstream = (counts.source_inputs || 0) + (counts.lookup_dependencies || 0);
      const loadPath = (counts.loaders || 0) + (counts.orchestrators || 0);
      const downstream = counts.business_consumers || 0;
      const maintenance = counts.maintenance_reads || 0;
      return {
        upstream,
        loadPath,
        downstream,
        maintenance,
        total: upstream + loadPath + downstream + maintenance,
      };
    },
    lineageExplorerBusinessLogicSummary() {
      if (!this.lineageAnswer) {
        return 'Choose an object and get an answer to see available transformation or load-path logic.';
      }

      const pack = this.lineageAnswer.semantic_lineage || {};
      const loaders = pack.loaders || [];
      const orchestrators = pack.orchestrators || [];
      const maintenanceReads = pack.maintenance_reads || [];
      const parts = [];

      if (loaders.length) {
        parts.push(
          `${loaders.length} loader${loaders.length === 1 ? '' : 's'} write or maintain the focus object`
        );
      }
      if (orchestrators.length) {
        parts.push(
          `${orchestrators.length} orchestrator${orchestrators.length === 1 ? '' : 's'} run the load path`
        );
      }
      if (maintenanceReads.length) {
        parts.push(
          `${maintenanceReads.length} maintenance read${maintenanceReads.length === 1 ? '' : 's'} are separated from business consumers`
        );
      }

      return parts.length
        ? `${parts.join('; ')}.`
        : 'No transformation or load-path logic was found in the current lineage evidence for this answer.';
    },
    selectedAssetLineageTitle() {
      return (
        this.selectedObjectDetail?.name ||
        this.objectNameFromId(this.selectedObjectId) ||
        this.selectedObjectId
      );
    },
    selectedAssetLineagePlainEnglish() {
      return (
        this.lineageAnswer?.plain_english ||
        `${this.selectedAssetLineageTitle} has ${this.assetLineageCount('upstream')} upstream and ${this.assetLineageCount('downstream')} downstream related object${this.assetLineageCount('downstream') === 1 ? '' : 's'} in the loaded lineage evidence.`
      );
    },
    lineageExplorerConfidenceLabel() {
      if (!this.lineageAnswer) return 'Answer Pending';
      const raw =
        this.lineageAnswer.confidence ??
        this.lineageAnswer.confidence_score ??
        this.lineageAnswer.evidence_confidence;
      const confidence = Number(raw);
      if (Number.isFinite(confidence)) {
        if (confidence >= 0.8) return 'High Confidence';
        if (confidence >= 0.5) return 'Strongly Suggested';
        return 'Needs Review';
      }
      return this.lineageAnswer.impacted_objects?.length
        ? 'Strongly Suggested'
        : 'Evidence Pending';
    },
    lineageExplorerConfidenceTooltip() {
      if (!this.lineageAnswer) {
        return 'The platform will explain confidence after it resolves a lineage answer.';
      }
      if (this.lineageExplorerConfidenceLabel === 'Strongly Suggested') {
        return 'Strongly Suggested means the platform found lineage evidence, but users should inspect caveats and evidence before treating it as certified truth.';
      }
      return 'System confidence reflects available metadata, lineage evidence, parser results, and caveats. It is not ownership or compliance approval.';
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
        indexedObjects:
          metrics.indexedObjects ||
          lastLoad.totalObjects ||
          this.importer.status?.loadedObjectCount ||
          0,
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
          { label: 'Review Governance Work', view: 'governanceOps' },
          { label: 'Review Platform Health', view: 'admin' },
          { label: 'Run Next Workflow Step', action: 'workflow' },
        ];
      }
      if (persona === 'steward') {
        return [
          { label: 'Open Review Work', view: 'governanceOps' },
          { label: 'Inspect Business Glossary', view: 'glossary' },
          { label: 'Run Next Workflow Step', action: 'workflow' },
        ];
      }
      if (persona === 'analyst') {
        return [
          { label: 'Search Catalog', view: 'browse' },
          { label: 'Compare Metrics', view: 'metrics' },
          { label: 'Explore selected asset lineage', view: 'browse' },
        ];
      }
      return [
        { label: 'Open Metadata Ingestion', view: 'import' },
        { label: 'Explore selected asset lineage', view: 'browse' },
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
      if (!this.browseSearchSubmitted)
        return 'Search by object name, column, owner, tag, or business meaning.';
      const query = String(this.browseQuery || '').trim();
      return `Showing ${this.filteredCatalogResults.length} result(s)${query ? ` for "${query}"` : ''}.`;
    },
    catalogSearchPlaceholder() {
      const selectedTypes = this.selectedFacetFilters.types || [];
      if (selectedTypes.includes('table')) return 'Enter a table name, like DimVehicle...';
      if (selectedTypes.includes('column'))
        return 'Enter a column name, like email, amount, or customer_id...';
      if (selectedTypes.includes('storedProcedure'))
        return 'Enter a procedure name, like usp_DimVehicle...';
      return 'Search tables, columns, procedures, owners, tags...';
    },
    visibleCatalogRecentSearches() {
      const current = String(this.browseQuery || '')
        .trim()
        .toLowerCase();
      return (this.catalogRecentSearches || [])
        .filter((query) => String(query || '').trim())
        .filter((query) => String(query).trim().toLowerCase() !== current)
        .slice(0, 5);
    },
    catalogHelperActions() {
      return [
        {
          key: 'find-table',
          label: 'Find table',
          icon: 'mdi-table',
          description: 'Search only table assets.',
        },
        {
          key: 'find-column',
          label: 'Find column',
          icon: 'mdi-table-column',
          description: 'Search column names and metadata.',
        },
        {
          key: 'find-pii',
          label: 'Find PII',
          icon: 'mdi-shield-lock',
          description: 'Look for sensitive or restricted data.',
        },
        {
          key: 'find-metric',
          label: 'Find metric',
          icon: 'mdi-function-variant',
          description: 'Search for metric columns and measures.',
        },
        {
          key: 'browse-database',
          label: 'Browse database',
          icon: 'mdi-database-search',
          description: 'Choose a database and browse its objects.',
        },
        {
          key: 'needs-owner',
          label: 'Needs owner',
          icon: 'mdi-account-alert',
          description: 'Find assets missing owner or steward context.',
        },
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
      return (
        Number(this.overview?.overview?.totalObjects || 0) > 0 ||
        this.overviewRecentObjects.length > 0
      );
    },
    hasStaleDemoCatalogState() {
      return (
        !this.demoModeEnabled &&
        (this.isDemoCatalogSnapshot(this.objectList) ||
          this.isDemoCatalogSnapshot(this.browseResults))
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
        ? this.searchFacets.databases
            .filter(Boolean)
            .map((database) => this.catalogDatabaseLabel(database))
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
          selectedDatabases.some((database) => this.catalogDatabaseMatches(itemDatabase, database));

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
    'integrations.selectedConnectorId': function () {
      this.persistProfileOpsFocus();
    },
    'integrations.profileQueueScheduleId': function () {
      this.persistProfileOpsFocus();
    },
    'integrations.schedulerOpsTab': function (value) {
      localStorage.setItem('dg_profile_ops_tab', value || 'overview');
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
    metricConceptLabel(metric = {}) {
      return (
        metric.business_name ||
        metric.metric_name ||
        metric.display_name ||
        metric.definition ||
        metric.semantic_type ||
        metric.column_name ||
        'Unlabeled metric concept'
      );
    },
    metricConceptGroups() {
      const groups = new Map();
      for (const metric of this.metrics.registry?.metrics || []) {
        const label = this.metricConceptLabel(metric);
        const key = String(label).trim().toLowerCase() || 'unlabeled metric concept';
        if (!groups.has(key)) {
          groups.set(key, {
            key,
            label,
            variants: [],
            representative: metric,
          });
        }
        groups.get(key).variants.push(metric);
      }
      return Array.from(groups.values()).map((group) => ({
        ...group,
        suggestedCount: group.variants.filter((metric) => this.metricNeedsReview(metric)).length,
        sourceCount: new Set(group.variants.map((metric) => metric.object_id).filter(Boolean)).size,
      }));
    },
    metricNeedsReview(metric = {}) {
      const state = String(metric.metric_state || metric.status || '').toLowerCase();
      const confidence = String(metric.confidence_label || '').toLowerCase();
      return (
        ['suggested', 'in_review', 'in review', 'inferred', 'candidate', 'draft'].includes(state) ||
        confidence.includes('inferred')
      );
    },
    metricStateLabel(metric = {}) {
      const state = String(metric.metric_state || metric.status || 'suggested').replace(/_/g, ' ');
      return state || 'suggested';
    },
    metricStateColor(metric = {}) {
      const state = String(metric.metric_state || metric.status || '').toLowerCase();
      if (['certified', 'confirmed', 'approved'].includes(state)) return 'success';
      if (['suggested', 'in_review', 'in review', 'inferred', 'candidate'].includes(state))
        return 'info';
      if (state === 'deprecated') return 'error';
      return 'warning';
    },
    metricVariantScope(metric = {}) {
      return (
        metric.business_domain ||
        metric.department ||
        metric.report_name ||
        metric.report ||
        metric.owner ||
        'Shared variant'
      );
    },
    metricTechnicalSourceLabel(metric = {}) {
      const table = metric.object_id || 'source table unavailable';
      const column = metric.column_name ? `.${metric.column_name}` : '';
      return `${table}${column}`;
    },
    metricBusinessLogicSummary(group = {}) {
      const variant = group.representative || group.variants?.[0] || {};
      return (
        variant.business_logic ||
        variant.logic_summary ||
        variant.definition ||
        variant.description ||
        this.metrics.logicAnswer?.answer ||
        'Business logic summary has not been reviewed yet. Select a variant and explain logic to load the current evidence-backed summary.'
      );
    },
    metricRowKey(metric = {}, index = 0) {
      return metric.metric_id || `${metric.object_id || 'metric'}-${metric.column_name || index}`;
    },
    selectMetricVariant(metric = {}, { loadTable = false } = {}) {
      this.metrics.objectId = metric.object_id || this.metrics.objectId;
      this.metrics.selectedColumn = metric.column_name || this.metrics.selectedColumn;
      if (loadTable) {
        this.loadMetricTableAnswer();
      }
    },
    openMetricInLineage(metric = {}) {
      this.selectMetricVariant(metric);
      if (metric.object_id) {
        this.selectedObjectId = metric.object_id;
        this.lineageObjectSearch.query = metric.object_id;
      }
      this.onViewChange('discovery');
    },
    openMetricInCatalog(metric = {}) {
      this.selectMetricVariant(metric);
      if (metric.object_id) {
        this.selectedObjectId = metric.object_id;
        this.browseQuery = metric.object_id;
      }
      this.onViewChange('browse');
    },
    normalizeApiError({ path, method, status, payload, fallbackMessage }) {
      const errorNode = payload?.errorInfo || payload?.error;
      const details = payload?.details || errorNode?.details || payload?.errors || null;
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
        code: payload?.code || errorNode?.code || details?.code || 'API_ERROR',
        message,
        requestId: payload?.requestId || errorNode?.requestId || 'n/a',
        phase: payload?.phase || errorNode?.phase || details?.phase || null,
        remediation: payload?.remediation || errorNode?.remediation || details?.remediation || null,
        details,
      };
    },
    recordApiError(entry) {
      this.apiErrors = [entry, ...this.apiErrors].slice(0, 50);
    },
    clearApiErrors() {
      this.apiErrors = [];
    },
    persistProfileOpsFocus() {
      localStorage.setItem('dg_profile_connector_id', this.integrations.selectedConnectorId || '');
      localStorage.setItem(
        'dg_profile_queue_schedule_id',
        this.integrations.profileQueueScheduleId || ''
      );
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
          this.ensureActiveViewAllowed({ silent: true });
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
        this.discoveryGraph =
          this.discoveryGraph === demoSnapshot.graph ? null : this.discoveryGraph;
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
        this.ensureActiveViewAllowed({ silent: true });
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
          return null;
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
      return null;
    },
    async loadActiveViewData(view = this.activeView) {
      if (view === 'browse') {
        await this.loadBrowse();
        return;
      }
      if (view === 'assetDetail') {
        await this.loadObjectContext();
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
        await Promise.allSettled([this.loadSchedules(), this.loadMarketplaceRequests()]);
        this.buildBlastRadiusReport();
        await nextTick();
        this.renderBlastRadiusChart();
        return;
      }
      if (view === 'integrations') {
        await Promise.allSettled([this.loadIntegrations(), this.loadLinks()]);
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
    openMetricProfilingHandoff() {
      if (!this.metrics.objectId) {
        this.showToast('Choose a table object first.');
        return;
      }
      const assetId = this.metrics.objectId;
      this.integrations.profileRunEditor.profileType = 'aggregate';
      this.integrations.profileRunEditor.executionMode = 'live';
      this.integrations.profileRunEditor.assetIds = assetId;
      this.integrations.profileRunEditor.streams = '';
      this.integrations.profileScheduleEditor.profileType = 'aggregate';
      this.integrations.profileScheduleEditor.assetIds = assetId;
      this.integrations.profileScheduleEditor.name = this.metrics.selectedColumn
        ? `Profile ${this.metrics.selectedColumn}`
        : `Profile ${assetId}`;
      this.integrations.schedulerOpsTab = 'runNow';
      this.onViewChange('scheduler');
      this.showToast('Opened Profiling with the selected metric asset ready for queue review.');
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
        this.ensureActiveViewAllowed({ silent: true });
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
      canvas.height = Math.max(
        240,
        canvas.clientHeight || canvas.parentElement?.clientHeight || 320
      );
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
    persistCatalogRecentSearches() {
      localStorage.setItem(
        'dg_catalog_recent_searches',
        JSON.stringify((this.catalogRecentSearches || []).slice(0, 6))
      );
    },
    recordCatalogRecentSearch(query = this.browseQuery) {
      const normalized = String(query || '').trim();
      if (!normalized) return;
      const next = [
        normalized,
        ...(this.catalogRecentSearches || []).filter(
          (item) =>
            String(item || '')
              .trim()
              .toLowerCase() !== normalized.toLowerCase()
        ),
      ].slice(0, 6);
      this.catalogRecentSearches = next;
      this.persistCatalogRecentSearches();
    },
    async applyCatalogRecentSearch(query) {
      const normalized = String(query || '').trim();
      if (!normalized) return;
      this.browseMode = 'search';
      this.browseQuery = normalized;
      await this.runSearch();
    },
    async performHomeSearch() {
      this.browseMode = 'search';
      this.selectedFacetFilters = {
        types: [],
        quality: [],
        databases: [],
        owners: [],
        sensitivity: [],
        tags: [],
      };
      this.browseSort = 'relevance';
      this.selectedObjectId = '';
      this.selectedObjectDetail = null;
      await this.runSearch();
    },
    async openAssetDetail(objectId) {
      const id = String(objectId || '').trim();
      if (!id) return;
      this.selectedObjectId = id;
      await this.loadObjectContext();
      await this.onViewChange('assetDetail');
    },
    clearHomeSearch() {
      this.browseQuery = '';
      this.browseResults = [];
      this.browseSearchSubmitted = false;
      this.browseSearchWarning = '';
      this.browseSearchEngine = '';
      this.browseSearchTotal = null;
      this.browseLoadError = '';
      this.selectedObjectId = '';
      this.selectedObjectDetail = null;
    },
    clearCatalogRecentSearches() {
      this.catalogRecentSearches = [];
      this.persistCatalogRecentSearches();
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
        const sensitivity = encodeURIComponent(
          (this.selectedFacetFilters.sensitivity || []).join(',')
        );
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
        this.recordCatalogRecentSearch();
      } catch (err) {
        if (this.demoModeEnabled && !this.hasRealData) {
          this.browseResults = demoSnapshot.objects.filter((item) =>
            item.id.includes(this.browseQuery)
          );
          this.browseSearchSubmitted = this.hasBrowseSearchCriteria();
          this.browseSearchWarning = '';
          this.browseSearchEngine = 'demo';
          this.browseSearchTotal = this.browseResults.length;
          this.recordCatalogRecentSearch();
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
        const [
          detailResult,
          upstreamResult,
          downstreamResult,
          impactResult,
          governanceContextResult,
          piiPolicyResult,
          columnSemanticsResult,
          dictionaryResult,
        ] = await Promise.allSettled([
          this.api(`/api/v1/objects/${encodeURIComponent(this.selectedObjectId)}`),
          this.api(
            `/api/v1/lineage/${encodeURIComponent(this.selectedObjectId)}/upstream?depth=${this.discoveryDepth}`
          ),
          this.api(
            `/api/v1/lineage/${encodeURIComponent(this.selectedObjectId)}/downstream?depth=${this.discoveryDepth}`
          ),
          this.api(`/api/v1/discovery/impact/${encodeURIComponent(this.selectedObjectId)}`),
          this.api(`/api/v1/governance/context/${encodeURIComponent(this.selectedObjectId)}`),
          this.api(`/api/v1/classification/pii/${encodeURIComponent(this.selectedObjectId)}`),
          this.api(
            `/api/v1/classification/columns/${encodeURIComponent(this.selectedObjectId)}/semantics`
          ),
          this.api(`/api/v1/dictionary/${encodeURIComponent(this.selectedObjectId)}`),
        ]);
        if (detailResult.status !== 'fulfilled') {
          throw detailResult.reason || new Error('Object detail unavailable');
        }

        const detail = detailResult.value || {};
        const upstream =
          upstreamResult.status === 'fulfilled' ? upstreamResult.value : { data: [] };
        const downstream =
          downstreamResult.status === 'fulfilled' ? downstreamResult.value : { data: [] };
        const impact = impactResult.status === 'fulfilled' ? impactResult.value : { data: [] };
        const governanceContext =
          governanceContextResult.status === 'fulfilled' ? governanceContextResult.value : {};
        const piiPolicy = piiPolicyResult.status === 'fulfilled' ? piiPolicyResult.value : {};
        const columnSemantics =
          columnSemanticsResult.status === 'fulfilled' ? columnSemanticsResult.value : {};
        const dictionary = dictionaryResult.status === 'fulfilled' ? dictionaryResult.value : {};

        this.selectedObjectDetail = detail.data
          ? {
              ...detail.data,
              graphUpstreamCount: this.lineagePayloadItems(upstream).length,
              graphDownstreamCount: this.lineagePayloadItems(downstream).length,
            }
          : null;
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
          business_processes: this.csvFromValue(
            detail.data?.business_processes || detail.data?.business_process
          ),
          use_cases: this.csvFromValue(detail.data?.use_cases),
          documentation_links: this.csvFromValue(
            detail.data?.documentation_links || detail.data?.links
          ),
          related_dashboards: this.csvFromValue(
            detail.data?.related_dashboards || detail.data?.dashboards
          ),
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
          await this.openGlossaryTerm(
            selectedStillVisible ? this.glossary.selected.slug : firstTerm.slug
          );
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

      const { selected } = this.glossary;
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
      const { editor } = this.glossary;
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
          this.api('/api/v1/governance-ops/events/deliveries').catch(() => ({
            data: { deliveries: [] },
          })),
          this.api('/api/v1/governance-ops/ownership/model').catch(() => ({ data: { roles: [] } })),
          this.api('/api/v1/governance-ops/ownership/summary').catch(() => ({ data: null })),
          this.api(
            `/api/v1/governance-ops/ownership/portfolio?subject=${encodeURIComponent(this.governanceOps.portfolioSubject || 'all')}`
          ).catch(() => ({ data: null })),
        ]);
        this.governanceOps.overview = overview.data || null;
        this.governanceOps.ownershipModel = ownershipModel.data?.roles || [];
        this.governanceOps.ownershipSummary =
          ownershipSummary.data || overview.data?.ownership || null;
        this.governanceOps.stewardPortfolio =
          stewardPortfolio.data || overview.data?.stewardPortfolio || null;
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
        const payload = await this.api(
          `/api/v1/governance-ops/ownership/portfolio?subject=${encodeURIComponent(this.governanceOps.portfolioSubject || 'all')}`
        );
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
        await this.api(
          `/api/v1/governance-ops/tasks/${encodeURIComponent(task.taskId)}/transition`,
          {
            method: 'POST',
            body: JSON.stringify({ status }),
          }
        );
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
        item?.quality_trend ?? item?.qualityTrend ?? item?.quality?.trend ?? item?.scorecard?.trend;
      if (typeof trend === 'number') {
        if (trend > 0) return `+${trend}`;
        if (trend < 0) return String(trend);
        return 'flat';
      }
      return trend || 'baseline';
    },
    catalogAssetTypeLabel(item = {}) {
      const type = String(item.type || item.object_type || 'object');
      const labels = {
        storedProcedure: 'Stored Procedure',
        storedprocedure: 'Stored Procedure',
        procedure: 'Stored Procedure',
        table: 'Table',
        view: 'View',
        function: 'Function',
        package: 'Package',
        dataset: 'Dataset',
        column: 'Column',
        report: 'Report',
        metric: 'Metric',
      };
      return labels[type] || type.charAt(0).toUpperCase() + type.slice(1);
    },
    homeAssetDisplayLabel(item = {}) {
      const explicitLabel =
        item.business_name ||
        item.businessName ||
        item.display_name ||
        item.displayName ||
        item.title ||
        item.label;
      if (explicitLabel) return explicitLabel;

      const rawText = [item.name, item.id, item.description, item.packagePath]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (rawText.includes('column_mapping') || rawText.includes('column mapping'))
        return 'Column mapping evidence';
      if (rawText.includes('.dtsx') || rawText.includes('ssis')) return 'SSIS package evidence';
      if (rawText.includes('report')) return 'Report metadata';
      if (rawText.includes('metric')) return 'Metric definition';

      const rawName = String(item.name || item.id || '').trim();
      const looksTechnical = /[\\/]|\.dtsx|chunk[_-]?\d+|[_]{2,}|[.].*[.]/i.test(rawName);
      if (rawName && !looksTechnical) return rawName;

      return `${this.catalogAssetTypeLabel(item)} evidence`;
    },
    homeAssetContextLine(item = {}) {
      const rawText = [item.name, item.id, item.description, item.packagePath]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();

      if (rawText.includes('column_mapping') || rawText.includes('column mapping')) {
        return 'Column-level mapping captured for lineage and impact analysis.';
      }
      if (rawText.includes('.dtsx') || rawText.includes('ssis')) {
        return 'Package metadata captured from SSIS lineage evidence.';
      }
      return this.catalogBusinessSummary(item);
    },
    catalogSourceLocation(item = {}) {
      const parts = [
        item.server || item.source || item.source_system,
        item.database,
        item.schema,
        item.workspace || item.report_workspace,
        item.storage_location,
      ].filter(Boolean);
      if (parts.length) return parts.join(' / ');

      const idParts = String(item.id || '')
        .split('.')
        .filter(Boolean);
      if (idParts.length >= 3) return idParts.slice(0, -1).join(' / ');
      if (item.packagePath) return item.packagePath;
      return item.location || 'Location not captured';
    },
    catalogMatchReason(item = {}) {
      if (item.match_reason || item.matchReason) return item.match_reason || item.matchReason;
      const query = String(this.browseQuery || '')
        .trim()
        .toLowerCase();
      if (!query)
        return this.browseMode === 'browse'
          ? 'Shown from selected database'
          : 'Suggested catalog match';

      const fields = [
        ['name', item.name || item.id],
        ['source location', this.catalogSourceLocation(item)],
        ['description', item.description],
        ['owner', item.owner],
        ['type', item.type],
        ['classification', (item.classifications || []).join(' ')],
        ['tag', (item.tags || []).join(' ')],
      ];
      const match = fields.find(([, value]) =>
        String(value || '')
          .toLowerCase()
          .includes(query)
      );
      if (match) return `Matched ${match[0]}`;
      if (Number(item.score) > 0 || Number(item.rankScore) > 0)
        return 'Matched search index relevance';
      return 'Matched catalog filters';
    },
    catalogConfidenceScore(item = {}) {
      const raw =
        item.system_confidence ??
        item.confidence ??
        item.confidence_score ??
        item.evidence_confidence ??
        this.qualityScoreForItem(item) ??
        item.trust_score ??
        item.trust?.score;
      const score = Number(raw);
      return Number.isFinite(score) ? Math.max(0, Math.min(100, Math.round(score))) : null;
    },
    catalogConfidenceLabel(item = {}) {
      const score = this.catalogConfidenceScore(item);
      if (score === null) return item.description ? 'Context Available' : 'Needs Context';
      if (score >= 85) return 'High Confidence';
      if (score >= 60) return 'Usable With Caveats';
      return 'Needs Review';
    },
    catalogConfidenceReason(item = {}) {
      const score = this.catalogConfidenceScore(item);
      if (score === null) {
        return item.description
          ? 'Business description or metadata exists, but no numeric system confidence is available yet.'
          : 'Missing business description or confidence evidence; inspect details before using.';
      }
      if (score >= 85) return 'Strong metadata/profile evidence is available for this asset.';
      if (score >= 60)
        return 'Some evidence is available, but confirm caveats and ownership before relying on it.';
      return 'Low confidence means metadata, profile, lineage, or parse evidence is incomplete.';
    },
    catalogBusinessSummary(item = {}) {
      return this.catalogBusinessSummaryLines(item).join(' ');
    },
    catalogBusinessSummaryLines(item = {}) {
      const explicit = item.business_summary || item.businessSummary || item.summary;
      if (explicit) return [String(explicit).trim()].filter(Boolean);

      const rawDescription = String(item.description || '').trim();
      const cleanDescription = this.cleanCatalogDescription(rawDescription);
      if (cleanDescription && !/^Metadata was auto-extracted/i.test(cleanDescription))
        return [cleanDescription];

      const columns = this.assetColumnRows(item);
      const name = item.name || this.objectNameFromId(item.id) || 'This asset';
      const type = this.catalogAssetTypeLabel(item).toLowerCase();
      const location = this.catalogSourceLocation(item);
      const notableColumns = columns
        .map((column) => this.columnDisplayName(column))
        .filter(Boolean)
        .filter((columnName) => !/^meta/i.test(columnName))
        .slice(0, 6);
      const lines = [`${name} is a ${type} in ${location}.`];
      if (cleanDescription) lines.push(cleanDescription);
      if (columns.length) {
        lines.push(
          `It has ${columns.length} captured column${columns.length === 1 ? '' : 's'}${notableColumns.length ? `, including ${notableColumns.join(', ')}.` : '.'}`
        );
      }
      const upstreamCount = this.assetLineageCount('upstream', item);
      const downstreamCount = this.assetLineageCount('downstream', item);
      if (upstreamCount || downstreamCount) {
        lines.push(
          `Current curated lineage evidence shows ${upstreamCount} upstream and ${downstreamCount} downstream related object${downstreamCount === 1 ? '' : 's'}.`
        );
      }
      return lines;
    },
    cleanCatalogDescription(description = '') {
      const text = String(description || '')
        .replace(/\r/g, '')
        .trim();
      if (!text) return '';
      const withoutColumns = text.split(/\n\s*Columns\s*\n/i)[0] || text;
      const lines = withoutColumns
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .filter((line) => !/^overview$/i.test(line))
        .filter((line) => !/^metadata auto-extracted from sql server\.?$/i.test(line))
        .filter((line) => !/^\|/.test(line));
      const facts = {};
      lines.forEach((line) => {
        line.replace(
          /\b(Type|Schema|Row Count|Size):\s*([^:]+?)(?=\s+\b(?:Type|Schema|Row Count|Size):|$)/gi,
          (_match, key, value) => {
            facts[key.toLowerCase()] = String(value || '').trim();
            return '';
          }
        );
      });
      if (Object.keys(facts).length) {
        const parts = [];
        if (facts.type) parts.push(`type ${facts.type}`);
        if (facts.schema) parts.push(`schema ${facts.schema}`);
        if (facts['row count']) parts.push(`${facts['row count']} recorded rows`);
        if (facts.size) parts.push(`${facts.size} captured size`);
        return `Metadata was auto-extracted from SQL Server (${parts.join(', ')}).`;
      }
      return lines.join(' ').replace(/\s+/g, ' ').trim();
    },
    objectNameFromId(id = '') {
      return (
        String(id || '')
          .split('.')
          .filter(Boolean)
          .pop() || ''
      );
    },
    assetColumnRows(item = this.selectedObjectDetail) {
      if (Array.isArray(item?.columns) && item.columns.length) return item.columns;
      if (
        item?.id === this.selectedObjectId &&
        Array.isArray(this.selectedObjectDictionary?.columns)
      ) {
        return this.selectedObjectDictionary.columns;
      }
      return [];
    },
    assetDetailColumns() {
      const detailColumns = Array.isArray(this.selectedObjectDetail?.columns)
        ? this.selectedObjectDetail.columns
        : [];
      const dictionaryColumns = Array.isArray(this.selectedObjectDictionary?.columns)
        ? this.selectedObjectDictionary.columns
        : [];

      if (!detailColumns.length) return dictionaryColumns;
      const dictionaryByName = new Map(
        dictionaryColumns.map((column) => [this.columnDisplayName(column).toLowerCase(), column])
      );
      return detailColumns.map((column, index) =>
        this.mergeColumnMetadata(
          column,
          dictionaryByName.get(this.columnDisplayName(column).toLowerCase()) || {},
          index
        )
      );
    },
    mergeColumnMetadata(source = {}, dictionary = {}, index = 0) {
      const pick = (first, second, fallback = null) => {
        if (first !== undefined && first !== null && first !== '') return first;
        if (second !== undefined && second !== null && second !== '') return second;
        return fallback;
      };
      const name = pick(
        source.name || source.column_name || source.columnName,
        dictionary.name || dictionary.column_name || dictionary.columnName,
        `column_${index + 1}`
      );
      return {
        ...dictionary,
        ...source,
        column_id: pick(
          source.column_id || source.columnId || source.id,
          dictionary.column_id || dictionary.columnId || dictionary.id,
          `${this.selectedObjectId}.${name}`
        ),
        name,
        column_name: name,
        data_type: pick(
          source.data_type || source.dataType || source.type || source.system_type,
          dictionary.data_type || dictionary.dataType || dictionary.type || dictionary.system_type,
          'unknown'
        ),
        max_length: pick(
          source.max_length ?? source.maxLength ?? source.character_maximum_length ?? source.length,
          dictionary.max_length ??
            dictionary.maxLength ??
            dictionary.character_maximum_length ??
            dictionary.length
        ),
        precision: pick(
          source.precision ?? source.numeric_precision,
          dictionary.precision ?? dictionary.numeric_precision
        ),
        scale: pick(
          source.scale ?? source.numeric_scale,
          dictionary.scale ?? dictionary.numeric_scale
        ),
        sensitivity: pick(dictionary.sensitivity, source.sensitivity, ''),
        semantic_type: pick(
          dictionary.semantic_type || dictionary.semanticType,
          source.semantic_type || source.semanticType
        ),
        semantic_role: pick(
          dictionary.semantic_role || dictionary.semanticRole,
          source.semantic_role || source.semanticRole
        ),
        description: pick(dictionary.description, source.description, ''),
      };
    },
    columnDisplayName(column = {}) {
      return (
        column.column_name ||
        column.name ||
        column.columnName ||
        this.objectNameFromId(column.column_id || column.columnId || column.id) ||
        ''
      );
    },
    columnDataTypeLabel(column = {}) {
      const rawType = String(
        column.data_type || column.dataType || column.type || column.system_type || 'unknown'
      ).trim();
      const lowerType = rawType.toLowerCase();
      const rawLength =
        column.max_length ?? column.maxLength ?? column.character_maximum_length ?? column.length;
      const length = Number(rawLength);
      const precision = column.precision ?? column.numeric_precision;
      const scale = column.scale ?? column.numeric_scale;

      if (
        ['varchar', 'char', 'binary', 'varbinary'].includes(lowerType) &&
        Number.isFinite(length)
      ) {
        return `${rawType}(${length < 0 ? 'max' : length})`;
      }
      if (['varchar', 'char', 'binary', 'varbinary'].includes(lowerType)) {
        return `${rawType} (length not captured)`;
      }
      if (['nvarchar', 'nchar'].includes(lowerType) && Number.isFinite(length)) {
        return `${rawType}(${length < 0 ? 'max' : Math.max(1, Math.floor(length / 2))})`;
      }
      if (['nvarchar', 'nchar'].includes(lowerType)) {
        return `${rawType} (length not captured)`;
      }
      if (
        ['decimal', 'numeric'].includes(lowerType) &&
        precision !== null &&
        precision !== undefined &&
        precision !== ''
      ) {
        const precisionText = Number(precision);
        const scaleText = scale !== null && scale !== undefined && scale !== '' ? Number(scale) : 0;
        if (Number.isFinite(precisionText) && Number.isFinite(scaleText)) {
          return `${rawType}(${precisionText}, ${scaleText})`;
        }
      }
      if (['decimal', 'numeric'].includes(lowerType)) {
        return `${rawType} (precision/scale not captured)`;
      }
      return rawType || 'unknown';
    },
    columnSemanticLabel(column = {}) {
      if (column.semantic_type || column.semantic_role)
        return column.semantic_type || column.semantic_role;
      if (column.is_key) return 'key';
      if (column.is_identifier) return 'identifier';
      if (column.is_metric) return 'metric';
      if (column.is_dimension) return 'dimension';
      return '-';
    },
    lineagePayloadItems(payload = {}) {
      if (Array.isArray(payload)) return payload;
      if (Array.isArray(payload.data)) return payload.data;
      if (Array.isArray(payload.items)) return payload.items;
      if (Array.isArray(payload.nodes)) return payload.nodes;
      return [];
    },
    lineageReferenceItems(value) {
      if (!value) return [];
      const values = Array.isArray(value) ? value : [value];
      return values
        .map((entry) => {
          if (!entry) return null;
          if (typeof entry === 'string') return { id: entry };
          if (typeof entry === 'object') {
            const id =
              entry.id ||
              entry.object_id ||
              entry.objectId ||
              entry.source ||
              entry.target ||
              entry.name;
            return id ? { ...entry, id } : null;
          }
          return null;
        })
        .filter(Boolean);
    },
    curatedAssetLineageItems(direction, item = this.selectedObjectDetail) {
      if (!item) return [];
      const fields =
        direction === 'upstream' ? ['depends_on', 'created_by', 'created_via'] : ['used_by'];
      const byId = new Map();
      fields.forEach((field) => {
        this.lineageReferenceItems(item[field]).forEach((entry) => {
          if (!byId.has(entry.id)) byId.set(entry.id, entry);
        });
      });
      this.assetLineageItems(direction).forEach((entry) => {
        const id = entry?.id || entry?.object_id || entry?.objectId;
        if (id && byId.has(id)) byId.set(id, { ...entry, id });
      });
      return Array.from(byId.values());
    },
    assetLineageItems(direction) {
      const payload =
        direction === 'upstream' ? this.lineageRaw?.upstream : this.lineageRaw?.downstream;
      return this.lineagePayloadItems(payload);
    },
    assetLineageCount(direction, item = this.selectedObjectDetail) {
      const curated = this.curatedAssetLineageItems(direction, item);
      if (curated.length) return curated.length;
      const fallbackCount =
        direction === 'upstream'
          ? Number(item?.upstreamCount ?? item?.upstream_count ?? 0)
          : Number(item?.downstreamCount ?? item?.downstream_count ?? 0);
      if (Number.isFinite(fallbackCount) && fallbackCount > 0) return fallbackCount;
      return item === this.selectedObjectDetail ? this.assetLineageItems(direction).length : 0;
    },
    assetLineagePreview(direction) {
      const curated = this.curatedAssetLineageItems(direction);
      return (curated.length ? curated : this.assetLineageItems(direction)).slice(0, 5);
    },
    reviewWorkWarningQueues() {
      return this.reviewWorkQueues().map((queue) => ({
        key: queue.key,
        label: queue.label,
        count: queue.items.length,
        reason: queue.description,
        view: queue.primaryView,
      }));
    },
    reviewWorkQueues() {
      const tasks = this.governanceOps.tasks || [];
      const incidents = this.governanceOps.incidents || [];
      const publicationChecks = this.governanceOps.publication?.checks || [];
      const ownershipAlerts = this.governanceOps.stewardPortfolio?.alerts || [];
      const openTasks = tasks.filter((task) => !['done', 'canceled'].includes(task.status));
      const itemFromTask = (task, defaults = {}) => ({
        id:
          task.taskId ||
          task.id ||
          `${defaults.key || 'task'}-${task.assetId || task.asset_id || task.title}`,
        title: task.title || defaults.title || 'Review governance task',
        assetId: task.assetId || task.asset_id || defaults.assetId || '',
        status: task.status || defaults.status || 'open',
        severity: task.severity || defaults.severity || 'warning',
        owner:
          task.owner ||
          task.steward ||
          task.assignee ||
          task.assignedTo ||
          defaults.owner ||
          'Unassigned',
        due:
          task.dueDate ||
          task.due_at ||
          task.due ||
          task.targetDate ||
          defaults.due ||
          'No due date',
        nextAction: defaults.nextAction || 'Open owning workflow',
        primaryView: defaults.primaryView || 'governanceOps',
        secondaryView: defaults.secondaryView || '',
      });
      const itemFromIncident = (incident, defaults = {}) => ({
        id:
          incident.incidentId ||
          incident.id ||
          `${defaults.key || 'incident'}-${incident.assetId || incident.title}`,
        title: incident.title || defaults.title || 'Review governance incident',
        assetId: incident.assetId || incident.asset_id || defaults.assetId || '',
        status: incident.status || defaults.status || 'open',
        severity: incident.severity || defaults.severity || 'warning',
        owner:
          incident.owner ||
          incident.steward ||
          incident.assignee ||
          incident.assignedTo ||
          defaults.owner ||
          'Unassigned',
        due:
          incident.dueDate ||
          incident.due_at ||
          incident.due ||
          incident.targetDate ||
          defaults.due ||
          'No due date',
        nextAction: defaults.nextAction || 'Open owning workflow',
        primaryView: defaults.primaryView || 'governanceOps',
        secondaryView: defaults.secondaryView || '',
      });

      const failedProfileItems = [
        ...openTasks
          .filter((task) => /profile|quality/i.test(`${task.title || ''} ${task.type || ''}`))
          .map((task) =>
            itemFromTask(task, {
              key: 'failed-profile',
              nextAction: 'Open schedule or run details in Profiling',
              primaryView: 'scheduler',
            })
          ),
        ...incidents
          .filter((incident) =>
            /profile|quality/i.test(`${incident.title || ''} ${incident.type || ''}`)
          )
          .map((incident) =>
            itemFromIncident(incident, {
              key: 'failed-profile-incident',
              nextAction: 'Open Profiling to inspect the failing run',
              primaryView: 'scheduler',
            })
          ),
      ];

      const failedLineageItems = [
        ...openTasks
          .filter((task) =>
            /lineage|dependency|graph/i.test(`${task.title || ''} ${task.type || ''}`)
          )
          .map((task) =>
            itemFromTask(task, {
              key: 'failed-lineage',
              nextAction: 'Open Search and explore the asset lineage',
              primaryView: 'browse',
              secondaryView: 'import',
            })
          ),
        ...incidents
          .filter((incident) =>
            /lineage|dependency|graph/i.test(`${incident.title || ''} ${incident.type || ''}`)
          )
          .map((incident) =>
            itemFromIncident(incident, {
              key: 'failed-lineage-incident',
              nextAction: 'Open Search and explore the asset lineage',
              primaryView: 'browse',
              secondaryView: 'import',
            })
          ),
        ...publicationChecks
          .filter(
            (check) => check.status === 'fail' && /lineage|dependency|graph/i.test(check.name || '')
          )
          .map((check) => ({
            id: `pub-${check.name}`,
            title: check.name,
            assetId: '',
            status: check.status,
            severity: 'warning',
            nextAction: 'Open Lineage Acquisition if evidence is stale',
            primaryView: 'import',
            secondaryView: 'discovery',
          })),
      ];

      const suspiciousLineageItems = [
        ...ownershipAlerts.map((alert) => ({
          id: `alert-${alert.assetId}-${alert.message}`,
          title: alert.message || 'Review low-confidence asset context',
          assetId: alert.assetId || '',
          status: alert.severity || 'warning',
          severity: alert.severity || 'warning',
          owner: alert.owner || alert.steward || 'Unassigned',
          due: alert.dueDate || alert.due_at || 'No due date',
          nextAction: 'Open Search / Catalog to inspect confidence reasons',
          primaryView: 'browse',
          secondaryView: 'discovery',
        })),
        ...incidents
          .filter((incident) =>
            /trust|confidence|suspicious/i.test(
              `${incident.title || ''} ${incident.severity || ''}`
            )
          )
          .map((incident) =>
            itemFromIncident(incident, {
              key: 'suspicious-lineage',
              nextAction: 'Open Search and explore lineage evidence',
              primaryView: 'browse',
              secondaryView: 'import',
            })
          ),
      ];

      const fallbackTaskItems = openTasks.slice(0, 3).map((task) =>
        itemFromTask(task, {
          key: 'fallback-task',
          nextAction: 'Open the owning workflow listed on the task',
          primaryView: 'governanceOps',
        })
      );

      return [
        {
          key: 'failed-profiles',
          label: 'Failed Profiles',
          description: 'Profile and quality failures are reviewed here, then fixed in Profiling.',
          primaryView: 'scheduler',
          emptyText: 'No failed profile work items are currently queued.',
          items: failedProfileItems.length ? failedProfileItems : fallbackTaskItems,
        },
        {
          key: 'failed-lineage',
          label: 'Failed Lineage',
          description:
            'Lineage failures link to Search first, with Lineage Acquisition for stale evidence.',
          primaryView: 'browse',
          emptyText: 'No failed lineage work items are currently queued.',
          items: failedLineageItems,
        },
        {
          key: 'suspicious-lineage',
          label: 'Suspicious Lineage',
          description:
            'Suspicious or low-confidence lineage is reviewed as evidence, not operated from this page.',
          primaryView: 'import',
          emptyText: 'No suspicious lineage work items are currently queued.',
          items: suspiciousLineageItems,
        },
      ];
    },
    openReviewWorkItem(item = {}) {
      if (item.assetId) {
        this.selectedObjectId = item.assetId;
      }
      this.onViewChange(item.primaryView || 'governanceOps');
    },
    thresholdFromQualityEditor() {
      const { editor } = this.governance.qualityRules;
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
      const { editor } = this.governance.qualityRules;
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
      const target =
        rule ||
        this.governance.qualityRules.rules.find(
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
      let { scorecard } = this.governance.qualityRules;
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
        this.showToast(
          `Quality scorecard export ready (${payload.export?.content_type || format}).`
        );
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
        const payload = await this.api(
          `/api/v1/quality/profiles/${encodeURIComponent(target)}/trend`
        );
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
          ...this.governance.qualityRules.executions.filter(
            (item) => item.id !== payload.execution.id
          ),
        ];
        await this.buildQualityScorecard();
        await this.loadQualityRulesPanel();
        this.showToast(
          `Quality validation ${payload.execution.status}: ${payload.execution.failed} issue(s).`
        );
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
        const response = await this.api(
          `/api/v1/classification/rules/${encodeURIComponent(rule.id)}`,
          {
            method: 'DELETE',
          }
        );
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
    async chooseLineageObject(item, options = {}) {
      if (!item?.id) return;
      const shouldLoad = options.load !== false;
      this.selectedObjectId = item.id;
      this.lineageObjectSearch.query = item.id;
      this.lineageObjectSearch.open = false;
      if (item.database) {
        this.matrixDatabase = item.database;
      } else if (item.id.includes('.')) {
        const parts = item.id.split('.');
        this.matrixDatabase = (parts.length >= 4 ? parts[1] : parts[0]) || this.matrixDatabase;
      }
      if (shouldLoad) {
        await this.loadDiscovery();
      }
    },
    async chooseExactLineageObjectMatch() {
      const query = String(this.lineageObjectSearch.query || '')
        .trim()
        .toLowerCase();
      if (!query) return false;
      const exact = this.lineageObjectSearch.results.find(
        (item) => String(item.id || '').toLowerCase() === query
      );
      if (!exact) return false;
      await this.chooseLineageObject(exact, { load: false });
      return true;
    },
    async renderSelectedLineage() {
      if (!this.selectedObjectId && this.lineageObjectSearch.results.length === 1) {
        await this.chooseLineageObject(this.lineageObjectSearch.results[0], { load: false });
      }
      if (!this.selectedObjectId) {
        await this.chooseExactLineageObjectMatch();
      }
      if (!this.selectedObjectId && this.lineageObjectSearch.query) {
        await this.searchLineageObjects(this.lineageObjectSearch.query);
        if (await this.chooseExactLineageObjectMatch()) {
          // Exact typed object id selected.
        } else if (this.lineageObjectSearch.results.length === 1) {
          await this.chooseLineageObject(this.lineageObjectSearch.results[0], { load: false });
        }
      }
      if (!this.selectedObjectId) {
        this.showToast('Choose a catalog object before rendering lineage.');
        return;
      }
      await this.loadDiscovery();
    },
    async openSelectedObjectLineage(objectId = this.selectedObjectId) {
      const id = String(objectId || '').trim();
      if (!id) {
        this.showToast('Choose an asset before exploring lineage.');
        return;
      }
      this.selectedObjectId = id;
      this.lineageObjectSearch.query = id;
      this.showLineageEvidence = false;
      await this.onViewChange('discovery');
    },
    async toggleLineageEvidence() {
      this.showLineageEvidence = !this.showLineageEvidence;
      await nextTick();
      if (this.showLineageEvidence) {
        const target = document.getElementById('lineage-graph-drilldowns');
        if (target?.scrollIntoView) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        this.renderGraph();
      }
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
          text:
            this.lineageQuestionAnswer?.assistant?.message ||
            this.lineageQuestionAnswer?.plain_english ||
            '',
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
          title: 'Lineage Answer',
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
      const key = String(column || '')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '_')
        .replace(/^_|_$/g, '');
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
          title: 'Business Uses',
          match: (row) =>
            String(row.role || '')
              .toLowerCase()
              .includes('business consumer'),
        },
        {
          title: 'Maintenance Reads',
          match: (row) =>
            String(row.role || '')
              .toLowerCase()
              .includes('maintenance'),
        },
        {
          title: 'Load Jobs',
          match: (row) => /orchestrates|loads target/i.test(String(row.role || '')),
        },
        {
          title: 'Source Inputs & Lookups',
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
    selectedAssetLineageGroups(answer = this.lineageAnswer) {
      const answerGroups = this.lineageAnswerRoleGroups(answer);
      if (answerGroups.length) return answerGroups;

      const buildRows = (direction) =>
        this.assetLineageItems(direction).map((item) => ({
          ...item,
          label: item.name || this.objectNameFromId(item.id),
          location: this.catalogSourceLocation(item),
        }));

      const groups = [
        { title: 'Feeds This', rows: buildRows('upstream') },
        { title: 'Uses This', rows: buildRows('downstream') },
      ];
      return groups.filter((group) => group.rows.length);
    },
    lineageAnswerTableColumns(answer = this.lineageQuestionAnswer) {
      if (!answer) return [];
      if (answer.impacted_objects?.length) return ['Role', 'Object', 'Type', 'Location'];
      return answer.table?.columns || [];
    },
    lineageExplorerGroupPreview(group = {}) {
      const rows = group.rows || [];
      if (!rows.length) return 'No objects in this group.';
      const preview = rows
        .slice(0, 3)
        .map((row) => row.label || row.id)
        .join(', ');
      const remaining = rows.length - 3;
      return remaining > 0 ? `${preview}, and ${remaining} more` : preview;
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
          this.persistProfileOpsFocus();
        }
        if (
          !this.integrations.profileRunEditor.connectorId &&
          this.integrations.managedConnectors.length
        ) {
          this.integrations.profileRunEditor.connectorId = this.integrations.selectedConnectorId;
        }
        if (
          !this.integrations.connectorGrant.connectorId &&
          this.integrations.managedConnectors.length
        ) {
          this.integrations.connectorGrant.connectorId = this.integrations.managedConnectors[0].id;
        }
        if (
          !this.integrations.profileScheduleEditor.connectorId &&
          this.integrations.managedConnectors.length
        ) {
          this.integrations.profileScheduleEditor.connectorId =
            this.integrations.managedConnectors[0].id;
        }
        this.syncConnectorCredentialMode();
        this.hydrateConnectorEditorFromDefinition();
        this.initializeProfileScheduleEditor();
        await this.loadProfileSchedules();
      } catch (err) {
        this.showToast(`Managed connector load failed: ${err.message}`);
      } finally {
        this.integrations.connectorLoading = false;
      }
    },
    connectorWizardFieldVisible(field = {}) {
      const { credentialMode } = this.integrations.connectorEditor;
      if (
        Array.isArray(field.show_for_modes) &&
        field.show_for_modes.length &&
        !field.show_for_modes.includes(credentialMode)
      ) {
        return false;
      }
      if (Array.isArray(field.hide_for_modes) && field.hide_for_modes.includes(credentialMode)) {
        return false;
      }
      return true;
    },
    connectorFieldInputType(field = {}) {
      if (field.input === 'password') return 'password';
      if (field.input === 'number') return 'number';
      return 'text';
    },
    connectorFieldItems(field = {}) {
      return Array.isArray(field.options) ? field.options : [];
    },
    connectorFieldValue(key, fallback = '') {
      const value = this.integrations.connectorEditor.formValues?.[key];
      return value === undefined || value === null ? fallback : value;
    },
    connectorEditorFieldError(key) {
      const editor = this.integrations.connectorEditor;
      if (key === 'id' && !String(editor.id || '').trim()) return 'Connection ID is required.';
      if (key === 'label' && !String(editor.label || '').trim())
        return 'Display label is required.';
      return '';
    },
    connectorWizardFieldError(field = {}) {
      if (!field?.required) return '';
      const value = this.connectorFieldValue(field.key, field.input === 'toggle' ? false : '');
      if (field.input === 'toggle') return '';
      if (String(value || '').trim()) return '';
      return `${field.label} is required.`;
    },
    connectorCredentialFieldError(field = {}) {
      if (!field?.required) return '';
      const value = this.connectorFieldValue(field.key, '');
      if (String(value || '').trim()) return '';
      return `${field.label} is required.`;
    },
    connectorValidationChecklist() {
      const editor = this.integrations.connectorEditor;
      const items = [];
      if (!String(editor.id || '').trim()) items.push('Add a connection ID');
      if (!String(editor.label || '').trim()) items.push('Add a display label');
      if (!String(editor.type || '').trim()) items.push('Choose a connector type');
      this.visibleConnectorBasicFields.forEach((field) => {
        const error = this.connectorWizardFieldError(field);
        if (error) items.push(error);
      });
      this.connectorCredentialFields.forEach((field) => {
        const error = this.connectorCredentialFieldError(field);
        if (error) items.push(error);
      });
      if (
        this.integrations.connectorEditor.showAdvancedJson &&
        !this.connectorAdvancedConfigPreview
      ) {
        items.push('Advanced config JSON must be valid JSON.');
      }
      return items;
    },
    setConnectorFieldValue(key, value) {
      this.integrations.connectorEditor.formValues = {
        ...(this.integrations.connectorEditor.formValues || {}),
        [key]: value,
      };
      this.refreshConnectorConfigPreview();
    },
    connectorCredentialFieldsForMode(mode) {
      const normalized = String(mode || '').toLowerCase();
      const fieldSets = {
        windows_integrated: [],
        managed_identity: [
          {
            key: 'managed_identity_client_id',
            label: 'Managed identity client ID (optional)',
            input: 'text',
            target: 'credential',
            credential_key: 'client_id',
          },
        ],
        service_account: [
          {
            key: 'credential_username',
            label: 'Username',
            input: 'text',
            target: 'credential',
            credential_key: 'username',
          },
          {
            key: 'credential_password',
            label: 'Password',
            input: 'password',
            target: 'credential',
            credential_key: 'password',
          },
          {
            key: 'credential_secret_ref',
            label: 'Secret reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
            placeholder: 'kv://metadata/source-password',
          },
        ],
        secret_reference: [
          {
            key: 'credential_username',
            label: 'Username',
            input: 'text',
            target: 'credential',
            credential_key: 'username',
          },
          {
            key: 'credential_secret_ref',
            label: 'Secret reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
            placeholder: 'kv://metadata/source-password',
            required: true,
          },
        ],
        service_principal: [
          {
            key: 'credential_client_id',
            label: 'Client ID',
            input: 'text',
            target: 'credential',
            credential_key: 'client_id',
            required: true,
          },
          {
            key: 'credential_client_secret',
            label: 'Client secret',
            input: 'password',
            target: 'credential',
            credential_key: 'client_secret',
          },
          {
            key: 'credential_secret_ref',
            label: 'Secret reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
            placeholder: 'kv://metadata/client-secret',
          },
        ],
        delegated_oauth: [
          {
            key: 'credential_client_id',
            label: 'Client ID',
            input: 'text',
            target: 'credential',
            credential_key: 'client_id',
          },
          {
            key: 'credential_secret_ref',
            label: 'Token reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
            placeholder: 'kv://metadata/oauth-token',
          },
        ],
        oauth: [
          {
            key: 'credential_client_id',
            label: 'Client ID',
            input: 'text',
            target: 'credential',
            credential_key: 'client_id',
          },
          {
            key: 'credential_client_secret',
            label: 'Client secret',
            input: 'password',
            target: 'credential',
            credential_key: 'client_secret',
          },
          {
            key: 'credential_secret_ref',
            label: 'Secret reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
          },
        ],
        oauth_app: [
          {
            key: 'credential_client_id',
            label: 'App / client ID',
            input: 'text',
            target: 'credential',
            credential_key: 'client_id',
          },
          {
            key: 'credential_client_secret',
            label: 'App secret',
            input: 'password',
            target: 'credential',
            credential_key: 'client_secret',
          },
          {
            key: 'credential_secret_ref',
            label: 'Secret reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
          },
        ],
        api_client: [
          {
            key: 'credential_client_id',
            label: 'Client ID',
            input: 'text',
            target: 'credential',
            credential_key: 'client_id',
          },
          {
            key: 'credential_client_secret',
            label: 'Client secret',
            input: 'password',
            target: 'credential',
            credential_key: 'client_secret',
          },
          {
            key: 'credential_secret_ref',
            label: 'Secret reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
          },
        ],
        api_token_reference: [
          {
            key: 'credential_token',
            label: 'API token',
            input: 'password',
            target: 'credential',
            credential_key: 'token',
          },
          {
            key: 'credential_secret_ref',
            label: 'Token reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
            required: false,
          },
        ],
        api_key_reference: [
          {
            key: 'credential_api_key',
            label: 'API key',
            input: 'password',
            target: 'credential',
            credential_key: 'api_key',
          },
          {
            key: 'credential_secret_ref',
            label: 'API key reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
          },
        ],
        bearer_token_reference: [
          {
            key: 'credential_token',
            label: 'Bearer token',
            input: 'password',
            target: 'credential',
            credential_key: 'token',
          },
          {
            key: 'credential_secret_ref',
            label: 'Token reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
          },
        ],
        pat: [
          {
            key: 'credential_token',
            label: 'Personal access token',
            input: 'password',
            target: 'credential',
            credential_key: 'token',
          },
          {
            key: 'credential_secret_ref',
            label: 'PAT reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
          },
        ],
        pat_reference: [
          {
            key: 'credential_secret_ref',
            label: 'PAT reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
            required: true,
          },
        ],
        key_pair: [
          {
            key: 'credential_username',
            label: 'Username',
            input: 'text',
            target: 'credential',
            credential_key: 'username',
          },
          {
            key: 'credential_private_key',
            label: 'Private key',
            input: 'textarea',
            target: 'credential',
            credential_key: 'private_key',
          },
          {
            key: 'credential_secret_ref',
            label: 'Private key reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
          },
        ],
        sas_reference: [
          {
            key: 'credential_token',
            label: 'SAS token',
            input: 'password',
            target: 'credential',
            credential_key: 'token',
          },
          {
            key: 'credential_secret_ref',
            label: 'SAS reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
          },
        ],
        ssh_key_reference: [
          {
            key: 'credential_secret_ref',
            label: 'SSH key reference',
            input: 'text',
            target: 'credential',
            credential_key: 'secret_ref',
            required: true,
          },
        ],
        none: [],
      };
      return fieldSets[normalized] || [];
    },
    splitSqlServerEndpoint(serverValue = '') {
      const text = String(serverValue || '').trim();
      if (!text) return { host: '', instance: '', port: '' };
      const [hostAndInstance, portPart] = text.split(',');
      const slashIndex = hostAndInstance.indexOf('\\');
      return {
        host: slashIndex >= 0 ? hostAndInstance.slice(0, slashIndex) : hostAndInstance,
        instance: slashIndex >= 0 ? hostAndInstance.slice(slashIndex + 1) : '',
        port: portPart || '',
      };
    },
    hydrateConnectorEditorFromDefinition(definition = null, connector = null) {
      const editor = this.integrations.connectorEditor;
      const activeDefinition = definition || this.selectedConnectorDefinition;
      const wizard = activeDefinition?.wizard || {};
      const config = connector?.config || {};
      const credential = connector?.credential || {};
      const formValues = {};
      const populate = (field) => {
        if (field.config_group === 'sql_server_endpoint') {
          const endpoint = this.splitSqlServerEndpoint(
            config.server || config.serverName || config.dataSource || ''
          );
          formValues.server_host = endpoint.host;
          formValues.instance_name = endpoint.instance;
          if (!formValues.port && endpoint.port) formValues.port = endpoint.port;
          return;
        }
        const sourceKey = field.config_key;
        const value = config?.[sourceKey];
        if (field.value_format === 'newline_array') {
          formValues[field.key] = Array.isArray(value) ? value.join('\n') : value || '';
          return;
        }
        if (field.input === 'toggle') {
          formValues[field.key] = value === true;
          return;
        }
        formValues[field.key] = value ?? '';
      };
      [...(wizard.basic_fields || []), ...(wizard.advanced_fields || [])].forEach(populate);
      this.connectorCredentialFieldsForMode(editor.credentialMode).forEach((field) => {
        const value =
          credential?.values?.[field.credential_key] ?? credential?.[field.credential_key];
        formValues[field.key] = value ?? '';
      });
      if (credential?.secret_ref) {
        formValues.credential_secret_ref = credential.secret_ref;
      }
      editor.formValues = formValues;
      editor.metadataTargets = Array.isArray(connector?.metadata_targets)
        ? [...connector.metadata_targets]
        : [...(activeDefinition?.metadata || [])];
      editor.availableDatabases = [];
      editor.discoveringDatabases = false;
      editor.databaseDiscoveryError = '';
      editor.configJson = JSON.stringify(config || {}, null, 2);
      editor.rawJsonEdited = false;
      editor.showAdvancedJson = false;
      editor.testSummary = null;
      editor.discoverySummary =
        connector?.id === this.integrations.connectorSnapshot?.connector_id
          ? this.integrations.connectorSnapshot
          : null;
      this.refreshConnectorConfigPreview();
    },
    refreshConnectorConfigPreview() {
      if (this.integrations.connectorEditor.rawJsonEdited) return;
      this.integrations.connectorEditor.configJson = JSON.stringify(
        this.buildConnectorConfigFromWizard(),
        null,
        2
      );
    },
    buildConnectorConfigFromWizard() {
      const config = {};
      const applyField = (field) => {
        if (!this.connectorWizardFieldVisible(field)) return;
        if (field.config_group === 'sql_server_endpoint') return;
        const raw = this.connectorFieldValue(field.key, field.input === 'toggle' ? false : '');
        if (field.input === 'toggle') {
          if (raw === true) config[field.config_key] = true;
          return;
        }
        if (field.value_format === 'newline_array') {
          const values = String(raw || '')
            .split(/\r?\n/)
            .map((value) => value.trim())
            .filter(Boolean);
          if (values.length) config[field.config_key] = values;
          return;
        }
        if (raw !== '' && raw !== null && raw !== undefined) {
          config[field.config_key] = field.input === 'number' ? Number(raw) : raw;
        }
      };
      [
        ...this.selectedConnectorWizard.basic_fields,
        ...this.selectedConnectorWizard.advanced_fields,
      ].forEach(applyField);
      const host = this.connectorFieldValue('server_host', '').trim();
      const instance = this.connectorFieldValue('instance_name', '').trim();
      const serverPort = this.connectorFieldValue('port', '').trim();
      if (host) {
        const base = instance ? `${host}\\${instance}` : host;
        config.server = serverPort && !config.port ? `${base},${serverPort}` : base;
      }
      return config;
    },
    buildConnectorCredentialFromWizard() {
      const editor = this.integrations.connectorEditor;
      const credential = { mode: editor.credentialMode };
      this.connectorCredentialFields.forEach((field) => {
        const value = this.connectorFieldValue(field.key, '');
        if (value !== '' && value !== null && value !== undefined) {
          credential[field.credential_key] = value;
        }
      });
      if (!credential.secret_ref && editor.secretRef) credential.secret_ref = editor.secretRef;
      if (!credential.secret && editor.rawSecret) credential.secret = editor.rawSecret;
      return credential;
    },
    wizardSqlDiscoveryPayload() {
      const editor = this.integrations.connectorEditor;
      const credential = this.buildConnectorCredentialFromWizard();
      const authenticationMap = {
        windows_integrated: 'windows',
        service_account: 'sql-server',
        secret_reference: 'sql-server',
        managed_identity: 'azure-ad',
      };
      return {
        server: this.buildConnectorConfigFromWizard().server || '',
        port: Number(this.connectorFieldValue('port', 1433)) || 1433,
        database: 'master',
        authentication: authenticationMap[editor.credentialMode] || 'sql-server',
        useIntegratedAuth: editor.credentialMode === 'windows_integrated',
        username: credential.username || '',
        password: credential.password || credential.secret || '',
        domain: credential.domain || '',
        clientId: credential.client_id || '',
        clientSecret: credential.client_secret || credential.secret || '',
        tenantId: credential.tenant_id || '',
        encrypt: this.connectorFieldValue('encrypt', true) !== false,
        trustServerCertificate: this.connectorFieldValue('trustServerCertificate', false) === true,
      };
    },
    canDiscoverWizardDatabases() {
      const editor = this.integrations.connectorEditor;
      if (!(editor.type === 'sql_server' || editor.type === 'ssis')) return false;
      const server = this.buildConnectorConfigFromWizard().server || '';
      if (!server) return false;
      if (editor.credentialMode === 'windows_integrated') return true;
      if (
        editor.credentialMode === 'service_account' ||
        editor.credentialMode === 'secret_reference'
      ) {
        return (
          Boolean(this.connectorFieldValue('credential_username', '').trim()) &&
          Boolean((this.connectorFieldValue('credential_password', '') || editor.rawSecret).trim())
        );
      }
      return false;
    },
    async refreshWizardDatabases({ silent = false } = {}) {
      if (!this.canDiscoverWizardDatabases()) {
        if (!silent)
          this.showToast('Enter server and authentication details before refreshing databases.');
        return;
      }
      try {
        this.integrations.connectorEditor.discoveringDatabases = true;
        this.integrations.connectorEditor.databaseDiscoveryError = '';
        const payload = await this.api('/api/v1/ingestion/connect-sql-server/databases', {
          method: 'POST',
          body: JSON.stringify(this.wizardSqlDiscoveryPayload()),
        });
        const databases = (payload?.data?.databases || []).map((db) => ({ title: db, value: db }));
        this.integrations.connectorEditor.availableDatabases = databases;
        const currentDatabase = this.connectorFieldValue('database', '');
        if (currentDatabase && !databases.some((db) => db.value === currentDatabase)) {
          this.setConnectorFieldValue('database', '');
        }
        if (!silent) {
          this.showToast(
            databases.length
              ? `Discovered ${databases.length} database(s).`
              : 'No databases were found. You can still type a database name manually.'
          );
        }
      } catch (err) {
        this.integrations.connectorEditor.availableDatabases = [];
        this.integrations.connectorEditor.databaseDiscoveryError = err.message;
        if (!silent) this.showToast(`Database discovery failed: ${err.message}`);
      } finally {
        this.integrations.connectorEditor.discoveringDatabases = false;
      }
    },
    resetConnectorEditor() {
      this.integrations.connectorEditor = {
        ...this.integrations.connectorEditor,
        id: '',
        type: '',
        label: '',
        description: '',
        configJson: '{}',
        credentialMode: 'secret_reference',
        secretRef: '',
        rawSecret: '',
        draftMode: true,
        lastResetAt: new Date().toISOString(),
        availableDatabases: [],
        discoveringDatabases: false,
        databaseDiscoveryError: '',
        wizardStep: 0,
        showAdvancedJson: false,
        rawJsonEdited: false,
        metadataTargets: [],
        formValues: {},
        testSummary: null,
        discoverySummary: null,
        lastValidationAt: null,
      };
      this.syncConnectorCredentialMode();
      this.hydrateConnectorEditorFromDefinition();
      this.integrations.connectorWorkflowTab = 'connection';
      this.showToast('Started a new blank connector draft.');
    },
    parseAdvancedConnectorConfig() {
      try {
        return JSON.parse(this.integrations.connectorEditor.configJson || '{}');
      } catch (_err) {
        this.showToast('Advanced config JSON must be valid JSON.');
        return null;
      }
    },
    connectorDiscoveryHeadline() {
      const summary = this.integrations.connectorEditor.discoverySummary?.summary || {};
      const count =
        summary.object_count ??
        this.integrations.connectorEditor.testSummary?.summary?.discovered_objects ??
        0;
      if (!count) return 'Run a connection test to capture discovery details.';
      const streams = summary.streams?.length
        ? `${summary.streams.length} stream${summary.streams.length === 1 ? '' : 's'}`
        : null;
      return [`${count} discovered object${count === 1 ? '' : 's'}`, streams]
        .filter(Boolean)
        .join(' across ');
    },
    connectorTestErrors() {
      return (this.integrations.connectorEditor.testSummary?.errors || [])
        .map((error) => error?.message || error?.code)
        .filter(Boolean)
        .slice(0, 5);
    },
    connectorTestErrorMeta() {
      const first = this.integrations.connectorEditor.testSummary?.errors?.[0] || null;
      if (!first) return [];
      return [
        ['Error Code', first.code],
        ['Phase', first.phase],
        ['Status', first.status],
      ].filter(([, value]) => value !== undefined && value !== null && value !== '');
    },
    connectorTestHealth() {
      const summary = this.integrations.connectorEditor.testSummary?.summary || {};
      return {
        config:
          this.integrations.connectorEditor.id && this.integrations.connectorEditor.type
            ? 'Ready'
            : 'Incomplete',
        connection: summary.live_connection_valid
          ? 'Passed'
          : this.integrations.connectorEditor.testSummary
            ? 'Failed'
            : 'Pending',
        discovery: summary.metadata_discovery_valid
          ? 'Passed'
          : this.integrations.connectorEditor.testSummary
            ? 'Blocked'
            : 'Pending',
      };
    },
    formatDiagnosticValue(value) {
      if (value === undefined || value === null || value === '') return '-';
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      if (Array.isArray(value)) return value.length ? value.join(', ') : '-';
      if (typeof value === 'object') return JSON.stringify(value);
      return String(value);
    },
    connectorTestActionableError(connectorId) {
      const state = this.connectorRowTestState(connectorId);
      const test = state.test || {};
      return (
        test.diagnostics?.actionable_error ||
        test.errors?.[0] ||
        (state.error
          ? {
              code: test.code || state.code || 'CONNECTOR_TEST_FAILED',
              message: state.error,
              remediation: test.remediation || state.remediation,
              phase: test.phase || state.phase,
              details: test.details || state.details,
            }
          : null)
      );
    },
    connectorTestDiagnosticPairs(connectorId) {
      const state = this.connectorRowTestState(connectorId);
      const test = state.test || {};
      const summary = test.summary || {};
      const diagnostics = test.diagnostics || {};
      const details = summary.connection_details || diagnostics.details || {};
      const saved =
        (this.integrations.managedConnectors || []).find(
          (connector) => connector.id === connectorId
        ) || {};
      const config = saved.config || {};
      const firstError = this.connectorTestActionableError(connectorId);
      return [
        ['Result', state.loading ? 'Testing' : test.status || state.status],
        [
          'Elapsed',
          summary.elapsed_ms !== undefined
            ? `${summary.elapsed_ms} ms`
            : diagnostics.elapsed_ms !== undefined
              ? `${diagnostics.elapsed_ms} ms`
              : null,
        ],
        [
          'Server',
          summary.server ||
            diagnostics.server ||
            details.server_name ||
            config.server ||
            config.host,
        ],
        [
          'Database / catalog',
          summary.database ||
            diagnostics.database ||
            details.database_name ||
            config.database ||
            config.catalog ||
            config.catalogDatabase,
        ],
        [
          'Login / user',
          summary.login ||
            diagnostics.login ||
            details.login_name ||
            details.runtime_process_identity ||
            diagnostics.user,
        ],
        ['Connector', summary.connector_id || test.connector_id || connectorId],
        ['Type', summary.connector_type || test.connector_type || saved.type],
        ['Phase', summary.phase || diagnostics.phase || firstError?.phase],
      ].filter(([, value]) => value !== undefined && value !== null && value !== '');
    },
    connectorTestActionablePairs(connectorId) {
      const error = this.connectorTestActionableError(connectorId);
      if (!error) return [];
      return [
        ['Code', error.code],
        ['Message', error.message],
        ['Remediation', error.remediation],
        ['Details', this.formatDiagnosticValue(error.details)],
      ].filter(
        ([, value]) => value !== undefined && value !== null && value !== '' && value !== '-'
      );
    },
    connectorIntelligentName(connector = {}) {
      if (connector.label) return connector.label;
      const config = connector.config || {};
      const typeLabel = this.connectorDefinitionLabel(connector.type || '').replace(
        /\s*\([^)]*\)\s*$/,
        ''
      );
      if (connector.type === 'ssis' && config.server) return `${config.server} - SSIS`;
      if (config.server && config.database) return `${config.server} - ${config.database}`;
      if (config.workspace) return `${config.workspace} - Reports`;
      if (config.account || config.bucket || config.container) {
        return [typeLabel, config.account || config.bucket || config.container]
          .filter(Boolean)
          .join(' - ');
      }
      return connector.id || 'Unnamed connection';
    },
    connectorInventoryStatus(connector = {}) {
      const rowState = this.connectorRowTestState(connector.id);
      if (connector.disabled === true || connector.status === 'disabled') return 'Disabled';
      if (rowState.loading || rowState.status === 'testing') return 'Testing';
      if (['succeeded', 'success', 'passed'].includes(rowState.status)) return 'Passed';
      if (rowState.status === 'failed') return 'Failed';
      if (!connector.credential?.status && !connector.credential?.mode) return 'Access Restricted';
      return 'Untested';
    },
    connectorLoginCheck(connector = {}) {
      const rowState = this.connectorRowTestState(connector.id);
      const summary = rowState.test?.summary || {};
      if (rowState.loading || rowState.status === 'testing') return 'Testing';
      if (summary.live_connection_valid === true) return 'Passed';
      if (rowState.status === 'failed' || summary.live_connection_valid === false) return 'Failed';
      return 'Untested';
    },
    connectorDiscoveryCheck(connector = {}) {
      const rowState = this.connectorRowTestState(connector.id);
      const summary = rowState.test?.summary || {};
      if (rowState.loading || rowState.status === 'testing') return 'Testing';
      if (summary.metadata_discovery_valid === true) return 'Passed';
      if (rowState.status === 'failed' || summary.metadata_discovery_valid === false)
        return 'Failed';
      return 'Untested';
    },
    connectorInventoryStatusColor(status) {
      if (status === 'Passed') return 'success';
      if (status === 'Failed' || status === 'Disabled' || status === 'Access Restricted')
        return 'error';
      if (status === 'Testing') return 'info';
      return 'warning';
    },
    connectorEditorSavedRecord() {
      return (
        (this.integrations.managedConnectors || []).find(
          (connector) => connector.id === this.integrations.connectorEditor.id
        ) || null
      );
    },
    connectorTestDetailPairs() {
      const details =
        this.integrations.connectorEditor.testSummary?.summary?.connection_details || {};
      const saved = this.connectorEditorSavedRecord();
      const config = saved?.config || {};
      return [
        ['Server', details.server_name || config.server],
        ['Resolved Endpoint', details.resolved_endpoint],
        ['Instance', details.instance],
        ['Database', details.database_name || config.database],
        ['Login', details.login_name],
        ['Runtime Identity', details.runtime_process_identity],
        ['Runtime Host', details.runtime_process_host],
        ['Connection Variant', details.connection_variant],
        [
          'Credential Mode',
          details.credential_mode ||
            saved?.credential?.mode ||
            this.integrations.connectorEditor.credentialMode,
        ],
      ].filter(([, value]) => value);
    },
    connectorRowTestState(connectorId) {
      return this.integrations.connectorTestStates?.[connectorId] || {};
    },
    setConnectorRowTestState(connectorId, state) {
      this.integrations.connectorTestStates = {
        ...(this.integrations.connectorTestStates || {}),
        [connectorId]: {
          ...(this.integrations.connectorTestStates?.[connectorId] || {}),
          ...state,
        },
      };
    },
    connectorSavedConfigPairs() {
      const saved = this.connectorEditorSavedRecord();
      const config = saved?.config || {};
      return [
        ['Saved Server', config.server],
        ['Saved Database', config.database],
        ['Saved Port', config.port],
      ].filter(([, value]) => value !== undefined && value !== null && value !== '');
    },
    buildConnectorSavePayload() {
      const editor = this.integrations.connectorEditor;
      const advancedConfig = this.parseAdvancedConnectorConfig();
      if (!advancedConfig) return null;
      const generatedConfig = this.buildConnectorConfigFromWizard();
      return {
        id: editor.id,
        type: editor.type,
        label: editor.label,
        description: editor.description,
        metadata_targets:
          Array.isArray(editor.metadataTargets) && editor.metadataTargets.length
            ? editor.metadataTargets
            : this.selectedConnectorDefinition?.metadata || [],
        config: {
          ...advancedConfig,
          ...generatedConfig,
        },
        credential: this.buildConnectorCredentialFromWizard(),
      };
    },
    onConnectorTypeChanged() {
      const editor = this.integrations.connectorEditor;
      editor.wizardStep = 0;
      editor.rawSecret = '';
      editor.testSummary = null;
      editor.discoverySummary = null;
      editor.availableDatabases = [];
      editor.discoveringDatabases = false;
      editor.databaseDiscoveryError = '';
      this.syncConnectorCredentialMode();
      this.hydrateConnectorEditorFromDefinition(this.selectedConnectorDefinition);
    },
    connectorWizardCanAdvance() {
      const editor = this.integrations.connectorEditor;
      const step = this.currentConnectorWizardStep?.key;
      if (step === 'type') return Boolean(editor.type);
      if (step === 'connection') {
        return this.visibleConnectorBasicFields.every(
          (field) => !this.connectorWizardFieldError(field)
        );
      }
      if (step === 'auth') {
        return this.connectorCredentialFields.every(
          (field) => !this.connectorCredentialFieldError(field)
        );
      }
      return true;
    },
    async advanceConnectorWizard() {
      if (!this.connectorWizardCanAdvance()) {
        this.showToast('Complete the required fields before moving to the next step.');
        return;
      }
      const nextStepIndex = Math.min(
        this.integrations.connectorEditor.wizardStep + 1,
        this.connectorWizardStepDefinitions.length - 1
      );
      this.integrations.connectorEditor.wizardStep = nextStepIndex;
    },
    goToConnectorWizardStep(index) {
      const targetIndex = Math.max(
        0,
        Math.min(index, this.connectorWizardStepDefinitions.length - 1)
      );
      const currentIndex = this.integrations.connectorEditor.wizardStep || 0;
      if (targetIndex <= currentIndex) {
        this.integrations.connectorEditor.wizardStep = targetIndex;
        return;
      }
      if (!this.connectorWizardCanAdvance()) {
        this.showToast('Complete the required fields before moving to the next step.');
        return;
      }
      this.integrations.connectorEditor.wizardStep = targetIndex;
    },
    backConnectorWizard() {
      this.integrations.connectorEditor.wizardStep = Math.max(
        this.integrations.connectorEditor.wizardStep - 1,
        0
      );
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
        execution_mode: 'live',
        dry_run: false,
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
      payload.auto_publish = editor.autoPublish === true;
      payload.auto_publish_targets =
        editor.autoPublish === true
          ? Array.isArray(editor.publishTargets) && editor.publishTargets.length
            ? editor.publishTargets
            : ['devops']
          : [];
      return payload;
    },
    profilePageIssueMessage(err, fallback) {
      return err?.remediation || err?.message || fallback || 'Profiling data is not available.';
    },
    upsertProfilePageIssue(key, message, details = '') {
      const issue = {
        key,
        message,
        details,
        timestamp: new Date().toISOString(),
      };
      this.integrations.profilePageIssues = [
        issue,
        ...(this.integrations.profilePageIssues || []).filter((item) => item.key !== key),
      ].slice(0, 5);
    },
    clearProfilePageIssue(key) {
      this.integrations.profilePageIssues = (this.integrations.profilePageIssues || []).filter(
        (item) => item.key !== key
      );
    },
    clearProfilePageIssues() {
      this.integrations.profilePageIssues = [];
    },
    async loadProfileSchedules() {
      try {
        this.integrations.profileScheduleLoading = true;
        const payload = await this.api('/api/v1/connectors/profile-schedules');
        this.integrations.profileSchedules = (payload.schedules || []).filter(
          (schedule) => schedule && typeof schedule === 'object'
        );
        this.clearProfilePageIssue('schedules');
        await this.loadProfileSchedulerStatus();
        const preferredScheduleId = this.preferredProfileScheduleId;
        if (preferredScheduleId) await this.loadProfileScheduleQueuePreview(preferredScheduleId);
      } catch (err) {
        const message = this.profilePageIssueMessage(err, 'Profile schedule load failed.');
        this.upsertProfilePageIssue('schedules', 'Profile schedules could not be loaded.', message);
        this.showToast(`Profile schedule load failed: ${message}`);
      } finally {
        this.integrations.profileScheduleLoading = false;
      }
    },
    async loadProfileSchedulerStatus() {
      try {
        const payload = await this.api('/api/v1/connectors/profile-schedules/status');
        this.integrations.profileSchedulerStatus = payload.scheduler || null;
        this.clearProfilePageIssue('scheduler-status');
      } catch (err) {
        const message = this.profilePageIssueMessage(err, 'Scheduler status is not available.');
        this.upsertProfilePageIssue(
          'scheduler-status',
          'Profile scheduler status could not be checked.',
          message
        );
        this.integrations.profileSchedulerStatus = {
          running: false,
          enabled: false,
          last_error: { message },
        };
      }
    },
    async loadProfileScheduleRuns(scheduleId) {
      if (!scheduleId) return;
      try {
        const payload = await this.api(
          `/api/v1/connectors/profile-schedules/${encodeURIComponent(scheduleId)}/runs?limit=25`
        );
        this.integrations.profileScheduleRuns = payload.runs || [];
        this.integrations.profileScheduleRunScheduleId = scheduleId;
      } catch (err) {
        this.showToast(`Schedule history load failed: ${err.message}`);
      }
    },
    async loadProfileScheduleQueuePreview(scheduleId) {
      if (!scheduleId) return;
      try {
        this.integrations.profileQueueLoading = true;
        const payload = await this.api(
          `/api/v1/connectors/profile-schedules/${encodeURIComponent(scheduleId)}/queue?limit=25&history_limit=10`
        );
        this.integrations.profileQueuePreview = payload.preview || null;
        this.integrations.profileQueueScheduleId = scheduleId;
        if (payload.preview?.schedule?.connector_id) {
          this.integrations.selectedConnectorId = payload.preview.schedule.connector_id;
        }
        this.clearProfilePageIssue('queue-preview');
        this.persistProfileOpsFocus();
      } catch (err) {
        this.integrations.profileQueuePreview = null;
        if (/not found/i.test(String(err.message || ''))) {
          this.integrations.profileQueueScheduleId = '';
          this.integrations.profileQueuePreview = null;
          this.clearProfilePageIssue('queue-preview');
          this.persistProfileOpsFocus();
          return;
        }
        const message = this.profilePageIssueMessage(err, 'Queue preview is not available.');
        this.upsertProfilePageIssue(
          'queue-preview',
          'Selected queue detail could not be loaded.',
          message
        );
        this.showToast(`Queue preview failed: ${message}`);
      } finally {
        this.integrations.profileQueueLoading = false;
      }
    },
    async focusProfileSchedule(schedule) {
      const scheduleId = typeof schedule === 'string' ? schedule : schedule?.id;
      const scheduleConnectorId =
        typeof schedule === 'string'
          ? (this.integrations.profileSchedules || []).find((item) => item.id === schedule)
              ?.connector_id
          : schedule?.connector_id;
      if (!scheduleId) return;
      if (scheduleConnectorId) this.integrations.selectedConnectorId = scheduleConnectorId;
      this.persistProfileOpsFocus();
      await this.loadProfileScheduleQueuePreview(scheduleId);
      await this.loadProfileScheduleRuns(scheduleId);
      if (scheduleConnectorId) await this.loadManagedConnectorRuns(scheduleConnectorId);
    },
    async openRelatedProfilingQueueFromConnection() {
      const relatedSchedule =
        this.selectedConnectorActiveSchedule || this.selectedConnectorSchedules[0];
      this.integrations.schedulerOpsTab = relatedSchedule ? 'queues' : 'overview';
      if (relatedSchedule) {
        await this.focusProfileSchedule(relatedSchedule);
      } else if (this.selectedManagedConnector?.id) {
        this.integrations.selectedConnectorId = this.selectedManagedConnector.id;
        this.persistProfileOpsFocus();
      }
      this.onViewChange('scheduler');
    },
    openProfileOperatorTools() {
      if (this.profileOperatorToolsOpen) {
        this.integrations.schedulerOpsTab = 'overview';
        return;
      }
      this.integrations.schedulerOpsTab = this.focusedProfileSchedule ? 'queues' : 'runNow';
    },
    openProfileScheduleEditor(reset = false) {
      if (reset) this.resetProfileScheduleEditor();
      this.integrations.profileScheduleEditorOpen = true;
    },
    closeProfileScheduleEditor() {
      this.integrations.profileScheduleEditorOpen = false;
      if (this.integrations.schedulerOpsTab === 'settings') {
        this.integrations.schedulerOpsTab = 'overview';
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
        const payload = await this.api('/api/v1/connectors/profile-schedules/worker/stop', {
          method: 'POST',
        });
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
      if (editor.dryRun === true) {
        this.showToast(
          'Recurring profile schedules cannot be saved as dry runs. Use Run Now for ad-hoc dry-run previews.'
        );
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
        if (payload.schedule?.id) await this.loadProfileScheduleQueuePreview(payload.schedule.id);
        this.closeProfileScheduleEditor();
        this.showToast(editor.id ? 'Profile schedule updated.' : 'Profile schedule created.');
      } catch (err) {
        this.showToast(`Profile schedule save failed: ${err.remediation || err.message}`);
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
      editor.dryRun = false;
      editor.assetIds = (schedule.options?.ids || []).join('\n');
      editor.coverageMode = schedule.options?.coverage_mode || 'all_objects';
      editor.includeViews = schedule.options?.include_views !== false;
      editor.livePriority = schedule.options?.live_priority || 'most_used_first';
      editor.maxLiveTables = Math.max(1, Number(schedule.options?.max_live_tables || 15));
      editor.autoPublish = schedule.options?.auto_publish === true;
      editor.publishTargets =
        Array.isArray(schedule.options?.auto_publish_targets) &&
        schedule.options.auto_publish_targets.length
          ? schedule.options.auto_publish_targets
          : ['devops'];
      await this.focusProfileSchedule(schedule);
      this.openProfileScheduleEditor(false);
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
        cadence: 'hourly',
        date: '',
        time: '',
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC',
        intervalMinutes: 60,
        maxFailures: 3,
        streams: '',
        dryRun: false,
        assetIds: '',
        coverageMode: 'all_objects',
        includeViews: true,
        livePriority: 'most_used_first',
        maxLiveTables: 15,
        autoPublish: true,
        publishTargets: ['devops'],
      };
      this.initializeProfileScheduleEditor(true);
      this.integrations.profileScheduleRuns = [];
      this.integrations.profileScheduleRunScheduleId = '';
      this.integrations.profileQueuePreview = null;
      this.integrations.profileQueueScheduleId = '';
      this.persistProfileOpsFocus();
    },
    async runProfileSchedule(scheduleId) {
      try {
        this.integrations.profileScheduleLoading = true;
        const payload = await this.api(
          `/api/v1/connectors/profile-schedules/${encodeURIComponent(scheduleId)}/run`,
          {
            method: 'POST',
          }
        );
        this.integrations.profileScheduleResult = payload.result || null;
        await this.loadProfileSchedules();
        await this.loadProfileScheduleRuns(scheduleId);
        await this.loadProfileScheduleQueuePreview(scheduleId);
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
        if (this.integrations.profileQueueScheduleId) {
          await this.loadProfileScheduleQueuePreview(this.integrations.profileQueueScheduleId);
        }
        this.showToast(
          `Scheduler tick processed ${payload.result?.due_count || 0} due schedule(s).`
        );
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
        if (this.integrations.profileScheduleEditor.id === scheduleId)
          this.resetProfileScheduleEditor();
        if (this.integrations.profileScheduleRunScheduleId === scheduleId) {
          this.integrations.profileScheduleRuns = [];
          this.integrations.profileScheduleRunScheduleId = '';
        }
        if (this.integrations.profileQueueScheduleId === scheduleId) {
          this.integrations.profileQueuePreview = null;
          this.integrations.profileQueueScheduleId = '';
          this.persistProfileOpsFocus();
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
    profileQueueNumber(value) {
      const number = Number(value);
      return Number.isFinite(number) ? number : null;
    },
    profileQueueDisplayCount(value) {
      const number = this.profileQueueNumber(value);
      return number === null ? 'Unknown' : number.toLocaleString();
    },
    profileQueueRunForSchedule(schedule = {}) {
      if (this.focusedProfileSchedule?.id === schedule.id && this.focusedProfileRecentRun) {
        return this.focusedProfileRecentRun;
      }
      return (
        (this.integrations.profileScheduleRuns || []).find(
          (run) => run.schedule_id === schedule.id || run.scheduleId === schedule.id
        ) || null
      );
    },
    profileQueueStatusForSchedule(schedule = {}) {
      const run = this.profileQueueRunForSchedule(schedule);
      if (this.focusedProfileSchedule?.id === schedule.id && this.focusedProfileQueueStatus) {
        return this.focusedProfileQueueStatus;
      }
      return run?.summary?.coverage_queue_status || null;
    },
    profileQueueTypeLabel(schedule = {}) {
      const type = String(schedule.profile_type || 'auto').toLowerCase();
      if (type === 'aggregate' || type === 'auto') return 'Database profile queue';
      if (type === 'bi') return 'BI metadata profile queue';
      if (type === 'metadata') return 'Connector metadata profile queue';
      return 'Profile queue';
    },
    profileQueuePlainStatus(
      schedule = {},
      state = this.profileScheduleStateMeta(schedule),
      queueStatus = null
    ) {
      const timeoutCount = this.profileQueueNumber(queueStatus?.timeout_penalty_assets);
      const pendingCount = this.profileQueueNumber(queueStatus?.pending_live_queue);
      const selectedCount = this.profileQueueNumber(queueStatus?.selected_for_this_run);
      if (timeoutCount > 0 && state.section !== 'failed')
        return 'Will retry timed-out tables later';
      if (state.section === 'drafts') return 'Setup not ready';
      if (state.section === 'deactivated') return 'Paused';
      if (state.section === 'failed') return 'Needs attention';
      if (state.label === 'Running With Errors') return 'Running with issues';
      if (state.section === 'running' && (selectedCount > 0 || pendingCount > 0))
        return 'Running normally';
      if (state.section === 'successful' && pendingCount === 0) return 'Finished this batch';
      if (state.section === 'successful') return 'Waiting for next scheduled run';
      if (state.section === 'running') return 'Waiting for next scheduled run';
      return state.label || 'Status unknown';
    },
    profileQueuePlainExplanation(schedule = {}, row = {}) {
      if (row.blockers?.length) return row.blockers[0];
      if (row.timeoutPenaltyCount > 0) {
        return `${row.timeoutPenaltyCount.toLocaleString()} timed-out object${row.timeoutPenaltyCount === 1 ? '' : 's'} will be delayed so other profile work can continue.`;
      }
      if (row.selectedThisRun > 0) {
        return `${row.selectedThisRun.toLocaleString()} object${row.selectedThisRun === 1 ? ' is' : 's are'} selected for the current live profile batch.`;
      }
      if (row.pendingLiveQueue > 0) {
        return `${row.pendingLiveQueue.toLocaleString()} live profile object${row.pendingLiveQueue === 1 ? '' : 's'} remain in the queue.`;
      }
      if (row.completedLiveProfiles > 0) {
        return `${row.completedLiveProfiles.toLocaleString()} live profile object${row.completedLiveProfiles === 1 ? ' has' : 's have'} completed for this queue.`;
      }
      if (schedule.next_run_at)
        return `Next run is scheduled for ${this.formatTimestamp(schedule.next_run_at)}.`;
      return 'The current APIs do not report detailed queue totals for this schedule yet.';
    },
    profileQueueHealthRow(schedule = {}) {
      const state = this.profileScheduleStateMeta(schedule);
      const queueStatus = this.profileQueueStatusForSchedule(schedule) || {};
      const lastRun = this.profileQueueRunForSchedule(schedule);
      const blockers = this.profileScheduleBlockers(schedule);
      const completedLiveProfiles = this.profileQueueNumber(
        queueStatus.completed_live_assets ??
          lastRun?.summary?.coverage_queue_status?.completed_live_assets
      );
      const failedLiveProfiles = this.profileQueueNumber(
        queueStatus.failed_live_assets ??
          lastRun?.summary?.coverage_queue_status?.failed_live_assets
      );
      const pendingLiveQueue = this.profileQueueNumber(
        queueStatus.pending_live_queue ??
          lastRun?.summary?.coverage_queue_status?.pending_live_queue
      );
      const selectedThisRun = this.profileQueueNumber(
        queueStatus.selected_for_this_run ??
          lastRun?.summary?.coverage_queue_status?.selected_for_this_run
      );
      const freshSkippedCount = this.profileQueueNumber(queueStatus.fresh_skipped_assets);
      const timeoutPenaltyCount = this.profileQueueNumber(queueStatus.timeout_penalty_assets);
      const queueSummary = this.scheduleQueueSummary(schedule);
      const plainStatus = this.profileQueuePlainStatus(schedule, state, queueStatus);
      const needsAttention =
        state.section === 'failed' ||
        blockers.length > 0 ||
        failedLiveProfiles > 0 ||
        plainStatus === 'Running with issues';
      const row = {
        id: schedule.id,
        schedule,
        name: schedule.name || schedule.id || 'Unnamed profile queue',
        source: schedule.connector_id || 'No connection selected',
        typeLabel: this.profileQueueTypeLabel(schedule),
        statusLabel: plainStatus,
        statusColor: needsAttention ? 'error' : state.color,
        healthKey: needsAttention
          ? 'attention'
          : state.section === 'successful'
            ? 'completed'
            : state.section === 'running'
              ? 'running'
              : 'waiting',
        needsAttention,
        nextRunAt: schedule.next_run_at || null,
        lastRunAt: schedule.last_run_at || lastRun?.completed_at || lastRun?.started_at || null,
        lastResult: this.profileScheduleLastResult(schedule),
        completedLiveProfiles,
        failedLiveProfiles,
        pendingLiveQueue,
        selectedThisRun,
        freshSkippedCount,
        timeoutPenaltyCount,
        completedLabel: this.profileQueueDisplayCount(completedLiveProfiles),
        failedLabel: this.profileQueueDisplayCount(failedLiveProfiles),
        pendingLabel: this.profileQueueDisplayCount(pendingLiveQueue),
        selectedLabel: this.profileQueueDisplayCount(selectedThisRun),
        freshSkippedLabel: this.profileQueueDisplayCount(freshSkippedCount),
        timeoutPenaltyLabel: this.profileQueueDisplayCount(timeoutPenaltyCount),
        coverageModeLabel: this.profileCoverageModeLabel(queueSummary.coverageMode),
        livePriorityLabel: this.profileLivePriorityLabel(queueSummary.livePriority),
        maxLiveTables: queueSummary.maxLiveTables,
        blockers,
        nextAction: this.profileScheduleNextAction(schedule),
      };
      row.explanation = this.profileQueuePlainExplanation(schedule, row);
      return row;
    },
    profileScheduleStateMeta(schedule = {}) {
      const status = String(schedule.status || '').toUpperCase();
      const lastStatus = String(schedule.last_status || '').toLowerCase();
      const queueStatus =
        this.focusedProfileSchedule?.id === schedule.id ? this.focusedProfileQueueStatus : null;
      const hasRunningQueue =
        status === 'ACTIVE' &&
        (['running', 'in_progress', 'started'].includes(lastStatus) ||
          Number(queueStatus?.selected_for_this_run || 0) > 0 ||
          Number(queueStatus?.pending_live_queue || 0) > 0);
      const hasFailure =
        status === 'ACTIVE' &&
        (Boolean(schedule.last_error) ||
          Number(schedule.failure_count || 0) > 0 ||
          ['failed', 'failure', 'partial_failure', 'running_with_errors', 'error'].includes(
            lastStatus
          ));
      const hasSuccess =
        status === 'ACTIVE' &&
        (['success', 'succeeded', 'completed', 'published', 'partial_published'].includes(
          lastStatus
        ) ||
          Number(schedule.run_count || 0) > 0);

      if (['DRAFT', 'PLANNED'].includes(status)) {
        return { section: 'drafts', label: 'Draft', color: 'secondary', rank: 50 };
      }
      if (status !== 'ACTIVE') {
        return {
          section: 'deactivated',
          label: status === 'PAUSED' ? 'Deactivated' : status || 'Inactive',
          color: 'warning',
          rank: 40,
        };
      }
      if (hasRunningQueue)
        return {
          section: 'running',
          label: hasFailure ? 'Running With Errors' : 'Running',
          color: hasFailure ? 'warning' : 'info',
          rank: 10,
        };
      if (hasFailure)
        return { section: 'failed', label: 'Active Failed', color: 'error', rank: 20 };
      if (hasSuccess)
        return { section: 'successful', label: 'Active Successful', color: 'success', rank: 30 };
      return { section: 'running', label: 'Active Ready', color: 'info', rank: 10 };
    },
    profileScheduleLastResult(schedule = {}) {
      if (schedule.last_error) return this.profileQueueFriendlyError(schedule.last_error);
      if (schedule.last_status) return schedule.last_status;
      if (schedule.run_count)
        return `${schedule.run_count} run${schedule.run_count === 1 ? '' : 's'}`;
      return 'No completed run yet';
    },
    profileQueueFriendlyError(error) {
      const message = typeof error === 'string' ? error : error?.message || String(error || '');
      const remediation = typeof error === 'object' ? error?.remediation : '';
      const combined = `${message} ${remediation || ''}`.trim();
      if (!combined) return 'Needs attention before the next reliable run.';
      if (/missing column metadata/i.test(combined)) {
        return 'Needs source column metadata before live profiling can continue.';
      }
      if (/login|auth|credential|permission|denied|unauthorized|forbidden/i.test(combined)) {
        return 'Needs VPN, login, or source permission confirmation.';
      }
      if (/timeout|timed out|deadline|cancel/i.test(combined)) {
        return 'Will retry timed-out tables later so other profile work can continue.';
      }
      if (/network|connect|econn|socket|dns|host|unreachable|refused/i.test(combined)) {
        return 'Needs source connectivity or network route confirmation.';
      }
      if (/publish/i.test(combined)) {
        return 'Profile ran, but publishing needs a retry or operator review.';
      }
      return message.length > 140 ? `${message.slice(0, 137)}...` : message;
    },
    profileScheduleBlockers(schedule = {}) {
      const blockers = [];
      const state = this.profileScheduleStateMeta(schedule);
      if (!schedule.connector_id)
        blockers.push('Choose one database connection before this schedule can run.');
      if (state.section === 'drafts')
        blockers.push('Draft schedules cannot run until they are activated.');
      if (state.section === 'deactivated')
        blockers.push('This schedule is deactivated and will not run until activated.');
      if (schedule.last_error) blockers.push(this.profileQueueFriendlyError(schedule.last_error));
      if (schedule.last_error?.remediation)
        blockers.push(this.profileQueueFriendlyError(schedule.last_error.remediation));
      if (!this.integrations.profileSchedulerStatus?.running && schedule.status === 'ACTIVE') {
        blockers.push('The scheduler worker is stopped, so active queues are not advancing.');
      }
      return blockers;
    },
    profileScheduleEditorBlockers() {
      const editor = this.integrations.profileScheduleEditor;
      const connector = this.selectedProfileScheduleEditorConnector;
      const blockers = [];
      if (!editor.connectorId) blockers.push('Choose one saved connection.');
      if (!connector)
        blockers.push('The selected connection must exist before this schedule can run.');
      if (
        connector &&
        !connector.config?.database &&
        [
          'sql_server',
          'postgresql',
          'snowflake',
          'bigquery',
          'databricks',
          'aws_redshift',
        ].includes(connector.type)
      ) {
        blockers.push('Database schedules must point at exactly one database connection.');
      }
      if (connector && this.connectorLoginCheck(connector) === 'Failed')
        blockers.push('Resolve the connection login check before activating this schedule.');
      if (connector && this.connectorDiscoveryCheck(connector) === 'Failed')
        blockers.push('Resolve discovery/read access before activating this schedule.');
      if (!editor.name && editor.status === 'ACTIVE')
        blockers.push('Name the schedule so operators can recognize it in the queue.');
      if (editor.dryRun === true)
        blockers.push(
          'Recurring profile schedules cannot be saved as dry runs. Use Run Now for ad-hoc dry-run previews.'
        );
      return blockers;
    },
    profileScheduleNextAction(schedule = {}) {
      const state = this.profileScheduleStateMeta(schedule);
      if (state.section === 'drafts') return 'Resolve blockers, then activate or save draft.';
      if (state.section === 'deactivated') return 'Activate when this source should profile again.';
      if (state.section === 'failed')
        return 'Open the queue, review the failure, then run or retry.';
      if (state.section === 'running')
        return 'Open queue detail to monitor current table progress.';
      return 'Monitor next run or run now for an investigation.';
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
    queueObjectTypeLabel(value) {
      const normalized = String(value || '').toLowerCase();
      if (!normalized) return 'Object';
      if (normalized === 'table') return 'Table';
      if (normalized === 'view') return 'View';
      if (normalized === 'stored_procedure') return 'Stored procedure';
      if (normalized === 'function') return 'Function';
      if (normalized === 'trigger') return 'Trigger';
      return normalized.replace(/_/g, ' ');
    },
    formatEstimatedRows(value) {
      const count = Number(value);
      if (!Number.isFinite(count) || count < 0) return '-';
      return count.toLocaleString();
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
    connectorRunMetadataEnrichment(run) {
      return (
        run?.summary?.metadata_enrichment ||
        run?.summary?.coverage_queue_status?.metadata_enrichment ||
        null
      );
    },
    connectorRunMetadataEnrichmentStatus(run) {
      const enrichment = this.connectorRunMetadataEnrichment(run);
      if (!enrichment) return 'not reported';
      if (enrichment.status) return enrichment.status;
      if (enrichment.attempted === false) return 'unsupported';
      if (enrichment.failed === true) return 'failed';
      if (enrichment.succeeded === true) return 'succeeded';
      if (enrichment.attempted === true) return 'attempted';
      return 'not reported';
    },
    connectorRunBlockedByMissingColumns(run) {
      const summary = run?.summary || {};
      const errors = run?.errors || [];
      return (
        summary.live_profile_blocked === true ||
        /missing column metadata/i.test(summary.blocked_reason || '') ||
        errors.some(
          (error) =>
            error?.code === 'PROFILE_MISSING_COLUMN_METADATA' ||
            /missing column metadata/i.test(error?.message || '')
        )
      );
    },
    connectorRunAffectedObjects(run) {
      const summary = run?.summary || {};
      const enrichment = this.connectorRunMetadataEnrichment(run) || {};
      const errors = run?.errors || [];
      return [
        ...(summary.affected_objects || []),
        ...(enrichment.affected_assets || []),
        ...errors.flatMap((error) => error?.details?.affected_objects || []),
      ].filter(Boolean);
    },
    connectorRunCounterPairs(run) {
      const summary = run?.summary || {};
      const queueStatus = this.connectorRunQueueStatus(run) || {};
      return [
        ['Actions planned', summary.actions_planned],
        ['Columns profiled', summary.columns_profiled],
        ['Selected this run', queueStatus.selected_for_this_run],
        ['Coverage assets live', summary.coverage_assets_live],
        ['Coverage assets total', summary.coverage_assets_total],
      ].filter(([, value]) => value !== undefined && value !== null && value !== '');
    },
    connectorRunDisplayStatus(run) {
      if (this.connectorRunBlockedByMissingColumns(run)) return 'blocked: missing columns';
      return run?.status || '-';
    },
    connectorRunStatusColor(run) {
      if (this.connectorRunBlockedByMissingColumns(run)) return 'error';
      const status = String(run?.status || '').toLowerCase();
      if (['succeeded', 'success', 'completed'].includes(status)) return 'success';
      if (['partial_failure', 'warning', 'running_with_errors'].includes(status)) return 'warning';
      if (['failed', 'failure', 'error'].includes(status)) return 'error';
      if (['running', 'started', 'in_progress'].includes(status)) return 'info';
      return 'secondary';
    },
    scheduleQueueSummary(schedule) {
      const options = schedule?.options || {};
      return {
        coverageMode: options.coverage_mode || 'all_objects',
        livePriority: options.live_priority || 'most_used_first',
        maxLiveTables: Number(options.max_live_tables || 15) || 15,
      };
    },
    connectorDefinitionLabel(type) {
      const definition = this.integrations.connectorDefinitions.find((item) => item.type === type);
      return definition ? `${definition.label} (${definition.cloud})` : type;
    },
    applyManagedConnectorSelection(
      connector,
      { focusWorkflow = false, includeProfileContext = true } = {}
    ) {
      if (!connector) return;
      this.integrations.selectedConnectorId = connector.id;
      if (includeProfileContext) {
        this.integrations.profileRunEditor.connectorId = connector.id;
        this.integrations.profileScheduleEditor.connectorId = connector.id;
      }
      this.integrations.connectorGrant.connectorId = connector.id;
      if (focusWorkflow) {
        this.integrations.connectorWorkflowTab = 'connection';
      }
      this.integrations.connectorEditor.id = connector.id;
      this.integrations.connectorEditor.type = connector.type;
      this.integrations.connectorEditor.label = connector.label || connector.id;
      this.integrations.connectorEditor.description = connector.description || '';
      this.integrations.connectorEditor.credentialMode =
        connector.credential?.mode || 'secret_reference';
      this.integrations.connectorEditor.secretRef =
        connector.credential?.secret_ref === 'stored_reference'
          ? ''
          : connector.credential?.secret_ref || '';
      this.integrations.connectorEditor.rawSecret = '';
      this.integrations.connectorEditor.draftMode = false;
      this.integrations.connectorEditor.lastResetAt = null;
      this.syncConnectorCredentialMode();
      this.hydrateConnectorEditorFromDefinition(this.selectedConnectorDefinition, connector);
      this.integrations.connectorEditor.wizardStep = Math.min(
        3,
        Math.max(0, this.connectorWizardStepDefinitions.length - 1)
      );
      this.persistProfileOpsFocus();
      if (includeProfileContext) {
        this.loadManagedConnectorRuns(connector.id);
        const activeSchedule = (this.integrations.profileSchedules || []).find(
          (schedule) => schedule.connector_id === connector.id && schedule.status === 'ACTIVE'
        );
        if (activeSchedule) this.focusProfileSchedule(activeSchedule);
      }
    },
    openManagedConnection(connector) {
      if (!connector) return;
      this.applyManagedConnectorSelection(connector, {
        focusWorkflow: true,
        includeProfileContext: false,
      });
      this.loadManagedConnectorSnapshot(connector.id);
      this.showToast(`Opened ${connector.label || connector.id}.`);
    },
    disableManagedConnection(connector) {
      const name = connector?.label || connector?.id || 'this connection';
      this.showToast(
        `Disable is not wired yet for ${name}; backend disable semantics are tracked outside UIWF-012.`
      );
    },
    useManagedConnector(connector) {
      this.applyManagedConnectorSelection(connector);
    },
    editManagedConnector(connector) {
      if (!connector) return;
      this.applyManagedConnectorSelection(connector, { focusWorkflow: true });
      this.integrations.connectorEditor.wizardStep = Math.min(
        3,
        Math.max(0, this.connectorWizardStepDefinitions.length - 1)
      );
    },
    primeConnectorTestState(connector) {
      this.integrations.connectorEditor.testSummary = null;
      this.integrations.connectorEditor.discoverySummary = null;
      this.integrations.connectorSnapshot = null;
      this.integrations.connectorEditor.lastValidationAt = new Date().toISOString();
      this.showToast(`Testing ${connector.label || connector.id}...`);
    },
    async runSavedConnectorTest(connector, { syncEditor = false } = {}) {
      if (!connector) {
        this.showToast('Choose a saved connector first.');
        return;
      }
      if (syncEditor) {
        this.applyManagedConnectorSelection(connector, { focusWorkflow: true });
        this.primeConnectorTestState(connector);
      } else {
        this.showToast(`Testing ${connector.label || connector.id}...`);
      }
      this.setConnectorRowTestState(connector.id, {
        loading: true,
        status: 'testing',
        error: null,
        test: null,
      });
      try {
        const testTimeoutMs = connector.type === 'ssis' ? 45000 : 15000;
        const payload = await this.api(
          `/api/v1/connectors/${encodeURIComponent(connector.id)}/test`,
          {
            method: 'POST',
            body: JSON.stringify({ timeout_ms: testTimeoutMs }),
          }
        );
        const test = payload.test || null;
        if (syncEditor) {
          this.integrations.connectorEditor.testSummary = test;
          this.integrations.connectorEditor.discoverySummary = null;
        }
        this.setConnectorRowTestState(connector.id, {
          loading: false,
          status: test?.status || 'unknown',
          error: test?.errors?.[0]?.message || null,
          test,
        });
        this.showToast(
          `Connector test ${test?.status || 'completed'} in ${test?.summary?.elapsed_ms ?? '-'} ms.`
        );
      } catch (err) {
        const failure = this.buildConnectorRunFailureSummary(connector, err);
        if (syncEditor) {
          this.integrations.connectorEditor.testSummary = failure;
          this.integrations.connectorEditor.discoverySummary = null;
        }
        this.setConnectorRowTestState(connector.id, {
          loading: false,
          status: 'failed',
          error: err.message,
          code: err.code,
          phase: err.phase,
          remediation: err.remediation,
          details: err.details,
          test: failure,
        });
        this.showToast(`Connector test failed: ${err.message}`);
      }
    },
    buildConnectorRunFailureSummary(connector, err) {
      const saved = connector || this.connectorEditorSavedRecord() || {};
      const config = saved.config || {};
      const credentialMode =
        saved.credential?.mode || this.integrations.connectorEditor.credentialMode || 'unknown';
      return {
        id: `failed-${Date.now()}`,
        connector_id: saved.id || this.integrations.connectorEditor.id || '',
        connector_type: saved.type || this.integrations.connectorEditor.type || '',
        status: 'failed',
        completed_at: new Date().toISOString(),
        summary: {
          planned_objects: 0,
          discovered_objects: 0,
          discovered_columns: 0,
          discovered_lineage_edges: 0,
          dry_run_only: false,
          source_contacted: false,
          connection_status: 'failed',
          live_connection_valid: false,
          metadata_discovery_valid: false,
          connection_details: {
            server_name: config.server || '',
            database_name: config.database || '',
            credential_mode: credentialMode,
          },
          credential_mode: credentialMode,
          elapsed_ms: err?.elapsed_ms || null,
          server: config.server || config.host || '',
          database: config.database || config.catalog || config.catalogDatabase || '',
          phase: err?.phase || 'connection_validation',
        },
        diagnostics: {
          success: false,
          connector_id: saved.id || this.integrations.connectorEditor.id || '',
          connector_type: saved.type || this.integrations.connectorEditor.type || '',
          phase: err?.phase || 'connection_validation',
          server: config.server || config.host || null,
          database: config.database || config.catalog || config.catalogDatabase || null,
          actionable_error: {
            code: err?.code || 'CONNECTOR_RUN_FAILED',
            message: err?.message || 'Connector run failed.',
            remediation: err?.remediation || null,
            details: err?.details || null,
          },
        },
        errors: [
          {
            code: err?.code || 'CONNECTOR_RUN_FAILED',
            message: err?.message || 'Connector run failed.',
            phase: err?.phase || 'connection_validation',
            remediation: err?.remediation || null,
            details: err?.details || null,
          },
        ],
      };
    },
    async testManagedConnector(connector) {
      await this.runSavedConnectorTest(connector, { syncEditor: true });
    },
    async retestSelectedManagedConnector() {
      await this.runSavedConnectorTest(this.selectedManagedConnector, { syncEditor: true });
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
      if (type === 'bi')
        return `/api/v1/connectors/${encodeURIComponent(connectorId)}/bi-profile/run`;
      if (type === 'metadata')
        return `/api/v1/connectors/${encodeURIComponent(connectorId)}/metadata-profile/run`;
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
        this.integrations.connectorRuns = [
          run,
          ...this.integrations.connectorRuns.filter(Boolean),
        ].slice(0, 10);
        this.integrations.selectedConnectorRun = run;
        this.integrations.schedulerOpsTab = 'runs';
        this.showToast(`Profile run ${run?.status || 'completed'}.`);
      } catch (err) {
        this.showToast(`Profile run failed: ${err.message}`);
      } finally {
        this.integrations.connectorLoading = false;
      }
    },
    connectorRunFailedAssetIds(run) {
      const errors = run?.errors || run?.profile?.errors || run?.profile?.run?.errors || [];
      return [
        ...new Set(
          errors
            .map(
              (error) => error?.asset_id || error?.assetId || error?.object_id || error?.objectId
            )
            .filter(Boolean)
        ),
      ];
    },
    canRerunFailedAssets(run) {
      return (
        this.connectorRunKind(run) === 'Aggregate profile' &&
        this.connectorRunFailedAssetIds(run).length > 0
      );
    },
    connectorRunPublishState(run) {
      return run?.artifact?.profile_publish || {};
    },
    connectorRunPublishStatus(run) {
      const state = this.connectorRunPublishState(run);
      if (state.status) return state.status;
      if ((state.successful_asset_count || 0) > 0 || run?.artifact?.devops_upload_pending)
        return 'pending';
      return 'not_applicable';
    },
    connectorRunCanPublish(run) {
      const state = this.connectorRunPublishState(run);
      return (
        (state.successful_asset_count || 0) > 0 &&
        !['published', 'partial_published', 'publishing'].includes(
          this.connectorRunPublishStatus(run)
        )
      );
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
      this.showToast(
        `Rerunning ${failedAssetIds.length} failed asset${failedAssetIds.length === 1 ? '' : 's'}.`
      );
      await this.runOneTimeProfile();
    },
    async publishConnectorProfiles(run = null) {
      const connectorId =
        run?.connector_id ||
        this.integrations.selectedConnectorId ||
        this.integrations.profileRunEditor.connectorId;
      const body = {
        targets: ['devops', 'confluence'],
        dry_run: false,
      };
      const endpoint =
        run?.id && connectorId
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
      this.integrations.profileScheduleEditor.profileType =
        this.integrations.profileRunEditor.profileType;
      this.integrations.profileScheduleEditor.dryRun = false;
      this.integrations.profileScheduleEditor.assetIds =
        this.integrations.profileRunEditor.assetIds || '';
      this.integrations.profileScheduleEditor.streams =
        this.integrations.profileRunEditor.streams || '';
      this.integrations.profileScheduleEditor.coverageMode =
        this.integrations.profileRunEditor.coverageMode || 'all_objects';
      this.integrations.profileScheduleEditor.includeViews =
        this.integrations.profileRunEditor.includeViews === true;
      this.integrations.profileScheduleEditor.livePriority =
        this.integrations.profileRunEditor.livePriority || 'most_used_first';
      this.integrations.profileScheduleEditor.maxLiveTables = Math.max(
        1,
        Number(this.integrations.profileRunEditor.maxLiveTables || 15)
      );
      this.integrations.profileScheduleEditor.autoPublish =
        this.integrations.profileRunEditor.executionMode === 'live';
      this.integrations.profileScheduleEditor.publishTargets = ['devops'];
      this.initializeProfileScheduleEditor(true);
      this.openProfileScheduleEditor(false);
      this.onViewChange('scheduler');
    },
    connectorCredentialModeOptions() {
      const modes = this.selectedConnectorDefinition?.credentialKinds || [
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
      return ![
        'windows_integrated',
        'managed_identity',
        'iam_role',
        'workload_identity',
        'none',
      ].includes(mode);
    },
    syncConnectorCredentialMode() {
      const editor = this.integrations.connectorEditor;
      const options = this.connectorCredentialModeOptions().map((item) => item.value);
      if (!options.includes(editor.credentialMode)) {
        editor.credentialMode = options.includes('windows_integrated')
          ? 'windows_integrated'
          : options[0] || 'none';
      }
      if (editor.credentialMode === 'windows_integrated') {
        editor.secretRef = '';
        editor.rawSecret = '';
      }
      const nextValues = { ...(editor.formValues || {}) };
      this.connectorCredentialFieldsForMode(editor.credentialMode).forEach((field) => {
        if (!(field.key in nextValues)) nextValues[field.key] = '';
      });
      editor.formValues = nextValues;
    },
    async saveManagedConnector(options = {}) {
      const editor = this.integrations.connectorEditor;
      const keepWorkflowTab = options.keepWorkflowTab === true;
      this.syncConnectorCredentialMode();
      const payload = this.buildConnectorSavePayload();
      if (!payload) return false;
      if (!payload.id || !payload.type || !payload.label) {
        this.showToast('ID, connector type, and label are required.');
        return false;
      }
      const missingCredential = this.connectorCredentialFields.find(
        (field) => field.required && String(this.connectorFieldValue(field.key, '')).trim() === ''
      );
      if (missingCredential) {
        this.showToast(`${missingCredential.label} is required.`);
        return false;
      }
      try {
        this.integrations.connectorLoading = true;
        await this.api('/api/v1/connectors', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        editor.rawSecret = '';
        await this.loadManagedConnectors();
        this.integrations.selectedConnectorId = editor.id;
        this.integrations.profileRunEditor.connectorId = editor.id;
        this.integrations.profileScheduleEditor.connectorId = editor.id;
        this.integrations.connectorGrant.connectorId = editor.id;
        editor.draftMode = false;
        editor.lastResetAt = null;
        if (!keepWorkflowTab) this.integrations.connectorWorkflowTab = 'connection';
        this.showToast('Managed connector saved.');
        return true;
      } catch (err) {
        this.showToast(`Managed connector save failed: ${err.message}`);
        return false;
      } finally {
        this.integrations.connectorLoading = false;
      }
    },
    async testManagedConnectorDraft() {
      const editor = this.integrations.connectorEditor;
      if (!editor.id || !editor.type || !editor.label) {
        this.showToast('Save-ready connector details are required before testing.');
        return;
      }
      const saved = await this.saveManagedConnector({ keepWorkflowTab: true });
      if (!saved || !editor.id) return;
      const connector = this.connectorEditorSavedRecord() || {
        id: editor.id,
        label: editor.label,
        type: editor.type,
        description: editor.description || '',
        credential: { mode: editor.credentialMode },
      };
      await this.runSavedConnectorTest(connector, { syncEditor: true });
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
    async runManagedConnector(connectorId, options = null) {
      try {
        this.integrations.connectorLoading = true;
        const payload = await this.api(
          `/api/v1/connectors/${encodeURIComponent(connectorId)}/run`,
          {
            method: 'POST',
            body: JSON.stringify(options || { dry_run: true }),
          }
        );
        this.integrations.connectorRuns = [payload.run, ...this.integrations.connectorRuns].slice(
          0,
          10
        );
        await this.loadManagedConnectorSnapshot(connectorId);
        this.integrations.connectorEditor.testSummary = payload.run || null;
        this.integrations.connectorEditor.discoverySummary =
          this.integrations.connectorSnapshot || null;
        const planned = payload.run.summary?.planned_objects ?? 0;
        const discovered = payload.run.summary?.discovered_objects ?? 0;
        const suffix = payload.run.summary?.dry_run_only
          ? `${planned} stream/object type(s) planned; source not contacted.`
          : `${discovered} metadata object(s) harvested.`;
        this.showToast(`Connector run ${payload.run.status}: ${suffix}`);
      } catch (err) {
        this.integrations.connectorEditor.testSummary = this.buildConnectorRunFailureSummary(
          this.connectorEditorSavedRecord() || { id: connectorId },
          err
        );
        this.integrations.connectorEditor.discoverySummary = null;
        this.showToast(`Connector run failed: ${err.message}`);
      } finally {
        this.integrations.connectorLoading = false;
      }
    },
    async loadManagedConnectorSnapshot(connectorId) {
      try {
        const payload = await this.api(
          `/api/v1/connectors/${encodeURIComponent(connectorId)}/snapshot`
        );
        this.integrations.connectorSnapshot = payload.snapshot || null;
      } catch (err) {
        this.showToast(`Connector snapshot failed: ${err.message}`);
      }
    },
    async loadManagedConnectorRuns(connectorId) {
      if (!connectorId) return;
      try {
        const payload = await this.api(
          `/api/v1/connectors/${encodeURIComponent(connectorId)}/runs?limit=10`
        );
        this.integrations.connectorRuns = payload.runs || [];
        this.integrations.selectedConnectorRun = this.integrations.connectorRuns[0] || null;
      } catch (err) {
        this.showToast(`Connector run history failed: ${err.message}`);
      }
    },
    selectConnectorRun(run) {
      this.integrations.selectedConnectorRun = run || null;
    },
    openConnectorRunDrawer(run) {
      this.selectConnectorRun(run);
      this.integrations.connectorRunDrawerOpen = Boolean(run);
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
        .reduce((hash, char) => {
          const nextHash = Math.imul(hash, 31) + char.charCodeAt(0);
          return nextHash < 0 ? nextHash + 0x100000000 : nextHash;
        }, 0)
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
        server: String(sql.server || '')
          .trim()
          .toLowerCase(),
        port: Number(sql.port) || 1433,
        authentication: sql.authentication,
        useIntegratedAuth: Boolean(sql.useIntegratedAuth),
        username: String(sql.username || '')
          .trim()
          .toLowerCase(),
        domain: String(sql.domain || '')
          .trim()
          .toLowerCase(),
        clientId: String(sql.clientId || '')
          .trim()
          .toLowerCase(),
        tenantId: String(sql.tenantId || '')
          .trim()
          .toLowerCase(),
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
          this.showToast(
            `Load blocked: Elasticsearch index is unavailable at ${esUrl}. Verify service status and retry.`
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
    canAccessView(view) {
      const item = this.navItems.find((navItem) => navItem.key === view);
      if (!item) {
        if (view === 'governance') {
          return ['steward', 'admin'].includes(this.navigationRole);
        }
        return false;
      }
      const audience =
        Array.isArray(item.audience) && item.audience.length ? item.audience : ['admin'];
      return audience.includes(this.navigationRole);
    },
    ensureActiveViewAllowed({ silent = false } = {}) {
      if (this.canAccessView(this.activeView)) {
        return true;
      }
      const requestedLabel =
        pageWorkflowMeta[this.activeView]?.title || this.activeNavItem?.label || 'That page';
      this.activeView = 'overview';
      if (!silent) {
        this.showToast(`${requestedLabel} is hidden for ${this.navigationRoleLabel} navigation.`);
      }
      return false;
    },
    async onViewChange(view) {
      if (!this.canAccessView(view)) {
        const requestedLabel =
          pageWorkflowMeta[view]?.title ||
          this.navItems.find((item) => item.key === view)?.label ||
          'That page';
        this.activeView = 'overview';
        this.closeMobileSidebar();
        this.showToast(`${requestedLabel} is hidden for ${this.navigationRoleLabel} navigation.`);
        await this.loadActiveViewData(this.activeView);
        return;
      }
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
    if (requestedView === 'governance') {
      this.activeView = 'governanceOps';
    }
    if (
      requestedView &&
      requestedView !== 'governance' &&
      [
        'discovery',
        'browse',
        'assetDetail',
        'overview',
        'reports',
        'glossary',
        'products',
        'integrations',
        'import',
        'scheduler',
        'docs',
        'admin',
      ].includes(requestedView)
    ) {
      this.activeView = requestedView;
    }
    this.ensureActiveViewAllowed({ silent: true });
    if (!this.token || this.token === '') {
      this.setDemoMode(true);
    } else {
      await this.bootstrapData();
    }
    this.ensureActiveViewAllowed({ silent: true });
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
            <div v-for="section in visibleNavSections" :key="section.key" class="nav-section">
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
          <v-app-bar :class="['topbar', { 'home-topbar': activeView === 'overview' }]" flat>
            <div class="topbar-left">
              <div class="topbar-nav-controls">
                <v-btn v-if="$vuetify.display.smAndDown" icon="mdi-menu" variant="text" size="small" @click="toggleMobileSidebar" title="Open navigation"></v-btn>
                <v-btn v-else icon variant="text" size="small" @click="toggleSidebar" title="Collapse sidebar">
                  <v-icon>{{ sidebarCollapsed ? 'mdi-chevron-right' : 'mdi-chevron-left' }}</v-icon>
                </v-btn>
              </div>
              <div v-if="!['overview', 'discovery', 'scheduler'].includes(activeView)" class="topbar-title-block">
                <div class="topbar-kicker">{{ activeNavSection?.label || 'Workspace' }}</div>
                <h4>{{ activePageMeta.title }}</h4>
                <div class="user-meta">{{ currentUser?.email }} · {{ navigationRoleLabel }} navigation · {{ (currentUser?.roles || []).join(', ') }}</div>
              </div>
            </div>
            <div class="topbar-profile-area">
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
            <section v-if="!isSimpleWorkflowView" class="page-intro">
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

            <div v-if="!isSimpleWorkflowView" class="telemetry-banner">
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

            ${homeFindDataPageTemplate}
            ${assetDetailPageTemplate}
            ${catalogSearchPageTemplate}
            ${businessGlossaryPageTemplate}
${dataProductsPageTemplate}

            ${governanceOpsPageTemplate}
            ${metricIntelligencePageTemplate}
            ${lineageExplorerPageTemplate}
            ${governanceInsightsPageTemplate}
            ${connectionsPageTemplate}
            ${profilingSchedulerPageTemplate}
            ${connectorWorkflowPageTemplate}
            ${lineageAcquisitionPageTemplate}
            ${platformAdminPageTemplate}
${helpCenterPageTemplate}
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

      <workflow-detail-drawer
        v-model="integrations.connectorRunDrawerOpen"
        title="Profile Run Details"
        :subtitle="integrations.selectedConnectorRun ? 'Shared drilldown for run status, queue progress, and publish state.' : ''"
        :items="selectedConnectorRunDetailItems"
      >
        <workflow-blocker-list
          v-if="integrations.selectedConnectorRun?.errors?.length"
          title="Run reported issues"
          :blockers="integrations.selectedConnectorRun.errors.map((error) => error.message || error)"
          tone="error"
        ></workflow-blocker-list>
      </workflow-detail-drawer>

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

let appInstance = null;

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

function escapeUiFallbackText(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function renderFatalUiFallback(entry) {
  const root = typeof document === 'undefined' ? null : document.getElementById('app-root');
  if (!root) {
    return;
  }

  const safeMessage = escapeUiFallbackText(
    entry.message || 'A UI runtime error stopped the page from rendering.'
  );
  const safeCode = escapeUiFallbackText(entry.code || 'UI_RUNTIME_ERROR');
  const safeTimestamp = escapeUiFallbackText(entry.timestamp || new Date().toISOString());

  root.innerHTML = `
    <main class="fatal-ui-fallback" role="alert">
      <section>
        <span>DataGov</span>
        <h1>The app could not finish loading.</h1>
        <p>${safeMessage}</p>
        <small>Error code ${safeCode} · ${safeTimestamp}</small>
        <button type="button" onclick="window.location.reload()">Reload</button>
      </section>
    </main>
  `;
}

function routeUiRuntimeError(entry, toastPrefix = 'UI error') {
  if (!appInstance) {
    console.error(`${toastPrefix}: ${entry.message}`, entry);
    renderFatalUiFallback(entry);
    return;
  }

  appInstance.recordApiError?.(entry);
  appInstance.showToast?.(`${toastPrefix}: ${entry.message}`);
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
    routeUiRuntimeError(entry, 'UI error');
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
    routeUiRuntimeError(entry, 'Unhandled rejection');
  });
}

registerGlobalUiErrorHandlers();

const vueApp = createApp(appConfig).use(vuetify);
vueApp.config.errorHandler = (error, instance, info) => {
  const errorMessage = error?.message || String(error || 'Vue render error');
  const entry = createGlobalUiErrorEntry(
    errorMessage,
    {
      info,
      component: instance?.type?.name || instance?.$options?.name || null,
      stack: error?.stack || null,
    },
    'UI_VUE_RUNTIME_ERROR'
  );
  routeUiRuntimeError(entry, 'UI render error');
};

try {
  appInstance = vueApp.mount('#app-root');
} catch (error) {
  const entry = createGlobalUiErrorEntry(
    error?.message || String(error || 'UI mount failed'),
    {
      phase: 'vue_mount',
      stack: error?.stack || null,
    },
    'UI_MOUNT_FAILED'
  );
  routeUiRuntimeError(entry, 'UI mount failed');
}
