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
      {/* Main Container with Gradient Background */}
      <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50/30 backdrop-blur-sm border border-slate-200/60 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-6 mb-6 relative overflow-hidden">
        
        {/* Subtle Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-blue-100/40 to-transparent rounded-full blur-2xl -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-indigo-100/40 to-transparent rounded-full blur-xl translate-y-12 -translate-x-12"></div>
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-5 relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-indigo-600 rounded-full"></div>
            <h3 className="text-sm font-semibold text-slate-700 tracking-wide">TABLE FILTERS</h3>
            {activeFilterCount > 0 && (
              <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                {activeFilterCount} active
              </div>
            )}
          </div>
          
          {onClearFilters && hasActiveFilters && (
            <button
              onClick={onClearFilters}
              className="group px-3 py-1.5 text-xs font-medium text-slate-500 hover:text-red-600 transition-colors duration-200 flex items-center gap-1.5"
            >
              <div className="w-3 h-3 rounded-full border border-current group-hover:bg-current group-hover:border-transparent transition-all duration-200"></div>
              Reset All
            </button>
          )}
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-end relative z-10">
          
          {/* Enhanced Search Section */}
          <div className="lg:col-span-5">
            <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wide uppercase">
              Search
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 text-sm text-slate-900 placeholder-slate-400 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:bg-white hover:shadow-md"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Enhanced Filter Section */}
          {filterOptions.length > 0 && setFilterValue && (
            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wide uppercase">
                Category
              </label>
              <div className="relative group">
                <select
                  value={filterValue || ""}
                  onChange={(e) => setFilterValue && setFilterValue(e.target.value)}
                  className="block w-full pl-4 pr-10 py-3 text-sm text-slate-900 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:bg-white hover:shadow-md cursor-pointer appearance-none"
                >
                  <option value="">{filterLabel}</option>
                  {filterOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* Enhanced Sort Section */}
          {sortOptions.length > 0 && setSortBy && setSortOrder && (
            <>
              <div className="lg:col-span-3">
                <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wide uppercase">
                  Sort By
                </label>
                <div className="relative group">
                  <select
                    value={sortBy || ""}
                    onChange={(e) => setSortBy && setSortBy(e.target.value)}
                    className="block w-full pl-4 pr-10 py-3 text-sm text-slate-900 bg-white/80 backdrop-blur-sm border border-slate-200 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 hover:bg-white hover:shadow-md cursor-pointer appearance-none"
                  >
                    <option value="">Default Order</option>
                    {sortOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-400 group-focus-within:text-blue-500 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              {sortBy && (
                <div className="lg:col-span-1">
                  <label className="block text-xs font-semibold text-slate-600 mb-2 tracking-wide uppercase">
                    Order
                  </label>
                  <div className="flex rounded-xl overflow-hidden shadow-sm border border-slate-200 bg-white/80 backdrop-blur-sm">
                    <button
                      onClick={() => setSortOrder && setSortOrder("asc")}
                      className={`flex-1 px-3 py-3 text-xs font-medium transition-all duration-200 flex items-center justify-center ${
                        sortOrder === "asc" 
                          ? "bg-blue-500 text-white shadow-sm" 
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setSortOrder && setSortOrder("desc")}
                      className={`flex-1 px-3 py-3 text-xs font-medium transition-all duration-200 flex items-center justify-center ${
                        sortOrder === "desc" 
                          ? "bg-blue-500 text-white shadow-sm" 
                          : "text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                      </svg>
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Active Filters Summary */}
        {hasActiveFilters && (
          <div className="mt-4 pt-4 border-t border-slate-200/60 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-medium text-slate-500">Active filters:</span>
              {searchTerm && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-100/80 text-blue-700 rounded-lg text-xs font-medium">
                  Search: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="text-blue-500 hover:text-blue-700 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {filterValue && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-100/80 text-emerald-700 rounded-lg text-xs font-medium">
                  Filter: {filterValue}
                  <button
                    onClick={() => setFilterValue && setFilterValue('')}
                    className="text-emerald-500 hover:text-emerald-700 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              )}
              {sortBy && (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-purple-100/80 text-purple-700 rounded-lg text-xs font-medium">
                  Sort: {sortOptions.find(opt => opt.key === sortBy)?.label} ({sortOrder === 'asc' ? '↑' : '↓'})
                  <button
                    onClick={() => setSortBy && setSortBy('')}
                    className="text-purple-500 hover:text-purple-700 transition-colors"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
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