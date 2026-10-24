/* Shared by Hexo and the browser: the first frame and interactive frames use
   exactly the same drawing. Geometry comes from the exported DisCoCat graph. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NocturneStringDiagram = factory();
})(typeof window !== 'undefined' ? window : this, function () {
  'use strict';
  const escape = value => String(value).replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' })[character]);
  const number = value => Number(value.toFixed(3));

  // Dedicated spacing for “The city I watch is full of other people's evenings.”
  // Keep port order and cap/swap incidence while shaping this sentence's curves.
  const wordWidths = [68, 82, 35, 108, 112, 92, 55, 105, 114, 76, 155];
  function layout(sentence) {
    const anchors = [];
    let cursor = 28;
    for (const [index, word] of sentence.words.entries()) {
      const width = wordWidths[index];
      anchors.push([word.x, cursor], [word.x + word.width, cursor + width]);
      cursor += width + 18;
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
    const top = 32, wordHeight = 62, lower = 405;
    const boxBottom = Math.max(...sentence.words.map(word => word.y + word.height));
    const bottom = sentence.bounds.y + sentence.bounds.height;
    const y = value => number(value <= boxBottom ? top + value / boxBottom * wordHeight : top + wordHeight + (value - boxBottom) / Math.max(.1, bottom - boxBottom) * (lower - top - wordHeight));
    const commands = strand => {
      const original = strand.commands.map(command => ({ op: command.op, points: command.points.map(point => [x(point[0]), y(point[1])]) }));
      if (strand.id === 'strand-4') return original;
      if (strand.id === 'strand-0' || strand.id === 'strand-3') {
        const at = (u, v) => [x(u), y(v)];
        const start = original[0].points[0], end = original.at(-1).points.at(-1);
        const crossing = at(9.25, 4.25);
        let knots, tangents;
        if (strand.id === 'strand-0') {
          const turn = at(4.25, 5.25), swapPort = at(8, 4.5);
          const dx = crossing[0] - swapPort[0], dy = crossing[1] - swapPort[1];
          knots = [start, turn, swapPort, crossing, end];
          tangents = [[0, (turn[1] - start[1]) * .47],
            [(swapPort[0] - turn[0]) * .44, 0], [dx * .34, dy * .52],
            [dx * .45, dy * .3], [0, -(crossing[1] - end[1]) * .4]];
        } else {
          const firstTurn = at(9.25, 3.25), capRight = at(5.5, 2.5), capLeft = at(3, 2.5);
          const swapPort = at(10.5, 4.5), lastTurn = at(14.25, 5.25);
          const crossingTangent = [(swapPort[0] - crossing[0]) * .44, (swapPort[1] - crossing[1]) * .44];
          knots = [start, firstTurn, capRight, capLeft, crossing, swapPort, lastTurn, end];
          tangents = [[0, (firstTurn[1] - start[1]) * .54],
            [(capRight[0] - firstTurn[0]) * .44, 0], [0, -(firstTurn[1] - capRight[1]) * .44],
            [0, (crossing[1] - capLeft[1]) * .32], crossingTangent, crossingTangent,
            [(end[0] - lastTurn[0]) * .42, 0], [0, -(lastTurn[1] - end[1]) * .4]];
        }
        // Shared tangents join the bends smoothly. Keep both cap ports, both
        // swap output ports and the common crossing on their original positions.
        return [{ op:'M', points:[knots[0]] }, ...knots.slice(1).map((knot, index) => ({
          op:'C', points:[knots[index].map((value, axis) => value + tangents[index][axis]),
            knot.map((value, axis) => value - tangents[index + 1][axis]), knot]
        }))];
      }
      // The nine simple cups form continuous hanging curves.
      const start = original[0].points[0], end = original.at(-1).points.at(-1);
      const low = Math.max(...original.flatMap(command => command.points.map(point => point[1])));
      const middle = [(start[0] + end[0]) / 2, low];
      const span = end[0] - start[0], depth = low - start[1];
      return [{ op:'M', points:[start] },
        { op:'C', points:[[start[0], start[1] + depth * .86], [middle[0] - span * .32, low], middle] },
        { op:'C', points:[[middle[0] + span * .32, low], [end[0], end[1] + depth * .86], end] }];
    };
    const path = strand => commands(strand).map(command => command.op + command.points.map(point => number(point[0]) + ',' + number(point[1])).join(' ')).join(' ');
    return { width, height: 456, x, y, path, commands };
  }

  function render(sentence, { interactive = false } = {}) {
    const project = layout(sentence), { width, height, x, y } = project;
    const prefix = 'string-' + sentence.id;
    const palette = [['#8b9fbf','#e0e8f4','#a695af'],['#c9c7d5','#a2b5d8','#e9e2dc'],['#b7bfd2','#e7e7ec','#8899b7']];
    const defs = sentence.strands.map((strand, index) => {
      const colors = strand.role === 'sentence' ? ['#f4d6a9','#f5d7b4','#dca56c'] : palette[index % palette.length];
      return `<linearGradient id="${prefix}-g${index}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${colors[0]}"/><stop offset=".55" stop-color="${colors[1]}"/><stop offset="1" stop-color="${colors[2]}"/></linearGradient>`;
    }).join('');
    const paths = sentence.strands.map((strand, index) => {
      const d = project.path(strand);
      return `<g class="string-strand ${strand.role === 'sentence' ? 'string-strand--sentence' : ''}" data-words="${escape(strand.wordIds.join(' '))}" data-strand="${escape(strand.id)}" style="--strand-delay:-${(index * 2.7).toFixed(1)}s;--strand-time:${24 + index % 4 * 4}s;--ink-delay:${(index * .055).toFixed(3)}s"><path class="string-halo" d="${d}" stroke="url(#${prefix}-g${index})"/><path class="string-thread" d="${d}" pathLength="1000" stroke="url(#${prefix}-g${index})"/><path class="string-specular" d="${d}"/><path class="string-flow" d="${d}" pathLength="1000"/><path class="string-signal" d="${d}" pathLength="1000"/></g>`;
    }).join('');
    const words = sentence.words.map(word => {
      const left = x(word.x), right = x(word.x + word.width), top = y(word.y), bottom = y(word.y + word.height);
      const center = number((left + right) / 2);
      const ports = word.ports.map(port => `<circle class="string-port" cx="${x(port.x)}" cy="${y(port.y)}" r="1.7"/><text class="string-type" x="${x(port.x)}" y="${y(port.y) + 20}" text-anchor="middle">${escape(port.type.replace(/\.r/g,'ʳ').replace(/\.l/g,'ˡ'))}</text>`).join('');
      return `<g class="string-word" data-word="${escape(word.id)}"${interactive ? ` role="button" tabindex="0" aria-label="查看 ${escape(word.text)} 的连线" aria-pressed="false"` : ''}><rect class="string-word-hit" x="${left - 5}" y="${top - 7}" width="${number(right-left+10)}" height="${number(bottom-top+14)}"/><ellipse class="string-word-aura" cx="${center}" cy="${bottom - 13}" rx="${number((right-left)*.7)}" ry="30" fill="url(#${prefix}-wordlight)"/><path class="string-word-anchor" d="M${left + 3} ${bottom}H${right - 3}"/><path class="string-word-focus" d="M${left + 5} ${top - 4}h12 M${right - 5} ${top - 4}h-12 M${left + 5} ${bottom + 7}h12 M${right - 5} ${bottom + 7}h-12"/><text class="string-word-label" x="${center}" y="${bottom - 21}" text-anchor="middle" lang="en">${escape(word.text)}</text>${ports}</g>`;
    }).join('');
    const helperTypes = sentence.helpers.filter(helper => helper.kind === 'Cap' || helper.kind === 'Swap').flatMap(helper => helper.ports.filter(port => port.kind === 'cod')).map(port => `<text class="string-type" x="${x(port.x)+5}" y="${y(port.y)+15}">${escape(port.type.replace(/\.r/g,'ʳ').replace(/\.l/g,'ˡ'))}</text>`).join('');
    const outputs = sentence.outputs.map(port => `<g class="string-output"><circle class="string-output-light" cx="${x(port.x)}" cy="${y(port.y)}" r="25" fill="url(#${prefix}-wordlight)"/><circle cx="${x(port.x)}" cy="${y(port.y)}" r="2.6"/><text x="${x(port.x)}" y="${y(port.y) + 31}" text-anchor="middle">${escape(port.type)}</text></g>`).join('');
    return `<svg class="string-diagram" viewBox="0 0 ${width} ${height}" style="--diagram-width:${width}px" xmlns="http://www.w3.org/2000/svg" role="${interactive ? 'group' : 'img'}" aria-labelledby="${prefix}-title ${prefix}-desc" data-scene="${escape(sentence.id)}"><title id="${prefix}-title">${escape(sentence.sentence)}</title><desc id="${prefix}-desc">这句话的一种 DisCoCat 分析。词语之间的线保留原始类型连接；末端 s 为句子类型。</desc><defs>${defs}<radialGradient id="${prefix}-wordlight"><stop stop-color="#e6bd91" stop-opacity=".6"/><stop offset=".35" stop-color="#aa7c87" stop-opacity=".18"/><stop offset="1" stop-color="#aa7c87" stop-opacity="0"/></radialGradient><filter id="${prefix}-glow" x="-40%" y="-40%" width="180%" height="180%"><feGaussianBlur stdDeviation="4"/></filter></defs><g class="string-paths" style="--string-glow:url(#${prefix}-glow)">${paths}</g><g class="string-words">${words}</g>${helperTypes}${outputs}</svg>`;
  }
  return { render, layout };
});
