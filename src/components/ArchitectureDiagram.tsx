import type { ArchLayer } from "@/data/content";

/** Layered architecture diagram rendered as semantic HTML (readable without CSS/JS, scales on mobile). */
export function ArchitectureDiagram({ layers, label }: { layers: ArchLayer[]; label: string }) {
  return (
    <figure aria-label={label}>
      <ol className="space-y-0">
        {layers.map((layer, i) => (
          <li key={layer.name}>
            <div className="rounded-lg border border-border bg-bg p-4">
              <p className="font-mono text-[11px] uppercase tracking-wider text-accent">{layer.name}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {layer.nodes.map((n) => (
                  <li key={n} className="rounded-md border border-border-strong bg-bg-elev px-2.5 py-1.5 text-xs text-fg sm:text-sm">
                    {n}
                  </li>
                ))}
              </ul>
            </div>
            {i < layers.length - 1 && (
              <div className="flex justify-center py-1.5 text-fg-subtle" aria-hidden>
                <svg width="14" height="22" viewBox="0 0 14 22" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M7 0v20M2 15l5 5 5-5" />
                </svg>
              </div>
            )}
          </li>
        ))}
      </ol>
    </figure>
  );
}
