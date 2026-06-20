import { LogOut, ShieldCheck, Store } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import { logoutAdmin } from "@/app/login/actions";
import { AdminMobileDrawer } from "@/components/admin/admin-mobile-drawer";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  if (user.app_metadata?.role !== "admin") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-muted/30 md:flex">
      <aside className="sticky top-0 hidden h-screen w-68 shrink-0 flex-col border-r bg-background md:flex">
        <div className="flex h-20 items-center gap-3 border-b px-6">
          <Link
            href="/admin"
            className="flex items-center gap-3 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
          >
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Store className="size-5" aria-hidden="true" />
            </span>
            <div>
              <p className="font-semibold tracking-tight">AGIA Store</p>
              <p className="text-xs text-muted-foreground">Admin Panel</p>
            </div>
          </Link>
        </div>

        <div className="flex-1 py-5">
          <p className="mb-2 px-6 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            Menu
          </p>
          <AdminNavigation />
        </div>

        <div className="border-t p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-muted/60 p-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-background text-primary shadow-sm">
              <ShieldCheck className="size-4" aria-hidden="true" />
            </span>
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Administrator</p>
              <p className="truncate text-sm font-medium">{user.email}</p>
            </div>
          </div>
          <form action={logoutAdmin}>
            <Button type="submit" variant="outline" className="w-full">
              <LogOut aria-hidden="true" />
              Logout
            </Button>
          </form>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="border-b bg-background md:hidden">
          <div className="flex h-16 items-center gap-3 px-4">
            <AdminMobileDrawer email={user.email ?? "Administrator"} />
            <Link href="/admin" className="flex items-center gap-2.5">
              <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Store className="size-4" aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold">AGIA Store</p>
                <p className="max-w-40 truncate text-xs text-muted-foreground">
                  {user.email}
                </p>
              </div>
            </Link>
          </div>
        </header>

        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
}
