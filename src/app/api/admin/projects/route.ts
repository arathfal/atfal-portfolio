import { NextRequest } from "next/server";

import { guardAdminApi, privateJson } from "@/lib/admin-api";
import { createProject, listAdminProjects } from "@/lib/projects";
import { validateProjectInput } from "@/lib/validation";

export async function GET(request: NextRequest) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;

  return privateJson(await listAdminProjects());
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

  const parsed = validateProjectInput(body);
  if (!parsed.success) {
    return privateJson({ error: parsed.error }, { status: 400 });
  }

  const project = await createProject(parsed.data);
  return privateJson({ id: project.id }, { status: 201 });
}
