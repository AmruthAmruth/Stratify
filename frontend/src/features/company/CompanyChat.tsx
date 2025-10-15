import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setActiveConversation, addMessage } from "@/store/slices/chatSlice";
import { connectSocket } from "@/shared/services/socketService";
import { ChatRoom } from "@/shared/components/Chat/ChatRoom";

const managers = [
  { id: "68d65b4e441d94a5ffcf5bb6", name: "Mammuty", position: "Software Developer" },
  { id: "68c5718e256f75bafaa4861d", name: "Anees PP", position: "Python Developer" },
];

export const CompanyChat: React.FC = () => {
  const dispatch = useDispatch();
  const { accessToken, userId } = useSelector((state: RootState) => state.auth);
  const [socket, setSocket] = useState<any>(null);
  const [selectedManager, setSelectedManager] = useState<any>(null);

  useEffect(() => {
    if (!accessToken || !userId) return;

    const newSocket = connectSocket(accessToken);
    setSocket(newSocket);

    newSocket.on("connect", () => console.log("✅ Connected as Company:", newSocket.id));
    
    newSocket.on("messageReceived",((msg)=>{
      dispatch(addMessage(msg))
      console.log(msg);
      
    }))
    return () => newSocket.disconnect();
  }, [accessToken, userId, dispatch]);

  const handleSelectManager = (manager: any) => {
    setSelectedManager(manager);
    dispatch(setActiveConversation([userId, manager.id].sort().join("_")));
  };

  return (
    <div className="flex h-[90vh] text-black">
      <div className="w-1/3 border-r border-gray-300 p-4">
        <h2 className="font-semibold text-lg mb-3">Managers</h2>
        {managers.map((manager) => (
          <div
            key={manager.id}
            onClick={() => handleSelectManager(manager)}
            className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
              selectedManager?.id === manager.id ? "bg-gray-200" : ""
            }`}
          >
            <p className="font-medium">{manager.name}</p>
            <p className="text-sm text-gray-500">{manager.position}</p>
          </div>
        ))}
      </div>

      <div className="w-2/3 p-4 flex flex-col">
        {selectedManager ? <ChatRoom /> : <div className="flex-1 flex items-center justify-center text-gray-500">Select a manager to start chatting</div>}
      </div>
    </div>
  );
};
