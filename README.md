# Fly Express Financial Projections

Interactive financial projections for Fly Express revenue streams (additional passenger travels, parcels, luggage, return-ticket uplift, and advertising), with editable drivers, calculation walkthroughs, and localStorage persistence.

## Quick start

```bash
npm install
npm run dev
```

Open the local URL shown by Vite (typically http://localhost:5173).

Production build:

```bash
npm run build
npm run preview
```

Build output is written to `dist/`. The build also runs a small defaults verification script.

## Routes

| Path | Page |
|------|------|
| `/` | Projection Summary — KPI cards, stream table, definitions |
| `/inputs` | Edit all drivers (label, value, unit, purpose); saved to localStorage |
| `/calculations` | Symbolic formulas with substituted numbers and return-ticket logic |

## Cloudflare Pages

1. Connect this GitHub repository (`xristo7/flyexpressprojections`) in the Cloudflare Pages dashboard.
2. Configure the project:
   - **Framework preset:** Vite
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
3. Deploy. SPA deep links are covered by `public/_redirects`:

```
/*    /index.html   200
```

See `wrangler.toml` for optional notes if you use Wrangler alongside Pages.

## Stack

- Vite + React + TypeScript
- Tailwind CSS v4 (`@tailwindcss/vite`)
- React Router
- Static SPA suitable for Cloudflare Pages
