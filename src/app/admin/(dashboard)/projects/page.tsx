import { ProjectManager } from "@/components/admin/project-manager";
import { listAdminProjects } from "@/lib/projects";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  const projects = await listAdminProjects();

  return (
    <>
      <p className="text-sm font-semibold text-primary">Content</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Projects</h1>
      <p className="mt-2 mb-8 text-muted-foreground">
        Tambah, ubah, dan hapus project yang tampil di website publik.
      </p>
      <ProjectManager projects={projects} />
    </>
  );
}
