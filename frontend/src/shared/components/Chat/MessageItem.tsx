import { Message } from '@/types/chat';
import React from 'react';


export const MessageItem: React.FC<{ message: Message; currentUserId: string }> = ({ message, currentUserId }) => (
<div className={`p-2 my-1 rounded ${message.senderId === currentUserId ? 'bg-blue-500 text-white self-end' : 'bg-gray-200 self-start'}`}>{message.content}</div>
);