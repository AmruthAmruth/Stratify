import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { getMyGroups, getGroupMessages, getMyDepartmentGroup } from "@/services/groupChat";
import { getTeamMemeberList } from "@/services/chat";
import { setGroups, setActiveGroup, setGroupMessages } from "@/store/slices/groupChatSlice";
import { joinGroupRoom, leaveGroupRoom } from "@/shared/socket/socket";
import GroupChatBox from "@/shared/components/Chat/GroupChatBox";
import CreateGroupModal from "@/shared/components/Chat/CreateGroupModal";
import { IGroup } from "@/store/slices/groupChatSlice";

const GroupChatPage = () => {
    const [loading, setLoading] = useState(true);
    const [chatLoading, setChatLoading] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [availableMembers, setAvailableMembers] = useState<{ id: string; name: string }[]>([]);
    const [departmentGroup, setDepartmentGroup] = useState<IGroup | null>(null);

    const groups = useSelector((state: RootState) => state.groupChat.groups);
    const activeGroupId = useSelector((state: RootState) => state.groupChat.activeGroupId);
    const groupMessages = useSelector((state: RootState) => state.groupChat.groupMessages);

    const dispatch = useDispatch();

    const selectedGroup = groups.find((g) => g.id === activeGroupId);

    // Fetch groups and department group on mount
    useEffect(() => {
        Promise.all([
            getMyGroups(),
            getTeamMemeberList(),
            getMyDepartmentGroup()
        ])
            .then(([groupsData, membersData, deptGroup]) => {
                if (groupsData && Array.isArray(groupsData)) {
                    dispatch(setGroups(groupsData));
                }
                if (membersData && Array.isArray(membersData)) {
                    setAvailableMembers(membersData);
                }
                // Set department group if exists
                if (deptGroup) {
                    const formattedDeptGroup: IGroup = {
                        id: deptGroup.id,
                        name: `🏢 ${deptGroup.name}`,
                        members: deptGroup.members.map((m: { id: string; name: string }) => m.id),
                        createdAt: deptGroup.createdAt,
                    };
                    setDepartmentGroup(formattedDeptGroup);
                }
            })
            .catch((err) => console.error("Failed to fetch data:", err))
            .finally(() => setLoading(false));
    }, [dispatch]);

    // Join all group rooms on mount (including department group)
    useEffect(() => {
        groups.forEach((group) => {
            joinGroupRoom(group.id);
        });
        if (departmentGroup) {
            joinGroupRoom(departmentGroup.id);
        }

        return () => {
            groups.forEach((group) => {
                leaveGroupRoom(group.id);
            });
            if (departmentGroup) {
                leaveGroupRoom(departmentGroup.id);
            }
        };
    }, [groups, departmentGroup]);

    // Fetch messages when a group is selected
    useEffect(() => {
        if (!activeGroupId) return;

        setChatLoading(true);
        getGroupMessages(activeGroupId)
            .then((messages) => {
                dispatch(setGroupMessages({ groupId: activeGroupId, messages: messages || [] }));
            })
            .catch((err) => console.error("Failed to load group messages:", err))
            .finally(() => setChatLoading(false));
    }, [activeGroupId, dispatch]);

    const handleSelectGroup = (group: IGroup) => {
        dispatch(setActiveGroup(group.id));
    };

    return (
        <div className="flex h-screen bg-[#fbfbfb] text-[#3b3b3b]">
            {/* Sidebar - Group List */}
            <div className="w-1/3 md:w-1/4 bg-white border-r border-[#dfdcef] flex flex-col transition-all duration-300">
                <div className="p-4 border-b border-[#dfdcef] bg-[#009063] text-white shadow-sm flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Group Chats</h2>
                    <button
                        onClick={() => setIsCreateModalOpen(true)}
                        className="bg-white text-[#009063] px-3 py-1 rounded-lg text-sm font-medium hover:bg-white/90 transition-colors"
                    >
                        + New
                    </button>
                </div>

                {loading ? (
                    <p className="p-4 text-[#3b3b3b]/50 text-center animate-pulse">
                        Loading groups...
                    </p>
                ) : groups.length === 0 ? (
                    <div className="p-4 text-center">
                        <p className="text-[#3b3b3b]/50 mb-3">No groups yet.</p>
                        <button
                            onClick={() => setIsCreateModalOpen(true)}
                            className="bg-[#009063] text-white px-4 py-2 rounded-lg hover:bg-[#009063]/90 transition-colors"
                        >
                            Create Your First Group
                        </button>
                    </div>
                ) : (
                    <ul className="flex-1 overflow-y-auto">
                        {/* Department Group */}
                        {departmentGroup && (
                            <>
                                <li className="px-4 py-2 bg-[#f0f0f0] border-b border-[#dfdcef]">
                                    <p className="text-xs font-semibold text-[#3b3b3b]/60 uppercase tracking-wide">Department</p>
                                </li>
                                <li
                                    key={departmentGroup.id}
                                    onClick={() => handleSelectGroup(departmentGroup)}
                                    className={`relative flex items-center gap-3 p-4 cursor-pointer border-b-2 border-[#009063]/20 transition-all duration-200 hover:bg-[#dfdcef]/30 ${activeGroupId === departmentGroup.id
                                        ? "bg-[#009063]/10 shadow-sm"
                                        : ""
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#009063] to-[#00b377] text-white flex items-center justify-center text-sm font-medium shadow-md">
                                        🏢
                                    </div>
                                    <div className="flex-1">
                                        <p className="font-medium text-[#3b3b3b]">{departmentGroup.name}</p>
                                        <p className="text-sm text-[#3b3b3b]/60">
                                            {departmentGroup.members.length} members
                                        </p>
                                    </div>
                                </li>
                            </>
                        )}

                        {/* Custom Groups */}
                        {groups.length > 0 && (
                            <>
                                <li className="px-4 py-2 bg-[#f0f0f0] border-b border-[#dfdcef] mt-2">
                                    <p className="text-xs font-semibold text-[#3b3b3b]/60 uppercase tracking-wide">Custom Groups</p>
                                </li>
                                {groups.map((group) => (
                                    <li
                                        key={group.id}
                                        onClick={() => handleSelectGroup(group)}
                                        className={`relative flex items-center gap-3 p-4 cursor-pointer border-b border-[#dfdcef] transition-all duration-200 hover:bg-[#dfdcef]/30 ${activeGroupId === group.id
                                            ? "bg-[#009063]/10 shadow-sm"
                                            : ""
                                            }`}
                                    >
                                        <div className="w-10 h-10 rounded-full bg-[#009063] text-white flex items-center justify-center text-sm font-medium shadow-md">
                                            {group.name.charAt(0).toUpperCase()}
                                        </div>
                                        <div className="flex-1">
                                            <p className="font-medium text-[#3b3b3b]">{group.name}</p>
                                            {group.lastMessage ? (
                                                <p className="text-sm text-[#3b3b3b]/60 truncate max-w-[160px]">
                                                    {group.lastMessage}
                                                </p>
                                            ) : (
                                                <p className="text-sm text-[#3b3b3b]/60">
                                                    {group.members.length} members
                                                </p>
                                            )}
                                        </div>
                                        {group.unreadCount && group.unreadCount > 0 && (
                                            <span className="absolute right-4 top-5 bg-[#009063] text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow-md">
                                                {group.unreadCount}
                                            </span>
                                        )}
                                    </li>
                                ))}
                            </>
                        )}
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
                    <div className="flex flex-1 items-center justify-center text-[#3b3b3b]/50">
                        Select a group to start chatting
                    </div>
                )}
            </div>

            {/* Create Group Modal */}
            <CreateGroupModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                availableMembers={availableMembers}
            />
        </div>
    );
};

export default GroupChatPage;
