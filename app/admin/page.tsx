import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function AdminPage() {
  return (
    <section className="rounded-2xl border bg-background p-6 shadow-sm">
      <p className="text-sm font-medium text-muted-foreground">
        Admin Dashboard
      </p>
      <h1 className="mt-2 text-2xl font-semibold tracking-tight">
        Protected admin area
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Authentication is active. Product and conversation management can be
        added here next.
      </p>
      <Button asChild className="mt-5">
        <Link href="/admin/products">Manage products</Link>
      </Button>
    </section>
  );
}
