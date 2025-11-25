import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IGroupMessage {
    id?: string;
    groupId: string;
    senderId: string;
    senderName?: string;
    message: string;
    createdAt: string;
}

export interface IGroup {
    id: string;
    name: string;
    members: string[];
    lastMessage?: string;
    unreadCount?: number;
    createdAt: string;
    updatedAt?: string;
}

interface GroupChatState {
    groups: IGroup[];
    groupMessages: Record<string, IGroupMessage[]>; // groupId -> messages[]
    activeGroupId: string | null;
}

const initialState: GroupChatState = {
    groups: [],
    groupMessages: {},
    activeGroupId: null,
};

const groupChatSlice = createSlice({
    name: "groupChat",
    initialState,
    reducers: {
        setGroups: (state, action: PayloadAction<IGroup[]>) => {
            state.groups = action.payload;
        },
        addGroup: (state, action: PayloadAction<IGroup>) => {
            state.groups.unshift(action.payload);
        },
        setActiveGroup: (state, action: PayloadAction<string | null>) => {
            state.activeGroupId = action.payload;
            // Reset unread count for this group
            if (action.payload) {
                const group = state.groups.find((g) => g.id === action.payload);
                if (group) {
                    group.unreadCount = 0;
                }
            }
        },
        addGroupMessage: (state, action: PayloadAction<IGroupMessage>) => {
            const { groupId } = action.payload;
            if (!state.groupMessages[groupId]) {
                state.groupMessages[groupId] = [];
            }
            state.groupMessages[groupId].push(action.payload);

            // Update last message and unread count in group list
            const group = state.groups.find((g) => g.id === groupId);
            if (group) {
                group.lastMessage = action.payload.message;
                // Only increment unread if not the active group
                if (state.activeGroupId !== groupId) {
                    group.unreadCount = (group.unreadCount || 0) + 1;
                }
            }
        },
        setGroupMessages: (state, action: PayloadAction<{ groupId: string; messages: IGroupMessage[] }>) => {
            state.groupMessages[action.payload.groupId] = action.payload.messages;
        },
        clearGroupMessages: (state, action: PayloadAction<string>) => {
            state.groupMessages[action.payload] = [];
        },
        updateGroupMembers: (state, action: PayloadAction<{ groupId: string; members: string[] }>) => {
            const group = state.groups.find((g) => g.id === action.payload.groupId);
            if (group) {
                group.members = action.payload.members;
            }
        },
        incrementUnreadCount: (state, action: PayloadAction<string>) => {
            const group = state.groups.find((g) => g.id === action.payload);
            if (group && state.activeGroupId !== action.payload) {
                group.unreadCount = (group.unreadCount || 0) + 1;
            }
        },
    },
});

export const {
    setGroups,
    addGroup,
    setActiveGroup,
    addGroupMessage,
    setGroupMessages,
    clearGroupMessages,
    updateGroupMembers,
    incrementUnreadCount,
} = groupChatSlice.actions;

export default groupChatSlice.reducer;
