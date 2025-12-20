import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getDepartmentGroups, getGroupMessages } from "@/services/groupChat";
import { setGroups, setActiveGroup, setGroupMessages } from "@/store/slices/groupChatSlice";
import { joinGroupRoom, leaveGroupRoom } from "@/shared/socket/socket";
import GroupChatBox from "@/shared/components/Chat/GroupChatBox";

interface DepartmentGroup {
    id: string;
    name: string;
    members: MemberInfo[];
    departmentId: string;
}

interface MemberInfo {
    id: string;
    name: string;
    role: "manager" | "employee";
}

const CompanyGroupChatPage = () => {
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [departmentGroups, setDepartmentGroups] = useState<DepartmentGroup[]>([]);
    const [selectedGroup, setSelectedGroup] = useState<DepartmentGroup | null>(null);
    const [groupMessages, setGroupMessagesState] = useState<{ [key: string]: unknown[] }>({});

    const dispatch = useDispatch();

    // Fetch department groups on mount
    useEffect(() => {
        getDepartmentGroups()
            .then((data: unknown) => {
                if (data && Array.isArray(data)) {
                    setDepartmentGroups(data as DepartmentGroup[]);
                    // Also set in Redux for compatibility with GroupChatBox
                    const formattedGroups = (data as DepartmentGroup[]).map((group: DepartmentGroup) => ({
                        id: group.id,
                        name: group.name,
                        members: group.members.map(m => m.id),
                    }));
                    dispatch(setGroups(formattedGroups));
                }
            })
            .catch((err) => console.error("Failed to fetch department groups:", err))
            .finally(() => setLoading(false));
    }, [dispatch]);

    // Join all group rooms on mount
    useEffect(() => {
        departmentGroups.forEach((group) => {
            joinGroupRoom(group.id);
        });

        return () => {
            departmentGroups.forEach((group) => {
                leaveGroupRoom(group.id);
            });
        };
    }, [departmentGroups]);

    // Fetch messages when a group is selected
    useEffect(() => {
        if (!selectedGroup) return;

        setChatLoading(true);
        getGroupMessages(selectedGroup.id)
            .then((messages: unknown) => {
                dispatch(setGroupMessages({ groupId: selectedGroup.id, messages: (messages as any[]) || [] }));
                setGroupMessagesState(prev => ({
                    ...prev,
                    [selectedGroup.id]: (messages as unknown[]) || []
                }));
            })
            .catch((err) => console.error("Failed to load group messages:", err))
            .finally(() => setChatLoading(false));
    }, [selectedGroup, dispatch]);

    const handleSelectGroup = (group: DepartmentGroup) => {
        setSelectedGroup(group);
        dispatch(setActiveGroup(group.id));
    };

    return (
        <div className="flex h-screen bg-[#fbfbfb] text-[#3b3b3b]">
            {/* Sidebar - Department Group List */}
            <div className="w-1/3 md:w-1/4 bg-white border-r border-[#dfdcef] flex flex-col transition-all duration-300">
                <div className="p-4 border-b border-[#dfdcef] bg-[#009063] text-white shadow-sm">
                    <h2 className="text-lg font-semibold">Department Groups</h2>
                    <p className="text-sm text-white/80 mt-1">Company Communication</p>
                </div>

                {loading ? (
                    <p className="p-4 text-[#3b3b3b]/50 text-center animate-pulse">
                        Loading departments...
                    </p>
                ) : departmentGroups.length === 0 ? (
                    <div className="p-4 text-center">
                        <p className="text-[#3b3b3b]/50 mb-3">No departments found.</p>
                        <p className="text-sm text-[#3b3b3b]/40">
                            Create departments to enable group chats.
                        </p>
                    </div>
                ) : (
                    <ul className="flex-1 overflow-y-auto">
                        {departmentGroups.map((group) => (
                            <li
                                key={group.id}
                                onClick={() => handleSelectGroup(group)}
                                className={`relative flex items-center gap-3 p-4 cursor-pointer border-b border-[#dfdcef] transition-all duration-200 hover:bg-[#dfdcef]/30 ${selectedGroup?.id === group.id
                                    ? "bg-[#009063]/10 shadow-sm"
                                    : ""
                                    }`}
                            >
                                {/* Department Avatar */}
                                <div className="w-10 h-10 rounded-full bg-[#009063] text-white flex items-center justify-center text-sm font-medium shadow-md">
                                    {group.name.charAt(0).toUpperCase()}
                                </div>

                                {/* Department Info */}
                                <div className="flex-1">
                                    <p className="font-medium text-[#3b3b3b]">{group.name}</p>
                                    <p className="text-sm text-[#3b3b3b]/60">
                                        {group.members.length} {group.members.length === 1 ? "member" : "members"}
                                    </p>
                                    <p className="text-xs text-[#3b3b3b]/40 mt-0.5">
                                        {group.members.filter(m => m.role === "manager").length} manager
                                        {group.members.filter(m => m.role === "manager").length !== 1 ? "s" : ""}, {" "}
                                        {group.members.filter(m => m.role === "employee").length} employee
                                        {group.members.filter(m => m.role === "employee").length !== 1 ? "s" : ""}
                                    </p>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Chat Section */}
            <div className="flex-1 flex flex-col bg-[#fbfbfb]">
                {selectedGroup ? (
                    <div className="flex-1 overflow-hidden">
                        <GroupChatBox
                            groupId={selectedGroup.id}
                            groupName={selectedGroup.name}
                            initialMessages={groupMessages[selectedGroup.id] || []}
                            loading={chatLoading}
                        />
                    </div>
                ) : (
                    <div className="flex flex-1 flex-col items-center justify-center text-[#3b3b3b]/50">
                        <div className="text-center max-w-md px-4">
                            <div className="w-20 h-20 rounded-full bg-[#009063]/10 flex items-center justify-center mx-auto mb-4">
                                <svg className="w-10 h-10 text-[#009063]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-[#3b3b3b] mb-2">
                                Select a Department
                            </h3>
                            <p className="text-sm">
                                Choose a department group from the sidebar to start chatting with your team members.
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CompanyGroupChatPage;
