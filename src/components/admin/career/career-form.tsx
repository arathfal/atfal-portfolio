import type { FormEvent } from "react";
import { LoaderCircle, Pencil, Plus } from "lucide-react";

import { inputClass } from "../shared/form-styles";
import { dateValue, type AdminExperience } from "./career-domain";

type CareerFormProps = {
  editing: AdminExperience | null;
  current: boolean;
  submitting: boolean;
  deleting: boolean;
  onCurrentChange: (current: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
};

export function CareerForm({
  editing,
  current,
  submitting,
  deleting,
  onCurrentChange,
  onSubmit,
  onCancel,
}: CareerFormProps) {
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
        onSubmit={onSubmit}
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
            <span className="mb-1.5 block text-sm font-medium">Selesai</span>
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
            onChange={(event) => onCurrentChange(event.target.checked)}
            className="size-4 accent-primary"
          />
          Masih berjalan / Present
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

        <div className="flex flex-wrap gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || deleting}
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
              onClick={onCancel}
              disabled={submitting}
              className="rounded-xl border border-border px-5 py-3 font-semibold transition hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:opacity-60"
            >
              Batal
            </button>
          )}
        </div>
      </form>
    </section>
  );
}
