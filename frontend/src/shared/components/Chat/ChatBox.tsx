import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { getSocket } from "@/shared/socket/socket";
import { sendTheMessage } from "@/services/chat";
import { addMessage, clearChat } from "@/store/slices/chatSlice";
import { formatMessageTime } from "@/utils/dateUtils";
import { Paperclip, X } from "lucide-react";
import MediaMessage from "./MediaMessage";

interface ChatBoxProps {
  receiverId: string;
  initialMessages?: any[];
  loading?: boolean;
}

const ChatBox = ({
  receiverId,
  initialMessages = [],
  loading = false,
}: ChatBoxProps) => {
  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const messages = useSelector((state: RootState) => state.chat.messages);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const dispatch = useDispatch();

  // ✅ Reset chat when new receiver is selected and load initial messages
  useEffect(() => {
    dispatch(clearChat());
    console.log("Loading initial messages for receiverId:", receiverId, "Messages:", initialMessages);
    if (initialMessages && initialMessages.length > 0) {
      initialMessages.forEach((msg) => dispatch(addMessage(msg)));
    }
  }, [receiverId, dispatch]); // Removed initialMessages from deps to prevent unnecessary clearing

  // ✅ Update messages when initialMessages changes (without clearing)
  useEffect(() => {
    if (initialMessages && initialMessages.length > 0 && messages.length === 0) {
      console.log("Updating messages from initialMessages:", initialMessages);
      initialMessages.forEach((msg) => dispatch(addMessage(msg)));
    }
  }, [initialMessages, dispatch, messages.length]);

  // ✅ Listen for incoming socket messages
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (msg: any) => {
      console.log("📨 ChatBox received message:", msg);
      console.log("Current chat - userId:", userId, "receiverId:", receiverId);

      // Check if this message belongs to the current conversation
      const isMessageForThisChat =
        (msg.senderId === receiverId && msg.receiverId === userId) ||
        (msg.senderId === userId && msg.receiverId === receiverId);

      console.log("Is message for this chat?", isMessageForThisChat);

      if (isMessageForThisChat) {
        // Check if message already exists in store (to prevent duplicates)
        // Match by: exact same sender, receiver, message content, and timestamp within 2 seconds
        const messageExists = messages.some((m) => {
          const isSameSender = m.senderId === msg.senderId;
          const isSameReceiver = m.receiverId === msg.receiverId;
          const isSameMessage = m.message === msg.message;
          const timeDiff = Math.abs(new Date(m.createdAt).getTime() - new Date(msg.createdAt).getTime());
          const isWithinTimeWindow = timeDiff < 2000; // 2 seconds

          return isSameSender && isSameReceiver && isSameMessage && isWithinTimeWindow;
        });

        if (!messageExists) {
          console.log("✅ Adding message to ChatBox");
          dispatch(addMessage(msg));
        } else {
          console.log("⚠️ Message already exists, skipping duplicate");
        }
      } else {
        console.log("❌ Message not for this chat, ignoring");
      }
    };

    socket.on("receive-message", handleReceiveMessage);

    // Only remove THIS specific listener on cleanup
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [receiverId, userId, dispatch, messages]);

  // ✅ Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ✅ Send message
  const sendMessage = async () => {
    const socket = getSocket();
    if (!socket || (!message.trim() && !selectedFile) || !userId) return;

    setIsUploading(true);
    try {
      // Create temporary ID for the message
      const tempId = `temp-${Date.now()}-${Math.random()}`;

      const msg = {
        id: tempId,
        senderId: userId,
        receiverId,
        message: message.trim(),
        createdAt: new Date().toISOString(),
        messageType: selectedFile ?
          (selectedFile.type.startsWith('image/') ? 'image' :
            selectedFile.type.startsWith('video/') ? 'video' :
              selectedFile.type.startsWith('audio/') ? 'audio' : 'document') : 'text',
        fileUrl: filePreview || undefined,
      };

      // Immediately add message to Redux store for instant UI update
      dispatch(addMessage(msg));

      // Emit to socket and save in DB
      socket.emit("send-message", msg);
      const savedMessage = await sendTheMessage(msg, selectedFile || undefined);

      // Remove temp message and add the real one with database ID
      if (savedMessage && savedMessage.savedChat) {
        // The saved message will have the real database ID
        // We'll replace the temp message when we receive it via socket or from the response
        console.log("Message saved to database:", savedMessage.savedChat);
      }

      setMessage("");
      setSelectedFile(null);
      setFilePreview(null);
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      alert("File size must be less than 50MB");
      return;
    }

    setSelectedFile(file);

    // Generate preview for images
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const cancelFileSelection = () => {
    setSelectedFile(null);
    setFilePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ✅ Filter messages for current conversation only
  const filteredMessages = messages.filter(
    (msg) =>
      (msg.senderId === receiverId && msg.receiverId === userId) ||
      (msg.senderId === userId && msg.receiverId === receiverId)
  );

  return (
    <div className="flex flex-col h-full bg-white border border-[#dfdcef] rounded-lg overflow-hidden shadow-sm">
      {/* Clear Chat */}
      <button
        onClick={() => dispatch(clearChat())}
        className="self-end p-2 text-sm text-[#3b3b3b]/70 hover:text-[#009063] mr-4 mt-2"
      >
        Clear Chat
      </button>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loading ? (
          <p className="text-center text-[#3b3b3b]/50 animate-pulse">
            Loading chat...
          </p>
        ) : filteredMessages.length > 0 ? (
          filteredMessages.map((msg, index) => (
            <div
              key={`${msg.senderId}-${msg.createdAt}-${index}`}
              className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"
                } animate-in slide-in-from-bottom-2 duration-300 fade-in`}
            >
              <div
                className={`flex flex-col max-w-[80%] transition-all duration-200`}
              >
                <div
                  className={`p-3 px-4 rounded-3xl ${msg.senderId === userId
                    ? "bg-[#009063] text-white shadow-lg hover:shadow-xl"
                    : "bg-[#fbfbfb] text-[#3b3b3b] border border-[#dfdcef]/30 shadow-sm hover:shadow-md"
                    }`}
                >
                  <MediaMessage
                    messageType={msg.messageType}
                    fileUrl={msg.fileUrl}
                    fileName={msg.fileName}
                    fileSize={msg.fileSize}
                    mimeType={msg.mimeType}
                    message={msg.message}
                  />
                  {(!msg.messageType || msg.messageType === "text") && (
                    <p className="break-words">{msg.message}</p>
                  )}
                </div>
                {/* Timestamp */}
                <span
                  className={`text-xs text-[#3b3b3b]/50 mt-1 px-2 ${msg.senderId === userId ? "text-right" : "text-left"
                    }`}
                >
                  {formatMessageTime(msg.createdAt)}
                </span>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-[#3b3b3b]/40 font-medium">
            No messages yet
          </p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="border-t border-[#dfdcef] bg-[#fbfbfb] p-4 space-y-2">
        {/* File Preview */}
        {selectedFile && (
          <div className="flex items-center gap-2 p-2 bg-white rounded-lg border border-[#dfdcef]">
            {filePreview ? (
              <img src={filePreview} alt="Preview" className="w-16 h-16 object-cover rounded" />
            ) : (
              <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center">
                <Paperclip className="w-6 h-6 text-gray-400" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{selectedFile.name}</p>
              <p className="text-xs text-gray-500">
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </p>
            </div>
            <button
              onClick={cancelFileSelection}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="flex gap-2">
          <input
            ref={fileInputRef}
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            accept="image/*,video/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="flex-shrink-0 p-3 border border-[#dfdcef] rounded-2xl hover:bg-[#009063]/10 hover:border-[#009063]/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Paperclip className="w-5 h-5 text-[#009063]" />
          </button>
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !isUploading && sendMessage()}
            placeholder="Type a message..."
            disabled={isUploading}
            className="flex-1 border border-[#dfdcef] rounded-2xl px-4 py-3 outline-none text-[#3b3b3b] bg-white placeholder:text-[#3b3b3b]/40 transition-all duration-200 focus:border-[#009063]/50 focus:shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          />
          <button
            onClick={sendMessage}
            disabled={(!message.trim() && !selectedFile) || isUploading}
            className="bg-[#009063] hover:bg-[#009063]/90 disabled:bg-[#009063]/50 text-white px-6 py-3 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:cursor-not-allowed disabled:transform-none"
          >
            {isUploading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;