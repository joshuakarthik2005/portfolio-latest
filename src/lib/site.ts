/**
 * Path prefix when the site is served from a sub-path, e.g. "/portfolio-latest"
 * on GitHub Pages project sites. Empty for a root domain (Vercel, custom domain).
 */
export const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

/** Prefix a root-relative asset path (e.g. "/resume.pdf") with the base path. */
export const withBase = (path: string) => `${basePath}${path}`;

/**
 * Canonical site URL including any base path. Set NEXT_PUBLIC_SITE_URL at build
 * time once the domain is known. Falls back to Vercel's production URL, then localhost.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : `http://localhost:3000${basePath}`)
).replace(/\/$/, "");
