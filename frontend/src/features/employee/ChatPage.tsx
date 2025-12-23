import { useEffect, useState } from "react";
import ChatBox from "@/shared/components/Chat/ChatBox";
import { getTeamMemeberList, getChatHistory, markMessagesAsRead } from "@/services/chat";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSocket } from "@/shared/socket/socket";
import { formatChatTime } from "@/utils/dateUtils";
import { LoadingSpinner } from "@/shared/components/Loading";
import { ChatMessage } from "@/types/types";

interface Member {
  id: string;
  name: string;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount?: number;
}

interface SocketMessage {
  senderId: string;
  message: string;
  createdAt: string;
}

const ChatPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.userId);

  // ✅ Fetch team members with enriched data (includes lastMessage, unreadCount, etc.)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const teamData = await getTeamMemeberList();

        if (teamData && Array.isArray(teamData)) {
          // Backend already returns sorted data with unread counts
          setMembers(teamData);
        }
      } catch (err) {
        console.error("Failed to fetch team members:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Listen for incoming socket messages
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (msg: SocketMessage) => {
      if (msg.senderId !== userId) {
        setMembers((prev) => {
          const updated = [...prev];
          const index = updated.findIndex((m) => m.id === msg.senderId);
          if (index !== -1) {
            const member = { ...updated[index] };
            member.lastMessage = msg.message;
            member.lastMessageTime = msg.createdAt;

            // Increment unread if not open
            if (!selectedMember || selectedMember.id !== msg.senderId) {
              member.unreadCount = (member.unreadCount || 0) + 1;
            }

            // Move to top
            updated.splice(index, 1);
            updated.unshift(member);
          }
          return updated;
        });
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [userId, selectedMember]);

  // ✅ Load chat history and mark messages as read when selecting a member
  useEffect(() => {
    if (!selectedMember) return;
    setChatLoading(true);

    getChatHistory(selectedMember.id)
      .then((data) => setChatHistory(data || []))
      .catch((err) => console.error("Failed to load chat history:", err))
      .finally(() => setChatLoading(false));

    // Mark messages as read on backend
    markMessagesAsRead(selectedMember.id).catch((err) =>
      console.error("Failed to mark messages as read:", err)
    );

    // Reset unread count for opened chat
    setMembers((prev) =>
      prev.map((m) =>
        m.id === selectedMember.id ? { ...m, unreadCount: 0 } : m
      )
    );
  }, [selectedMember]);

  return (
    <div className="flex h-screen bg-bg text-text">
      {/* Sidebar */}
      <div className="w-1/3 md:w-1/4 bg-white border-r border-accent flex flex-col transition-all duration-300">
        <div className="p-4 border-b border-accent bg-primary text-white shadow-sm">
          <h2 className="text-lg font-semibold">Team</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner variant="pulse" size="medium" />
          </div>
        ) : members.length === 0 ? (
          <p className="p-4 text-text/50 text-center">No team found.</p>
        ) : (
          <ul className="flex-1 overflow-y-auto">
            {members.map((member) => (
              <li
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`relative flex items-center gap-3 p-4 cursor-pointer border-b border-accent transition-all duration-200 hover:bg-accent/30 ${selectedMember?.id === member.id
                  ? "bg-primary/10 shadow-sm"
                  : ""
                  }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium shadow-md">
                  {member.name.charAt(0).toUpperCase()}
                </div>

                {/* Name + last message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-text">{member.name}</p>
                    {member.lastMessageTime && (
                      <span className="text-xs text-text/50 ml-2">
                        {formatChatTime(member.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  {member.lastMessage ? (
                    <p className="text-sm text-text/60 truncate">
                      {member.lastMessage}
                    </p>
                  ) : (
                    <p className="text-sm text-text/60">Tap to chat</p>
                  )}
                </div>

                {/* Unread Badge - Only show when there are new messages */}
                {member.unreadCount != null && member.unreadCount > 0 && (
                  <span className="absolute right-4 top-5 bg-primary text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
                    {member.unreadCount}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-bg">
        {selectedMember ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 bg-white shadow-sm border-b border-accent transition-all duration-200">
              <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium shadow-md">
                {selectedMember.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-lg text-text">
                  {selectedMember.name}
                </h2>
                <p className="text-sm text-primary font-medium">Online</p>
              </div>
            </div>

            {/* Chat Box */}
            <div className="flex-1 overflow-hidden">
              <ChatBox
                receiverId={selectedMember.id}
                initialMessages={chatHistory}
                loading={chatLoading}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-text/50">
            Select a person to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;