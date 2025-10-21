# Podcast Player - ZARA Front-End Test

Single Page Application (SPA) for listening to music podcasts. Application developed with React, TypeScript, Vite and TailwindCSS.

## Requirements Met

**3 Views Implemented:**
- Main view: Top 100 podcasts with reactive filter
- Podcast detail: Sidebar + episode list
- Episode detail: Native HTML5 player + sanitized description

**Technical Features:**
- Clean URLs (no hash #)
- SPA with client-side navigation
- 24h local cache with React Query
- Unminified assets in development
- Minified assets in production
- Visual navigation indicator in top-right corner
- HTML sanitized with DOMPurify
- Dark theme inspired by Spotify

---

## Installation

### Prerequisites
- Node.js 22+ 
- npm
- Git
- Docker (optional, for container deployment)

### Installation Steps

```bash
# 1. Clone repository
git clone https://github.com/devnielo/podcast.git
cd podcast

# 2. Install dependencies
npm install
```

### CORS Setup (Important)

The application uses the CORS proxy `https://cors-anywhere.herokuapp.com/` to fetch podcast data from iTunes API.

**Before running the application for the first time:**

1. Visit `https://cors-anywhere.herokuapp.com/corsdemo` in your browser
2. Click the "Request temporary access to the demo server" button
3. You will receive temporary access (valid for 7 days)
4. After 7 days, you may need to request access again

Alternatively, the app has a fallback to `https://allorigins.win/` if the primary proxy is unavailable.

---

## Recommended Development Mode

**Unminified assets with Hot Module Replacement (HMR)**

```bash
npm run dev
```

The application will automatically open at `http://localhost:5173`

**Features:**
- Hot Module Replacement (HMR)
- Source maps for debugging
- Unminified assets (readable in DevTools)
- Detailed console logs
- Real-time type validation

---

## Production Mode

**Concatenated and minified assets**

### Build

```bash
npm run build
```

This generates:
- Minified files in `dist/`
- Optimized and concatenated assets
- Optional source maps

### Serve Locally

```bash
npm run preview
```

The application will be available at `http://localhost:4173`

---

## Docker (Production)

### With docker-compose (Recommended)

```bash
docker-compose up --build
```

### Or manually

```bash
docker build -t podcast-web:latest .
docker run --rm -p 4173:4173 podcast-web:latest
```

The application will be available at `http://localhost:4173`

### Docker Features
- Node.js 24 (compatible with Vite)
- Build with `npm install` + `npm run build`
- Runs `npm run preview --host` to serve assets
- Accessible from host with `--host`
- Optimized image (~500MB)
- Perfect for testing and development

---

## npm Scripts

```bash
npm run dev          # Development mode with HMR
npm run build        # Production build (minified)
npm run preview      # Local preview of build
npm run lint         # ESLint + Prettier check
npm run typecheck    # TypeScript type checking
npm run test         # Tests with Vitest
npm run test:ui      # Tests UI dashboard
npm run test:coverage # Coverage report
```

---

## Architecture

```
src/
├── app/
│   ├── layout/          # Base layout and header
│   ├── providers/       # Context providers (React Query, Player, etc.)
│   └── routes/          # Route configuration
├── pages/
│   ├── home/            # Main view (Top 100)
│   ├── podcast/         # Podcast detail
│   └── episode/         # Episode detail
├── features/
│   └── podcasts/        # Domain components and hooks
├── entities/
│   ├── podcast/         # Types and mappers
│   └── episode/         # Types and mappers
├── shared/
│   ├── api/             # Fetcher, adapters, CORS proxy
│   ├── components/      # Generic UI
│   ├── hooks/           # Reusable hooks
│   └── utils/           # Helpers
└── index.css            # Global styles
```

---

## APIs Used

- **Top 100 Podcasts:** `https://itunes.apple.com/us/rss/toppodcasts/limit=100/genre=1310/json`
- **Podcast Detail:** `https://itunes.apple.com/lookup?id={podcastId}`
- **CORS Proxy:** `https://cors-anywhere.herokuapp.com/` (requires temporary access request)

---

## Local Cache (24h)

The application implements 24-hour local cache using React Query:

- **Top 100 podcasts:** First request is cached
- **Podcast details:** Cached per podcast
- **Episodes:** Cached per podcast

After 24h, the application automatically requests fresh data.

---

## Technologies

- **Framework:** React 18+
- **Language:** TypeScript (strict mode)
- **Build Tool:** Vite
- **Styling:** TailwindCSS
- **State Management:** React Query (server state)
- **Routing:** React Router v6+ (clean URLs)
- **Sanitization:** DOMPurify
- **Icons:** Lucide Icons
- **Font:** Monument Grotesk

---

## Testing

```bash
# Unit and component tests
npm run test

# With UI dashboard
npm run test:ui

# Coverage report
npm run test:coverage
```

---

## Bonus Features

- **Advanced Header Search:** Dropdown with mini podcast cards (SPA, no refresh)
- **Sticky Filters:** Automatically appear when scrolling and hidden under header
- **Spotify-inspired Design:** Dark theme, Monument Grotesk, cards with hover effects
- **Accessibility:** ARIA roles, keyboard navigation (ArrowLeft/Right), semantic HTML
- **Production-Grade Tests:** 60 tests, >85% coverage, Vitest + RTL + MSW
- **Multi-stage Docker:** Optimized build, Nginx with SPA fallback
- **Strict TypeScript:** `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`

---

## Commits and Versions

The project uses Conventional Commits and semantic versioning:

- `v0.1.0-init` - Initial scaffold
- `v0.2.0-home` - Main view
- `v0.3.0-podcast-detail` - Podcast detail
- `v0.4.0-episode-detail` - Episode detail
- `v0.5.0-sanitization` - HTML sanitization
- `v0.6.0+` - Optimizations and improvements
- `v1.0.0-production-ready` - **FINAL VERSION - All requirements met, tests passing**

---

## Debugging

### In Development

1. Open DevTools (F12)
2. Go to **Console** tab to see logs
3. Use **Network** to inspect requests
4. **Sources** shows unminified code with source maps

### In Production

- Errors are shown in browser console
- No unnecessary logs
- Minified assets for better performance

---

## License

Property of ZARA - Front-End Test

---

## Author

Developed by Daniel Quesada as a front-end technical test for ZARA
