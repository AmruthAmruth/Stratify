import React, { useEffect, useState } from 'react';
import { getDepartmentLeave } from '@/services/leave';
import DashboardCard from '@/shared/components/DashboardCards/Cards';
import Table from '@/shared/components/Table/Table';

const DepartmentLeaves = () => {
  const [leaveCounts, setLeaveCounts] = useState({
    totalLeave: 0,
    peadingLeave: 0,
    approvedLeave: 0,
    activeMembers: 0,
  });
  const [leaves, setLeaves] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    getDepartmentLeave().then((data) => {
      setLeaveCounts(data.leaveCounts);
      setLeaves(data.leaves);
    });
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(leaves.length / itemsPerPage);
  const paginatedData = leaves.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Helper function for human-readable dates
  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

  // Preprocess leaves for table display
  const formattedLeaves = paginatedData.map((leave) => ({
    ...leave,
    startDate: formatDate(leave.startDate),
    endDate: formatDate(leave.endDate),
  }));

  // Handlers for approve/reject
  const handleApprove = (employeeName: string) => {
    alert(`Approved leave for ${employeeName}`);
    // call your API here
  };

  const handleReject = (employeeName: string) => {
    alert(`Rejected leave for ${employeeName}`);
    // call your API here
  };

  return (
    <div>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard
          title="Total Leaves"
          value={leaveCounts.totalLeave}
          subtitle="All leaves in department"
          trend={leaveCounts.totalLeave > 0 ? 'up' : 'down'}
        />
        <DashboardCard
          title="Pending Leaves"
          value={leaveCounts.peadingLeave}
          subtitle="Awaiting approval"
          trend={leaveCounts.peadingLeave > 0 ? 'up' : 'down'}
        />
        <DashboardCard
          title="Approved Leaves"
          value={leaveCounts.approvedLeave}
          subtitle="Leaves approved"
          trend={leaveCounts.approvedLeave > 0 ? 'up' : 'down'}
        />
        <DashboardCard
          title="Active Members"
          value={leaveCounts.activeMembers}
          subtitle="Currently working"
          trend={leaveCounts.activeMembers > 0 ? 'up' : 'down'}
        />
      </div>

      {/* Leaves Table */}
      <Table
        columns={[
          { key: 'employeeName', label: 'Employee Name' },
          { key: 'startDate', label: 'Start Date' },
          { key: 'endDate', label: 'End Date' },
          { key: 'type', label: 'Leave Type' },
          { key: 'status', label: 'Status' },
          { key: 'reason', label: 'Reason' },
        ]}
        data={formattedLeaves}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        actions={formattedLeaves.map((leave) =>
          leave.status === 'Pending'
            ? [
                {
                  label: 'Approve',
                  type: 'custom',
                  onClick: () => handleApprove(leave.employeeName),
                },
                {
                  label: 'Reject',
                  type: 'custom',
                  onClick: () => handleReject(leave.employeeName),
                },
              ]
            : []
        )}
      />
    </div>
  );
};

export default DepartmentLeaves;
