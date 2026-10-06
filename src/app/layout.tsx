import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { person, site, skills, education } from "@/data/content";
import { siteUrl } from "@/lib/site";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Providers } from "@/components/Providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"], display: "swap" });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"], display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: site.title, template: `%s · ${person.name}` },
  description: site.description,
  keywords: site.keywords,
  authors: [{ name: person.name, url: person.links.github }],
  creator: person.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "profile",
    url: "/",
    siteName: person.name,
    title: site.title,
    description: site.description,
    locale: "en_US",
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${person.name}: ${person.role}` }],
  },
  twitter: { card: "summary_large_image", title: site.title, description: site.description, images: ["/og.png"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0e14" },
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
  ],
};

const themeScript = `try{if(localStorage.getItem('theme')==='light'){document.documentElement.classList.remove('dark')}}catch(e){}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: person.name,
  url: siteUrl,
  email: `mailto:${person.email}`,
  jobTitle: person.role,
  description: person.summary,
  address: { "@type": "PostalAddress", addressLocality: person.location.split(",")[0], addressCountry: "IN" },
  alumniOf: { "@type": "CollegeOrUniversity", name: education.school },
  sameAs: [person.links.github, person.links.linkedin],
  knowsAbout: skills.flatMap((s) => s.items).slice(0, 20),
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`dark ${geistSans.variable} ${geistMono.variable}`} data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      </head>
      <body className="min-h-dvh antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-accent-solid focus:px-4 focus:py-2 focus:text-accent-solid-fg"
        >
          Skip to content
        </a>
        <Providers>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
