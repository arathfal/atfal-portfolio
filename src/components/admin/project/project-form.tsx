import type { FormEvent } from "react";
import { LoaderCircle, Pencil, Plus } from "lucide-react";

import { inputClass } from "../shared/form-styles";
import type { AdminProject } from "./project-domain";

type ProjectFormProps = {
  editing: AdminProject | null;
  submitting: boolean;
  deleting: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function ProjectForm({
  editing,
  submitting,
  deleting,
  onSubmit,
  onCancel,
}: ProjectFormProps) {
  return (
    <section className="h-fit rounded-2xl border border-border bg-surface p-5 shadow-sm sm:p-6 lg:sticky lg:top-6">
      <div className="flex items-start gap-3">
        <div className="rounded-xl bg-primary-soft p-2 text-primary">
          {editing ? (
            <Pencil className="size-5" />
          ) : (
            <Plus className="size-5" />
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold">
            {editing ? "Edit project" : "Project baru"}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {editing
              ? `Memperbarui “${editing.title}”`
              : "Tambahkan karya baru ke portfolio."}
          </p>
        </div>
      </div>

      <form
        key={editing?.id ?? "new"}
        onSubmit={onSubmit}
        className="mt-6 space-y-4"
      >
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Judul</span>
          <input
            name="title"
            required
            maxLength={120}
            defaultValue={editing?.title}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Deskripsi</span>
          <textarea
            name="description"
            required
            maxLength={2000}
            rows={5}
            defaultValue={editing?.description}
            className={inputClass}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">
            Thumbnail {editing ? "(opsional jika tidak diganti)" : ""}
          </span>
          <input
            name="image"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className={inputClass}
          />
          <span className="mt-1 block text-xs text-muted-foreground">
            JPG, PNG, atau WebP; maksimal 2 MB.
          </span>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Tech stack</span>
          <input
            name="techStack"
            required
            defaultValue={editing?.techStack.join(", ")}
            placeholder="Next.js, TypeScript, Prisma"
            className={inputClass}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Demo URL</span>
            <input
              name="demoUrl"
              type="url"
              defaultValue={editing?.demoUrl ?? ""}
              placeholder="https://"
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              Repository URL
            </span>
            <input
              name="repoUrl"
              type="url"
              defaultValue={editing?.repoUrl ?? ""}
              placeholder="https://"
              className={inputClass}
            />
          </label>
        </div>

        <div className="space-y-3 rounded-xl border border-border bg-muted/50 p-4">
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              name="status"
              type="checkbox"
              defaultChecked={editing?.status ?? true}
              className="size-4 accent-primary"
            />
            Demo dapat diakses
          </label>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={editing?.featured}
              className="size-4 accent-primary"
            />
            Featured project
          </label>
        </div>

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || deleting}
            className="3items-center inline-flex justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <LoaderCircle className="size-4 animate-spin" />}
            {submitting
              ? "Menyimpan…"
              : editing
                ? "Simpan perubahan"
                : "Tambah project"}
          </button>
          {editing && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="order-border rounded-xl px-5 py-3 text-sm font-semibold transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
