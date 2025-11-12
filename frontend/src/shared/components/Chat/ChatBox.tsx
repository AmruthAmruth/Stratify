import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { getSocket } from "@/shared/socket/socket";
import { sendTheMessage } from "@/services/chat";
import { addMessage, clearChat } from "@/store/slices/chatSlice";

const ChatBox = ({ receiverId }: { receiverId: string }) => {
  const [message, setMessage] = useState("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const dispatch = useDispatch();

  // 👇 Listen for incoming messages via socket
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (msg: any) => {
      if (
        (msg.senderId === receiverId && msg.receiverId === userId) ||
        (msg.senderId === userId && msg.receiverId === receiverId)
      ) {
        dispatch(addMessage(msg));
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [receiverId, userId, dispatch]);

  // 👇 Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
    const socket = getSocket();
    if (socket && message.trim()) {
      const msg = {
        senderId: userId,
        receiverId,
        message,
        createdAt: new Date().toISOString(),
      };

      socket.emit("send-message", msg);
      sendTheMessage(msg); // persist to DB
      dispatch(addMessage(msg)); // instant local update
      setMessage("");
    }
  };

  // Filter messages for this chat only
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderId === receiverId && msg.receiverId === userId) ||
      (msg.senderId === userId && msg.receiverId === receiverId)
  );

  return (
    <div className="flex flex-col w-full max-w-md border rounded-lg p-4 bg-white shadow text-black">
      {/* Chat area */}
      <button onClick={()=>dispatch(clearChat())}>Clear Chat</button>
      <div className="flex-1 overflow-y-auto mb-4 space-y-3">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${
                msg.senderId === userId ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-2 px-4 rounded-2xl max-w-[75%] break-words ${
                  msg.senderId === userId
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                {msg.message}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-400 text-center">No messages yet</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex gap-2">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 border rounded-lg px-3 py-2 outline-none text-black"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
