import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IMessage {
  senderId: string;
  receiverId?: string;
  message: string;
  createdAt: string;
}

interface ChatState {
  messages: IMessage[];
}

const initialState: ChatState = {
  messages: [],
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
  },
});

export const { addMessage, clearChat } = chatSlice.actions;
export default chatSlice.reducer;
