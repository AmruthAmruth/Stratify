import React, { useState } from "react";
import VideoCall from "@/shared/components/VideoCall/VideoCall";
import { generateToken } from "@/services/meetingService";

const JoinMeeting: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [zegoToken, setZegoToken] = useState("");

  const handleJoin = async () => {
    if (!roomId || !userName) return;

    try {
      // 1. Request token from backend for this user
      const response = await generateToken(roomId, userName);

      // 2. Use returned token to join the meeting
      setZegoToken(response.token);
    } catch (err) {
      console.error("Error generating token:", err);
    }
  };

  // 3. If token is ready, join the video call
  if (zegoToken) {
    return <VideoCall roomId={roomId} userName={userName} token={zegoToken} />;
  }

  return (
    <div className="flex flex-col items-center mt-10">
      <h2 className="text-xl font-semibold mb-4">Join Meeting</h2>

      <input
        type="text"
        placeholder="Enter Room ID"
        className="border px-3 py-2 rounded mb-3"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />

      <input
        type="text"
        placeholder="Enter Your Name"
        className="border px-3 py-2 rounded mb-3"
        value={userName}
        onChange={(e) => setUserName(e.target.value)}
      />

      <button
        onClick={handleJoin}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Join Meeting
      </button>
    </div>
  );
};

export default JoinMeeting;
