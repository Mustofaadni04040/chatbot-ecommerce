"use client";

import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { ProductRow } from "@/types";

import { DeleteProductModal } from "./delete-product-modal";
import { formatCurrency } from "@/lib/utils/currency";

interface Props {
  products: ProductRow[];
}

export function ProductTable({ products }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(
    null,
  );

  return (
    <>
      <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="border-b bg-muted/50 text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Produk</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Harga</th>
                <th className="px-4 py-3 font-medium">Stok</th>
                <th className="px-4 py-3 text-right font-medium">Aksi</th>
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
                  <td>{formatCurrency(Number(product.price))}</td>
                  <td className="px-4 py-4">{product.stock}</td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/products/${product.id}/edit`}>
                          Edit
                        </Link>
                      </Button>
                      <Button
                        className="cursor-pointer"
                        size="sm"
                        variant="destructive"
                        onClick={() => setSelectedProduct(product)}
                      >
                        Hapus
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteProductModal
        product={selectedProduct}
        open={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />
    </>
  );
}
