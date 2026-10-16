'use strict';

const { stripHTML } = require('hexo-util');
const { disclosureFor } = require(require('node:path').join(hexo.base_dir, 'lib/ai-disclosure.cjs'));
hexo.extend.helper.register('afterlight_ai', post => disclosureFor(post.ai));

function plain(value) {
  return stripHTML(String(value || '')
    .replace(/<(style|script)\b[^>]*>[\s\S]*?<\/\1>/gi, '')
    .replace(/<div\b[^>]*class="ai-disclosure[^"]*"[^>]*>[\s\S]*?<\/div>\s*<\/div>/gi, ''))
    .replace(/\s+/g, ' ').trim();
}

function findPost(source) {
  return hexo.locals.get('posts').toArray().find(post =>
    post.published !== false && (post.source === '_posts/' + source || post.slug === source));
}

hexo.extend.helper.register('afterlight_post', findPost);
hexo.extend.helper.register('afterlight_summary', function (post, length = 90) {
  // Math source and custom HTML excerpts are often unsuitable as a list preview.
  if (!post.description && (post.engine === 'statement' || post.plugins?.mathjax)) return '';
  const value = plain(post.description || post.excerpt || post.content);
  return value.length > length ? value.slice(0, length).trimEnd() + '…' : value;
});
hexo.extend.helper.register('afterlight_mode', function (post) {
  const source = String(post.source || '').replace(/^_posts\//, '');
  if (hexo.theme.config.article_modes?.[source]) return hexo.theme.config.article_modes[source];
  if (post.engine === 'statement' || post.plugins?.mathjax || post.tikzjax) return 'math';
  return 'standard';
});
hexo.extend.helper.register('afterlight_featured', function () {
  return (hexo.theme.config.home?.featured || []).map(item => {
    const post = findPost(item.source);
    return post ? { ...item, post, image: item.image ? post.path + item.image : null, imageSource: item.image ? post.source.replace(/\.[^.]+$/, '') + '/' + item.image : null } : null;
  }).filter(Boolean).slice(0, 2);
});
hexo.extend.helper.register('afterlight_reading_time', post =>
  Math.max(1, Math.ceil(plain(post.content).length / 450)));
hexo.extend.helper.register('afterlight_plain', plain);
