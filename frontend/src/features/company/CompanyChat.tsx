import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setActiveConversation, addMessage } from "@/store/slices/chatSlice";
import { connectSocket } from "@/shared/services/socketService";
import { ChatRoom } from "@/shared/components/Chat/ChatRoom";
import { getMemebersForCompany } from "@/services/chat";

interface Manager {
  id: string;
  name: string;
  position?: string;
  role?: string;
}

export const CompanyChat: React.FC = () => {
  const dispatch = useDispatch();
  const { accessToken, userId } = useSelector((state: RootState) => state.auth);
  const [socket, setSocket] = useState<any>(null);
  const [selectedManager, setSelectedManager] = useState<Manager | null>(null);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchTeam = async () => {
    try {
      const data = await getMemebersForCompany();
      if (data && data.managers) {
        setManagers(data.managers);
      } else {
        console.warn("⚠️ No managers found in response");
        setManagers([]);
      }
    } catch (err) {
      console.error("❌ Failed to fetch team:", err);
      setManagers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();

    if (!accessToken || !userId) return;

    const newSocket = connectSocket(accessToken);
    setSocket(newSocket);

    newSocket.on("connect", () =>
      console.log("✅ Connected as Company:", newSocket.id)
    );

    newSocket.on("messageReceived", (msg: any) => {
      dispatch(addMessage(msg));
      console.log("📩 Message received:", msg);
    });

    return () => newSocket.disconnect();
  }, [accessToken, userId, dispatch]);

  const handleSelectManager = (manager: Manager) => {
    setSelectedManager(manager);
    dispatch(setActiveConversation([userId, manager.id].sort().join("_")));
  };

  return (
    <div className="flex h-[90vh] text-black">
      {/* Left panel: Managers list */}
      <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
      

        {loading ? (
          <p className="text-gray-500">Loading managers...</p>
        ) : managers.length === 0 ? (
          <p className="text-gray-500">No managers found.</p>
        ) : (
          managers.map((manager) => (
            <div
              key={manager.id}
              onClick={() => handleSelectManager(manager)}
              className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                selectedManager?.id === manager.id ? "bg-gray-200" : ""
              }`}
            >
              <p className="font-medium">{manager.name}</p>
              <p className="text-sm text-gray-500">
                {manager.position || "No position specified"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Right panel: Chat window */}
      <div className="w-2/3 p-4 flex flex-col">
        {selectedManager ? (
          <ChatRoom />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a manager to start chatting
          </div>
        )}
      </div>
    </div>
  );
};
