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
    <div className="flex flex-col h-full bg-white border border-[#dfdcef] rounded-lg overflow-hidden shadow-sm">
      {/* Clear Chat Button */}
      <button 
        onClick={() => dispatch(clearChat())} 
        className="self-end p-2 text-sm text-[#3b3b3b]/70 hover:text-[#009063] transition-colors duration-200 mr-4 mt-2"
      >
        Clear Chat
      </button>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.length > 0 ? (
          filteredMessages.map((msg, index) => (
            <div
              key={`${msg.senderId}-${msg.createdAt}-${index}`}
              className={`flex ${
                msg.senderId === userId ? "justify-end" : "justify-start"
              } animate-in slide-in-from-bottom-2 duration-300 fade-in`}
            >
              <div
                className={`p-3 px-4 rounded-3xl max-w-[80%] transition-all duration-200 ${
                  msg.senderId === userId
                    ? "bg-[#009063] text-white shadow-lg hover:shadow-xl"
                    : "bg-[#fbfbfb] text-[#3b3b3b] border border-[#dfdcef]/30 shadow-sm hover:shadow-md"
                }`}
              >
                <p className="break-words">{msg.message}</p>
              </div>
            </div>
          ))
        ) : (
          <p className="text-[#3b3b3b]/40 text-center font-medium">No messages yet</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input area */}
      <div className="flex gap-2 p-4 border-t border-[#dfdcef] bg-[#fbfbfb]">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type a message..."
          className="flex-1 border border-[#dfdcef] rounded-2xl px-4 py-3 outline-none text-[#3b3b3b] bg-white placeholder:text-[#3b3b3b]/40 transition-all duration-200 focus:border-[#009063]/50 focus:shadow-sm"
        />
        <button
          onClick={sendMessage}
          disabled={!message.trim()}
          className="bg-[#009063] hover:bg-[#009063]/90 disabled:bg-[#009063]/50 disabled:cursor-not-allowed text-white px-6 py-3 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;