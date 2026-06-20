/* eslint-disable @next/next/no-img-element */
import { ImageIcon } from "lucide-react";
import Link from "next/link";

import type { ProductRow } from "@/types/product";

interface PublicProductCardProps {
  product: ProductRow;
}

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export function ProductCard({ product }: PublicProductCardProps) {
  const inStock = product.stock > 0;

  return (
    <Link
      href={`/products/${product.id}`}
      className="group h-full overflow-hidden border-white/70 bg-white shadow-md transition-all duration-300 hover:shadow-lg hover:shadow-[#173f35]/20"
    >
      <article className="flex h-full flex-col">
        <div className="relative aspect-[4/3] overflow-hidden bg-[#e8e9e1]">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="size-full object-cover transition duration-500 group-hover:scale-[1.04]"
              loading="lazy"
            />
          ) : (
            <div className="flex size-full items-center justify-center text-[#8c978f]">
              <ImageIcon className="size-10" aria-hidden="true" />
              <span className="sr-only">Gambar produk tidak tersedia</span>
            </div>
          )}
          <span className="absolute left-4 top-4 rounded-full bg-[#f8f2e7]/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-[#315145] shadow-sm backdrop-blur">
            {product.category}
          </span>
        </div>

        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <h3 className="line-clamp-2 text-lg font-semibold leading-6 tracking-[-0.02em] transition-colors group-hover:text-[#a16620]">
            {product.name}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[#677168]">
            {product.description}
          </p>
          <div className="mt-auto flex items-end justify-between gap-3 border-t border-[#17211b]/10 pt-4">
            <p className="text-lg font-bold text-[#173f35]">
              {currencyFormatter.format(product.price)}
            </p>
            <p
              className={
                inStock
                  ? "text-xs font-medium text-[#537565]"
                  : "text-xs font-medium text-red-700"
              }
            >
              {inStock ? `Stok ${product.stock}` : "Stok habis"}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
