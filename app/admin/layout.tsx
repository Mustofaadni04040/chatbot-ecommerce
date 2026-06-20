import { redirect } from "next/navigation";

import { logoutAdmin } from "@/app/login/actions";
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
    redirect("/login?error=Admin%20access%20required");
  }

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div>
            <p className="text-sm text-muted-foreground">Login sebagai</p>
            <p className="font-medium">{user.email}</p>
          </div>

          <form action={logoutAdmin}>
            <Button type="submit" variant="outline">
              Logout
            </Button>
          </form>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
    </div>
  );
}
