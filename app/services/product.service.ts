import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getProducts() {
  const supabase = await createServerSupabaseClient();

  const { data, error } = await supabase.from("products").select("*");

  //   console.log(data, "data");
  //   console.log(error, "error");

  return {
    data: data ?? [],
    error,
  };
}
