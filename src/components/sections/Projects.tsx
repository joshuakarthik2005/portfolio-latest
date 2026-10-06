import Link from "next/link";
import { projects } from "@/data/content";
import { Section } from "../Section";
import { Chip } from "../Chip";
import { ArrowRightIcon, ExternalIcon } from "../Icons";

export function Projects() {
  return (
    <Section
      id="projects"
      index="01"
      kicker="featured projects"
      title="Selected work"
      intro="Three systems, each laid out as problem, approach, impact, and stack. Open a case study for the architecture and the key decisions behind it."
    >
      <ul className="grid gap-5 lg:grid-cols-3">
        {projects.map((p) => (
          <li key={p.slug}>
            <article className="flex h-full flex-col rounded-xl border border-border bg-bg-elev p-6 transition-colors hover:border-border-strong">
              <header>
                <h3 className="text-xl font-semibold tracking-tight text-fg">
                  <Link href={`/projects/${p.slug}`} className="hover:text-accent">
                    {p.name}
                  </Link>
                </h3>
                <p className="mt-1 text-sm text-fg-muted">{p.tagline}</p>
                {p.achievement && (
                  <p className="mt-3 inline-block rounded-md bg-accent-soft px-2 py-1 font-mono text-[11px] text-accent">{p.achievement}</p>
                )}
              </header>
              <dl className="mt-5 space-y-4 text-sm">
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">Problem</dt>
                  <dd className="mt-1 text-fg-muted">{p.problem}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">Approach</dt>
                  <dd className="mt-1 text-fg-muted">{p.approach}</dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">Impact</dt>
                  <dd className="mt-1">
                    <ul className="space-y-1">
                      {p.impact.map((i) => (
                        <li key={i} className="flex gap-2 text-fg">
                          <span className="text-accent" aria-hidden>
                            ▸
                          </span>
                          {i}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
                <div>
                  <dt className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">Stack</dt>
                  <dd className="mt-2 flex flex-wrap gap-1.5">
                    {p.stack.map((s) => (
                      <Chip key={s}>{s}</Chip>
                    ))}
                  </dd>
                </div>
              </dl>
              <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-sm">
                <Link href={`/projects/${p.slug}`} className="inline-flex items-center gap-1.5 font-medium text-accent hover:underline">
                  Case study<span className="sr-only">: {p.name}</span> <ArrowRightIcon />
                </Link>
                {p.links.map((l) => (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-fg-muted hover:text-accent"
                  >
                    {l.label}
                    <span className="sr-only">
                      : {l.longLabel ?? p.name} (opens in new tab)
                    </span>
                    <ExternalIcon width={13} height={13} />
                  </a>
                ))}
              </div>
            </article>
          </li>
        ))}
      </ul>
    </Section>
  );
}
