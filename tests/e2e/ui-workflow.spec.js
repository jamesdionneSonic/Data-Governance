import { test, expect } from '@playwright/test';

async function signInIfNeeded(page, email = 'admin@platform.local') {
  const signIn = page.getByRole('button', { name: /sign in/i });
  if (await signIn.isVisible().catch(() => false)) {
    await page.getByPlaceholder(/enter email/i).fill(email);
    await signIn.click();
    await page.waitForTimeout(500);
  }
}

function navList(page) {
  return page.locator('.nav-list');
}

async function expectNavVisible(page, labels) {
  for (const label of labels) {
    await expect(navList(page).getByText(label, { exact: true })).toBeVisible();
  }
}

async function expectNavHidden(page, labels) {
  for (const label of labels) {
    await expect(navList(page).getByText(label, { exact: true })).toHaveCount(0);
  }
}

async function openWorkflow(page, currentNavLabel) {
  await page.getByText(currentNavLabel, { exact: true }).first().click();
  await page.waitForLoadState('networkidle').catch(() => {});
}

const workflowSmokeCases = [
  {
    workflow: 'Home / Find Data',
    currentNavLabel: 'Home / Find Data',
    expectedText: /What data are you looking for\?|Search tables, columns, procedures/i,
    migrationNote: 'Home owns the primary catalog search entry point and keeps results in place.',
    visualAnchor: '.home-focus-panel',
  },
  {
    workflow: 'Glossary & Metrics - Glossary',
    currentNavLabel: 'Business Glossary',
    expectedText:
      /Business-Defined Glossary|Linked Technical Evidence|business-authored definition|Business owner|Semantic Resolver/i,
    migrationNote: 'Glossary terms lead with business-defined language before technical mappings.',
    visualAnchor: '.glossary-support-lane',
    supportLaneSelector: 'details.glossary-support-lane',
  },
  {
    workflow: 'Glossary & Metrics - Metrics',
    currentNavLabel: 'Metric Intelligence',
    expectedText:
      /Metric Meaning|Business Metric Concepts|Selected Metric Meaning|Source Column Evidence|Profile And Runtime Evidence/i,
    migrationNote:
      'Metrics starts with business meaning and variants, with source/profile/runtime evidence in support lanes.',
    visualAnchor: '.metric-support-lane',
    supportLaneSelector: 'details.metric-support-lane',
  },
  {
    workflow: 'Review Work / Governance Ops',
    currentNavLabel: 'Governance Ops',
    expectedText:
      /Governance Work Queue|Steward Review Work Queues|Failed Profiles|Failed Lineage|Suspicious Lineage|Ownership And Stewardship Detail/i,
    migrationNote:
      'Governance Ops opens on steward work queues with operational detail tucked into support lanes.',
    visualAnchor: '.review-work-queue-card',
    supportLaneSelector: 'details.governance-support-lane',
  },
  {
    workflow: 'Profiling',
    currentNavLabel: 'Profiling',
    expectedText: /Queue Health|Live Profile Queues|Completed|Needs Attention|Next Run/i,
    migrationNote:
      'Profiling opens on queue health first, with operator controls kept out of the default page.',
    visualAnchor: '.profile-default-schedules',
    supportLaneSelector: 'details.profile-support-lane',
  },
  {
    workflow: 'Connections',
    currentNavLabel: 'Connections',
    expectedText:
      /Connections|Intelligent Name|Login Check|Discovery Check|Connection Detail|Connection Builder/i,
    migrationNote:
      'Connections opens on reusable source access inventory and selected connection detail, with builder/profiling links in support lanes.',
    visualAnchor: '.connector-detail-primary',
    supportLaneSelector: 'details.connections-support-lane',
  },
  {
    workflow: 'Lineage Acquisition',
    currentNavLabel: 'Lineage Acquisition',
    expectedText:
      /Lineage Acquisition Domain|SONIC_DW|Refresh Full Domain Evidence|Advanced Source Troubleshooting/i,
    migrationNote: 'Lineage Acquisition owns domain evidence refresh for SONIC_DW.',
    visualAnchor: 'details.lineage-acquisition-support-lane',
    supportLaneSelector: 'details.lineage-acquisition-support-lane',
  },
  {
    workflow: 'Platform Admin',
    currentNavLabel: 'Platform Admin',
    expectedText:
      /Platform Operations Overview|User Administration|User Snapshot|Platform Health|Audit Trail|Advanced Diagnostics/i,
    migrationNote:
      'Platform Admin opens on safe operational overview with raw diagnostics collapsed.',
    visualAnchor: '.admin-overview-card',
    supportLaneSelector: 'details.admin-support-lane',
  },
];

