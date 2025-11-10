// src/pages/employee/EmployeeJoinMeeting.tsx
import { VideoCall } from "@/shared/components/Meetings/VideoCall";
import { RootState } from "@/store";
import React, { useState } from "react";
import { useSelector } from "react-redux";

export const EmployeeJoinMeeting: React.FC = () => {
  const [roomId, setRoomId] = useState("");
  const [joined, setJoined] = useState(false);
  
  const userName = useSelector((state: RootState) => state.auth.name);

  if (joined) {
    return <VideoCall roomId={roomId} userName={userName} />;
  }

  return (
    <div style={{ padding: "2rem" }} className="text-black">
      <h2>Join a Meeting</h2>
      <input
        type="text"
        placeholder="Enter Room ID"
        value={roomId}
        onChange={(e) => setRoomId(e.target.value)}
      />
      <button onClick={() => setJoined(true)}>Join</button>
    </div>
  );
};
