import { ProductForm } from "@/components/product/product-form";

import { createProduct } from "../actions";

export default function NewProductPage() {
  return (
    <section className="space-y-6">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Manajemen Produk
        </p>
        <h1 className="text-2xl font-semibold tracking-tight">Buat Produk</h1>
      </div>

      <div className="rounded-2xl border bg-background p-6 shadow-sm">
        <ProductForm action={createProduct} submitLabel="Buat produk" />
      </div>
    </section>
  );
}
