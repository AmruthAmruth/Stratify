import { Server } from "socket.io";

class SocketService {
    private static _io: Server | null = null;

    public static setIO(io: Server) {
        this._io = io;
    }

    public static getIO(): Server {
        if (!this._io) {
            throw new Error("Socket.IO not initialized!");
        }
        return this._io;
    }

    public static getIOOrNull(): Server | null {
        return this._io;
    }
}

export { SocketService };
