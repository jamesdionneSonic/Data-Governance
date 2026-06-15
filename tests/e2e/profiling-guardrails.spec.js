import { test, expect } from '@playwright/test';

async function signInIfNeeded(page, email = 'admin@platform.local') {
  const signIn = page.getByRole('button', { name: /sign in/i });
  if (await signIn.isVisible().catch(() => false)) {
    await page.getByPlaceholder(/enter email/i).fill(email);
    await signIn.click();
    await page.waitForTimeout(500);
  }
}

async function openProfiling(page) {
  await page.getByText('Profiling', { exact: true }).first().click();
  await page.waitForLoadState('networkidle').catch(() => {});
}

async function expectNoBlankProfilingPage(page) {
  await expect(page.locator('.fatal-ui-fallback')).toHaveCount(0);
  await expect(page.locator('#app-root')).toBeVisible();
  await expect(page.locator('.profile-queue-answer')).toBeVisible();
  await expect(page.locator('.profile-default-schedules')).toBeVisible();
  const schedulerCard = await page.locator('.profile-scheduler-card').boundingBox();
  expect(schedulerCard?.width || 0).toBeGreaterThan(600);
  expect(schedulerCard?.height || 0).toBeGreaterThan(300);
}

function collectPageFailures(page, allowedConsoleErrorPatterns = []) {
  const failures = [];
  page.on('pageerror', (err) => {
    failures.push(`pageerror: ${err.message}`);
  });
  page.on('console', (message) => {
    if (message.type() === 'error') {
      const text = message.text();
      if (!allowedConsoleErrorPatterns.some((pattern) => pattern.test(text))) {
        failures.push(`console error: ${text}`);
      }
    }
  });
  return failures;
}

test.describe('Rendered Profiling guardrails', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' });
    await signInIfNeeded(page);
  });

  test('default Profiling surface renders queue health without operator DOM leakage', async ({
    page,
  }) => {
    const failures = collectPageFailures(page);

    await openProfiling(page);
    await expectNoBlankProfilingPage(page);
    await expect(page.locator('.page-intro')).toHaveCount(0);
    await expect(page.locator('.telemetry-banner')).toHaveCount(0);
    await expect(page.getByRole('heading', { name: 'Profiling' })).toHaveCount(1);
    await expect(page.getByRole('button', { name: /New Schedule/i })).toBeVisible();
    await expect(page.locator('details.profile-support-lane')).toHaveCount(0);
    await expect(page.locator('.profile-schedule-dialog')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText(
      /Advanced \/ Operator Tools|Start Worker|Stop Worker|Run Due|Run History|Publish Readiness|Schedule Settings|Publish Pending Profiles|New Queue Schedule/i
    );
    await expect(page.getByRole('button', { name: /Start Worker/i })).toHaveCount(0);

    expect(failures).toEqual([]);
  });

  test('schedule settings render publish target options without a Vue render error', async ({
    page,
  }) => {
    const failures = collectPageFailures(page);

    await openProfiling(page);
    await expectNoBlankProfilingPage(page);
    await page.getByRole('button', { name: /New Schedule/i }).click();

    await expect(page.locator('details.profile-support-lane')).toHaveCount(0);
    await expect(page.locator('.profile-schedule-dialog')).toBeVisible();
    await expect(page.locator('.profile-schedule-dialog')).toContainText(/New Queue Schedule/i);
    await expect(page.locator('.scheduler-editor-panel')).toBeVisible();
    await expect(page.locator('.scheduler-editor-panel')).toContainText(/Publish Targets/i);
    await expect(page.locator('.fatal-ui-fallback')).toHaveCount(0);
    await expect(page.locator('body')).not.toContainText(
      /Advanced \/ Operator Tools|Start Worker|Stop Worker|Run Due|Run History|Publish Readiness|UI render error|profilePublishTargetOptions is not a function/i
    );
    await page.getByRole('button', { name: /Close schedule editor/i }).click();
    await expect(page.locator('.profile-schedule-dialog')).toHaveCount(0);
    await expect(page.locator('.profile-default-schedules')).toBeVisible();

    expect(failures).toEqual([]);
  });

  test('persisted Profiling state and malformed schedule rows still render a usable queue list', async ({
    page,
  }) => {
    const failures = collectPageFailures(page, [/status of 404/i]);

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
    await openProfiling(page);

    await expectNoBlankProfilingPage(page);
    await expect(page.locator('.profile-default-schedules')).toContainText('Persisted Good Queue');
    await expect(page.locator('.profile-queue-health-row')).toHaveCount(1);
    await expect(page.locator('details.profile-support-lane')).toHaveCount(0);
    await expect(page.locator('.profile-page-issues')).toHaveCount(0);

    expect(failures).toEqual([]);
  });

  test('Profiling API failures render durable blockers instead of a blank page', async ({
    page,
  }) => {
    const failures = collectPageFailures(page, [/status of 503/i]);

    await page.route('**/api/v1/connectors/profile-schedules/status', async (route) => {
      await route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({
          status: 'error',
          message: 'Profile scheduler status unavailable for guardrail test',
        }),
      });
    });
    await page.route('**/api/v1/connectors/profile-schedules', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 503,
          contentType: 'application/json',
          body: JSON.stringify({
            status: 'error',
            message: 'Profile schedules unavailable for guardrail test',
          }),
        });
        return;
      }
      await route.fallback();
    });

    await openProfiling(page);

    await expectNoBlankProfilingPage(page);
    await expect(page.locator('.profile-page-issues')).toBeVisible();
    await expect(page.locator('.profile-page-issues')).toContainText(
      /Profile schedules could not be loaded|Profile scheduler status could not be checked/i
    );
    await expect(page.getByRole('button', { name: /Retry/i })).toBeVisible();
    await expect(
      page.locator('details.profile-support-lane:not([open]) .profile-support-body')
    ).toHaveCount(0);

    expect(failures).toEqual([]);
  });
});
