import { Hero } from "@/components/sections/Hero";
import { Projects } from "@/components/sections/Projects";
import { Experience } from "@/components/sections/Experience";
import { Achievements } from "@/components/sections/Achievements";
import { Skills } from "@/components/sections/Skills";
import { Contact } from "@/components/sections/Contact";
import { Section } from "@/components/Section";
import { DemoTabs } from "@/components/demo/DemoTabs";
import { demoSection } from "@/data/content";

export default function Home() {
  return (
    <>
      <Hero />
      <Projects />
      <Section id="demo" index="02" kicker={demoSection.kicker.toLowerCase()} title={demoSection.title} intro={demoSection.intro}>
        <DemoTabs />
        <noscript>
          <p className="mt-4 text-sm text-fg-muted">The interactive demos need JavaScript. Each project&apos;s case study has the same information as text.</p>
        </noscript>
      </Section>
      <Experience />
      <Achievements />
      <Skills />
      <Contact />
    </>
  );
}
