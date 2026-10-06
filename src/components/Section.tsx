export function Section({
  id,
  index,
  title,
  kicker,
  intro,
  children,
  className = "",
}: {
  id: string;
  index: string;
  title: string;
  kicker: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 ${className}`}>
      <p className="font-mono text-xs text-fg-subtle">
        <span className="text-accent">{index}</span> {"// "}
        {kicker}
      </p>
      <h2 id={`${id}-title`} tabIndex={-1} className="mt-2 text-2xl font-semibold tracking-tight text-fg outline-none sm:text-3xl">
        {title}
      </h2>
      {intro && <div className="mt-3 max-w-2xl text-fg-muted">{intro}</div>}
      <div className="mt-10">{children}</div>
    </section>
  );
}
