import { createClient } from "@supabase/supabase-js";

import { supabaseConfig } from "./env";

function getJwtRole(key: string) {
  if (!key.startsWith("eyJ")) return null;

  try {
    const payload = key.split(".")[1];
    const decoded = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as { role?: string };

    return decoded.role ?? null;
  } catch {
    return null;
  }
}

export function createAdminSupabaseClient() {
  const serviceRoleKey =
    process.env.SUPABASE_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "Missing env: SUPABASE_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY",
    );
  }

  const jwtRole = getJwtRole(serviceRoleKey);
  const isPublishableKey = serviceRoleKey.startsWith("sb_publishable_");

  if (jwtRole === "anon" || isPublishableKey) {
    throw new Error(
      "Supabase server key is an anon/publishable key. Use a secret key or service_role key so the server can store guest conversations without exposing them through RLS policies.",
    );
  }

  return createClient(supabaseConfig.url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
