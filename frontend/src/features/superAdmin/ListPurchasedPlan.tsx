import React, { useEffect, useState, useMemo } from "react";
import { listPurchasedCompany } from "@/services/company";
import TableFilterBar from "@/shared/components/FilterBar/TableFilterBar";
import { Table } from "lucide-react";
interface PurchasedPlan {
  companyName: string;
  plan: string;
  validityInMonths: number;
  amount: number;
  startDate: string;
  endDate: string;
  transactionId?: string;
  status: string;
}

export const ListPurchasedPlan: React.FC = () => {
  const [data, setData] = useState<PurchasedPlan[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterValue, setFilterValue] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    listPurchasedCompany().then((res) => {
        console.log(res);
        
      setData(res || []);
    });
  }, []);

  // Processed data: search, filter, sort
  const processedData = useMemo(() => {
    let result = [...data];

    // Search by company name
    if (searchTerm) {
      result = result.filter((item) =>
        item.companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by plan
    if (filterValue) {
      result = result.filter((item) => item.plan === filterValue);
    }

    // Sorting
    if (sortBy) {
      result.sort((a, b) => {
        const valA = a[sortBy as keyof PurchasedPlan];
        const valB = b[sortBy as keyof PurchasedPlan];

        if (typeof valA === "number" && typeof valB === "number") {
          return sortOrder === "asc" ? valA - valB : valB - valA;
        }

        return sortOrder === "asc"
          ? String(valA).localeCompare(String(valB))
          : String(valB).localeCompare(String(valA));
      });
    }

    return result;
  }, [data, searchTerm, filterValue, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(processedData.length / pageSize);
  const paginatedData = processedData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Table columns
  const columns = [
    { key: "companyName", label: "Company" },
    { key: "plan", label: "Plan" },
    { key: "validityInMonths", label: "Validity (Months)" },
    { key: "amount", label: "Amount (₹)" },
    { key: "startDate", label: "Start Date" },
    { key: "endDate", label: "End Date" },
    { key: "status", label: "Status" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">
        Purchased Plans
      </h1>

      {/* Filter Bar */}
      <TableFilterBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filterOptions={["Monthly", "trial"]}
        filterValue={filterValue}
        setFilterValue={setFilterValue}
        sortOptions={[
          { key: "companyName", label: "Company Name" },
          { key: "amount", label: "Amount" },
          { key: "startDate", label: "Start Date" },
        ]}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
        onClearFilters={() => {
          setSearchTerm("");
          setFilterValue("");
          setSortBy("");
          setSortOrder("asc");
        }}
      />

      {/* Data Table */}
      <Table
        columns={columns}
        data={paginatedData}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        renderCell={(row, key) => {
          if (key === "startDate" || key === "endDate") {
            return new Date(row[key]).toLocaleDateString();
          }
          if (key === "amount") {
            return `₹${row[key]}`;
          }
          return row[key as keyof PurchasedPlan];
        }}
      />
    </div>
  );
};
