async function updateModDownloadCount() {
  const count = document.getElementById("mod-download-count");
  let total = 0;
  for (let page = 1; ; page++) {
    const url = "https://api.github.com/repos/ripDZL/OOT-Remake-Mods/releases";
    const response = await fetch(`${url}?per_page=100&page=${page}`);
    if (!response.ok) return;
    const releases = await response.json();
    for (const release of releases) {
      for (const asset of release.assets) {
        if (/^OoT-Remake-.*\.zip$/i.test(asset.name)) total += asset.download_count;
      }
    }
    if (releases.length < 100) break;
  }
  count.textContent = new Intl.NumberFormat("en").format(total);
}

// Keep the last verified total if GitHub is unavailable.
updateModDownloadCount().catch(() => {});
