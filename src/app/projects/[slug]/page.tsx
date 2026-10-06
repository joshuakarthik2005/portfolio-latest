import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { demos, projects } from "@/data/content";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { Chip } from "@/components/Chip";
import { Placeholder } from "@/components/Placeholder";
import { ArrowLeftIcon, ArrowRightIcon, ExternalIcon } from "@/components/Icons";

export const dynamicParams = false;

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = projects.find((x) => x.slug === slug);
  if (!p) return {};
  return {
    title: `${p.name}: ${p.tagline}`,
    description: `${p.problem} ${p.impact.join(" · ")}`,
    alternates: { canonical: `/projects/${p.slug}` },
    openGraph: { title: `${p.name}: ${p.tagline}`, description: p.approach, url: `/projects/${p.slug}`, images: ["/og.png"] },
  };
}

function H2({ children, id }: { children: React.ReactNode; id: string }) {
  return (
    <h2 id={id} className="text-lg font-semibold tracking-tight text-fg sm:text-xl">
      {children}
    </h2>
  );
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const idx = projects.findIndex((x) => x.slug === slug);
  if (idx < 0) notFound();
  const p = projects[idx];
  const next = projects[(idx + 1) % projects.length];
  const d = p.detail;
  const demo = demos.find((x) => x.project === p.slug);

  return (
    <article className="mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16">
      <Link href="/#projects" className="inline-flex items-center gap-1.5 font-mono text-xs text-fg-muted hover:text-accent">
        <ArrowLeftIcon width={14} height={14} /> all projects
      </Link>

      <header className="mt-6">
        <p className="font-mono text-xs text-fg-subtle">
          <span className="text-accent">case study</span> {"// "}
          {p.slug}
        </p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-fg sm:text-5xl">{p.name}</h1>
        <p className="mt-2 text-lg text-fg-muted">{p.tagline}</p>
        {p.achievement && <p className="mt-4 inline-block rounded-md bg-accent-soft px-2 py-1 font-mono text-xs text-accent">{p.achievement}</p>}
        <div className="mt-6 flex flex-wrap gap-3">
          {p.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 rounded-md border border-border-strong bg-bg-elev px-4 text-sm font-medium text-fg hover:border-accent hover:text-accent"
            >
              {l.longLabel ?? l.label}
              <span className="sr-only"> (opens in new tab)</span>
              <ExternalIcon width={14} height={14} />
            </a>
          ))}
          {demo && (
            <Link
              href={`/#demo-${demo.id}`}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-accent-solid px-4 text-sm font-medium text-accent-solid-fg hover:brightness-110"
            >
              Try the interactive demo <ArrowRightIcon width={14} height={14} />
            </Link>
          )}
        </div>
        {p.links.some((l) => l.note) && (
          <ul className="mt-3 space-y-1 text-xs text-fg-subtle">
            {p.links
              .filter((l) => l.note)
              .map((l) => (
                <li key={l.href}>
                  <span className="font-medium text-fg-muted">{l.longLabel ?? l.label}:</span> {l.note}
                </li>
              ))}
          </ul>
        )}
      </header>

      <section aria-labelledby="overview" className="mt-12">
        <H2 id="overview">Overview</H2>
        <p className="mt-3 leading-relaxed text-fg-muted">{d.overview}</p>
        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-bg-elev p-4">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">Problem</dt>
            <dd className="mt-1 text-sm text-fg-muted">{p.problem}</dd>
          </div>
          <div className="rounded-lg border border-border bg-bg-elev p-4">
            <dt className="font-mono text-[11px] uppercase tracking-wider text-fg-subtle">Approach</dt>
            <dd className="mt-1 text-sm text-fg-muted">{p.approach}</dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="results" className="mt-12">
        <H2 id="results">Results</H2>
        <dl className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          {d.results.map((r) => (
            <div key={r.label} className="rounded-lg border border-border bg-bg-elev p-4">
              <dt className="sr-only">{r.label}</dt>
              <dd>
                <span className="block font-mono text-xl font-semibold text-fg">{r.value}</span>
                <span className="mt-1 block text-xs text-fg-subtle">{r.label}</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="architecture" className="mt-12">
        <H2 id="architecture">Architecture</H2>
        {d.architectureNote && <p className="mt-2 text-xs text-warn">{d.architectureNote}</p>}
        <div className="mt-4">
          <ArchitectureDiagram layers={d.architecture} label={`${p.name} architecture, top to bottom`} />
        </div>
      </section>

      <section aria-labelledby="decisions" className="mt-12">
        <H2 id="decisions">Key decisions</H2>
        <ol className="mt-4 space-y-4">
          {d.decisions.map((dec, i) => (
            <li key={dec.title} className="grid grid-cols-[2rem_1fr] gap-2">
              <span className="font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
              <div>
                <h3 className="font-medium text-fg">{dec.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-fg-muted">{dec.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {d.extra && (
        <section aria-labelledby="extra" className="mt-12">
          <H2 id="extra">{d.extra.title}</H2>
          <ul className="mt-4 space-y-1 rounded-lg border border-border bg-bg-sunken p-4 font-mono text-xs text-fg-muted sm:text-sm">
            {d.extra.items.map((it) => (
              <li key={it}>{it}</li>
            ))}
          </ul>
        </section>
      )}

      <section aria-labelledby="stack" className="mt-12">
        <H2 id="stack">Stack</H2>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {p.stack.map((s) => (
            <Chip key={s}>{s}</Chip>
          ))}
        </div>
      </section>

      <section aria-labelledby="resume-notes" className="mt-12">
        <H2 id="resume-notes">From the resume</H2>
        <ul className="mt-4 space-y-2 text-sm leading-relaxed text-fg-muted">
          {p.resumeBullets.map((b) => (
            <li key={b} className="flex gap-2">
              <span className="text-accent" aria-hidden>
                ▸
              </span>
              <span>{b}</span>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="media" className="mt-12">
        <H2 id="media">Screens &amp; demo</H2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          {d.media.map((m) =>
            m.src ? (
              m.kind === "video" ? (
                <video key={m.label} src={m.src} controls preload="none" className="w-full rounded-lg border border-border" aria-label={m.label} />
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={m.label} src={m.src} alt={m.label} loading="lazy" className="w-full rounded-lg border border-border" />
              )
            ) : (
              <Placeholder key={m.label} label={m.label} todo={`add ${m.kind} and set src in content.ts`} className="aspect-video" />
            ),
          )}
        </div>
      </section>

      <nav aria-label="Next project" className="mt-16 border-t border-border pt-6">
        <Link href={`/projects/${next.slug}`} className="group inline-flex flex-col">
          <span className="font-mono text-xs text-fg-subtle">next project</span>
          <span className="mt-1 inline-flex items-center gap-2 text-lg font-semibold text-fg group-hover:text-accent">
            {next.name} <ArrowRightIcon />
          </span>
        </Link>
      </nav>
    </article>
  );
}
