export type Role = 'company' | 'manager' | 'employee' | 'super_admin';


export interface Conversation {
id: string;
participants: string[];
companyId: string;
lastMessage?: string;
updatedAt: string;
}


export interface Message {
id: string;
conversationId: string;
senderId: string;
content: string;
type: 'text' | 'image' | 'file';
createdAt: string;
status?: 'sending' | 'sent' | 'delivered' | 'seen';
}