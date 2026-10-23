'use strict';

const { parseDocument, DomUtils } = require('htmlparser2');
const { slugize, escapeHTML } = require('hexo-util');

hexo.extend.helper.register('n_reading_content', content => {
  const html = String(content || '');
  const doc = parseDocument(html, { withStartIndices: true });
  const elements = DomUtils.findAll(() => true, doc.children);
  const used = new Set(elements.map(node => node.attribs?.id).filter(Boolean));
  const root = hexo.config.root || '/';
  const edits = [];
  for (const node of elements) {
    if (/^h[1-6]$/.test(node.name) && !Object.hasOwn(node.attribs, 'id')) {
      const base = slugize(DomUtils.textContent(node).trim()) || 'section';
      let id = base, suffix = 2;
      while (used.has(id)) id = `${base}-${suffix++}`;
      used.add(id);
      edits.push({ at: node.startIndex + 3, length: 0, text: ` id="${escapeHTML(id)}"` });
    }
    if (root === '/' || !node.attribs) continue;
    // Change only URL attributes in the opening tag, leaving authored HTML,
    // styles, code samples and math source byte-for-byte intact.
    const end = html.indexOf('>', node.startIndex);
    const opening = html.slice(node.startIndex, end + 1);
    const attrs = /\s(href|src|poster)\s*=\s*(["'])(\/[^"']*)\2/gi;
    for (const match of opening.matchAll(attrs)) {
      const value = match[3];
      if (value.startsWith('//') || value.startsWith(root)) continue;
      const offset = match[0].indexOf(match[2]) + 1;
      edits.push({ at: node.startIndex + match.index + offset, length: value.length, text: root + value.slice(1) });
    }
  }
  return edits.sort((a, b) => b.at - a.at).reduce((result, edit) =>
    result.slice(0, edit.at) + edit.text + result.slice(edit.at + edit.length), html);
});
