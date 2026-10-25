'use strict';

// No build or browser server needed: exercise the atlas against a small,
// explicit relationship fixture, including interrupted motion and deep links.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const { JSDOM } = require('jsdom');
const script = fs.readFileSync(path.join(__dirname, '../themes/nocturne/source/nocturne/atlas.js'), 'utf8');
const fixture = [
  { title: 'Paper A', url: '/blog/paper-a/', kind: 'mathematics', tags: ['Topos'], date: '2026-10-25' },
  { title: 'Paper B', url: '/blog/paper-b/', kind: 'mathematics', tags: ['Topos'], date: '2026-10-24' },
  { title: 'Paper C', url: '/blog/paper-c/', kind: 'mathematics', tags: [], date: '2026-10-23' },
  { title: 'Essay A', url: '/blog/essay-a/', kind: 'essays', tags: ['Topos'], date: '2026-10-22' },
  { title: 'Essay B', url: '/blog/essay-b/', kind: 'essays', tags: [], date: '2026-10-21' },
  { title: 'Poem', url: '/blog/poem/', kind: 'poetry', tags: [], date: '2026-10-20' },
  { title: 'Walk A', url: '/blog/walk-a/', kind: 'fieldnotes', categories: ['旅行'], date: '2026-10-19' },
  { title: 'Walk B', url: '/blog/walk-b/', kind: 'fieldnotes', categories: ['旅行'], date: '2026-10-18' },
  { title: 'Unsafe URL', url: 'javascript:alert(1)', kind: 'essays' },
  null
];
const flush = () => new Promise(resolve => setImmediate(resolve));
function setup({ url = 'https://example.test/blog/atlas/', data = fixture, fail = false, reduced = false } = {}) {
  const dom = new JSDOM(`<section class="atlas-page" data-atlas data-atlas-url="/blog/atlas/">
    ${['all', 'mathematics', 'essays', 'poetry', 'fieldnotes'].map(kind => `<button data-atlas-filter="${kind}">${kind}</button>`).join('')}
    <div data-atlas-toolbar hidden><button data-atlas-relations>Relations</button><button data-atlas-copy>Copy</button><input data-atlas-share-url readonly hidden></div>
    <div class="atlas-stage"></div><p data-atlas-status></p></section>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const window = dom.window, document = window.document, media = new Map(), frames = new Map();
  let time = 0, nextFrame = 0, requests = 0;
  window.matchMedia = query => {
    if (!media.has(query)) media.set(query, { matches: query.includes('reduced-motion') && reduced, addEventListener(type, listener) { this.change = listener; } });
    return media.get(query);
  };
  window.fetch = async () => { requests++; if (fail && requests === 1) throw new Error('Offline'); return { ok: true, json: async () => data }; };
  Object.defineProperty(window.performance, 'now', { value: () => time });
  window.requestAnimationFrame = callback => { frames.set(++nextFrame, callback); return nextFrame; };
  window.cancelAnimationFrame = id => frames.delete(id);
  window.eval(script);
  return {
    window, document, frames, media,
    root: document.querySelector('[data-atlas]'),
    click(selector) { const target = document.querySelector(selector); assert(target, selector); target.click(); },
    filter(kind) { document.querySelector(`[data-atlas-filter="${kind}"]`).click(); },
    step(milliseconds) { time += milliseconds; const batch = [...frames.values()]; frames.clear(); batch.forEach(callback => callback(time)); },
    close() { window.close(); }
  };
}

(async () => {
  const page = setup({ url: 'https://example.test/blog/atlas/?atlas=mathematics&star=%2Fblog%2Fpaper-b%2F&relations=explicit&keep=1' });
  try {
    await flush();
    const { window, document, root } = page;
    const nodes = [...document.querySelectorAll('.atlas-node')];
    const edges = [...document.querySelectorAll('.atlas-edge')];
    const positions = nodes.map(node => node.getAttribute('transform'));
    const world = document.querySelector('.atlas-world');
    assert.equal(nodes.length, 8, 'Invalid URL and null entries are excluded');
    assert.equal(root.dataset.atlasView, 'mathematics');
    assert.equal(root.dataset.atlasSelected, '/blog/paper-b/');
    assert.equal(root.dataset.atlasRelations, 'explicit');
    assert.equal(document.querySelector('.atlas-detail-title').textContent, 'Paper B');
    assert.equal(document.querySelectorAll('.atlas-related-choice').length, 2);
    assert(document.querySelector('.atlas-related-reason').textContent.includes('共同标签：Topos'));
    assert.equal(document.querySelectorAll('.atlas-edge-explicit').length, 4, 'Only real shared tags/categories make explicit edges');
    assert.equal(document.querySelectorAll('.atlas-edge-topic').length, 3, 'Topic membership is separately identified');
    assert.equal(document.querySelectorAll('.atlas-edge.is-suppressed').length, 3);

    page.filter('essays');
    assert.equal(root.dataset.cameraRunning, 'true');
    assert.equal(window.history.length, 2);
    assert.equal(new URL(window.location.href).searchParams.get('keep'), '1', 'Other URL parameters survive');
    assert(!document.querySelector('.atlas-detail-link'), 'Changing topic clears an unrelated selected article');
    assert([...document.querySelectorAll('.atlas-node[tabindex="0"]')].every(node => node.dataset.atlasKind === 'essays'));
    page.step(350);
    const interrupted = world.getAttribute('transform');
    page.filter('poetry');
    assert.equal(world.getAttribute('transform'), interrupted, 'Interrupted camera starts at its actual position');
    page.step(920);
    assert.equal(page.frames.size, 0, 'Animation stops after arrival');
    assert.deepEqual([...document.querySelectorAll('.atlas-node')], nodes, 'Filters never recreate articles');
    assert.deepEqual(nodes.map(node => node.getAttribute('transform')), positions);
    assert.deepEqual([...document.querySelectorAll('.atlas-edge')], edges);

    page.filter('mathematics'); page.step(920);
    const mathNodes = nodes.filter(node => node.dataset.atlasKind === 'mathematics');
    const xy = node => node.getAttribute('transform').match(/[-\d.]+/g).map(Number);
    const leftmost = mathNodes.reduce((left, node) => xy(node)[0] < xy(left)[0] ? node : left);
    leftmost.focus();
    leftmost.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'ArrowRight', bubbles: true }));
    assert(xy(document.activeElement)[0] > xy(leftmost)[0], 'Right arrow moves right in the drawing');
    document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
    assert(document.querySelector('.atlas-detail-link'));
    const selectedNode = document.activeElement;
    selectedNode.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert(!document.querySelector('.atlas-detail-link'));
    assert(!new URL(window.location.href).searchParams.has('star'));

    // Restore URL state as the browser does on Back/Forward.
    window.history.replaceState(null, '', '?atlas=mathematics&star=%2Fblog%2Fpaper-b%2F&relations=explicit');
    window.dispatchEvent(new window.PopStateEvent('popstate'));
    const neighbor = document.querySelector('[data-atlas-neighbor="/blog/essay-a/"]');
    assert(neighbor, 'An explained cross-topic relation is available'); neighbor.click();
    assert.equal(root.dataset.atlasView, 'essays');
    assert.equal(root.dataset.atlasSelected, '/blog/essay-a/');
    assert.equal(document.activeElement.className, 'atlas-detail-title', 'Replacing relation choices preserves an intentional keyboard focus');

    page.click('[data-atlas-copy]'); await flush();
    const share = document.querySelector('[data-atlas-share-url]');
    assert.equal(share.hidden, false, 'Clipboard denial has a visible copy fallback');
    const sharedURL = new URL(share.value);
    assert.equal(sharedURL.pathname, '/blog/atlas/', 'Shared link respects deployment subpath');
    assert.equal(sharedURL.searchParams.get('star'), '/blog/essay-a/');
    let clipboard;
    Object.defineProperty(window.navigator, 'clipboard', { value: { writeText: async value => { clipboard = value; } } });
    page.click('[data-atlas-copy]'); await flush();
    assert.equal(clipboard, share.value);

    const motion = page.media.get('(prefers-reduced-motion: reduce)'); motion.matches = true; motion.change();
    page.filter('fieldnotes');
    assert.equal(root.dataset.cameraRunning, 'false'); assert.equal(page.frames.size, 0);
    const mobile = page.media.get('(max-width: 640px)'); mobile.matches = true; mobile.change();
    assert.equal(document.querySelector('.atlas-svg').getAttribute('viewBox'), '0 0 600 650');
    assert.equal(root.dataset.atlasView, 'fieldnotes');
    document.querySelector('.atlas-node[data-atlas-kind="fieldnotes"]').dispatchEvent(new window.Event('click'));
    assert(document.querySelector('.atlas-related-reason').textContent.includes('共同分类：旅行'));
  } finally { page.close(); }

  const retry = setup({ fail: true });
  try { await flush(); assert(retry.document.querySelector('.atlas-retry')); retry.click('.atlas-retry'); await flush(); assert.equal(retry.document.querySelectorAll('.atlas-node').length, 8); } finally { retry.close(); }
  const empty = setup({ data: [] });
  try { await flush(); assert(empty.document.querySelector('.atlas-empty')); empty.filter('poetry'); assert.equal(empty.document.querySelectorAll('.atlas-list li').length, 0); } finally { empty.close(); }
  const early = setup();
  try { early.filter('poetry'); await flush(); assert.equal(early.root.dataset.atlasView, 'poetry', 'A filter clicked during loading is respected'); } finally { early.close(); }
  console.log('Atlas checks passed: evidence-based links, persistent graph, interrupted camera, spatial keyboard navigation, URL restoration, sharing fallback, mobile/reduced motion, retry and empty states.');
})().catch(error => { console.error(error); process.exitCode = 1; });
