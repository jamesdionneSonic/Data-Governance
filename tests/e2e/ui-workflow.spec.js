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
    expectedText: /Business-Defined Glossary|Linked Technical Evidence|business-authored definition|Business owner|Semantic Resolver/i,
    migrationNote: 'Glossary terms lead with business-defined language before technical mappings.',
    visualAnchor: '.glossary-support-lane',
    supportLaneSelector: 'details.glossary-support-lane',
  },
  {
    workflow: 'Glossary & Metrics - Metrics',
    currentNavLabel: 'Metric Intelligence',
    expectedText: /Metric Meaning|Business Metric Concepts|Selected Metric Meaning|Source Column Evidence|Profile And Runtime Evidence/i,
    migrationNote: 'Metrics starts with business meaning and variants, with source/profile/runtime evidence in support lanes.',
    visualAnchor: '.metric-support-lane',
    supportLaneSelector: 'details.metric-support-lane',
  },
  {
    workflow: 'Review Work / Governance Ops',
    currentNavLabel: 'Governance Ops',
    expectedText: /Governance Work Queue|Steward Review Work Queues|Failed Profiles|Failed Lineage|Suspicious Lineage|Ownership And Stewardship Detail/i,
    migrationNote: 'Governance Ops opens on steward work queues with operational detail tucked into support lanes.',
    visualAnchor: '.review-work-queue-card',
    supportLaneSelector: 'details.governance-support-lane',
  },
  {
    workflow: 'Profiling',
    currentNavLabel: 'Profiling',
    expectedText: /Queue Health|Live Profile Queues|Completed|Needs Attention|Next Run|Advanced \/ Operator Tools/i,
    migrationNote: 'Profiling opens on queue health first, with operator controls tucked into Advanced.',
    visualAnchor: '.profile-default-schedules',
    supportLaneSelector: 'details.profile-support-lane',
  },
  {
    workflow: 'Connections',
    currentNavLabel: 'Connections',
    expectedText: /Connections|Intelligent Name|Login Check|Discovery Check|Connection Detail|Connection Builder/i,
    migrationNote: 'Connections opens on reusable source access inventory and selected connection detail, with builder/profiling links in support lanes.',
    visualAnchor: '.connector-detail-primary',
    supportLaneSelector: 'details.connections-support-lane',
  },
  {
    workflow: 'Lineage Acquisition',
    currentNavLabel: 'Lineage Acquisition',
    expectedText: /Lineage Acquisition Domain|SONIC_DW|Refresh Full Domain Evidence|Advanced Source Troubleshooting/i,
    migrationNote: 'Lineage Acquisition owns domain evidence refresh for SONIC_DW.',
    visualAnchor: 'details.lineage-acquisition-support-lane',
    supportLaneSelector: 'details.lineage-acquisition-support-lane',
  },
  {
    workflow: 'Platform Admin',
    currentNavLabel: 'Platform Admin',
    expectedText: /Platform Operations Overview|User Administration|User Snapshot|Platform Health|Audit Trail|Advanced Diagnostics/i,
    migrationNote: 'Platform Admin opens on safe operational overview with raw diagnostics collapsed.',
    visualAnchor: '.admin-overview-card',
    supportLaneSelector: 'details.admin-support-lane',
  },
  {
    workflow: 'Data Products future-state',
    currentNavLabel: 'Data Products',
    expectedText: /Data Products Future-State|Parked Until Product Definition Is Explicit|Find reports and assets|Understand impact|Compare metrics/i,
    migrationNote: 'Data Products is parked until a concrete product definition exists.',
    visualAnchor: '.data-products-future-card',
  },
];

