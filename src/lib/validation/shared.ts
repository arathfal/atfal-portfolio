export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; error: string };

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function requiredString(
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

export function optionalUrl(
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

export function parseNumericId(value: string): number | null {
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}
