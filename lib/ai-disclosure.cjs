'use strict';
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

exports.disclosureFor = function (ai) {
  const level = typeof ai === 'string' ? ai : ai?.level;
  if (!Object.hasOwn(AI_LEVELS, level)) return null;
  const info = AI_LEVELS[level];
  if (!info) return null;
  return { ...info, level, note: typeof ai === 'object' && ai.note ? ai.note : info.text };
};
