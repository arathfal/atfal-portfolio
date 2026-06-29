import {
  ArrowRight,
  Braces,
  Code2,
  Database,
  GitFork,
  Layers3,
  Mail,
  Palette,
  Smartphone,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";

const skills = [
  { name: "Next.js", icon: Layers3 },
  { name: "React", icon: Code2 },
  { name: "TypeScript", icon: Braces },
  { name: "Tailwind CSS", icon: Palette },
  { name: "Prisma", icon: Database },
  { name: "Responsive UI", icon: Smartphone },
];

export function HeroSection() {
  return (
    <section className="relative isolate overflow-hidden">
      <div
        className="pointer-events-none absolute inset-0 -z-10 opacity-70"
        aria-hidden="true"
      >
        <div className="absolute top-24 left-[8%] size-72 rounded-full bg-primary/12 blur-3xl" />
        <div className="absolute top-40 right-[5%] size-64 rounded-full bg-accent/10 blur-3xl" />
      </div>

      <div className="mx-auto grid min-h-[calc(100svh-4rem)] max-w-6xl items-center px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-12 lg:px-8">
        <Reveal className="relative z-10 max-w-2xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft px-3 py-1.5 text-sm font-medium text-primary">
            <Sparkles aria-hidden="true" className="size-4" />
            Available for thoughtful collaborations
          </div>

          <p className="mb-4 font-mono text-sm font-semibold tracking-[0.24em] text-muted-foreground uppercase sm:text-base">
            Hello, I&apos;m Aradea Atfal
          </p>
          <h1 className="text-4xl leading-[1.08] font-bold tracking-[-0.04em] text-balance sm:text-5xl lg:text-[3.5rem] xl:text-6xl">
            Frontend developer crafting{" "}
            <span className="text-primary">clear, fast</span> digital
            experiences.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-pretty text-muted-foreground sm:text-xl">
            I turn complex product ideas into accessible interfaces with careful
            interaction, resilient code, and just enough personality.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/projects"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-6 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              Explore my work
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <a
              href="mailto:aradeaa9@gmail.com"
              className="inline-flex h-12 items-center justify-center gap-2 rounded-full border border-border bg-surface px-6 font-semibold transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
              <Mail aria-hidden="true" className="size-4" />
              Start a conversation
            </a>
          </div>
        </Reveal>

        <Reveal
          delay={0.12}
          className="relative mx-auto hidden w-full max-w-[21.6rem] lg:block xl:max-w-[24rem]"
        >
          <div
            className="absolute -inset-3 -z-10 rounded-[2.75rem] bg-primary/10 blur-2xl"
            aria-hidden="true"
          />
          <div className="relative aspect-4/5 overflow-hidden rounded-[2.5rem] border border-primary/20 bg-linear-to-b from-primary-soft via-surface to-accent/10 shadow-[0_30px_90px_-40px_rgba(109,74,255,0.6)]">
            <Image
              src="/images/profile/aradea-hero.png"
              alt="Portrait of Aradea Atfal Risdianto"
              fill
              sizes="(min-width: 1280px) 405px, 385px"
              priority
              className="object-cover object-[center_0%] drop-shadow-[0_25px_35px_rgba(0,0,0,0.22)]"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export function AboutSection() {
  return (
    <section id="about" className="border-y border-border bg-surface py-24">
      <div className="mx-auto grid max-w-6xl gap-12 px-5 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="About"
            title="Design-minded. Engineering-grounded."
          />
        </Reveal>

        <Reveal delay={0.08} className="space-y-5 text-lg leading-8">
          <p>
            I&apos;m a frontend developer based in Indonesia who enjoys the
            quiet puzzle of making software feel obvious. My sweet spot is where
            visual craft, product thinking, and dependable engineering overlap.
          </p>
          <p className="text-muted-foreground">
            I care about semantic HTML, smooth performance, inclusive
            interaction, and code that remains pleasant for the next person to
            open. Away from the editor, I&apos;m usually collecting interface
            references or overthinking a very simple cup of coffee.
          </p>
          <a
            href="https://github.com/arathfal"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-2 rounded-sm font-semibold text-primary hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <GitFork aria-hidden="true" className="size-4" />
            Find me on GitHub
          </a>
        </Reveal>
      </div>
    </section>
  );
}

export function SkillsSection() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-6xl px-5 sm:px-6 lg:px-8">
        <Reveal>
          <SectionHeading
            eyebrow="Toolbox"
            title="The tools I reach for."
            description="A focused stack for shipping polished, maintainable products from first component to production."
          />
        </Reveal>

        <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {skills.map(({ name, icon: Icon }, index) => (
            <Reveal key={name} delay={index * 0.045}>
              <div className="flex min-h-32 flex-col justify-between rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-primary/40 hover:bg-primary-soft">
                <Icon aria-hidden="true" className="size-6 text-primary" />
                <span className="mt-6 text-sm font-semibold">{name}</span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
