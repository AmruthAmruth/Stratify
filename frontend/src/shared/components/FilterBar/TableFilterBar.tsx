import React, { useEffect } from "react";

interface TableFilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterOptions?: string[];
  filterValue?: string;
  setFilterValue?: (val: string) => void;
  sortOptions?: { key: string; label: string }[];
  sortBy?: string;
  setSortBy?: (val: string) => void;
  sortOrder?: "asc" | "desc";
  setSortOrder?: (val: "asc" | "desc") => void;
  onClearFilters?: () => void;
  searchPlaceholder?: string;
  filterLabel?: string;
  defaultFilterValue?: string; // Optional default filter
}

const TableFilterBar: React.FC<TableFilterBarProps> = ({
  searchTerm,
  setSearchTerm,
  filterOptions = [],
  filterValue,
  setFilterValue,
  sortOptions = [],
  sortBy,
  setSortBy,
  sortOrder = "asc",
  setSortOrder,
  onClearFilters,
  searchPlaceholder = "Search...",
  filterLabel = "All",
  defaultFilterValue,
}) => {
  // Apply default filter only once if provided
  useEffect(() => {
    if (defaultFilterValue && setFilterValue && !filterValue) {
      setFilterValue(defaultFilterValue);
    }
  }, [defaultFilterValue, filterValue, setFilterValue]);

  const hasActiveFilters = searchTerm || filterValue || sortBy;

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-6">
      <div className="flex flex-col lg:flex-row gap-4 lg:items-center">
        
        {/* Search Section */}
        <div className="flex-1 min-w-0">
          <label className="block text-xs font-medium text-gray-700 mb-1.5">
            Search
          </label>
          <div className="relative">
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-3 pr-3 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>
        </div>

        {/* Filter Section */}
        {filterOptions.length > 0 && setFilterValue && (
          <div className="w-full lg:w-48">
            <label className="block text-xs font-medium text-gray-700 mb-1.5">
              Filter by
            </label>
            <select
              value={filterValue || ""}
              onChange={(e) => setFilterValue && setFilterValue(e.target.value)}
              className="block w-full px-3 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors cursor-pointer"
            >
              <option value="">{filterLabel}</option>
              {filterOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
        )}

        {/* Sort Section */}
        {sortOptions.length > 0 && setSortBy && setSortOrder && (
          <div className="flex gap-3">
            <div className="w-full lg:w-44">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Sort by</label>
              <select
                value={sortBy || ""}
                onChange={(e) => setSortBy && setSortBy(e.target.value)}
                className="block w-full px-3 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white"
              >
                <option value="">Default</option>
                {sortOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>

            {sortBy && (
              <div className="w-full lg:w-32">
                <label className="block text-xs font-medium text-gray-700 mb-1.5">Order</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder && setSortOrder(e.target.value as "asc" | "desc")}
                  className="block w-full px-3 py-2.5 text-sm text-gray-900 border border-gray-300 rounded-lg bg-white"
                >
                  <option value="asc">↑ A-Z</option>
                  <option value="desc">↓ Z-A</option>
                </select>
              </div>
            )}
          </div>
        )}

        {/* Clear Filters Button */}
        {onClearFilters && (
          <div className="flex items-end">
            <button
              onClick={onClearFilters}
              disabled={!hasActiveFilters}
              className={`px-4 py-2.5 text-sm font-medium rounded-lg ${hasActiveFilters ? "bg-red-50 text-red-600" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}
            >
              Clear
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableFilterBar;
