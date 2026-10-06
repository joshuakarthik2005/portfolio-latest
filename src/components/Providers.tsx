"use client";

import dynamic from "next/dynamic";
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const CommandPalette = dynamic(() => import("./CommandPalette"), { ssr: false });

type Theme = "dark" | "light";
type Ctx = {
  theme: Theme;
  toggleTheme: () => void;
  openPalette: () => void;
  solverMode: boolean;
  toggleSolverMode: () => void;
};

const UIContext = createContext<Ctx | null>(null);

export function useUI() {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used inside <Providers>");
  return ctx;
}

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export function Providers({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("dark");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [paletteLoaded, setPaletteLoaded] = useState(false);
  const [solverMode, setSolverMode] = useState(false);

  useEffect(() => {
    // Sync with the pre-hydration theme script.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme((t) => {
      const next = t === "dark" ? "light" : "dark";
      document.documentElement.classList.toggle("dark", next === "dark");
      try {
        localStorage.setItem("theme", next);
      } catch {}
      return next;
    });
  }, []);

  const toggleSolverMode = useCallback(() => {
    setSolverMode((s) => {
      document.documentElement.classList.toggle("solver-mode", !s);
      return !s;
    });
  }, []);

  const openPalette = useCallback(() => {
    setPaletteLoaded(true);
    setPaletteOpen(true);
  }, []);

  useEffect(() => {
    let seq: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteLoaded(true);
        setPaletteOpen((o) => !o);
        return;
      }
      const target = e.target as HTMLElement | null;
      if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
      seq = [...seq, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KONAMI.length);
      if (seq.join() === KONAMI.join()) {
        seq = [];
        toggleSolverMode();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggleSolverMode]);

  return (
    <UIContext.Provider value={{ theme, toggleTheme, openPalette, solverMode, toggleSolverMode }}>
      {children}
      {paletteLoaded && <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} />}
    </UIContext.Provider>
  );
}
