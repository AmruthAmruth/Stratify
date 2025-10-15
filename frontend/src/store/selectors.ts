import { createSelector } from "reselect";
import { RootState } from "@/store";

const selectChatState = (state: RootState) => state.chat;

export const selectActiveConversationId = createSelector(
  [selectChatState],
  (chat) => chat.activeConversationId
);

export const selectActiveMessages = createSelector(
  [selectChatState],
  (chat) => {
    const id = chat.activeConversationId;
    if (!id) return [];
    return chat.messages[id] || [];
  }
);

