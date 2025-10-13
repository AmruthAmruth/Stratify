import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { MessageItem } from './MessageItem';
import { MessageInput } from './MessageInput';
import { chatService } from '@/services/chatService';
import { addMessage, setMessages } from '@/store/slices/chatSlice';
import { useSocket } from '@/hooks/useSocket';
import { Message } from '@/types/chat';

interface Props {
  conversationId: string;
  currentUserId: string;
}

export const ChatWindow: React.FC<Props> = ({ conversationId, currentUserId }) => {
  const dispatch = useDispatch();
  const messages = useSelector((state: any) => state.chat.messages[conversationId] || []);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Fetch messages when conversationId changes
  useEffect(() => {
    if (!conversationId) return;

    chatService.getMessages(conversationId).then((msgs: Message[]) => {
      dispatch(setMessages({ conversationId, messages: msgs }));
    });
  }, [conversationId]);

  // Scroll to bottom when new message arrives
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Listen to incoming messages via socket
  useSocket('messageReceived', (msg: Message) => {
    if (msg.conversationId === conversationId) {
      dispatch(addMessage(msg));
    }
  });

  if (!conversationId) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-400">
        Select a conversation
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages container */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50"
      >
        {messages.map((msg: Message) => (
          <MessageItem key={msg.id} message={msg} currentUserId={currentUserId} />
        ))}
      </div>

      {/* Message input */}
      <div className="border-t">
        <MessageInput conversationId={conversationId} senderId={currentUserId} />
      </div>
    </div>
  );
};
