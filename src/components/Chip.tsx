export function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-border bg-bg-sunken px-2 py-0.5 font-mono text-[11px] text-fg-muted">
      {children}
    </span>
  );
}
