"use client";

import type { FormEvent } from "react";
import { useState } from "react";

import { uploadAdminImage } from "../shared/cloudinary-upload";
import { FeedbackMessage } from "../shared/feedback-message";
import { errorMessage, readJson } from "../shared/http";
import type { Feedback } from "../shared/types";
import {
  isAdminProject,
  parseTechStackInput,
  sortProjects,
  type AdminProject,
} from "./project-domain";
import { ProjectForm } from "./project-form";
import { ProjectList } from "./project-list";

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

  function cancelEdit() {
    setEditing(null);
    setFeedback(null);
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
        const uploaded = await uploadAdminImage(file, {
          target: "projects",
          invalidTypeMessage: "Gunakan gambar JPG, PNG, atau WebP.",
          maxSizeMessage: "Ukuran gambar maksimal 2 MB.",
          signatureUnavailableMessage: "Layanan upload gambar tidak tersedia.",
          uploadFailedMessage: "Upload gambar gagal.",
        });
        thumbnail = uploaded.url;
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
            techStack: parseTechStackInput(form.get("techStack")),
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
      {feedback && <FeedbackMessage feedback={feedback} />}
      <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.75fr)]">
        <ProjectList
          items={items}
          editingId={editing?.id ?? null}
          submitting={submitting}
          deletingId={deletingId}
          onEdit={beginEdit}
          onDelete={remove}
        />
        <ProjectForm
          editing={editing}
          submitting={submitting}
          deleting={deletingId !== null}
          onSubmit={submit}
          onCancel={cancelEdit}
        />
      </div>
    </div>
  );
}
