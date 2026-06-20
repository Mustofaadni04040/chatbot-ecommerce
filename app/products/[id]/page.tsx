/* eslint-disable @next/next/no-img-element */
import { ArrowLeft, PackageCheck, PackageX } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProductRow } from "@/types/product";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const currencyFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  if (!uuidPattern.test(id)) {
    notFound();
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id, name, description, price, category, stock, image_url, created_at, updated_at",
    )
    .eq("id", id)
    .maybeSingle();

  if (!data) {
    if (error) {
      throw new Error("Gagal memuat detail produk.");
    }

    notFound();
  }

  const product = data as ProductRow;
  const inStock = product.stock > 0;

  return (
    <main className="min-h-screen bg-linear-to-b from-[#f2fff8] via-white to-[#fff7f1] text-[#17211b]">
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-12 lg:px-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#526057] transition hover:text-[#173f35] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#173f35]"
        >
          <ArrowLeft className="size-4" aria-hidden="true" />
          Kembali ke katalog
        </Link>

        <article className="mt-7 overflow-hidden rounded-[2rem] border border-[#17211b]/10 bg-white shadow-[0_20px_60px_rgba(35,48,40,0.08)] lg:grid lg:grid-cols-[1.08fr_0.92fr]">
          <div className="aspect-[4/3] overflow-hidden bg-[#e8e9e1] sm:aspect-[16/11] lg:aspect-auto lg:min-h-[620px]">
            <img
              src={
                product.image_url
                  ? product.image_url
                  : "/product-placeholder.jpg"
              }
              alt={product.name}
              className="size-full min-h-72 object-cover"
            />
          </div>

          <div className="flex flex-col p-6 sm:p-10 lg:p-12">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#a16620]">
              {product.category}
            </p>
            <h1 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              {product.name}
            </h1>
            <p className="mt-5 text-2xl font-bold tracking-[-0.02em] text-[#173f35] sm:text-3xl">
              {currencyFormatter.format(product.price)}
            </p>

            <div className="my-8 h-px bg-[#17211b]/10" />

            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-[#526057]">
              Deskripsi
            </h2>
            <p className="mt-3 whitespace-pre-line text-base leading-8 text-[#526057]">
              {product.description}
            </p>

            <div className="mt-auto pt-10">
              <div
                className={`flex items-center gap-3 rounded-2xl px-4 py-3 ${
                  inStock
                    ? "bg-[#eaf1e9] text-[#315a47]"
                    : "bg-red-50 text-red-800"
                }`}
              >
                {inStock ? (
                  <PackageCheck className="size-5" aria-hidden="true" />
                ) : (
                  <PackageX className="size-5" aria-hidden="true" />
                )}
                <p className="text-sm font-semibold">
                  {inStock
                    ? `${product.stock} produk tersedia`
                    : "Stok produk habis"}
                </p>
              </div>
            </div>
          </div>
        </article>
      </div>
    </main>
  );
}
