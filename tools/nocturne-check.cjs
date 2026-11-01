'use strict';

// Validate generated content independently of the presentation templates.
// This is intentionally offline: browser behavior is checked separately.
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const { createHash } = require('node:crypto');
const { parseDocument, DomUtils } = require('htmlparser2');
const args = process.argv.slice(2);
const state = path.resolve(__dirname, '../.nocturne-preview');
const suffix = args.includes('--subpath') ? '-subpath' : '';
const reportIndex = args.indexOf('--report');
const reportFile = reportIndex === -1 ? path.join(state, `build-nocturne${suffix}.json`) : path.resolve(args[reportIndex + 1]);
const build = JSON.parse(fs.readFileSync(reportFile, 'utf8'));
const origin = new URL(build.url);
const checks = [], warnings = [], documents = new Map();
const htmlRoutes = build.routes.filter(route => route.endsWith('.html'));

function htmlFile(route) {
  const relative = decodeURIComponent(route);
  return path.join(build.output, relative.endsWith('/') || !path.extname(relative) ? relative + 'index.html' : relative);
}

function localFile(value, route) {
  if (!value || /^(?:data|blob|javascript|mailto|tel):/i.test(value)) return null;
  const target = new URL(value, new URL(route, build.url));
  if (target.origin !== origin.origin) return null;
  assert(target.pathname.startsWith(build.root), `${route}: URL escaped the deployment root: ${value}`);
  return { target, file: htmlFile(target.pathname.slice(build.root.length)) };
}

function textHash(root) {
  const copy = parseDocument(DomUtils.getOuterHTML(root));
  for (const node of DomUtils.findAll(() => true, copy.children)) {
    if (['style', 'script', 'svg'].includes(node.name) || (node.attribs?.class || '').split(/\s+/).includes('ai-disclosure')) DomUtils.removeElement(node);
  }
  return createHash('sha256').update(DomUtils.textContent(copy).replace(/\s+/g, '')).digest('hex');
}

function mediaURL(value, route) {
  if (!value) return null;
  const url = new URL(value.startsWith('/') && !value.startsWith('//') && !value.startsWith(build.root) ? build.root + value.slice(1) : value, new URL(route, build.url));
  return url.href;
}

