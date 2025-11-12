import { useEffect, useState } from "react";
import ChatBox from "@/shared/components/Chat/ChatBox";
import { getTeamMemeberList } from "@/services/chat";

interface Member {
  id: string;
  name: string;
}

const EmployeeChatPage = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getTeamMemeberList();
        setMembers(data || []);
      } catch (error) {
        console.error("Failed to fetch team members:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, []);

  return (
    <div className="flex h-screen bg-[#fbfbfb] text-[#3b3b3b]">
      {/* Sidebar */}
      <div className="w-1/3 md:w-1/4 bg-white border-r border-[#dfdcef] flex flex-col transition-all duration-300">
        <div className="p-4 border-b border-[#dfdcef] bg-[#009063] text-white shadow-sm">
          <h2 className="text-lg font-semibold">Team Members</h2>
        </div>

        {loading ? (
          <p className="p-4 text-[#3b3b3b]/50 text-center animate-pulse">Loading...</p>
        ) : members.length === 0 ? (
          <p className="p-4 text-[#3b3b3b]/50 text-center">No team members found.</p>
        ) : (
          <ul className="flex-1 overflow-y-auto">
            {members.map((member) => (
              <li
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className={`flex items-center gap-3 p-4 cursor-pointer border-b border-[#dfdcef] transition-all duration-200 hover:bg-[#dfdcef]/30 ${
                  selectedMember?.id === member.id
                    ? "bg-[#009063]/10 shadow-sm"
                    : ""
                }`}
              >
                {/* Avatar */}
                <div className="w-10 h-10 rounded-full bg-[#009063] text-white flex items-center justify-center text-sm font-medium shadow-md transition-transform duration-200 hover:scale-105">
                  {member.name.charAt(0).toUpperCase()}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <p className="font-medium text-[#3b3b3b]">{member.name}</p>
                  <p className="text-sm text-[#3b3b3b]/60">Tap to chat</p>
                </div>
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
                <h2 className="font-semibold text-lg text-[#3b3b3b]">{selectedMember.name}</h2>
                <p className="text-sm text-[#009063] font-medium">Online</p>
              </div>
            </div>

            {/* Chat Box */}
            <div className="flex-1 overflow-hidden">
              <ChatBox receiverId={selectedMember.id} />
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