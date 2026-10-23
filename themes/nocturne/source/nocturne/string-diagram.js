/* Shared by Hexo and the browser: the first frame and interactive frames use
   exactly the same drawing. Geometry comes from the exported DisCoCat graph. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NocturneStringDiagram = factory();
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character]);
  const number = value => Number(value.toFixed(3));

  // A strictly increasing horizontal map gives short words enough room without
  // changing port order, connections, or the topology of the source drawing.
  function layout(candidate) {
    const anchors = [];
    let cursor = 28;
    for (const word of candidate.words) {
      const width = Math.max(42, word.text.length * 11 + 26, (word.ports.length - 1) * 26 + 32);
      anchors.push([word.x, cursor], [word.x + word.width, cursor + width]);
      cursor += width + 17;
    }
    const width = cursor + 11;
    function x(value) {
      let a = anchors[0], b = anchors[1];
      if (value > anchors[anchors.length - 1][0]) {
        a = anchors[anchors.length - 2]; b = anchors[anchors.length - 1];
      } else {
        for (let i = 1; i < anchors.length; i++) {
          b = anchors[i];
          if (value <= b[0]) { a = anchors[i - 1]; break; }
        }
      }
      return number(a[1] + (value - a[0]) / Math.max(.00001, b[0] - a[0]) * (b[1] - a[1]));
    }
    const top = 22, wordHeight = 42, lower = 350;
    const boxBottom = Math.max(...candidate.words.map(word => word.y + word.height));
    const bottom = candidate.bounds.y + candidate.bounds.height;
    const y = value => number(value <= boxBottom ? top + value / boxBottom * wordHeight : top + wordHeight + (value - boxBottom) / Math.max(.1, bottom - boxBottom) * (lower - top - wordHeight));
    const commands = strand => {
      const mapped = strand.commands.map(command => ({ op: command.op, points: command.points.map(point => [x(point[0]), y(point[1])]) }));
      const helpers = strand.helperIds.map(id => candidate.helpers.find(helper => helper.id === id));
      if (!candidate.stats.caps && !candidate.stats.swaps && helpers.length === 1 && helpers[0].kind === 'Cup' && strand.endpoints.every(endpoint => endpoint.kind === 'word')) {
        const first = mapped[0].points[0], last = mapped[mapped.length - 1].points.at(-1);
        const bottom = Math.max(...mapped.flatMap(command => command.points.map(point => point[1])));
        const span = last[0] - first[0], middle = (first[0] + last[0]) / 2;
        return [{ op:'M', points:[first] },
          { op:'C', points:[[first[0], first[1] + (bottom-first[1])*.72], [first[0]+span*.12,bottom], [middle,bottom]] },
          { op:'C', points:[[last[0]-span*.12,bottom], [last[0],last[1]+(bottom-last[1])*.72], last] }];
      }
      return mapped;
    };
    const path = strand => commands(strand).map(command => command.op + command.points.map(point => number(point[0]) + ',' + number(point[1])).join(' ')).join(' ');
    return { width, height: 400, x, y, path, commands };
  }

  function render(candidate, { interactive = false } = {}) {
    const project = layout(candidate), { width, height, x, y } = project;
    const prefix = 'string-' + candidate.id;
    const palette = [['#c5d2f1','#e5c3b7','#e6bc89'],['#aebfe3','#d7ccde','#f0d6b0'],['#d8b3d2','#e9d7c2','#c4d5e9']];
    const defs = candidate.strands.map((strand, index) => {
      const colors = strand.role === 'sentence' ? ['#f4d6a9','#f5d7b4','#dca56c'] : palette[index % palette.length];
      return `<linearGradient id="${prefix}-g${index}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${colors[0]}"/><stop offset=".55" stop-color="${colors[1]}"/><stop offset="1" stop-color="${colors[2]}"/></linearGradient>`;
    }).join('');
    const paths = candidate.strands.map((strand, index) => {
      const d = project.path(strand);
      return `<g class="string-strand ${strand.role === 'sentence' ? 'string-strand--sentence' : ''}" data-words="${escape(strand.wordIds.join(' '))}" data-strand="${escape(strand.id)}" style="--strand-delay:-${(index * 2.7).toFixed(1)}s;--strand-time:${19 + index % 4 * 3}s"><path class="string-halo" d="${d}" stroke="url(#${prefix}-g${index})"/><path class="string-thread" d="${d}" stroke="url(#${prefix}-g${index})"/><path class="string-specular" d="${d}"/><path class="string-flow" d="${d}" pathLength="1000"/></g>`;
    }).join('');
    const words = candidate.words.map(word => {
      const left = x(word.x), right = x(word.x + word.width), top = y(word.y), bottom = y(word.y + word.height);
      const ports = word.ports.map(port => `<circle class="string-port" cx="${x(port.x)}" cy="${y(port.y)}" r="2.2"/><text class="string-type" x="${x(port.x)}" y="${y(port.y) + 19}" text-anchor="middle">${escape(port.type.replace(/\.r/g,'ʳ').replace(/\.l/g,'ˡ'))}</text>`).join('');
      return `<g class="string-word" data-word="${escape(word.id)}"${interactive ? ` role="button" tabindex="0" aria-label="查看 ${escape(word.text)} 的连线" aria-pressed="false"` : ''}><rect class="string-word-glass" x="${left}" y="${top}" width="${number(right-left)}" height="${number(bottom-top)}" rx="3"/><path class="string-word-rim" d="M${left + 8} ${top}H${right - 8}"/><text class="string-word-label" x="${number((left + right) / 2)}" y="${number((top + bottom) / 2 + 7)}" text-anchor="middle" lang="en">${escape(word.text)}</text>${ports}</g>`;
    }).join('');
    const helperTypes = candidate.helpers.filter(helper => helper.kind === 'Cap' || helper.kind === 'Swap').flatMap(helper => helper.ports.filter(port => port.kind === 'cod')).map(port => `<text class="string-type" x="${x(port.x)+5}" y="${y(port.y)+15}">${escape(port.type.replace(/\.r/g,'ʳ').replace(/\.l/g,'ˡ'))}</text>`).join('');
    const outputs = candidate.outputs.map(port => `<g class="string-output"><circle cx="${x(port.x)}" cy="${y(port.y)}" r="3"/><text x="${x(port.x)}" y="${y(port.y) + 31}" text-anchor="middle">${escape(port.type)}</text></g>`).join('');
    return `<svg class="string-diagram" viewBox="0 0 ${width} ${height}" style="--diagram-width:${width}px" xmlns="http://www.w3.org/2000/svg" role="${interactive ? 'group' : 'img'}" aria-labelledby="${prefix}-title ${prefix}-desc" data-scene="${escape(candidate.id)}"><title id="${prefix}-title">${escape(candidate.sentence)}</title><desc id="${prefix}-desc">这句话的一种 DisCoCat 分析。词框之间的线保留原始类型连接；末端 s 为句子类型。</desc><defs>${defs}<filter id="${prefix}-glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="3.5"/></filter></defs><g class="string-paths" style="--string-glow:url(#${prefix}-glow)">${paths}</g><g class="string-words">${words}</g>${helperTypes}${outputs}</svg>`;
  }
  return { render, layout };
});
