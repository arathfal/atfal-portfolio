import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

import { guardAdminApi, privateJson } from "@/lib/admin-api";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { toAdminProject, updateProject } from "@/lib/projects";
import { parseNumericId, validateProjectInput } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;

  const id = parseNumericId((await context.params).id);
  if (!id)
    return privateJson({ error: "Invalid project ID." }, { status: 400 });

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

  try {
    const previous = await prisma.project.findUnique({ where: { id } });
    if (!previous) {
      return privateJson({ error: "Project not found." }, { status: 404 });
    }

    const project = await updateProject(id, parsed.data);

    if (
      previous.thumbnailPublicId &&
      previous.thumbnailPublicId !== parsed.data.thumbnailPublicId
    ) {
      deleteCloudinaryImage(previous.thumbnailPublicId).catch((error) => {
        console.error("Failed to delete replaced Cloudinary image:", error);
      });
    }

    return privateJson(toAdminProject(project));
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return privateJson({ error: "Project not found." }, { status: 404 });
    }
    throw error;
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;

  const id = parseNumericId((await context.params).id);
  if (!id)
    return privateJson({ error: "Invalid project ID." }, { status: 400 });

  try {
    const project = await prisma.project.delete({ where: { id } });

    if (project.thumbnailPublicId) {
      deleteCloudinaryImage(project.thumbnailPublicId).catch((error) => {
        console.error("Failed to delete Cloudinary image:", error);
      });
    }

    return privateJson({ success: true, id: project.id });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return privateJson({ error: "Project not found." }, { status: 404 });
    }
    throw error;
  }
}
