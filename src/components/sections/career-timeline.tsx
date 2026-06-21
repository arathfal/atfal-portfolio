import { BriefcaseBusiness, GraduationCap } from "lucide-react";
import Image from "next/image";

import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types";

function formatDate(date: string | null) {
  if (!date) return "Present";

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(date));
}

function initials(value: string) {
  return value
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function CareerTimeline({ experiences }: { experiences: Experience[] }) {
  return (
    <ol className="relative mt-14 space-y-8 before:absolute before:top-4 before:bottom-4 before:left-[1.2rem] before:w-px before:bg-border lg:space-y-0 lg:before:left-1/2">
      {experiences.map((experience, index) => {
        const isEducation = experience.type === "education";
        const Icon = isEducation ? GraduationCap : BriefcaseBusiness;

        return (
          <li
            key={experience.id}
            className="relative pl-14 lg:grid lg:min-h-64 lg:grid-cols-2 lg:gap-16 lg:pl-0"
          >
            <span
              className="absolute top-6 left-0 z-10 inline-flex size-10 items-center justify-center rounded-full border-4 border-background bg-primary text-primary-foreground shadow-sm lg:left-1/2 lg:-translate-x-1/2"
              aria-hidden="true"
            >
              <Icon className="size-4" />
            </span>

            <Reveal
              delay={0.04}
              className={cn(
                "lg:pb-12",
                index % 2 === 0
                  ? "lg:col-start-1 lg:text-right"
                  : "lg:col-start-2",
              )}
            >
              <article className="rounded-3xl border border-border bg-surface p-6 transition-colors hover:border-primary/35 sm:p-7">
                <div
                  className={cn(
                    "flex flex-wrap items-center gap-3",
                    index % 2 === 0 && "lg:justify-end",
                  )}
                >
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-semibold capitalize",
                      isEducation
                        ? "bg-primary-soft text-primary"
                        : "bg-accent/12 text-accent",
                    )}
                  >
                    {experience.type}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {formatDate(experience.startDate)} —{" "}
                    {experience.current
                      ? "Present"
                      : formatDate(experience.endDate)}
                  </span>
                </div>

                <div
                  className={cn(
                    "mt-5 flex items-center gap-4",
                    index % 2 === 0 && "lg:flex-row-reverse",
                  )}
                >
                  <div className="relative flex size-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted text-sm font-bold text-primary">
                    {experience.logo ? (
                      <Image
                        src={experience.logo}
                        alt=""
                        fill
                        sizes="48px"
                        className="object-contain p-1.5"
                      />
                    ) : (
                      <span aria-hidden="true">
                        {initials(experience.company)}
                      </span>
                    )}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold tracking-tight">
                      {experience.role}
                    </h2>
                    <p className="mt-1 font-semibold text-primary">
                      {experience.company}
                    </p>
                  </div>
                </div>
                <p className="mt-4 leading-7 text-muted-foreground">
                  {experience.description}
                </p>
              </article>
            </Reveal>
          </li>
        );
      })}
    </ol>
  );
}
