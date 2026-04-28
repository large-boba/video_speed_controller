const slider = document.getElementById("speed-slider");
const speedValue = document.getElementById("speed-value");
const presets = document.querySelectorAll(".preset");
const resetBtn = document.getElementById("reset");
const status = document.getElementById("status");

const MIN_SPEED = 0.1;
const MAX_SPEED = 10;

function clamp(value) {
  return Math.min(MAX_SPEED, Math.max(MIN_SPEED, value));
}

function formatSpeed(value) {
  return Number(value).toFixed(1);
}

function updateDisplay(speed) {
  speedValue.textContent = formatSpeed(speed);
  presets.forEach((btn) => {
    btn.classList.toggle("active", parseFloat(btn.dataset.speed) === speed);
  });
}

async function applySpeed(speed) {
  const clamped = clamp(parseFloat(speed));
  slider.value = clamped;
  updateDisplay(clamped);

  await chrome.storage.local.set({ playbackSpeed: clamped });

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab) return;

  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id, allFrames: true },
      func: (rate) => {
        document.querySelectorAll("video, audio").forEach((el) => {
          el.playbackRate = rate;
        });
        window.__vsc_currentRate = rate;
      },
      args: [clamped],
    });
    status.textContent = "";
  } catch (err) {
    status.textContent = "Cannot access this page.";
  }
}

slider.addEventListener("input", (e) => {
  updateDisplay(parseFloat(e.target.value));
});

slider.addEventListener("change", (e) => {
  applySpeed(e.target.value);
});

presets.forEach((btn) => {
  btn.addEventListener("click", () => {
    applySpeed(btn.dataset.speed);
  });
});

resetBtn.addEventListener("click", () => {
  applySpeed(1);
});

(async function init() {
  const { playbackSpeed = 1 } = await chrome.storage.local.get("playbackSpeed");
  slider.value = playbackSpeed;
  updateDisplay(playbackSpeed);
})();
