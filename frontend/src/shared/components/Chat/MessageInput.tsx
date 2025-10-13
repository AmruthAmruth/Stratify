import { useSocketContext } from '@/context/SocketProvider';
import React, { useState } from 'react';


export const MessageInput: React.FC<{ conversationId: string; senderId: string }> = ({ conversationId, senderId }) => {
const { socket } = useSocketContext();
const [content, setContent] = useState('');


const handleSend = () => {
if (!socket || !content) return;
socket.emit('sendMessage', { conversationId, content, senderId });
setContent('');
};


return (
<div className='p-2 flex'>
<input type='text' value={content} onChange={e => setContent(e.target.value)} className='flex-1 border rounded p-2 mr-2'/>
<button onClick={handleSend} className='bg-blue-500 text-white p-2 rounded'>Send</button>
</div>
);
};