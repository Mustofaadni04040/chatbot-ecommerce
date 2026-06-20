import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";

import { ProductGrid } from "@/components/product/product-grid";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProductRow } from "@/types/product";

export const metadata: Metadata = {
  title: "Katalog Produk | AGIA Store",
  description: "Temukan produk pilihan yang tersedia di AGIA Store.",
};

export default async function Home() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, description, price, category, stock, image_url, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  const products = (data ?? []) as ProductRow[];

  return (
    <main className="min-h-screen bg-linear-to-b from-[#f2fff8] via-white to-[#fff7f1] text-[#17211b]">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a16620]">
              Katalog
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              Produk tersedia
            </h2>
          </div>
          {!error && products.length > 0 && (
            <p className="text-sm text-[#526057]">{products.length} produk</p>
          )}
        </div>

        {error ? (
          <div className="rounded-3xl border border-red-900/10 bg-white px-6 py-16 text-center shadow-sm">
            <PackageSearch
              className="mx-auto size-9 text-red-800/60"
              aria-hidden="true"
            />
            <h3 className="mt-4 text-lg font-semibold">
              Katalog belum dapat dimuat
            </h3>
            <p className="mt-2 text-sm text-[#677168]">
              Silakan coba muat ulang halaman ini.
            </p>
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>
    </main>
  );
}
