export default function ProductsLoading() {
  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 w-36 animate-pulse rounded bg-muted" />
          <div className="h-8 w-44 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-10 w-32 animate-pulse rounded bg-muted" />
      </div>

      <div className="rounded-2xl border bg-background p-4 shadow-sm">
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              className="h-14 animate-pulse rounded-lg bg-muted"
              key={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
