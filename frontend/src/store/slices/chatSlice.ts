import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Message {
  _id: string;
  conversationId: string;
  senderId: string;
  receiverId?: string;
  content: string;
  type: "text" | "image" | "file";
  createdAt?: string;
}

interface ChatState {
  conversations: string[];
  activeConversationId: string | null;
  activeReceiverId: string | null;
  messages: Record<string, Message[]>;
}

const initialState: ChatState = {
  conversations: [],
  activeConversationId: null,
  activeReceiverId: null,
  messages: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveConversation(
      state,
      action: PayloadAction<string | { conversationId: string; receiverId?: string }>
    ) {
      if (typeof action.payload === "string") {
        state.activeConversationId = action.payload;
        const ids = action.payload.split("_");
        state.activeReceiverId = ids[0] !== state.activeReceiverId ? ids[0] : ids[1];
      } else {
        state.activeConversationId = action.payload.conversationId;
        state.activeReceiverId = action.payload.receiverId || null;
      }
      if (state.activeConversationId && !state.conversations.includes(state.activeConversationId)) {
        state.conversations.push(state.activeConversationId);
      }
    },

    addMessage(state, action: PayloadAction<Message>) {
      const convId = action.payload.conversationId;
      if (!convId) return;

      if (!state.messages[convId]) {
        state.messages[convId] = [];
      }

      const exists = state.messages[convId].some((msg) => msg._id === action.payload._id);
      if (!exists) state.messages[convId].push(action.payload);

      if (!state.conversations.includes(convId)) state.conversations.push(convId);
    },
  },
});

export const { setActiveConversation, addMessage } = chatSlice.actions;
export default chatSlice.reducer;
