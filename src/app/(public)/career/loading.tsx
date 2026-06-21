export default function CareerLoading() {
  return (
    <main
      className="mx-auto max-w-6xl px-5 py-20 sm:px-6 sm:py-24 lg:px-8"
      aria-busy="true"
      aria-label="Loading career timeline"
    >
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-5 h-10 w-full max-w-md animate-pulse rounded-lg bg-muted" />
      <div className="mt-4 h-6 w-full max-w-2xl animate-pulse rounded bg-muted" />

      <div className="mt-14 space-y-8 lg:grid lg:grid-cols-2 lg:space-y-0 lg:gap-x-16 lg:gap-y-10">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-border bg-surface p-7"
          >
            <div className="h-6 w-24 animate-pulse rounded-full bg-muted" />
            <div className="mt-5 h-6 w-3/4 animate-pulse rounded bg-muted" />
            <div className="mt-3 h-5 w-1/2 animate-pulse rounded bg-muted" />
            <div className="mt-5 h-4 w-full animate-pulse rounded bg-muted" />
            <div className="mt-3 h-4 w-5/6 animate-pulse rounded bg-muted" />
          </div>
        ))}
      </div>
    </main>
  );
}
