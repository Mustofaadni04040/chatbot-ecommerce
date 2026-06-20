import { LayoutDashboard, LogIn, LogOut } from "lucide-react";
import Link from "next/link";

import { logoutUser } from "@/app/login/actions";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function UserAccountActions() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <Button
        className="cursor-pointer bg-none"
        asChild
        size="sm"
        variant="outline"
      >
        <Link href="/login">Masuk</Link>
      </Button>
    );
  }

  if (user.app_metadata?.role === "admin") {
    return (
      <Button asChild size="sm" variant="outline">
        <Link href="/admin">
          <LayoutDashboard aria-hidden="true" />
          Dashboard
        </Link>
      </Button>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <p className="hidden max-w-52 truncate text-sm text-[#526057] sm:block">
        {user.email}
      </p>
      <form action={logoutUser}>
        <Button
          className="cursor-pointer bg-none"
          type="submit"
          size="sm"
          variant="outline"
        >
          Logout
        </Button>
      </form>
    </div>
  );
}
