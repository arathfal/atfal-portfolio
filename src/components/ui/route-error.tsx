"use client";

import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export function RouteError({
  error,
  reset,
  title = "Something went sideways.",
}: {
  error: Error & { digest?: string };
  reset: () => void;
  title?: string;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[65svh] max-w-6xl items-center justify-center px-5 py-20 sm:px-6 lg:px-8">
      <div className="max-w-lg rounded-3xl border border-border bg-surface p-8 text-center sm:p-10">
        <AlertTriangle
          aria-hidden="true"
          className="mx-auto size-10 text-primary"
        />
        <h1 className="mt-5 text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-3 leading-7 text-muted-foreground">
          The page could not load its data. Please try once more.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-7 inline-flex h-11 items-center justify-center gap-2 rounded-full bg-primary px-5 font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
        >
          <RotateCcw aria-hidden="true" className="size-4" />
          Try again
        </button>
      </div>
    </main>
  );
}
