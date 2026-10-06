import { showPlaceholders } from "@/data/content";

/** Clearly-marked slot for a missing asset. Hidden when `showPlaceholders` is false. */
export function Placeholder({ label, todo, className = "" }: { label: string; todo?: string; className?: string }) {
  if (!showPlaceholders) return null;
  return (
    <div
      role="note"
      aria-label={`Placeholder: ${label}`}
      className={`flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed border-warn/60 bg-warn/5 p-4 text-center ${className}`}
    >
      <span className="font-mono text-[10px] font-semibold uppercase tracking-widest text-warn">Placeholder</span>
      <span className="text-sm text-fg-muted">{label}</span>
      {todo && <span className="font-mono text-[11px] text-fg-subtle">TODO: {todo}</span>}
    </div>
  );
}