test.describe('UI workflow architecture smoke coverage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await signInIfNeeded(page);
  });

  for (const workflowCase of workflowSmokeCases) {
    test(`${workflowCase.workflow} surface renders a recognizable default state`, async ({
      page,
    }) => {
      await test.step(workflowCase.migrationNote, async () => {
        await openWorkflow(page, workflowCase.currentNavLabel);
      });

      await expect(page.locator('body')).toContainText(workflowCase.expectedText);
      if (workflowCase.visualAnchor) {
        await expect(page.locator(workflowCase.visualAnchor).first()).toBeVisible();
      }
      if (workflowCase.supportLaneSelector) {
        await expect(page.locator(`${workflowCase.supportLaneSelector}[open]`)).toHaveCount(0);
      }
      if (workflowCase.workflow === 'Home / Find Data') {
        await expect(page.locator('body')).not.toContainText(
          /Common starts|Recent Catalog Objects|Pipeline Progress|Role Shortcuts|Quality Radar|Persona Insights|Platform Health|Run Next Step|Demo Data|Refresh All/i
        );
      }
      if (workflowCase.workflow === 'Review Work / Governance Ops') {
        await expect(page.locator('details.governance-support-lane[open]')).toHaveCount(0);
        await expect(page.locator('.review-work-queue-card')).toHaveCount(3);
      }
      if (workflowCase.workflow === 'Connections') {
        await expect(page.locator('details.connector-builder-lane[open]')).toHaveCount(0);
        await expect(page.locator('.connector-detail-primary')).toBeVisible();
        await expect(page.locator('.connector-detail-primary')).toContainText(
          /Schedule Relationships|Used by schedules|Open Related Profiling Queue/i
        );
        await expect(page.locator('.connector-detail-primary')).not.toContainText(
          /Open Run Now in Profiling|Open Runs in Profiling|Open Publishing in Profiling/i
        );
      }
      if (workflowCase.workflow === 'Glossary & Metrics - Metrics') {
        const profileEvidenceLane = page
          .locator('details.metric-support-lane')
          .filter({ hasText: 'Profile And Runtime Evidence' });
        const profilingHandoffLane = page
          .locator('details.metric-support-lane')
          .filter({ hasText: 'Profiling Handoff' });
        await expect(profileEvidenceLane).toContainText(/Profile And Runtime Evidence/i);
        await expect(profilingHandoffLane).toContainText(/Profiling Handoff/i);
        await expect(page.locator('body')).not.toContainText(
          /Advanced Profile Run|Technical Profile Run/i
        );
        await expect(
          page.locator('details.metric-support-lane').getByRole('button', { name: /^Plan$/i })
        ).toHaveCount(0);
        await expect(
          page.locator('details.metric-support-lane').getByRole('button', { name: /^Run$/i })
        ).toHaveCount(0);
      }
      if (workflowCase.workflow === 'Profiling') {
        await expect(page.locator('.page-intro')).toHaveCount(0);
        await expect(page.locator('.telemetry-banner')).toHaveCount(0);
        await expect(page.getByRole('heading', { name: 'Profiling' })).toHaveCount(1);
        await expect(page.getByRole('button', { name: /New Schedule/i })).toBeVisible();
        await expect(page.locator('details.profile-support-lane')).toHaveCount(0);
        await expect(page.locator('.profile-queue-answer')).toBeVisible();
        await expect(page.locator('.profile-default-schedules')).toBeVisible();
        const profilingSurface = await page.locator('.profile-scheduler-card').boundingBox();
        expect(profilingSurface?.width || 0).toBeGreaterThan(600);
        expect(profilingSurface?.height || 0).toBeGreaterThan(300);
        await expect(page.locator('.profile-scheduler-card')).toContainText(
          /No profiling queues are configured yet|Profiling is|profiling queue/i
        );
        await expect(
          page.locator('details.profile-support-lane:not([open]) .profile-support-body')
        ).toHaveCount(0);
        await expect(page.locator('body')).not.toContainText(
          /Advanced \/ Operator Tools|Start Worker|Run History|Publish Readiness|Schedule Settings|New Queue Schedule/i
        );
        await expect(page.getByRole('button', { name: /Start Worker/i })).toHaveCount(0);
        await expect(page.getByRole('button', { name: /Publish Pending Profiles/i })).toHaveCount(
          0
        );
      }
      if (workflowCase.workflow === 'Lineage Acquisition') {
        await expect(page.locator('details.lineage-acquisition-support-lane[open]')).toHaveCount(0);
        await expect(
          page.getByRole('button', { name: /Refresh Full Domain Evidence/i })
        ).toBeVisible();
      }
      if (workflowCase.workflow === 'Platform Admin') {
        await expect(page.locator('details.admin-support-lane[open]')).toHaveCount(0);
        await expect(
          page.locator('details.admin-support-lane:not([open]) .admin-support-body')
        ).toBeHidden();
      }
    });
  }

  test('Home search shows ranked results in place and opens asset detail on selection', async ({
    page,
  }) => {
    await openWorkflow(page, 'Home / Find Data');

    await page.getByPlaceholder(/Search a table, metric, owner/i).fill('DimVehicle');
    await page.getByRole('button', { name: /^Search$/ }).click();

    const results = page.locator('.home-result-row');
    await expect(results.first()).toBeVisible({ timeout: 20000 });
    await expect(page.locator('body')).toContainText(/Results|Showing .*result/i);
    await expect(navList(page).getByText('Search', { exact: true })).toHaveCount(0);

    await results.first().click();
    await expect(page.locator('.asset-detail-hero')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('body')).toContainText(
      /Business Summary|Lineage & Impact|Explore lineage/i
    );

    await page
      .locator('.catalog-lineage-entry')
      .getByRole('button', { name: 'Explore lineage' })
      .click();
    await expect(page.locator('.selected-lineage-brief')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('body')).toContainText(
      /Selected Asset Lineage|Business Uses|Load Jobs|Show Graph & Evidence/i
    );
    await expect(page.locator('body')).not.toContainText('Answer Rows');
    await expect(page.locator('.lineage-object-picker-row')).toHaveCount(0);
    await expect(page.locator('#lineage-graph-drilldowns')).toHaveCount(0);
    await page.getByRole('button', { name: 'Show Graph & Evidence' }).click();
    await expect(page.locator('#lineage-graph-drilldowns')).toBeVisible({ timeout: 10000 });
  });

  test('Profiling keeps a durable page issue visible when schedules fail to load', async ({
    page,
  }) => {
    await page.route('**/api/v1/connectors/profile-schedules', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'error',
            message: 'Profile schedule service unavailable for test',
            errorInfo: {
              code: 'PROFILE_SCHEDULES_UNAVAILABLE',
              message: 'Profile schedule service unavailable for test',
            },
          }),
        });
        return;
      }
      await route.fallback();
    });

    await openWorkflow(page, 'Profiling');

    await expect(page.locator('.profile-queue-answer')).toBeVisible();
    await expect(page.locator('.profile-page-issues')).toBeVisible();
    await expect(page.locator('.profile-page-issues')).toContainText(
      /Profile schedules could not be loaded|Profile schedule service unavailable/i
    );
    await expect(page.getByRole('button', { name: /Retry/i })).toBeVisible();
  });

  test('Profiling survives persisted advanced queue state and malformed schedule rows', async ({
    page,
  }) => {
    await page.evaluate(() => {
      localStorage.setItem('dg_profile_ops_tab', 'queues');
      localStorage.setItem('dg_profile_queue_schedule_id', 'stale-missing-schedule');
      localStorage.setItem('dg_profile_connector_id', 'legacy-connector');
    });

    await page.route('**/api/v1/connectors/profile-schedules', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'success',
            schedules: [
              null,
              'legacy-corrupt-row',
              {
                id: 'persisted-good-schedule',
                connector_id: 'legacy-connector',
                name: 'Persisted Good Queue',
                profile_type: 'aggregate',
                status: 'ACTIVE',
                last_status: 'succeeded',
                run_count: 2,
                next_run_at: '2026-06-15T12:00:00.000Z',
                options: {
                  coverage_mode: 'all_objects',
                  live_priority: 'most_used_first',
                  max_live_tables: 5,
                },
              },
            ],
          }),
        });
        return;
      }
      await route.fallback();
    });
    await page.route('**/api/v1/connectors/profile-schedules/status', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'success',
          scheduler: {
            running: true,
            enabled: true,
            persistence_enabled: true,
            interval_ms: 60000,
            history_count: 0,
          },
        }),
      });
    });
    await page.route('**/api/v1/connectors/profile-schedules/*/queue?**', async (route) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'error',
          message: 'Profile schedule not found',
          errorInfo: { code: 'NOT_FOUND', message: 'Profile schedule not found' },
        }),
      });
    });

    await page.reload({ waitUntil: 'networkidle' });
    await openWorkflow(page, 'Profiling');

    await expect(page.locator('.fatal-ui-fallback')).toHaveCount(0);
    await expect(page.locator('.profile-queue-answer')).toBeVisible();
    await expect(page.locator('.profile-default-schedules')).toContainText('Persisted Good Queue');
    await expect(page.locator('.profile-queue-health-row')).toHaveCount(1);
    await expect(page.locator('details.profile-support-lane')).toHaveCount(0);
    await expect(page.locator('.profile-page-issues')).toHaveCount(0);
    await expect
      .poll(async () =>
        page.evaluate(() => ({
          appJsVersioned: Array.from(document.scripts).some((script) =>
            script.src.includes('/app.js?v=')
          ),
          appCssVersioned: Array.from(document.querySelectorAll('link[rel="stylesheet"]')).some(
            (link) => link.href.includes('/app.css?v=')
          ),
        }))
      )
      .toEqual({ appJsVersioned: true, appCssVersioned: true });
  });

  test('stale saved auth state recovers without blanking the app', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem('dg_token', 'stale.invalid.token');
      localStorage.setItem('dg_refresh', 'stale.invalid.refresh');
      localStorage.setItem(
        'dg_user',
        JSON.stringify({ id: 'stale-user', email: 'stale@example.local', roles: ['Admin'] })
      );
      localStorage.setItem('dg_demo_mode', 'off');
    });

    await page.reload({ waitUntil: 'networkidle' });

    await expect(page.locator('.fatal-ui-fallback')).toHaveCount(0);
    await expect(page.locator('.home-focus-panel')).toBeVisible();
    await expect(page.locator('#app-root')).toContainText(/What data are you looking for\?/i);
    await expectNavVisible(page, ['Home / Find Data']);
  });
});

