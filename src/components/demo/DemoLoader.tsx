"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

function Skeleton({ onLoad }: { onLoad?: () => void }) {
  return (
    <div className="grid min-h-[520px] place-items-center rounded-xl border border-dashed border-border bg-bg-elev p-6 text-center">
      <div>
        <p className="font-mono text-sm text-fg-muted">Loading fleet playback…</p>
        {onLoad && (
          <button type="button" onClick={onLoad} className="mt-3 text-sm text-accent underline">
            Load demo now
          </button>
        )}
      </div>
    </div>
  );
}

const FleetDemo = dynamic(() => import("./FleetDemo"), { ssr: false, loading: () => <Skeleton /> });

/** Defers loading the demo bundle until the section approaches the viewport. */
export function DemoLoader() {
  const ref = useRef<HTMLDivElement>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShow(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return <div ref={ref}>{show ? <FleetDemo /> : <Skeleton onLoad={() => setShow(true)} />}</div>;
}
