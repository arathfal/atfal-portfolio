import {
  isRecord,
  optionalUrl,
  requiredString,
  type ValidationResult,
} from "./shared";

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
