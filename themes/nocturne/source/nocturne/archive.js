/* The archive is enhanced in place: its complete article list also works without JS. */
(() => {
  'use strict';
  const root = document.querySelector('[data-archive]');
  if (!root) return;
  const find = selector => root.querySelector(selector);
  const query = find('[data-archive-query]'), year = find('[data-archive-year]'), sort = find('[data-archive-sort]');
  const results = find('[data-archive-results]'), status = find('[data-archive-status]');
  const empty = find('[data-archive-empty]'), active = find('[data-archive-active]');
  const kindButtons = [...root.querySelectorAll('[data-archive-kind]')];
  const tagButtons = [...root.querySelectorAll('[data-archive-tag]')];
  const savedButton = find('[data-archive-saved]'), clear = find('[data-archive-clear-query]');
  const reset = find('[data-archive-reset]');
  const storageKey = 'nocturne-bookmarks';
  const initialPath = location.pathname;
  const normalize = value => String(value || '').normalize('NFKC').toLocaleLowerCase().replace(/\s+/g, ' ').trim();
  const pathname = value => { try { return new URL(value, location.href).pathname; } catch { return ''; } };
  const read = (key, fallback) => { try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; } };
  const notify = message => { if (window.Nocturne?.toast) window.Nocturne.toast(message); else status.textContent = message; };
  const records = [...root.querySelectorAll('[data-archive-entry]')].map(element => {
    const data = element.dataset;
    let tags = []; try { tags = JSON.parse(data.tags); } catch {}
    if (!Array.isArray(tags)) tags = [];
    return { element, title: data.title, kind: data.kind, kindLabel: data.kindLabel, date: data.date, year: data.date.slice(0, 4),
      month: data.date.slice(5, 7), time: Number(data.time), minutes: Number(data.minutes), tags, url: data.url, path: pathname(data.url),
      haystack: normalize([data.title, data.summary, data.kindLabel, ...tags].join(' ')) };
  });
  const validKinds = new Set(kindButtons.map(button => button.dataset.archiveKind));
  const validYears = new Set(records.map(record => record.year));
  const allTags = new Set(records.flatMap(record => record.tags));
  let state, bookmarks = [], savedPaths = new Set(), inputTimer, composing = false;
  function readBookmarks() {
    const value = read(storageKey, []);
    bookmarks = Array.isArray(value) ? value.filter(item => item && typeof item.url === 'string' && typeof item.title === 'string') : [];
    savedPaths = new Set(bookmarks.map(item => pathname(item.url)));
  }
  function readState() {
    const params = new URLSearchParams(location.search);
    const kind = params.get('kind') || '', selectedYear = params.get('year') ?? (location.pathname === initialPath ? root.dataset.initialYear : '');
    const selectedTag = params.get('tag') || '', order = params.get('sort') || 'newest';
    const requestedMonth = params.get('month') ?? (params.has('year') || location.pathname !== initialPath ? '' : root.dataset.initialMonth || '');
    state = { q: (params.get('q') || '').slice(0, 200).trim(), kind: validKinds.has(kind) ? kind : '',
      year: validYears.has(selectedYear) ? selectedYear : '', month: validYears.has(selectedYear) && /^(?:0?[1-9]|1[0-2])$/.test(requestedMonth) ? requestedMonth.padStart(2, '0') : '',
      tag: allTags.has(selectedTag) ? selectedTag : '', sort: ['newest', 'oldest', 'shortest'].includes(order) ? order : 'newest', saved: params.get('saved') === '1' };
  }
  function stateURL() {
    const url = new URL(root.dataset.archiveUrl, location.href);
    if (state.q) url.searchParams.set('q', state.q);
    if (state.kind) url.searchParams.set('kind', state.kind);
    if (state.year) url.searchParams.set('year', state.year);
    if (state.month) url.searchParams.set('month', state.month);
    if (state.tag) url.searchParams.set('tag', state.tag);
    if (state.sort !== 'newest') url.searchParams.set('sort', state.sort);
    if (state.saved) url.searchParams.set('saved', '1');
    return url;
  }
  function writeURL() {
    try { history.replaceState(history.state, '', stateURL()); } catch { /* Filtering still works if history is unavailable. */ }
  }
  function matches(record, ignoreKind = false) {
    const terms = normalize(state.q).split(' ').filter(Boolean);
    return (ignoreKind || !state.kind || record.kind === state.kind) && (!state.year || record.year === state.year)
      && (!state.month || record.month === state.month) && (!state.tag || record.tags.includes(state.tag))
      && (!state.saved || savedPaths.has(record.path)) && terms.every(term => record.haystack.includes(term));
  }
  function syncSaved() {
    const count = records.filter(record => savedPaths.has(record.path)).length;
    find('[data-archive-saved-count]').textContent = count;
    records.forEach(record => {
      const button = record.element.querySelector('[data-archive-save]'), saved = savedPaths.has(record.path);
      button.hidden = false; button.setAttribute('aria-pressed', String(saved));
      button.setAttribute('aria-label', `${saved ? '取消收藏' : '收藏'}《${record.title}》`);
      button.title = saved ? '取消收藏' : '收藏这篇文字';
      const progress = read('nocturne-position:' + record.path, null), label = record.element.querySelector('[data-archive-progress]');
      const fraction = Number(progress?.fraction);
      label.hidden = !(fraction > .03 && fraction < .98);
      if (!label.hidden) label.textContent = `上次读到 ${Math.round(fraction * 100)}%`;
    });
  }
  function render(updateURL = true) {
    const shown = records.filter(record => matches(record)).sort((a, b) => state.sort === 'shortest'
      ? a.minutes - b.minutes || b.time - a.time : state.sort === 'oldest' ? a.time - b.time : b.time - a.time);
    // Leave the focused search field intact, including spaces and caret position.
    if (query.value.trim() !== state.q) query.value = state.q;
    year.value = state.year; sort.value = state.sort;
    clear.hidden = !state.q; savedButton.setAttribute('aria-pressed', String(state.saved));
    kindButtons.forEach(button => {
      const key = button.dataset.archiveKind, selected = key === state.kind;
      button.classList.toggle('is-active', selected); button.setAttribute('aria-pressed', String(selected));
      button.querySelector('[data-kind-count]').textContent = records.filter(record => matches(record, true) && (!key || key === record.kind)).length;
    });
    tagButtons.forEach(button => button.setAttribute('aria-pressed', String(button.dataset.archiveTag === state.tag)));
    reset.hidden = !(state.q || state.kind || state.year || state.month || state.tag || state.saved || state.sort !== 'newest');
    const fragments = document.createDocumentFragment(), groups = new Map();
    shown.forEach(record => {
      const key = state.sort === 'shortest' ? 'shortest' : record.year;
      if (!groups.has(key)) {
        const section = document.createElement('section'); section.className = 'archive-year-group';
        section.setAttribute('aria-label', key === 'shortest' ? '按阅读时长排序的文章' : `${key} 年的文章`);
        const heading = document.createElement('h2'); heading.className = 'archive-year-heading';
        const title = document.createElement('span'); title.textContent = key === 'shortest' ? '从短篇开始' : key;
        const count = document.createElement('small'); count.textContent = `${shown.filter(item => key === 'shortest' || item.year === key).length} 篇`;
        heading.append(title, count); const list = document.createElement('div'); list.className = 'archive-entries';
        section.append(heading, list); groups.set(key, list); fragments.append(section);
      }
      record.element.querySelector('[data-archive-date-year]').hidden = state.sort !== 'shortest';
      record.element.hidden = false; groups.get(key).append(record.element);
    });
    results.replaceChildren(fragments); results.classList.toggle('archive-short-list', state.sort === 'shortest');
    const totalMinutes = shown.reduce((sum, record) => sum + record.minutes, 0);
    status.textContent = `${shown.length} 篇文字${shown.length ? `，约 ${totalMinutes} 分钟` : ''}`;
    const filters = [];
    if (state.kind) filters.push(records.find(record => record.kind === state.kind)?.kindLabel);
    if (state.year) filters.push(`${state.year} 年${state.month ? ` ${Number(state.month)} 月` : ''}`);
    if (state.tag) filters.push(state.tag);
    if (state.saved) filters.push('我的收藏');
    if (state.q) filters.push(`“${state.q}”`);
    active.textContent = filters.filter(Boolean).join(' / '); active.hidden = filters.length === 0;
    empty.hidden = shown.length > 0; find('[data-archive-end]').hidden = shown.length === 0;
    const hasSaved = records.some(record => savedPaths.has(record.path));
    find('[data-archive-empty-title]').textContent = state.saved && !hasSaved ? '把想再读的文字留在这里' : '没有找到这样的文字';
    find('[data-archive-empty-copy]').textContent = state.saved && !hasSaved
      ? '点一下文章旁的书签，下次回来便能在这里找到。收藏保存在当前浏览器。' : '试试更短的关键词，或移除一个筛选条件。';
    syncSaved(); if (updateURL) writeURL();
  }
  function captureQuery() { clearTimeout(inputTimer); state.q = query.value.slice(0, 200).trim(); }
  function resetAll() { clearTimeout(inputTimer); query.value = ''; state = { q: '', kind: '', year: '', month: '', tag: '', sort: 'newest', saved: false }; render(); }
  root.classList.add('is-enhanced');
  root.querySelectorAll('[data-archive-tools],[data-archive-controls],[data-archive-actions]').forEach(element => { element.hidden = false; });
  kindButtons.forEach(button => button.addEventListener('click', () => { captureQuery(); state.kind = button.dataset.archiveKind; render(); }));
  tagButtons.forEach(button => button.addEventListener('click', () => { captureQuery(); state.tag = state.tag === button.dataset.archiveTag ? '' : button.dataset.archiveTag; render(); }));
  savedButton.addEventListener('click', () => { captureQuery(); state.saved = !state.saved; render(); });
  year.addEventListener('change', () => { captureQuery(); state.year = year.value; state.month = ''; render(); });
  sort.addEventListener('change', () => { captureQuery(); state.sort = sort.value; render(); });
  function applyQuery() { captureQuery(); render(); }
  query.addEventListener('input', event => { if (event.isComposing || composing) return; clearTimeout(inputTimer); inputTimer = setTimeout(applyQuery, 150); });
  query.addEventListener('compositionstart', () => { composing = true; clearTimeout(inputTimer); });
  query.addEventListener('compositionend', () => { composing = false; applyQuery(); });
  find('[data-archive-controls]').addEventListener('submit', event => { event.preventDefault(); applyQuery(); });
  clear.addEventListener('click', () => { clearTimeout(inputTimer); query.value = ''; state.q = ''; render(); query.focus(); });
  reset.addEventListener('click', resetAll); find('[data-archive-empty-reset]').addEventListener('click', resetAll);
  find('[data-archive-share]').addEventListener('click', async () => {
    applyQuery();
    try { await navigator.clipboard.writeText(stateURL().href); notify(state.saved ? '筛选链接已复制；收藏内容只保存在你的浏览器。' : '筛选链接已复制。'); }
    catch { notify('筛选已保存在地址栏，可以直接复制当前网址。'); }
  });
  records.forEach(record => record.element.querySelector('[data-archive-save]').addEventListener('click', () => {
    readBookmarks(); const existed = savedPaths.has(record.path);
    const next = bookmarks.filter(item => pathname(item.url) !== record.path);
    if (!existed) next.unshift({ title: record.title, url: record.path });
    try { localStorage.setItem(storageKey, JSON.stringify(next)); }
    catch { notify('浏览器未允许保存，请检查本地存储设置。'); return; }
    readBookmarks();
    if (state.saved) { render(); savedButton.focus({ preventScroll: true }); } else syncSaved();
    window.dispatchEvent(new CustomEvent('nocturne-bookmarks-changed'));
    notify(existed ? '已取消收藏。' : '已加入我的收藏。');
  }));
  addEventListener('storage', event => { if (event.key === storageKey || event.key?.startsWith('nocturne-position:')) { readBookmarks(); render(false); } });
  addEventListener('popstate', () => { readState(); readBookmarks(); render(false); });
  addEventListener('pageshow', () => { readBookmarks(); render(false); });
  readState(); readBookmarks(); render(false);
})();
