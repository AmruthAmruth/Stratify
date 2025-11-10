import React, { useState, useEffect } from "react";
import { createMeeting, getMeetingsByCreator } from "@/services/meetingService";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { VideoCall } from "@/shared/components/Meetings/VideoCall";
import Table from "@/shared/components/Table/Table";
import { useSnackbar } from "notistack";

export const ManagerMeeting: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [title, setTitle] = useState("");
  const [meetings, setMeetings] = useState<any[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const userName = useSelector((state: RootState) => state.auth.name);

  const fetchMeetings = async () => {
    try {
      const data = await getMeetingsByCreator();
      setMeetings(data);
    } catch (error: any) {
      console.error("Error fetching meetings:", error);
      enqueueSnackbar("Failed to fetch meetings", { variant: "error" });
    }
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) {
      enqueueSnackbar("Please enter a meeting title", { variant: "warning" });
      return;
    }

    try {
      await createMeeting(title);
      setTitle("");
      fetchMeetings();
      enqueueSnackbar("Meeting created successfully!", { variant: "success" });
    } catch (error: any) {
      console.error("Error creating meeting:", error);
      enqueueSnackbar("Failed to create meeting", { variant: "error" });
    }
  };

  const handleJoin = (meeting: any) => {
    setActiveRoomId(meeting.roomId);
  };

  if (activeRoomId) {
    return <VideoCall roomId={activeRoomId} userName={userName} />;
  }

  // ============== Pagination Logic ==============
  const totalPages = Math.ceil(meetings.length / itemsPerPage);
  const paginatedMeetings = meetings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ============== Table Config ==============
  const columns = [
    { key: "title", label: "Meeting Title" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
  ];

  const renderCell = (row: any, key: string) => {
    if (key === "createdAt") {
      return new Date(row.createdAt).toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
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

    return row[key];
  };

  const actions = [
    {
      label: "Join",
      type: "approve",
      onClick: (row: any) => handleJoin(row),
    },
  ];

  return (
    <div className="p-8 text-gray-800">
      {/* ====== Header Section ====== */}
    <div className="mb-8 bg-[#fbfbfb] p-6 rounded-xl border border-[#dfdcef] shadow-sm">
  <h1 className="text-2xl font-bold text-[#3b3b3b] mb-2">Manager Meetings</h1>
  <p className="text-sm text-[#3b3b3b]/60">
    Create and manage your meetings with your team.
  </p>
</div>
      {/* ====== Create Meeting Form ====== */}
     <div className="bg-[#fbfbfb] p-6 rounded-xl shadow-lg mb-8 flex items-center gap-4 border border-[#dfdcef]">
  <input
    type="text"
    placeholder="Enter meeting title..."
    value={title}
    onChange={(e) => setTitle(e.target.value)}
    className="flex-1 border border-[#dfdcef] rounded-lg px-4 py-2 text-sm text-[#3b3b3b] focus:outline-none focus:ring-2 focus:ring-[#009063] placeholder:text-[#3b3b3b]/60 bg-white"
  />
  <button
    onClick={handleCreate}
    className="bg-[#009063] text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-[#007a4d] transition-all hover:shadow-lg hover:scale-105"
  >
    + Create Meeting
  </button>
</div>

      {/* ====== Meetings Table ====== */}
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <h2 className="text-lg font-semibold mb-4 text-gray-900">
          Your Meetings
        </h2>

        <Table
          columns={columns}
          data={paginatedMeetings}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          renderCell={renderCell}
          actions={actions}
        />
      </div>
    </div>
  );
};

export default ManagerMeeting;
