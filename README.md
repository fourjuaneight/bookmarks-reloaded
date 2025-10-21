# Bookmarks (Reloaded)

## Overview
Bookmarks (Reloaded) is a Next.js App Router project deployed on Vercel. It highlights personal bookmarks with client-side filtering, persistent preferences, and accessibility-first UI treatments while leaning on Vercel edge optimizations.

## Architecture
- **Framework**: Next.js 14 App Router with React 18, strict mode, and Vercel-managed build output.
- **Data layer**: [`getArticlesCached`](src/utils/database.ts) queries Neon PostgreSQL via `@neondatabase/serverless`, normalizes archive links, and caches results with `unstable_cache`.
- **Utilities**: [`sortArticlesData`](src/utils/articles.ts) powers deterministic locale-aware sorting; [`usePersistentState`](src/hooks/usePersistentState.ts) hydrates client state from `localStorage`.
- **Entry point**: [`Home`](src/app/page.tsx) fetches cached articles at build/runtime (`revalidate = 3600`) and renders the catalog UI.

## UI Composition
- **Layout**: [`RootLayout`](src/app/layout.tsx) injects critical CSS, global fonts, analytics, and shared chrome (`Header`, `Footer`, `NoiseBackground`).
- **Table view**: [`Table`](src/components/Table.tsx) implements column sorting, fuzzy search, pagination, and download links with accessible announcements.
- **Hero**: [`Intro`](src/components/Intro.tsx) swaps illustrations based on context and auto-enriches copy with safe link attributes.
- **Theming**: Tailwind CSS (`tailwind.config.js`) drives utility classes; bespoke global styles live in [`critical.css`](src/app/critical.css) and [`globals.css`](src/app/globals.css).

## Styling & Assets
- Custom properties define light/dark palettes and motion preferences.
- Critical path CSS is inlined during SSR; remaining styles load via Tailwind and PostCSS (`postcss.config.js`).
- Image imports flow through Next Image, so Vercel serves optimized AVIF/WebP variants.
- Local font files, like MD Nichrome, load via `next/font/local`, exposing `--font-md-nichrome` for Tailwind utilities and letting Vercel cache hashed font assets indefinitely.

## Deployment
- Target: Vercel hosting with automatic image and font edge caching.
- Environment: `.env` supplies database connection and public URLs consumed in `next.config.ts`.
- Analytics: `@vercel/analytics` and `@vercel/speed-insights` are enabled in the root layout.

## Development
```bash
pnpm install       # install dependencies
pnpm dev           # run local dev server at http://localhost:3000
pnpm lint          # run Next.js + ESLint checks
pnpm build         # generate the production bundle
```

Node version is pinned via `.nvmrc`. Run `pnpm dlx vercel@latest` to deploy manually if needed.