import React, { useState } from "react";
import { createMeeting } from "@/services/meetingService";

const CreateMeeting: React.FC = () => {
  const [title, setTitle] = useState("");
  const [roomId, setRoomId] = useState("");

  const handleCreateMeeting = async () => {
    if (!title) return;
    const response = await createMeeting(title);
    console.log(response);
    
    setRoomId(response.roomId);
  };

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-xl font-semibold mb-4">Create Meeting</h2>
      <input
        type="text"
        placeholder="Meeting title"
        className="border px-3 py-2 rounded mb-3"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <button
        onClick={handleCreateMeeting}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Create Meeting
      </button>

      {roomId && (
        <div className="mt-5 text-center">
          <p className="text-green-600 font-semibold">Meeting Created!</p>
          <p>Room ID: {roomId}</p>
          <p>Share this ID with employees to join the meeting.</p>
        </div>
      )}
    </div>
  );
};

export default CreateMeeting;
