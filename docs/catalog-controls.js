(() => {
  const searchInput = document.getElementById('mod-query');
  const platformFilter = document.getElementById('mod-platform');
  const results = document.getElementById('result-count');
  const empty = document.getElementById('catalog-empty');
  const directLabels = {
    windows: 'Triforce / Longshot ZIP',
    lichii: 'Lichii ZIP',
    fritchii: 'Fritchii ZIP',
    hookshot: 'Legacy Hookshot ZIP',
    switch: 'Switch 2 test ZIP',
  };
  const entries = Array.from(document.querySelectorAll('.mod-card'), card => {
    const title = card.querySelector('h3').textContent;
    const searchable = Array.from(card.querySelectorAll('h3, .card-body > p'), element => element.textContent)
      .join(' ').toLocaleLowerCase();
    const downloads = new Map(Array.from(card.querySelectorAll('[data-platform]'), link => [link.dataset.platform, link]));
    card.querySelector('.zip-options').open = false;
    return { card, title, searchable, downloads, primary: card.querySelector('.primary-zip') };
  });

  function update() {
    const query = searchInput.value.trim().toLocaleLowerCase();
    const filter = platformFilter.value;
    const primaryPlatform = filter === 'all' ? 'windows' : filter;
    let visible = 0;

    for (const entry of entries) {
      const link = entry.downloads.get(primaryPlatform);
      const matches = entry.searchable.includes(query) && (filter === 'all' || Boolean(link));
      entry.card.hidden = !matches;
      if (matches) visible += 1;

      entry.primary.hidden = !link;
      if (link) {
        const label = directLabels[primaryPlatform];
        entry.primary.href = link.href;
        entry.primary.querySelector('span').textContent = label;
        entry.primary.setAttribute('aria-label', `Download ${label} for ${entry.title}`);
      } else {
        entry.primary.removeAttribute('href');
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
