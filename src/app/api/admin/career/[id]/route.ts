import { Prisma } from "@prisma/client";
import { NextRequest } from "next/server";

import { guardAdminApi, privateJson } from "@/lib/admin-api";
import { deleteCloudinaryImage } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";
import { toAdminExperience, updateExperience } from "@/lib/experiences";
import { parseNumericId, validateExperienceInput } from "@/lib/validation";

type RouteContext = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, context: RouteContext) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;

  const id = parseNumericId((await context.params).id);
  if (!id) {
    return privateJson({ error: "Invalid experience ID." }, { status: 400 });
  }

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

  try {
    const previous = await prisma.experience.findUnique({ where: { id } });
    if (!previous) {
      return privateJson({ error: "Experience not found." }, { status: 404 });
    }

    const experience = await updateExperience(id, parsed.data);

    if (
      previous.logoPublicId &&
      previous.logoPublicId !== parsed.data.logoPublicId
    ) {
      deleteCloudinaryImage(previous.logoPublicId).catch((error) => {
        console.error("Failed to delete replaced career logo:", error);
      });
    }

    return privateJson(toAdminExperience(experience));
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return privateJson({ error: "Experience not found." }, { status: 404 });
    }
    throw error;
  }
}

export async function DELETE(request: NextRequest, context: RouteContext) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;

  const id = parseNumericId((await context.params).id);
  if (!id) {
    return privateJson({ error: "Invalid experience ID." }, { status: 400 });
  }

  try {
    const experience = await prisma.experience.delete({ where: { id } });

    if (experience.logoPublicId) {
      deleteCloudinaryImage(experience.logoPublicId).catch((error) => {
        console.error("Failed to delete career logo:", error);
      });
    }
    return privateJson({ success: true, id: experience.id });
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return privateJson({ error: "Experience not found." }, { status: 404 });
    }
    throw error;
  }
}
