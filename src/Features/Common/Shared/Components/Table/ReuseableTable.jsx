import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaArrowLeft } from "react-icons/fa";
import "./ReuseableTable.css";

import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

const ReuseableTable = ({
  columns = [],
  data = [],
  pageSize = 5,
  currentPage = 1,
  totalCount = 0,
  actions = [],
  showSearch = true,
  searchPlaceholder = "Search...",
  onSearch = () => {},
  showTopButtons = false,
  topButtons = [],
  showDropdownFilter = false,
  dropdownOptions = [],
  dropdownPlaceholder = "Select...",
  onDropdownChange = () => {},
  showDateFilters = false,
  onDateChange = () => {},
  enableToggleStatus = false,
  onToggleStatus = () => {},
  onPageChange = () => {},
  onPageSizeChange = () => {},
  fromDate: propFromDate = "",
  toDate: propToDate = "",
  showStatusFilter = false,
  statusFilter = "",
  onStatusChange = () => {},
  onMediaTypeChange = () => {},
  showMediaTypeFilter = false,
  mediaTypeValue = "",
  selectedCategory = "",
  showResetButton = false,
  onResetFilters = () => {},
  showQuesTypeFilter = false,
  showBackButton = false,
  quesTypeOptions = [],
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [fromDate, setFromDate] = useState(propFromDate);
  const [toDate, setToDate] = useState(propToDate);
  const [expandedCells, setExpandedCells] = useState({});
  const navigate = useNavigate();

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    onSearch(val);
  };

  const handleDropdownChange = (e) => {
    const val = e.target.value;
    onDropdownChange(val);
  };

  const handleDateChange = (key, date) => {
    const formattedDate = date ? dayjs(date).format("YYYY-MM-DD") : "";
    if (key === "from") {
      setFromDate(formattedDate);
      onDateChange({ from: formattedDate, to: toDate });
    } else {
      setToDate(formattedDate);
      onDateChange({ from: fromDate, to: formattedDate });
    }
  };

  const totalPages = Math.ceil(totalCount / pageSize);

  const getWords = (text) => text?.toString()?.split(/\s+/) || [];

  const truncateText = (text, limit = 20) => {
    const words = getWords(text);
    if (words.length <= limit) return { truncated: text, isTruncated: false };
    return {
      truncated: words.slice(0, limit).join(" ") + "...",
      isTruncated: true,
    };
  };
  useEffect(() => {
    setFromDate(propFromDate || "");
  }, [propFromDate]);

  useEffect(() => {
    setToDate(propToDate || "");
  }, [propToDate]);

  const goBackToPatient = () => {
    navigate("/my-patient");
  };

  return (
    <div className="reusable-table-wrapper">
      {showBackButton && (
        <div className="form-header mb-4">
          <h5><b>Demograpich List</b></h5>
          <button onClick={goBackToPatient} className="back-button">
            <FaArrowLeft style={{ marginRight: "5px", fontSize: "16px" }} />
            Back
          </button>
        </div>
      )}
      {(showSearch ||
        showTopButtons ||
        showDropdownFilter ||
        showDateFilters) && (
        <div className="row mb-4">
          <div className="col-12">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="row align-items-end g-3">
                  {showSearch && (
                    <>
                      <div className="col-md-3">
                        <label className="form-label">Search</label>
                        <div className="position-relative">
                          <input
                            type="text"
                            className="form-control ps-5"
                            placeholder={searchPlaceholder}
                            value={searchTerm}
                            onChange={handleSearch}
                          />
                          <span className="position-absolute top-50 start-0 translate-middle-y ms-3 text-muted">
                            🔍
                          </span>
                        </div>
                      </div>
                      {showStatusFilter && (
                        <div className="col-md-2">
                          <label className="form-label">Status</label>
                          <select
                            className="form-select"
                            value={statusFilter}
                            onChange={(e) => onStatusChange(e.target.value)}
                          >
                            <option value="">All</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </select>
                        </div>
                      )}
                    </>
                  )}

                  {showMediaTypeFilter && (
                    <div className="col-md-2">
                      <label className="form-label">Media Type</label>
                      <select
                        className="form-select"
                        value={mediaTypeValue}
                        onChange={(e) => onMediaTypeChange(e.target.value)}
                      >
                        <option value="">All</option>
                        <option value="image">Article</option>
                        <option value="video">Video</option>
                      </select>
                    </div>
                  )}

                  {showDropdownFilter && (
                    <div className="col-md-2">
                      <label className="form-label">Filter</label>
                      <select
                        className="form-select"
                        value={selectedCategory}
                        onChange={handleDropdownChange}
                      >
                        <option value="">{dropdownPlaceholder}</option>
                        {dropdownOptions.map((opt, idx) => (
                          <option key={idx} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {showQuesTypeFilter && (
                    <div className="col-md-2">
                      <label className="form-label">Filter</label>
                      <select
                        className="form-select"
                        onChange={handleDropdownChange}
                      >
                        <option value="">{dropdownPlaceholder}</option>
                        {quesTypeOptions.map((opt, idx) => (
                          <option key={idx} value={opt.value}>
                            {opt.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  {showResetButton && (
                    <div className="col-md-auto">
                      <label className="form-label d-block">&nbsp;</label>
                      <button
                        className="btn btn-secondary"
                        onClick={onResetFilters}
                      >
                        <i className="fas fa-refresh me-1"></i> Reset
                      </button>
                    </div>
                  )}

                  {showDateFilters && (
                    <>
                      <div className="col-md-2">
                        <label className="form-label">From Date</label>
                        <DatePicker
                          value={fromDate ? dayjs(fromDate) : null}
                          onChange={(date) => handleDateChange("from", date)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                            },
                          }}
                        />
                      </div>
                      <div className="col-md-2">
                        <label className="form-label">To Date</label>
                        <DatePicker
                          value={toDate ? dayjs(toDate) : null}
                          onChange={(date) => handleDateChange("to", date)}
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              size: "small",
                            },
                          }}
                        />
                      </div>
                    </>
                  )}

                  {showTopButtons && topButtons.length > 0 && (
                    <div className="col text-end">
                      {topButtons.map((btn, i) => (
                        <button
                          key={i}
                          className={`btn custom-btn me-2 ${btn.className || ""}`}
                          onClick={btn.onClick}
                        >
                          <FaPlus style={{ marginRight: "5px" }} />
                          {btn.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
              {actions.length > 0 && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, idx) => (
                <tr key={idx}>
                  {columns.map((col) => (
                    <td key={col.key}>
                      {col.key === "isActivated" && enableToggleStatus ? (
                        <label className="switch">
                          <input
                            type="checkbox"
                            checked={row[col.key]}
                            onChange={() =>
                              onToggleStatus(row, col.key, !row[col.key])
                            }
                          />
                          <span className="slider round"></span>
                        </label>
                      ) : (
                        (() => {
                          const cellKey = `${idx}-${col.key}`;
                          const cellContent = col.render
                            ? col.render(row)
                            : row[col.key];
                          if (typeof cellContent !== "string")
                            return cellContent;
                          const { truncated, isTruncated } = truncateText(
                            cellContent,
                            20
                          );
                          const isExpanded = expandedCells[cellKey];
                          return (
                            <div>
                              {isExpanded || !isTruncated
                                ? cellContent
                                : truncated}
                              {isTruncated && (
                                <span
                                  onClick={() =>
                                    setExpandedCells((prev) => ({
                                      ...prev,
                                      [cellKey]: !prev[cellKey],
                                    }))
                                  }
                                  className="text-primary ms-2 cursor-pointer"
                                  style={{
                                    fontSize: "0.85em",
                                    cursor: "pointer",
                                  }}
                                >
                                  {isExpanded ? "Show less" : "Show more"}
                                </span>
                              )}
                            </div>
                          );
                        })()
                      )}
                    </td>
                  ))}
                  {actions.length > 0 && (
                    <td>
                      {actions.map((action, i) => (
                        <button
                          key={i}
                          className={`btn btn-sm me-1 ${action.btnClass || "action-btn"}`}
                          title={action.label}
                          onClick={() => action.onClick(row)}
                        >
                          {action.icon || action.label}
                        </button>
                      ))}
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length + (actions.length ? 1 : 0)}
                  className="text-center text-muted py-3"
                >
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="pagination-wrapper mt-3 d-flex justify-content-between align-items-center flex-wrap">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <span className="me-2 text-muted small">Rows per page:</span>
          <select
            className="form-select form-select-sm page-btn"
            style={{ width: "70px" }}
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {[5, 10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <span className="ms-3 text-muted small">
            {totalCount > 0 ? (
              <>
                Showing <strong>{(currentPage - 1) * pageSize + 1}</strong>–
                <strong>{Math.min(currentPage * pageSize, totalCount)}</strong>{" "}
                of <strong>{totalCount}</strong> records
              </>
            ) : (
              "No records found"
            )}
          </span>
        </div>

        <div>
          <button
            className="btn btn-sm custom-btn me-2"
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                currentPage === i + 1 ? "custom-btn me-2" : "page-btn"
              } me-1`}
              onClick={() => onPageChange(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="btn btn-sm custom-btn"
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReuseableTable;
