(() => {
  'use strict';
  const hero = document.querySelector('[data-string-hero]');
  if (!hero || !window.NocturneStringDiagram) return;
  const stage = hero.querySelector('[data-string-stage]');
  const select = hero.querySelector('[data-string-candidate]');
  const motion = hero.querySelector('[data-string-motion]');
  const detail = hero.querySelector('[data-string-detail]');
  const scale = hero.querySelector('[data-string-scale]');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let paused = reduced.matches, visible = true, pinned = null;
  let variants, current, diagram;
  let selectionStatus = hero.querySelector('[data-string-selection]');
  if (!selectionStatus) {
    selectionStatus = document.createElement('p');
    selectionStatus.className = 'sr-only';
    selectionStatus.setAttribute('role', 'status');
    stage.after(selectionStatus);
  }
  function syncMotion() {
    hero.classList.toggle('string-paused', paused || reduced.matches || !visible || document.hidden);
    if (motion) {
      motion.querySelector('[data-control-label]').textContent = paused || reduced.matches ? '继续流动' : '暂停流动';
      motion.setAttribute('aria-pressed', String(paused || reduced.matches));
      motion.disabled = reduced.matches || !hero.classList.contains('string-ready');
      motion.title = reduced.matches ? '已遵循系统减少动态效果设置' : '';
    }
  }
  function setReadingMode(reading) {
    hero.classList.toggle('string-reading', reading);
    scale?.setAttribute('aria-pressed', String(reading));
    if (scale) scale.textContent = reading ? '看全图' : '放大读图';
    const scroller = stage.closest('[data-string-scroll]');
    if (scroller) scroller.scrollLeft = 0;
  }
  function selectWord(id, announce = false) {
    if (!diagram) return;
    const related = new Set();
    diagram.classList.toggle('has-selection', Boolean(id));
    diagram.querySelectorAll('[data-words]').forEach(strand => {
      const words = strand.dataset.words.split(' ');
      const active = Boolean(id && words.includes(id));
      strand.classList.toggle('is-active', active);
      if (active) words.forEach(word => related.add(word));
    });
    diagram.querySelectorAll('[data-word]').forEach(word => {
      word.classList.toggle('is-active', word.dataset.word === id);
      word.classList.toggle('is-related', related.has(word.dataset.word));
      word.setAttribute('aria-pressed', String(word.dataset.word === pinned));
    });
    if (announce) {
      const word = current.words.find(item => item.id === id);
      const others = current.words.filter(item => related.has(item.id) && item.id !== id).map(item => item.text);
      selectionStatus.textContent = word ? `${word.text} 的连线已突出${others.length ? '，相接词框：' + others.join('、') : ''}。再次选择可取消。` : '已显示全部连线。';
    }
  }
  function draw(candidate) {
    current = candidate;
    pinned = null;
    stage.innerHTML = window.NocturneStringDiagram.render(candidate, { interactive: true });
    diagram = stage.querySelector('.string-diagram');
    hero.dataset.candidate = candidate.id;
    hero.querySelector('[data-string-sentence]').textContent = candidate.sentence;
    hero.querySelector('[data-string-translation]').textContent = candidate.translation;
    const original = hero.querySelector('[data-string-original]');
    if (original) original.href = new URL(candidate.rawSvg.replace(/^nocturne\/strings\//, ''), new URL(hero.dataset.stringRoot, location.href)).href;
    if (select) select.value = candidate.id;
    const scroller = stage.closest('[data-string-scroll]') || stage.parentElement;
    if (scroller) scroller.scrollLeft = 0;
    selectionStatus.textContent = '';
  }
  stage.addEventListener('pointerover', event => {
    const word = event.target.closest('[data-word]');
    if (word && !pinned && event.pointerType !== 'touch') selectWord(word.dataset.word);
  });
  stage.addEventListener('pointerleave', () => { if (!pinned) selectWord(null); });
  stage.addEventListener('focusin', event => {
    const word = event.target.closest('[data-word]');
    if (word && matchMedia('(max-width: 760px)').matches && !hero.classList.contains('string-reading')) {
      setReadingMode(true);
      word.scrollIntoView({block:'nearest',inline:'nearest',behavior:'instant'});
    }
    if (word && !pinned) selectWord(word.dataset.word);
  });
  stage.addEventListener('focusout', event => {
    if (!pinned && !stage.contains(event.relatedTarget)) selectWord(null);
  });
  function pin(word) {
    pinned = pinned === word.dataset.word ? null : word.dataset.word;
    selectWord(pinned, true);
  }
  stage.addEventListener('click', event => {
    if (!current) return;
    const word = event.target.closest('[data-word]');
    if (word) pin(word);
    else { pinned = null; selectWord(null, true); }
  });
  stage.addEventListener('keydown', event => {
    const word = event.target.closest('[data-word]');
    if (!word || !current) return;
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); pin(word); }
    if (event.key === 'Escape') { pinned = null; selectWord(null, true); }
    if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      const words = [...diagram.querySelectorAll('[data-word]')];
      const index = words.indexOf(word);
      const next = event.key === 'Home' ? 0 : event.key === 'End' ? words.length - 1 : Math.max(0, Math.min(words.length - 1, index + (event.key === 'ArrowRight' ? 1 : -1)));
      words[next].focus({ preventScroll: true });
      words[next].scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
    }
  });
  motion?.addEventListener('click', () => { paused = !paused; syncMotion(); });
  scale?.addEventListener('click', () => setReadingMode(!hero.classList.contains('string-reading')));
  detail?.addEventListener('click', () => {
    const shown = hero.classList.toggle('show-string-types');
    detail.setAttribute('aria-pressed', String(shown));
    detail.querySelector('[data-control-label]').textContent = shown ? '收起类型' : '展开类型';
  });
  select?.addEventListener('change', () => {
    const candidate = variants?.find(item => item.id === select.value);
    if (!candidate) return;
    draw(candidate);
    const url = new URL(location.href);
    url.searchParams.set('sentence', candidate.id);
    history.replaceState(null, '', url);
    selectionStatus.textContent = '已切换为：' + candidate.sentence;
  });
  if ('IntersectionObserver' in window) new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting; syncMotion();
  }, { threshold: 0 }).observe(stage);
  document.addEventListener('visibilitychange', syncMotion);
  reduced.addEventListener('change', syncMotion);
  syncMotion();
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  fetch(hero.dataset.source, { signal: controller.signal }).then(response => {
    if (!response.ok) throw new Error('Sentence data unavailable');
    return response.json();
  }).then(collection => {
    if (collection.schemaVersion !== 1 || !Array.isArray(collection.variants)) throw new Error('Unknown sentence data');
    variants = collection.variants;
    const requested = select ? new URLSearchParams(location.search).get('sentence') : null;
    const initial = variants.find(candidate => candidate.id === requested) || variants.find(candidate => candidate.id === hero.dataset.candidate) || variants.find(candidate => candidate.id === collection.defaultId) || variants[0];
    if (!initial) throw new Error('No sentence available');
    draw(initial);
    hero.classList.add('string-ready');
    if (select) select.disabled = false;
    if (detail) detail.disabled = false;
    if (scale) scale.disabled = false;
    if (motion) motion.disabled = reduced.matches;
    syncMotion();
  }).catch(() => {
    // The fully rendered initial graph is part of the document, so a failed
    // enhancement never leaves a blank stage or discards the selected sentence.
    selectionStatus.textContent = '当前显示静态线图，交互暂时不可用。';
  }).finally(() => clearTimeout(timeout));
})();
