import { useState } from "react";
import ChatBox from "@/shared/components/Chat/ChatBox";

interface Employee {
  id: string;
  name: string;
}

const ManagerChatPage = () => {
  const employees: Employee[] = [
    { id: "68db6613fd33754f08625031", name: "Asif Ali" },
    { id: "emp002", name: "Alice Johnson" },
    { id: "emp003", name: "Robert Brown" },
  ];

  const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null);

  return (
    <div className="flex h-screen text-black">
      {/* Sidebar with employee list */}
      <div className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-semibold mb-3">Employees</h2>
        <ul>
          {employees.map((emp) => (
            <li
              key={emp.id}
              onClick={() => setSelectedEmployee(emp.id)}
              className={`cursor-pointer p-2 rounded-lg mb-2 transition ${
                selectedEmployee === emp.id
                  ? "bg-blue-200 text-blue-800"
                  : "bg-white hover:bg-gray-100"
              }`}
            >
              {emp.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat box */}
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        {selectedEmployee ? (
          <ChatBox receiverId={selectedEmployee} />
        ) : (
          <p className="text-gray-500">Select an employee to start chatting</p>
        )}
      </div>
    </div>
  );
};

export default ManagerChatPage;
