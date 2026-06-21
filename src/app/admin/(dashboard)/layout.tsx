import Link from "next/link";

import { LogoutButton } from "@/components/admin/logout-button";

export default function AdminDashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="min-h-screen bg-muted/50">
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="text-lg font-bold">
            Aradea Admin<span className="text-primary">.</span>
          </Link>
          <nav
            className="flex items-center gap-2"
            aria-label="Admin navigation"
          >
            <Link
              href="/"
              className="rounded-full px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Overview
            </Link>
            <Link
              href="/projects"
              className="rounded-full px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Projects
            </Link>
            <Link
              href="/career"
              className="rounded-full px-4 py-2 text-sm font-medium hover:bg-muted"
            >
              Career
            </Link>
          </nav>
          <LogoutButton />
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  );
}
