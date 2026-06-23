"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const navigation = [
  { label: "Overview", href: "/" },
  { label: "Projects", href: "/projects" },
  { label: "Career", href: "/career" },
];

export function AdminNavigation() {
  const pathname = usePathname();
  const usesAdminPrefix =
    pathname === "/admin" || pathname.startsWith("/admin/");
  const currentPath = usesAdminPrefix
    ? pathname.slice("/admin".length) || "/"
    : pathname;

  function isActive(href: string) {
    return href === "/"
      ? currentPath === href
      : currentPath === href || currentPath.startsWith(`${href}/`);
  }

  return (
    <nav className="flex items-center gap-2" aria-label="Admin navigation">
      {navigation.map((item) => {
        const active = isActive(item.href);
        const href = usesAdminPrefix
          ? item.href === "/"
            ? "/admin"
            : `/admin${item.href}`
          : item.href;

        return (
          <Link
            key={item.href}
            href={href}
            className={cn(
              "rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
              active
                ? "bg-primary-soft text-primary"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
            aria-current={active ? "page" : undefined}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
