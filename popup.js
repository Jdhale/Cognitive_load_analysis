// Load saved theme on startup
chrome.storage.local.get("theme", (data) => {
  if (data.theme === "dark") {
    document.body.classList.add("dark");
    document.getElementById("themeSwitch").checked = true;
  }
});

// Theme toggle
document.getElementById("themeSwitch").addEventListener("change", function () {
  const isDark = this.checked;
  document.body.classList.toggle("dark", isDark);
  chrome.storage.local.set({ theme: isDark ? "dark" : "light" });
});

// Start/Pause tracking status
document.getElementById("startBtn").addEventListener("click", () => {
  updateStatus("Running");
});

document.getElementById("pauseBtn").addEventListener("click", () => {
  updateStatus("Paused");
});

function updateStatus(state) {
  document.getElementById("status").querySelector("span").textContent = state;
  chrome.storage.local.set({ trackingStatus: state });
}
