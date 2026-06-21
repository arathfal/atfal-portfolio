import type { Metadata } from "next";

import {
  AboutSection,
  HeroSection,
  SkillsSection,
} from "@/components/sections/home-sections";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Aradea is a frontend developer creating accessible, responsive, and performant digital experiences.",
  openGraph: {
    title: "Aradea — Frontend Developer",
    description:
      "Accessible interfaces, thoughtful interaction, and dependable frontend engineering.",
  },
};

export default function HomePage() {
  return (
    <main>
      <HeroSection />
      <AboutSection />
      <SkillsSection />
    </main>
  );
}
