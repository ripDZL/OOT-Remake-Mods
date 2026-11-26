(() => {
  const searchInput = document.getElementById('mod-query');
  const platformFilter = document.getElementById('mod-platform');
  const results = document.getElementById('result-count');
  const empty = document.getElementById('catalog-empty');
  const entries = Array.from(document.querySelectorAll('.mod-card'), card => {
    const searchable = Array.from(card.querySelectorAll('h3, .card-body > p'), element => element.textContent)
      .join(' ').toLocaleLowerCase();
    const downloads = new Map(Array.from(card.querySelectorAll('[data-platform]'), link => [link.dataset.platform, link]));
    return { card, searchable, downloads };
  });

  function update() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const filter = platformFilter.value;
    let visible = 0;

    for (const entry of entries) {
      const matches = entry.searchable.includes(query) && (filter === 'all' || entry.downloads.has(filter));
      entry.card.hidden = !matches;
      if (matches) visible += 1;

      for (const [platform, link] of entry.downloads) {
        link.classList.toggle('is-platform-match', platform === filter);
      }
    }

    results.textContent = `${visible} of ${entries.length} mods`;
    empty.hidden = visible > 0;
  }

  function reset() {
    searchInput.value = '';
    platformFilter.value = 'all';
    update();
  }

  function revealTarget(hash) {
    const target = document.getElementById(hash.slice(1));
    if (!target) return;

    const guide = target.closest('details.guide');
    if (guide && !guide.open) guide.open = true;
    if (target.matches('.mod-card[hidden]')) {
      reset();
      target.scrollIntoView();
    }
  }

  document.getElementById('catalog-filters').hidden = false;
  results.hidden = false;
  searchInput.addEventListener('input', update);
  platformFilter.addEventListener('change', update);
  document.getElementById('clear-catalog').addEventListener('click', () => {
    reset();
    searchInput.focus();
  });
  for (const link of document.querySelectorAll('[data-filter-platform]')) {
    link.addEventListener('click', () => {
      platformFilter.value = link.dataset.filterPlatform;
      searchInput.value = '';
      update();
    });
  }

  document.addEventListener('click', event => {
    const shortcut = event.target.closest('a[href^="#"]');
    if (shortcut) revealTarget(shortcut.hash);
  });
  window.addEventListener('hashchange', () => revealTarget(location.hash));
  update();
  revealTarget(location.hash);
})();
