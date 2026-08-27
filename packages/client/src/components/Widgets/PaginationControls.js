import './Widgets.css'

const PaginationControls = ({
    page,
    setPage,
    totalPages
  }) => {
    return (
      <div className="pagination-controls">
        <button
          className="pagination-button"
          onClick={() => setPage(prev => prev - 1)}
          disabled={page === 0}
        >
          Previous
        </button>
  
        <span className="page-info">
          Page {page + 1} of {totalPages}
        </span>
  
        <button
          className="pagination-button"
          onClick={() => setPage(prev => prev + 1)}
          disabled={totalPages === 0 || page === totalPages - 1}
        >
          Next
        </button>
      </div>
    );
  };
  
  export default PaginationControls;