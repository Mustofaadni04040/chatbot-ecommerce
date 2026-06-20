"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createServerSupabaseClient } from "@/lib/supabase/server";
import { parseProductFormData } from "@/validations/product";

export interface ProductFormState {
  message?: string;
  errors?: Record<string, string[] | undefined>;
}

function toProductPayload(formData: FormData) {
  const parsed = parseProductFormData(formData);

  if (!parsed.success) {
    return {
      data: null,
      errors: parsed.error.flatten().fieldErrors,
    };
  }

  return {
    data: {
      ...parsed.data,
      image_url: parsed.data.image_url || null,
    },
    errors: null,
  };
}

export async function createProduct(
  _state: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const payload = toProductPayload(formData);

  if (payload.errors) {
    return {
      message: "Please fix the highlighted fields.",
      errors: payload.errors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("products").insert(payload.data);

  if (error) {
    return {
      message: error.message,
    };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateProduct(
  id: string,
  _state: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const payload = toProductPayload(formData);

  if (payload.errors) {
    return {
      message: "Please fix the highlighted fields.",
      errors: payload.errors,
    };
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase
    .from("products")
    .update(payload.data)
    .eq("id", id);

  if (error) {
    return {
      message: error.message,
    };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteProduct(formData: FormData) {
  const id = String(formData.get("id") ?? "");

  if (!id) {
    redirect("/admin/products?error=Product%20id%20is%20required");
  }

  const supabase = await createServerSupabaseClient();
  const { error } = await supabase.from("products").delete().eq("id", id);

  if (error) {
    redirect(`/admin/products?error=${encodeURIComponent(error.message)}`);
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}
