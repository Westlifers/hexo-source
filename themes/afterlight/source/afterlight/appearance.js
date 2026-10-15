(() => {
  let preference = 'system';
  try { preference = localStorage.getItem('afterlight-appearance') || 'system'; } catch (_) {}
  if (!['light', 'dark', 'system'].includes(preference)) preference = 'system';
  const media = matchMedia('(prefers-color-scheme: dark)');
  const apply = () => {
    document.documentElement.dataset.appearance = preference;
    document.documentElement.dataset.theme = preference === 'system' ? (media.matches ? 'dark' : 'light') : preference;
  };
  window.afterlightAppearance = {
    get: () => preference,
    set(value) { preference = value; try { localStorage.setItem('afterlight-appearance', value); } catch (_) {} apply(); }
  };
  apply();
  media.addEventListener('change', apply);
})();
