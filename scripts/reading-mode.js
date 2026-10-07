// Site-owned extension: keep Icarus and its dependencies untouched.
hexo.extend.injector.register('head_end', () => {
  const url = hexo.extend.helper.get('url_for').bind(hexo);
  return `<link rel="stylesheet" href="${url('/css/reading-mode.css')}">`;
});
hexo.extend.injector.register('body_end', () => {
  const url = hexo.extend.helper.get('url_for').bind(hexo);
  return `<script defer src="${url('/js/reading-mode.js')}"></script>`;
});
