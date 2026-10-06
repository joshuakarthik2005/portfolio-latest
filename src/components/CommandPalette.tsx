"use client";

import { AnimatePresence, LazyMotion, MotionConfig, domAnimation, m } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { nav, person, projects } from "@/data/content";
import { useUI } from "./Providers";
import { basePath } from "@/lib/site";

type Item = {
  id: string;
  group: string;
  label: string;
  hint?: string;
  keywords?: string;
  run: () => void;
};

export default function CommandPalette({ open, onClose }: { open: boolean; onClose: () => void }) {
  const router = useRouter();
  const { theme, toggleTheme, solverMode, toggleSolverMode } = useUI();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [toast, setToast] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const listId = useId();

  const go = (href: string) => {
    onClose();
    if (href.startsWith("/#") && window.location.pathname.replace(/\/$/, "") === basePath) {
      const el = document.getElementById(href.slice(2));
      if (el) {
        el.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        history.replaceState(null, "", href.slice(1));
        (el.querySelector("h2") as HTMLElement | null)?.focus({ preventScroll: true });
        return;
      }
    }
    router.push(href);
  };

  const items: Item[] = useMemo(() => {
    const base: Item[] = [
      ...nav.map((n) => ({ id: `nav-${n.id}`, group: "Jump to", label: n.label, hint: "section", run: () => go(`/#${n.id}`) })),
      { id: "nav-pub", group: "Jump to", label: "Publication", hint: "section", run: () => go("/#publication") },
      ...projects.map((p) => ({
        id: `proj-${p.slug}`,
        group: "Projects",
        label: p.name,
        hint: p.tagline,
        keywords: p.stack.join(" "),
        run: () => go(`/projects/${p.slug}`),
      })),
      {
        id: "resume",
        group: "Actions",
        label: "Download resume (PDF)",
        keywords: "cv pdf",
        run: () => {
          onClose();
          const a = document.createElement("a");
          a.href = person.links.resume;
          a.download = "";
          a.click();
        },
      },
      { id: "theme", group: "Actions", label: `Switch to ${theme === "dark" ? "light" : "dark"} theme`, keywords: "dark light mode toggle", run: () => { toggleTheme(); onClose(); } },
      {
        id: "email",
        group: "Actions",
        label: "Copy email address",
        hint: person.email,
        keywords: "contact mail",
        run: () => {
          navigator.clipboard?.writeText(person.email).then(
            () => setToast("Email copied to clipboard"),
            () => setToast(person.email),
          );
        },
      },
      { id: "github", group: "Links", label: "Open GitHub", hint: "github.com/joshuakarthik2005", run: () => { onClose(); window.open(person.links.github, "_blank", "noopener"); } },
      { id: "linkedin", group: "Links", label: "Open LinkedIn", run: () => { onClose(); window.open(person.links.linkedin, "_blank", "noopener"); } },
    ];

    const q = query.trim().toLowerCase();
    // Easter eggs (hidden unless typed exactly)
    if (q === "sudo hire joshua" || q === "sudo hire") {
      return [
        {
          id: "egg-sudo",
          group: "root",
          label: "[sudo] permission granted. Opening a new email…",
          run: () => {
            onClose();
            window.location.href = `mailto:${person.email}?subject=${encodeURIComponent("Let's talk: opportunity for Joshua")}`;
          },
        },
      ];
    }
    if (q === "solver" || q === "konami" || q === "cp-sat") {
      return [
        {
          id: "egg-solver",
          group: "hidden",
          label: solverMode ? "Disable solver-trace accent" : "Enable solver-trace accent",
          hint: "↑↑↓↓←→←→BA also works",
          run: () => { toggleSolverMode(); onClose(); },
        },
      ];
    }
    if (!q) return base;
    return base.filter((i) => `${i.label} ${i.hint ?? ""} ${i.keywords ?? ""} ${i.group}`.toLowerCase().includes(q));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, theme, solverMode]);

  useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement as HTMLElement | null;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setQuery("");
      setActive(0);
      setToast(null);
      requestAnimationFrame(() => inputRef.current?.focus());
      const prev = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prev;
        restoreRef.current?.focus?.();
      };
    }
  }, [open]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setActive(0);
  }, [query]);

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" });
  }, [active]);

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => (items.length ? (a + 1) % items.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => (items.length ? (a - 1 + items.length) % items.length : 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      items[active]?.run();
    } else if (e.key === "Tab") {
      // Keep focus inside the dialog.
      e.preventDefault();
    }
  };

  let lastGroup = "";

  return (
    // Framer Motion is only loaded with the palette, keeping it out of the initial bundle.
    <MotionConfig reducedMotion="user">
    <LazyMotion features={domAnimation} strict>
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[90] flex items-start justify-center px-4 pt-[12vh]" onKeyDown={onKeyDown}>
          <m.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            aria-hidden
          />
          <m.div
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="relative w-full max-w-xl overflow-hidden rounded-xl border border-border-strong bg-bg-elev shadow-2xl"
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
          >
            <div className="flex items-center gap-3 border-b border-border px-4">
              <span className="font-mono text-sm text-accent" aria-hidden>
                ❯
              </span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Type a command or search…"
                className="h-12 w-full bg-transparent font-mono text-sm text-fg outline-none placeholder:text-fg-subtle focus-visible:outline-none"
                role="combobox"
                aria-expanded="true"
                aria-controls={listId}
                aria-activedescendant={items[active] ? `${listId}-${items[active].id}` : undefined}
                aria-autocomplete="list"
                aria-label="Search commands"
                spellCheck={false}
                autoComplete="off"
              />
              <kbd className="rounded border border-border px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle">ESC</kbd>
            </div>
            <ul ref={listRef} id={listId} role="listbox" aria-label="Commands" className="max-h-[50vh] overflow-y-auto p-2">
              {items.length === 0 && <li className="px-3 py-6 text-center text-sm text-fg-subtle">No results for “{query}”</li>}
              {items.map((item, i) => {
                const header = item.group !== lastGroup ? item.group : null;
                lastGroup = item.group;
                return (
                  <li key={item.id} role="presentation">
                    {header && (
                      <div className="px-3 pb-1 pt-3 font-mono text-[11px] uppercase tracking-wider text-fg-subtle" aria-hidden>
                        {header}
                      </div>
                    )}
                    <div
                      id={`${listId}-${item.id}`}
                      role="option"
                      aria-selected={i === active}
                      data-index={i}
                      onMouseMove={() => setActive(i)}
                      onClick={() => item.run()}
                      className={`flex cursor-pointer items-center justify-between gap-4 rounded-md px-3 py-2.5 text-sm ${
                        i === active ? "bg-accent-soft text-fg" : "text-fg-muted"
                      }`}
                    >
                      <span>{item.label}</span>
                      {item.hint && <span className="truncate text-xs text-fg-subtle">{item.hint}</span>}
                    </div>
                  </li>
                );
              })}
            </ul>
            <div className="flex items-center justify-between border-t border-border px-4 py-2 font-mono text-[11px] text-fg-subtle">
              <span aria-live="polite">{toast ?? "↑↓ navigate · ↵ select"}</span>
              <span className="hidden sm:inline">esc to close</span>
            </div>
          </m.div>
        </div>
      )}
    </AnimatePresence>
    </LazyMotion>
    </MotionConfig>
  );
}
