import { getLeaveCurrentMonth } from '@/services/leave';
import DashboardCard from '@/shared/components/DashboardCards/Cards';
import AuthForm from '@/shared/components/Forms/DynamicForm';
import { createLeaveFields } from '@/shared/components/Forms/formFields';
import Modal from '@/shared/components/ModalFrom/ModalForm';
import Table from '@/shared/components/Table/Table';
import { createLeaveSchema } from '@/shared/utils/validations';
import React, { useEffect, useState } from 'react';

const Leave = () => {
  // State for leave counts and records
  const [leaveCounts, setLeaveCounts] = useState({
    Casual: 0,
    Sick: 0,
    Earned: 0,
  });
  const [leaveRecords, setLeaveRecords] = useState<any[]>([]);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    getLeaveCurrentMonth().then((data) => {
      console.log("Leaves", data);

      if (data) {
        setLeaveCounts(data.leaveCounts || { Casual: 0, Sick: 0, Earned: 0 });
        setLeaveRecords(data.leaves || []);
      }
    });
  }, []);

  // Map leave records to table-friendly format
  const paginatedData = leaveRecords
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
    .map(record => ({
      startDate: new Date(record.startDate).toDateString(),
      endDate: new Date(record.endDate).toDateString(),
      status: record.status,
      reason: record.reason,
      type: record.type,
      remainingTimeInDays: Math.max(
        0,
        Math.ceil((new Date(record.endDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      ),
      id: record.employeeId
    }));

  const totalPages = Math.ceil(leaveRecords.length / itemsPerPage);

  const handleViewProject = (id: string) => {
    alert(`Viewing details for leave ${id}`);
  };

  const handleCreateLeave = async (values: any) => {
    setSubmitLoading(true);
    try {
      console.log("Creating leave with values:", values);
      // 👉 Call your createLeave service here if available
      // await createLeave(values);

      // Refresh data after creation
      const updated = await getLeaveCurrentMonth();
      if (updated) {
        setLeaveCounts(updated.leaveCounts || { Casual: 0, Sick: 0, Earned: 0 });
        setLeaveRecords(updated.leaves || []);
      }

      setIsLeaveModalOpen(false);
    } catch (err: unknown) {
      console.error("Error creating Leave:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="bg-white text-black p-4">
      {/* Header + Apply Leave button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Leave Dashboard</h2>
        <button
          onClick={() => setIsLeaveModalOpen(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
        >
          Apply Leave
        </button>
      </div>

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
