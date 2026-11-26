(() => {
  const viewer = document.getElementById('capture-viewer');
  if (typeof viewer.showModal !== 'function') return;

  const image = document.getElementById('capture-full');
  const heading = document.getElementById('capture-name');

  document.addEventListener('click', event => {
    const link = event.target.closest('a[data-capture]');
    if (!link || event.defaultPrevented || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;

    event.preventDefault();
    heading.textContent = link.dataset.capture;
    image.alt = link.closest('figure').querySelector('img').alt;
    image.src = link.href;
    viewer.showModal();
  });

  document.getElementById('close-capture').addEventListener('click', () => viewer.close());
  viewer.addEventListener('click', event => {
    if (event.target !== viewer) return;
    const box = viewer.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) viewer.close();
  });
})();
