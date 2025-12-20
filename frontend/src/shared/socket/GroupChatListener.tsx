import { useEffect } from "react";
import { getSocket } from "./socket";
import { useDispatch, useSelector } from "react-redux";
import { addGroupMessage } from "@/store/slices/groupChatSlice";
import { RootState } from "@/store";

const GroupChatListener = () => {
    const dispatch = useDispatch();
    const activeGroupId = useSelector((state: RootState) => state.groupChat.activeGroupId);
    const userId = useSelector((state: RootState) => state.auth.userId);

    useEffect(() => {
        const socket = getSocket();
        if (!socket) return;

        // Listen for group messages
        socket.on("receive-group-message", (data) => {
            console.log("📩 New group message:", data);
            // Only add message if it's not from the current user (to avoid duplicates)
            // The sender already added it optimistically
            if (data.senderId !== userId) {
                dispatch(addGroupMessage(data));
            }
        });

        // Listen for typing indicators
        socket.on("group-typing", ({ senderId, groupId }) => {
            console.log(`✍️ ${senderId} is typing in group ${groupId}`);
            // You can dispatch an action here to show typing indicator in UI
        });

        socket.on("stop-group-typing", ({ senderId, groupId }) => {
            console.log(`🛑 ${senderId} stopped typing in group ${groupId}`);
            // You can dispatch an action here to hide typing indicator
        });

        // Listen for member joined
        socket.on("group-member-joined", ({ groupId, userName }) => {
            console.log(`👤 ${userName} joined group ${groupId}`);
            // You can show a notification or update the member list
        });

        // Listen for member left
        socket.on("group-member-left", ({ groupId, userName }) => {
            console.log(`👋 ${userName} left group ${groupId}`);
            // You can show a notification or update the member list
        });

        return () => {
            socket.off("receive-group-message");
            socket.off("group-typing");
            socket.off("stop-group-typing");
            socket.off("group-member-joined");
            socket.off("group-member-left");
        };
    }, [dispatch, activeGroupId, userId]);

    return null;
};

export default GroupChatListener;
