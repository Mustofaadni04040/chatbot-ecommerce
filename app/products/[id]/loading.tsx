export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f7f4ed]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
        <div className="h-5 w-36 animate-pulse rounded-full bg-[#d8d9d1]" />
        <div className="mt-7 overflow-hidden rounded-[2rem] border border-[#17211b]/10 bg-white lg:grid lg:grid-cols-[1.08fr_0.92fr]">
          <div className="aspect-[4/3] animate-pulse bg-[#e1e4dc] sm:aspect-[16/11] lg:aspect-auto lg:min-h-[620px]" />
          <div className="space-y-6 p-6 sm:p-10 lg:p-12">
            <div className="h-3 w-24 animate-pulse rounded-full bg-[#e1e4dc]" />
            <div className="space-y-3">
              <div className="h-10 w-5/6 animate-pulse rounded-full bg-[#e1e4dc]" />
              <div className="h-10 w-3/5 animate-pulse rounded-full bg-[#e1e4dc]" />
            </div>
            <div className="h-8 w-36 animate-pulse rounded-full bg-[#e1e4dc]" />
            <div className="h-px bg-[#17211b]/10" />
            <div className="space-y-3">
              <div className="h-4 w-full animate-pulse rounded-full bg-[#e1e4dc]" />
              <div className="h-4 w-full animate-pulse rounded-full bg-[#e1e4dc]" />
              <div className="h-4 w-3/4 animate-pulse rounded-full bg-[#e1e4dc]" />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
