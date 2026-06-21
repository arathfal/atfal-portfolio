import Link from "next/link";

import { listExperiences } from "@/lib/experiences";
import { listAdminProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const [projects, experiences] = await Promise.all([
    listAdminProjects(),
    listExperiences(),
  ]);

  return (
    <>
      <p className="text-sm font-semibold text-primary">Dashboard</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Portfolio content at a glance.
      </h1>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        <Link
          href="/projects"
          className="rounded-3xl border border-border bg-surface p-7 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <p className="text-sm text-muted-foreground">Projects</p>
          <p className="mt-2 text-4xl font-bold">{projects.length}</p>
          <p className="mt-4 text-sm font-medium text-primary">
            Kelola projects →
          </p>
        </Link>
        <Link
          href="/career"
          className="rounded-3xl border border-border bg-surface p-7 transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          <p className="text-sm text-muted-foreground">Career entries</p>
          <p className="mt-2 text-4xl font-bold">{experiences.length}</p>
          <p className="mt-4 text-sm font-medium text-primary">
            Kelola career →
          </p>
        </Link>
      </div>
    </>
  );
}
