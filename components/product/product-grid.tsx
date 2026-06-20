import { PackageOpen } from "lucide-react";

import type { ProductRow } from "@/types/product";
import { ProductCard } from "./product-card";

interface PublicProductGridProps {
  hasFilters?: boolean;
  products: ProductRow[];
}

export function ProductGrid({
  hasFilters = false,
  products,
}: PublicProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-[#173f35]/25 bg-white/60 px-6 py-16 text-center">
        <PackageOpen
          className="mx-auto size-10 text-[#718077]"
          aria-hidden="true"
        />
        <h2 className="mt-4 text-lg font-semibold">
          {hasFilters ? "Produk tidak ditemukan" : "Belum ada produk"}
        </h2>
        <p className="mt-2 text-sm text-[#677168]">
          {hasFilters
            ? "Coba gunakan kata kunci atau kategori yang berbeda."
            : "Produk baru akan tampil di sini setelah tersedia."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
