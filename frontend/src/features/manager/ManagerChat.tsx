import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setActiveConversation, addMessage } from "@/store/slices/chatSlice";
import { connectSocket } from "@/shared/services/socketService";
import { ChatRoom } from "@/shared/components/Chat/ChatRoom";

// Example companies (replace with real data from backend)
const companies = [
  { id: "68a4518fa64f6fb2aac09084", name: "Zil Money - Operations" },
  { id: "68b12345abcde67890fghijk", name: "Another Company" },
];

export const ManagerChat: React.FC = () => {
  const dispatch = useDispatch();
  const { accessToken, userId } = useSelector((state: RootState) => state.auth);

  const [socket, setSocket] = useState<any>(null);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  useEffect(() => {
    if (!accessToken || !userId) return;

    const newSocket = connectSocket(accessToken);
    setSocket(newSocket);

    newSocket.on("connect", () => console.log("✅ Connected as Manager:", newSocket.id));

    newSocket.on("messageReceived", (msg) => {
      console.log(msg);
      
      dispatch(addMessage(msg));
    });

    return () => newSocket.disconnect();
  }, [accessToken, userId, dispatch]);

  const handleSelectCompany = (company: any) => {
    setSelectedCompany(company);
    dispatch(setActiveConversation([userId, company.id].sort().join("_")));
  };

  return (
    <div className="flex h-[90vh] text-black">
      {/* Left Panel: Companies */}
      <div className="w-1/3 border-r border-gray-300 p-4">
        <h2 className="font-semibold text-lg mb-3">Companies</h2>
        {companies.map((company) => (
          <div
            key={company.id}
            onClick={() => handleSelectCompany(company)}
            className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
              selectedCompany?.id === company.id ? "bg-gray-200" : ""
            }`}
          >
            <p className="font-medium">{company.name}</p>
          </div>
        ))}
      </div>

      {/* Right Panel: Chat Room */}
      <div className="w-2/3 p-4 flex flex-col">
        {selectedCompany ? (
          <ChatRoom />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select a company to start chatting
          </div>
        )}
      </div>
    </div>
  );
};
