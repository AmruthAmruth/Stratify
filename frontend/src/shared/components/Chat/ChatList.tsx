import { RootState } from "@/store";
import { setActiveConversation } from "@/store/slices/chatSlice";
import React from "react";
import { useSelector, useDispatch } from "react-redux";

export const ChatList: React.FC = () => {
  const conversations = useSelector((state: RootState) => state.chat.conversations);
  const activeConversationId = useSelector((state: RootState) => state.chat.activeConversationId);
  const dispatch = useDispatch();

  return (
    <div className="chat-list">
      {conversations.map((convId) => (
        <div
          key={convId}
          className={`chat-item ${convId === activeConversationId ? "active" : ""}`}
          onClick={() => dispatch(setActiveConversation(convId))}
        >
          Conversation {convId}
        </div>
      ))}
    </div>
  );
};
