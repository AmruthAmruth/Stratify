import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { getSocket } from "@/shared/socket/socket";
import { sendGroupMessage } from "@/services/groupChat";
import { addGroupMessage, setGroupMessages } from "@/store/slices/groupChatSlice";
import { Paperclip, X } from "lucide-react";
import MediaMessage from "./MediaMessage";

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
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
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
    const sendMessage = async () => {
        const socket = getSocket();
        if (!socket || (!message.trim() && !selectedFile)) return;

        setIsUploading(true);
        try {
            const msg = {
                groupId,
                senderId: userId!,
                senderName: userName || "Unknown User",
                message: message.trim(),
                createdAt: new Date().toISOString(),
            };

            // Send via HTTP API with file
            await sendGroupMessage(
                { groupId, message: message.trim(), senderName: userName || "Unknown User" },
                selectedFile || undefined
            );

            // Optimistically add to UI
            dispatch(addGroupMessage(msg));
            setMessage("");
            setSelectedFile(null);
            setFilePreview(null);
        } catch (err) {
            console.error("Failed to send group message:", err);
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

export default GroupChatBox;
