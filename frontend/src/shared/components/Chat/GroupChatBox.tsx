import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { getSocket } from "@/shared/socket/socket";
import { sendGroupMessage } from "@/services/groupChat";
import { addGroupMessage, setGroupMessages } from "@/store/slices/groupChatSlice";

interface GroupChatBoxProps {
    groupId: string;
    groupName: string;
    initialMessages?: any[];
    loading?: boolean;
}

const GroupChatBox = ({
    groupId,
    groupName,
    initialMessages = [],
    loading = false,
}: GroupChatBoxProps) => {
    const [message, setMessage] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const groupMessages = useSelector((state: RootState) => state.groupChat.groupMessages[groupId] || []);
    const userId = useSelector((state: RootState) => state.auth.userId);
    const userName = useSelector((state: RootState) => state.auth.name);
    const dispatch = useDispatch();

    // Load initial messages when group changes
    useEffect(() => {
        if (initialMessages && initialMessages.length > 0) {
            dispatch(setGroupMessages({ groupId, messages: initialMessages }));
        }
    }, [groupId, dispatch, initialMessages]);

    // Auto-scroll to latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [groupMessages]);

    // Send message
    const sendMessage = () => {
        const socket = getSocket();
        if (!socket || !message.trim()) return;

        const msg = {
            groupId,
            senderId: userId!,
            senderName: userName || "Unknown User",
            message,
            createdAt: new Date().toISOString(),
        };

        // Send via HTTP API with sender name
        sendGroupMessage({ groupId, message, senderName: userName || "Unknown User" })
            .then(() => {
                console.log("Group message sent successfully");
            })
            .catch((err) => console.error("Failed to send group message:", err));

        // Optimistically add to UI
        dispatch(addGroupMessage(msg));
        setMessage("");
    };

    return (
        <div className="flex flex-col h-full bg-white border border-[#dfdcef] rounded-lg overflow-hidden shadow-sm">
            {/* Group Header */}
            <div className="p-4 border-b border-[#dfdcef] bg-[#009063] text-white">
                <h3 className="font-semibold text-lg">{groupName}</h3>
                <p className="text-sm opacity-90">Group Chat</p>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {loading ? (
                    <p className="text-center text-[#3b3b3b]/50 animate-pulse">
                        Loading messages...
                    </p>
                ) : groupMessages.length > 0 ? (
                    groupMessages.map((msg, index) => (
                        <div
                            key={`${msg.senderId}-${msg.createdAt}-${index}`}
                            className={`flex ${msg.senderId === userId ? "justify-end" : "justify-start"
                                } animate-in slide-in-from-bottom-2 duration-300 fade-in`}
                        >
                            <div
                                className={`p-3 px-4 rounded-3xl max-w-[80%] transition-all duration-200 ${msg.senderId === userId
                                    ? "bg-[#009063] text-white shadow-lg hover:shadow-xl"
                                    : "bg-[#fbfbfb] text-[#3b3b3b] border border-[#dfdcef]/30 shadow-sm hover:shadow-md"
                                    }`}
                            >
                                {msg.senderId !== userId && (
                                    <p className="text-xs font-semibold mb-1 opacity-70">
                                        {msg.senderName || msg.senderId}
                                    </p>
                                )}
                                <p className="break-words">{msg.message}</p>
                                <p className="text-xs mt-1 opacity-60">
                                    {new Date(msg.createdAt).toLocaleTimeString([], {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    })}
                                </p>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-center text-[#3b3b3b]/40 font-medium">
                        No messages yet. Start the conversation!
                    </p>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
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
                    className="bg-[#009063] hover:bg-[#009063]/90 disabled:bg-[#009063]/50 text-white px-6 py-3 rounded-2xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default GroupChatBox;
