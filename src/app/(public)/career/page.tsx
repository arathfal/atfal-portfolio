import type { Metadata } from "next";
import { Milestone } from "lucide-react";

import { CareerTimeline } from "@/components/sections/career-timeline";
import { SectionHeading } from "@/components/ui/section-heading";
import { listExperiences } from "@/lib/experiences";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Career",
  description:
    "A timeline of Aradea's frontend development experience and education.",
  openGraph: {
    title: "Career | Aradea",
    description:
      "A timeline of frontend development experience, product work, and education.",
  },
};

export default function CareerPage() {
  return <CareerContent />;
}

async function CareerContent() {
  const experiences = await listExperiences();

  return (
    <main className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8">
      <SectionHeading
        eyebrow="Career"
        title="The path so far."
        description="A timeline of teams, classrooms, and product challenges that shaped how I approach frontend work today."
      />

      {experiences.length > 0 ? (
        <CareerTimeline experiences={experiences} />
      ) : (
        <div className="mt-12 flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-border bg-surface p-8 text-center">
          <Milestone
            aria-hidden="true"
            className="size-10 text-muted-foreground"
          />
          <h2 className="mt-4 text-xl font-semibold">Timeline coming soon</h2>
          <p className="mt-2 text-muted-foreground">
            Career history has not been published yet.
          </p>
        </div>
      )}
    </main>
  );
}
