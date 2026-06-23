import {
  BriefcaseBusiness,
  GraduationCap,
  LoaderCircle,
  Pencil,
  Trash2,
} from "lucide-react";
import Image from "next/image";

import {
  companyInitials,
  formatDate,
  type AdminExperience,
} from "./career-domain";

type CareerListProps = {
  items: AdminExperience[];
  editingId: number | null;
  submitting: boolean;
  deletingId: number | null;
  onEdit: (experience: AdminExperience) => void;
  onDelete: (experience: AdminExperience) => void;
};

export function CareerList({
  items,
  editingId,
  submitting,
  deletingId,
  onEdit,
  onDelete,
}: CareerListProps) {
  return (
    <section aria-labelledby="career-list-title">
      <div>
        <h2 id="career-list-title" className="text-xl font-semibold">
          Career timeline
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {items.length} career entry tersimpan
        </p>
      </div>

      <div className="mt-4 space-y-4">
        {items.map((experience) => (
          <article
            key={experience.id}
            className={`rounded-2xl border bg-surface p-5 transition ${
              editingId === experience.id
                ? "border-primary shadow-[0_0_0_3px_var(--primary-soft)]"
                : "border-border hover:border-primary/30"
            }`}
          >
            <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
              <div className="relative flex size-14 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted font-semibold text-muted-foreground">
                {experience.logo ? (
                  <Image
                    src={experience.logo}
                    alt={`Logo ${experience.company}`}
                    fill
                    sizes="56px"
                    className="object-contain p-1.5"
                  />
                ) : (
                  companyInitials(experience.company) || "—"
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary capitalize">
                        {experience.type === "work" ? (
                          <BriefcaseBusiness className="size-3" />
                        ) : (
                          <GraduationCap className="size-3" />
                        )}
                        {experience.type}
                      </span>
                      {experience.current && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                          Current
                        </span>
                      )}
                    </div>
                    <h3 className="mt-2 text-lg font-semibold">
                      {experience.role}
                    </h3>
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {experience.company}
                    </p>
                    <p className="mt-2 text-xs font-medium text-muted-foreground">
                      {formatDate(experience.startDate)} —{" "}
                      {formatDate(experience.endDate)}
                    </p>
                  </div>
                </div>

                <p className="mt-3 line-clamp-2 text-sm leading-6 text-muted-foreground">
                  {experience.description}
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(experience)}
                    disabled={submitting || deletingId !== null}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(experience)}
                    disabled={submitting || deletingId !== null}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950/30"
                  >
                    {deletingId === experience.id ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                    {deletingId === experience.id ? "Menghapus…" : "Hapus"}
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
            <BriefcaseBusiness className="mx-auto size-9 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">Belum ada career entry</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Isi form untuk menambahkan pengalaman pertama.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
