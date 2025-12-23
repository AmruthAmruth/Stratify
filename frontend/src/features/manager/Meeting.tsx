import React, { useState, useEffect } from "react";
import { closeMeeting, createMeeting, getMeetingsByCreator } from "@/services/meetingService";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { VideoCall } from "@/shared/components/Meetings/VideoCall";
import Table from "@/shared/components/Table/Table";
import { useSnackbar } from "notistack";
import { Meeting } from "@/types/types";

const ManagerMeeting: React.FC = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [title, setTitle] = useState("");
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [activeRoomId, setActiveRoomId] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const userName = useSelector((state: RootState) => state.auth.name);

  const fetchMeetings = React.useCallback(async () => {
    try {
      const data = await getMeetingsByCreator();
      setMeetings(Array.isArray(data) ? data : []);
    } catch (error: unknown) {
      console.error("Error fetching meetings:", error);
      enqueueSnackbar("Failed to fetch meetings", { variant: "error" });
    }
  }, [enqueueSnackbar]);

  useEffect(() => {
    fetchMeetings();
  }, [fetchMeetings]);

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
    } catch (error: unknown) {
      console.error("Error creating meeting:", error);
      const errorMessage = (error as Error)?.message || "Failed to create meeting";
      enqueueSnackbar(errorMessage, { variant: "error" });
    }
  };

  const handleJoin = (meeting: Meeting) => {
    setActiveRoomId(meeting.roomId);
  };

  const handleCloseMeeting = async (roomId: string) => {
    try {
      await closeMeeting(roomId);
      enqueueSnackbar("Meeting closed successfully!", { variant: "success" });
      fetchMeetings(); // Refresh the list to update status
    } catch (error: unknown) {
      console.error("Error closing meeting:", error);
      enqueueSnackbar("Failed to close meeting", { variant: "error" });
    }
  };

  if (activeRoomId) {
    return <VideoCall roomId={activeRoomId} userName={userName} />;
  }

  // Pagination
  const totalPages = Math.ceil(meetings.length / itemsPerPage);
  const paginatedMeetings = meetings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Table Columns
  const columns = [
    { key: "title", label: "Meeting Title" },
    { key: "type", label: "Type" },
    { key: "scheduledDate", label: "Scheduled Time" },
    { key: "status", label: "Status" },
    { key: "createdAt", label: "Created At" },
  ];

  const renderCell = (row: Meeting, key: string) => {
    if (key === "createdAt" || key === "scheduledDate") {
      const dateString = row[key] as string;
      const date = dateString ? new Date(dateString) : null;
      return date ? date.toLocaleString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }) : "-";
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
          ? "bg-green-100 text-primaryHover"
          : "bg-red-100 text-red-700";
      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>
          {row.status}
        </span>
      );
    }

    return (row[key] as React.ReactNode) || ""; // Handle null/undefined
  };

  // Table Actions (Join + Close)
  const actions: { label: string; type: "approve" | "delete"; onClick: (row: Meeting) => void; show: (row: Meeting) => boolean }[] = [
    {
      label: "Join",
      type: "approve",
      onClick: (row: Meeting) => handleJoin(row),
      show: (row: Meeting) => row.status === "open", // Only show join for open meetings
    },
    {
      label: "Close",
      type: "delete",
      onClick: (row: Meeting) => handleCloseMeeting(row.roomId),
      show: (row: Meeting) => row.status === "open", // Only show close for open meetings
    },
  ];

  return (
    <div className="p-8 text-gray-800">
      {/* Header */}
      <div className="mb-8 bg-bg p-6 rounded-xl border border-accent shadow-sm">
        <h1 className="text-2xl font-bold text-text mb-2">Manager Meetings</h1>
        <p className="text-sm text-text/60">
          Create and manage your meetings with your team.
        </p>
      </div>

      {/* Create Meeting */}
      <div className="bg-bg p-6 rounded-xl shadow-lg mb-8 flex items-center gap-4 border border-accent">
        <input
          type="text"
          placeholder="Enter meeting title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="flex-1 border border-accent rounded-lg px-4 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary placeholder:text-text/60 bg-surface"
        />
        <button
          onClick={handleCreate}
          className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium shadow-md hover:bg-primaryHover transition-all hover:shadow-lg hover:scale-105"
        >
          + Create Meeting
        </button>
      </div>

      {/* Meetings Table */}
      <div className="bg-surface p-6 rounded-xl shadow-md border border-accent">
        <h2 className="text-lg font-semibold mb-4 text-heading">Your Meetings</h2>

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
