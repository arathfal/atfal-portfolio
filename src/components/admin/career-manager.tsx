"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";
import {
  AlertCircle,
  BriefcaseBusiness,
  CheckCircle2,
  GraduationCap,
  LoaderCircle,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

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

type Feedback = {
  type: "success" | "error";
  text: string;
};

const inputClass =
  "w-full rounded-xl border border-border bg-background px-4 py-3 outline-none transition placeholder:text-muted-foreground/70 focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60";

function dateValue(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

function formatDate(value: string | null) {
  if (!value) return "Present";
  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

function sortExperiences(experiences: AdminExperience[]) {
  return [...experiences].sort((a, b) => {
    const dateDifference =
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    return dateDifference || b.id - a.id;
  });
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

function isAdminExperience(value: unknown): value is AdminExperience {
  return (
    typeof value === "object" &&
    value !== null &&
    "id" in value &&
    typeof value.id === "number" &&
    "role" in value &&
    typeof value.role === "string" &&
    "company" in value &&
    typeof value.company === "string" &&
    "startDate" in value &&
    typeof value.startDate === "string"
  );
}

export function CareerManager({
  experiences,
}: {
  experiences: AdminExperience[];
}) {
  const [items, setItems] = useState(() => sortExperiences(experiences));
  const [editing, setEditing] = useState<AdminExperience | null>(null);
  const [current, setCurrent] = useState(true);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  function resetEditor(form?: HTMLFormElement) {
    form?.reset();
    setEditing(null);
    setCurrent(true);
  }

  function beginEdit(experience: AdminExperience) {
    setEditing(experience);
    setCurrent(experience.current);
    setFeedback(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

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
    const signature = await readJson(signatureResponse);

    if (
      !signatureResponse.ok ||
      typeof signature !== "object" ||
      signature === null ||
      !("signature" in signature)
    ) {
      throw new Error(
        errorMessage(signature, "Layanan upload logo tidak tersedia."),
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
          : "Upload logo gagal.";
      throw new Error(cloudinaryError);
    }

    return { logo: result.secure_url, publicId: result.public_id };
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const editedId = editing?.id ?? null;
    setSubmitting(true);
    setFeedback(null);

    try {
      const form = new FormData(formElement);
      const file = form.get("logoFile");
      let logo = editing?.logo ?? null;
      let logoPublicId = editing?.logoPublicId ?? null;

      if (file instanceof File && file.size > 0) {
        const uploaded = await uploadLogo(file);
        logo = uploaded.logo;
        logoPublicId = uploaded.publicId;
      }

      const response = await fetch(
        editedId ? `/api/admin/career/${editedId}` : "/api/admin/career",
        {
          method: editedId ? "PUT" : "POST",
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
      const result = await readJson(response);

      if (!response.ok) {
        throw new Error(errorMessage(result, "Gagal menyimpan career entry."));
      }
      if (!isAdminExperience(result)) {
        throw new Error("Data career dari server tidak lengkap.");
      }

      setItems((existing) =>
        sortExperiences(
          editedId
            ? existing.map((experience) =>
                experience.id === editedId ? result : experience,
              )
            : [result, ...existing],
        ),
      );
      resetEditor(formElement);
      setFeedback({
        type: "success",
        text: editedId
          ? `Career “${result.role}” berhasil diperbarui.`
          : `Career “${result.role}” berhasil ditambahkan.`,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menyimpan career.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(experience: AdminExperience) {
    if (!window.confirm(`Hapus “${experience.role}”?`)) return;

    setFeedback(null);
    setDeletingId(experience.id);

    try {
      const response = await fetch(`/api/admin/career/${experience.id}`, {
        method: "DELETE",
      });
      const result = await readJson(response);

      if (!response.ok) {
        throw new Error(errorMessage(result, "Gagal menghapus career entry."));
      }

      setItems((existing) =>
        existing.filter((item) => item.id !== experience.id),
      );
      if (editing?.id === experience.id) resetEditor();
      setFeedback({
        type: "success",
        text: `Career “${experience.role}” berhasil dihapus.`,
      });
    } catch (error) {
      setFeedback({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan saat menghapus career.",
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
            {items.map((experience) => {
              const initials = experience.company
                .split(/\s+/)
                .slice(0, 2)
                .map((word) => word[0])
                .join("")
                .toUpperCase();

              return (
                <article
                  key={experience.id}
                  className={`rounded-2xl border bg-surface p-5 transition ${
                    editing?.id === experience.id
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
                        initials || "—"
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
                          onClick={() => beginEdit(experience)}
                          disabled={submitting || deletingId !== null}
                          className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <Pencil className="size-4" />
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => remove(experience)}
                          disabled={submitting || deletingId !== null}
                          className="inline-flex items-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950/30"
                        >
                          {deletingId === experience.id ? (
                            <LoaderCircle className="size-4 animate-spin" />
                          ) : (
                            <Trash2 className="size-4" />
                          )}
                          {deletingId === experience.id
                            ? "Menghapus…"
                            : "Hapus"}
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}

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
                {editing ? "Edit career" : "Career baru"}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {editing
                  ? `Memperbarui “${editing.role}”`
                  : "Tambahkan pengalaman kerja atau pendidikan."}
              </p>
            </div>
          </div>

          <form
            key={editing?.id ?? "new"}
            onSubmit={submit}
            className="mt-6 space-y-4"
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
                maxLength={160}
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
                Jika kosong, website memakai inisial. Maksimal 2 MB.
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">
                Role / Program
              </span>
              <input
                name="role"
                required
                maxLength={160}
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
                <span className="mb-1.5 block text-sm font-medium">
                  Selesai
                </span>
                <input
                  name="endDate"
                  type="date"
                  required={!current}
                  disabled={current}
                  defaultValue={dateValue(editing?.endDate ?? null)}
                  className={inputClass}
                />
              </label>
            </div>
            <label className="flex items-center gap-3 rounded-xl border border-border bg-muted/50 p-4 text-sm font-medium">
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

            <div className="flex flex-wrap gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting || deletingId !== null}
                className="inline-flex min-w-32 items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:brightness-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting && <LoaderCircle className="size-4 animate-spin" />}
                {submitting
                  ? "Menyimpan…"
                  : editing
                    ? "Simpan perubahan"
                    : "Tambah career"}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={() => {
                    setEditing(null);
                    setCurrent(true);
                    setFeedback(null);
                  }}
                  disabled={submitting}
                  className="rounded-xl border border-border px-5 py-3 font-semibold transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
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
