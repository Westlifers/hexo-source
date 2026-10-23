(() => {
  'use strict';

  const roots = document.querySelectorAll('[data-atlas]');
  if (!roots.length) return;

  const NS = 'http://www.w3.org/2000/svg';
  const topics = {
    mathematics: { label: '数学', color: '#c8b5f3' },
    essays: { label: '随笔', color: '#e9c8a0' },
    poetry: { label: '诗与声音', color: '#e4abbe' },
    fieldnotes: { label: '漫游', color: '#a8c8c0' }
  };
  const svgElement = (tag, attrs = {}, text) => {
    const element = document.createElementNS(NS, tag);
    Object.entries(attrs).forEach(([key, value]) => element.setAttribute(key, value));
    if (text !== undefined) element.textContent = text;
    return element;
  };
  const element = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };
  const plain = value => String(value || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const names = value => (Array.isArray(value) ? value.flat(Infinity) : value ? [value] : [])
    .map(item => plain(item && typeof item === 'object' ? item.name || item.label : item)).filter(Boolean);
  const shortened = (value, limit) => Array.from(value).length > limit
    ? `${Array.from(value).slice(0, limit).join('')}…` : value;
  const labelFor = (title, mobile) => {
    const chapter = title.match(/Munkres.*?(?:Chapter\s*(\d+)|(Preface))/i);
    if (chapter) return chapter[1] ? `Munkres · ${chapter[1]}` : 'Munkres · 序';
    if (/Integral quantaloid/i.test(title)) return 'Quantaloid / Topos';
    if (/有界 Q-valued/i.test(title)) return 'Q-valued sets';
    return shortened(title, mobile ? 10 : 18);
  };
  const safeURL = value => {
    if (typeof value !== 'string' || !value.trim()) return null;
    try {
      const url = new URL(value, window.location.href);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : null;
    } catch (_) { return null; }
  };

  roots.forEach((root, rootIndex) => {
    const stage = root.querySelector('.atlas-stage');
    if (!stage) return;
    const status = root.querySelector('[data-atlas-status]') || element('p', 'atlas-status');
    if (!status.parentElement) root.append(status);
    status.setAttribute('role', 'status');
    status.setAttribute('aria-live', 'polite');
    const media = window.matchMedia('(max-width: 640px)');
    const filters = [...root.querySelectorAll('[data-atlas-filter]')];
    const plot = element('div', 'atlas-plot');
    const detail = element('div', 'atlas-detail');
    detail.setAttribute('aria-live', 'polite');
    detail.setAttribute('aria-atomic', 'true');
    const alternative = element('details', 'atlas-alternative');
    const summary = element('summary', '', '以文章列表浏览');
    const list = element('ul', 'atlas-list');
    alternative.append(summary, list);
    stage.append(plot, detail, alternative);
    let entries = [];
    let visible = [];
    let edges = [];
    let selected = null;
    let filter = 'all';
    let loading = false;
    let loaded = false;
    let graph = null;
    let nodeElements = new Map();

    const baseStatus = () => `连线表示共同标签或主题 · ${visible.length} 篇文章${visible.length > 40 ? '，星图显示最近 40 篇' : ''} · 选择一颗星，展开阅读`;
    const resetDetail = () => {
      detail.replaceChildren(element('span', 'atlas-detail-mark', '✦'),
        element('p', 'atlas-detail-invitation', '有些想法，在别处相遇。'),
        element('p', 'atlas-detail-help', '轻触一颗星，看看文章之间的联系。'));
      detail.classList.remove('has-selection');
    };
    const connectionsFor = id => edges.filter(edge => edge.a.id === id || edge.b.id === id);
    const illuminate = id => {
      if (!graph) return;
      const connections = id ? connectionsFor(id) : [];
      const related = new Set(id ? [id] : []);
      connections.forEach(edge => { related.add(edge.a.id); related.add(edge.b.id); });
      graph.classList.toggle('has-focus', Boolean(id));
      nodeElements.forEach((node, key) => {
        node.classList.toggle('is-related', related.has(key));
        node.classList.toggle('is-active', key === id);
        node.classList.toggle('is-selected', key === selected);
        node.setAttribute('aria-pressed', String(key === selected));
      });
      edges.forEach(edge => edge.element.classList.toggle('is-related', edge.a.id === id || edge.b.id === id));
      if (id) {
        const article = entries.find(entry => entry.id === id);
        const reasons = [...new Set(connections.flatMap(edge => edge.reasons))];
        status.textContent = connections.length
          ? `连线表示共同标签或主题 · 与《${article.title}》相连 ${connections.length} 篇 · ${reasons.slice(0, 4).join('、')}`
          : `《${article.title}》暂时没有共同标签或主题的连线。`;
      } else status.textContent = baseStatus();
    };
    const select = article => {
      selected = article.id;
      const meta = element('p', 'atlas-detail-meta', `${article.kindLabel}${article.date ? ` / ${article.date}` : ''}`);
      const title = element('h3', 'atlas-detail-title', article.title);
      const excerpt = element('p', 'atlas-detail-excerpt', shortened(article.summary || article.text || '从这里继续阅读这篇文章。', 130));
      const link = element('a', 'atlas-detail-link', '阅读全文');
      link.href = article.url;
      link.setAttribute('aria-label', `阅读全文：${article.title}`);
      detail.replaceChildren(meta, title, excerpt, link);
      detail.classList.add('has-selection');
      illuminate(selected);
    };

    const render = () => {
      if (!loaded) return;
      visible = entries.filter(entry => filter === 'all' || entry.kind === filter);
      const plotted = visible.slice(0, 40);
      if (!visible.some(entry => entry.id === selected)) selected = null;
      if (!selected) resetDetail();
      list.replaceChildren();
      visible.forEach(article => {
        const item = element('li');
        const link = element('a', '', article.title);
        link.href = article.url;
        item.append(link, element('span', '', article.kindLabel));
        list.append(item);
      });
      summary.textContent = `以文章列表浏览（${visible.length}）`;
      plot.replaceChildren();
      edges = [];
      nodeElements = new Map();
      if (!plotted.length) {
        graph = null;
        plot.append(element('p', 'atlas-empty', '这个主题暂时没有文章，试试其他主题。'));
        status.textContent = '连线表示共同标签或主题 · 当前主题暂无文章';
        return;
      }
      const mobile = media.matches;
      const width = mobile ? 600 : 1000;
      const height = mobile ? 600 : 540;
      const titleId = `atlas-title-${rootIndex}`;
      const descId = `atlas-desc-${rootIndex}`;
      graph = svgElement('svg', { class: 'atlas-svg', viewBox: `0 0 ${width} ${height}`, role: 'group', 'aria-labelledby': `${titleId} ${descId}` });
      graph.append(svgElement('title', { id: titleId }, '文章星图'),
        svgElement('desc', { id: descId }, '每颗星是一篇文章，连线表示共同标签或主题。按 Tab 在文章间移动，回车或空格展开介绍，方向键切换文章。也可使用下方文章列表。'));
      const orbitLayer = svgElement('g', { class: 'atlas-orbits', 'aria-hidden': 'true' });
      const edgeLayer = svgElement('g', { class: 'atlas-edges', 'aria-hidden': 'true' });
      const nodeLayer = svgElement('g', { class: 'atlas-nodes' });
      graph.append(orbitLayer, edgeLayer, nodeLayer);
      const groupKeys = [...new Set(plotted.map(entry => entry.kind))];
      const layouts = mobile
        ? [[172, 200, 97, 125], [434, 212, 90, 118], [174, 463, 94, 64], [425, 458, 90, 66]]
        : [[267, 250, 142, 156], [725, 240, 137, 150], [485, 414, 112, 68], [795, 428, 108, 64]];
      const canonicalOrder = Object.keys(topics);
      groupKeys.forEach((kind, groupIndex) => {
        const group = plotted.filter(entry => entry.kind === kind);
        const slot = canonicalOrder.indexOf(kind);
        let [cx, cy, rx, ry] = layouts[slot < 0 ? groupIndex % layouts.length : slot];
        if (filter !== 'all' || groupKeys.length === 1) {
          cx = width / 2; cy = height / 2;
          rx = mobile ? 180 : 315; ry = mobile ? 180 : 175;
        }
        const orbit = svgElement('ellipse', { cx, cy, rx, ry, class: 'atlas-orbit' });
        orbitLayer.append(orbit);
        orbitLayer.append(svgElement('ellipse', { cx, cy, rx: rx * .74, ry: ry * .69, class: 'atlas-orbit atlas-orbit-inner', transform: `rotate(-24 ${cx} ${cy})` }));
        orbitLayer.append(svgElement('text', { x: cx, y: cy - 5, class: 'atlas-topic', 'text-anchor': 'middle' }, group[0].kindLabel));
        orbitLayer.append(svgElement('text', { x: cx, y: cy + 17, class: 'atlas-topic-count', 'text-anchor': 'middle' }, `${group.length} 篇`));
        group.forEach((article, index) => {
          const angle = -Math.PI / 2 + index / group.length * Math.PI * 2 + (groupIndex % 2 ? .15 : -.12);
          const breathing = 1 + .07 * Math.sin(index * 2.4 + groupIndex);
          article.x = cx + Math.cos(angle) * rx * breathing;
          article.y = cy + Math.sin(angle) * ry * breathing;
          article.angle = angle;
          article.color = (topics[kind] || topics.essays).color;
        });
      });

      plotted.forEach((a, i) => {
        plotted.slice(i + 1).forEach(b => {
          const sharedTags = a.tags.filter(tag => b.tags.includes(tag));
          const sharedCategories = a.categories.filter(category => b.categories.includes(category));
          const reasons = [...new Set([...sharedTags, ...sharedCategories])];
          if (a.kind === b.kind) reasons.push(a.kindLabel);
          if (!reasons.length) return;
          const bend = (a.x + b.x) / 2 + (b.y - a.y) * .09;
          const rise = (a.y + b.y) / 2 - (b.x - a.x) * .09;
          const path = svgElement('path', { d: `M ${a.x} ${a.y} Q ${bend} ${rise} ${b.x} ${b.y}`, class: `atlas-edge${sharedTags.length ? ' atlas-edge-tag' : ''}` });
          edgeLayer.append(path);
          edges.push({ a, b, reasons: [...new Set(reasons)], element: path });
        });
      });

      plotted.forEach((article, index) => {
        const node = svgElement('g', { class: 'atlas-node', transform: `translate(${article.x} ${article.y})`, tabindex: '0', role: 'button', 'aria-label': `${article.title}，${article.kindLabel}。展开文章介绍`, 'aria-pressed': 'false', style: `--atlas-star: ${article.color}` });
        node.append(svgElement('title', {}, article.title));
        node.append(svgElement('circle', { r: mobile ? 23 : 20, class: 'atlas-node-hit' }));
        node.append(svgElement('circle', { r: 14, class: 'atlas-node-halo' }));
        node.append(svgElement('circle', { r: 4.1, class: 'atlas-node-core' }));
        node.append(svgElement('path', { d: 'M -9 0 H 9 M 0 -9 V 9', class: 'atlas-node-rays' }));
        const nearVertical = Math.abs(Math.cos(article.angle)) < .4;
        const toLeft = Math.cos(article.angle) < 0;
        const text = labelFor(article.title, mobile);
        const estimatedWidth = Array.from(text).reduce((sum, char) => sum + (/[^\x00-\xff]/.test(char) ? 1 : .54), 0) * (mobile ? 16 : 12);
        let anchor = nearVertical ? 'middle' : toLeft ? 'end' : 'start';
        let tx = nearVertical ? 0 : toLeft ? -15 : 15;
        let ty = nearVertical ? (Math.sin(article.angle) < 0 ? -18 : 26) : 5;
        if ((anchor === 'end' && article.x - estimatedWidth - 15 < 12) || (anchor === 'start' && article.x + estimatedWidth + 15 > width - 12)) {
          anchor = 'middle'; tx = 0; ty = 27;
        }
        node.append(svgElement('text', { x: tx, y: ty, class: 'atlas-node-label', 'text-anchor': anchor, 'aria-hidden': 'true' }, text));
        node.addEventListener('pointerenter', () => illuminate(article.id));
        node.addEventListener('pointerleave', () => illuminate(selected));
        node.addEventListener('focus', () => illuminate(article.id));
        node.addEventListener('blur', () => illuminate(selected));
        node.addEventListener('click', () => select(article));
        node.addEventListener('keydown', event => {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault(); select(article);
          } else if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
            event.preventDefault();
            let next = (index + (['ArrowLeft', 'ArrowUp'].includes(event.key) ? -1 : 1) + plotted.length) % plotted.length;
            if (event.key === 'Home') next = 0;
            if (event.key === 'End') next = plotted.length - 1;
            nodeElements.get(plotted[next].id)?.focus();
          } else if (event.key === 'Escape') {
            selected = null; resetDetail(); illuminate(null);
          }
        });
        nodeElements.set(article.id, node);
        nodeLayer.append(node);
      });
      plot.append(graph);
      illuminate(selected);
    };

    const load = async () => {
      if (loading || loaded) return;
      loading = true;
      plot.replaceChildren(element('p', 'atlas-loading', '正在展开文章星图…'));
      root.setAttribute('aria-busy', 'true');
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(root.dataset.index || '/nocturne/search.json', { signal: controller.signal, credentials: 'same-origin' });
        if (!response.ok) throw new Error('Article index unavailable');
        const data = await response.json();
        const raw = Array.isArray(data) ? data : data.posts || data.entries || [];
        if (!Array.isArray(raw)) throw new Error('Invalid article index');
        entries = raw.map((item, index) => {
          const rawKind = typeof item.kind === 'object' && item.kind ? item.kind.key : item.kind;
          const kind = rawKind || 'essays';
          return {
            id: `article-${index}`, title: plain(item.title), url: safeURL(item.url || item.path),
            summary: plain(item.summary), text: plain(item.text), tags: names(item.tags), categories: names(item.categories),
            kind, kindLabel: plain(typeof item.kind === 'object' && item.kind ? item.kind.label : '') || topics[kind]?.label || kind,
            date: plain(item.date).slice(0, 10)
          };
        }).filter(item => item.title && item.url).sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
        loaded = true;
        render();
      } catch (_) {
        plot.replaceChildren(element('p', 'atlas-error', '星图暂时无法展开。你仍可通过文章归档继续浏览。'));
        const retry = element('button', 'atlas-retry', '重新加载星图');
        retry.type = 'button';
        retry.addEventListener('click', load);
        plot.append(retry);
        status.textContent = '文章索引加载失败，请重试。';
      } finally {
        window.clearTimeout(timeout);
        loading = false;
        root.removeAttribute('aria-busy');
      }
    };

    filters.forEach(button => {
      button.setAttribute('aria-pressed', String(button.dataset.atlasFilter === filter));
      button.addEventListener('click', () => {
        filter = button.dataset.atlasFilter || 'all';
        filters.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
        render();
      });
    });
    resetDetail();
    if (media.addEventListener) media.addEventListener('change', render);
    else media.addListener(render);
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver(observations => {
        if (observations.some(observation => observation.isIntersecting)) {
          observer.disconnect(); load();
        }
      }, { rootMargin: '300px' });
      observer.observe(root);
    } else load();
  });
})();
