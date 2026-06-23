import { ImageIcon, LoaderCircle, Pencil, Star, Trash2 } from "lucide-react";
import Image from "next/image";

import type { AdminProject } from "./project-domain";

type ProjectListProps = {
  items: AdminProject[];
  editingId: number | null;
  submitting: boolean;
  deletingId: number | null;
  onEdit: (project: AdminProject) => void;
  onDelete: (project: AdminProject) => void;
};

export function ProjectList({
  items,
  editingId,
  submitting,
  deletingId,
  onEdit,
  onDelete,
}: ProjectListProps) {
  return (
    <section aria-labelledby="project-list-title">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="project-list-title" className="text-xl font-semibold">
            Daftar project
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} project tersimpan
          </p>
        </div>
      </div>

      <div className="mt-4 space-y-4">
        {items.map((project) => (
          <article
            key={project.id}
            className={`overflow-hidden rounded-2xl border bg-surface transition ${
              editingId === project.id
                ? "border-primary shadow-[0_0_0_3px_var(--primary-soft)]"
                : "border-border hover:border-primary/30"
            }`}
          >
            <div className="grid sm:grid-cols-[160px_minmax(0,1fr)]">
              <div className="relative min-h-36 overflow-hidden border-b border-border bg-muted sm:min-h-full sm:border-r sm:border-b-0">
                {project.thumbnail ? (
                  <Image
                    src={project.thumbnail}
                    alt=""
                    fill
                    sizes="(min-width: 640px) 160px, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <ImageIcon className="absolute inset-0 m-auto size-8 text-muted-foreground" />
                )}
              </div>

              <div className="min-w-0 p-5">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold">
                        {project.title}
                      </h3>
                      {project.featured && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-2 py-0.5 text-xs font-medium text-primary">
                          <Star className="size-3" />
                          Featured
                        </span>
                      )}
                      <span
                        className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                          project.status
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300"
                            : "bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-300"
                        }`}
                      >
                        {project.status ? "Demo aktif" : "Demo offline"}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {project.techStack.map((technology) => (
                    <span
                      key={technology}
                      className="rounded-md border border-border bg-muted px-2 py-1 font-mono text-xs text-muted-foreground"
                    >
                      {technology}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => onEdit(project)}
                    disabled={submitting || deletingId !== null}
                    className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Pencil className="size-4" />
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => onDelete(project)}
                    disabled={submitting || deletingId !== null}
                    className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950/30"
                  >
                    {deletingId === project.id ? (
                      <LoaderCircle className="size-4 animate-spin" />
                    ) : (
                      <Trash2 className="size-4" />
                    )}
                    {deletingId === project.id ? "Menghapus…" : "Hapus"}
                  </button>
                </div>
              </div>
            </div>
          </article>
        ))}

        {items.length === 0 && (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
            <ImageIcon className="mx-auto size-9 text-muted-foreground" />
            <h3 className="mt-4 font-semibold">Belum ada project</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Isi form untuk menambahkan project pertama.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
