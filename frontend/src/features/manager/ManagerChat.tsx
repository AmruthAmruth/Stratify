import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { setActiveConversation, addMessage } from "@/store/slices/chatSlice";
import { connectSocket } from "@/shared/services/socketService";
import { ChatRoom } from "@/shared/components/Chat/ChatRoom";
import { getMemebersForManager } from "@/services/chat";

interface Employee {
  id: string;
  name: string;
  position?: string;
  role?: string;
}

interface CompanyData {
  company: { id: string; name: string };
  employees: Employee[];
}

export const ManagerChat: React.FC = () => {
  const dispatch = useDispatch();
  const { accessToken, userId } = useSelector((state: RootState) => state.auth);

  const [socket, setSocket] = useState<any>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch team data for manager
  const fetchTeam = async () => {
    try {
      const data = await getMemebersForManager();
      console.log("📦 Manager Data:", data);
      if (data && data.company && data.employees) {
        setCompanyData(data);
      } else {
        console.warn("⚠️ Invalid data format from backend");
        setCompanyData(null);
      }
    } catch (error) {
      console.error("❌ Failed to fetch team:", error);
      setCompanyData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();

    if (!accessToken || !userId) return;

    const newSocket = connectSocket(accessToken);
    setSocket(newSocket);

    newSocket.on("connect", () => console.log("✅ Connected as Manager:", newSocket.id));

    newSocket.on("messageReceived", (msg: any) => {
      console.log("📩 Message Received:", msg);
      dispatch(addMessage(msg));
    });

    return () => newSocket.disconnect();
  }, [accessToken, userId, dispatch]);

  const handleSelectEmployee = (employee: Employee) => {
    setSelectedEmployee(employee);
    dispatch(setActiveConversation([userId, employee.id].sort().join("_")));
  };

  return (
    <div className="flex h-[90vh] text-black">
      {/* Left Panel: Employees under this Manager */}
      <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto">
        <h2 className="font-semibold text-lg mb-3">
          {companyData ? companyData.company.name : "Company"}
        </h2>

        {loading ? (
          <p className="text-gray-500">Loading team...</p>
        ) : !companyData || companyData.employees.length === 0 ? (
          <p className="text-gray-500">No employees found.</p>
        ) : (
          companyData.employees.map((emp) => (
            <div
              key={emp.id}
              onClick={() => handleSelectEmployee(emp)}
              className={`p-2 rounded-md cursor-pointer hover:bg-gray-100 ${
                selectedEmployee?.id === emp.id ? "bg-gray-200" : ""
              }`}
            >
              <p className="font-medium">{emp.name}</p>
              <p className="text-sm text-gray-500">
                {emp.position || "No position specified"}
              </p>
            </div>
          ))
        )}
      </div>

      {/* Right Panel: Chat Room */}
      <div className="w-2/3 p-4 flex flex-col">
        {selectedEmployee ? (
          <ChatRoom />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-500">
            Select an employee to start chatting
          </div>
        )}
      </div>
    </div>
  );
};
