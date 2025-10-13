import { Conversation } from '@/types/chat';
import api from './axiosInstance';
import { Message } from 'react-hook-form';


export const chatService = {
getConversations: async (userId: string): Promise<Conversation[]> => {
const res = await api.get(`/conversations/${userId}`);
return res.data;
},
getMessages: async (conversationId: string): Promise<Message[]> => {
const res = await api.get(`/messages/${conversationId}`);
return res.data;
},
};