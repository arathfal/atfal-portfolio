import { ArrowUpRight, GitFork } from "lucide-react";
import Image from "next/image";

import { Reveal } from "@/components/ui/reveal";
import type { Project } from "@/types";

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  return (
    <Reveal delay={(index % 3) * 0.06} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-3xl border border-border bg-surface transition duration-300 hover:-translate-y-1 hover:border-primary/35 hover:shadow-[0_22px_60px_-30px_rgba(109,74,255,0.45)]">
        <div className="relative aspect-[16/10] overflow-hidden border-b border-border bg-muted">
          <Image
            src={project.thumbnail}
            alt={`Preview of ${project.title}`}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.035]"
            priority={index < 2}
          />
          {project.featured && (
            <span className="absolute top-4 left-4 rounded-full bg-background/90 px-3 py-1 text-xs font-semibold text-primary shadow-sm backdrop-blur">
              Featured
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h2 className="text-xl font-bold tracking-tight">{project.title}</h2>
          <p className="mt-3 line-clamp-3 leading-7 text-muted-foreground">
            {project.description}
          </p>

          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Technologies">
            {project.techStack.map((technology) => (
              <li
                key={technology}
                className="rounded-full border border-border bg-muted px-2.5 py-1 font-mono text-xs text-muted-foreground"
              >
                {technology}
              </li>
            ))}
          </ul>

          <div className="mt-auto flex items-center gap-3 pt-6">
            {project.demoUrl && (
              <a
                href={project.demoUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-primary hover:underline hover:underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                Live demo
                <ArrowUpRight aria-hidden="true" className="size-4" />
              </a>
            )}
            {project.repoUrl && (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1.5 rounded-sm text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                <GitFork aria-hidden="true" className="size-4" />
                Source
              </a>
            )}
          </div>
        </div>
      </article>
    </Reveal>
  );
}
