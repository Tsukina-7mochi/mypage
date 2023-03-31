globalThis.addEventListener('DOMContentLoaded', () => {
  globalThis.matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (preference) => {
      document.querySelectorAll('div.repo-card').forEach((el) => {
        (el as HTMLElement).dataset['theme'] = preference ? 'dark-theme' : '';
      });
    });
});
