export type Project = {
  id: number;
  title: string;
  description: string;
  thumbnail: string;
  techStack: string[];
  demoUrl: string | null;
  repoUrl: string | null;
  featured: boolean;
  createdAt: string;
};

export type Experience = {
  id: number;
  company: string;
  logo: string | null;
  role: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  type: "work" | "education";
};
