import type { Experience } from "@/types";

export type AdminExperience = Experience & {
  logoPublicId: string | null;
};

export function dateValue(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

export function formatDate(value: string | null) {
  if (!value) return "Present";

  return new Intl.DateTimeFormat("id-ID", {
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function companyInitials(company: string) {
  return company
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

export function sortExperiences(experiences: AdminExperience[]) {
  return [...experiences].sort((a, b) => {
    const dateDifference =
      new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
    return dateDifference || b.id - a.id;
  });
}

export function isAdminExperience(value: unknown): value is AdminExperience {
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