test.describe('Role-aware workflow navigation', () => {
  test('User navigation hides advanced operator pages', async ({ page }) => {
    await page.goto('/?view=admin', { waitUntil: 'networkidle' });
    await signInIfNeeded(page, 'user@example.local');

    await expect(page.locator('body')).toContainText(
      /What data are you looking for\?|Search or ask about data/i
    );
    await expectNavVisible(page, [
      'Home / Find Data',
      'Business Glossary',
      'Metric Intelligence',
      'Help Center',
    ]);
    await expectNavHidden(page, [
      'Governance Ops',
      'Trust & Compliance',
      'Connections',
      'Lineage Acquisition',
      'Profiling',
      'Platform Admin',
      'Data Products',
      'Governance Insights',
      'Package & Report',
      'Search',
      'Asset Detail',
      'Lineage Explorer',
    ]);
  });

  test('Analyst navigation includes Profiling but hides admin-only pages', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await signInIfNeeded(page, 'analyst@example.local');

    await expectNavVisible(page, ['Home / Find Data', 'Profiling']);
    await expectNavHidden(page, [
      'Connections',
      'Lineage Acquisition',
      'Platform Admin',
      'Governance Ops',
      'Governance Insights',
      'Package & Report',
      'Search',
      'Asset Detail',
      'Lineage Explorer',
    ]);
  });

  test('Data Steward navigation includes Review Work without raw operator pages', async ({
    page,
  }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await signInIfNeeded(page, 'steward@example.local');

    await expectNavVisible(page, ['Home / Find Data', 'Business Glossary', 'Governance Ops']);
    await expectNavHidden(page, [
      'Connections',
      'Lineage Acquisition',
      'Platform Admin',
      'Profiling',
      'Governance Insights',
      'Package & Report',
      'Trust & Compliance',
      'Search',
      'Asset Detail',
      'Lineage Explorer',
    ]);
  });

  test('Admin navigation can see advanced workflow surfaces', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await signInIfNeeded(page, 'admin@platform.local');

    await expectNavVisible(page, [
      'Home / Find Data',
      'Governance Ops',
      'Connections',
      'Lineage Acquisition',
      'Profiling',
      'Platform Admin',
    ]);
    await expectNavHidden(page, ['Trust & Compliance', 'Lineage Explorer', 'Package & Report']);
    await expectNavHidden(page, ['Search', 'Asset Detail', 'Governance Insights', 'Data Products']);
  });

  test('Lineage Assistant deep link retires into the default Find Data surface', async ({
    page,
  }) => {
    await page.goto('/?view=lineageAsk', { waitUntil: 'networkidle' });
    await signInIfNeeded(page, 'admin@platform.local');

    await expect(page.locator('body')).toContainText(
      /What data are you looking for\?|Search or ask about data/i
    );
    await expect(page.locator('body')).not.toContainText('Sonic Lineage Assistant');
    await expectNavHidden(page, ['Lineage Assistant']);
  });

  test('Advanced Trust Controls deep link retires into Governance Ops', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await signInIfNeeded(page, 'admin@platform.local');
    await page.goto('/?view=governance', { waitUntil: 'networkidle' });

    await expect(page.locator('body')).toContainText(/Governance Work Queue|Review Work/i);
    await expect(page.locator('body')).not.toContainText('Advanced Trust Controls');
    await expect(page.locator('details.governance-advanced-controls-lane[open]')).toHaveCount(0);
    await expect(page.locator('details.governance-advanced-controls-lane')).toBeVisible();
  });
});

