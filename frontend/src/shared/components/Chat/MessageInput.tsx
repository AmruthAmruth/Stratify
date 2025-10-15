import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { addMessage } from "@/store/slices/chatSlice";
import { getSocket } from "../../services/socketService";

export const MessageInput: React.FC = () => {
  const [text, setText] = useState("");
  const dispatch = useDispatch();
  const activeConversationId = useSelector((state: RootState) => state.chat.activeConversationId);
  const userId = useSelector((state: RootState) => state.auth.userId);

  const handleSend = () => {
    if (!text.trim() || !activeConversationId) return;
    const socket = getSocket();
    if (!socket) return;

    const receiverId = activeConversationId.split("_").find((id) => id !== userId);
    if (!receiverId) return;

    const message = {
      _id: `${Date.now()}`,
      content: text,
      senderId: userId,
      receiverId,
      conversationId: activeConversationId,
      type: "text",
      createdAt: new Date().toISOString(),
    };

    dispatch(addMessage(message));
    socket.emit("sendMessage", message);
    setText("");
  };

  return (
    <div className="message-input flex items-center gap-2 mt-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        placeholder="Type a message..."
        className="flex-1 border border-gray-400 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button onClick={handleSend} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
        Send
      </button>
    </div>
  );
};
