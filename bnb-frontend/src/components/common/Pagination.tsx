import React from "react";

interface PaginationProps {
  propertiesPerPage: number;
  totalProperties: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

const Pagination: React.FC<PaginationProps> = ({
  propertiesPerPage,
  totalProperties,
  paginate,
  currentPage,
}) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalProperties / propertiesPerPage);

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex justify-center mt-8">
      <div className="join">
        <button
          onClick={() => paginate(currentPage - 1)}
          className="join-item btn"
          disabled={currentPage === 1}
        >
          «
        </button>
        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => paginate(number)}
            className={`join-item btn ${currentPage === number ? "btn-active" : ""}`}
          >
            {number}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          className="join-item btn"
          disabled={currentPage === totalPages}
        >
          »
        </button>
      </div>
    </nav>
  );
};

export default Pagination;
