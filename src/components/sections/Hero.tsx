import Image from "next/image";
import Link from "next/link";
import { person, proofPoints, skills } from "@/data/content";
import { ButtonLink } from "../ButtonLink";
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, PinIcon } from "../Icons";

export function Hero() {
  const [first, ...rest] = person.name.split(" ");
  const stack = [...skills[0].items.slice(0, 2), ...skills[1].items.slice(0, 2), "OR-Tools", "PostgreSQL", "Docker"];
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60" aria-hidden />
      <div className="relative mx-auto grid max-w-6xl gap-12 px-4 pb-12 pt-12 sm:px-6 sm:pt-20 lg:grid-cols-[1.25fr_1fr] lg:items-center">
        <div>
          <div className="flex items-center gap-4">
            {person.headshot ? (
              <Image
                src={person.headshot}
                alt={`Portrait of ${person.name}`}
                width={72}
                height={72}
                priority
                className="h-[72px] w-[72px] rounded-full border border-border object-cover"
              />
            ) : null}
            <p className="inline-flex items-center gap-2 rounded-full border border-border bg-bg-elev px-3 py-1 font-mono text-xs text-fg-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" aria-hidden />
              {person.status}
            </p>
          </div>

          <h1 id="hero-title" className="mt-6 text-4xl font-semibold tracking-tight text-fg sm:text-5xl lg:text-6xl">
            {first} <span className="text-fg-muted">{rest.join(" ")}</span>
          </h1>
          <p className="mt-4 font-mono text-sm text-accent sm:text-base">{person.positioning}</p>
          <p className="mt-4 max-w-xl text-base leading-relaxed text-fg-muted sm:text-lg">{person.summary}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={person.links.resume} variant="solid" download>
              <DownloadIcon /> Resume
            </ButtonLink>
            <ButtonLink href={person.links.github} external>
              <GitHubIcon /> GitHub
            </ButtonLink>
            <ButtonLink href={person.links.linkedin} external>
              <LinkedInIcon /> LinkedIn
            </ButtonLink>
            <ButtonLink href={`mailto:${person.email}`}>
              <MailIcon /> Email
            </ButtonLink>
          </div>
          <p className="mt-5 flex items-center gap-1.5 text-sm text-fg-subtle">
            <PinIcon /> {person.location}
          </p>
        </div>

        <div role="group" aria-label="Profile summary" className="hidden rounded-xl md:block border border-border bg-bg-elev/90 font-mono text-[13px] shadow-sm">
          <div className="flex items-center gap-1.5 border-b border-border px-4 py-2.5" aria-hidden>
            <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
            <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
            <span className="ml-2 text-[11px] text-fg-subtle">~/joshua</span>
          </div>
          <div className="space-y-2.5 p-4 leading-relaxed sm:p-5">
            <p>
              <span className="text-accent" aria-hidden>$ </span>whoami
            </p>
            <p className="text-fg">{person.role.toLowerCase()}</p>
            <p>
              <span className="text-accent" aria-hidden>$ </span>cat focus.txt
            </p>
            <p className="text-fg-muted">optimization (CP-SAT, MILP) · LLM pipelines · scalable APIs</p>
            <p>
              <span className="text-accent" aria-hidden>$ </span>ls stack/
            </p>
            <p className="text-fg-muted">{stack.join("  ")}</p>
            <p className="caret" aria-hidden>
              <span className="text-accent">$ </span>
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <h2 className="sr-only">Highlights</h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {proofPoints.map((p) => (
            <li key={p.label}>
              <Link href={p.href} className="group block h-full rounded-xl border border-border bg-bg-elev p-5 transition-colors hover:border-accent">
                <p className="font-mono text-2xl font-semibold tracking-tight text-fg group-hover:text-accent">{p.value}</p>
                <p className="mt-1 text-sm font-medium text-fg">{p.label}</p>
                <p className="mt-1 text-sm text-fg-subtle">{p.detail}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
