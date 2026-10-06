"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { demos, type DemoId } from "@/data/content";
import { ArrowRightIcon } from "../Icons";

function Skeleton({ onLoad }: { onLoad?: () => void }) {
  return (
    <div className="grid min-h-[480px] place-items-center rounded-xl border border-dashed border-border bg-bg-elev p-6 text-center">
      <div>
        <p className="font-mono text-sm text-fg-muted">Loading demo…</p>
        {onLoad && (
          <button type="button" onClick={onLoad} className="mt-3 text-sm text-accent underline">
            Load demo now
          </button>
        )}
      </div>
    </div>
  );
}

// Each demo is its own chunk, fetched only when its tab is opened.
const DEMOS: Record<DemoId, React.ComponentType> = {
  routex: dynamic(() => import("./FleetDemo"), { ssr: false, loading: () => <Skeleton /> }),
  claritylegal: dynamic(() => import("./ContractDemo"), { ssr: false, loading: () => <Skeleton /> }),
  optiware: dynamic(() => import("./EdgeSortDemo"), { ssr: false, loading: () => <Skeleton /> }),
};

export function DemoTabs() {
  const ref = useRef<HTMLDivElement>(null);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<DemoId>("routex");

  // Deep links like /#demo-claritylegal open that tab.
  useEffect(() => {
    const fromHash = () => {
      const id = window.location.hash.replace("#demo-", "") as DemoId;
      if (demos.some((d) => d.id === id)) setActive(id);
    };
    fromHash();
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, []);

  // Defer loading any demo until the section approaches the viewport.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVisible(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onKeyDown = (e: React.KeyboardEvent, i: number) => {
    const n = demos.length;
    const next = e.key === "ArrowRight" ? (i + 1) % n : e.key === "ArrowLeft" ? (i - 1 + n) % n : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : -1;
    if (next < 0) return;
    e.preventDefault();
    setActive(demos[next].id);
    tabRefs.current[next]?.focus();
  };

  const demo = demos.find((d) => d.id === active)!;
  const Demo = DEMOS[active];

  return (
    <div ref={ref}>
      {demos.map((d) => (
        <span key={d.id} id={`demo-${d.id}`} className="block scroll-mt-24" aria-hidden />
      ))}
      <div role="tablist" aria-label="Project demos" className="flex gap-1 overflow-x-auto rounded-lg border border-border bg-bg-elev p-1 sm:inline-flex">
        {demos.map((d, i) => (
          <button
            key={d.id}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            id={`demo-tab-${d.id}`}
            role="tab"
            type="button"
            aria-selected={active === d.id}
            aria-controls={`demo-panel-${d.id}`}
            tabIndex={active === d.id ? 0 : -1}
            onClick={() => setActive(d.id)}
            onKeyDown={(e) => onKeyDown(e, i)}
            className={`flex-1 whitespace-nowrap rounded-md px-4 py-2 text-left text-sm transition-colors sm:flex-none ${
              active === d.id ? "bg-accent-solid text-accent-solid-fg" : "text-fg-muted hover:bg-bg-sunken hover:text-fg"
            }`}
          >
            <span className="block font-medium">{d.tab}</span>
            <span className={`block text-[11px] ${active === d.id ? "text-accent-solid-fg" : "text-fg-subtle"}`}>{d.title}</span>
          </button>
        ))}
      </div>

      <div id={`demo-panel-${demo.id}`} role="tabpanel" aria-labelledby={`demo-tab-${demo.id}`} className="mt-5">
        <div className="mb-4 max-w-3xl">
          <p className="text-fg-muted">{demo.intro}</p>
          <p className="mt-3 flex items-start gap-2 rounded-md border border-warn/40 bg-warn/5 px-3 py-2 text-xs leading-relaxed text-fg-muted">
            <span className="font-mono font-semibold uppercase text-warn">Demo</span>
            <span>{demo.disclaimer}</span>
          </p>
        </div>
        {visible ? <Demo key={demo.id} /> : <Skeleton onLoad={() => setVisible(true)} />}
        <Link href={`/projects/${demo.project}`} className="mt-4 inline-flex items-center gap-1.5 text-sm text-accent hover:underline">
          Read the {demo.tab} case study <ArrowRightIcon width={14} height={14} />
        </Link>
      </div>
    </div>
  );
}
