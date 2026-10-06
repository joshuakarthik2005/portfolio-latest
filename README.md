# Joshua Karthik Ashok · Portfolio

Personal portfolio for a Backend & AI Systems Engineer. It's a single page with anchored sections, a case study page per project, a client-side fleet playback demo, and a ⌘K command palette.

**Stack:** Next.js 16 (App Router, static export) · TypeScript · Tailwind CSS v4 · Framer Motion (loaded only with the command palette) · Geist / Geist Mono via `next/font`.

## Editing content

All copy lives in **`src/data/content.ts`**: hero, proof points, projects, experience, achievements, publication, skills, contact. Components contain no hard-coded text.

- Hide an experience entry: set `visible: false`.
- Hide every placeholder box: set `showPlaceholders = false`.
- Demo data (ports, fleet, illustrative schedule) is in `src/data/fleet-demo.ts`.
- The resume download is `public/Joshua-Karthik-Ashok-Resume.pdf`.

Original source documents are in `_sources/`. Open items are listed in `TODO.md` and source conflicts in `CONFLICTS.md`.

## Run locally

```bash
npm install
npm run dev          # http://localhost:3000
```

## Quality checks

```bash
npm run lint
npm run typecheck
npm run build        # static export to ./out (plus scripts/flatten-rsc.mjs)
npm run preview      # serves ./out on http://localhost:4173
npx lighthouse http://localhost:4173 --view   # mobile preset by default
```

## Deploy (Vercel)

1. Push this folder to a GitHub repo.
2. In Vercel, choose **New Project → Import** that repo. The framework is detected as Next.js and no settings are needed. `output: "export"` produces static files.
3. Add the environment variable `NEXT_PUBLIC_SITE_URL=https://your-domain` (used for canonical URLs, the sitemap and Open Graph).
4. Deploy. Optionally add a custom domain under Settings → Domains.

Any static host (Netlify, Cloudflare Pages, GitHub Pages) can also serve `./out` directly.

> `scripts/flatten-rsc.mjs` runs after `next build`. It copies Next 16's nested segment payload files to the dotted filenames the client router requests. Without it, plain static servers return 404 on client-side navigation prefetches.

## Structure

```
src/
  app/
    layout.tsx            metadata, JSON-LD Person, theme bootstrap, header/footer
    page.tsx              home sections
    projects/[slug]/      case study pages (statically generated)
    og.png/route.tsx      Open Graph image, rendered to /og.png at build time
    sitemap.ts, robots.ts, icon.svg, not-found.tsx
  components/
    sections/             Hero, Projects, Experience, Achievements (+ Publication), Skills, Contact
    demo/                 DemoLoader (lazy, IntersectionObserver) + FleetDemo
    CommandPalette.tsx    ⌘K / Ctrl+K palette (lazy-loaded)
    Providers.tsx         theme, palette state, Konami easter egg
  data/
    content.ts            all copy
    fleet-demo.ts         demo dataset and timeline derivation
```

## Accessibility & motion

- Semantic landmarks, a skip link, labelled sections, and a visible focus ring.
- Theme tokens meet WCAG AA in both themes (checked with a contrast script).
- `prefers-reduced-motion` disables CSS animation and smooth scroll, and stops the demo from autoplaying.
- Every page is complete without animation. The demo needs JavaScript; its data is also available as a table.

## Easter eggs

- In the command palette, type `sudo hire joshua`.
- On any page, enter ↑ ↑ ↓ ↓ ← → ← → B A to toggle a "solver-trace" accent. Typing `solver` in the palette does the same.
