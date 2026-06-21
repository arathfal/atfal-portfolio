import { ExperienceType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projects = [
  {
    title: "Nusa Commerce",
    description:
      "Headless commerce storefront dengan pencarian produk, cart persisten, dan checkout yang dioptimalkan untuk perangkat mobile.",
    thumbnail: "/images/projects/nusa-commerce.svg",
    techStack: JSON.stringify([
      "Next.js",
      "TypeScript",
      "Tailwind CSS",
      "Stripe",
    ]),
    demoUrl: "https://nusa-commerce.vercel.app",
    repoUrl: "https://github.com/example/nusa-commerce",
    featured: true,
    createdAt: new Date("2025-11-12T08:00:00.000Z"),
  },
  {
    title: "Pulse Analytics",
    description:
      "Dashboard analitik real-time untuk memantau funnel, retensi pengguna, dan performa kampanye dalam satu workspace.",
    thumbnail: "/images/projects/pulse-analytics.svg",
    techStack: JSON.stringify([
      "React",
      "TypeScript",
      "Recharts",
      "PostgreSQL",
    ]),
    demoUrl: "https://pulse-analytics.vercel.app",
    repoUrl: "https://github.com/example/pulse-analytics",
    featured: true,
    createdAt: new Date("2025-07-20T08:00:00.000Z"),
  },
  {
    title: "Ruang Kolaborasi",
    description:
      "Aplikasi manajemen proyek untuk tim kreatif dengan kanban, komentar kontekstual, dan pembaruan aktivitas real-time.",
    thumbnail: "/images/projects/ruang-kolaborasi.svg",
    techStack: JSON.stringify([
      "Next.js",
      "Prisma",
      "Socket.io",
      "Tailwind CSS",
    ]),
    demoUrl: "https://ruang-kolaborasi.vercel.app",
    repoUrl: "https://github.com/example/ruang-kolaborasi",
    featured: true,
    createdAt: new Date("2025-03-08T08:00:00.000Z"),
  },
  {
    title: "Jelajah Nusantara",
    description:
      "Platform editorial perjalanan yang menyajikan panduan destinasi, itinerary, dan peta interaktif untuk wisatawan domestik.",
    thumbnail: "/images/projects/jelajah-nusantara.svg",
    techStack: JSON.stringify(["Next.js", "Mapbox", "MDX", "Framer Motion"]),
    demoUrl: "https://jelajah-nusantara.vercel.app",
    repoUrl: "https://github.com/example/jelajah-nusantara",
    featured: false,
    createdAt: new Date("2024-10-15T08:00:00.000Z"),
  },
  {
    title: "Finora Mobile Banking",
    description:
      "Prototype web banking aksesibel dengan ringkasan keuangan, visualisasi pengeluaran, serta alur transfer yang aman.",
    thumbnail: "/images/projects/finora-banking.svg",
    techStack: JSON.stringify(["React", "Vite", "TanStack Query", "Vitest"]),
    demoUrl: "https://finora-banking.vercel.app",
    repoUrl: "https://github.com/example/finora-banking",
    featured: false,
    createdAt: new Date("2024-05-02T08:00:00.000Z"),
  },
];

const experiences = [
  {
    company: "Aurora Digital Labs",
    role: "Senior Frontend Developer",
    startDate: new Date("2024-01-01T00:00:00.000Z"),
    endDate: null,
    description:
      "Memimpin pengembangan design system dan arsitektur frontend untuk produk SaaS B2B, sekaligus meningkatkan Core Web Vitals pada aplikasi utama.",
    type: ExperienceType.work,
  },
  {
    company: "Kreasi Teknologi Indonesia",
    role: "Frontend Developer",
    startDate: new Date("2021-07-01T00:00:00.000Z"),
    endDate: new Date("2023-12-31T00:00:00.000Z"),
    description:
      "Membangun dashboard operasional dan customer portal menggunakan React dan TypeScript bersama tim produk lintas fungsi.",
    type: ExperienceType.work,
  },
  {
    company: "Digital Talent Scholarship",
    role: "Frontend Web Development",
    startDate: new Date("2021-02-01T00:00:00.000Z"),
    endDate: new Date("2021-06-30T00:00:00.000Z"),
    description:
      "Menyelesaikan pelatihan intensif frontend yang berfokus pada JavaScript modern, React, aksesibilitas, dan praktik pengembangan kolaboratif.",
    type: ExperienceType.education,
  },
  {
    company: "Universitas Indonesia",
    role: "Sarjana Ilmu Komputer",
    startDate: new Date("2017-08-01T00:00:00.000Z"),
    endDate: new Date("2021-01-31T00:00:00.000Z"),
    description:
      "Mempelajari rekayasa perangkat lunak dan interaksi manusia-komputer, dengan tugas akhir tentang evaluasi usability aplikasi web.",
    type: ExperienceType.education,
  },
];

async function main() {
  await prisma.$transaction([
    prisma.project.deleteMany(),
    prisma.experience.deleteMany(),
  ]);

  await prisma.project.createMany({ data: projects });
  await prisma.experience.createMany({ data: experiences });

  console.log(
    `Seed selesai: ${projects.length} project dan ${experiences.length} experience dibuat.`,
  );
}

main()
  .catch((error) => {
    console.error("Seed gagal:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
