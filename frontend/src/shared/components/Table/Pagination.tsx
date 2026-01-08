import React from 'react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else if (totalPages > 1) {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots.filter((item, index, arr) => arr.indexOf(item) === index);
  };

  const visiblePages = totalPages > 1 ? getVisiblePages() : [];

  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-between">
      {/* Page Info */}
      <div className="flex items-center text-sm text-muted">
        <span>
          Page <span className="font-semibold text-heading">{currentPage}</span> of{' '}
          <span className="font-semibold text-heading">{totalPages}</span>
        </span>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center space-x-1">
        {/* Previous Button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-text bg-surface border border-borderColor rounded-lg 
                     hover:bg-gray-50 hover:text-primary hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:border-borderColor disabled:hover:text-text transition-all duration-200 shadow-sm"
          aria-label="Previous page"
        >
          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        {/* Page Numbers */}
        <div className="hidden sm:flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="inline-flex items-center px-3 py-2 text-sm font-medium text-muted">...</span>
              ) : (
                <button
                  onClick={() => onPageChange(page as number)}
                  className={`inline-flex items-center px-3 py-2 text-sm font-semibold rounded-lg border transition-all duration-200 shadow-sm ${currentPage === page
                      ? 'bg-primary text-white border-primary hover:bg-primaryHover hover:shadow-md'
                      : 'text-text bg-surface border-borderColor hover:bg-gray-50 hover:text-primary hover:border-primary/30'
                    }`}
                  aria-label={`Go to page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Mobile Page Display */}
        <div className="sm:hidden flex items-center px-3 py-2 text-sm font-semibold text-heading bg-surface border border-borderColor rounded-lg shadow-sm">
          {currentPage} / {totalPages}
        </div>

        {/* Next Button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-text bg-surface border border-borderColor rounded-lg 
                     hover:bg-gray-50 hover:text-primary hover:border-primary/30 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-surface disabled:hover:border-borderColor disabled:hover:text-text transition-all duration-200 shadow-sm"
          aria-label="Next page"
        >
          Next
          <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Pagination;
