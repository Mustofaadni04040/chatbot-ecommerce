export default function EditProductLoading() {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <div className="h-4 w-36 animate-pulse rounded bg-muted" />
        <div className="h-8 w-44 animate-pulse rounded bg-muted" />
      </div>

      <div className="space-y-5 rounded-2xl border bg-background p-6 shadow-sm">
        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-16 animate-pulse rounded bg-muted" />
          <div className="h-16 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-32 animate-pulse rounded bg-muted" />
        <div className="grid gap-5 md:grid-cols-2">
          <div className="h-16 animate-pulse rounded bg-muted" />
          <div className="h-16 animate-pulse rounded bg-muted" />
        </div>
      </div>
    </section>
  );
}
