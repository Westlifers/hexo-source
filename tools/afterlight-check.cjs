'use strict';
// Run against the isolated preview. Browser automation is a development-only tool.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { chromium } = require(process.env.AFTERLIGHT_PLAYWRIGHT_MODULE || 'playwright');
const base = process.env.AFTERLIGHT_TEST_URL || 'http://127.0.0.1:4173/';
const state = path.resolve(__dirname, '../.afterlight-preview');
const build = JSON.parse(fs.readFileSync(path.join(state, 'build-afterlight.json')));
const legacy = JSON.parse(fs.readFileSync(path.join(state, 'build-icarus.json')));
const postPath = name => build.posts.find(post => post.source === '_posts/' + name).path;
const routes = {
  essay: postPath('做一首世俗的诗.md'), cat: postPath('日光之下，有一只白猫.md'),
  math: postPath('integral-quantaloids-weak-tabularity-topos.md'),
  oldMath: postPath('Munkres-Topology-Solution-Chapter-5.md'),
  music: postPath('route-six-song.md'), poem: postPath('Route-Six.md')
};

(async () => {
  const browser = await chromium.launch({ channel: process.env.AFTERLIGHT_BROWSER || 'chrome', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    const errors = [], externalComments = [], checks = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('request', request => { if (request.url().startsWith('https://giscus.app')) externalComments.push(request.url()); });
    const goto = route => page.goto(new URL(route, base).href, { waitUntil: 'networkidle' });
    const theme = page.locator('button[data-appearance]');

    // Generation boundaries: new theme owns its UI; legacy output retains its hooks.
    const docs = build.routes.filter(route => route.endsWith('.html')).map(route => ({ route, html: fs.readFileSync(path.join(build.output, route), 'utf8') }));
    for (const { route, html } of docs) {
      assert(!/(?:src|href)="[^"\n]*\/(?:js\/(?:reading-mode|math-statements)\.js|css\/(?:reading-mode|math-statements|ai-disclosure)\.css)"/.test(html), route + ': legacy injection');
      assert(!html.includes('src="https://giscus.app/client.js"'), route + ': comments should be deferred');
    }
    for (const post of build.posts) {
      const documents = [build.output, legacy.output].map(output => fs.readFileSync(path.join(output, post.path, 'index.html'), 'utf8'));
      const values = await page.evaluate(documents => documents.map(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html'), root = doc.querySelector('article.article > .content');
        const ai = [...doc.querySelectorAll('.ai-disclosure')].map(element => element.textContent.replace(/\s+/g, ''));
        root.querySelectorAll('.ai-disclosure').forEach(element => element.remove());
        return { ai, text: root.textContent.replace(/\s+/g, ' ').trim(), ids: [...root.querySelectorAll('[id]')].map(e => e.id), images: [...root.querySelectorAll('img')].map(e => e.getAttribute('src')) };
      }), documents);
      assert.deepEqual(values[0], values[1], post.title + ': content changed');
      assert(documents[1].includes('/js/reading-mode.js') && documents[1].includes('/js/math-statements.js'));
    }
    const links = await page.evaluate(docs => docs.flatMap(({ route, html }) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return [...doc.querySelectorAll('a[href], img[src], script[src], link[href], source[src]')].map(e => ({ route, value: e.getAttribute('href') || e.getAttribute('src') }));
    }), docs);
    for (const { route, value } of links) {
      const url = new URL(value, new URL(route, base));
      if (url.origin !== new URL(base).origin) continue;
      let file = decodeURIComponent(url.pathname).slice(new URL(base).pathname.length);
      if (file.endsWith('/')) file += 'index.html';
      assert(fs.existsSync(path.join(build.output, file)), route + ': missing ' + value);
    }
    checks.push('17 article bodies, anchors, images and AI disclosures match Icarus; all local links exist; no duplicate legacy injection');

    const index = JSON.parse(fs.readFileSync(path.join(build.output, 'afterlight/search.json')));
    assert.equal(index.length, 18); assert(!index.some(entry => entry.url.includes('math-statements-preview')));
    assert(!index.some(entry => /<style|<script|\.route-six\s*\{/.test(entry.text)));
    await goto(''); await page.locator('[data-search-open]').click();
    await page.locator('#search-input').fill('Quantaloid');
    await page.waitForFunction(() => document.querySelector('.search-results')?.children.length >= 2);
    assert((await page.locator('.search-results').innerText()).toLowerCase().includes('quantaloid'));
    await page.keyboard.press('Escape'); await page.waitForFunction(() => document.activeElement === document.querySelector('[data-search-open]'));
    await page.keyboard.press('Control+k'); assert(await page.locator('#search-dialog').evaluate(e => e.open));
    await page.locator('#search-input').fill('zzzz-no-result');
    await page.waitForFunction(() => document.querySelector('[data-search-status]').textContent.includes('没有找到'));
    await page.locator('#search-input').fill('Noema');
    await page.waitForFunction(() => document.querySelector('.search-results')?.children.length > 0);
    await page.screenshot({ path: path.join(state, 'phase-two-search.png') });
    await page.keyboard.press('Escape');
    // Failure must be retryable, without reloading the page.
    await page.reload(); let failIndex = true;
    await page.route('**/afterlight/search.json', route => failIndex ? route.abort() : route.continue());
    await page.locator('[data-search-open]').click(); await page.locator('[data-search-retry]').waitFor({ state: 'visible' });
    failIndex = false; await page.locator('[data-search-retry]').click();
    await page.locator('#search-input').fill('白猫');
    await page.waitForFunction(() => document.querySelector('.search-results')?.children.length > 0);
    await page.unroute('**/afterlight/search.json'); await page.keyboard.press('Escape');
    checks.push('search: title/body/tag index, no drafts or CSS, keyboard, empty results, failure and retry');

    await goto(routes.math);
    await page.waitForFunction(() => document.querySelectorAll('mjx-container').length > 20);
    assert.equal(await page.locator('mjx-merror').count(), 0);
    assert.equal(await page.locator('script[src*="tex-mml-chtml.js"]').count(), 1);
    assert.equal(await page.locator('.ai-disclosure').count(), 1);
    assert.equal(await page.locator('[data-article-content] .ai-disclosure').count(), 0);
    const proof = page.locator('details.proof').first(); const proofId = await proof.getAttribute('id');
    await proof.evaluate(e => { e.open = false; });
    await page.evaluate(id => { location.hash = encodeURIComponent(id); }, proofId);
    await page.waitForFunction(id => document.getElementById(id).open, proofId);
    const linkedProofs = await page.locator('.proof[data-proof-of]').count();
    assert.equal(await page.locator('.proof[data-proof-linked]').count(), linkedProofs);
    await page.locator('.post-meta [data-focus]').click();
    assert(await page.locator('body').evaluate(e => e.classList.contains('focus-reading')));
    const launcher = page.locator('[data-reading-launcher]');
    await launcher.click(); await page.locator('[data-directory-open]').click();
    assert(await page.locator('#reading-directory').evaluate(e => e.open));
    await page.keyboard.press('Escape');
    assert(await page.locator('body').evaluate(e => e.classList.contains('focus-reading')), 'closing a modal must not exit focus mode');
    await page.waitForFunction(() => document.activeElement === document.querySelector('[data-reading-launcher]'));
    await goto(routes.essay); assert(await page.locator('body').evaluate(e => e.classList.contains('focus-reading')));
    await page.reload(); assert(await page.locator('body').evaluate(e => e.classList.contains('focus-reading')));
    await page.keyboard.press('Escape'); assert(!(await page.locator('body').evaluate(e => e.classList.contains('focus-reading'))));
    let box = await launcher.boundingBox();
    await page.mouse.move(box.x + 22, box.y + 22); await page.mouse.down();
    await page.mouse.move(box.x - 180, box.y - 160, { steps: 8 }); await page.mouse.up();
    let moved = await launcher.boundingBox(); assert(moved.x < box.x - 100 && moved.y < box.y - 100);
    assert.equal(await launcher.getAttribute('aria-expanded'), 'false');
    await page.reload(); assert(Math.abs((await launcher.boundingBox()).x - moved.x) < 2);
    await launcher.focus(); await page.keyboard.press('Alt+ArrowLeft'); assert((await launcher.boundingBox()).x < moved.x - 10);
    await page.keyboard.press('Home'); assert((await launcher.boundingBox()).x > moved.x);
    await goto(''); assert.equal(await page.locator('.reading-tools').count(), 0); assert(!(await page.locator('body').evaluate(e => e.classList.contains('focus-reading'))));
    checks.push('math: single typesetting, proofs linked/revealed; reading: session persistence, modal Escape, drag, keyboard movement/reset');

    await goto(routes.cat); const firstImage = page.locator('.gallery-trigger').first();
    await firstImage.focus(); await page.keyboard.press('Enter');
    await page.waitForFunction(() => document.querySelector('.gallery-dialog img')?.naturalWidth > 0);
    assert.equal(await page.locator('[data-gallery-count]').innerText(), '1 / 5');
    await page.keyboard.press('ArrowRight'); assert.equal(await page.locator('[data-gallery-count]').innerText(), '2 / 5');
    await page.keyboard.press('Escape'); await page.waitForFunction(() => document.activeElement === document.querySelector('.gallery-trigger'));
    await theme.click(); await firstImage.click(); await page.screenshot({ path: path.join(state, 'phase-two-gallery-dark.png') });
    await page.keyboard.press('Escape');
    checks.push('gallery: actual photos, next/previous, keyboard opening/closing and focus restoration');

    const matrix = [];
    for (const [name, route] of Object.entries({ home: '', archives: 'archives/', page2: 'page/2/', about: 'about/', ...routes })) {
      await goto(route);
      if (name === 'math' || name === 'oldMath') await page.waitForFunction(() => document.querySelectorAll('mjx-container').length > 5);
      for (const width of [1440, 768, 390, 320]) {
        await page.setViewportSize({ width, height: 1000 });
        await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
        assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth + 1), name + ': overflow at ' + width);
        assert.equal(await page.locator('mjx-merror').count(), 0, name);
        matrix.push({ name, width });
      }
    }
    await goto(routes.math); await page.setViewportSize({ width: 390, height: 844 });
    await launcher.click(); await page.locator('[data-directory-open]').click();
    await page.screenshot({ path: path.join(state, 'phase-two-directory-mobile.png') }); await page.keyboard.press('Escape');
    await page.locator('.post-meta [data-focus]').click(); await launcher.click();
    await page.screenshot({ path: path.join(state, 'phase-two-tools-mobile.png') });
    await goto(routes.music);
    const audio = await page.locator('audio').evaluate(async element => {
      element.muted = true; await element.play(); await new Promise(resolve => setTimeout(resolve, 500));
      const result = { advanced: element.currentTime > 0, error: element.error?.code || null }; element.pause(); return result;
    });
    assert(audio.advanced && !audio.error);
    assert.equal(externalComments.length, 0); assert.equal(errors.length, 0, errors.join('\n'));
    checks.push(`${matrix.length} responsive states, dark surfaces, audio playback, no script errors or Giscus requests`);

    const noJS = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
    const fallback = await noJS.newPage(); await fallback.goto(new URL(routes.music, base).href);
    assert(await fallback.locator('[data-article-content]').evaluate(e => e.textContent.length > 100));
    assert.equal(await fallback.locator('.ai-disclosure').count(), 1);
    const privateContext = await browser.newContext();
    await privateContext.addInitScript(() => { for (const key of ['localStorage', 'sessionStorage']) Object.defineProperty(window, key, { get() { throw new DOMException('Disabled', 'SecurityError'); } }); });
    const privatePage = await privateContext.newPage(); await privatePage.goto(new URL(routes.essay, base).href);
    await privatePage.locator('.post-meta [data-focus]').click(); assert(await privatePage.locator('body').evaluate(e => e.classList.contains('focus-reading')));
    checks.push('no-JS content and AI notice; reading works with browser storage disabled');
    const touchPage = await browser.newPage({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
    await touchPage.goto(new URL(routes.math, base).href);
    const touchLauncher = touchPage.locator('[data-reading-launcher]'), touchBox = await touchLauncher.boundingBox();
    const cdp = await touchPage.context().newCDPSession(touchPage);
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchStart', touchPoints: [{ x: touchBox.x + 22, y: touchBox.y + 22 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchMove', touchPoints: [{ x: touchBox.x - 80, y: touchBox.y - 100 }] });
    await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
    assert((await touchLauncher.boundingBox()).x < touchBox.x - 60);
    assert.equal(await touchLauncher.getAttribute('aria-expanded'), 'false');
    await touchLauncher.tap(); await touchPage.locator('[data-directory-open]').tap();
    assert(await touchPage.locator('#reading-directory').evaluate(e => e.open));
    await touchPage.locator('#reading-directory nav a').last().click();
    await touchPage.waitForFunction(() => !document.querySelector('#reading-directory').open && location.hash.length > 1);
    checks.push('touch drag followed by tap and directory jump');
    fs.writeFileSync(path.join(state, 'phase-two-checks.json'), JSON.stringify({ checks, matrix, errors }, null, 2));
    console.log(JSON.stringify({ checks }, null, 2));
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
