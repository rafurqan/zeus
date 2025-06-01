import React from 'react';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalPages,
    onPageChange,
    className = ""
}) => {
    const handlePageChange = (page: number): void => {
        if (page >= 1 && page <= totalPages && page !== currentPage) {
            onPageChange(page);
        }
    };

    // Jika hanya ada 1 halaman atau kurang, tidak perlu menampilkan pagination
    if (totalPages <= 1) {
        return null;
    }

    return (
        <div className={`flex items-center space-x-2 ${className}`}>
            {/* Previous Button */}
            <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${currentPage === 1
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-300 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    }`}
                type="button"
                aria-label="Previous page"
            >
                Previous
            </button>

            {/* Page Numbers */}
            <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                    let pageNumber: number;

                    if (totalPages <= 7) {
                        pageNumber = i + 1;
                    } else if (currentPage <= 4) {
                        pageNumber = i + 1;
                    } else if (currentPage >= totalPages - 3) {
                        pageNumber = totalPages - 6 + i;
                    } else {
                        pageNumber = currentPage - 3 + i;
                    }

                    if (pageNumber < 1 || pageNumber > totalPages) return null;

                    return (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${currentPage === pageNumber
                                ? 'bg-blue-600 text-white shadow-sm'
                                : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-300 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                                }`}
                            type="button"
                            aria-label={`Go to page ${pageNumber}`}
                            aria-current={currentPage === pageNumber ? 'page' : undefined}
                        >
                            {pageNumber}
                        </button>
                    );
                })}
            </div>

            {/* Next Button */}
            <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 text-sm font-medium rounded-md transition-colors duration-200 ${currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-white text-gray-500 hover:bg-gray-50 border border-gray-300 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                    }`}
                type="button"
                aria-label="Next page"
            >
                Next
            </button>
        </div>
    );
};

export default Pagination;