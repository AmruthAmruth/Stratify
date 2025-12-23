import React, { useEffect } from "react";

interface TableFilterBarProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  filterOptions?: string[];
  filterValue?: string;
  setFilterValue?: (val: string) => void;
  sortOptions?: { key: string; label: string }[];
  sortBy?: string | null;
  setSortBy?: (val: string) => void;
  sortOrder?: "asc" | "desc" | null;
  setSortOrder?: (val: "asc" | "desc") => void;
  onClearFilters?: () => void;
  searchPlaceholder?: string;
  filterLabel?: string;
  defaultFilterValue?: string;
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
  searchPlaceholder = "Search records...",
  filterLabel = "All Categories",
  defaultFilterValue,
}) => {
  useEffect(() => {
    if (defaultFilterValue && setFilterValue && !filterValue) {
      setFilterValue(defaultFilterValue);
    }
  }, [defaultFilterValue, filterValue, setFilterValue]);

  const hasActiveFilters = searchTerm || filterValue || sortBy;
  const activeFilterCount = [searchTerm, filterValue, sortBy].filter(Boolean).length;

  return (
    <div className="relative">
      {/* Main Container */}
      <div className="bg-bg border-2 border-primary rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 mb-6 relative overflow-hidden">

        {/* Header Section */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-primary rounded-full"></div>
            <h3 className="text-sm font-semibold text-text tracking-wide">TABLE FILTERS</h3>
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium">
                <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
                {activeFilterCount} active
              </div>
            )}
          </div>

          {onClearFilters && hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="group px-3 py-1.5 text-xs font-medium text-text hover:text-red-600 transition-colors duration-200 flex items-center gap-1.5"
            >
              <div className="w-3 h-3 rounded-full border border-current group-hover:bg-current group-hover:border-transparent transition-all duration-200"></div>
              Reset All
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end relative z-10">

          {/* Search */}
          <div className="lg:col-span-5">
            <label className="block text-xs font-semibold text-text mb-2 tracking-wide uppercase">
              Search
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-text/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 text-sm text-text placeholder-text/50 bg-bg border border-accent rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-text/50 hover:text-text"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Filter */}
          {filterOptions.length > 0 && setFilterValue && (
            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold text-text mb-2 tracking-wide uppercase">
                Category
              </label>
              <div className="relative group">
                <select
                  value={filterValue || ""}
                  onChange={(e) => setFilterValue && setFilterValue(e.target.value)}
                  className="block w-full pl-4 pr-10 py-3 text-sm text-text bg-bg border border-accent rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 cursor-pointer appearance-none"
                >
                  <option value="">{filterLabel}</option>
                  {filterOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-text/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Sort */}
          {sortOptions.length > 0 && setSortBy && setSortOrder && (
            <>
              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold text-text mb-2 tracking-wide uppercase">
                  Sort By
                </label>
                <div className="relative group">
                  <select
                    value={sortBy || ""}
                    onChange={(e) => setSortBy && setSortBy(e.target.value)}
                    className="block w-full pl-4 pr-10 py-3 text-sm text-text bg-bg border border-accent rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all duration-200 cursor-pointer appearance-none"
                  >
                    <option value="">Default Order</option>
                    {sortOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-text/40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {sortBy && (
                <div className="lg:col-span-1">
                  <label className="block text-xs font-semibold text-text mb-2 tracking-wide uppercase">
                    Order
                  </label>
                  <div className="flex rounded-xl overflow-hidden shadow-sm border border-accent bg-bg">
                    <button
                      onClick={() => setSortOrder && setSortOrder("asc")}
                      className={`flex-1 px-3 py-3 text-xs font-medium transition-all duration-200 flex items-center justify-center ${sortOrder === "asc"
                        ? "bg-primary text-white"
                        : "text-text hover:bg-accent"
                        }`}
                    >
                      ↑
                    </button>
                    <button
                      onClick={() => setSortOrder && setSortOrder("desc")}
                      className={`flex-1 px-3 py-3 text-xs font-medium transition-all duration-200 flex items-center justify-center ${sortOrder === "desc"
                        ? "bg-primary text-white"
                        : "text-text hover:bg-accent"
                        }`}
                    >
                      ↓
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-accent relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-text/70">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent text-text rounded-lg text-xs font-medium">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-text/70 hover:text-text"
                  >
                    ✕
                  </button>
                </span>
              )}
              {filterValue && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-primary/10 text-primary rounded-lg text-xs font-medium">
                  Filter: {filterValue}
                  <button
                    onClick={() => setFilterValue && setFilterValue('')}
                    className="text-primary hover:text-[#006b4b]"
                  >
                    ✕
                  </button>
                </span>
              )}
              {sortBy && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-accent text-text rounded-lg text-xs font-medium">
                  Sort: {sortOptions.find(opt => opt.key === sortBy)?.label} ({sortOrder === 'asc' ? '↑' : '↓'})
                  <button
                    onClick={() => setSortBy && setSortBy('')}
                    className="text-text/70 hover:text-text"
                  >
                    ✕
                  </button>
                </span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TableFilterBar;
