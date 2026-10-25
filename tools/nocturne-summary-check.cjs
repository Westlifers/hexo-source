'use strict';

// Regression coverage for missing mathematical subjects in previews. Uses the
// existing generated article HTML as a fixture, without running Hexo or MathJax.
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { createRequire } = require('node:module');
const { parseDocument, DomUtils } = require('htmlparser2');
const base = path.resolve(__dirname, '..');
const helperPath = path.join(base, 'themes/nocturne/scripts/helpers.js');
const helpers = new Map();
vm.runInNewContext(fs.readFileSync(helperPath, 'utf8'), {
  require: createRequire(helperPath),
  hexo: { base_dir: base, theme: { config: {} }, extend: { helper: { register(name, value) { helpers.set(name, value); } } } }
}, { filename: helperPath });
const plain = helpers.get('n_plain'), summary = helpers.get('n_summary');

assert.equal(plain('<p>本文的出发点是 <span class="math inline">\\(Q\\)</span>-Set。</p>', true), '本文的出发点是 Q-Set。');
assert.equal(plain('Let $X$ equal the countable union $\\bigcup B_n$.', true), 'Let X equal the countable union ⋃ B_n.');
assert.equal(plain('这里 $Q$ 是任意交换幺 quantale。', true), '这里 Q 是任意交换幺 quantale。');
assert.equal(plain('For $\\epsilon>0$, $x\\in\\mathscr D$.', true), 'For ε>0, x∈𝒟.');
assert.equal(plain('$D\\in\\mathscr D$, $Q$, $\\mathcal Q$, $\\Bbb R$.', true), 'D∈𝒟, Q, 𝒬, ℝ.');
assert.equal(plain('$$\\bigl(a^2\\le a\\bigr)$$', true), '(a^2≤ a)');
assert.equal(plain('$$a^2\\le a \\Longrightarrow a^2=a$$', true), 'a^2≤ a ⇒ a^2=a');
assert.equal(plain('<math><semantics><mi>Q</mi><annotation encoding="application/x-tex">Q</annotation></semantics></math>-Set', true), 'Q-Set');
assert.equal(plain('<math><mfrac><mi>x</mi><msup><mi>y</mi><mn>2</mn></msup></mfrac></math>', true), '(x)/(y^(2))');
assert.equal(plain('<script type="math/tex">Q</script>-Set<script>alert(1)</script><style>hidden</style>', true), 'Q-Set');
assert.equal(plain('A <code>long program</code><pre>body</pre> B', true), 'A B');
assert.equal(plain('Cost $5 and $10.', true), 'Cost $5 and $10.');
assert.equal(plain('$\\unfamiliar{X}$', true), '\\unfamiliar{X}', 'Unknown notation must not be silently erased');
assert.equal(summary({ description: '人工摘要 $Q$-Set', excerpt: 'other', content: 'body' }), '人工摘要 Q-Set');

const suffix = process.argv.includes('--subpath') ? '-subpath' : '';
const build = JSON.parse(fs.readFileSync(path.join(base, `.nocturne-preview/build-nocturne${suffix}.json`), 'utf8'));
const expected = [
  ['integral-quantaloids-weak-tabularity-topos.md', 'Q-Set'],
  ['bounded-q-valued-sets-cartesian-closedness-topos.md', 'Q-valued sets'],
  ['Munkres-Topology-Solution-Chapter-5.md', 'Let X be a space. Let 𝒟 be a collection'],
  ['Munkres-Topology-Solution-Chapter-7.md', 'ε>0'],
  ['Munkres-Topology-Solution-Chapter-8.md', 'Let X equal the countable union ⋃ B_n.']
];
for (const [source, required] of expected) {
  const post = build.posts.find(post => post.source === '_posts/' + source);
  assert(post, 'Missing fixture: ' + source);
  const doc = parseDocument(fs.readFileSync(path.join(build.output, post.path, 'index.html'), 'utf8'));
  const body = DomUtils.findOne(node => Object.hasOwn(node.attribs || {}, 'data-article-content'), doc.children);
  assert(body, 'Missing article content: ' + source);
  const text = summary({ content: DomUtils.getInnerHTML(body) }, 320);
  assert(text.includes(required), `${source}: lost mathematical text: ${text}`);
  assert(!/\$\$|\\(?:newcommand|begin\{|end\{|Longleftrightarrow)/.test(text), source + ': raw display TeX in summary');
}

if (process.argv.includes('--generated')) {
  const index = JSON.parse(fs.readFileSync(path.join(build.output, 'nocturne/search.json'), 'utf8'));
  for (const [source, required] of expected) {
    const post = build.posts.find(post => post.source === '_posts/' + source);
    const entry = index.find(entry => entry.title === post.title);
    assert(entry.summary.includes(required), `${source}: generated summary is still missing math`);
    assert(entry.snippet.includes(required), `${source}: generated search context is still missing math`);
    assert.equal(entry.entryType, 'post');
  }
  assert.equal(index.filter(entry => entry.entryType === 'post').length, build.posts.length);
  assert(index.some(entry => entry.title === '关于我' && entry.entryType === 'page'));
}
console.log(`PASS mathematical preview text: 14 extraction cases and ${expected.length} real articles${process.argv.includes('--generated') ? ', including generated search summaries, snippets and entry types' : ''}.`);
