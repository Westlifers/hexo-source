'use strict';

const path = require('node:path');
const { parseDocument, DomUtils } = require('htmlparser2');
const { disclosureFor } = require(path.join(hexo.base_dir, 'lib/ai-disclosure.cjs'));

const kinds = Object.freeze({
  mathematics: { key: 'mathematics', label: '数学' },
  essays: { key: 'essays', label: '随笔' },
  poetry: { key: 'poetry', label: '诗与声音' },
  fieldnotes: { key: 'fieldnotes', label: '人间漫游' }
});
const blockTags = new Set(['p', 'div', 'section', 'article', 'li', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'blockquote', 'tr', 'td', 'pre']);

// Text previews retain the mathematical nouns and relations that make a
// sentence meaningful. This is a conservative text transcription, not a TeX
// renderer: unfamiliar commands stay intact rather than silently disappearing.
const mathSymbols = Object.freeze({
  alpha:'α', beta:'β', gamma:'γ', delta:'δ', epsilon:'ε', varepsilon:'ε', theta:'θ', lambda:'λ', mu:'μ', pi:'π', sigma:'σ', tau:'τ', phi:'φ', psi:'ψ', omega:'ω',
  Gamma:'Γ', Delta:'Δ', Theta:'Θ', Lambda:'Λ', Sigma:'Σ', Phi:'Φ', Psi:'Ψ', Omega:'Ω',
  in:'∈', notin:'∉', ni:'∋', subset:'⊂', subseteq:'⊆', supset:'⊃', supseteq:'⊇', cup:'∪', bigcup:'⋃', cap:'∩', bigcap:'⋂', setminus:'∖', emptyset:'∅', varnothing:'∅',
  le:'≤', leq:'≤', ge:'≥', geq:'≥', ne:'≠', neq:'≠', equiv:'≡', cong:'≅', approx:'≈', sim:'∼',
  to:'→', rightarrow:'→', longrightarrow:'⟶', leftarrow:'←', mapsto:'↦', nrightarrow:'↛', Rightarrow:'⇒', Longrightarrow:'⇒', Leftarrow:'⇐', Longleftarrow:'⇐', Leftrightarrow:'⇔', Longleftrightarrow:'⇔', iff:'⇔', implies:'⇒',
  forall:'∀', exists:'∃', nexists:'∄', top:'⊤', bot:'⊥', land:'∧', wedge:'∧', bigwedge:'⋀', lor:'∨', vee:'∨', bigvee:'⋁', neg:'¬',
  times:'×', otimes:'⊗', oplus:'⊕', circ:'∘', cdot:'·', star:'⋆', ast:'*', dashv:'⊣', vdash:'⊢', perp:'⊥', infty:'∞', int:'∫', sum:'∑', prod:'∏',
  lbrace:'{', rbrace:'}', langle:'⟨', rangle:'⟩', lvert:'|', rvert:'|', vert:'|', mid:'|', ldots:'…', cdots:'⋯', dots:'…',
  lim:'lim', limsup:'lim sup', liminf:'lim inf', sup:'sup', inf:'inf', max:'max', min:'min', sin:'sin', cos:'cos', log:'log', exp:'exp', det:'det', dim:'dim', diam:'diam'
});
const scriptLetters = Array.from('𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏');
const doubleLetters = Array.from('𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫');
function mathStyle(style, text) {
  const alphabet = /^(?:mathcal|mathscr)$/.test(style) ? scriptLetters : /^(?:mathbb|Bbb)$/.test(style) ? doubleLetters : null;
  return alphabet ? text.replace(/[A-Za-z]/g, letter => alphabet['ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.indexOf(letter)]) : text;
}

function mathText(value) {
  return String(value)
    .replace(/\\(?:newcommand|renewcommand)\s*(?:\\[A-Za-z]+|\{\\[A-Za-z]+\})\s*(?:\[\d+\])?\s*\{[^{}]*(?:\{[^{}]*\}[^{}]*)*\}/g, '')
    .replace(/\\(?:begin|end)\{[^}]+\}/g, ' ')
    .replace(/\\(?:displaystyle|textstyle|scriptstyle|scriptscriptstyle|left|right|[bB]ig[glrm]?|[bB]igg[lr]?)\b/g, '')
    .replace(/\\(?:quad|qquad|enspace|thinspace)\b|\\[,;:! ]/g, ' ')
    .replace(/\\([A-Za-z]+)/g, (command, name) => mathSymbols[name] ?? command)
    .replace(/\\(mathcal|mathscr|mathbb|Bbb|mathrm|mathbf|mathit|mathsf|mathtt|operatorname|text)\s*(?:\{([^{}]*)\}|([A-Za-z]))/g, (_, style, grouped, single) => mathStyle(style, grouped ?? single))
    .replace(/\\(overline|bar)\s*(?:\{([^{}]*)\}|([A-Za-z]))/g, (_, mark, grouped, single) => `${mark}(${grouped ?? single})`)
    .replace(/\\(?:frac|dfrac|tfrac)\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g, '($1)/($2)')
    .replace(/\\sqrt\s*\{([^{}]*)\}/g, '√($1)')
    .replace(/\\([{}_%&#$])/g, '$1')
    .replace(/\\\\/g, '; ')
    .replace(/\s+/g, ' ').trim();
}

function mathMLText(node) {
  if (node.type === 'text') return node.data;
  if (['annotation', 'annotation-xml'].includes(node.name)) return '';
  const children = (node.children || []).filter(child => child.type !== 'text' || child.data.trim());
  const parts = children.map(mathMLText);
  if (node.name === 'mfrac') return `(${parts[0]})/(${parts[1]})`;
  if (node.name === 'msup') return `${parts[0]}^(${parts[1]})`;
  if (node.name === 'msub') return `${parts[0]}_(${parts[1]})`;
  if (node.name === 'msubsup') return `${parts[0]}_(${parts[1]})^(${parts[2]})`;
  if (node.name === 'msqrt') return `√(${parts.join('')})`;
  return parts.join('');
}

function plain(value, readableMath = false) {
  const document = parseDocument(String(value || ''), { decodeEntities: true });
  function read(node) {
    if (node.type === 'text') return node.data;
    const classes = (node.attribs?.class || '').split(/\s+/);
    if (readableMath && node.name === 'script' && /^math\/tex/.test(node.attribs?.type || '')) return mathText(DomUtils.textContent(node));
    if (['style', 'script', 'svg', 'template'].includes(node.name) || classes.includes('ai-disclosure')) return ' ';
    if (readableMath && ['pre', 'code'].includes(node.name)) return ' ';
    if (readableMath && ['math', 'mjx-container'].includes(node.name)) {
      const annotation = DomUtils.findOne(child => child.name === 'annotation' && /tex/i.test(child.attribs?.encoding || ''), node.children || []);
      const tex = node.attribs?.alttext || (annotation && DomUtils.textContent(annotation));
      const math = node.name === 'math' ? node : DomUtils.findOne(child => child.name === 'math', node.children || []);
      return tex ? mathText(tex) : mathMLText(math || node);
    }
    const text = (node.children || []).map(read).join('');
    return blockTags.has(node.name) ? ' ' + text + ' ' : text;
  }
  let text = document.children.map(read).join('');
  if (readableMath) text = text
    .replace(/\$\$([\s\S]*?)\$\$|\\\[([\s\S]*?)\\\]|\\\(([\s\S]*?)\\\)/g, (_, dollars, brackets, parens) => mathText(dollars ?? brackets ?? parens))
    .replace(/(?<!\\)\$(?!\s)([^$\n]*?\S)(?<!\\)\$/g, (_, formula) => mathText(formula));
  return text.replace(/\s+/g, ' ').trim();
}

function names(collection) {
  if (!collection) return [];
  const items = typeof collection.toArray === 'function' ? collection.toArray() : [].concat(collection);
  return items.flat(Infinity).map(item => typeof item === 'string' ? item : item.name || '').filter(Boolean);
}

function kind(post = {}) {
  const source = String(post.source || '').replace(/^_posts\//, '');
  const configured = hexo.theme.config.article_kinds?.[source];
  if (Object.hasOwn(kinds, configured)) return kinds[configured];
  const categories = names(post.categories).join(' '), tags = names(post.tags).join(' ');
  if (post.engine === 'statement' || /范畴论|拓扑学|代数|几何|Mathematics/i.test(categories)) return kinds.mathematics;
  if (/小诗|诗歌|音乐/.test(tags + ' ' + categories) || /^Route-Six\.md$/i.test(source)) return kinds.poetry;
  if (/旅行|游记|摄影|Minecraft/.test(categories + ' ' + tags) || /白猫|再到江安/.test(post.title || '')) return kinds.fieldnotes;
  if (post.plugins?.mathjax && String(post.source || '').startsWith('_posts/')) return kinds.mathematics;
  return kinds.essays;
}

function summary(post, length = 110) {
  const value = plain(post?.description || post?.excerpt || post?.content, true);
  const characters = Array.from(value);
  const limit = Math.max(1, Number(length) || 110);
  return characters.length > limit ? characters.slice(0, limit).join('').trimEnd() + '…' : value;
}

function wordCount(value) {
  const text = plain(value);
  const cjk = (text.match(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu) || []).length;
  const words = (text.replace(/[\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Hangul}]/gu, ' ').match(/[\p{L}\p{N}]+(?:['’-][\p{L}\p{N}]+)*/gu) || []).length;
  return { cjk, words, total: cjk + words };
}

function minutes(post) {
  const count = wordCount(post?.content);
  return Math.max(1, Math.ceil(count.cjk / 380 + count.words / 220));
}

function publishedPosts() {
  return hexo.locals.get('posts').toArray().filter(post => post.published !== false && !post.source?.startsWith('_drafts/'));
}

hexo.extend.helper.register('n_plain', plain);
hexo.extend.helper.register('n_summary', summary);
hexo.extend.helper.register('n_minutes', minutes);
hexo.extend.helper.register('n_kind', kind);
hexo.extend.helper.register('n_ai', post => disclosureFor(post?.ai));
hexo.extend.helper.register('n_post', source => {
  const key = String(source || '').replace(/^_posts\//, '');
  return publishedPosts().find(post => post.source === '_posts/' + key || post.source === source || post.slug === key);
});
hexo.extend.helper.register('n_asset', function (post, image) {
  if (!image) return '';
  if (/^(?:[a-z][a-z\d+.-]*:|\/\/)/i.test(image)) return image;
  const relative = image.startsWith('/') ? image : (post?.path || '') + image.replace(/^\.\//, '');
  return hexo.extend.helper.get('url_for').call(this, relative);
});
hexo.extend.helper.register('n_stats', () => {
  const posts = publishedPosts();
  const counts = Object.fromEntries(Object.keys(kinds).map(key => [key, 0]));
  let words = 0, totalMinutes = 0;
  const years = posts.map(post => Number(post.date.format('YYYY'))).filter(Number.isFinite);
  for (const post of posts) {
    counts[kind(post).key]++;
    words += wordCount(post.content).total;
    totalMinutes += minutes(post);
  }
  const firstYear = years.length ? Math.min(...years) : new Date().getFullYear();
  const latestYear = years.length ? Math.max(...years) : firstYear;
  return { posts: posts.length, articles: posts.length, words, minutes: totalMinutes, years: latestYear - firstYear + 1, firstYear, latestYear, kinds: counts };
});
