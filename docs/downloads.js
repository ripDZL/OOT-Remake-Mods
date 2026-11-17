const grid = document.querySelector("#mods .cards");
const sort = document.getElementById("mod-sort");
const cards = Array.from(grid.querySelectorAll(".mod-card"), card => ({
  card,
  name: card.querySelector("h3").textContent,
  created: card.querySelector("time").dateTime,
  downloads: card.querySelector(".card-downloads"),
}));
const countFormat = new Intl.NumberFormat("en");
const comparisons = {
  newest: (a, b) => b.created.localeCompare(a.created),
  oldest: (a, b) => a.created.localeCompare(b.created),
  downloads: (a, b) => Number(b.downloads.value) - Number(a.downloads.value),
  name: (a, b) => a.name.localeCompare(b.name, "en"),
};

function sortCards() {
  const compare = comparisons[sort.value];
  cards.sort((a, b) => compare(a, b) || comparisons.name(a, b));
  grid.append(...cards.map(({ card }) => card));
}

async function updateDownloadCounts() {
  const counts = new Map(cards.map(({ card }) => [card.id, 0]));
  let total = 0;
  for (let page = 1; ; page++) {
    const url = "https://api.github.com/repos/ripDZL/OOT-Remake-Mods/releases";
    const response = await fetch(`${url}?per_page=100&page=${page}`);
    if (!response.ok) throw new Error("GitHub download counts unavailable");
    const releases = await response.json();
    for (const release of releases) {
      for (const asset of release.assets) {
        if (!/^OoT-Remake-.*\.zip$/i.test(asset.name)) continue;
        total += asset.download_count;
        const mod = asset.name.match(/^OoT-Remake-(.+?)-v\d.*\.zip$/i)?.[1].toLowerCase();
        if (counts.has(mod)) counts.set(mod, counts.get(mod) + asset.download_count);
      }
    }
    if (releases.length < 100) break;
  }
  document.getElementById("mod-download-count").textContent = countFormat.format(total);
  for (const { card, downloads } of cards) {
    const count = counts.get(card.id);
    downloads.value = count;
    downloads.textContent = `${countFormat.format(count)} ${count === 1 ? "download" : "downloads"}`;
  }
  if (sort.value === "downloads") sortCards();
}

sort.closest("label").hidden = false;
sort.addEventListener("change", sortCards);
sortCards();
updateDownloadCounts().catch(() => {
  document.getElementById("download-count-status").hidden = false;
});
