"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { uploadAdminImage } from "../shared/cloudinary-upload";
import { FeedbackMessage } from "../shared/feedback-message";
import { errorMessage, readJson } from "../shared/http";
import type { Feedback } from "../shared/types";
import {
  isAdminExperience,
  sortExperiences,
  type AdminExperience,
} from "./career-domain";
import { CareerForm } from "./career-form";
import { CareerList } from "./career-list";

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

  function cancelEdit() {
    setEditing(null);
    setCurrent(true);
    setFeedback(null);
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
        const uploaded = await uploadAdminImage(file, {
          target: "career",
          invalidTypeMessage: "Gunakan logo JPG, PNG, atau WebP.",
          maxSizeMessage: "Ukuran logo maksimal 2 MB.",
          signatureUnavailableMessage: "Layanan upload logo tidak tersedia.",
          uploadFailedMessage: "Upload logo gagal.",
        });
        logo = uploaded.url;
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
      {feedback && <FeedbackMessage feedback={feedback} />}
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.75fr)]">
        <CareerList
          items={items}
          editingId={editing?.id ?? null}
          submitting={submitting}
          deletingId={deletingId}
          onEdit={beginEdit}
          onDelete={remove}
        />
        <CareerForm
          editing={editing}
          current={current}
          submitting={submitting}
          deleting={deletingId !== null}
          onCurrentChange={setCurrent}
          onSubmit={submit}
          onCancel={cancelEdit}
        />
      </div>
    </div>
  );
}
