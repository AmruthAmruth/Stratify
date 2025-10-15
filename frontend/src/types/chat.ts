export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: "text" | "image" | "file";
  createdAt: string; // use ISO string
}

export interface Conversation {
  id: string;
  name: string;
  members: string[];
  lastMessage?: string;
}