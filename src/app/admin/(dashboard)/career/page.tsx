import { CareerManager } from "@/components/admin/career-manager";
import { listAdminExperiences } from "@/lib/experiences";

export const dynamic = "force-dynamic";

export default async function AdminCareerPage() {
  const experiences = await listAdminExperiences();

  return (
    <>
      <p className="text-sm font-semibold text-primary">Content</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Career</h1>
      <p className="mt-2 mb-8 text-muted-foreground">
        Kelola pengalaman kerja dan pendidikan pada timeline publik.
      </p>
      <CareerManager experiences={experiences} />
    </>
  );
}
