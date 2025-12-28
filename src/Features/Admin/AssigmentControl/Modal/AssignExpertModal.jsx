import React, { useEffect, useMemo, useState } from "react";
import "./AssignExpertModal.css";

export default function AssignExpertModal({ show, onClose, patient, experts = [], onAssign  }) {
  const [search, setSearch] = useState("");
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [assignmentFilter, setAssignmentFilter] = useState("all");
  // Pagination state
  const [pageSize, setPageSize] = useState(5); // default items per page
  const [currentPage, setCurrentPage] = useState(1);

  // Keep hooks (useEffect/useMemo) always in same order:
  useEffect(() => {
    if (!show) {
      // reset modal state when closed
      setSearch("");
      setSelectedExpert(null);
      setDate("");
      setNotes("");
      setPageSize(5);
      setCurrentPage(1);
    }
  }, [show]);

  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") onClose();
    }
    if (show) window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show, onClose]);

  const filtered = useMemo(() => {
    if (!experts || experts.length === 0) return [];
    const q = (search || "").trim().toLowerCase();
    return experts.filter((e) => {
      const matchesSearch = `${e.name} ${e.specialty}`.toLowerCase().includes(q);
      const isAssigned = Boolean(e.assignedToPatient);
      const matchesFilter =
        assignmentFilter === "all" ||
        (assignmentFilter === "assigned" && isAssigned) ||
        (assignmentFilter === "not_assigned" && !isAssigned);
      return matchesSearch && matchesFilter;
    });
  }, [experts, search, assignmentFilter]);

  // Pagination calculations (also before return)
  const totalItems = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // Ensure currentPage is valid when filtered or pageSize changes
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
    if (currentPage < 1) setCurrentPage(1);
  }, [currentPage, totalPages]);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageItems = filtered.slice(startIndex, endIndex);

  // Now it's safe to early-return if modal not shown (hooks already run)
  if (!show) return null;

  function handleAssignClick() {
    if (!selectedExpert) {
      return;
    }
    onAssign({ expertId: selectedExpert, date, notes });
  }

  function goToPage(n) {
    if (n < 1 || n > totalPages) return;
    setCurrentPage(n);
  }

  return (
    <div className="custom-modal-backdrop" role="dialog" aria-modal="true">
      <div className="custom-modal">
        <div className="custom-modal-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Assign Expert to {patient?.patientName}</h5>
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={onClose}
          ></button>
        </div>

        <div className="custom-modal-body">
          <div className="filter-item">
          <div className="input-group mb-3 searchGap">
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by name, specialty..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1); // reset to first page on search
              }}
            />
          </div>
            <div className="mb-3 ">
                <select
                  className="form-select form-select-sm"
                  style={{ width: "160px" }}
                  value={assignmentFilter}
                  onChange={(e) => {
                    setAssignmentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                >
                  <option value="all">All Experts</option>
                  <option value="assigned">Current Assign</option>
                  <option value="not_assigned">Not Assigned</option>
                </select>
            </div>
          </div>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <div className="small text-muted">
              Showing <strong>{totalItems === 0 ? 0 : startIndex + 1}</strong> -
              <strong>{Math.min(endIndex, totalItems)}</strong> of{" "}
              <strong>{totalItems}</strong>
            </div>

            <div className="d-flex align-items-center gap-2">
              <label className="small mb-0">Per page</label>
              <select
                className="form-select form-select-sm"
                style={{ width: 80 }}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setCurrentPage(1);
                }}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="mb-3">
            <div className="experts-grid">
              {pageItems.length > 0 ? (
                pageItems.map((exp) => {
                  const isSelected = exp.id === selectedExpert;
                  return (
                    <div
                      key={exp.id}
                      className={`expert-card ${isSelected ? "selected" : ""}`}
                      onClick={() => setSelectedExpert(exp.id)}
                    >
                      {exp.avatar ? (
                        <img
                          src={exp.avatar}
                          alt={exp.name}
                          className="expert-avatar mb-2"
                        />
                      ) : (
                        <div className="expert-avatar initials mb-2">
                          {(exp.name || "")
                            .split(" ")
                            .map((n) => n[0])
                            .slice(0, 2)
                            .join("")}
                        </div>
                      )}
                      <div
                        className="fw-semibold small"
                        style={{ textTransform: "uppercase" }}
                      >
                        {exp.name}
                      </div>
                      <div className="small text-muted">
                        {Array.isArray(exp.specialty)
                          ? exp.specialty.join(", ")
                          : exp.specialty}
                      </div>

                      {exp?.assignedToPatient && (
                        <span className="assigned-badge">Current Assign: {exp.assignedCount}</span>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-muted small">No experts found</div>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center custom-background">
            <div>
              <nav aria-label="Experts pagination">
                <ul className="custom-pagination pagination pagination-sm mb-0">
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link custom-nav-button"
                      onClick={() => goToPage(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <li
                        key={p}
                        className={`page-item ${p === currentPage ? "active" : ""}`}
                      >
                        <button
                          className={`page-link custom-page-button ${p === currentPage ? "active-page" : ""}`}
                          onClick={() => goToPage(p)}
                        >
                          {p}
                        </button>
                      </li>
                    )
                  )}
                  <li
                    className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link custom-nav-button"
                      onClick={() => goToPage(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="small text-muted me-2">
              Page {currentPage} / {totalPages}
            </div>
          </div>
        </div>

        <div className="custom-modal-footer d-flex justify-content-end gap-2">
          <button className="btn btn-outline-secondary" onClick={onClose}>
            Cancel
          </button>
          <button className="btn assignbtn" onClick={handleAssignClick}>
            Assign Expert
          </button>
        </div>
      </div>
    </div>
  );
}
