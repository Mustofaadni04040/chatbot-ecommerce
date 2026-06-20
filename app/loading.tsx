import { ProductSkeleton } from "@/components/product/product-skeleton";

export default function Loading() {
  return (
    <main className="min-h-screen bg-linear-to-b from-[#f2fff8] via-white to-[#fff7f1]">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mb-8 space-y-3">
          <div className="h-3 w-20 animate-pulse rounded-full bg-[#d8d9d1]" />
          <div className="h-8 w-52 animate-pulse rounded-full bg-[#d8d9d1]" />
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      </section>
    </main>
  );
}
