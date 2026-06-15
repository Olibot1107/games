# Paper Stars — Claude Code Context

## Project overview
Browser-based games arcade site. Static frontend served by Express, with a Node server for write-only API routes. A service worker (`sw.js`) handles caching and serves static JSON data files directly to the client.

## Stack
- **Frontend**: Vanilla JS + Tailwind CSS (CDN), no build step
- **Backend**: Node.js / Express (`index.js` → `server/`)
- **Service worker**: `sw.js` — intercepts fetch, caches static files including JSON data
- **Port**: 3000

## Directory layout
```
index.html          # Main games page
pages/
  leaderboard.html
  chat.html
  video.html
lib/
  theme.js          # Shared light/dark toggle logic
  theme.css         # Cross-page [data-theme="light"] overrides
  home/
    main.js         # Main page JS (game cards, sort, search, comments, plays)
    annoucemnets.js
    random.js
  playtime.js
  statusbar.js
server/
  data.js           # File paths, helpers (readPlays, writeComments, etc.)
  socialRoutes.js   # POST/PUT/DELETE API routes for plays, comments, votes
  mediaRoutes.js
  resourceRoutes.js
sw.js               # Service worker
*.json              # Data files: plays.json, comments.json, votes.json, etc.
thumbnails/         # Game thumbnail images
```

## Data access rules — CRITICAL
- **Reads**: Always fetch JSON files directly (`fetchPlainJson('/plays.json')`, `fetchPlainJson('/comments.json')`). The service worker caches these. Never use GET API routes to read data.
- **Writes**: POST/PUT/DELETE to API routes (`/api/plays`, `/api/comments`, `/api/vote`). These persist to disk server-side.
- **Cache invalidation after write**: call `invalidatePlainJsonCache('/plays.json')` (not `invalidateResourceJsonCache`).
- There are **no** `GET /api/plays` or `GET /api/comments` routes — they were intentionally removed.

## Theming (light/dark mode)
- CSS custom properties on `<html>`: `:root` = dark defaults, `[data-theme="light"]` = light overrides
- `localStorage` key: `ps-theme` (`'dark'` or `'light'`)
- FOUC prevention: synchronous inline `<script>` in `<head>` of every page reads `ps-theme` and sets `data-theme` attribute before render
- Shared files: `lib/theme.js` (toggle button wiring) + `lib/theme.css` (cross-page overrides with `!important`)
- Toggle button id: `#theme-toggle`, icons: `#theme-icon-sun` / `#theme-icon-moon`
- Keyboard shortcut: `t` toggles theme (wired in `lib/home/main.js`)
- Game card text stays white even in light mode — exception rule in index.html styles:
  `[data-theme="light"] .game-card .text-white, [data-theme="light"] .game-card [class*="text-white"] { color: #fff !important; }`
- Tailwind arbitrary class escaping in CSS selectors: `#` inside `[]` must be `\#` — or better, target by element ID to avoid escaping issues

## Key JS patterns in main.js
- `fetchPlainJson(url)` — fetches static JSON via service worker cache
- `fetchEncryptedJson(url)` — fetches encrypted resources (do NOT use for plays/comments)
- `invalidatePlainJsonCache(url)` — busts SW cache for a plain JSON file after a write
- Sort modes: `popular`, `newest`, `az`, `mytime` (by user's own playtime), `mostplayed`
- Search matches both raw slug name and display name (hyphens/underscores → spaces)
