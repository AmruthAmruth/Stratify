import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { employeeMeetings } from "@/services/meetingService";
import { VideoCall } from "@/shared/components/Meetings/VideoCall";
import Table from "@/shared/components/Table/Table";
import { RootState } from "@/store";
import { enqueueSnackbar } from "notistack";

export const EmployeeJoinMeeting: React.FC = () => {
  const [meetings, setMeetings] = useState<any[]>([]);
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const userName = useSelector((state: RootState) => state.auth.name);

  // Fetch all available meetings for the employee
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await employeeMeetings();
        setMeetings(data || []);
      } catch (err) {
        console.error("Failed to fetch meetings:", err);
        enqueueSnackbar("Failed to load meetings", { variant: "error" });
      }
    };

    fetchMeetings();
  }, []);

  // Paginate the meetings
  const paginatedData = meetings
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map((meeting) => ({
      id: meeting.id,
      title: meeting.title,
      status: meeting.status,
      createdAt: new Date(meeting.createdAt).toLocaleString(),
      roomId: meeting.roomId,
    }));

  const totalPages = Math.ceil(meetings.length / itemsPerPage);

  // Handle joining the meeting
  const handleJoinMeeting = (roomId: string) => {
    setRoomId(roomId);
    setJoined(true);
  };

  // If user joined a meeting, show VideoCall component
  if (joined) {
    return <VideoCall roomId={roomId} userName={userName} />;
  }

  return (
    <div className="bg-[#fbfbfb] p-6 rounded-xl border border-[#dfdcef] shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#3b3b3b] mb-2">Available Meetings</h2>
        <p className="text-sm text-[#3b3b3b]/60">
          Join ongoing or scheduled meetings with your team and stay connected.
        </p>
      </div>

      <Table
        columns={[
          { key: "title", label: "Meeting Title" },
          { key: "status", label: "Status" },
          { key: "createdAt", label: "Created At" },
        ]}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        actions={[
          {
            label: "Join",
            type: "custom",
            onClick: (row) => handleJoinMeeting(row.roomId),
          },
        ]}
      />
    </div>
  );
};