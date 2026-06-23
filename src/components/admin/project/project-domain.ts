import type { Project } from "@/types";

export type AdminProject = Project & {
  thumbnailPublicId: string | null;
  updatedAt: string;
};

export function sortProjects(projects: AdminProject[]) {
  return [...projects].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function isAdminProject(value: unknown): value is AdminProject {
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

export function parseTechStackInput(value: FormDataEntryValue | null) {
  return String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}
