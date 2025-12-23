import { useState } from "react";
import { createGroup } from "@/services/groupChat";
import { useDispatch } from "react-redux";
import { addGroup } from "@/store/slices/groupChatSlice";
import { LoadingSpinner } from "@/shared/components/Loading";

interface CreateGroupModalProps {
    isOpen: boolean;
    onClose: () => void;
    availableMembers: { id: string; name: string }[];
}

const CreateGroupModal = ({ isOpen, onClose, availableMembers }: CreateGroupModalProps) => {
    const [groupName, setGroupName] = useState("");
    const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();

    const toggleMember = (memberId: string) => {
        setSelectedMembers((prev) =>
            prev.includes(memberId)
                ? prev.filter((id) => id !== memberId)
                : [...prev, memberId]
        );
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim() || selectedMembers.length === 0) {
            alert("Please enter a group name and select at least one member");
            return;
        }

        setLoading(true);
        try {
            const response = await createGroup({
                name: groupName,
                members: selectedMembers,
            });

            dispatch(addGroup(response.group));
            setGroupName("");
            setSelectedMembers([]);
            onClose();
        } catch (error) {
            console.error("Failed to create group:", error);
            alert("Failed to create group. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-bg rounded-lg shadow-xl p-6 w-full max-w-md">
                <h2 className="text-xl font-semibold text-text mb-4">Create New Group</h2>

                {/* Group Name Input */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-text mb-2">
                        Group Name
                    </label>
                    <input
                        type="text"
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                        placeholder="Enter group name"
                        className="w-full border border-accent rounded-lg px-4 py-2 outline-none focus:border-primary/50"
                    />
                </div>

                {/* Member Selection */}
                <div className="mb-4">
                    <label className="block text-sm font-medium text-text mb-2">
                        Select Members ({selectedMembers.length} selected)
                    </label>
                    <div className="border border-accent rounded-lg max-h-60 overflow-y-auto">
                        {availableMembers.map((member) => (
                            <div
                                key={member.id}
                                onClick={() => toggleMember(member.id)}
                                className={`flex items-center gap-3 p-3 cursor-pointer hover:bg-accent/30 transition-colors ${selectedMembers.includes(member.id) ? "bg-primary/10" : ""
                                    }`}
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedMembers.includes(member.id)}
                                    onChange={() => { }}
                                    className="w-4 h-4 accent-primary"
                                />
                                <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-sm font-medium">
                                    {member.name.charAt(0).toUpperCase()}
                                </div>
                                <span className="text-text">{member.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-text hover:bg-accent/30 rounded-lg transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateGroup}
                        disabled={loading || !groupName.trim() || selectedMembers.length === 0}
                        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:bg-primary/50 transition-colors"
                    >
                        {loading ? <LoadingSpinner variant="dots" size="small" color="#ffffff" /> : "Create Group"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;
