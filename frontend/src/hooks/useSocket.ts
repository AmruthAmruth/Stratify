import { useEffect } from "react";
import { useSocketContext } from "../context/SocketProvider";

export function useSocket(event: string, handler: (data: any) => void) {
  const { socket } = useSocketContext();

  useEffect(() => {
    if (!socket) return;
    socket.on(event, handler);
    return () => {
      socket.off(event, handler);
    };
  }, [socket, event, handler]);
}
