import { contactCopy, person } from "@/data/content";
import { Section } from "../Section";
import { ButtonLink } from "../ButtonLink";
import { DownloadIcon, GitHubIcon, LinkedInIcon, MailIcon, PhoneIcon, PinIcon } from "../Icons";

export function Contact() {
  return (
    <Section id="contact" index="07" kicker="contact" title="Get in touch">
      <div className="rounded-xl border border-border bg-bg-elev p-6 sm:p-10">
        <p className="max-w-2xl text-lg text-fg-muted">
          {contactCopy.blurb}
        </p>
        <a
          href={`mailto:${person.email}`}
          className="mt-6 inline-block break-all font-mono text-xl font-medium text-accent hover:underline sm:text-2xl"
        >
          {person.email}
        </a>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`mailto:${person.email}`} variant="solid">
            <MailIcon /> Email me
          </ButtonLink>
          <ButtonLink href={person.links.linkedin} external>
            <LinkedInIcon /> LinkedIn
          </ButtonLink>
          <ButtonLink href={person.links.github} external>
            <GitHubIcon /> GitHub
          </ButtonLink>
          <ButtonLink href={person.links.resume} download>
            <DownloadIcon /> Resume (PDF)
          </ButtonLink>
        </div>
        <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-subtle">
          <li className="flex items-center gap-1.5">
            <PhoneIcon />
            <a href={person.phoneHref} className="hover:text-accent">
              {person.phone}
            </a>
          </li>
          <li className="flex items-center gap-1.5">
            <PinIcon /> {person.location}
          </li>
        </ul>
      </div>
    </Section>
  );
}
