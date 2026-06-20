import { Search, SlidersHorizontal, X } from "lucide-react";
import Link from "next/link";

interface ProductFiltersProps {
  categories: string[];
  query: string;
  selectedCategory: string;
}

export function ProductFilters({
  categories,
  query,
  selectedCategory,
}: ProductFiltersProps) {
  const hasFilters = Boolean(query || selectedCategory);

  return (
    <form
      action="/"
      method="get"
      className="mb-8 grid gap-3 rounded-3xl border border-[#173f35]/10 bg-white/80 p-4 sm:grid-cols-[minmax(0,1fr)_minmax(12rem,0.35fr)_auto] sm:p-5"
      role="search"
    >
      <div>
        <label htmlFor="product-search" className="sr-only">
          Cari berdasarkan nama atau deskripsi produk
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#718077]"
            aria-hidden="true"
          />
          <input
            id="product-search"
            name="q"
            type="search"
            defaultValue={query}
            placeholder="Cari nama atau deskripsi produk..."
            className="h-12 w-full rounded-2xl border border-[#173f35]/15 bg-white pl-11 pr-4 text-sm outline-none transition placeholder:text-[#8c978f] focus:border-[#173f35] focus:ring-3 focus:ring-[#173f35]/10"
          />
        </div>
      </div>

      <div>
        <label htmlFor="product-category" className="sr-only">
          Filter kategori
        </label>
        <div className="relative">
          <SlidersHorizontal
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-[#718077]"
            aria-hidden="true"
          />
          <select
            id="product-category"
            name="category"
            defaultValue={selectedCategory}
            className="h-12 w-full appearance-none rounded-2xl border border-[#173f35]/15 bg-white pl-11 pr-9 text-sm outline-none transition focus:border-[#173f35] focus:ring-3 focus:ring-[#173f35]/10"
          >
            <option value="">Semua kategori</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="submit"
          className="h-12 flex-1 rounded-2xl cursor-pointer bg-[#173f35] px-6 text-sm font-semibold text-white transition hover:bg-[#225346] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173f35] sm:flex-none"
        >
          Terapkan
        </button>
        {hasFilters && (
          <Link
            href="/"
            aria-label="Hapus pencarian dan filter"
            title="Hapus filter"
            className="flex size-12 items-center justify-center rounded-2xl border border-[#173f35]/15 bg-white text-[#526057] transition hover:border-[#173f35]/35 hover:text-[#173f35] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#173f35]"
          >
            <X className="size-4" aria-hidden="true" />
          </Link>
        )}
      </div>
    </form>
  );
}
