import React, { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';


interface SocketContextType {
socket: Socket | null;
isConnected: boolean;
}


const SocketContext = createContext<SocketContextType>({ socket: null, isConnected: false });


export const SocketProvider: React.FC<{ token: string; children: React.ReactNode }> = ({ token, children }) => {
const [socket, setSocket] = useState<Socket | null>(null);
const [isConnected, setIsConnected] = useState(false);


useEffect(() => {
if (!token) return;
const socketInstance = io(import.meta.env.VITE_API_WS_URL || 'http://localhost:7000', {
auth: { token }, transports: ['websocket'], reconnection: true
});


socketInstance.on('connect', () => setIsConnected(true));
socketInstance.on('disconnect', () => setIsConnected(false));


setSocket(socketInstance);
return () => { socketInstance.disconnect(); };
}, [token]);


return <SocketContext.Provider value={{ socket, isConnected }}>{children}</SocketContext.Provider>;
};


export const useSocketContext = () => useContext(SocketContext);