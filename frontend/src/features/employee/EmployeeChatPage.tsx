import { useEffect, useState } from "react";
import ChatBox from "@/shared/components/Chat/ChatBox";
import { getTeamMemeberList, getChatHistory } from "@/services/chat";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { getSocket } from "@/shared/socket/socket";

interface Member {
  id: string;
  name: string;
  lastMessage?: string;
  unreadCount?: number;
}

const EmployeeChatPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [chatHistory, setChatHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [chatLoading, setChatLoading] = useState(false);
  const userId = useSelector((state: RootState) => state.auth.userId);
  const dispatch = useDispatch();

  // ✅ Fetch available chat members (managers or coworkers)
  useEffect(() => {
    getTeamMemeberList()
      .then((data) => {
        if (data && Array.isArray(data)) {
          setMembers(data.map((m: Member) => ({ ...m, unreadCount: 0 })));
        }
      })
      .catch((err) => console.error("Failed to fetch team members:", err))
      .finally(() => setLoading(false));
  }, []);

  // ✅ Listen for incoming socket messages
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (msg: any) => {
      if (msg.senderId !== userId) {
        setMembers((prev) => {
          let updated = [...prev];
          const index = updated.findIndex((m) => m.id === msg.senderId);
          if (index !== -1) {
            const member = { ...updated[index] };
            member.lastMessage = msg.message;

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

  // ✅ Load chat history when selecting a member
  useEffect(() => {
    if (!selectedMember) return;
    setChatLoading(true);

    getChatHistory(selectedMember.id)
      .then((data) => setChatHistory(data || []))
      .catch((err) => console.error("Failed to load chat history:", err))
      .finally(() => setChatLoading(false));

    // Reset unread count for opened chat
    setMembers((prev) =>
      prev.map((m) =>
        m.id === selectedMember.id ? { ...m, unreadCount: 0 } : m
      )
    );
  }, [selectedMember]);

  return (
    <div className="flex h-screen bg-[#fbfbfb] text-[#3b3b3b]">
      {/* Sidebar */}
      <div className="w-1/3 md:w-1/4 bg-white border-r border-[#dfdcef] flex flex-col transition-all duration-300">
        <div className="p-4 border-b border-[#dfdcef] bg-[#009063] text-white shadow-sm">
          <h2 className="text-lg font-semibold">Team</h2>
        </div>

        {loading ? (
          <p className="p-4 text-[#3b3b3b]/50 text-center animate-pulse">
            Loading...
          </p>
        ) : members.length === 0 ? (
          <p className="p-4 text-[#3b3b3b]/50 text-center">No team found.</p>
        ) : (
          <ul className="flex-1 overflow-y-auto">
            {members.map((member) => (
              <li
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`relative flex items-center gap-3 p-4 cursor-pointer border-b border-[#dfdcef] transition-all duration-200 hover:bg-[#dfdcef]/30 ${
                  selectedMember?.id === member.id
                    ? "bg-[#009063]/10 shadow-sm"
                    : ""
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#009063] text-white flex items-center justify-center text-sm font-medium shadow-md">
                  {member.name.charAt(0).toUpperCase()}
                </div>

                {/* Name + last message */}
                <div className="flex-1">
                  <p className="font-medium text-[#3b3b3b]">{member.name}</p>
                  {member.lastMessage ? (
                    <p className="text-sm text-[#3b3b3b]/60 truncate max-w-[160px]">
                      {member.lastMessage}
                    </p>
                  ) : (
                    <p className="text-sm text-[#3b3b3b]/60">Tap to chat</p>
                  )}
                </div>

                {/* Unread Badge */}
                {member.unreadCount && member.unreadCount > 0 && (
                  <span className="absolute right-4 top-5 bg-[#009063] text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
                    {member.unreadCount}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-[#fbfbfb]">
        {selectedMember ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 bg-white shadow-sm border-b border-[#dfdcef] transition-all duration-200">
              <div className="w-10 h-10 rounded-full bg-[#009063] text-white flex items-center justify-center text-sm font-medium shadow-md">
                {selectedMember.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-lg text-[#3b3b3b]">
                  {selectedMember.name}
                </h2>
                <p className="text-sm text-[#009063] font-medium">Online</p>
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
          <div className="flex flex-1 items-center justify-center text-[#3b3b3b]/50">
            Select a person to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeChatPage;