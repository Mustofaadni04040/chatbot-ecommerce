import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/server";

import { loginAdmin } from "./actions";
import { LoginSubmitButton } from "./submit-button";
import Link from "next/link";

interface LoginPageProps {
  searchParams?: Promise<{
    error?: string;
  }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user?.app_metadata?.role === "admin") {
    redirect("/admin");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border bg-background p-6 shadow-sm">
        <div className="mb-6 space-y-2">
          <p className="text-sm font-medium text-muted-foreground">
            Admin Dashboard
          </p>
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to continue
          </h1>
          <p className="text-sm text-muted-foreground">
            Use your Supabase Auth admin account.
          </p>
        </div>

        {params?.error ? (
          <div className="mb-4 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {params.error}
          </div>
        ) : null}

        <form action={loginAdmin} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="email">
              Email
            </label>
            <input
              autoComplete="email"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              id="email"
              name="email"
              placeholder="admin@example.com"
              required
              type="email"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium" htmlFor="password">
              Password
            </label>
            <input
              autoComplete="current-password"
              className="h-10 w-full rounded-md border bg-background px-3 text-sm outline-none transition focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
              id="password"
              name="password"
              placeholder="Your password"
              required
              type="password"
            />
          </div>

          <LoginSubmitButton />
        </form>

        <Button asChild className="mt-3 w-full" variant="ghost">
          <Link href="/">Back to storefront</Link>
        </Button>
      </section>
    </main>
  );
}
