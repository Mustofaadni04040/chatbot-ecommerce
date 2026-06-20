import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { ChatMessage, ChatRole } from "@/types/chat";

interface CreateMessageInput {
  content: string;
  conversationId: string;
  metadata?: Record<string, unknown>;
  role: ChatRole;
}

export async function createMessage({
  content,
  conversationId,
  metadata = {},
  role,
}: CreateMessageInput) {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("messages")
    .insert({
      content,
      conversation_id: conversationId,
      metadata,
      role,
    })
    .select("id, conversation_id, role, content, metadata, created_at")
    .single();

  if (error) {
    throw new Error(`Failed to save message: ${error.message}`);
  }

  return data;
}

export async function getRecentMessages(
  conversationId: string,
  limit = 12,
): Promise<ChatMessage[]> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("messages")
    .select("role, content")
    .eq("conversation_id", conversationId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    throw new Error(`Failed to load messages: ${error.message}`);
  }

  return (data ?? []).reverse() as ChatMessage[];
}
