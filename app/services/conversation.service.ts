import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { Conversation } from "@/types/chat";

export class ConversationAccessError extends Error {}

export async function getOrCreateConversation(
  sessionId: string,
  userId: string | null,
  firstMessage: string,
) {
  const supabase = createAdminSupabaseClient();
  const { data: existing, error: findError } = await supabase
    .from("conversations")
    .select("id, session_id, title, user_id")
    .eq("session_id", sessionId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (findError) {
    throw new Error(`Failed to find conversation: ${findError.message}`);
  }

  if (existing) {
    if (existing.user_id && existing.user_id !== userId) {
      throw new ConversationAccessError("Conversation does not belong to user");
    }

    if (!existing.user_id && userId) {
      const { data, error } = await supabase
        .from("conversations")
        .update({ user_id: userId })
        .eq("id", existing.id)
        .select("id, session_id, title, user_id")
        .single();

      if (error) {
        throw new Error(`Failed to claim conversation: ${error.message}`);
      }

      return data as Conversation;
    }

    return existing as Conversation;
  }

  const title = firstMessage.slice(0, 80);
  const { data, error } = await supabase
    .from("conversations")
    .insert({ session_id: sessionId, title, user_id: userId })
    .select("id, session_id, title, user_id")
    .single();

  if (error) {
    if (error.code === "23505") {
      return getOrCreateConversation(sessionId, userId, firstMessage);
    }

    throw new Error(`Failed to create conversation: ${error.message}`);
  }

  return data as Conversation;
}

export async function linkConversationProducts(
  conversationId: string,
  productIds: string[],
) {
  if (productIds.length === 0) return;

  const supabase = createAdminSupabaseClient();
  const rows = productIds.map((productId) => ({
    conversation_id: conversationId,
    product_id: productId,
  }));
  const { error } = await supabase
    .from("conversation_products")
    .upsert(rows, { onConflict: "conversation_id,product_id" });

  if (error) {
    throw new Error(`Failed to link products: ${error.message}`);
  }
}
