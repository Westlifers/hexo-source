(() => {
  const appearance = document.querySelector('button[data-appearance]');
  const modes = ['system', 'light', 'dark'];
  const labels = { system: '随系统', light: '浅色', dark: '深色' };
  function syncAppearance() {
    const value = window.afterlightAppearance.get();
    appearance.querySelector('[data-appearance-label]').textContent = labels[value];
    appearance.setAttribute('aria-label', `当前${labels[value]}，切换配色`);
  }
  if (appearance && window.afterlightAppearance) {
    appearance.hidden = false;
    syncAppearance();
    appearance.addEventListener('click', () => {
      const current = window.afterlightAppearance.get();
      window.afterlightAppearance.set(modes[(modes.indexOf(current) + 1) % modes.length]);
      syncAppearance();
    });
  }
  const focus = document.querySelector('[data-focus]');
  function setFocus(enabled) {
    document.body.classList.toggle('focus-reading', enabled);
    focus.setAttribute('aria-pressed', String(enabled));
    focus.textContent = enabled ? '退出专注' : '专注阅读';
  }
  if (focus) {
    focus.hidden = false;
    focus.addEventListener('click', () => setFocus(!document.body.classList.contains('focus-reading')));
    document.addEventListener('keydown', event => { if (event.key === 'Escape') setFocus(false); });
  }
  const outline = document.querySelector('.article-outline details');
  if (outline && matchMedia('(max-width: 900px)').matches) outline.open = false;
  const links = [...document.querySelectorAll('.article-outline a')];
  const headings = links.map(link => {
    try { return document.getElementById(decodeURIComponent(link.hash.slice(1))); } catch (_) { return null; }
  });
  let queued = false;
  function updateOutline() {
    queued = false;
    let active = -1;
    headings.forEach((heading, index) => { if (heading?.getBoundingClientRect().top < 150) active = index; });
    links.forEach((link, index) => {
      if (index === active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  if (links.length) {
    addEventListener('scroll', () => { if (!queued) { queued = true; requestAnimationFrame(updateOutline); } }, { passive: true });
    updateOutline();
  }
  // Missing optional images must leave a readable title and link behind.
  document.querySelectorAll('.featured-image img').forEach(img => {
    const fail = () => { img.closest('.featured-story').classList.add('image-unavailable'); };
    img.addEventListener('error', fail);
    if (img.complete && !img.naturalWidth) fail();
  });
})();
