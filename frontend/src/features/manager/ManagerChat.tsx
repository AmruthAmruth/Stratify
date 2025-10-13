import { ChatList } from '@/shared/components/Chat/ChatList';
import { ChatWindow } from '@/shared/components/Chat/ChatWindow';
import { chatService } from '@/services/chatService';
import { setActiveConversation, setConversations } from '@/store/slices/chatSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export const ManagerChat: React.FC = () => {
  const dispatch = useDispatch();
  const currentUserId = useSelector((state: any) => state.auth.userId);
  const activeConversationId = useSelector((state: any) => state.chat.activeConversationId);
  const conversations = useSelector((state: any) => state.chat.conversations);

  const [employees, setEmployees] = useState<{ id: string; name: string }[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');

  // Load manager's conversations
  useEffect(() => {
    if (!currentUserId) return;
    chatService.getConversations(currentUserId).then(c => dispatch(setConversations(c)));
  }, [currentUserId]);

  // Load employees list (mock or API)
  useEffect(() => {
    // TODO: replace with actual API call to fetch employees
    setEmployees([
      { id: 'emp1', name: 'Alice' },
      { id: 'emp2', name: 'Bob' },
      { id: 'emp3', name: 'Charlie' },
    ]);
  }, []);

  const handleStartChat = async () => {
    if (!selectedEmployee) return;
    try {
      // Check if conversation already exists
      let conversation = conversations.find(c =>
        c.participants.includes(currentUserId) && c.participants.includes(selectedEmployee)
      );

      if (!conversation) {
        // Create new conversation
        conversation = await chatService.createConversation([currentUserId, selectedEmployee]);
        dispatch(setConversations([...conversations, conversation]));
      }

      // Open it
      dispatch(setActiveConversation(conversation.id));
    } catch (err) {
      console.error('Failed to start conversation', err);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left sidebar */}
      <div className="w-1/4 border-r flex flex-col">
        <div className="p-3 border-b">
          <select
            className="w-full border p-1"
            value={selectedEmployee}
            onChange={e => setSelectedEmployee(e.target.value)}
          >
            <option value="">Select employee</option>
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>
                {emp.name}
              </option>
            ))}
          </select>
          <button
            className="mt-2 w-full bg-blue-500 text-white p-1 rounded"
            onClick={handleStartChat}
          >
            Start Chat
          </button>
        </div>

        <ChatList userId={currentUserId} />
      </div>

      {/* Chat messages */}
      <div className="flex-1 flex flex-col">
        {activeConversationId ? (
          <ChatWindow conversationId={activeConversationId} currentUserId={currentUserId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation or start a new chat
          </div>
        )}
      </div>
    </div>
  );
};
