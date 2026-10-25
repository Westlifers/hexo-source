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
function setup({ url = 'https://example.test/blog/atlas/', data = fixture, fail = false, reduced = false, geometry = false, animations = false } = {}) {
  const dom = new JSDOM(`<section class="atlas-page" data-atlas data-atlas-url="/blog/atlas/">
    ${['all', 'mathematics', 'essays', 'poetry', 'fieldnotes'].map(kind => `<button data-atlas-filter="${kind}">${kind}</button>`).join('')}
    <div data-atlas-toolbar hidden><button data-atlas-relations>Relations</button><button data-atlas-copy>Copy</button><input data-atlas-share-url readonly hidden></div>
    <div class="atlas-stage"></div><p data-atlas-status></p></section>`, { url, runScripts: 'outside-only', pretendToBeVisual: true });
  const window = dom.window, document = window.document, media = new Map(), frames = new Map();
  const scrolls = [];
  window.HTMLElement.prototype.scrollIntoView = function (options) { scrolls.push({ element: this, options }); };
  const layout = { left: 24, top: 180, width: 640, height: 420, cardWidth: 260, cardHeight: 96, anchors: new Map() };
  const observers = [];
  const rect = (left, top, width, height) => ({ left, top, width, height, right: left + width, bottom: top + height, x: left, y: top, toJSON() { return { left, top, width, height }; } });
  const numbers = value => (value?.match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
  const placement = node => numbers(node.style.transform?.replace('translate3d', 'translate'));
  if (geometry) {
    const originalRect = window.Element.prototype.getBoundingClientRect;
    window.Element.prototype.getBoundingClientRect = function () {
      if (this.matches('.atlas-plot, .atlas-svg')) return rect(layout.left, layout.top, layout.width, layout.height);
      if (this.matches('.atlas-selection, .atlas-selection-card')) {
        const selection = this.matches('.atlas-selection') ? this : this.closest('.atlas-selection');
        const [x = 0, y = 0] = placement(selection);
        return rect(layout.left + x, layout.top + y, layout.cardWidth, layout.cardHeight);
      }
      if (this.matches('.atlas-node-core')) {
        const node = this.closest('.atlas-node');
        let point = layout.anchors.get(node.dataset.articleId);
        if (!point) {
          const [nx, ny] = numbers(node.getAttribute('transform'));
          const [cx = 0, cy = 0, zoom = 1] = numbers(this.closest('.atlas-world').getAttribute('transform'));
          const [, , width, height] = numbers(this.closest('svg').getAttribute('viewBox'));
          const scale = Math.min(layout.width / width, layout.height / height);
          point = [(layout.width - width * scale) / 2 + (cx + nx * zoom) * scale, (layout.height - height * scale) / 2 + (cy + ny * zoom) * scale];
        }
        return rect(layout.left + point[0] - 2, layout.top + point[1] - 2, 4, 4);
      }
      return originalRect.call(this);
    };
    for (const [property, key] of [['offsetWidth', 'cardWidth'], ['offsetHeight', 'cardHeight']]) {
      Object.defineProperty(window.HTMLElement.prototype, property, { configurable: true, get() { return this.matches('.atlas-selection, .atlas-selection-card') ? layout[key] : 0; } });
    }
    window.ResizeObserver = class {
      constructor(callback) { this.callback = callback; this.targets = new Set(); observers.push(this); }
      observe(target) { this.targets.add(target); }
      disconnect() { this.targets.clear(); }
    };
  }
  const motion = [];
  if (animations) window.HTMLElement.prototype.animate = function (keyframes, options) {
    let resolve, reject;
    const finished = new Promise((yes, no) => { resolve = yes; reject = no; });
    finished.catch(() => {});
    const animation = { target: this, keyframes, options, finished, cancelled: false,
      cancel() { this.cancelled = true; reject(new Error('Animation cancelled')); this.oncancel?.(); },
      finish() { this.onfinish?.(); resolve(); }
    };
    motion.push(animation);
    return animation;
  };
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
    window, document, frames, media, scrolls, layout, motion,
    root: document.querySelector('[data-atlas]'),
    click(selector) { const target = document.querySelector(selector); assert(target, selector); target.click(); },
    filter(kind) { document.querySelector(`[data-atlas-filter="${kind}"]`).click(); },
    step(milliseconds) { time += milliseconds; const batch = [...frames.values()]; frames.clear(); batch.forEach(callback => callback(time)); },
    resize() { observers.forEach(observer => observer.callback([...observer.targets].map(target => ({ target })))); window.dispatchEvent(new window.Event('resize')); },
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
    assert.equal(document.querySelector('.atlas-selection').hidden, false, 'Restored selection has a visible compact prompt');
    assert.equal(document.querySelector('.atlas-selection-title').textContent, 'Paper B');
    page.click('.atlas-selection-open');
    assert.equal(document.activeElement.className, 'atlas-detail-title', 'View introduction moves keyboard focus into the actual detail');
    assert.equal(page.scrolls.at(-1).options.behavior, 'smooth');
    assert.equal(document.querySelectorAll('.atlas-related-choice').length, 2);
    assert(document.querySelector('.atlas-related-reason').textContent.includes('共同标签：Topos'));
    assert.equal(document.querySelectorAll('.atlas-edge-explicit').length, 4, 'Only real shared tags/categories make explicit edges');
    assert.equal(document.querySelectorAll('.atlas-edge-topic').length, 3, 'Topic membership is separately identified');
    assert.equal(document.querySelectorAll('.atlas-edge.is-suppressed').length, 3);
    assert.equal(root.dataset.atlasRelationEdges, '7', 'Every evidenced relation remains in the graph');
    assert.equal(root.dataset.atlasBackboneEdges, '5', 'Overview uses a forest instead of a complete relation mesh');
    assert.equal(document.querySelectorAll('.atlas-edge.is-drawn').length, 2, 'A selected article reveals its entire explicit neighborhood');

    page.filter('essays');
    assert.equal(root.dataset.cameraRunning, 'true');
    assert.equal(window.history.length, 2);
    assert.equal(new URL(window.location.href).searchParams.get('keep'), '1', 'Other URL parameters survive');
    assert(!document.querySelector('.atlas-detail-link'), 'Changing topic clears an unrelated selected article');
    assert.equal(document.querySelector('.atlas-selection').hidden, true, 'An unrelated topic clears the compact prompt');
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
    assert.equal(document.querySelector('.atlas-selection').hidden, true, 'Escape also clears the compact prompt');
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
    assert(document.querySelector('.atlas-related-reason').textContent.includes('同属原文分类：旅行'));
    page.click('.atlas-selection-open');
    assert.equal(page.scrolls.at(-1).options.behavior, 'auto', 'Reduced motion does not animate the detail jump');
    const selectedId = document.querySelector('.atlas-node.is-selected').dataset.articleId;
    page.click('.atlas-selection-clear');
    assert.equal(document.querySelector('.atlas-selection').hidden, true);
    assert(!document.querySelector('.atlas-detail-link'));
    assert(!new URL(window.location.href).searchParams.has('star'));
    assert.equal(document.activeElement.dataset.articleId, selectedId, 'Clearing from the compact prompt returns focus to the originating star');
  } finally { page.close(); }

  const pages = setup({ data: [...fixture, { title: '关于我', url: '/blog/about/', kind: 'essays', entryType: 'page', date: '2026-01-01' }] });
  try {
    await flush();
    assert.equal(pages.document.querySelector('.atlas-selection').hidden, true, 'No prompt appears before a selection');
    assert(pages.document.querySelector('[data-atlas-status]').textContent.includes('8 篇文章 + 关于页'));
    pages.filter('essays');
    assert(pages.document.querySelector('.atlas-alternative summary').textContent.includes('2 篇文章 + 关于页'));
    const about = [...pages.document.querySelectorAll('.atlas-node')].find(node => node.getAttribute('aria-label').startsWith('关于我'));
    about.dispatchEvent(new pages.window.Event('click'));
    assert.equal(pages.document.querySelector('.atlas-detail-link').textContent, '打开页面');
    assert(pages.document.querySelector('.atlas-detail-meta').textContent.startsWith('页面'));
  } finally { pages.close(); }

  // Geometry is supplied as browser measurements, independently of the
  // popover's positioning code. SVG core coordinates include viewBox padding
  // and the moving world transform; labels are deliberately not measured.
  const anchored = setup({ geometry: true });
  try {
    await flush();
    const { document, window, layout } = anchored;
    const nodes = [...document.querySelectorAll('.atlas-node')];
    const selectedNode = nodes[0];
    const selection = document.querySelector('.atlas-selection');
    const coordinates = () => (selection.style.transform.replace('translate3d', 'translate').match(/-?\d+(?:\.\d+)?/g) || []).map(Number);
    const withinPlot = () => {
      const [x, y] = coordinates();
      assert(Number.isFinite(x) && Number.isFinite(y), 'Popover has a finite anchored position');
      assert(x >= 12 && y >= 12, 'Popover respects the top/left plot gutter');
      assert(x + layout.cardWidth <= layout.width - 12 + .01, 'Popover stays inside the right plot edge');
      assert(y + layout.cardHeight <= layout.height - 12 + .01, 'Popover stays inside the bottom plot edge');
    };
    layout.anchors.set(selectedNode.dataset.articleId, [320, 250]);
    selectedNode.dispatchEvent(new window.Event('click'));
    assert.equal(selection.parentElement.className, 'atlas-plot', 'Popover floats inside the plot rather than occupying a layout row');
    assert.equal(selection.dataset.placement, 'above');
    assert.deepEqual(coordinates().slice(0, 2), [190, 136], 'An interior star centers the card above its core, with an 18px gap');
    withinPlot();

    layout.anchors.set(selectedNode.dataset.articleId, [20, 20]); anchored.resize();
    assert.equal(selection.dataset.placement, 'below', 'A top-edge star flips the card below');
    assert.equal(coordinates()[0], 12, 'A left-edge star clamps the card to the gutter');
    withinPlot();
    layout.anchors.set(selectedNode.dataset.articleId, [320, 200]); anchored.resize();
    assert.equal(selection.dataset.placement, 'below', 'Repositioning keeps the current side while both sides fit');
    assert.equal(coordinates()[1], 218, 'A stable below placement follows the moving star with its 18px gap');
    selectedNode.dispatchEvent(new window.Event('click'));
    assert.equal(selection.dataset.placement, 'above', 'A fresh selection resets the preference to above');
    assert.equal(coordinates()[1], 86);
    layout.anchors.set(selectedNode.dataset.articleId, [20, 20]); anchored.resize();
    assert.equal(selection.dataset.placement, 'below');
    layout.anchors.set(selectedNode.dataset.articleId, [630, 400]); anchored.resize();
    assert.equal(selection.dataset.placement, 'above', 'A below placement flips only when the lower side no longer fits');
    assert.equal(coordinates()[0], layout.width - layout.cardWidth - 12, 'A right-edge star clamps the full card inside the plot');
    withinPlot();

    selectedNode.focus();
    selectedNode.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Tab', bubbles: true, cancelable: true }));
    assert.equal(document.activeElement.className, 'atlas-selection-open', 'Tab from the selected star reaches its popover directly');
    document.activeElement.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Tab', shiftKey: true, bubbles: true, cancelable: true }));
    assert.equal(document.activeElement, selectedNode, 'Shift-Tab returns to the anchored star');
    selection.querySelector('.atlas-selection-open').focus();
    selection.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert.equal(selection.hidden, true);
    assert.equal(document.activeElement, selectedNode, 'Escape inside the popover closes it and returns focus');

    layout.anchors.clear();
    selectedNode.dispatchEvent(new window.Event('click'));
    const before = selection.style.transform;
    anchored.filter('mathematics'); anchored.step(460);
    assert.notEqual(selection.style.transform, before, 'Popover follows its star during the camera move, not just on arrival');
    withinPlot();
    anchored.step(460); withinPlot();
    layout.width = 360; layout.height = 390; layout.cardWidth = 260;
    anchored.resize(); withinPlot();
    const mobile = anchored.media.get('(max-width: 640px)'); mobile.matches = true; mobile.change();
    assert.equal(document.querySelectorAll('.atlas-selection').length, 1, 'Breakpoint render reattaches exactly one popover');
    assert.equal(selection.parentElement.className, 'atlas-plot');
    assert.equal(selection.hidden, false, 'Breakpoint render retains the current selection');
    withinPlot();
  } finally { anchored.close(); }

  const animated = setup({ geometry: true, animations: true });
  try {
    await flush();
    const { document, window, motion } = animated;
    const nodes = [...document.querySelectorAll('.atlas-node')];
    const selection = document.querySelector('.atlas-selection');
    nodes[0].dispatchEvent(new window.Event('click'));
    assert.equal(selection.dataset.state, 'open');
    assert(motion.length > 0, 'Selection animates the card when motion is allowed');
    const entrance = motion.at(-1);
    nodes[1].dispatchEvent(new window.Event('click'));
    assert(entrance.cancelled, 'Rapid reselection cancels the old entrance');
    assert.equal(selection.querySelector('.atlas-selection-title').textContent, 'Paper B');
    animated.click('.atlas-selection-clear');
    assert.equal(selection.dataset.state, 'closing');
    assert.equal(selection.hidden, false, 'The exit can finish before the popover is hidden');
    assert.equal(selection.inert, true, 'An exiting popover cannot retain interactive focus');
    assert.equal(selection.getAttribute('aria-hidden'), 'true');
    const closing = motion.at(-1);
    nodes[2].dispatchEvent(new window.Event('click'));
    closing.finish(); // Deliberately deliver a stale completion after cancellation.
    await flush();
    assert.equal(selection.hidden, false, 'A stale close completion cannot hide a newer selection');
    assert.equal(selection.dataset.state, 'open');
    assert.equal(selection.querySelector('.atlas-selection-title').textContent, 'Paper C');
    assert.equal(selection.inert, false);
    animated.click('.atlas-selection-clear'); motion.at(-1).finish(); await flush();
    assert.equal(selection.hidden, true);
    assert.equal(selection.dataset.state, 'closed');
    nodes[0].dispatchEvent(new window.Event('click'));
    animated.click('.atlas-selection-clear');
    const interruptedExit = motion.at(-1);
    const reduced = animated.media.get('(prefers-reduced-motion: reduce)'); reduced.matches = true; reduced.change();
    assert(interruptedExit.cancelled, 'Enabling reduced motion settles an active exit immediately');
    assert.equal(selection.hidden, true);
    const priorAnimations = motion.length;
    nodes[0].dispatchEvent(new window.Event('click'));
    animated.click('.atlas-selection-clear');
    assert.equal(motion.length, priorAnimations, 'Reduced motion uses neither entrance nor exit animation');
    assert.equal(selection.hidden, true);
  } finally { animated.close(); }

  const retry = setup({ fail: true });
  try { await flush(); assert(retry.document.querySelector('.atlas-retry')); retry.click('.atlas-retry'); await flush(); assert.equal(retry.document.querySelectorAll('.atlas-node').length, 8); } finally { retry.close(); }
  const empty = setup({ data: [] });
  try { await flush(); assert(empty.document.querySelector('.atlas-empty')); empty.filter('poetry'); assert.equal(empty.document.querySelectorAll('.atlas-list li').length, 0); } finally { empty.close(); }
  const early = setup();
  try { early.filter('poetry'); await flush(); assert.equal(early.root.dataset.atlasView, 'poetry', 'A filter clicked during loading is respected'); } finally { early.close(); }

  // A shared category must not turn twelve articles into sixty-six overview
  // lines. Sparsification affects the drawing, never the evidence or list.
  const dense = setup({ data: Array.from({ length: 12 }, (_, index) => ({ title: `Study ${index + 1}`, url: `/blog/study-${index + 1}/`, kind: 'mathematics', categories: ['数学'], date: '2026-10-25' })) });
  try {
    await flush();
    const { document, root, window } = dense;
    const nodes = [...document.querySelectorAll('.atlas-node')];
    const edges = [...document.querySelectorAll('.atlas-edge')];
    const backbone = edges.filter(edge => edge.classList.contains('is-backbone'));
    assert.equal(edges.length, 66);
    assert.equal(backbone.length, 11);
    assert.equal(document.querySelectorAll('.atlas-edge.is-drawn').length, 11);
    assert.equal(document.querySelectorAll('.atlas-node.is-labeled').length, 2, 'Overview only labels a few landmarks');
    assert.equal(document.querySelectorAll('.atlas-orbit').length, 1, 'A region has one quiet orbit');
    const reached = new Set([nodes[0].dataset.articleId]);
    for (let pass = 0; pass < nodes.length; pass++) backbone.forEach(edge => {
      if (reached.has(edge.dataset.atlasA)) reached.add(edge.dataset.atlasB);
      if (reached.has(edge.dataset.atlasB)) reached.add(edge.dataset.atlasA);
    });
    assert.equal(reached.size, nodes.length, 'Sparse drawing preserves reachability inside a connected group');
    dense.filter('mathematics'); dense.step(920);
    assert.equal(document.querySelectorAll('.atlas-node.is-labeled').length, 12, 'Entering a subgraph reveals its article titles');
    const chosen = nodes[0]; chosen.dispatchEvent(new window.Event('click'));
    const active = [...document.querySelectorAll('.atlas-edge.is-drawn')];
    assert.equal(active.length, 11);
    assert(active.every(edge => [edge.dataset.atlasA, edge.dataset.atlasB].includes(chosen.dataset.articleId)), 'Only the active article neighborhood is drawn');
    assert(active.some(edge => !edge.classList.contains('is-backbone')), 'Previously hidden true edges reappear on selection');
    assert.equal(document.querySelectorAll('.atlas-related-choice').length, 11, 'No relationships are lost from the article list');
    assert(!document.querySelector('[data-atlas-status]').textContent.includes('共同分类'), 'Status stays short; reasons live in the relationship list');
    chosen.dispatchEvent(new window.KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    assert.deepEqual([...document.querySelectorAll('.atlas-edge.is-drawn')], backbone, 'Escape restores the original sparse overview');
    assert.deepEqual([...document.querySelectorAll('.atlas-edge')], edges, 'Focus never replaces edge elements');
    assert.equal(root.dataset.atlasDrawnEdges, '11');
  } finally { dense.close(); }
  console.log('Atlas checks passed: anchored popover placement, clamping/flipping, animation cancellation, keyboard access and detail navigation, post/page counts, sparse evidence-preserving overview, full article neighborhoods, persistent graph, interrupted camera, URL restoration, sharing fallback, mobile/reduced motion, retry and empty states.');
})().catch(error => { console.error(error); process.exitCode = 1; });
