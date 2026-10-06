import { achievements, publication } from "@/data/content";
import { Section } from "../Section";
import { Chip } from "../Chip";
import { ExternalIcon } from "../Icons";

export function Achievements() {
  return (
    <>
      <Section id="achievements" index="04" kicker="achievements & hackathons" title="Recognition">
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {achievements.map((a) => (
            <li key={a.title}>
              <article
                className={`flex h-full flex-col rounded-xl border bg-bg-elev p-5 ${a.highlight ? "border-accent/50" : "border-border"}`}
              >
                <p className="font-mono text-lg font-semibold tracking-tight text-fg">{a.result}</p>
                <h3 className="mt-1 text-sm font-medium text-fg">{a.title}</h3>
                {a.context && <p className="mt-1 text-sm text-fg-subtle">{a.context}</p>}
                <a
                  href={a.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-auto inline-flex items-center gap-1 pt-4 text-xs text-fg-muted hover:text-accent"
                >
                  {a.link.label}
                  <span className="sr-only">: {a.title} (opens in new tab)</span>
                  <ExternalIcon width={12} height={12} />
                </a>
              </article>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="publication" index="05" kicker="publication" title="Research">
        <article className="rounded-xl border border-border bg-bg-elev p-6 sm:p-8">
          <h3 className="text-lg font-semibold leading-snug text-fg sm:text-xl">{publication.title}</h3>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-fg-muted sm:text-base">{publication.summary}</p>
          <div className="mt-4 flex flex-wrap gap-1.5">
            {publication.topics.map((t) => (
              <Chip key={t}>{t}</Chip>
            ))}
          </div>
          <a
            href={publication.link.href}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:underline"
          >
            {publication.link.label}
            <span className="sr-only"> (opens in new tab)</span>
            <ExternalIcon width={13} height={13} />
          </a>
        </article>
      </Section>
    </>
  );
}
