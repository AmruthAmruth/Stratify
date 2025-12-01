import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IMessage {
  senderId: string;
  receiverId?: string;
  message: string;
  isRead?: boolean;
  messageType?: string;
  fileUrl?: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  createdAt: string;
}

interface ChatState {
  messages: IMessage[];
  unreadCounts: Record<string, number>;
}

const initialState: ChatState = {
  messages: [],
  unreadCounts: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<IMessage>) => {
      state.messages.push(action.payload);
    },
    clearChat: (state) => {
      state.messages = [];
    },
    setUnreadCounts: (state, action: PayloadAction<Record<string, number>>) => {
      state.unreadCounts = action.payload;
    },
    updateUnreadCount: (state, action: PayloadAction<{ senderId: string; count: number }>) => {
      state.unreadCounts[action.payload.senderId] = action.payload.count;
    },
    clearUnreadCount: (state, action: PayloadAction<string>) => {
      delete state.unreadCounts[action.payload];
    },
  },
});

export const { addMessage, clearChat, setUnreadCounts, updateUnreadCount, clearUnreadCount } = chatSlice.actions;
export default chatSlice.reducer;
