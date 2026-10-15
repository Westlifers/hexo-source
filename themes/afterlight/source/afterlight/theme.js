(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  let appearanceTimer;
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
      clearTimeout(appearanceTimer);
      if (!reduced.matches) document.documentElement.classList.add('theme-changing');
      const current = window.afterlightAppearance.get();
      window.afterlightAppearance.set(current === 'light' ? 'dark' : 'light');
      syncAppearance();
      appearanceTimer = setTimeout(() => document.documentElement.classList.remove('theme-changing'), 240);
    });
  }
  // Content is visible by default; motion never gates reading or waits for scroll.
  if (!reduced.matches) document.querySelectorAll('.hero-copy, .hero-photo').forEach((element, index) => {
    element.animate([{ opacity: .55, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }], { duration: 380, delay: index * 45, easing: 'cubic-bezier(.2,.7,.2,1)' });
  });
  // Missing optional images must leave a readable title and link behind.
  document.querySelectorAll('.featured-image img').forEach(img => {
    const fail = () => { img.closest('.featured-story').classList.add('image-unavailable'); };
    img.addEventListener('error', fail);
    if (img.complete && !img.naturalWidth) fail();
  });
})();
