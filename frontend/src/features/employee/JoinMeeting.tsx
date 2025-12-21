import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { employeeMeetings } from "@/services/meetingService";
import { VideoCall } from "@/shared/components/Meetings/VideoCall";
import Table from "@/shared/components/Table/Table";
import { RootState } from "@/store";
import { enqueueSnackbar } from "notistack";
import { Meeting } from "@/types/types";

const JoinMeeting: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [joined, setJoined] = useState(false);
  const [roomId, setRoomId] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 6;

  const userName = useSelector((state: RootState) => state.auth.name);

  // Fetch meetings
  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const data = await employeeMeetings();
        setMeetings(data || []);
      } catch (error) {
        console.error("Failed to fetch meetings:", error);
        enqueueSnackbar("Failed to load meetings", { variant: "error" });
      }
    };

    fetchMeetings();
  }, []);

  // Pagination
  const paginatedData = meetings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(meetings.length / itemsPerPage);

  const handleJoinMeeting = (roomId: string) => {
    setRoomId(roomId);
    setJoined(true);
  };

  if (joined) {
    return <VideoCall roomId={roomId} userName={userName} />;
  }

  const renderCell = (
    row: Meeting,
    key: keyof Meeting | "type"
  ): React.ReactNode => {
    if (key === "createdAt" || key === "scheduledDate") {
      const value = row[key];
      if (!value) return "-";

      const date = new Date(value);
      return date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    if (key === "type") {
      return (
        <div className="flex gap-1 flex-wrap">
          {row.isRecurring && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
              Recurring
            </span>
          )}
          {row.projectId && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-700">
              Project
            </span>
          )}
          {!row.isRecurring && !row.projectId && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
              General
            </span>
          )}
        </div>
      );
    }

    if (key === "status") {
      const color =
        row.status === "open"
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700";

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {row.status}
        </span>
      );
    }

    return row[key] ?? "";
  };

  return (
    <div className="bg-[#fbfbfb] p-6 rounded-xl border border-[#dfdcef] shadow-sm">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-[#3b3b3b] mb-2">
          Available Meetings
        </h2>
        <p className="text-sm text-[#3b3b3b]/60">
          Join ongoing or scheduled meetings with your team and stay connected.
        </p>
      </div>

      <Table
        columns={[
          { key: "title", label: "Meeting Title" },
          { key: "type", label: "Type" },
          { key: "scheduledDate", label: "Scheduled Time" },
          { key: "status", label: "Status" },
          { key: "createdAt", label: "Created At" },
        ]}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        renderCell={renderCell}
        actions={[
          {
            label: "Join",
            type: "custom",
            onClick: (row: Meeting) => handleJoinMeeting(row.roomId),
          },
        ]}
      />
    </div>
  );
};

export default JoinMeeting;
