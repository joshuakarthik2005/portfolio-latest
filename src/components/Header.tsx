"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { nav, person } from "@/data/content";
import { useUI } from "./Providers";
import { CloseIcon, MenuIcon, MoonIcon, SearchIcon, SunIcon } from "./Icons";

export function Header() {
  const { theme, toggleTheme, openPalette } = useUI();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isMac, setIsMac] = useState(true);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsMac(/Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent));
  }, []);

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border/70 bg-bg/95">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link href="/" className="font-mono text-sm font-medium tracking-tight text-fg hover:text-accent">
          <span className="text-accent">~/</span>
          {person.name.split(" ")[0].toLowerCase()}
        </Link>

        <nav aria-label="Primary" className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {nav.map((n) => (
              <li key={n.id}>
                <Link href={`/#${n.id}`} className="rounded-md px-3 py-2 text-fg-muted transition-colors hover:text-fg">
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={openPalette}
            className="flex h-9 items-center gap-2 rounded-md border border-border bg-bg-elev px-2.5 text-xs text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
            aria-label="Open command palette"
            aria-keyshortcuts="Control+K Meta+K"
          >
            <SearchIcon />
            <kbd className="hidden font-mono sm:inline">{isMac ? "⌘" : "Ctrl"} K</kbd>
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-9 w-9 place-items-center rounded-md border border-border bg-bg-elev text-fg-muted transition-colors hover:border-border-strong hover:text-fg"
            aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>
          <button
            type="button"
            className="grid h-9 w-9 place-items-center rounded-md border border-border bg-bg-elev text-fg-muted md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </div>
      {menuOpen && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-border md:hidden">
          <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-1 px-4 py-3 text-sm">
            {nav.map((n) => (
              <li key={n.id}>
                <Link
                  href={`/#${n.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="block rounded-md px-3 py-2.5 text-fg-muted hover:bg-bg-elev hover:text-fg"
                >
                  {n.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
