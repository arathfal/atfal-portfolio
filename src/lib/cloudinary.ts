import { createHash } from "node:crypto";

function getCloudinaryConfig() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Cloudinary environment variables are incomplete.");
  }

  return { cloudName, apiKey, apiSecret };
}

function signatureFor(params: Record<string, string | number>, secret: string) {
  const payload = Object.entries(params)
    .filter(([, value]) => value !== "")
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([key, value]) => `${key}=${value}`)
    .join("&");

  return createHash("sha1").update(`${payload}${secret}`).digest("hex");
}

export function createUploadSignature(
  target: "projects" | "career" = "projects",
) {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const uploadPreset = process.env.CLOUDINARY_UPLOAD_PRESET;

  if (!uploadPreset) {
    throw new Error("CLOUDINARY_UPLOAD_PRESET is not configured.");
  }

  const params = {
    folder: `portfolio/${target}`,
    timestamp,
    upload_preset: uploadPreset,
  };

  return {
    ...params,
    cloudName,
    apiKey,
    signature: signatureFor(params, apiSecret),
  };
}

export async function deleteCloudinaryImage(publicId: string): Promise<void> {
  const { cloudName, apiKey, apiSecret } = getCloudinaryConfig();
  const timestamp = Math.floor(Date.now() / 1000);
  const params = { public_id: publicId, timestamp };
  const body = new URLSearchParams({
    ...Object.fromEntries(
      Object.entries(params).map(([key, value]) => [key, String(value)]),
    ),
    api_key: apiKey,
    signature: signatureFor(params, apiSecret),
  });

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`,
    { method: "POST", body, cache: "no-store" },
  );

  if (!response.ok) {
    throw new Error(`Cloudinary deletion failed with ${response.status}.`);
  }
}
