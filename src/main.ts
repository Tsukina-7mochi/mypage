globalThis.addEventListener('DOMContentLoaded', () => {
  if (globalThis.matchMedia('(prefers-color-scheme: dark)').matches == true) {
    document.querySelectorAll('div.repo-card').forEach((el) => {
      (el as HTMLElement).dataset['theme'] = 'dark-theme';
    });
  }
});
