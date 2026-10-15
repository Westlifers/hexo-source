(() => {
  const appearance = document.querySelector('button[data-appearance]');
  const labels = { light: '浅色', dark: '深色' };
  function syncAppearance() {
    const value = window.afterlightAppearance.get();
    appearance.querySelector('[data-appearance-label]').textContent = labels[value];
    appearance.setAttribute('aria-label', `当前${labels[value]}，切换为${labels[value === 'light' ? 'dark' : 'light']}`);
    appearance.setAttribute('aria-pressed', String(value === 'dark'));
  }
  if (appearance && window.afterlightAppearance) {
    appearance.hidden = false;
    syncAppearance();
    appearance.addEventListener('click', () => {
      const current = window.afterlightAppearance.get();
      window.afterlightAppearance.set(current === 'light' ? 'dark' : 'light');
      syncAppearance();
    });
  }
  // Missing optional images must leave a readable title and link behind.
  document.querySelectorAll('.featured-image img').forEach(img => {
    const fail = () => { img.closest('.featured-story').classList.add('image-unavailable'); };
    img.addEventListener('error', fail);
    if (img.complete && !img.naturalWidth) fail();
  });
})();
