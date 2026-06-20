export type MessageRole = "user" | "assistant";

export type MessageMetadata = Record<string, unknown>;

export interface Message {
  id: string;
  conversationId: string;
  role: MessageRole;
  content: string;
  metadata: MessageMetadata;
  createdAt: string;
}

export interface MessageRow {
  id: string;
  conversation_id: string;
  role: MessageRole;
  content: string;
  metadata: MessageMetadata;
  created_at: string;
}

export interface CreateMessageInput {
  conversationId: string;
  role: MessageRole;
  content: string;
  metadata?: MessageMetadata;
}

export interface ChatRequest {
  message: string;
  sessionId: string;
  conversationId?: string;
}

export interface ChatResponse {
  conversationId: string;
  message: Message;
}
