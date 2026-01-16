import { createLeave, getLeaveCurrentMonth } from '@/services/leave';
import DashboardCard from '@/shared/components/DashboardCards/Cards';
import AuthForm from '@/shared/components/Forms/DynamicForm';
import { createLeaveFields } from '@/shared/components/Forms/formFields';
import Modal from '@/shared/components/ModalFrom/ModalForm';
import Table from '@/shared/components/Table/Table';
import { createLeaveSchema } from '@/shared/utils/validations';
import React, { useEffect, useState } from 'react';
import { enqueueSnackbar } from 'notistack';

import { Leave as LeaveType } from '@/types/types';

const Leave = () => {
  const [leaveCounts, setLeaveCounts] = useState({
    Casual: 0,
    Sick: 0,
    Earned: 0,
  });
  const [leaveRecords, setLeaveRecords] = useState<LeaveType[]>([]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Fetch leave data on mount
  useEffect(() => {
    fetchLeaves();
  }, []);

  const fetchLeaves = async () => {
    try {
      const data = await getLeaveCurrentMonth();
      if (data) {
        setLeaveCounts(data.leaveCounts || { Casual: 0, Sick: 0, Earned: 0 });
        setLeaveRecords(data.leaves || []);
      }
    } catch (err) {
      console.error("Failed to fetch leaves:", err);
    }
  };

  // Paginated data for the table
  const paginatedData = leaveRecords
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map((record) => ({
      id: record.id || record.employeeId + record.startDate, // use id if available
      type: record.type,
      startDate: new Date(record.startDate).toLocaleDateString(),
      endDate: new Date(record.endDate).toLocaleDateString(),
      status: record.status,
      reason: record.reason,
      rejectedReason: record.rejectedReason,
    }));

  const totalPages = Math.ceil(leaveRecords.length / itemsPerPage);

  const handleViewLeave = (id: string) => {
    alert(`Viewing details for leave ${id}`);
  };

  const handleCreateLeave = async (values: Record<string, unknown>) => {
    setSubmitLoading(true);
    try {
      await createLeave(values);
      enqueueSnackbar("Leave created successfully!", { variant: "success" });
      setIsLeaveModalOpen(false);
      await fetchLeaves(); // refresh table
    } catch (err) {
      const error = err as { message?: string };
      enqueueSnackbar(error?.message || "Failed to create leave", { variant: "error" });
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-bg text-text p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Leave Dashboard</h2>
        <button
          onClick={() => setIsLeaveModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Apply Leave
        </button>
      </div>

      {/* Leave Cards */}
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

      {/* Leave Table */}
      <Table
        columns={[
          { key: "type", label: "Leave Type" },
          { key: "startDate", label: "Start Date" },
          { key: "endDate", label: "End Date" },
          { key: "status", label: "Status" },
          { key: "reason", label: "Reason" },
          { key: "rejectedReason", label: "Rejected Reason" },
        ]}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        actions={[
          { label: "View", type: "custom", onClick: (row: { id: string }) => handleViewLeave(row.id) },
        ]}
      />

      {/* Leave Modal */}
      <Modal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        title="Create Leave"
      >
        <AuthForm
          fields={createLeaveFields}
          validationSchema={createLeaveSchema}
          onSubmit={handleCreateLeave}
          buttonText={submitLoading ? "Creating..." : "Create Leave"}
          disabled={submitLoading}
        />
      </Modal>
    </div>
  );
};

export default Leave;
