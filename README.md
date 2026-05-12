# Japan 2025 trip planner

A single-file, no-build itinerary planner for a 16-day trip from London to Japan.

**Live route:** London → Tokyo (5 nights) → Osaka (3 nights) → Okinawa (6 nights) → Tokyo transit → London
**Dates:** 1 Jul – 17 Jul 2025

## Features

- Animated journey map banner across the top, with planes, shinkansen and ferry looping along their actual routes
- Per-day itinerary with editable city/location field
- Activity cards with time, duration, category, and notes
- 8 activity categories: Food, Temple/Shrine, Shopping, Transport, Nature, Culture, Hotel, Other
- Daily stats: activity count, total hours, category breakdown
- Add/remove days, edit trip name and start date
- Auto-saves to browser localStorage

## Running it

It's a single HTML file with no build step or dependencies. Three ways to run it:

1. **Local file** — double-click `index.html`. Opens in your default browser, works offline.
2. **GitHub Pages** — push to GitHub, enable Pages in Settings, get a live URL.
3. **Any static host** — Netlify Drop, Vercel, Cloudflare Pages all work with a drag-and-drop.

## Saving

Data is stored in your browser's localStorage under the key `jp-planner-v3`. This means:

- Persists between sessions on the same browser
- Tied to that specific browser on that specific device
- Clearing browser data wipes it
- No sync between devices yet

## Tech

Pure HTML + CSS + vanilla JavaScript. No framework, no build, no dependencies beyond Google Fonts for Jost and Cormorant Garamond (falls back to system fonts offline). The journey map is inline SVG with CSS animations and SMIL `<animateMotion>` for vehicles following their paths.
