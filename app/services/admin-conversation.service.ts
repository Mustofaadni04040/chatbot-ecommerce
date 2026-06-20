import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { ConversationRow } from "@/types/conversation";
import type { MessageRow } from "@/types/message";

interface ConversationCountRow extends ConversationRow {
  messages: Array<{ count: number }>;
}

export interface ConversationSummary extends ConversationRow {
  message_count: number;
}

interface GetConversationsOptions {
  page: number;
  pageSize: number;
  search?: string;
}

function sanitizeSearch(value: string) {
  return value.replace(/[\\"(),.]/g, " ").replace(/\s+/g, " ").trim();
}

export async function getAdminConversations({
  page,
  pageSize,
  search = "",
}: GetConversationsOptions) {
  const supabase = await createServerSupabaseClient();
  const offset = (page - 1) * pageSize;
  const safeSearch = sanitizeSearch(search);
  let messageConversationIds: string[] = [];

  if (safeSearch) {
    const { data: messageMatches, error: messageSearchError } = await supabase
      .from("messages")
      .select("conversation_id")
      .ilike("content", `%${safeSearch}%`)
      .limit(100);

    if (messageSearchError) {
      throw new Error(`Gagal mencari isi pesan: ${messageSearchError.message}`);
    }

    messageConversationIds = Array.from(
      new Set((messageMatches ?? []).map((message) => message.conversation_id)),
    );
  }

  let query = supabase
    .from("conversations")
    .select(
      "id, user_id, session_id, title, created_at, updated_at, messages(count)",
      { count: "exact" },
    )
    .order("updated_at", { ascending: false })
    .range(offset, offset + pageSize - 1);

  if (safeSearch) {
    const filters = [
      `title.ilike.%${safeSearch}%`,
      `session_id.ilike.%${safeSearch}%`,
    ];

    if (messageConversationIds.length > 0) {
      filters.push(`id.in.(${messageConversationIds.join(",")})`);
    }

    query = query.or(filters.join(","));
  }

  const { data, error, count } = await query;

  if (error) {
    throw new Error(`Gagal memuat percakapan: ${error.message}`);
  }

  const rows = (data ?? []) as ConversationCountRow[];
  const conversations: ConversationSummary[] = rows.map(
    ({ messages, ...conversation }) => ({
      ...conversation,
      message_count: messages[0]?.count ?? 0,
    }),
  );

  return { conversations, total: count ?? 0 };
}

export async function getAdminConversationDetail(id: string) {
  const supabase = await createServerSupabaseClient();
  const [conversationResult, messagesResult] = await Promise.all([
    supabase
      .from("conversations")
      .select("id, user_id, session_id, title, created_at, updated_at")
      .eq("id", id)
      .maybeSingle(),
    supabase
      .from("messages")
      .select("id, conversation_id, role, content, metadata, created_at")
      .eq("conversation_id", id)
      .order("created_at", { ascending: true }),
  ]);

  if (conversationResult.error) {
    throw new Error(
      `Gagal memuat percakapan: ${conversationResult.error.message}`,
    );
  }

  if (messagesResult.error) {
    throw new Error(`Gagal memuat pesan: ${messagesResult.error.message}`);
  }

  if (!conversationResult.data) return null;

  return {
    conversation: conversationResult.data as ConversationRow,
    messages: (messagesResult.data ?? []) as MessageRow[],
  };
}
