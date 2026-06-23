import { errorMessage, readJson } from "./http";
import type { UploadSignature } from "./types";

const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
const maxFileSize = 2 * 1024 * 1024;

type UploadOptions = {
  target: "projects" | "career";
  invalidTypeMessage: string;
  maxSizeMessage: string;
  signatureUnavailableMessage: string;
  uploadFailedMessage: string;
};

type CloudinaryUploadResult = {
  url: string;
  publicId: string;
};

export async function uploadAdminImage(
  file: File,
  options: UploadOptions,
): Promise<CloudinaryUploadResult> {
  if (!allowedTypes.includes(file.type)) {
    throw new Error(options.invalidTypeMessage);
  }
  if (file.size > maxFileSize) {
    throw new Error(options.maxSizeMessage);
  }

  const signatureResponse = await fetch("/api/admin/upload-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ target: options.target }),
  });
  const signature = await readJson(signatureResponse);

  if (!signatureResponse.ok || !isUploadSignature(signature)) {
    throw new Error(
      errorMessage(signature, options.signatureUnavailableMessage),
    );
  }

  const body = new FormData();
  body.set("file", file);
  body.set("api_key", signature.apiKey);
  body.set("signature", signature.signature);
  body.set("timestamp", String(signature.timestamp));
  body.set("folder", signature.folder);
  body.set("upload_preset", signature.upload_preset);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`,
    { method: "POST", body },
  );
  const result = await readJson(response);

  if (!response.ok || !isCloudinaryResult(result)) {
    throw new Error(
      cloudinaryErrorMessage(result, options.uploadFailedMessage),
    );
  }

  return { url: result.secure_url, publicId: result.public_id };
}

function isUploadSignature(value: unknown): value is UploadSignature {
  return (
    typeof value === "object" &&
    value !== null &&
    "cloudName" in value &&
    typeof value.cloudName === "string" &&
    "apiKey" in value &&
    typeof value.apiKey === "string" &&
    "signature" in value &&
    typeof value.signature === "string" &&
    "timestamp" in value &&
    typeof value.timestamp === "number" &&
    "folder" in value &&
    typeof value.folder === "string" &&
    "upload_preset" in value &&
    typeof value.upload_preset === "string"
  );
}

function isCloudinaryResult(
  value: unknown,
): value is { secure_url: string; public_id: string } {
  return (
    typeof value === "object" &&
    value !== null &&
    "secure_url" in value &&
    typeof value.secure_url === "string" &&
    "public_id" in value &&
    typeof value.public_id === "string"
  );
}

function cloudinaryErrorMessage(result: unknown, fallback: string) {
  if (
    typeof result === "object" &&
    result !== null &&
    "error" in result &&
    typeof result.error === "object" &&
    result.error !== null &&
    "message" in result.error &&
    typeof result.error.message === "string"
  ) {
    return result.error.message;
  }

  return fallback;
}
