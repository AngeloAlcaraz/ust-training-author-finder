import { useMemo } from "react";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}


function Pagination(props: PaginationProps) {

  const { totalPages, currentPage, onPageChange } = props;

  const pageNumbers = useMemo(() => {
    const pages = [];
    // Show current page, and up to 2 pages before/after if available
    const startPage = Math.max(1, currentPage - 2);
    const endPage = Math.min(totalPages, currentPage + 2);

    if (startPage > 1) {
      pages.push(1);
      if (startPage > 2) pages.push('...');
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) pages.push('...');
      pages.push(totalPages);
    }
    return pages;
  }, [currentPage, totalPages]);




  return (
    <nav className="">
      <ul className="pagination">
        <li className="page-item">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="page-link"
          >
            <span aria-hidden="true">&laquo;</span>
          </button>
        </li>
        {pageNumbers.map((page, index) => (
          <li key={index}>
            {page === '...' ? (
              <span className="px-4 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => onPageChange(Number(page))}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-sm
                  ${currentPage === page
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-blue-700 hover:bg-blue-100 border border-blue-200'
                  }`}
              >
                {page}
              </button>
            )}
          </li>
        ))}
        <li className="page-item">
          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="page-link"
          >
            <span aria-hidden="true">&raquo;</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}

export default Pagination;