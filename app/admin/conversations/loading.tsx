export default function ConversationsLoading() {
  return (
    <section className="space-y-6" aria-busy="true" aria-label="Memuat percakapan">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <div className="h-4 w-24 animate-pulse rounded bg-muted" />
          <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        </div>
        <div className="h-4 w-32 animate-pulse rounded bg-muted" />
      </div>
      <div className="h-10 max-w-xl animate-pulse rounded-md bg-muted" />
      <div className="overflow-hidden rounded-2xl border bg-background">
        <div className="h-12 animate-pulse border-b bg-muted/60" />
        {Array.from({ length: 6 }, (_, index) => (
          <div
            key={index}
            className="grid h-16 animate-pulse grid-cols-4 gap-6 border-b px-4 py-4 last:border-0"
          >
            <div className="rounded bg-muted" />
            <div className="rounded bg-muted" />
            <div className="rounded bg-muted" />
            <div className="rounded bg-muted" />
          </div>
        ))}
      </div>
    </section>
  );
}
