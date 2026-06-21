export default function ProjectsLoading() {
  return (
    <main
      className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8"
      aria-busy="true"
      aria-label="Loading projects"
    >
      <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-5 h-10 w-full max-w-lg animate-pulse rounded-lg bg-muted" />
      <div className="mt-4 h-6 w-full max-w-2xl animate-pulse rounded bg-muted" />

      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={index}
            className="overflow-hidden rounded-3xl border border-border bg-surface"
          >
            <div className="aspect-[16/10] animate-pulse bg-muted" />
            <div className="space-y-4 p-6">
              <div className="h-6 w-2/3 animate-pulse rounded bg-muted" />
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
              <div className="flex gap-2 pt-2">
                <div className="h-6 w-16 animate-pulse rounded-full bg-muted" />
                <div className="h-6 w-20 animate-pulse rounded-full bg-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
