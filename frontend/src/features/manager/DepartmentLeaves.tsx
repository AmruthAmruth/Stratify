import React, { useEffect, useState } from "react";
import { getDepartmentLeave, leaveStatusUpdate } from "@/services/leave";
import DashboardCard from "@/shared/components/DashboardCards/Cards";
import Table from "@/shared/components/Table/Table";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import { createRejectLeaveFields } from "@/shared/components/Forms/formFields";
import { createRejectLeaveSchema } from "@/shared/utils/validations";
import AuthForm from "@/shared/components/Forms/DynamicForm";
import ConfirmDialog from "@/shared/components/ConfirmDialog/ConfirmDialog";
import { useSnackbar } from "notistack";
import { Leave } from "@/types/types";

const DepartmentLeaves = () => {
  const { enqueueSnackbar } = useSnackbar();

  const [leaveCounts, setLeaveCounts] = useState({
    totalLeave: 0,
    pendingLeave: 0,
    approvedLeave: 0,
    activeMembers: 0,
  });
  const [leaves, setLeaves] = useState<Leave[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isRejectLeaveModalOpen, setIsRejectLeaveModalOpen] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<Leave | null>(null);
  const [submitLoading, setSubmitLoading] = useState(false);

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    message?: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({ isOpen: false });

  const itemsPerPage = 10;

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const data = await getDepartmentLeave();
        const leavesList = data.leaves || [];
        setLeaves(leavesList);
        setLeaveCounts({
          totalLeave: leavesList.length,
          pendingLeave: leavesList.filter((l: Leave) => l.status.toLowerCase() === "pending").length,
          approvedLeave: leavesList.filter((l: Leave) => l.status.toLowerCase() === "approved").length,
          activeMembers: 0,
        });
      } catch (error) {
        const err = error as { response?: { data?: { message?: string } }; message?: string };
        console.error("Error fetching department leaves:", error);
        enqueueSnackbar(
          err?.response?.data?.message || "Failed to fetch leaves",
          { variant: "error" }
        );
      }
    };

    fetchLeaves();
  }, [enqueueSnackbar]);

  const totalPages = Math.ceil(leaves.length / itemsPerPage);
  const paginatedData = leaves.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  // Approve leave with confirmation
  const handleApprove = (leave: Leave) => {
    const payload = {
      leaveId: leave.leaveId || leave.id,
      status: "Approved",
    };

    setConfirmDialog({
      isOpen: true,
      message: `Are you sure you want to approve leave for ${leave.employeeName}?`,
      onConfirm: async () => {
        try {
          const res = await leaveStatusUpdate(payload);

          setLeaves((prev) =>
            prev.map((l) =>
              (l.leaveId || l.id) === (leave.leaveId || leave.id) ? { ...l, status: "approved" as const } : l
            )
          );

          enqueueSnackbar(res?.message || "Leave approved successfully!", {
            variant: "success",
          });
        } catch (error) {
          const err = error as { response?: { data?: { message?: string } }; message?: string };
          console.error("Error approving leave:", error);
          enqueueSnackbar(
            err?.response?.data?.message || "Failed to approve leave",
            { variant: "error" }
          );
        } finally {
          setConfirmDialog({ isOpen: false });
        }
      },
      onCancel: () => setConfirmDialog({ isOpen: false }),
    });
  };

  // Open reject modal
  const handleReject = (leave: Leave) => {
    setSelectedLeave(leave);
    setIsRejectLeaveModalOpen(true);
  };

  // Submit rejection
  const handleRejectSubmit = async (formData: Record<string, unknown>) => {
    if (!selectedLeave) return;
    setSubmitLoading(true);

    try {
      const payload = {
        leaveId: selectedLeave.leaveId || selectedLeave.id,
        status: "Rejected",
        reason: formData.reason,
      };

      const res = await leaveStatusUpdate(payload);

      setLeaves((prev) =>
        prev.map((l) =>
          (l.leaveId || l.id) === (selectedLeave.leaveId || selectedLeave.id)
            ? { ...l, status: "rejected" as const, rejectedReason: formData.reason as string }
            : l
        )
      );

      setIsRejectLeaveModalOpen(false);
      setSelectedLeave(null);

      enqueueSnackbar(res?.message || "Leave rejected successfully!", {
        variant: "success",
      });
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      console.error("Error rejecting leave:", error);
      enqueueSnackbar(
        err?.response?.data?.message || "Failed to reject leave",
        { variant: "error" }
      );
    } finally {
      setSubmitLoading(false);
    }
  };
  const formattedLeaves = paginatedData.map((leave) => ({
    ...leave,
    startDate: formatDate(leave.startDate),
    endDate: formatDate(leave.endDate),
  }));

  return (
    <div>
      {/* Dashboard Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <DashboardCard
          title="Total Leaves"
          value={leaveCounts.totalLeave}
          subtitle="All leaves in department"
          trend={leaveCounts.totalLeave > 0 ? "up" : "down"}
        />
        <DashboardCard
          title="Pending Leaves"
          value={leaveCounts.pendingLeave}
          subtitle="Awaiting approval"
          trend={leaveCounts.pendingLeave > 0 ? "up" : "down"}
        />
        <DashboardCard
          title="Approved Leaves"
          value={leaveCounts.approvedLeave}
          subtitle="Leaves approved"
          trend={leaveCounts.approvedLeave > 0 ? "up" : "down"}
        />
        <DashboardCard
          title="Active Members"
          value={leaveCounts.activeMembers}
          subtitle="Currently working"
          trend={leaveCounts.activeMembers > 0 ? "up" : "down"}
        />
      </div>

      {/* Leaves Table */}
      <Table
        columns={[
          { key: "employeeName", label: "Employee Name" },
          { key: "startDate", label: "Start Date" },
          { key: "endDate", label: "End Date" },
          { key: "type", label: "Leave Type" },
          { key: "status", label: "Status" },
          { key: "reason", label: "Reason" },
          { key: "rejectedReason", label: "Rejected Reason" }, // ✅ new column
        ]}
        data={formattedLeaves}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
        actions={[
          {
            label: "Approve",
            type: "approve",
            onClick: (row) => handleApprove(row),
          },
          {
            label: "Reject",
            type: "delete",
            onClick: (row) => handleReject(row),
          },
        ]}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message || ""}
        onConfirm={confirmDialog.onConfirm}
        onCancel={confirmDialog.onCancel}
      />

      {/* Reject Modal */}
      <Modal
        isOpen={isRejectLeaveModalOpen}
        onClose={() => setIsRejectLeaveModalOpen(false)}
        title={`Reject Leave - ${selectedLeave?.employeeName || ""}`}
      >
        <AuthForm
          fields={createRejectLeaveFields}
          validationSchema={createRejectLeaveSchema}
          onSubmit={handleRejectSubmit}
          buttonText={submitLoading ? "Rejecting..." : "Reject Leave"}
          disabled={submitLoading}
        />
      </Modal>
    </div>
  );
};

export default DepartmentLeaves;
