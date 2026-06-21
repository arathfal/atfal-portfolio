"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import type { Experience } from "@/types";

type AdminExperience = Experience & {
  logoPublicId: string | null;
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

function dateValue(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

export function CareerManager({
  experiences,
}: {
  experiences: AdminExperience[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState<AdminExperience | null>(null);
  const [current, setCurrent] = useState(true);
  const [message, setMessage] = useState("");
  const [pending, setPending] = useState(false);

  async function uploadLogo(file: File) {
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      throw new Error("Gunakan logo JPG, PNG, atau WebP.");
    }
    if (file.size > 2 * 1024 * 1024) {
      throw new Error("Ukuran logo maksimal 2 MB.");
    }

    const signatureResponse = await fetch("/api/admin/upload-signature", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ target: "career" }),
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
      throw new Error(result.error?.message ?? "Upload logo gagal.");
    }

    return { logo: result.secure_url, publicId: result.public_id };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setMessage("");
    try {
      const form = new FormData(event.currentTarget);
      const file = form.get("logoFile");
      let logo = editing?.logo ?? null;
      let logoPublicId = editing?.logoPublicId ?? null;

      if (file instanceof File && file.size > 0) {
        const uploaded = await uploadLogo(file);
        logo = uploaded.logo;
        logoPublicId = uploaded.publicId;
      }

      const response = await fetch(
        editing ? `/api/admin/career/${editing.id}` : "/api/admin/career",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            company: form.get("company"),
            logo,
            logoPublicId,
            role: form.get("role"),
            startDate: form.get("startDate"),
            endDate: current ? null : form.get("endDate"),
            current,
            description: form.get("description"),
            type: form.get("type"),
          }),
        },
      );
      const result = (await response.json()) as { error?: string };

      if (!response.ok) {
        throw new Error(result.error ?? "Gagal menyimpan career entry.");
      }

      event.currentTarget.reset();
      setEditing(null);
      setCurrent(true);
      setMessage("Career entry berhasil disimpan.");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Terjadi kesalahan.");
    } finally {
      setPending(false);
    }
  }

  async function remove(experience: AdminExperience) {
    if (!window.confirm(`Hapus “${experience.role}”?`)) return;
    const response = await fetch(`/api/admin/career/${experience.id}`, {
      method: "DELETE",
    });
    const result = (await response.json()) as { error?: string };
    setMessage(
      response.ok
        ? "Career entry berhasil dihapus."
        : (result.error ?? "Gagal menghapus."),
    );
    if (response.ok) router.refresh();
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
      <section>
        <h2 className="text-xl font-semibold">Career timeline</h2>
        <div className="mt-4 space-y-3">
          {experiences.map((experience) => (
            <article
              key={experience.id}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                    {experience.type}
                    {experience.current ? " · Current" : ""}
                  </p>
                  <h3 className="mt-1 font-semibold">{experience.role}</h3>
                  <p className="text-sm text-muted-foreground">
                    {experience.company}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(experience);
                      setCurrent(experience.current);
                    }}
                    className="rounded-lg border border-border px-3 py-2 text-sm hover:bg-muted"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => remove(experience)}
                    className="rounded-lg border border-red-300 px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="h-fit rounded-2xl border border-border bg-surface p-6">
        <h2 className="text-xl font-semibold">
          {editing ? "Edit career" : "Career baru"}
        </h2>
        <form
          key={editing?.id ?? "new"}
          onSubmit={submit}
          className="mt-5 space-y-4"
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Tipe</span>
            <select
              name="type"
              defaultValue={editing?.type ?? "work"}
              className={inputClass}
            >
              <option value="work">Work</option>
              <option value="education">Education</option>
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              Company / Institution
            </span>
            <input
              name="company"
              required
              defaultValue={editing?.company}
              className={inputClass}
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              Logo {editing ? "(opsional jika tidak diganti)" : "(opsional)"}
            </span>
            <input
              name="logoFile"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className={inputClass}
            />
            <span className="mt-1 block text-xs text-muted-foreground">
              Jika kosong, website memakai placeholder inisial. Maksimal 2 MB.
            </span>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">
              Role / Program
            </span>
            <input
              name="role"
              required
              defaultValue={editing?.role}
              className={inputClass}
            />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label>
              <span className="mb-1.5 block text-sm font-medium">Mulai</span>
              <input
                name="startDate"
                type="date"
                required
                defaultValue={dateValue(editing?.startDate ?? null)}
                className={inputClass}
              />
            </label>
            <label>
              <span className="mb-1.5 block text-sm font-medium">Selesai</span>
              <input
                name="endDate"
                type="date"
                disabled={current}
                defaultValue={dateValue(editing?.endDate ?? null)}
                className={inputClass}
              />
            </label>
          </div>
          <label className="flex items-center gap-3 text-sm font-medium">
            <input
              name="current"
              type="checkbox"
              checked={current}
              onChange={(event) => setCurrent(event.target.checked)}
              className="size-4 accent-primary"
            />
            Masih berjalan / Present
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
                onClick={() => {
                  setEditing(null);
                  setCurrent(true);
                }}
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
