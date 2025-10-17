import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addMessage } from "@/store/slices/chatSlice";
import { getSocket } from "@/shared/services/socketService";
import { MessageItem } from "./MessageItem";
import { MessageInput } from "./MessageInput";

export const ChatRoom: React.FC = () => {
  const dispatch = useDispatch();
  const activeConversationId = useSelector((state: RootState) => state.chat.activeConversationId);
  const messages = useSelector((state: RootState) =>
    activeConversationId ? state.chat.messages[activeConversationId] || [] : []
  );
  const userId = useSelector((state: RootState) => state.auth.userId);

  useEffect(() => {
    const socket = getSocket();
    if (!socket || !activeConversationId) return;

    socket.emit("joinConversation", activeConversationId);

    const handleMessage = (msg: any) => {
      if (msg.conversationId === activeConversationId) dispatch(addMessage(msg));
    };

    socket.on("messageReceived", handleMessage);

    return () => {
      socket.off("messageReceived", handleMessage);
    };
  }, [dispatch, activeConversationId]);

  if (!activeConversationId) return <div>Select a conversation</div>;

  return (
    <div className="chat-room flex flex-col h-full">
      <div className="messages flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <MessageItem key={msg._id} content={msg.content} isMine={msg.senderId === userId} />
        ))}
      </div>
      <MessageInput />
    </div>
  );
};
