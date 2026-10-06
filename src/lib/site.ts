/**
 * Canonical site URL. Set NEXT_PUBLIC_SITE_URL in Vercel (or .env.local) once the
 * domain is known. Falls back to Vercel's production URL, then localhost.
 */
export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000")
).replace(/\/$/, "");
