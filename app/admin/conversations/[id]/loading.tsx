export default function ConversationDetailLoading() {
  return (
    <section className="space-y-6" aria-busy="true" aria-label="Memuat detail percakapan">
      <div className="h-8 w-44 animate-pulse rounded bg-muted" />
      <div className="h-44 animate-pulse rounded-2xl bg-muted" />
      <div className="space-y-4 rounded-2xl border p-6">
        {["w-3/5", "w-2/3", "w-1/2", "w-3/4"].map((width, index) => (
          <div
            key={`${width}-${index}`}
            className={`h-16 ${width} animate-pulse rounded-2xl bg-muted`}
          />
        ))}
      </div>
    </section>
  );
}
