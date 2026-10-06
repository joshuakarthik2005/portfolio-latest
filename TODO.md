# TODO before publishing

Placeholders show as dashed amber boxes marked **PLACEHOLDER**. To hide all of them at once, set
`showPlaceholders = false` in `src/data/content.ts`.

## Missing assets

- [ ] **Headshot (optional)**: no placeholder is shown. To add a photo, put `public/headshot.jpg` (square, at least 288×288) and set `person.headshot = withBase("/headshot.jpg")`.
- [ ] **RouteX screenshot**: dashboard or results view. Set `projects[0].detail.media[0].src`.
- [ ] **RouteX demo video**: route playback recording (MP4/WebM, under ~8 MB, or host on YouTube and link it). Set `media[1].src`.
- [ ] **ClarityLegal screenshot**: the repo has GIFs (`upload.gif`, `risk.gif`, `chat.gif`…), but each is 0.8–4.5 MB. Convert one to WebP/MP4 before using it.
- [ ] **ClarityLegal demo video**: the README's YouTube link is a placeholder (`youtube.com/your-demo-video`).
- [ ] **OptiWare screenshot**: edge device or detection output.
- [ ] **OptiWare demo video**.

## Deployed URLs

- [ ] **Site domain**: currently `https://joshuakarthik2005.github.io/portfolio-latest/` (set in `.github/workflows/deploy-pages.yml`). Update it there if you add a custom domain.
- [ ] **ClarityLegal live demo**: optionally add `https://clarity-legal-ten.vercel.app`. See CONFLICTS.md #10.
- [ ] **RouteX live demo**: none exists. Add one if you deploy it.

## Content to confirm

- [ ] Review the rows in `CONFLICTS.md` not marked RESOLVED.
- [ ] `contactCopy.blurb` is deliberately neutral. Say what you're looking for (role type, start date) if you want.
- [ ] OptiWare architecture was reconstructed from the resume bullets. Confirm the data flow, then delete `architectureNote`.
- [ ] Project "Key decisions" text is drawn from the READMEs and resume. Read them once in your own voice.
- [ ] Replace `public/Joshua-Karthik-Ashok-Resume.pdf` whenever the resume changes. It's currently a copy of the Sep 2026 PDF.
