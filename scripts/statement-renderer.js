'use strict';
// Opt-in renderer, with a pinned and explicitly approved upstream Lua filter.
// Do not install the official renderer
// globally: its index.js replaces marked for all Markdown extensions.
const { spawnSync } = require('node:child_process');
const { join } = require('node:path');
const { readFileSync } = require('node:fs');
const { createHash } = require('node:crypto');
const FILTER_SHA256 = '1e9e378702abb8d596872e9f7bd575dc84ac9e80602856acdf166d6fcab11f88';

// Icarus replaces the complete plugins map for a per-post override. Keep its
// existing site-wide boolean flags so PJAX selectors match the index page.
hexo.extend.filter.register('before_post_render', function (data) {
  if (data.engine !== 'statement' || !data.plugins) return data;
  const defaults = Object.fromEntries(Object.entries(this.theme.config.plugins || {})
    .filter(([, value]) => typeof value === 'boolean'));
  data.plugins = Object.assign(defaults, data.plugins);
  return data;
}, 0);

hexo.extend.renderer.register('statement', 'html', function (data) {
  const filter = join(this.base_dir, 'math-preview/vendor/statement.lua');
  const digest = createHash('sha256').update(readFileSync(filter)).digest('hex');
  if (digest !== FILTER_SHA256) throw new Error('Statement filter hash mismatch');
  // Preserve embedded HTML islands verbatim, including indented Route Six HTML.
  const args = ['--from=markdown+fenced_divs+raw_html+tex_math_dollars+footnotes-native_divs-native_spans-markdown_in_html_blocks',
    '--to=html5', '--mathjax', '--wrap=none',
    '--metadata-file=' + join(this.base_dir, 'math-preview/statement.yaml'),
    '--lua-filter=' + filter];
  const result = spawnSync('pandoc', args, {
    // Legacy article TeX escaped ampersands for its raw HTML spans. Preserve
    // the source, while giving Pandoc the same TeX the browser formerly saw.
    cwd: this.base_dir,
    input: data.text.replace(/\$\$[\s\S]*?\$\$|(?<!\\)\$(?!\$)[^\n]*?(?<!\\)\$(?!\$)/g,
      tex => tex.replace(/&amp;/g, '&')),
    encoding: 'utf8',
    timeout: 30000, maxBuffer: 16 * 1024 * 1024
  });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error('Pandoc: ' + result.stderr);
  if (result.stderr) this.log.warn(result.stderr.trim());
  return result.stdout;
}, true);

// Wrap after Hexo extracts <!--more-->, so index excerpts have balanced HTML.
hexo.extend.filter.register('after_post_render', function (data) {
  if (data.engine !== 'statement') return data;
  for (const key of ['content', 'excerpt', 'more']) {
    if (data[key]) data[key] = '<div class="math-article">' + data[key] + '</div>';
  }
  return data;
}, 99);

hexo.extend.injector.register('head_end', () =>
  '<link rel="stylesheet" href="' + hexo.config.root + 'css/math-statements.css">');
hexo.extend.injector.register('body_end', () =>
  '<script defer src="' + hexo.config.root + 'js/math-statements.js" data-mathjax-src="' +
  'https://cdn.jsdelivr.net/npm/mathjax@3.2.2/es5/tex-mml-chtml.js"></script>');
