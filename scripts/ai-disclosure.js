const AI_LEVELS = {
  assisted: {
    label: 'AI 辅助',
    icon: '◇',
    text: '本文使用生成式 AI 辅助资料检索、讨论或文字润色，内容由作者审定。'
  },

  substantial: {
    label: 'AI 深度辅助',
    icon: '◈',
    text: '本文在资料检索、观点讨论、结构组织及文字撰写中较多使用生成式 AI。核心观点、材料取舍与最终内容由作者审定。'
  },

  generated: {
    label: 'AI 生成',
    icon: '◆',
    text: '本文主体文本由生成式 AI 生成，并经作者审阅与修订。'
  }
};

hexo.extend.filter.register('after_post_render', function (data) {
  if (!data.ai) return data;

  const level =
    typeof data.ai === 'string'
      ? data.ai
      : data.ai.level;

  const info = AI_LEVELS[level];
  if (!info) return data;

  const note =
    typeof data.ai === 'object' && data.ai.note
      ? data.ai.note
      : info.text;

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
    const css = hexo.extend.helper.get('css').bind(hexo);
    return css('/css/ai-disclosure.css');
  }
);