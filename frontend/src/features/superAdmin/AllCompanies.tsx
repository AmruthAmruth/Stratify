import React, { useEffect, useState } from "react";
import Table from "../../shared/components/Table/Table";
import { getAllCompanies } from "@/services/company";

const columns = [
  { key: "name", label: "Company Name" },
  { key: "email", label: "Email" },
   { key: "phone", label: "Phone" },
  { key: "status", label: "Status" },
  { key: "city", label: "City" },
   { key: "actions", label: "Actions" },
];

const AllCompanies = () => {
  const [companies, setCompanies] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await getAllCompanies({ page: currentPage, pageSize });

        console.log("Fetched Companies:", response);

        setCompanies(response.data); 
        setTotalPages(response.totalPages || 1);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    };

    fetchCompanies();
  }, [currentPage]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">All Companies</h2>
      <Table
        columns={columns}
        data={companies}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={(page) => setCurrentPage(page)}
    renderCell={(row, key) => {
  if (key === "actions") {
    return (
      <button
        onClick={() => console.log("View More for:", row)}
        className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        View More
      </button>
    );
  }
  return row[key];
}}
      />
    </div>
  );
};

export default AllCompanies;