let checkedLinks = 0;
for (const route of htmlRoutes) {
  const file = htmlFile(route);
  assert(fs.existsSync(file), `Missing generated route: ${route}`);
  const html = fs.readFileSync(file, 'utf8');
  const doc = parseDocument(html);
  const elements = DomUtils.findAll(() => true, doc.children);
  documents.set(route, { html, doc, elements });
  const nav = elements.find(node => node.name === 'nav' && node.attribs?.['aria-label'] === '主导航');
  assert(nav, `${route}: missing main navigation`);
  const destinations = DomUtils.findAll(node => node.name === 'a', nav.children).map(node => node.attribs.href);
  assert.deepEqual(destinations, ['', 'archives/', 'atlas/', 'about/'].map(value => build.root + value), `${route}: main navigation must consistently link to four pages`);
  assert(!/(?:src|href)=["'][^"'\n]*\/(?:js\/(?:reading-mode|math-statements)\.js|css\/(?:reading-mode|math-statements|ai-disclosure)\.css)["']/.test(html), `${route}: duplicate legacy theme injection`);
  assert(!/src=["']https:\/\/giscus\.app\/client\.js/.test(html), `${route}: local preview must not load comments`);
  const ai = elements.filter(node => (node.attribs?.class || '').split(/\s+/).includes('ai-disclosure'));
  assert(ai.length <= 1, `${route}: duplicated AI disclosure`);
  for (const node of elements) {
    const attributes = node.attribs || {};
    for (const key of ['src', 'href', 'poster']) {
      const value = attributes[key];
      const local = localFile(value, route);
      if (!local) continue;
      assert(fs.existsSync(local.file), `${route}: missing ${key} target ${value}`);
      checkedLinks++;
    }
    if (attributes.srcset && !attributes.srcset.includes('data:')) {
      for (const entry of attributes.srcset.split(',')) {
        const value = entry.trim().split(/\s+/)[0];
        const local = localFile(value, route);
        if (local) { assert(fs.existsSync(local.file), `${route}: missing srcset target ${value}`); checkedLinks++; }
      }
    }
  }
}
checks.push(`${htmlRoutes.length} generated HTML routes; ${checkedLinks} local links and media references resolve inside ${build.root}`);
const atlas = documents.get('atlas/index.html');
assert(atlas && atlas.elements.some(node => node.name === 'script' && node.attribs.src === build.root + 'nocturne/atlas.js'), 'Standalone atlas must load its interaction script');
assert(atlas.elements.some(node => node.name === 'h1' && DomUtils.textContent(node) === '思想的星图'), 'Standalone atlas must have its own page heading');
checks.push('Four consistent page destinations in every main navigation; standalone atlas route and interaction script present');

let articleCount = 0;
for (const article of [...build.posts, ...(build.pages || []).filter(page => page.layout !== false && page.layout !== 'false')]) {
  const relative = article.path.replace(/^\/+/, '');
  const route = relative.endsWith('/') ? relative + 'index.html' : relative;
  const output = documents.get(route);
  assert(output, `${article.title}: missing article route ${route}`);
  const body = output.elements.find(node => Object.hasOwn(node.attribs || {}, 'data-article-content'));
  assert(body, `${article.title}: missing article content wrapper`);
  assert.equal(textHash(body), article.textHash, `${article.title}: authored body text changed`);
  const bodyNodes = DomUtils.findAll(() => true, [body]);
  const diagrams = bodyNodes.filter(node => (node.attribs?.class || '').split(/\s+/).includes('tikzjax'));
  assert.equal(diagrams.length, article.diagrams, `${article.title}: TikZ diagrams did not survive rendering`);
  const ids = new Set(bodyNodes.map(node => node.attribs?.id).filter(Boolean));
  for (const id of article.ids) assert(ids.has(id), `${article.title}: lost original anchor ${id}`);
  const bodyMedia = bodyNodes.filter(node => ['img', 'source', 'audio', 'video', 'iframe'].includes(node.name))
    .map(node => ({ tag: node.name, src: node.attribs.src, poster: node.attribs.poster })).filter(item => item.src || item.poster);
  const normalizedMedia = media => media.map(item => ({ tag: item.tag, src: mediaURL(item.src, route), poster: mediaURL(item.poster, route) }));
  assert.deepEqual(normalizedMedia(bodyMedia), normalizedMedia(article.media), `${article.title}: authored media changed`);
  const disclosures = output.elements.filter(node => (node.attribs?.class || '').split(/\s+/).includes('ai-disclosure'));
  assert.equal(disclosures.length, article.ai ? 1 : 0, `${article.title}: wrong AI disclosure count`);
  if (article.ai) assert((disclosures[0].attribs.class || '').includes('ai-disclosure--' + article.ai), `${article.title}: wrong AI disclosure level`);
  assert(!bodyNodes.some(node => (node.attribs?.class || '').split(/\s+/).includes('ai-disclosure')), `${article.title}: AI disclosure must be outside the authored body`);
  articleCount++;
}
checks.push(`${articleCount} published article/page bodies preserve source text, existing anchors, TikZ diagrams, media and AI attribution`);

if (build.search.enabled) {
  const entries = JSON.parse(fs.readFileSync(path.join(build.output, 'nocturne/search.json'), 'utf8'));
  const expected = [...build.posts, ...(build.search.includePages ? build.pages || [] : [])].filter(entry => entry.searchable);
  assert.equal(entries.length, expected.length, 'Search index does not cover all eligible published content');
  const urls = new Set();
  for (const entry of entries) {
    assert.equal(typeof entry.title, 'string');
    assert.equal(typeof entry.summary, 'string');
    assert.equal(typeof entry.text, 'string');
    assert(Array.isArray(entry.tags));
    assert(['mathematics', 'essays', 'poetry', 'fieldnotes'].includes(entry.kind), `${entry.title}: invalid search kind`);
    assert(/^\d{4}-\d{2}-\d{2}$/.test(entry.date), `${entry.title}: invalid search date`);
    assert(!urls.has(entry.url), 'Duplicate search URL: ' + entry.url);
    urls.add(entry.url);
    const local = localFile(entry.url, 'index.html');
    assert(local && fs.existsSync(local.file), `Invalid search destination: ${entry.url}`);
    assert(!/<(?:style|script)\b|\.route-six\s*\{|\.white-cat-essay\s*\{/i.test(entry.text), `${entry.title}: CSS or script leaked into search`);
    assert(!/\$\$|\\(?:newcommand|begin\{|end\{|Longleftrightarrow)/.test(entry.summary), `${entry.title}: raw math leaked into summary`);
  }
  for (const entry of expected) {
    const url = build.root + entry.path.replace(/^\/+/, '');
    assert([...urls].some(value => decodeURI(value) === decodeURI(url)), `${entry.title}: absent from search`);
  }
  checks.push(`${entries.length} searchable entries cover all eligible posts/pages with valid URLs, kinds and plain-text summaries`);
}

const { JSDOM } = require('jsdom');
const feed = new JSDOM(fs.readFileSync(path.join(build.output, 'atom.xml'), 'utf8'), { contentType:'text/xml' }).window.document;
assert.equal(feed.documentElement.namespaceURI,'http://www.w3.org/2005/Atom','Invalid Atom namespace');
const feedEntries = [...feed.querySelectorAll('entry')];
assert.equal(feedEntries.length,build.posts.length,'Feed must cover exactly the published posts');
const feedIds = new Set();
for (const entry of feedEntries) {
  const id=entry.querySelector('id').textContent;
  assert(!feedIds.has(id),'Duplicate feed entry');feedIds.add(id);
  const destination=localFile(entry.querySelector('link').getAttribute('href'),'index.html');
  assert(destination&&fs.existsSync(destination.file),'Invalid feed destination '+id);
  assert(!Number.isNaN(Date.parse(entry.querySelector('updated').textContent)),'Invalid Atom update time');
  assert(entry.querySelector('summary').textContent.trim(),'Empty feed summary');
}
for (const post of build.posts) assert([...feedIds].some(id=>decodeURI(new URL(id).pathname)===decodeURI(build.root+post.path.replace(/^\/+/,''))),'Post absent from Atom feed: '+post.title);
checks.push(`${feedEntries.length} unique published posts in valid Atom XML, with timestamps and resolvable local destinations`);

for (const route of build.routes.filter(route => route.endsWith('.css'))) {
  const css = fs.readFileSync(path.join(build.output, route), 'utf8');
  for (const match of css.matchAll(/url\(\s*(?:"((?:\\.|[^"\\])*)"|'((?:\\.|[^'\\])*)'|([^)]*))\s*\)/g)) {
    const value = (match[1] || match[2] || match[3] || '').trim();
    const local = localFile(value, route);
    if (local) assert(fs.existsSync(local.file), `${route}: missing CSS asset ${value}`);
  }
}
checks.push('Stylesheet asset URLs resolve; preview contains no legacy reading scripts or automatic comment requests');
warnings.push('This offline check does not verify visual layout, browser interactions, external services, MathJax typesetting or audio playback.');
const result = { builtAt: build.builtAt, checkedAt: new Date().toISOString(), root: build.root, checks, warnings };
fs.writeFileSync(path.join(state, `checks-nocturne${suffix}.json`), JSON.stringify(result, null, 2));
console.log(JSON.stringify(result, null, 2));
