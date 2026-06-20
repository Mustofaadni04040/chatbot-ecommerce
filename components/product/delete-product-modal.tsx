"use client";

import { useTransition } from "react";

import { ProductRow } from "@/types";
import { deleteProduct } from "@/app/admin/products/actions";

interface Props {
  product: ProductRow | null;
  open: boolean;
  onClose: () => void;
}

export function DeleteProductModal({ product, open, onClose }: Props) {
  const [isPending, startTransition] = useTransition();

  if (!open || !product) {
    return null;
  }

  const handleDelete = () => {
    const formData = new FormData();

    formData.append("id", product.id);

    startTransition(async () => {
      await deleteProduct(formData);
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-lg bg-background p-6">
        <h2 className="text-lg font-semibold">Hapus Produk</h2>

        <p className="mt-2 text-sm text-muted-foreground">
          Apakah Anda yakin ingin menghapus
          <strong> {product.name}</strong>?
        </p>

        <div className="mt-6 flex justify-end gap-2">
          <button onClick={onClose} disabled={isPending}>
            Batal
          </button>

          <button onClick={handleDelete} disabled={isPending}>
            {isPending ? "Menghapus..." : "Hapus"}
          </button>
        </div>
      </div>
    </div>
  );
}
