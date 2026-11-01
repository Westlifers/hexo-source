'use strict';

// Atlas is a proper destination, so every primary navigation item changes page.
hexo.extend.generator.register('nocturne-atlas', () => ({
  path: 'atlas/index.html',
  layout: ['atlas'],
  data: { title: '思想的星图', nocturne_atlas: true }
}));
