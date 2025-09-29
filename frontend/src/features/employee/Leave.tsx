import DashboardCard from '@/shared/components/DashboardCards/Cards';
import Table from '@/shared/components/Table/Table';


import React, { useState } from 'react';

const Leave = () => {
  // Leave counts for dashboard
  const leaveCounts = {
    Casual: 2,
    Sick: 2,
    Earned: 1,
  };

  // Leave records
  const leaveRecords = [
    {
      employeeId: "12345",
      startDate: new Date("2025-10-01"),
      endDate: new Date("2025-10-03"),
      type: "Casual" as "Casual" | "Sick" | "Earned" | "Other",
      status: "Pending" as "Pending" | "Approved" | "Rejected",
      reason: "Family function"
    },
    {
      employeeId: "12345",
      startDate: new Date("2025-10-15"),
      endDate: new Date("2025-10-16"),
      type: "Sick" as "Casual" | "Sick" | "Earned" | "Other",
      status: "Approved" as "Pending" | "Approved" | "Rejected",
      reason: "Fever and rest"
    },
    {
      employeeId: "12345",
      startDate: new Date("2025-11-01"),
      endDate: new Date("2025-11-05"),
      type: "Earned" as "Casual" | "Sick" | "Earned" | "Other",
      status: "Rejected" as "Pending" | "Approved" | "Rejected",
      reason: "Vacation leave"
    }
  ];

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Map leave records to table-friendly format and add remaining days
  const paginatedData = leaveRecords
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map(record => ({
      startDate: record.startDate.toDateString(),
      endDate: record.endDate.toDateString(),
      status: record.status,
      reason: record.reason,
      type: record.type,
      remainingTimeInDays: Math.max(
        0,
        Math.ceil((record.endDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      ),
      id: record.employeeId
    }));

  const totalPages = Math.ceil(leaveRecords.length / itemsPerPage);

  const handleViewProject = (id: string) => {
    alert(`Viewing details for leave ${id}`);
  };

  return (
    <div className="bg-white text-black p-4">
      {/* Dashboard cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard
          title="Casual Leave"
          value={leaveCounts.Casual}
          subtitle="Available Casual Leave"
          trend={leaveCounts.Casual > 0 ? "up" : "down"}
        />
        <DashboardCard
          title="Sick Leave"
          value={leaveCounts.Sick}
          subtitle="Available Sick Leave"
          trend={leaveCounts.Sick > 0 ? "up" : "down"}
        />
        <DashboardCard
          title="Earned Leave"
          value={leaveCounts.Earned}
          subtitle="Available Earned Leave"
          trend={leaveCounts.Earned > 0 ? "up" : "down"}
        />
      </div>

      {/* Table */}
      <Table
        columns={[
          { key: "type", label: "Leave Type" },
          { key: "reason", label: "Reason" },
          { key: "status", label: "Status" },
          { key: "remainingTimeInDays", label: "Remaining Days" },
        ]}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        actions={[
          { label: "View More", type: "custom", onClick: (row) => handleViewProject(row.id) },
          { label: "Edit", type: "edit", onClick: (row) => alert(`Editing ${row.type} leave`) },
          { label: "Archive", type: "delete", onClick: (row) => alert(`Archiving ${row.type} leave`) },
        ]}
      />
    </div>
  );
};

export default Leave;
