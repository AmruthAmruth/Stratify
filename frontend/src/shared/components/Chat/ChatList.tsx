import { chatService } from '@/services/chatService';
import { setActiveConversation, setConversations } from '@/store/slices/chatSlice';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';


export const ChatList: React.FC<{ userId: string }> = ({ userId }) => {
const dispatch = useDispatch();
const conversations = useSelector((state: any) => state.chat.conversations);


useEffect(() => { chatService.getConversations(userId).then(c => dispatch(setConversations(c))); }, [userId]);


return (
<div className='overflow-auto h-full border-r'>
{conversations.map(conv => (
<div key={conv.id} className='p-3 hover:bg-gray-100 cursor-pointer' onClick={() => dispatch(setActiveConversation(conv.id))}>
<p>{conv.companyId} - {conv.lastMessage || 'No messages yet'}</p>
</div>
))}
</div>
);
};