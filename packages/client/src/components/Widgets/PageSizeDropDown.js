import './Widgets.css'
const PageSizeDropDown = ({ pageSize, setPageSize, setPage }) => {
    return (
      <div className="page-size-container">
        <label htmlFor="pageSize">Items per page:</label>
  
        <select
          id="pageSize"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
            setPage(0);
          }}
          className="page-size-select"
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
        </select>
      </div>
    );
  };
  
  export default PageSizeDropDown;