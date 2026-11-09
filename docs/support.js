const copyButton = document.getElementById("copy-address");
const address = document.getElementById("btc-address");
const copyStatus = document.getElementById("copy-status");

if (navigator.clipboard?.writeText) {
  copyButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(address.textContent.trim());
      copyStatus.textContent = "Bitcoin address copied.";
    } catch {
      copyStatus.textContent = "Select the address to copy it manually.";
    }
  });
  copyButton.hidden = false;
}
