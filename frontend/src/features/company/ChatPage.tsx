import { useEffect, useState } from "react";
import ChatBox from "@/shared/components/Chat/ChatBox";
import { getChatHistory, getTeamMemeberList, markMessagesAsRead } from "@/services/chat";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSocket } from "@/shared/socket/socket";
import { formatChatTime } from "@/utils/dateUtils";
import { useSearchParams } from "react-router-dom";
import { LoadingSpinner } from "@/shared/components/Loading";

interface TeamMember {
    id: string;
    name: string;
    lastMessage?: string;
    lastMessageTime?: string;
    unreadCount?: number;
}

const ChatPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
    const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
    const [chatHistory, setChatHistory] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const userId = useSelector((state: RootState) => state.auth.userId);

    // ✅ Fetch team members (all managers and employees under company)
    useEffect(() => {
        const fetchData = async () => {
            try {
                const teamData = await getTeamMemeberList();

                if (teamData && Array.isArray(teamData)) {
                    setTeamMembers(teamData);

                    // ✅ Restore selected chat from URL if exists
                    const chatId = searchParams.get('chat');
                    if (chatId) {
                        const member = teamData.find((m: TeamMember) => m.id === chatId);
                        if (member) {
                            setSelectedMember(member);
                        }
                    }
                }
            } catch (err) {
                console.error("Failed to fetch team members:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchParams]);

    // ✅ Listen for incoming messages via socket
    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        const handleReceiveMessage = (msg: any) => {
            if (msg.senderId !== userId) {
                setTeamMembers((prev) => {
                    let updated = [...prev];
                    const index = updated.findIndex((m) => m.id === msg.senderId);
                    if (index !== -1) {
                        const member = { ...updated[index] };
                        member.lastMessage = msg.message;
                        member.lastMessageTime = msg.createdAt;

                        // Increase unread count only if not selected
                        if (!selectedMember || selectedMember.id !== msg.senderId) {
                            member.unreadCount = (member.unreadCount || 0) + 1;
                        }

                        // Move this member to the top
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

    // ✅ Fetch chat history and mark messages as read when member is selected
    useEffect(() => {
        if (!selectedMember) return;
        setChatLoading(true);

        getChatHistory(selectedMember.id)
            .then((data) => {
                console.log("Chat history loaded:", data);
                setChatHistory(data || []);
            })
            .catch((err) => console.error("Failed to load chat history:", err))
            .finally(() => setChatLoading(false));

        // Mark messages as read on backend
        markMessagesAsRead(selectedMember.id).catch((err) =>
            console.error("Failed to mark messages as read:", err)
        );

        // Reset unread count for this chat
        setTeamMembers((prev) =>
            prev.map((member) =>
                member.id === selectedMember.id ? { ...member, unreadCount: 0 } : member
            )
        );
    }, [selectedMember]);

    // ✅ Handle member selection with URL update
    const handleSelectMember = (member: TeamMember) => {
        setSelectedMember(member);
        setSearchParams({ chat: member.id });
    };

    return (
        <div className="flex h-screen bg-[#fbfbfb] text-[#3b3b3b]">
            {/* Sidebar */}
            <div className="w-1/3 md:w-1/4 bg-white border-r border-[#dfdcef] flex flex-col transition-all duration-300">
                <div className="p-4 border-b border-[#dfdcef] bg-[#009063] text-white shadow-sm">
                    <h2 className="text-lg font-semibold">Team Members</h2>
                    <p className="text-sm text-white/80 mt-1">Managers & Employees</p>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-8">
                        <LoadingSpinner variant="pulse" size="medium" />
                    </div>
                ) : teamMembers.length === 0 ? (
                    <p className="p-4 text-[#3b3b3b]/50 text-center">No team members found.</p>
                ) : (
                    <ul className="flex-1 overflow-y-auto">
                        {teamMembers.map((member) => (
                            <li
                                key={member.id}
                                onClick={() => handleSelectMember(member)}
                                className={`relative flex items-center gap-3 p-4 cursor-pointer border-b border-[#dfdcef] transition-all duration-200 hover:bg-[#dfdcef]/30 ${selectedMember?.id === member.id
                                    ? "bg-[#009063]/10 shadow-sm"
                                    : ""
                                    }`}
                            >
                                {/* Avatar */}
                                <div className="w-10 h-10 rounded-full bg-[#009063] text-white flex items-center justify-center text-sm font-medium shadow-md">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>

                                {/* Name + last message */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <p className="font-medium text-[#3b3b3b]">{member.name}</p>
                                        {member.lastMessageTime && (
                                            <span className="text-xs text-[#3b3b3b]/50 ml-2">
                                                {formatChatTime(member.lastMessageTime)}
                                            </span>
                                        )}
                                    </div>
                                    {member.lastMessage ? (
                                        <p className="text-sm text-[#3b3b3b]/60 truncate">
                                            {member.lastMessage}
                                        </p>
                                    ) : (
                                        <p className="text-sm text-[#3b3b3b]/60">Tap to chat</p>
                                    )}
                                </div>

                                {/* Unread badge */}
                                {member.unreadCount != null && member.unreadCount > 0 && (
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
                        Select a team member to start chatting
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatPage;
