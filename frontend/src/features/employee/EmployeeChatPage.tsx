import { useState } from "react";
import ChatBox from "@/shared/components/Chat/ChatBox";

const EmployeeChatPage = () => {
    
  const [manager] = useState({ id: "68d65b4e441d94a5ffcf5bb6", name: "Mammuty" });

  const managerId = manager?.id;

  if (!managerId) {
    return (
      <p className="text-center text-gray-500 mt-10">
        No manager assigned.
      </p>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 shadow-md">
        <h2 className="text-lg font-semibold">
          Chat with Manager: {manager.name}
        </h2>
      </div>

      {/* Chat Box */}
      <div className="flex-1 flex items-center justify-center p-4">
        <ChatBox receiverId={managerId} />
      </div>
    </div>
  );
};

export default EmployeeChatPage;
