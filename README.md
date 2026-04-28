# Video Speed Controller

A Chrome extension that controls the playback speed of any HTML5 `<video>` (or `<audio>`) on the page using a slider that ranges from **0.1x to 10x**.

## Features

- Slider control from 0.1x to 10x in 0.1x increments
- Quick preset buttons (0.5x, 1x, 1.5x, 2x, 3x)
- Reset to 1x button
- Persists the chosen speed via `chrome.storage.local`
- Applies to dynamically inserted videos (e.g. SPA navigations on YouTube) via a `MutationObserver`
- Re-applies the rate if a site tries to override it (catches `ratechange` events)
- Works inside iframes (`all_frames: true`)

## Install (developer mode)

1. Open `chrome://extensions`
2. Enable **Developer mode** (top right)
3. Click **Load unpacked**
4. Select this directory

Pin the extension, click its icon, and drag the slider while a video is playing.

## Files

- `manifest.json` — Manifest V3 declaration
- `popup.html` / `popup.css` / `popup.js` — Slider UI shown when the toolbar icon is clicked
- `content.js` — Runs on every page; applies the saved speed to media elements and watches for new ones
