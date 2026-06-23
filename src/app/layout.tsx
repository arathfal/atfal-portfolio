import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { siteKeywords, siteUrl } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Aradea Atfal — Frontend Developer",
    template: "%s | Aradea Atfal",
  },
  description:
    "Frontend developer portfolio focused on accessible interfaces, thoughtful interaction, and dependable engineering.",
  keywords: siteKeywords,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Aradea Atfal Portfolio",
    title: "Aradea Atfal — Frontend Developer",
    description:
      "Clear interfaces, resilient code, and thoughtful digital experiences.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Aradea Atfal Risdianto Frontend Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aradea Atfal — Frontend Developer",
    description:
      "Clear interfaces, resilient code, and thoughtful digital experiences.",
    images: ["/og-image.svg"],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fafafa" },
    { media: "(prefers-color-scheme: dark)", color: "#0d0d10" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen bg-background font-sans text-foreground antialiased">
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
