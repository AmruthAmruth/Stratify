import React, { useState } from "react";
import VideoCall from "@/shared/components/VideoCall/VideoCall";
import { ZegoUIKitPrebuilt } from "@zegocloud/zego-uikit-prebuilt";

const appId = Number(import.meta.env.VITE_ZEGO_APP_ID);
const serverSecret = import.meta.env.VITE_ZEGO_SERVER_SECRET;

const JoinMeeting: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const [userName, setUserName] = useState("");
  const [zegoToken, setZegoToken] = useState("");

  const handleJoin = async () => {
    if (!roomId || !userName) return;

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
      appId,
      serverSecret,
      roomId,
      Date.now().toString(),
      userName
    );
    setZegoToken(kitToken);
  };

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
