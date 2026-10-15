'use strict';

// Local-only builder: separate config, database and generated files from Icarus.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const Hexo = require('hexo');
const connect = require('connect');
const serveStatic = require('serve-static');
const yaml = require('js-yaml');

const base = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
function option(name, fallback) {
  const index = args.indexOf(name);
  return index === -1 ? fallback : args[index + 1];
}
const theme = option('--theme', 'afterlight');
if (!['afterlight', 'icarus'].includes(theme)) throw new Error('Unsupported preview theme');
const port = Number(option('--port', '4173'));
const root = option('--root', '/');
if (!/^\/(?:[\w-]+\/)*$/.test(root)) throw new Error('Preview root must be a simple absolute directory path');
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Invalid preview port');

async function main() {
  const state = path.join(base, '.afterlight-preview');
  fs.mkdirSync(state, { recursive: true });
  const cache = fs.mkdtempSync(path.join(state, 'cache-'));
  const output = path.join(state, theme + (root === '/' ? '' : '-subpath'));
  const override = path.join(cache, 'preview.yml');
  fs.writeFileSync(override, yaml.dump({ theme, public_dir: output, url: `http://127.0.0.1:${port}${root}`, root, deploy: [], afterlight_preview: true }));
  const hexo = new Hexo(base, { output: cache, config: `${path.join(base, '_config.yml')},${override}`, silent: true });
  await hexo.init();
  await hexo.call('generate', { bail: true });
  const posts = hexo.locals.get('posts').toArray();
  const routes = hexo.route.list();
  const report = {
    theme, root, output, posts: posts.map(post => ({ title: post.title, source: post.source, path: post.path })),
    routes, builtAt: new Date().toISOString()
  };
  fs.writeFileSync(path.join(state, `build-${theme}${root === '/' ? '' : '-subpath'}.json`), JSON.stringify(report, null, 2));
  await hexo.exit();
  console.log(`Built ${theme}: ${posts.length} posts, ${routes.length} routes. Output: ${output}`);
  if (args.includes('--build-only')) return;
  const app = connect();
  app.use((req, res, next) => { res.setHeader('Cache-Control', 'no-store'); next(); });
  app.use(root, serveStatic(output, { index: ['index.html'], fallthrough: true }));
  app.use((req, res) => { res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' }); res.end('页面不存在'); });
  const server = http.createServer(app);
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`Local: http://127.0.0.1:${port}${root}`));
  for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => server.close(() => process.exit(0)));
}
main().catch(error => { console.error(error.stack); process.exitCode = 1; });
