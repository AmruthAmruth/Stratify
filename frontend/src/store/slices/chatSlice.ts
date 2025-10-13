import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, Message } from '@/types/chat';

interface ChatState {
  conversations: Conversation[];                  // All conversations for the current user
  messages: Record<string, Message[]>;           // Messages keyed by conversationId
  activeConversationId: string | null;           // Currently selected conversation
}

const initialState: ChatState = {
  conversations: [],
  messages: {},
  activeConversationId: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Set all conversations for the current user
    setConversations(state, action: PayloadAction<Conversation[]>) {
      state.conversations = action.payload;
    },

    // Set messages for a specific conversation
    setMessages(
      state,
      action: PayloadAction<{ conversationId: string; messages: Message[] }>
    ) {
      state.messages[action.payload.conversationId] = action.payload.messages;
    },

    // Add a new message to a conversation
    addMessage(state, action: PayloadAction<Message>) {
      const convId = action.payload.conversationId;
      if (!state.messages[convId]) {
        state.messages[convId] = [];
      }
      state.messages[convId].push(action.payload);
    },

    // Set the currently active conversation
    setActiveConversation(state, action: PayloadAction<string>) {
      state.activeConversationId = action.payload;
    },

    // Optional: clear all chat data (logout)
    clearChat(state) {
      state.conversations = [];
      state.messages = {};
      state.activeConversationId = null;
    },
  },
});

export const {
  setConversations,
  setMessages,
  addMessage,
  setActiveConversation,
  clearChat,
} = chatSlice.actions;

export default chatSlice.reducer;
