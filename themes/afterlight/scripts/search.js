'use strict';
hexo.extend.generator.register('afterlight-search', function (locals) {
  if (!this.theme.config.search?.enable) return [];
  const plain = this.extend.helper.get('afterlight_plain');
  const url = this.extend.helper.get('url_for').bind(this);
  const entries = [...locals.posts.toArray(), ...(this.theme.config.search.include_pages ? locals.pages.toArray() : [])]
    .filter(entry => entry.published !== false && entry.search !== false && entry.layout !== false && entry.title && !entry.source?.startsWith('_drafts/'))
    .map(entry => ({
      title: plain(entry.title), url: url(entry.path),
      tags: entry.tags?.toArray().map(tag => tag.name) || [],
      categories: entry.categories?.toArray().map(category => category.name) || [],
      text: plain(entry.content)
    }));
  return { path: 'afterlight/search.json', data: JSON.stringify(entries) };
});
