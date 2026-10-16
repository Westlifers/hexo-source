'use strict';

const { parseDocument, DomUtils } = require('htmlparser2');
const { slugize, escapeHTML } = require('hexo-util');

// Raw HTML headings do not receive Markdown's automatic IDs. Add only missing
// anchors to the rendered copy, preserving the source and every existing ID.
hexo.extend.helper.register('afterlight_reading_content', content => {
  const html = String(content || '');
  const doc = parseDocument(html, { withStartIndices: true });
  const elements = DomUtils.findAll(() => true, doc.children);
  const used = new Set(elements.map(node => node.attribs?.id).filter(Boolean));
  const edits = [];
  for (const node of elements) {
    if (!/^h[1-6]$/.test(node.name) || 'id' in node.attribs) continue;
    const base = slugize(DomUtils.textContent(node).trim()) || 'section';
    let id = base, suffix = 2;
    while (used.has(id)) id = `${base}-${suffix++}`;
    used.add(id);
    edits.push({ at: node.startIndex + 3, text: ` id="${escapeHTML(id)}"` });
  }
  return edits.reverse().reduce((result, edit) => result.slice(0, edit.at) + edit.text + result.slice(edit.at), html);
});
