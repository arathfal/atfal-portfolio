import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
  level?: "h1" | "h2";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  level = "h2",
  className,
}: SectionHeadingProps) {
  const Heading = level;

  return (
    <div className={cn("max-w-2xl", className)}>
      <p className="mb-3 font-mono text-sm font-semibold tracking-[0.2em] text-primary uppercase">
        {eyebrow}
      </p>
      <Heading className="text-3xl font-bold tracking-tight text-balance sm:text-4xl">
        {title}
      </Heading>
      {description && (
        <p className="mt-4 leading-7 text-pretty text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}
