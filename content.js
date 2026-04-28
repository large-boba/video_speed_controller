(() => {
  const STORAGE_KEY = "playbackSpeed";

  function applyRate(rate) {
    document.querySelectorAll("video, audio").forEach((el) => {
      if (el.playbackRate !== rate) el.playbackRate = rate;
    });
  }

  let currentRate = 1;

  chrome.storage.local.get(STORAGE_KEY, (result) => {
    currentRate = typeof result[STORAGE_KEY] === "number" ? result[STORAGE_KEY] : 1;
    applyRate(currentRate);
  });

  chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local" || !changes[STORAGE_KEY]) return;
    currentRate = changes[STORAGE_KEY].newValue;
    applyRate(currentRate);
  });

  const observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      for (const node of mutation.addedNodes) {
        if (node.nodeType !== 1) continue;
        if (node.tagName === "VIDEO" || node.tagName === "AUDIO") {
          node.playbackRate = currentRate;
        } else if (node.querySelectorAll) {
          node.querySelectorAll("video, audio").forEach((el) => {
            el.playbackRate = currentRate;
          });
        }
      }
    }
  });

  observer.observe(document.documentElement, { childList: true, subtree: true });

  document.addEventListener(
    "ratechange",
    (e) => {
      const el = e.target;
      if (!(el instanceof HTMLMediaElement)) return;
      if (Math.abs(el.playbackRate - currentRate) > 0.001) {
        el.playbackRate = currentRate;
      }
    },
    true
  );
})();
