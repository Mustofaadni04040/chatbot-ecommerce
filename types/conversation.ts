import type { Message, MessageRow } from "./message";
import type { Product, ProductRow } from "./product";

export interface Conversation {
  id: string;
  userId: string | null;
  sessionId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ConversationRow {
  id: string;
  user_id: string | null;
  session_id: string;
  title: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateConversationInput {
  sessionId: string;
  userId?: string | null;
  title?: string | null;
}

export interface UpdateConversationInput {
  title?: string | null;
}

export interface ConversationWithMessages extends Conversation {
  messages: Message[];
}

export interface ConversationWithProducts extends Conversation {
  products: Product[];
}

export interface ConversationDetail extends Conversation {
  messages: Message[];
  products: Product[];
}

export interface ConversationDetailRow extends ConversationRow {
  messages?: MessageRow[];
  products?: ProductRow[];
}
