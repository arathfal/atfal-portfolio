"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

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
};

type UploadSignature = {
  cloudName: string;
  apiKey: string;
  signature: string;
  timestamp: number;
  folder: string;
  upload_preset: string;
};

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20";

export function ProjectManager({ projects }: { projects: AdminProject[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminProject | null>(null);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

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
    const signature = (await signatureResponse.json()) as
      | UploadSignature
      | { error: string };

    if (!signatureResponse.ok || !("signature" in signature)) {
      throw new Error(
        "error" in signature ? signature.error : "Upload tidak tersedia.",
      );
    }

    const body = new FormData();
    body.set("file", file);
    body.set("api_key", signature.apiKey);
    body.set("signature", signature.signature);
    body.set("timestamp", String(signature.timestamp));
    body.set("folder", signature.folder);
    body.set("upload_preset", signature.upload_preset);

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
      { method: "POST", body },
    );
    const result = (await response.json()) as {
      secure_url?: string;
      public_id?: string;
      error?: { message?: string };
    };

    if (!response.ok || !result.secure_url || !result.public_id) {
      throw new Error(result.error?.message ?? "Upload gambar gagal.");
    }

    return { thumbnail: result.secure_url, publicId: result.public_id };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setPending(true);

    try {
      const form = new FormData(event.currentTarget);
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
        editing ? `/api/admin/projects/${editing.id}` : "/api/admin/projects",
        {
          method: editing ? "PUT" : "POST",
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
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Gagal menyimpan project.");
      }

      event.currentTarget.reset();
      setEditing(null);
      setMessage("Project berhasil disimpan.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
    } finally {
      setPending(false);
    }
  }

  async function remove(project: AdminProject) {
    if (!window.confirm(`Hapus project “${project.title}”?`)) return;

    const response = await fetch(`/api/admin/projects/${project.id}`, {
      method: "DELETE",
    });
    const result = (await response.json()) as { error?: string };
    setMessage(
      response.ok
        ? "Project berhasil dihapus."
        : (result.error ?? "Gagal menghapus."),
    );
    if (response.ok) {
      if (editing?.id === project.id) setEditing(null);
      router.refresh();
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
      <section>
        <h2 className="text-xl font-semibold">Daftar project</h2>
        <div className="mt-4 space-y-3">
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{project.title}</h3>
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        project.status
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                          : "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300"
                      }`}
                    >
                      {project.status ? "Demo aktif" : "Demo tidak aktif"}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {project.techStack.join(" · ")}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setEditing(project)}
                    className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(project)}
                    className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </article>
          ))}
          {projects.length === 0 && (
            <p className="rounded-2xl border border-dashed border-border p-6 text-muted-foreground">
              Belum ada project.
            </p>
          )}
        </div>
      </section>

      <section className="h-fit rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold">
          {editing ? "Edit project" : "Project baru"}
        </h2>
        <form
          key={editing?.id ?? "new"}
          onSubmit={submit}
          className="mt-5 space-y-4"
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Judul</span>
            <input
              name="title"
              required
              defaultValue={editing?.title}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Deskripsi</span>
            <textarea
              name="description"
              required
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
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Demo URL</span>
            <input
              name="demoUrl"
              type="url"
              defaultValue={editing?.demoUrl ?? ""}
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
              className={inputClass}
            />
          </label>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              name="status"
              type="checkbox"
              defaultChecked={editing?.status ?? true}
              className="size-4 accent-primary"
            />
            Demo dapat diakses
          </label>
          <p className="-mt-2 text-xs text-muted-foreground">
            Matikan jika URL demo sudah offline atau tidak bisa dibuka.
          </p>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={editing?.featured}
              className="size-4 accent-primary"
            />
            Featured project
          </label>
          {message && (
            <p role="status" className="text-sm text-muted-foreground">
              {message}
            </p>
          )}
          <div className="flex gap-3">
            <button
              disabled={pending}
              className="rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:opacity-60"
            >
              {pending ? "Menyimpan…" : "Simpan"}
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => setEditing(null)}
                className="rounded-xl border border-border px-5 py-3 font-semibold"
              >
                Batal
              </button>
            )}
          </div>
        </form>
      </section>
    </div>
  );
}
