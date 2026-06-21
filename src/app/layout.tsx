import type { Metadata, Viewport } from "next";

import { ThemeProvider } from "@/components/layout/theme-provider";

import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "Aradea — Frontend Developer",
    template: "%s | Aradea",
  },
  description:
    "Frontend developer portfolio focused on accessible interfaces, thoughtful interaction, and dependable engineering.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Aradea Portfolio",
    title: "Aradea — Frontend Developer",
    description:
      "Clear interfaces, resilient code, and thoughtful digital experiences.",
    images: [
      {
        url: "/og-image.svg",
        width: 1200,
        height: 630,
        alt: "Aradea Frontend Developer Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Aradea — Frontend Developer",
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
