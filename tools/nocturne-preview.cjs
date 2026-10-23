'use strict';

// A local-only build with its own database, generated files and report.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { createHash } = require('node:crypto');
const { parseDocument, DomUtils } = require('htmlparser2');
const Hexo = require('hexo');
const connect = require('connect');
const serveStatic = require('serve-static');
const yaml = require('js-yaml');
const { disclosureFor } = require('../lib/ai-disclosure.cjs');

const base = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
function option(name, fallback) {
  const index = args.indexOf(name);
  if (index === -1) return fallback;
  if (!args[index + 1] || args[index + 1].startsWith('--')) throw new Error(`Missing value for ${name}`);
  return args[index + 1];
}
const port = Number(option('--port', '4186'));
const root = option('--root', '/');
if (!/^\/(?:[\w-]+\/)*$/.test(root)) throw new Error('Preview root must be a simple absolute directory path, such as /journal/');
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid preview port');

function evidence(content) {
  const doc = parseDocument(String(content || ''));
  const elements = DomUtils.findAll(() => true, doc.children);
  const ids = elements.map(node => node.attribs?.id).filter(Boolean);
  const media = elements.filter(node => ['img', 'source', 'audio', 'video', 'iframe'].includes(node.name))
    .map(node => ({ tag: node.name, src: node.attribs.src, poster: node.attribs.poster })).filter(item => item.src || item.poster);
  for (const node of elements) {
    if (['style', 'script', 'svg'].includes(node.name) || (node.attribs?.class || '').split(/\s+/).includes('ai-disclosure')) DomUtils.removeElement(node);
  }
  const text = DomUtils.textContent(doc).replace(/\s+/g, '');
  const diagrams = (String(content || '').match(/<!-- tikzjax-placeholder-\w+ -->/g) || []).length;
  return { textHash: createHash('sha256').update(text).digest('hex'), characters: text.length, ids, media, diagrams };
}

async function main() {
  const state = path.join(base, '.nocturne-preview');
  fs.mkdirSync(state, { recursive: true });
  // Refuse redirected output locations before replacing a previous preview.
  if (!fs.realpathSync(state).startsWith(fs.realpathSync(base) + path.sep)) throw new Error('Preview directory must stay inside this repository');
  const suffix = root === '/' ? '' : '-subpath';
  const output = path.resolve(state, 'nocturne' + suffix);
  if (!output.startsWith(path.resolve(state) + path.sep) || path.dirname(output) !== state) throw new Error('Invalid preview output directory');
  if (fs.existsSync(output) && fs.lstatSync(output).isSymbolicLink()) throw new Error('Preview output must not be a symbolic link');
  if (fs.existsSync(output)) fs.rmSync(output, { recursive: true, force: true });
  const cache = fs.mkdtempSync(path.join(state, 'cache-'));
  const override = path.join(cache, 'preview.yml');
  const url = `http://127.0.0.1:${port}${root}`;
  fs.writeFileSync(override, yaml.dump({
    theme: 'nocturne', public_dir: output, url, root, deploy: [],
    afterlight_preview: true, nocturne_preview: true
  }));
  const hexo = new Hexo(base, { output: cache, config: `${path.join(base, '_config.yml')},${override}`, silent: true });
  try {
    await hexo.init();
    await hexo.call('generate', { bail: true });
    const published = entry => entry.published !== false && !entry.source?.startsWith('_drafts/');
    const snapshot = entry => ({
      title: entry.title, source: entry.source, path: entry.path,
      searchable: entry.search !== false && entry.layout !== false && entry.layout !== 'false' && Boolean(entry.title),
      layout: entry.layout, ai: disclosureFor(entry.ai)?.level || null, ...evidence(entry.content)
    });
    const posts = hexo.locals.get('posts').toArray().filter(published).map(snapshot);
    const pages = hexo.locals.get('pages').toArray().filter(published).map(snapshot);
    const routes = hexo.route.list();
    const report = {
      theme: 'nocturne', root, url, output, posts, pages, routes,
      search: { enabled: hexo.theme.config.search?.enable !== false, includePages: hexo.theme.config.search?.include_pages !== false },
      builtAt: new Date().toISOString()
    };
    fs.writeFileSync(path.join(state, `build-nocturne${suffix}.json`), JSON.stringify(report, null, 2));
    console.log(`Built Nocturne: ${posts.length} posts, ${routes.length} routes. Output: ${output}`);
  } finally {
    try { await hexo.exit(); }
    finally {
      // These are disposable build inputs, separate from the served preview.
      const resolvedCache = fs.realpathSync(cache);
      if (path.dirname(resolvedCache) !== fs.realpathSync(state) || !path.basename(resolvedCache).startsWith('cache-')) throw new Error('Invalid preview cache directory');
      fs.rmSync(resolvedCache, { recursive: true, force: true });
    }
  }
  if (args.includes('--build-only')) return;
  const app = connect();
  app.use((req, res, next) => {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('X-Content-Type-Options', 'nosniff');
    next();
  });
  app.use(root, serveStatic(output, { index: ['index.html'], fallthrough: true }));
  app.use((req, res) => { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('页面不存在'); });
  const server = http.createServer(app);
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Local preview: ${url}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
}

main().catch(error => { console.error(error.stack); process.exitCode = 1; });