test.describe('Connector profile UI fixes', () => {
  test('saved connector TEST is row-scoped and shows structured diagnostics', async ({
    page,
    request,
  }) => {
    const login = await request.post('/api/v1/auth/login', {
      data: { email: 'admin@platform.local' },
    });
    expect(login.ok()).toBeTruthy();
    const { token, user } = await login.json();
    const connectorId = `ui-row-test-${Date.now()}`;

    const create = await request.post('/api/v1/connectors', {
      headers: { Authorization: `Bearer ${token}` },
      data: {
        id: connectorId,
        type: 'sql_server',
        label: 'VendorData UI Row Test',
        config: {
          server: 'L1-5FSQL-01',
          database: 'VendorData',
          mockConnectionCheck: {
            status: 'ready',
            live_connection_valid: true,
            metadata_discovery_valid: true,
            details: {
              server_name: 'L1-5FSQL-01',
              database_name: 'VendorData',
              login_name: 'svc-ui-row-test',
              credential_mode: 'windows_integrated',
            },
          },
        },
        credential: { mode: 'windows_integrated' },
      },
    });
    expect(create.ok()).toBeTruthy();

    const list = await request.get('/api/v1/connectors', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(list.ok()).toBeTruthy();
    expect(
      (await list.json()).connectors.some((connector) => connector.id === connectorId)
    ).toBeTruthy();

    await page.addInitScript(
      ({ authToken, currentUser }) => {
        localStorage.setItem('dg_token', authToken);
        localStorage.setItem('dg_user', JSON.stringify(currentUser));
        localStorage.setItem('dg_demo_mode', 'off');
      },
      { authToken: token, currentUser: user }
    );
    await page.goto('/?view=integrations', { waitUntil: 'networkidle' });
    await openWorkflow(page, 'Connections');

    const row = page.locator('tr').filter({ hasText: connectorId });
    await expect(row).toBeVisible({ timeout: 20000 });
    await row.getByRole('button', { name: /^test$/i }).click();

    const diagnostics = page
      .locator('.connector-test-diagnostics')
      .filter({ hasText: connectorId });
    await expect(diagnostics).toContainText('Test diagnostics');
    await expect(diagnostics).toContainText('VendorData');
    await expect(diagnostics).toContainText('svc-ui-row-test', { timeout: 20000 });
    await expect(diagnostics).toContainText(connectorId);
  });
});
