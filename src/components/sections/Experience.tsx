import { education, experience } from "@/data/content";
import { Section } from "../Section";

export function Experience() {
  const items = experience.filter((e) => e.visible);
  return (
    <Section id="experience" index="03" kicker="experience" title="Where I've worked">
      <ol className="relative space-y-10 border-l border-border pl-6 sm:pl-8">
        {items.map((e) => {
          const shown = e.bullets.slice(0, e.featured);
          const more = e.bullets.slice(e.featured);
          return (
            <li key={e.company} className="relative">
              <span className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 border-accent bg-bg sm:-left-[37px]" aria-hidden />
              <div className="grid gap-2 md:grid-cols-[180px_1fr] md:gap-8">
                <div className="font-mono text-xs leading-relaxed text-fg-subtle">
                  <p>{e.period}</p>
                  <p>{e.location}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-fg">{e.company}</h3>
                  <p className="text-sm text-accent">{e.role}</p>
                  <ul className="mt-3 space-y-2 text-sm leading-relaxed text-fg-muted">
                    {shown.map((b) => (
                      <li key={b} className="flex gap-2">
                        <span className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full bg-fg-subtle" aria-hidden />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                  {more.length > 0 && (
                    <details className="group mt-2 text-sm">
                      <summary className="cursor-pointer list-none font-mono text-xs text-fg-subtle hover:text-accent">
                        <span className="group-open:hidden">+ {more.length} more</span>
                        <span className="hidden group-open:inline">− show less</span>
                      </summary>
                      <ul className="mt-2 space-y-2 leading-relaxed text-fg-muted">
                        {more.map((b) => (
                          <li key={b} className="flex gap-2">
                            <span className="mt-[0.45em] h-1 w-1 shrink-0 rounded-full bg-fg-subtle" aria-hidden />
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                </div>
              </div>
            </li>
          );
        })}
        <li className="relative">
          <span className="absolute -left-[29px] top-1.5 h-3 w-3 rounded-full border-2 border-border-strong bg-bg sm:-left-[37px]" aria-hidden />
          <div className="grid gap-2 md:grid-cols-[180px_1fr] md:gap-8">
            <div className="font-mono text-xs leading-relaxed text-fg-subtle">
              <p>{education.period}</p>
              <p>{education.location}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-fg">{education.school}</h3>
              <p className="text-sm text-accent">{education.degree}</p>
              <p className="mt-2 text-sm text-fg-muted">{education.graduation}</p>
            </div>
          </div>
        </li>
      </ol>
    </Section>
  );
}
