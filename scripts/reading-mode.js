// Site-owned extension: keep Icarus and its dependencies untouched.
// Afterlight owns its reading layout and does not use Icarus DOM selectors.
if (hexo.config.theme !== 'afterlight') {
  hexo.extend.injector.register('head_end', () => {
    const url = hexo.extend.helper.get('url_for').bind(hexo);
    return `<link rel="stylesheet" href="${url('/css/reading-mode.css')}">`;
  });
  hexo.extend.injector.register('body_end', () => {
    const url = hexo.extend.helper.get('url_for').bind(hexo);
    return `<script defer src="${url('/js/reading-mode.js')}"></script>`;
  });
}
