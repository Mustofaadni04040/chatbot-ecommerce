import Link from "next/link";

import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProductRow } from "@/types";

import { deleteProduct } from "./actions";
import { DeleteProductButton } from "./delete-button";
import { getProducts } from "@/app/services/product.service";

interface ProductsPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

function formatPrice(price: number) {
  return new Intl.NumberFormat("id-ID", {
    currency: "IDR",
    style: "currency",
  }).format(price);
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const params = await searchParams;
  const { data: products, error } = await getProducts();
  console.log(products, "products");

  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Product Management
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">Products</h1>
        </div>

        <Button asChild>
          <Link href="/admin/products/new">Create product</Link>
        </Button>
      </div>

      {params?.error ? (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {params.error}
        </div>
      ) : null}

      {error ? (
        <div className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-sm text-destructive">
          Failed to load products: {error.message}
        </div>
      ) : null}

      {!error && products.length === 0 ? (
        <div className="text-center">
          <h2 className="text-lg font-semibold">No products yet</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Create your first product to start building the storefront catalog.
          </p>
        </div>
      ) : null}

      {!error && products.length > 0 ? (
        <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">Category</th>
                  <th className="px-4 py-3 font-medium">Price</th>
                  <th className="px-4 py-3 font-medium">Stock</th>
                  <th className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr className="border-b last:border-0" key={product.id}>
                    <td className="px-4 py-4">
                      <div className="font-medium">{product.name}</div>
                      <div className="mt-1 line-clamp-1 max-w-md text-muted-foreground">
                        {product.description}
                      </div>
                    </td>
                    <td className="px-4 py-4">{product.category}</td>
                    <td className="px-4 py-4">{formatPrice(product.price)}</td>
                    <td className="px-4 py-4">{product.stock}</td>
                    <td className="px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/products/${product.id}/edit`}>
                            Edit
                          </Link>
                        </Button>
                        <form action={deleteProduct}>
                          <input name="id" type="hidden" value={product.id} />
                          <DeleteProductButton />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
    </section>
  );
}
