import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../shared/components/Table/Table";
import TableFilterBar from "../../shared/components/FilterBar/TableFilterBar";
import { approveCompany, getAllCompanies, unapproveCompany } from "@/services/company";
import { useSnackbar } from "notistack";
import ConfirmDialog from "@/shared/components/ConfirmDialog/ConfirmDialog";
import Modal from "@/shared/components/ModalFrom/ModalForm";
import AuthForm from "@/shared/components/Forms/DynamicForm";
import { rejectionFormFields } from "@/shared/components/Forms/formFields";
import { rejectionValidationSchema } from "@/shared/utils/validations";
import { LoadingSpinner } from "@/shared/components/Loading";

interface Company {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  status?: string;
  city?: string;
  [key: string]: unknown;
}

const AllCompanies = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("All");
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [loadingActions, setLoadingActions] = useState<{ [key: string]: boolean }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const pageSize = 6;

  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  // Confirm modal state for approval
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    companyId?: string;
    message?: string;
  }>({ isOpen: false });

  // Rejection modal state
  const [rejectionModal, setRejectionModal] = useState<{
    isOpen: boolean;
    companyId?: string;
  }>({ isOpen: false });

  useEffect(() => {
    const fetchAllCompanies = async () => {
      try {
        setIsLoading(true);
        const response = await getAllCompanies({ page: 1, pageSize: 9999 });
        setAllCompanies(response.data || []);
      } catch (error) {
        console.error("Failed to fetch all companies:", error);
        enqueueSnackbar("Failed to fetch companies", { variant: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCompanies();
  }, [enqueueSnackbar]);

  // Fetch paginated companies only when NOT in search mode
  useEffect(() => {
    if (!isSearchMode && !isLoading) {
      const fetchCompanies = async () => {
        try {
          const response = await getAllCompanies({ page: currentPage, pageSize });
          setCompanies(response.data || []);
          setTotalPages(Math.ceil(response.total / pageSize));
        } catch (error) {
          console.error("Failed to fetch companies:", error);
          enqueueSnackbar("Failed to fetch paginated companies", { variant: "error" });
        }
      };

      fetchCompanies();
    }
  }, [currentPage, isSearchMode, isLoading, enqueueSnackbar]);

  // Reset to page 1 when search/filter changes
  useEffect(() => {
    setCurrentPage(1);
    const hasActiveSearch = searchTerm.trim() !== "" || filterValue !== "All";
    setIsSearchMode(hasActiveSearch);
  }, [searchTerm, filterValue, sortBy, sortOrder]);

  // Process companies based on search/filter mode
  const processedCompanies = useMemo(() => {
    let data = isSearchMode ? [...allCompanies] : [...companies];

    if (filterValue !== "All") {
      data = data.filter(
        (c) => c.status?.toLowerCase() === filterValue.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (c) =>
          c.name?.toLowerCase().includes(term) ||
          c.email?.toLowerCase().includes(term) ||
          c.city?.toLowerCase().includes(term)
      );
    }

    if (sortBy) {
      data.sort((a, b) => {
        const valA = a[sortBy] ? a[sortBy].toString().toLowerCase() : "";
        const valB = b[sortBy] ? b[sortBy].toString().toLowerCase() : "";
        if (valA < valB) return sortOrder === "asc" ? -1 : 1;
        if (valA > valB) return sortOrder === "asc" ? 1 : -1;
        return 0;
      });
    }

    return data;
  }, [companies, allCompanies, searchTerm, filterValue, sortBy, sortOrder, isSearchMode]);

  const searchTotalPages = Math.ceil(processedCompanies.length / pageSize);
  const paginatedCompanies = useMemo(() => {
    if (isSearchMode) {
      const start = (currentPage - 1) * pageSize;
      return processedCompanies.slice(start, start + pageSize);
    }
    return processedCompanies;
  }, [processedCompanies, currentPage, isSearchMode]);

  const displayTotalPages = isSearchMode ? searchTotalPages : totalPages;

  const clearFilters = () => {
    setSearchTerm("");
    setFilterValue("All");
    setSortBy("name");
    setSortOrder("asc");
    setCurrentPage(1);
  };

  const handleViewProfile = (profileId: string) => {
    navigate(`/company-profile/${profileId}`);
  };

  // Open confirm dialog for approval
  const openApprovalConfirmDialog = (companyId: string) => {
    setConfirmDialog({
      isOpen: true,
      companyId,
      message: "Are you sure you want to approve this company?",
    });
  };

  // Open rejection modal
  const openRejectionModal = (companyId: string) => {
    setRejectionModal({
      isOpen: true,
      companyId,
    });
  };

  // Handle approval confirmation
  const handleApprovalConfirm = async () => {
    if (!confirmDialog.companyId) return;

    const { companyId } = confirmDialog;

    try {
      setLoadingActions(prev => ({ ...prev, [companyId]: true }));

      await approveCompany(companyId);

      const updateStatus = (prev: Company[]) =>
        prev.map(c =>
          c.id === companyId
            ? { ...c, status: "Approved" }
            : c
        );

      setCompanies(updateStatus);
      setAllCompanies(updateStatus);

      enqueueSnackbar("Company approved successfully!", { variant: "success" });
    } catch (error) {
      console.error("Failed to approve company:", error);
      enqueueSnackbar("Failed to approve company. Please try again.", { variant: "error" });
    } finally {
      setLoadingActions(prev => ({ ...prev, [companyId]: false }));
      setConfirmDialog({ isOpen: false });
    }
  };

  // Handle rejection submission
  const handleRejectionSubmit = async (data: Record<string, unknown>) => {
    if (!rejectionModal.companyId) return;

    const { companyId } = rejectionModal;
    const reason = typeof data.reason === 'string' ? data.reason : '';

    try {
      setSubmitLoading(true);
      setLoadingActions(prev => ({ ...prev, [companyId]: true }));

      await unapproveCompany(companyId, reason);

      const updateStatus = (prev: Company[]) =>
        prev.map(c =>
          c.id === companyId
            ? { ...c, status: "Rejected", rejectionReason: reason }
            : c
        );

      setCompanies(updateStatus);
      setAllCompanies(updateStatus);

      enqueueSnackbar("Company rejected successfully!", { variant: "success" });
      setRejectionModal({ isOpen: false });
    } catch (error) {
      console.error("Failed to reject company:", error);
      enqueueSnackbar("Failed to reject company. Please try again.", { variant: "error" });
    } finally {
      setSubmitLoading(false);
      setLoadingActions(prev => ({ ...prev, [companyId]: false }));
    }
  };

  const handleApprovalCancel = () => setConfirmDialog({ isOpen: false });

  const handleRejectionCancel = () => setRejectionModal({ isOpen: false });

  const tableColumns = [
    { key: "name", label: "Company Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
    { key: "city", label: "City" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (row: Company, key: string) => {
    if (key === "actions") {
      const status = row.status?.toLowerCase();
      const isActionLoading = loadingActions[row.id];

      return (
        <div className="flex gap-2">
          <button
            onClick={() => handleViewProfile(row.id)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            View More
          </button>

          {(status === "pending" || status === "rejected") && (
            <button
              onClick={() => openApprovalConfirmDialog(row.id)}
              disabled={isActionLoading}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${isActionLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white"
                }`}
            >
              {isActionLoading ? <LoadingSpinner variant="dots" size="small" color="#ffffff" /> : "Approve"}
            </button>
          )}

          {(status === "pending" || status === "approved") && (
            <button
              onClick={() => openRejectionModal(row.id)}
              disabled={isActionLoading}
              className={`px-3 py-1 text-sm rounded-lg transition-colors ${isActionLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600 text-white"
                }`}
            >
              {isActionLoading ? <LoadingSpinner variant="dots" size="small" color="#ffffff" /> : "Reject"}
            </button>
          )}
        </div>
      );
    }

    if (key === "status") {
      const status = row[key]?.toLowerCase() as string;
      const statusColors: Record<string, string> = {
        approved: "text-green-600 bg-green-100",
        pending: "text-yellow-600 bg-yellow-100",
        rejected: "text-red-600 bg-red-100",
        active: "text-blue-600 bg-blue-100",
        inactive: "text-gray-600 bg-gray-100"
      };

      return (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[status] || "text-gray-600 bg-gray-100"
          }`}>
          {row[key]}
        </span>
      );
    }

    return row[key] || "-";
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} text="Loading companies..." />;
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Companies</h2>

      {isSearchMode && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-400 rounded-r-lg">
          <p className="text-blue-700">
            {searchTerm && (
              <>Found <strong>{processedCompanies.length}</strong> companies matching "{searchTerm}"</>
            )}
            {!searchTerm && filterValue !== "All" && (
              <>Showing <strong>{processedCompanies.length}</strong> companies with status "{filterValue}"</>
            )}
            {processedCompanies.length > pageSize && (
              <span> (showing {Math.min(pageSize, paginatedCompanies.length)} per page)</span>
            )}
          </p>
        </div>
      )}

      <TableFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterOptions={["Active", "Pending", "Inactive", "Approved", "Rejected"]}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        sortOptions={[
          { key: "name", label: "Name" },
          { key: "status", label: "Status" },
          { key: "city", label: "City" },
        ]}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onClearFilters={clearFilters}
      />

      <Table
        columns={tableColumns}
        data={paginatedCompanies}
        currentPage={currentPage}
        totalPages={displayTotalPages}
        onPageChange={setCurrentPage}
        renderCell={renderCell}
      />

      <div className="mt-4 text-sm text-gray-600">
        {isSearchMode ? (
          <>Showing {paginatedCompanies.length} of {processedCompanies.length} filtered results</>
        ) : (
          <>Showing page {currentPage} of {totalPages} | Total companies: {allCompanies.length}</>
        )}
      </div>

      {/* Approval Confirm Dialog */}
      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        message={confirmDialog.message || ""}
        onConfirm={handleApprovalConfirm}
        onCancel={handleApprovalCancel}
      />

      {/* Rejection Modal with Form */}
      <Modal
        isOpen={rejectionModal.isOpen}
        onClose={handleRejectionCancel}
        title="Reject Company"
      >
        <AuthForm
          fields={rejectionFormFields}
          validationSchema={rejectionValidationSchema}
          onSubmit={handleRejectionSubmit}
          initialValues={{ reason: "" }}
          buttonText={submitLoading ? <LoadingSpinner variant="dots" size="small" color="#ffffff" /> : "Reject Company"}
        />
        {submitLoading && (
          <div className="flex justify-center mt-4">
            <LoadingSpinner variant="spinner" size="small" />
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllCompanies;