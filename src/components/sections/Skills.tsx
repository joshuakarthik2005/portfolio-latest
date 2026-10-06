import { skills } from "@/data/content";
import { Section } from "../Section";

export function Skills() {
  return (
    <Section id="skills" index="06" kicker="skills" title="Toolbox">
      <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((s) => (
          <div key={s.group} className="border-t border-border pt-4">
            <dt className="font-mono text-xs uppercase tracking-wider text-accent">{s.group}</dt>
            <dd className="mt-2 text-sm leading-7 text-fg-muted">
              <ul className="flex flex-wrap gap-x-3 gap-y-1">
                {s.items.map((i, idx) => (
                  <li key={i} className="text-fg">
                    {i}
                    {idx < s.items.length - 1 && (
                      <span className="ml-3 text-fg-subtle" aria-hidden>
                        /
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </dd>
          </div>
        ))}
      </dl>
    </Section>
  );
}
