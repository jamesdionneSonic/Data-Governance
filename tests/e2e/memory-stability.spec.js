import { test, expect } from '@playwright/test';

async function signInIfNeeded(page) {
  const signIn = page.getByRole('button', { name: /sign in/i });
  if (await signIn.isVisible().catch(() => false)) {
    await signIn.click();
    await page.waitForTimeout(500);
  }
}

async function clickNav(page, name) {
  const item = page.getByText(name, { exact: false }).first();
  if (await item.isVisible().catch(() => false)) {
    await item.click();
    await page.waitForLoadState('networkidle').catch(() => {});
    await page.waitForTimeout(250);
  }
}

async function usedHeap(page) {
  return page.evaluate(() => {
    if (performance.memory?.usedJSHeapSize) return performance.memory.usedJSHeapSize;
    return 0;
  });
}

test.describe('App memory stability', () => {
  test('cycles major app views without page errors or runaway heap growth', async ({ page }) => {
    const pageErrors = [];
    const consoleErrors = [];
    const httpErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));
    page.on('console', (message) => {
      if (message.type() === 'error') consoleErrors.push(message.text());
    });
    page.on('response', (response) => {
      if (response.status() >= 400) {
        httpErrors.push({ status: response.status(), url: response.url() });
      }
    });

    await page.goto('/', { waitUntil: 'networkidle' });
    await signInIfNeeded(page);
    const baselineHeap = await usedHeap(page);

    const views = [
      'Home / Find Data',
      'Search',
      'Business Glossary',
      'Governance Ops',
      'Metric Intelligence',
      'Connections',
      'Lineage Acquisition',
      'Platform Admin',
    ];

    for (let pass = 0; pass < 3; pass += 1) {
      for (const view of views) {
        await clickNav(page, view);
      }
    }

    await clickNav(page, 'Metric Intelligence');

    const endingHeap = await usedHeap(page);
    const heapGrowth = baselineHeap && endingHeap ? endingHeap - baselineHeap : 0;

    expect(pageErrors).toEqual([]);
    expect(
      consoleErrors.filter((message) => !/favicon|ResizeObserver|Failed to load resource/i.test(message))
    ).toEqual([]);
    expect(httpErrors.filter((item) => !/favicon|\.ico($|\?)/i.test(item.url))).toEqual([]);
    if (endingHeap) {
      expect(endingHeap).toBeLessThan(300 * 1024 * 1024);
    }
    if (heapGrowth) {
      expect(heapGrowth).toBeLessThan(150 * 1024 * 1024);
    }
  });
});
