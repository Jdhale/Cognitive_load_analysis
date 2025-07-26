// ✅ Backend API URL
const BACKEND_URL = "http://127.0.0.1:8000/track"; // Change if needed

let lastScrollY = window.scrollY;
let lastTimestamp = Date.now();
const dwellTimes = new Map();

// ✅ Function to send event data to FastAPI
function sendDataToBackend(type, data) {
  console.log("📤 Sending:", type, data);
  fetch(BACKEND_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      eventType: type,
      data: data
    })
  }).then(response => {
    if (!response.ok) throw new Error("Failed to send data");
    return response.json();
  }).then(result => {
    console.log("✅ Server response:", result);
  }).catch(error => {
    console.error("❌ Error sending data:", error.message);
  });
}

// 🖱 Scroll Tracking
window.addEventListener("scroll", () => {
  const currentScrollY = window.scrollY;
  const currentTime = Date.now();
  const scrollSpeed = Math.abs(currentScrollY - lastScrollY) / (currentTime - lastTimestamp + 1);

  sendDataToBackend("scroll", {
    scrollSpeed: scrollSpeed.toFixed(2)
  });

  lastScrollY = currentScrollY;
  lastTimestamp = currentTime;
});

// 🧠 Dwell Tracking using IntersectionObserver
const observedSections = document.querySelectorAll("section, div, h1, h2");
observedSections.forEach((el, i) => {
  el.dataset.trackId = `section-${i}`;
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    const id = entry.target.dataset.trackId;

    if (entry.isIntersecting) {
      dwellTimes.set(id, Date.now());
    } else {
      const enterTime = dwellTimes.get(id);
      if (enterTime) {
        const dwell = ((Date.now() - enterTime) / 1000).toFixed(2);
        sendDataToBackend("dwell", {
          section: id,
          dwellTime: dwell
        });
        dwellTimes.delete(id);
      }
    }
  });
}, { threshold: 0.5 });

observedSections.forEach(el => observer.observe(el));

// ⌨️ Backspace Key Tracking
window.addEventListener("keydown", (e) => {
  if (e.key === "Backspace") {
    sendDataToBackend("backspace", {
      location: window.location.href
    });
  }
});

// 🔙 Back Button Tracking
window.addEventListener("popstate", () => {
  sendDataToBackend("back_navigation", {
    url: window.location.href
  });
});

// 🔄 Page Reload Tracking
window.addEventListener("beforeunload", () => {
  sendDataToBackend("reload", {
    location: window.location.href
  });
});

// 🧭 Tab Switch / Visibility Change
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") {
    sendDataToBackend("tab_hidden", {
      location: window.location.href
    });
  } else if (document.visibilityState === "visible") {
    sendDataToBackend("tab_visible", {
      location: window.location.href
    });
  }
});
