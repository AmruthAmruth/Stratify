import { createSelector } from "reselect";
import { RootState } from "@/store";

const selectChatState = (state: RootState) => state.chat;

export const selectMessages = createSelector(
  [selectChatState],
  (chat) => chat.messages
);

export const selectUnreadCounts = createSelector(
  [selectChatState],
  (chat) => chat.unreadCounts
);
