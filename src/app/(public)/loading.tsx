export default function HomeLoading() {
  return (
    <main
      className="mx-auto flex min-h-[calc(100svh-4rem)] max-w-6xl items-center px-5 py-20 sm:px-6 lg:px-8"
      aria-busy="true"
      aria-label="Loading home page"
    >
      <div className="w-full max-w-4xl">
        <div className="h-8 w-64 animate-pulse rounded-full bg-muted" />
        <div className="mt-8 h-16 w-full animate-pulse rounded-xl bg-muted sm:h-20" />
        <div className="mt-4 h-16 w-4/5 animate-pulse rounded-xl bg-muted sm:h-20" />
        <div className="mt-8 h-6 w-full max-w-2xl animate-pulse rounded bg-muted" />
        <div className="mt-3 h-6 w-3/4 max-w-xl animate-pulse rounded bg-muted" />
        <div className="mt-10 flex gap-3">
          <div className="h-12 w-40 animate-pulse rounded-full bg-muted" />
          <div className="h-12 w-44 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    </main>
  );
}
