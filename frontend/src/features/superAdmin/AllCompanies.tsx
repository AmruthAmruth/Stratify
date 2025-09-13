import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom"; 
import Table from "../../shared/components/Table/Table";
import TableFilterBar from "../../shared/components/FilterBar/TableFilterBar";
import { getAllCompanies } from "@/services/company";

const AllCompanies = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const pageSize = 6;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies({ page: currentPage, pageSize });
        setCompanies(response.data);
        setTotalPages(Math.ceil(response.total / pageSize));
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    };

    fetchCompanies();
  }, [currentPage]);

  const filteredCompanies = useMemo(() => {
    let data = [...companies];

    if (filterValue !== "All") {
      data = data.filter(
        (c) => c.status.toLowerCase() === filterValue.toLowerCase()
      );
    }

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      data = data.filter(
        (c) =>
          c.name.toLowerCase().includes(term) ||
          c.email.toLowerCase().includes(term) ||
          c.city.toLowerCase().includes(term)
      );
    }

    data.sort((a, b) => {
      const valA = a[sortBy] ? a[sortBy].toString().toLowerCase() : "";
      const valB = b[sortBy] ? b[sortBy].toString().toLowerCase() : "";
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [companies, searchTerm, filterValue, sortBy, sortOrder]);

  const clearFilters = () => {
    setSearchTerm("");
    setFilterValue("All");
    setSortBy("name");
    setSortOrder("asc");
  };

  // ✅ Navigate to profile
  const handleViewProfile = (profileId: string) => {
    navigate(`/company-profile/${profileId}`);
  };

  // ✅ Approve/Reject handlers
  const handleApprove = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "Approved" } : c
      )
    );
  };

  const handleReject = (id: string) => {
    setCompanies((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, status: "Rejected" } : c
      )
    );
  };

  const tableColumns = [
    { key: "name", label: "Company Name" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "status", label: "Status" },
    { key: "city", label: "City" },
    { key: "actions", label: "Actions" },
  ];

  const renderCell = (row: any, key: string) => {
    if (key === "actions") {
      const status = row.status?.toLowerCase(); // normalize to lowercase
      return (
        <div className="flex gap-2">
          {/* Always show View More */}
          <button
            onClick={() => handleViewProfile(row.id)}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            View More
          </button>

          {/* Show Approve only if Pending or Rejected */}
          {(status === "pending" || status === "rejected") && (
            <button
              onClick={() => handleApprove(row.id)}
              className="px-3 py-1 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600"
            >
              Approve
            </button>
          )}

          {/* Show Reject only if Pending or Approved */}
          {(status === "pending" || status === "approved") && (
            <button
              onClick={() => handleReject(row.id)}
              className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Reject
            </button>
          )}
        </div>
      );
    }
    return row[key];
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Companies</h2>

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
        searchPlaceholder="Search companies..."
        filterLabel="All Status"
      />

      <Table
        columns={tableColumns}
        data={filteredCompanies}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        renderCell={renderCell} // ✅ use custom renderer
      />
    </div>
  );
};

export default AllCompanies;
