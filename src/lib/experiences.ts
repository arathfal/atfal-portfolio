import type { Experience as PrismaExperience } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { Experience } from "@/types";
import type { ExperienceInput } from "@/lib/validation";

export function toPublicExperience(experience: PrismaExperience): Experience {
  return {
    id: experience.id,
    company: experience.company,
    logo: experience.logo,
    role: experience.role,
    startDate: experience.startDate.toISOString(),
    endDate: experience.endDate?.toISOString() ?? null,
    current: experience.endDate === null,
    description: experience.description,
    type: experience.type,
  };
}

export function toAdminExperience(experience: PrismaExperience) {
  return {
    ...toPublicExperience(experience),
    logoPublicId: experience.logoPublicId,
  };
}

export async function listExperiences(): Promise<Experience[]> {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ startDate: "desc" }, { id: "desc" }],
  });

  return experiences.map(toPublicExperience);
}

export async function listAdminExperiences() {
  const experiences = await prisma.experience.findMany({
    orderBy: [{ startDate: "desc" }, { id: "desc" }],
  });

  return experiences.map(toAdminExperience);
}

export async function createExperience(input: ExperienceInput) {
  return prisma.experience.create({ data: input });
}

export async function updateExperience(id: number, input: ExperienceInput) {
  return prisma.experience.update({ where: { id }, data: input });
}
