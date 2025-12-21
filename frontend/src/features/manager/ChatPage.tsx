import { useEffect, useState } from "react";
import ChatBox from "@/shared/components/Chat/ChatBox";
import { getChatHistory, getTeamMemeberList, markMessagesAsRead } from "@/services/chat";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { getSocket } from "@/shared/socket/socket";
import { formatChatTime } from "@/utils/dateUtils";
import { LoadingSpinner } from "@/shared/components/Loading";
import { ChatMessage } from "@/types/types";

interface Employee {
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
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
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
          setEmployees(teamData);
        }
      } catch (err) {
        console.error("Failed to fetch team members:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // ✅ Listen for incoming messages via socket
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handleReceiveMessage = (msg: SocketMessage) => {
      // If the current chat is open, don't increment unread
      if (msg.senderId !== userId) {
        setEmployees((prev) => {
          const updated = [...prev];
          const index = updated.findIndex((e) => e.id === msg.senderId);
          if (index !== -1) {
            const emp = { ...updated[index] };
            emp.lastMessage = msg.message;
            emp.lastMessageTime = msg.createdAt;

            // Increase unread count only if not selected
            if (!selectedEmployee || selectedEmployee.id !== msg.senderId) {
              emp.unreadCount = (emp.unreadCount || 0) + 1;
            }

            // Move this employee to the top
            updated.splice(index, 1);
            updated.unshift(emp);
          }
          return updated;
        });
      }
    };

    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [userId, selectedEmployee]);

  // ✅ Fetch chat history and mark messages as read whenever employee is selected
  useEffect(() => {
    if (!selectedEmployee) return;
    setChatLoading(true);

    getChatHistory(selectedEmployee.id)
      .then((data) => {
        setChatHistory(data || []);
      })
      .catch((err) => console.error("Failed to load chat history:", err))
      .finally(() => setChatLoading(false));

    // Mark messages as read on backend
    markMessagesAsRead(selectedEmployee.id).catch((err) =>
      console.error("Failed to mark messages as read:", err)
    );

    // Reset unread count for this chat
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === selectedEmployee.id ? { ...emp, unreadCount: 0 } : emp
      )
    );
  }, [selectedEmployee]);

  return (
    <div className="flex h-screen bg-[#fbfbfb] text-[#3b3b3b]">
      {/* Sidebar */}
      <div className="w-1/3 md:w-1/4 bg-white border-r border-[#dfdcef] flex flex-col transition-all duration-300">
        <div className="p-4 border-b border-[#dfdcef] bg-[#009063] text-white shadow-sm">
          <h2 className="text-lg font-semibold">Team Members</h2>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <LoadingSpinner variant="pulse" size="medium" />
          </div>
        ) : employees.length === 0 ? (
          <p className="p-4 text-[#3b3b3b]/50 text-center">No employees found.</p>
        ) : (
          <ul className="flex-1 overflow-y-auto">
            {employees.map((emp) => (
              <li
                key={emp.id}
                onClick={() => setSelectedEmployee(emp)}
                className={`relative flex items-center gap-3 p-4 cursor-pointer border-b border-[#dfdcef] transition-all duration-200 hover:bg-[#dfdcef]/30 ${selectedEmployee?.id === emp.id
                  ? "bg-[#009063]/10 shadow-sm"
                  : ""
                  }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#009063] text-white flex items-center justify-center text-sm font-medium shadow-md">
                  {emp.name.charAt(0).toUpperCase()}
                </div>

                {/* Name + last message */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-[#3b3b3b]">{emp.name}</p>
                    {emp.lastMessageTime && (
                      <span className="text-xs text-[#3b3b3b]/50 ml-2">
                        {formatChatTime(emp.lastMessageTime)}
                      </span>
                    )}
                  </div>
                  {emp.lastMessage ? (
                    <p className="text-sm text-[#3b3b3b]/60 truncate">
                      {emp.lastMessage}
                    </p>
                  ) : (
                    <p className="text-sm text-[#3b3b3b]/60">Tap to chat</p>
                  )}
                </div>

                {/* Unread badge - Only show when there are new messages */}
                {emp.unreadCount != null && emp.unreadCount > 0 && (
                  <span className="absolute right-4 top-5 bg-[#009063] text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
                    {emp.unreadCount}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Chat Section */}
      <div className="flex-1 flex flex-col bg-[#fbfbfb]">
        {selectedEmployee ? (
          <>
            {/* Chat Header */}
            <div className="flex items-center gap-3 p-4 bg-white shadow-sm border-b border-[#dfdcef] transition-all duration-200">
              <div className="w-10 h-10 rounded-full bg-[#009063] text-white flex items-center justify-center text-sm font-medium shadow-md">
                {selectedEmployee.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="font-semibold text-lg text-[#3b3b3b]">
                  {selectedEmployee.name}
                </h2>
                <p className="text-sm text-[#009063] font-medium">Online</p>
              </div>
            </div>

            {/* Chat Box */}
            <div className="flex-1 overflow-hidden">
              <ChatBox
                receiverId={selectedEmployee.id}
                initialMessages={chatHistory}
                loading={chatLoading}
              />
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-[#3b3b3b]/50">
            Select an employee to start chatting
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;