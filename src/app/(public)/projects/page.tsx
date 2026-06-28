import type { Metadata } from "next";
import { FolderOpen } from "lucide-react";

import { ProjectCard } from "@/components/sections/project-card";
import { SectionHeading } from "@/components/ui/section-heading";
import { listProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Projects",
  description:
    "A selection of frontend projects spanning commerce, analytics, collaboration, travel, and fintech.",
  alternates: {
    canonical: "/projects",
  },
  openGraph: {
    url: "/projects",
    title: "Projects | Aradea Atfal",
    description:
      "Selected frontend work spanning commerce, analytics, collaboration, travel, and fintech.",
  },
};

export default function ProjectsPage() {
  return <ProjectsContent />;
}

async function ProjectsContent() {
  const projects = await listProjects();

  return (
    <main className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Selected work"
        title="Products built with purpose."
        description="A mix of product interfaces, experiments, and systems where frontend craft solves a real user problem."
        level="h1"
      />

      {projects.length > 0 ? (
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <ProjectCard key={project.id} project={project} index={index} />
          ))}
        </div>
      ) : (
        <div className="mt-12 flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface p-8 text-center">
          <FolderOpen
            aria-hidden="true"
            className="size-10 text-muted-foreground"
          />
          <h2 className="mt-4 text-xl font-semibold">No projects yet</h2>
          <p className="mt-2 max-w-md text-muted-foreground">
            New work is being prepared. Please check back soon.
          </p>
        </div>
      )}
    </main>
  );
}
