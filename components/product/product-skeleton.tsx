export function ProductSkeleton() {
  return (
    <div className="overflow-hidden rounded-3xl border border-[#17211b]/10 bg-white">
      <div className="aspect-[4/3] animate-pulse bg-[#e1e4dc]" />
      <div className="space-y-5 p-5 sm:p-6">
        <div className="space-y-2">
          <div className="h-5 w-4/5 animate-pulse bg-[#e1e4dc]" />
          <div className="h-5 w-2/5 animate-pulse bg-[#e1e4dc]" />
        </div>
        <div className="flex justify-between border-t border-[#17211b]/10 pt-4">
          <div className="h-5 w-24 animate-pulse bg-[#e1e4dc]" />
          <div className="h-4 w-14 animate-pulse bg-[#e1e4dc]" />
        </div>
      </div>
    </div>
  );
}
