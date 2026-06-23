import {
  isRecord,
  optionalUrl,
  requiredString,
  type ValidationResult,
} from "./shared";

export type ProjectInput = {
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

export function validateProjectInput(
  value: unknown,
): ValidationResult<ProjectInput> {
  if (!isRecord(value)) {
    return { success: false, error: "Invalid request body." };
  }

  const title = requiredString(value.title, "Title", 120);
  if (!title.success) return title;
  const description = requiredString(value.description, "Description", 2000);
  if (!description.success) return description;

  const thumbnail = requiredString(value.thumbnail, "Thumbnail", 1000);
  if (!thumbnail.success) return thumbnail;

  if (
    !thumbnail.data.startsWith("/") &&
    !thumbnail.data.startsWith("https://") &&
    !thumbnail.data.startsWith("http://")
  ) {
    return {
      success: false,
      error: "Thumbnail must be an absolute HTTP(S) URL or local path.",
    };
  }

  if (
    !Array.isArray(value.techStack) ||
    value.techStack.length === 0 ||
    value.techStack.length > 20 ||
    !value.techStack.every(
      (item) =>
        typeof item === "string" &&
        item.trim().length > 0 &&
        item.trim().length <= 50,
    )
  ) {
    return {
      success: false,
      error: "Tech stack must contain between 1 and 20 valid entries.",
    };
  }

  const demoUrl = optionalUrl(value.demoUrl, "Demo URL");
  if (!demoUrl.success) return demoUrl;
  const repoUrl = optionalUrl(value.repoUrl, "Repository URL");
  if (!repoUrl.success) return repoUrl;

  if (typeof value.featured !== "boolean") {
    return { success: false, error: "Featured must be a boolean." };
  }

  if (typeof value.status !== "boolean") {
    return { success: false, error: "Status must be a boolean." };
  }

  if (
    value.thumbnailPublicId !== null &&
    value.thumbnailPublicId !== undefined &&
    (typeof value.thumbnailPublicId !== "string" ||
      value.thumbnailPublicId.length > 500)
  ) {
    return { success: false, error: "Invalid thumbnail public ID." };
  }

  return {
    success: true,
    data: {
      title: title.data,
      description: description.data,
      thumbnail: thumbnail.data,
      thumbnailPublicId:
        typeof value.thumbnailPublicId === "string"
          ? value.thumbnailPublicId.trim() || null
          : null,
      techStack: value.techStack.map((item) => item.trim()),
      demoUrl: demoUrl.data,
      repoUrl: repoUrl.data,
      featured: value.featured,
      status: value.status,
    },
  };
}
