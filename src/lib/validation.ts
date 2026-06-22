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

export type ExperienceInput = {
  company: string;
  logo: string | null;
  logoPublicId: string | null;
  role: string;
  startDate: Date;
  endDate: Date | null;
  description: string;
  type: "work" | "education";
};

type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function requiredString(
  value: unknown,
  label: string,
  maxLength: number,
): ValidationResult<string> {
  if (typeof value !== "string" || value.trim().length === 0) {
    return { success: false, error: `${label} is required.` };
  }

  const normalized = value.trim();
  if (normalized.length > maxLength) {
    return {
      success: false,
      error: `${label} must be at most ${maxLength} characters.`,
    };
  }

  return { success: true, data: normalized };
}

function optionalUrl(
  value: unknown,
  label: string,
): ValidationResult<string | null> {
  if (value === null || value === undefined || value === "") {
    return { success: true, data: null };
  }

  if (typeof value !== "string") {
    return { success: false, error: `${label} must be a URL.` };
  }

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      throw new Error("Unsupported protocol");
    }
    return { success: true, data: url.toString() };
  } catch {
    return { success: false, error: `${label} must be a valid HTTP(S) URL.` };
  }
}

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

export function validateExperienceInput(
  value: unknown,
): ValidationResult<ExperienceInput> {
  if (!isRecord(value)) {
    return { success: false, error: "Invalid request body." };
  }

  const company = requiredString(value.company, "Company", 160);
  if (!company.success) return company;
  const role = requiredString(value.role, "Role", 160);
  if (!role.success) return role;
  const description = requiredString(value.description, "Description", 2000);
  if (!description.success) return description;

  const logo = optionalUrl(value.logo, "Logo");
  if (!logo.success) return logo;

  if (
    value.logoPublicId !== null &&
    value.logoPublicId !== undefined &&
    (typeof value.logoPublicId !== "string" || value.logoPublicId.length > 500)
  ) {
    return { success: false, error: "Invalid logo public ID." };
  }

  if (value.type !== "work" && value.type !== "education") {
    return { success: false, error: "Invalid experience type." };
  }

  const startDate = new Date(String(value.startDate ?? ""));
  if (Number.isNaN(startDate.getTime())) {
    return { success: false, error: "Start date is invalid." };
  }

  if (value.current !== undefined && typeof value.current !== "boolean") {
    return { success: false, error: "Current must be a boolean." };
  }

  const current = value.current === true;
  const endDate = current
    ? null
    : value.endDate === null ||
        value.endDate === undefined ||
        value.endDate === ""
      ? null
      : new Date(String(value.endDate));

  if (endDate && Number.isNaN(endDate.getTime())) {
    return { success: false, error: "End date is invalid." };
  }

  if (endDate && endDate < startDate) {
    return { success: false, error: "End date cannot precede start date." };
  }

  return {
    success: true,
    data: {
      company: company.data,
      logo: logo.data,
      logoPublicId:
        typeof value.logoPublicId === "string"
          ? value.logoPublicId.trim() || null
          : null,
      role: role.data,
      startDate,
      endDate,
      description: description.data,
      type: value.type,
    },
  };
}

export function parseNumericId(value: string): number | null {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
