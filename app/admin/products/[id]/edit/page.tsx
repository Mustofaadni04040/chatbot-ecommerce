import { notFound } from "next/navigation";

import { ProductForm } from "@/components/product/product-form";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ProductRow } from "@/types";

import { updateProduct } from "../../actions";

interface EditProductPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("products")
    .select(
      "id,name,description,price,category,stock,image_url,created_at,updated_at",
    )
    .eq("id", id)
    .single();

  if (error || !data) {
    notFound();
  }

  const updateProductById = updateProduct.bind(null, id);

  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Manajemen Produk
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Edit Produk</h1>
      </div>

      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        <ProductForm
          action={updateProductById}
          initialProduct={data as ProductRow}
          submitLabel="Update product"
        />
      </div>
    </section>
  );
}