test.describe('UI workflow architecture smoke coverage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await signInIfNeeded(page);
  });

  for (const workflowCase of workflowSmokeCases) {
    test(`${workflowCase.workflow} surface renders a recognizable default state`, async ({ page }) => {
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
        await expect(page.locator('body')).not.toContainText(/Common starts|Recent Catalog Objects|Pipeline Progress|Role Shortcuts|Quality Radar|Persona Insights|Platform Health|Run Next Step|Demo Data|Refresh All/i);
      }
      if (workflowCase.workflow === 'Review Work / Governance Ops') {
        await expect(page.locator('details.governance-support-lane[open]')).toHaveCount(0);
        await expect(page.locator('.review-work-queue-card')).toHaveCount(3);
      }
      if (workflowCase.workflow === 'Connections') {
        await expect(page.locator('details.connector-builder-lane[open]')).toHaveCount(0);
        await expect(page.locator('.connector-detail-primary')).toBeVisible();
      }
      if (workflowCase.workflow === 'Profiling') {
        await expect(page.locator('details.profile-support-lane[open]')).toHaveCount(0);
        await expect(page.locator('.profile-queue-answer')).toBeVisible();
        await expect(page.locator('.profile-default-schedules')).toBeVisible();
        await expect(page.locator('details.profile-support-lane:not([open]) .profile-support-body')).toBeHidden();
        await expect(page.getByRole('button', { name: /Start Worker/i })).toBeHidden();
        await expect(page.getByRole('button', { name: /Publish Pending Profiles/i })).toHaveCount(0);
      }
      if (workflowCase.workflow === 'Lineage Acquisition') {
        await expect(page.locator('details.lineage-acquisition-support-lane[open]')).toHaveCount(0);
        await expect(page.getByRole('button', { name: /Refresh Full Domain Evidence/i })).toBeVisible();
      }
      if (workflowCase.workflow === 'Platform Admin') {
        await expect(page.locator('details.admin-support-lane[open]')).toHaveCount(0);
        await expect(page.locator('details.admin-support-lane:not([open]) .admin-support-body')).toBeHidden();
      }
    });
  }

  test('Home search shows ranked results in place and opens asset detail on selection', async ({ page }) => {
    await openWorkflow(page, 'Home / Find Data');

    await page.getByPlaceholder(/Search a table, metric, owner/i).fill('DimVehicle');
    await page.getByRole('button', { name: /^Search$/ }).click();

    const results = page.locator('.home-result-row');
    await expect(results.first()).toBeVisible({ timeout: 20000 });
    await expect(page.locator('body')).toContainText(/Results|Showing .*result/i);
    await expect(navList(page).getByText('Search', { exact: true })).toHaveCount(0);

    await results.first().click();
    await expect(page.locator('.asset-detail-hero')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('body')).toContainText(/Business Summary|Lineage & Impact|Explore lineage/i);

    await page.locator('.catalog-lineage-entry').getByRole('button', { name: 'Explore lineage' }).click();
    await expect(page.locator('.selected-lineage-brief')).toBeVisible({ timeout: 20000 });
    await expect(page.locator('body')).toContainText(/Selected Asset Lineage|Business Uses|Load Jobs|Show Graph & Evidence/i);
    await expect(page.locator('body')).not.toContainText('Answer Rows');
    await expect(page.locator('.lineage-object-picker-row')).toHaveCount(0);
    await expect(page.locator('#lineage-graph-drilldowns')).toHaveCount(0);
    await page.getByRole('button', { name: 'Show Graph & Evidence' }).click();
    await expect(page.locator('#lineage-graph-drilldowns')).toBeVisible({ timeout: 10000 });
  });
});

test.describe('Role-aware workflow navigation', () => {
  test('User navigation hides advanced operator pages', async ({ page }) => {
    await page.goto('/?view=admin', { waitUntil: 'networkidle' });
    await signInIfNeeded(page, 'user@example.local');

    await expect(page.locator('body')).toContainText(/What data are you looking for\?|Search or ask about data/i);
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
      'Search',
      'Asset Detail',
      'Lineage Assistant',
      'Lineage Explorer',
    ]);
  });

  test('Analyst navigation includes Profiling but hides admin-only pages', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await signInIfNeeded(page, 'analyst@example.local');

    await expectNavVisible(page, ['Home / Find Data', 'Profiling']);
    await expectNavHidden(page, ['Connections', 'Lineage Acquisition', 'Platform Admin', 'Governance Ops', 'Search', 'Asset Detail', 'Lineage Explorer', 'Lineage Assistant']);
  });

  test('Data Steward navigation includes Review Work without raw operator pages', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await signInIfNeeded(page, 'steward@example.local');

    await expectNavVisible(page, ['Home / Find Data', 'Business Glossary', 'Governance Ops']);
    await expectNavHidden(page, ['Connections', 'Lineage Acquisition', 'Platform Admin', 'Profiling', 'Trust & Compliance', 'Search', 'Asset Detail', 'Lineage Explorer', 'Lineage Assistant']);
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
    await expectNavHidden(page, ['Trust & Compliance', 'Lineage Explorer', 'Lineage Assistant']);
    await expectNavHidden(page, ['Search', 'Asset Detail']);
  });
});

test.describe('Connector profile UI fixes', () => {
  test('saved connector TEST is row-scoped and shows structured diagnostics', async ({ page, request }) => {
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
    expect((await list.json()).connectors.some((connector) => connector.id === connectorId)).toBeTruthy();

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

    const diagnostics = page.locator('.connector-test-diagnostics').filter({ hasText: connectorId });
    await expect(diagnostics).toContainText('Test diagnostics');
    await expect(diagnostics).toContainText('VendorData');
    await expect(diagnostics).toContainText('svc-ui-row-test', { timeout: 20000 });
    await expect(diagnostics).toContainText(connectorId);
  });
});
