export type ChatRole = "user" | "assistant";

export interface ChatMessage {
  content: string;
  role: ChatRole;
}

export interface ChatProduct {
  category: string;
  description: string;
  id: string;
  name: string;
  price: number;
  stock: number;
}

export interface Conversation {
  id: string;
  session_id: string;
  title: string | null;
  user_id: string | null;
}
