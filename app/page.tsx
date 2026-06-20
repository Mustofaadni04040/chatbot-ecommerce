import type { Metadata } from "next";
import { PackageSearch } from "lucide-react";

import { UserAccountActions } from "@/components/auth/user-account-actions";
import { ProductFilters } from "@/components/product/product-filters";
import { ProductGrid } from "@/components/product/product-grid";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProductRow } from "@/types/product";

interface HomeProps {
  searchParams: Promise<{
    category?: string | string[];
    q?: string | string[];
  }>;
}

function getSearchParam(value: string | string[] | undefined) {
  return typeof value === "string" ? value.trim().slice(0, 100) : "";
}

function getSafeSearchTerm(value: string) {
  return value.replace(/[\\"(),.]/g, " ").replace(/\s+/g, " ").trim();
}

export async function generateMetadata({
  searchParams,
}: HomeProps): Promise<Metadata> {
  const params = await searchParams;
  const query = getSearchParam(params.q);
  const category = getSearchParam(params.category);
  const context = query
    ? `Hasil pencarian "${query}"`
    : category
      ? `Produk kategori ${category}`
      : "Katalog Produk";

  return {
    title: `${context} | AGIA Store`,
    description: query
      ? `Temukan produk AGIA Store yang sesuai dengan pencarian ${query}.`
      : "Temukan produk pilihan yang tersedia di AGIA Store.",
  };
}

export default async function Home({ searchParams }: HomeProps) {
  const params = await searchParams;
  const query = getSearchParam(params.q);
  const category = getSearchParam(params.category);
  const safeSearchTerm = getSafeSearchTerm(query);
  const supabase = await createServerSupabaseClient();
  const categoriesRequest = supabase
    .from("products")
    .select("category")
    .order("category");
  let productsRequest = supabase
    .from("products")
    .select(
      "id, name, description, price, category, stock, image_url, created_at, updated_at",
    )
    .order("created_at", { ascending: false });

  if (safeSearchTerm) {
    productsRequest = productsRequest.or(
      `name.ilike.%${safeSearchTerm}%,description.ilike.%${safeSearchTerm}%`,
    );
  }

  if (category) {
    productsRequest = productsRequest.eq("category", category);
  }

  const [{ data, error }, { data: categoryRows }] = await Promise.all([
    productsRequest,
    categoriesRequest,
  ]);

  const products = (data ?? []) as ProductRow[];
  const categories = Array.from(
    new Set(
      (categoryRows ?? [])
        .map((row) => row.category)
        .filter((value): value is string => Boolean(value)),
    ),
  );
  const hasFilters = Boolean(query || category);

  return (
    <main className="min-h-screen bg-linear-to-b from-[#f2fff8] via-white to-[#fff7f1] text-[#17211b]">
      <section className="mx-auto max-w-7xl px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <div className="mb-6 flex justify-end">
          <UserAccountActions />
        </div>
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a16620]">
              Katalog
            </p>
            <h1 className="mt-2 text-2xl font-semibold tracking-[-0.03em] sm:text-3xl">
              {hasFilters ? "Hasil pencarian produk" : "Produk tersedia"}
            </h1>
          </div>
          {!error && products.length > 0 && (
            <p className="text-sm text-[#526057]">{products.length} produk</p>
          )}
        </div>

        <ProductFilters
          categories={categories}
          query={query}
          selectedCategory={category}
        />

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
          <ProductGrid products={products} hasFilters={hasFilters} />
        )}
      </section>
    </main>
  );
}
