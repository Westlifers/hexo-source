const { disclosureFor } = require('../lib/ai-disclosure.cjs');

hexo.extend.filter.register('after_post_render', function (data) {
  if (hexo.config.theme === 'afterlight') return data;
  const info = disclosureFor(data.ai);
  if (!info) return data;
  const { level, note } = info;

  const disclosure = `
<div class="ai-disclosure ai-disclosure--${level}">
  <div class="ai-disclosure__header">
    <span class="ai-disclosure__icon">${info.icon}</span>
    <span class="ai-disclosure__label">${info.label}</span>
  </div>

  <div class="ai-disclosure__text">
    ${note}
  </div>
</div>
`;

  data.content = disclosure + data.content;

  return data;
});

hexo.extend.injector.register(
  'head_end',
  () => {
    if (hexo.config.theme === 'afterlight') return '';
    const css = hexo.extend.helper.get('css').bind(hexo);
    return css('/css/ai-disclosure.css');
  }
);