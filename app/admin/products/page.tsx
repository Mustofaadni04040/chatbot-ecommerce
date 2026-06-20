import Link from "next/link";

import { Button } from "@/components/ui/button";

import { getProducts } from "@/app/services/product.service";
import { ProductTable } from "@/components/product/product-table";

interface ProductsPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const { data: products, error } = await getProducts();
  // console.log(products, "products");

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Manajemen Produk
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Produk</h1>
        </div>

        <Button asChild>
          <Link href="/admin/products/new">Buat Produk</Link>
        </Button>
      </div>

      {params?.error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {params.error}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          Gagal memuat produk: {error.message}
        </div>
      ) : null}

      {!error && products.length === 0 ? (
        <div className="text-center">
          <h2 className="text-lg font-semibold">Belum ada produk</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Buat produk pertama Anda untuk memulai pembuatan katalog toko.
          </p>
        </div>
      ) : null}

      {!error && products.length > 0 && <ProductTable products={products} />}
    </section>
  );
}
