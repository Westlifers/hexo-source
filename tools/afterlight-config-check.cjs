'use strict';
// Build alternate settings in ignored output; never edit the author's config.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const Hexo = require('hexo');
const yaml = require('js-yaml');
const { chromium } = require(process.env.AFTERLIGHT_PLAYWRIGHT_MODULE || 'playwright');
const base = path.resolve(__dirname, '..');
const state = path.join(base, '.afterlight-preview');

async function build(themeConfig) {
  fs.mkdirSync(state, { recursive: true });
  const directory = fs.mkdtempSync(path.join(state, 'config-check-'));
  const output = path.join(directory, 'public');
  const config = path.join(directory, 'preview.yml');
  fs.writeFileSync(config, yaml.dump({ theme: 'afterlight', root: '/journal/', url: 'http://127.0.0.1:4173/journal/', public_dir: output, deploy: [], afterlight_preview: true, theme_config: themeConfig }));
  const hexo = new Hexo(base, { output: directory, config: `${path.join(base, '_config.yml')},${config}`, silent: true });
  try {
    await hexo.init();
    await hexo.call('generate', { bail: true });
    return { output, posts: hexo.locals.get('posts').toArray().map(p => p.path) };
  } finally { await hexo.exit(); }
}

(async () => {
  const browser = await chromium.launch({ channel: process.env.AFTERLIGHT_BROWSER || 'chrome', headless: true });
  try {
    const page = await browser.newPage();
    // Parse generated HTML without fetching images, scripts or remote services.
    async function read(build, route = 'index.html') {
      const html = fs.readFileSync(path.join(build.output, route), 'utf8');
      return page.evaluate(html => {
        const doc = new DOMParser().parseFromString(html, 'text/html');
        const text = selector => doc.querySelector(selector)?.textContent.trim();
        const link = selector => { const el = doc.querySelector(selector); return el && [el.textContent.trim(), el.getAttribute('href')]; };
        return {
          nav: [...doc.querySelectorAll('.site-nav a')].map(el => [el.textContent, el.getAttribute('href')]),
          active: [...doc.querySelectorAll('.site-nav [aria-current]')].map(el => el.textContent),
          eyebrow: text('.hero-copy .eyebrow'), intro: link('.hero-copy a'), quote: text('.hero-quote'), caption: text('figcaption'),
          selected: text('#selected-heading'), recent: text('#recent-heading'), archiveLink: link('.recent-section > .section-heading a'),
          note: text('.home-note p'), noteLink: link('.home-note a'), more: text('.feature-bottom a'),
          author: text('.post-meta > span'), footer: text('.footer-links span'), footerLink: link('.footer-links a'),
          archive: text('.archive-page h1'), archiveNote: text('.archive-page .section-note'), back: link('.reading-topline a'),
          dimensions: [doc.querySelector('.hero-photo img')?.getAttribute('width'), doc.querySelector('.hero-photo img')?.getAttribute('height')],
          injectedHTML: !!doc.querySelector('.hero-copy script, .site-nav b, .home-note b')
        };
      }, html);
    }
    const custom = await build({
      brand: { author: '测试作者' },
      navigation: [
        { label: '介绍 <b>原样文字</b>', url: '/about/index.html' },
        { label: '旧文', url: '/archives/' },
        { label: '主页', url: '/' },
        { label: '外部', url: 'https://example.com/about/' },
        { label: '锚点', url: '/about/#notes' },
        { label: '标签', url: '/tags/随笔/' }
      ],
      home: {
        eyebrow: 'NOTEBOOK', introduction_label: '从这里开始', quote: '<script>throw new Error()</script>',
        image_caption: '新的说明', image_width: 1200, image_height: 1800,
        featured_title: '精选', read_more_label: '阅读这篇', recent_title: '新文章',
        archive_link: { label: '查找旧文', url: '/archives/2026/' },
        note: { enable: true, text: '<b>日常</b>', link: { label: '作者介绍', url: '/about/' } }
      },
      footer: { link: { label: '联系入口', url: 'https://example.com/' }, credit: '我的日志' },
      archive: { title: '文字存档', note: '按时间阅读' },
      reading: { archive_link: { label: '返回存档', url: '/archives/2026/' } }
    });
    const home = await read(custom);
    assert.deepEqual(home.nav.map(item => item[0]), ['介绍 <b>原样文字</b>', '旧文', '主页', '外部', '锚点', '标签']);
    assert.equal(home.nav[0][1], '/journal/about/index.html');
    assert.equal(home.nav[3][1], 'https://example.com/about/');
    assert.deepEqual(home.active, ['主页']);
    assert.equal(home.eyebrow, '✳ NOTEBOOK');
    assert.match(home.intro[0], /从这里开始/);
    assert.equal(home.quote, '<script>throw new Error()</script>');
    assert.equal(home.injectedHTML, false);
    assert.equal(home.caption, '新的说明');
    assert.equal(home.selected, '精选');
    assert.equal(home.recent, '新文章');
    assert.match(home.more, /阅读这篇/);
    assert.deepEqual(home.archiveLink, ['查找旧文 ↗', '/journal/archives/2026/']);
    assert.equal(home.note, '<b>日常</b>');
    assert.deepEqual(home.noteLink, ['作者介绍 ↗', '/journal/about/']);
    assert.deepEqual(home.dimensions, ['1200', '1800']);
    assert.match(home.footer, /测试作者 · 我的日志$/);
    assert.deepEqual(home.footerLink, ['联系入口 ↗', 'https://example.com/']);
    for (const route of ['archives/index.html', 'archives/2026/index.html', 'archives/2026/09/index.html']) {
      const archive = await read(custom, route);
      assert.deepEqual(archive.active, ['旧文']);
      assert.equal(archive.archive, '文字存档');
      assert.equal(archive.archiveNote, '按时间阅读');
    }
    assert.deepEqual((await read(custom, 'page/2/index.html')).active, ['主页']);
    assert.deepEqual((await read(custom, 'tags/随笔/index.html')).active, ['标签']);
    const about = await read(custom, 'about/index.html');
    assert.deepEqual(about.active, ['介绍 <b>原样文字</b>']);
    assert.equal(about.author, '测试作者');
    assert.deepEqual(about.back, ['← 返回存档', '/journal/archives/2026/']);
    assert.equal((await read(custom, custom.posts[0] + 'index.html')).author, '测试作者');

    const hidden = await build({
      // Hexo's theme_config merge preserves inherited arrays for [] overrides.
      // Null removes it in this fixture; [] in the theme file also has no items.
      navigation: null,
      home: { eyebrow: '', quote: '', image_caption: '', introduction_label: '', note: { enable: false }, archive_link: { label: '' } },
      footer: { link: { label: '' }, credit: '' },
      archive: { eyebrow: '', note: '' }, reading: { archive_link: { label: '' } }
    });
    const minimal = await read(hidden);
    assert.deepEqual(minimal.nav, []);
    for (const field of ['eyebrow', 'intro', 'quote', 'caption', 'note', 'noteLink', 'archiveLink', 'footerLink']) assert(!minimal[field], field);
    assert(!minimal.footer.includes('·'));
    assert(!(await read(hidden, 'about/index.html')).back);
    assert(!(await read(hidden, 'archives/index.html')).archiveNote);
    console.log('PASS editable config: actual builds, text escaping, author, images, navigation order/active states, external links, subdirectory URLs and hidden sections.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
