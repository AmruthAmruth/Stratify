// src/pages/manager/ManagerMeeting.tsx
import React, { useState, useEffect } from "react";
import { createMeeting, getMeetingsByCreator } from "@/services/meetingService";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { VideoCall } from "@/shared/components/Meetings/VideoCall";

export const ManagerMeeting: React.FC = () => {
  const [title, setTitle] = useState("");
  const [meetings, setMeetings] = useState<any[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);

  const userName = useSelector((state: RootState) => state.auth.name);

  const fetchMeetings = async () => {
    try {
      const data = await getMeetingsByCreator();
      setMeetings(data);
    } catch (error) {
      console.error("Error fetching meetings:", error);
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) return alert("Please enter a meeting title");
    try {
      await createMeeting(title);
      setTitle("");
      fetchMeetings();
      alert("Meeting created successfully!");
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  if (activeRoomId) {
    return <VideoCall roomId={activeRoomId} userName={userName} />;
  }

  return (
    <div style={{ padding: "2rem" }} className="text-black">
      <h2>Manager Meeting Dashboard</h2>

      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Enter meeting title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handleCreate}>Create Meeting</button>
      </div>

      <h3>Your Meetings</h3>
      {meetings.length === 0 && <p>No meetings yet</p>}
      <ul>
        {meetings.map((m) => (
          <li key={m._id}>
            {m.title} — Room ID: {m.roomId}{" "}
            <button onClick={() => setActiveRoomId(m.roomId)}>Join</button>
          </li>
        ))}
      </ul>
    </div>
  );
};
