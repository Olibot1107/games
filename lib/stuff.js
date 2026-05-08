document.addEventListener('keydown', (e) => {
  if (e.key === '`') {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(console.error);
    } else {
      document.exitFullscreen().catch(console.error);
    }
  }
});