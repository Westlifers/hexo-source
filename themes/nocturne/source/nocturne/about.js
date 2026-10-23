(() => {
  'use strict';
  const scene = document.querySelector('.about-experience');
  const portrait = scene?.querySelector('.about-avatar-wrap');
  const hero = scene?.querySelector('.about-hero');
  if (!scene || !portrait || !hero) return;

  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const precise = matchMedia('(hover: hover) and (pointer: fine)');
  let visible = false, frame = 0, pointer;
  const properties = ['--about-tilt-x', '--about-tilt-y', '--about-glow-x', '--about-glow-y'];
  function resetPortrait() {
    cancelAnimationFrame(frame);
    frame = 0;
    pointer = null;
    portrait.classList.remove('is-pointer-over');
    properties.forEach(property => portrait.style.removeProperty(property));
  }
  function syncMotion() {
    const moving = visible && !document.hidden && !reduced.matches;
    scene.classList.toggle('is-about-moving', moving);
    scene.classList.toggle('is-pointer-ready', precise.matches && !reduced.matches);
    if (!moving || !precise.matches) resetPortrait();
  }
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncMotion();
    }, { threshold: 0 }).observe(hero);
  } else {
    visible = true;
  }

  // Only event-driven frames: no continuous render loop for the portrait.
  portrait.addEventListener('pointermove', event => {
    if (!precise.matches || reduced.matches || document.hidden || !visible || event.pointerType === 'touch') return;
    pointer = { x: event.clientX, y: event.clientY };
    if (frame) return;
    frame = requestAnimationFrame(() => {
      frame = 0;
      if (!pointer) return;
      const bounds = portrait.getBoundingClientRect();
      const x = Math.max(0, Math.min(1, (pointer.x - bounds.left) / bounds.width));
      const y = Math.max(0, Math.min(1, (pointer.y - bounds.top) / bounds.height));
      portrait.style.setProperty('--about-tilt-x', `${((.5 - y) * 5).toFixed(2)}deg`);
      portrait.style.setProperty('--about-tilt-y', `${((x - .5) * 7).toFixed(2)}deg`);
      portrait.style.setProperty('--about-glow-x', `${(x * 100).toFixed(1)}%`);
      portrait.style.setProperty('--about-glow-y', `${(y * 100).toFixed(1)}%`);
      portrait.classList.add('is-pointer-over');
    });
  });
  portrait.addEventListener('pointerleave', resetPortrait);
  portrait.addEventListener('pointercancel', resetPortrait);
  reduced.addEventListener('change', syncMotion);
  precise.addEventListener('change', syncMotion);
  document.addEventListener('visibilitychange', syncMotion);
  window.addEventListener('blur', resetPortrait);
  window.addEventListener('pagehide', () => { scene.classList.remove('is-about-moving'); resetPortrait(); });
  window.addEventListener('pageshow', syncMotion);
  syncMotion();
})();
