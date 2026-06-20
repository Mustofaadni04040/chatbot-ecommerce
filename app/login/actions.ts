"use server";

import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function loginAdmin(formData: FormData) {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    redirect("/login?error=Email%20and%20password%20are%20required");
  }

  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    redirect("/login?error=Invalid%20email%20or%20password");
  }

  redirect(data.user.app_metadata?.role === "admin" ? "/admin" : "/");
}

export async function logoutAdmin() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();

  redirect("/login");
}

export async function logoutUser() {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.signOut();

  redirect("/");
}
