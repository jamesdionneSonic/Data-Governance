/* global document */
import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const consoleErrors = [];

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });

  const hasLogin = await page.locator('.login-page').count();
  if (hasLogin) {
    await page.fill('input[placeholder*=email]', 'admin@platform.local');
    await page.click('button:has-text("Sign In")');
    await page.waitForTimeout(1200);
  }

  const stats = await page.evaluate(() => {
    const shell = document.querySelector('.app-shell');
    const main = document.querySelector('.main');
    const content = document.querySelector('.content');
    const hero = document.querySelector('.search-hero');
    const grid = document.querySelector('.grid');

    const dims = (element) => {
      if (!element) {
        return null;
      }
      const rect = element.getBoundingClientRect();
      return {
        w: Math.round(rect.width),
        h: Math.round(rect.height),
        x: Math.round(rect.x),
        y: Math.round(rect.y),
      };
    };

    const cards = Array.from(document.querySelectorAll('.card'))
      .slice(0, 8)
      .map((card) => {
        const rect = card.getBoundingClientRect();
        const title = card.querySelector('h3, h2, .section-title');
        return {
          w: Math.round(rect.width),
          h: Math.round(rect.height),
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          title: title ? title.textContent.trim().slice(0, 40) : '',
        };
      });

    return {
      shell: dims(shell),
      main: dims(main),
      content: dims(content),
      hero: dims(hero),
      grid: dims(grid),
      cardsCount: document.querySelectorAll('.card').length,
      cards,
    };
  });

  console.log(JSON.stringify(stats, null, 2));
  await page.screenshot({ path: 'tmp-overview.png', fullPage: true });
  await browser.close();

  if (consoleErrors.length) {
    console.log('CONSOLE_ERRORS');
    console.log(consoleErrors.join('\n'));
  }
})();
