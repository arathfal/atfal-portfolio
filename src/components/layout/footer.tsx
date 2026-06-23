import { ContactRound, GitFork, Mail } from "lucide-react";

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/",
    icon: GitFork,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/",
    icon: ContactRound,
  },
  {
    label: "Email",
    href: "mailto:hello@example.com",
    icon: Mail,
  },
];

export function Footer() {
  return (
    <footer className="border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col gap-5 px-5 py-8 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p>
          © {new Date().getFullYear()} Aradea Atfal. Built with care and
          curiosity.
        </p>

        <div className="flex items-center gap-2">
          {socialLinks.map(({ label, href, icon: Icon }) => (
            <a
              key={label}
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              className="inline-flex size-9 items-center justify-center rounded-full transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
              aria-label={label}
            >
              <Icon aria-hidden="true" className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}
