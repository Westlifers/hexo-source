(() => {
  const openers = new WeakMap();
  window.afterlightDialogs = {
    open(dialog, opener = document.activeElement) {
      document.querySelectorAll('dialog[open]').forEach(other => { if (other !== dialog) other.close(); });
      if (dialog.open) return;
      openers.set(dialog, opener);
      dialog.showModal();
      document.body.classList.add('modal-open');
    },
    close(dialog) { dialog.close(); },
    bind(dialog) {
      // Search inputs consume Escape to clear text; modal dismissal takes priority.
      dialog.addEventListener('keydown', event => {
        if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); dialog.close(); }
      }, true);
      dialog.querySelector('[data-dialog-close]')?.addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', event => {
        const rect = dialog.getBoundingClientRect();
        if (event.target === dialog && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)) dialog.close();
      });
      dialog.addEventListener('close', () => {
        if (!document.querySelector('dialog[open]')) {
          document.body.classList.remove('modal-open');
          const opener = openers.get(dialog);
          if (opener?.isConnected) opener.focus({ preventScroll: true });
        }
      });
    }
  };
  document.querySelectorAll('.afterlight-dialog').forEach(window.afterlightDialogs.bind);
})();
