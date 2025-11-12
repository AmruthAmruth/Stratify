import { useEffect } from "react";
import { getSocket } from "./socket";
import { useDispatch } from "react-redux";
import { addMessage } from "@/store/slices/chatSlice";

const ChatListener = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    socket.on("receive-message", (data) => {
      console.log("📩 New chat message:", data);
      dispatch(addMessage(data));
    });

    return () => {
      socket.off("receive-message");
    };
  }, [dispatch]);

  return null;
};

export default ChatListener;
