import api from "./axiosInstance";

export const chatService = {
  async getConversations(userId: string) {
    const res = await api.get(`/api/conversations/${userId}`, { withCredentials: true });
    return res.data;
  },

  async getMessages(conversationId: string) {
    const res = await api.get(`/api/messages/${conversationId}`, { withCredentials: true });
    return res.data;
  },
};