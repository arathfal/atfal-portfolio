import { NextRequest } from "next/server";

import { guardAdminApi, privateJson } from "@/lib/admin-api";
import {
  createExperience,
  listAdminExperiences,
  toAdminExperience,
} from "@/lib/experiences";
import { validateExperienceInput } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;

  return privateJson(await listAdminExperiences());
}

export async function POST(request: NextRequest) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return privateJson({ error: "Invalid request body." }, { status: 400 });
  }

  const parsed = validateExperienceInput(body);
  if (!parsed.success) {
    return privateJson({ error: parsed.error }, { status: 400 });
  }

  const experience = await createExperience(parsed.data);
  return privateJson(toAdminExperience(experience), { status: 201 });
}
