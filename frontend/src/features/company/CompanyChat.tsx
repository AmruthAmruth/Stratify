import { ChatList } from '@/shared/components/Chat/ChatList';
import { ChatWindow } from '@/shared/components/Chat/ChatWindow';
import React from 'react';
import { useSelector } from 'react-redux';

export const CompanyChat: React.FC = () => {
 const currentUserId = useSelector((state: any) => state.auth.userId);
  const activeConversationId = useSelector((state: any) => state.chat.activeConversationId);

  return (
    <div className="flex h-screen">
      {/* Conversation list */}
      <div className="w-1/4 border-r">
        <ChatList userId={currentUserId} />
      </div>

      {/* Chat messages */}
      <div className="flex-1 flex flex-col">
        {activeConversationId ? (
          <ChatWindow conversationId={activeConversationId} currentUserId={currentUserId} />
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Select a conversation
          </div>
        )}
      </div>
    </div>
  );
}