import type { NextConfig } from "next";

// Set NEXT_PUBLIC_BASE_PATH (e.g. "/portfolio-latest") when serving from a sub-path such as
// a GitHub Pages project site. Leave unset for a root domain.
const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

const nextConfig: NextConfig = {
  output: "export",
  basePath: basePath || undefined,
  // Emit /projects/routex/index.html so static hosts like GitHub Pages resolve clean URLs.
  trailingSlash: true,
  images: { unoptimized: true },
  poweredByHeader: false,
};

export default nextConfig;
