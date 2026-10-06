import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Achievements } from "@/components/sections/Achievements";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { Section } from "@/components/Section";
import { DemoLoader } from "@/components/demo/DemoLoader";
import { demoCopy } from "@/data/content";

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Section
        id="demo"
        index="02"
        kicker={demoCopy.kicker.toLowerCase()}
        title={demoCopy.title}
        intro={
          <>
            <p>{demoCopy.intro}</p>
            <p className="mt-3 inline-flex items-start gap-2 rounded-md border border-warn/40 bg-warn/5 px-3 py-2 text-xs leading-relaxed text-fg-muted">
              <span className="font-mono font-semibold uppercase text-warn">Demo</span>
              <span>{demoCopy.disclaimer}</span>
            </p>
          </>
        }
      >
        <DemoLoader />
        <noscript>
          <p className="mt-4 text-sm text-fg-muted">The interactive demo needs JavaScript. See the RouteX case study for the same information as text.</p>
        </noscript>
      </Section>
      <Experience />
      <Achievements />
      <Skills />
      <Contact />
    </>
  );
}
