"use client";

import { createBrowserClient } from "@supabase/ssr";

import { supabaseConfig } from "./env";

export function createBrowserSupabaseClient() {
  return createBrowserClient(supabaseConfig.url, supabaseConfig.anonKey);
}
