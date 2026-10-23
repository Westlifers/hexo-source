'use strict';

const path = require('node:path');
const { parseDocument } = require('htmlparser2');
const { disclosureFor } = require(path.join(hexo.base_dir, 'lib/ai-disclosure.cjs'));

const kinds = Object.freeze({
  mathematics: { key: 'mathematics', label: '数学' },
  essays: { key: 'essays', label: '随笔' },
  poetry: { key: 'poetry', label: '诗与声音' },
  fieldnotes: { key: 'fieldnotes', label: '人间漫游' }
});
const blockTags = new Set(['p', 'div', 'section', 'article', 'li', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'tr', 'td', 'pre']);

function plain(value, omitMath = false) {
  const document = parseDocument(String(value || ''), { decodeEntities: true });
  function read(node) {
    if (node.type === 'text') return node.data;
    const classes = (node.attribs?.class || '').split(/\s+/);
    if (['style', 'script', 'svg', 'template'].includes(node.name) || classes.includes('ai-disclosure')) return ' ';
    if (omitMath && (['math', 'mjx-container', 'pre', 'code'].includes(node.name) || classes.includes('math'))) return ' ';
    const text = (node.children || []).map(read).join('');
    return blockTags.has(node.name) ? ' ' + text + ' ' : text;
  }
  let text = document.children.map(read).join('');
  if (omitMath) text = text
    .replace(/\$\$[\s\S]*?\$\$|\\\[[\s\S]*?\\\]|\\\([\s\S]*?\\\)/g, ' ')
    .replace(/(?<!\\)\$[^$\n]+?(?<!\\)\$/g, ' ');
  return text.replace(/\s+/g, ' ').trim();
}

function names(collection) {
  if (!collection) return [];
  const items = typeof collection.toArray === 'function' ? collection.toArray() : [].concat(collection);
  return items.flat(Infinity).map(item => typeof item === 'string' ? item : item.name || '').filter(Boolean);
}

function kind(post = {}) {
  const source = String(post.source || '').replace(/^_posts\//, '');
  const configured = hexo.theme.config.article_kinds?.[source];
  if (Object.hasOwn(kinds, configured)) return kinds[configured];
  const categories = names(post.categories).join(' '), tags = names(post.tags).join(' ');
  if (post.engine === 'statement' || /范畴论|拓扑学|代数|几何|Mathematics/i.test(categories)) return kinds.mathematics;
  if (/小诗|诗歌|音乐/.test(tags + ' ' + categories) || /^Route-Six\.md$/i.test(source)) return kinds.poetry;
  if (/旅行|游记|摄影|Minecraft/.test(categories + ' ' + tags) || /白猫|再到江安/.test(post.title || '')) return kinds.fieldnotes;
  if (post.plugins?.mathjax && String(post.source || '').startsWith('_posts/')) return kinds.mathematics;
  return kinds.essays;
}

function summary(post, length = 110) {
  const value = plain(post?.description || post?.excerpt || post?.content, true);
  const characters = Array.from(value);
  const limit = Math.max(1, Number(length) || 110);
  return characters.length > limit ? characters.slice(0, limit).join('').trimEnd() + '…' : value;
}

function wordCount(value) {
  const text = plain(value);
  const cjk = (text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu) || []).length;
  const words = (text.replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu, ' ').match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length;
  return { cjk, words, total: cjk + words };
}

function minutes(post) {
  const count = wordCount(post?.content);
  return Math.max(1, Math.ceil(count.cjk / 380 + count.words / 220));
}

function publishedPosts() {
  return hexo.locals.get('posts').toArray().filter(post => post.published !== false && !post.source?.startsWith('_drafts/'));
}

hexo.extend.helper.register('n_plain', plain);
hexo.extend.helper.register('n_summary', summary);
hexo.extend.helper.register('n_minutes', minutes);
hexo.extend.helper.register('n_kind', kind);
hexo.extend.helper.register('n_ai', post => disclosureFor(post?.ai));
hexo.extend.helper.register('n_post', source => {
  const key = String(source || '').replace(/^_posts\//, '');
  return publishedPosts().find(post => post.source === '_posts/' + key || post.source === source || post.slug === key);
});
hexo.extend.helper.register('n_asset', function (post, image) {
  if (!image) return '';
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(image)) return image;
  const relative = image.startsWith('/') ? image : (post?.path || '') + image.replace(/^\.\//, '');
  return hexo.extend.helper.get('url_for').call(this, relative);
});
hexo.extend.helper.register('n_stats', () => {
  const posts = publishedPosts();
  const counts = Object.fromEntries(Object.keys(kinds).map(key => [key, 0]));
  let words = 0, totalMinutes = 0;
  const years = posts.map(post => Number(post.date.format('YYYY'))).filter(Number.isFinite);
  for (const post of posts) {
    counts[kind(post).key]++;
    words += wordCount(post.content).total;
    totalMinutes += minutes(post);
  }
  const firstYear = years.length ? Math.min(...years) : new Date().getFullYear();
  const latestYear = years.length ? Math.max(...years) : firstYear;
  return { posts: posts.length, articles: posts.length, words, minutes: totalMinutes, years: latestYear - firstYear + 1, firstYear, latestYear, kinds: counts };
});
