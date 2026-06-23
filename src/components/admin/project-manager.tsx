"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  CheckCircle2,
  ImageIcon,
  LoaderCircle,
  Pencil,
  Plus,
  Star,
  Trash2,
} from "lucide-react";

type AdminProject = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  thumbnailPublicId: string | null;
  techStack: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  status: boolean;
  createdAt: string;
  updatedAt: string;
};

type UploadSignature = {
  cloudName: string;
  apiKey: string;
  signature: string;
  timestamp: number;
  folder: string;
  upload_preset: string;
};

type Feedback = {
  type: "success" | "error";
  text: string;
};

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

function sortProjects(projects: AdminProject[]) {
  return [...projects].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

async function readJson(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Server mengirim respons yang tidak dapat dibaca.");
  }
}

function errorMessage(result: unknown, fallback: string) {
  if (
    typeof result === "object" &&
    result !== null &&
    "error" in result &&
    typeof result.error === "string"
  ) {
    return result.error;
  }

  return fallback;
}

function isAdminProject(value: unknown): value is AdminProject {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "title" in value &&
    typeof value.title === "string" &&
    "techStack" in value &&
    Array.isArray(value.techStack)
  );
}

export function ProjectManager({ projects }: { projects: AdminProject[] }) {
  const [items, setItems] = useState(() => sortProjects(projects));
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function resetEditor(form?: HTMLFormElement) {
    form?.reset();
    setEditing(null);
  }

  function beginEdit(project: AdminProject) {
    setEditing(project);
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function uploadImage(file: File) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Gunakan gambar JPG, PNG, atau WebP.");
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("Ukuran gambar maksimal 2 MB.");
    }

    const signatureResponse = await fetch("/api/admin/upload-signature", {
      method: "POST",
    });
    const signature = await readJson(signatureResponse);

    if (
      !signatureResponse.ok ||
      typeof signature !== "object" ||
      signature === null ||
      !("signature" in signature)
    ) {
      throw new Error(
        errorMessage(signature, "Layanan upload gambar tidak tersedia."),
      );
    }

    const uploadSignature = signature as UploadSignature;
    const body = new FormData();
    body.set("file", file);
    body.set("api_key", uploadSignature.apiKey);
    body.set("signature", uploadSignature.signature);
    body.set("timestamp", String(uploadSignature.timestamp));
    body.set("folder", uploadSignature.folder);
    body.set("upload_preset", uploadSignature.upload_preset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${uploadSignature.cloudName}/image/upload`,
      { method: "POST", body },
    );
    const result = await readJson(response);

    if (
      !response.ok ||
      typeof result !== "object" ||
      result === null ||
      !("secure_url" in result) ||
      typeof result.secure_url !== "string" ||
      !("public_id" in result) ||
      typeof result.public_id !== "string"
    ) {
      const cloudinaryError =
        typeof result === "object" &&
        result !== null &&
        "error" in result &&
        typeof result.error === "object" &&
        result.error !== null &&
        "message" in result.error &&
        typeof result.error.message === "string"
          ? result.error.message
          : "Upload gambar gagal.";
      throw new Error(cloudinaryError);
    }

    return { thumbnail: result.secure_url, publicId: result.public_id };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const editedId = editing?.id ?? null;
    setFeedback(null);
    setSubmitting(true);

    try {
      const form = new FormData(formElement);
      const file = form.get("image");
      let thumbnail = editing?.thumbnail ?? "";
      let thumbnailPublicId = editing?.thumbnailPublicId ?? null;

      if (file instanceof File && file.size > 0) {
        const uploaded = await uploadImage(file);
        thumbnail = uploaded.thumbnail;
        thumbnailPublicId = uploaded.publicId;
      }

      if (!thumbnail) {
        throw new Error("Pilih thumbnail project.");
      }

      const response = await fetch(
        editedId ? `/api/admin/projects/${editedId}` : "/api/admin/projects",
        {
          method: editedId ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: form.get("title"),
            description: form.get("description"),
            thumbnail,
            thumbnailPublicId,
            techStack: String(form.get("techStack"))
              .split(",")
              .map((item) => item.trim())
              .filter(Boolean),
            demoUrl: form.get("demoUrl"),
            repoUrl: form.get("repoUrl"),
            featured: form.get("featured") === "on",
            status: form.get("status") === "on",
          }),
        },
      );
      const result = await readJson(response);

      if (!response.ok) {
        throw new Error(errorMessage(result, "Gagal menyimpan project."));
      }
      if (!isAdminProject(result)) {
        throw new Error("Data project dari server tidak lengkap.");
      }

      setItems((current) =>
        sortProjects(
          editedId
            ? current.map((project) =>
                project.id === editedId ? result : project,
              )
            : [result, ...current],
        ),
      );
      resetEditor(formElement);
      setFeedback({
        type: "success",
        text: editedId
          ? `Project “${result.title}” berhasil diperbarui.`
          : `Project “${result.title}” berhasil ditambahkan.`,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menyimpan project.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(project: AdminProject) {
    if (!window.confirm(`Hapus project “${project.title}”?`)) return;

    setFeedback(null);
    setDeletingId(project.id);

    try {
      const response = await fetch(`/api/admin/projects/${project.id}`, {
        method: "DELETE",
      });
      const result = await readJson(response);

      if (!response.ok) {
        throw new Error(errorMessage(result, "Gagal menghapus project."));
      }

      setItems((current) => current.filter((item) => item.id !== project.id));
      if (editing?.id === project.id) resetEditor();
      setFeedback({
        type: "success",
        text: `Project “${project.title}” berhasil dihapus.`,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus project.",
      });
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {feedback && (
        <div
          role={feedback.type === "error" ? "alert" : "status"}
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm ${
            feedback.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-200"
              : "border-red-200 bg-red-50 text-red-800 dark:border-red-900 dark:bg-red-950/40 dark:text-red-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
          ) : (
            <AlertCircle className="mt-0.5 size-4 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.75fr)]">
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
                  editing?.id === project.id
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
                        onClick={() => beginEdit(project)}
                        disabled={submitting || deletingId !== null}
                        className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        <Pencil className="size-4" />
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => remove(project)}
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
            onSubmit={submit}
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
              <span className="mb-1.5 block text-sm font-medium">
                Deskripsi
              </span>
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
              <span className="mb-1.5 block text-sm font-medium">
                Tech stack
              </span>
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
                <span className="mb-1.5 block text-sm font-medium">
                  Demo URL
                </span>
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
                disabled={submitting || deletingId !== null}
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
                  onClick={() => {
                    setEditing(null);
                    setFeedback(null);
                  }}
                  disabled={submitting}
                  className="order-border rounded-xl px-5 py-3 text-sm font-semibold transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
                >
                  Batal
                </button>
              )}
            </div>
          </form>
        </section>
      </div>
    </div>
  );
}
