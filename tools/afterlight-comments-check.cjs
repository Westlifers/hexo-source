// Offline regression: no GitHub login, discussion, comment or reaction is sent.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { chromium } = require(process.env.AFTERLIGHT_PLAYWRIGHT_MODULE || 'playwright');

(async () => {
  const browser = await chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    page.setDefaultTimeout(10000);
    await page.route('**/*', route => {
      const url = route.request().url();
      let body;
      if (url === 'https://afterlight.test/') body = '<section data-comments data-preview="false"><button data-comments-load hidden>展开评论</button><span data-comments-status></span><div class="giscus"></div></section>';
      else if (url === 'https://giscus.app/client.js') body = `(() => { const frame = document.createElement('iframe'); frame.src = 'https://giscus.app/mock-discussion'; document.querySelector('.giscus').append(frame); })();`;
      else if (url === 'https://giscus.app/mock-discussion') body = '<textarea aria-label="Comment"></textarea>';
      else throw new Error('Unexpected request: ' + url);
      return route.fulfill({ body, headers: { 'access-control-allow-origin': '*' }, contentType: url.endsWith('.js') ? 'application/javascript' : 'text/html' });
    });
    await page.goto('https://afterlight.test/');
    await page.addScriptTag({ content: fs.readFileSync(path.join(__dirname, '../themes/afterlight/source/afterlight/comments.js'), 'utf8') });
    const button = page.locator('[data-comments-load]');
    const status = page.locator('[data-comments-status]');
    const mount = page.locator('.giscus iframe');
    async function load() {
      await button.click();
      await page.waitForFunction(() => document.querySelector('[data-comments-load]').hidden);
      return page.frames().find(frame => frame.url() === 'https://giscus.app/mock-discussion');
    }
    async function report(frame, error) {
      await frame.evaluate(error => parent.postMessage({ giscus: { error } }, 'https://afterlight.test'), error);
      // Barrier after postMessage delivery; no network-dependent delay.
      await page.waitForTimeout(100);
    }
    let frame = await load();
    await report(frame, 'Discussion not found');
    assert.equal(await mount.count(), 1, 'empty discussion must keep its widget');
    assert(await button.isHidden());
    assert.equal(await status.textContent(), '');
    await page.evaluate(() => window.postMessage({ giscus: { error: 'Untrusted message' } }, '*'));
    await page.waitForTimeout(100);
    assert.equal(await mount.count(), 1, 'messages outside the widget must be ignored');
    await report(frame, 'Repository not found');
    assert.equal(await mount.count(), 0, 'real errors must reset the widget');
    assert(await button.isVisible());
    assert.match(await status.textContent(), /重试/);
    frame = await load();
    await report(frame, 'Discussion not found');
    assert.equal(await mount.count(), 1, 'retry must recover to a usable empty widget');
    assert.equal(await status.textContent(), '');
    console.log('PASS comments: empty discussion, untrusted message, failure feedback and retry (offline).');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
