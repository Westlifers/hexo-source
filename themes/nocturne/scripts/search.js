'use strict';

hexo.extend.generator.register('nocturne-search', function (locals) {
  if (this.theme.config.search?.enable === false) return [];
  const helper = name => this.extend.helper.get(name);
  const plain = helper('n_plain'), summary = helper('n_summary'), kind = helper('n_kind');
  const url = helper('url_for').bind(this);
  const entries = [...locals.posts.toArray(), ...(this.theme.config.search?.include_pages === false ? [] : locals.pages.toArray())]
    .filter(entry => entry.published !== false && entry.search !== false && entry.layout !== false && entry.layout !== 'false' && entry.title && !entry.source?.startsWith('_drafts/'))
    .sort((a, b) => b.date.valueOf() - a.date.valueOf())
    .map(entry => ({
      title: plain(entry.title), url: url(entry.path), summary: summary(entry, 160), text: plain(entry.content),
      tags: entry.tags?.toArray().map(tag => tag.name) || [],
      kind: kind(entry).key, date: entry.date.format('YYYY-MM-DD')
    }));
  // JSON is fetched as data; these escapes also keep it safe if a downstream
  // consumer ever embeds the response in an HTML script element.
  const data = JSON.stringify(entries).replace(/</g, '\\u003c').replace(/>/g, '\\u003e').replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028').replace(/\u2029/g, '\\u2029');
  return { path: 'nocturne/search.json', data };
});
