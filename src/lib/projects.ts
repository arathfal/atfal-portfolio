import type { Project as PrismaProject } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import type { Project } from "@/types";
import type { ProjectInput } from "@/lib/validation";

export function parseTechStack(techStack: string): string[] {
  try {
    const parsed: unknown = JSON.parse(techStack);
    if (
      Array.isArray(parsed) &&
      parsed.every((item) => typeof item === "string")
    ) {
      return parsed;
    }
  } catch {
    // Support legacy comma-separated values.
  }

  return techStack
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function toPublicProject(project: PrismaProject): Project {
  return {
    id: project.id,
    title: project.title,
    description: project.description,
    thumbnail: project.thumbnail,
    techStack: parseTechStack(project.techStack),
    demoUrl: project.demoUrl,
    repoUrl: project.repoUrl,
    featured: project.featured,
    status: project.status,
    createdAt: project.createdAt.toISOString(),
  };
}

export async function listProjects(featured?: boolean): Promise<Project[]> {
  const projects = await prisma.project.findMany({
    where: featured ? { featured: true } : undefined,
    orderBy: { createdAt: "desc" },
  });

  return projects.map(toPublicProject);
}

export async function listAdminProjects() {
  const projects = await prisma.project.findMany({
    orderBy: { createdAt: "desc" },
  });

  return projects.map((project) => ({
    ...toPublicProject(project),
    thumbnailPublicId: project.thumbnailPublicId,
    updatedAt: project.updatedAt.toISOString(),
  }));
}

export async function createProject(input: ProjectInput) {
  return prisma.project.create({
    data: {
      ...input,
      techStack: JSON.stringify(input.techStack),
    },
  });
}

export async function updateProject(id: number, input: ProjectInput) {
  return prisma.project.update({
    where: { id },
    data: {
      ...input,
      techStack: JSON.stringify(input.techStack),
    },
  });
}
