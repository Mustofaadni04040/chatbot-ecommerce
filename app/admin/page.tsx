import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">
        Admin Dashboard
      </p>
      <p className="mt-2 text-sm text-muted-foreground">
        Area admin untuk mengelola produk dan konten toko Anda.
      </p>
      <Button asChild className="mt-5">
        <Link href="/admin/products">Manage products</Link>
      </Button>
    </section>
  );
}
