# GeoDaily deployment

This is the editable React application with the approved blue glass interface.
It includes daily and practice games, a five-round flow, map picking, scoring,
clues, results sharing, settings, saved daily progress, and browser-local stats.
It does not provide accounts or cross-device synchronization.

## Run locally

Use Node 24.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Set `VITE_GOOGLE_MAPS_API_KEY` in `.env.local` before running. Use your existing
Google Maps configuration. The Maps JavaScript API must be enabled for the key,
and its allowed HTTP referrers must include your local and deployed origins.
Do not commit `.env.local`.

Without a configured key, the map still loads but Street View shows the
unavailable-view fallback. That fallback is not real Street View gameplay.

## Build

```sh
npm run build
npm run preview
```

The build emits `dist/index.html` plus its JS, CSS, and map worker. Deploy the
whole `dist` directory, not the HTML file alone. `index.html` at the project root
is also regenerated for the design preview. `dev.html` remains the editable
source entry. Use an HTTP server, not a file URL, to serve the app.

## Existing Vercel project

Deploy this source through the repository connected to your existing GeoDaily
Vercel project. `vercel.json` declares npm installation, the Vite build, and the
`dist` output directory. Preserve existing project settings and domain bindings.

Ensure `VITE_GOOGLE_MAPS_API_KEY` is configured in the intended Vercel environment
before building. Vite embeds that value in the client bundle. Rebuild after
changing it. Review a preview deployment before promoting it to your live domain.

Official configuration reference: https://vercel.com/docs/project-configuration

## Data and external services

Progress, statistics, and settings are stored in the browser under the existing
GeoDaily keys. They carry over when the deployment uses the same origin. A
separate preview origin has separate storage. Maps use OpenFreeMap and retain
provider attribution; fonts load from Google Fonts. These services require
internet access.

The live deployment and the original linked source folder have not been modified
from this workspace. No credentials are included in this deliverable.
