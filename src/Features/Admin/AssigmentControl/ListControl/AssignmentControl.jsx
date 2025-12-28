import React, { useEffect, useState } from "react";
import "./AssignmentControl.css";
import AssignExpertModal from "../Modal/AssignExpertModal";
import Service from "../Service";
import showToast from "../../../Common/Shared/Utils/ToastNotification";
import defaultProfile from '../../../Common/Assests/default_profile.jpg';
import { Link } from "react-router-dom";


export default function AssignmentControl() {
  const [filterOpen, setFilterOpen] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [experts, setExperts] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalRecords, setTotalRecords] = useState(0);
  const [statusFilter, setStatusFilter] = useState(""); // '', 'ACTIVE', 'INACTIVE'
  const [stats, setStats] = useState({
    totalRecords: 0,
    totalPending: 0,
    totalActive: 0,
    totalInactive: 0
  });
  const allAssignmentList = async () => {
    try {
      const reqData = {
        limit,
        page,
        status: statusFilter,
        searchText: search
      };
      const response = await Service.allRequestList(reqData);
      if (response?.status === 200 && response?.data?.result) {
        const {
          result,
          totalRecords,
          totalPending,
          totalActive,
          totalInactive
        } = response.data;
        setAssignments(result);
        setTotalRecords(totalRecords);
        setStats({ totalRecords, totalPending, totalActive, totalInactive });
      }
    } catch (err) {
      showToast("error", err?.response?.message || "Failed to fetch requests");
    }
  };
  useEffect(() => {
    allAssignmentList();
  }, [page, limit, statusFilter, search]);

  const ListingData = async () => {
    try {
      const reqData = {
        limit: 0,
        page: 1,
        role: "Provider",
        isActive: true
      };

      const response = await Service.getListProviders(reqData);

      if (response?.status === 200 && response?.data?.result) {
        const mappedExperts = response.data.result.map((provider) => ({
          id: provider?._id,
          name: provider?.fullName,
          specialty: provider?.speciality,
          experience: provider?.experience,
          assignedToPatient: provider?.assignedToPatient,
          assignedCount: provider?.assignedCount
        }));

        setExperts(mappedExperts);
      }
    } catch (err) {
      showToast("error", err?.response?.message || "Failed to fetch providers");
    }
  };

  useEffect(() => {
    ListingData();
  }, []);


  const openModalForPatient = (patient) => {
    setSelectedPatient(patient);
    setModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedPatient(null);
    document.body.style.overflow = "";
  };
  const handleAssign = async ({ expertId }) => {
    const selectedExpertObj = experts.find((e) => e.id === expertId);
    if (!selectedExpertObj || !selectedPatient) {
      showToast("error", "Missing patient or expert information");
      return;
    }
    const reqData = {
      requestId: selectedPatient._id,
      providerId: selectedExpertObj.id,
      assignExpertName: selectedExpertObj.name
    };
    try {
      const response = await Service.adminAssignExpert(reqData);
      if (response?.status === 200) {
        allAssignmentList();
        // updateStatus(response?.data?.providerId);
        showToast("success", response?.message);
      } else {
        showToast("error", response?.message);
      }
      closeModal(); // close the modal
    } catch (err) {
      showToast("error", err?.response?.message);
    }
  };

  return (
    <div className="patient-requests assign-control my-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3 className="mb-0">Patient Requests</h3>
        <div className="d-flex gap-2">
          <button
            className="btn assignbtn btn-sm"
            onClick={() => setFilterOpen(!filterOpen)}
          >
            <i className="bi bi-funnel"></i> Filter
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="card stat small-card">
            <div className="card-body d-flex align-items-center">
              <div className="stat-icon me-3 bg-light p-2 rounded-circle">
                <i className="bi bi-card-list fs-4 text-primary"></i>
              </div>
              <div className="flex-grow-1">
                <div className="small text-muted">Total Requests</div>
                <div className="h5 mb-0">{stats.totalRecords}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card stat small-card">
            <div className="card-body d-flex align-items-center">
              <div className="stat-icon me-3 bg-light p-2 rounded-circle">
                <i className="bi bi-hourglass-split fs-4 text-warning"></i>
              </div>
              <div className="flex-grow-1">
                <div className="small text-muted">Pending</div>
                <div className="h5 mb-0">{stats.totalPending}</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card stat small-card">
            <div className="card-body d-flex align-items-center">
              <div className="stat-icon me-3 bg-light p-2 rounded-circle">
                <i className="bi bi-person-check fs-4 text-info"></i>
              </div>
              <div className="flex-grow-1">
                <div className="small text-muted">Assigned</div>
                <div className="h5 mb-0">{stats.totalActive}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters area (toggle) */}
      {filterOpen && (
        <div className="card mb-4 p-3">
          <div className="row g-2 align-items-end">
            <div className="col-md-4">
              <label className="form-label small mb-1">Search</label>
              <input
                className="form-control form-control-sm"
                placeholder="Search patient..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <div className="col-md-2">
              <label className="form-label small mb-1">Status</label>
              <select
                className="form-select form-select-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All</option>
                <option value="PENDING">Pending</option>
                <option value="ACTIVE">Assigned</option>
                <option value="INACTIVE">InActive</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="card">
        <div className="card-body p-0">
          <table className="table table-hover mb-0">
            <thead className="table-light small text-muted">
              <tr>
                <th>Patient</th>
                <th>Request Date</th>
                <th>Assigned Expert</th>
                <th>Assign Date</th>
                <th>Status</th>
                <th className="text-end">Actions</th>
              </tr>
            </thead>
            <tbody>
              {assignments.map((r) => (
                <tr key={r._id}>
                  <td>
                    <div className="d-flex align-items-center">
                      <img
                        src={defaultProfile}
                        alt=""
                        className="avatar me-3"
                      />
                      <Link to={`/patients/view-patient/${r.patientId}`}
                         className="fw-semibold text-decoration-none" >
                        <div>
                          <div className="fw-semibold">{r.patientName}</div>
                        </div>
                      </Link>
                    </div>
                  </td>
                  <td className="text-muted small">
                    <div className="align-items-center">{new Date(r.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td>
                    {r.assignExpertName && r.providerId ? (
                      <Link
                        to={`/providers/view-provider/${r.providerId}`}
                        className="fw-semibold text-decoration-none"
                      >
                        {r.assignExpertName}
                      </Link>
                    ) : (
                      <span className="text-muted small">Unassigned</span>
                    )}
                  </td>
                  <td className="text-muted small">
                    <div>
                      {r.assign_date
                        ? new Date(r.assign_date).toLocaleDateString()
                        : "-"}
                    </div>
                  </td>
                  <td>
                    {r.status === "ACTIVE" && (
                      <span className="status-pill assigned">Assigned</span>
                    )}
                    {r.status === "PENDING" && (
                      <span className="status-pill pending">Pending</span>
                    )}
                    {r.status === "INACTIVE" && (
                      <span className="status-pill inactive">Inactive</span>
                    )}
                  </td>
                  <td className="text-end small">
                  {!r.isAssigned && r.status === "PENDING" && (
                    <button
                      className="btn btn-link btn-sm"
                      onClick={() => openModalForPatient(r)}
                    >
                      Assign Expert
                    </button>
                  )}
                  </td>
                </tr>
              ))}
              {/* if no results */}
              {assignments.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-4 text-muted">
                    No matching requests
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
      </div>
      <div className="pagination-wrapper mt-3 d-flex justify-content-between align-items-center flex-wrap">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <span className="me-2 text-muted small">Rows per page:</span>
          <select
            className="form-select form-select-sm page-btn"
            style={{ width: "70px" }}
            value={limit}
            onChange={(e) => {
              const newLimit = Number(e.target.value);
              setLimit(newLimit);
              setPage(1); //reset to first page on page size change
            }}
          >
            {[10, 20, 50, 100].map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>

          <span className="ms-3 text-muted small">
            {totalRecords > 0 ? (
              <>
                Showing <strong>{(page - 1) * limit + 1}</strong>–
                <strong>{Math.min(page * limit, totalRecords)}</strong> of{" "}
                <strong>{totalRecords}</strong> records
              </>
            ) : (
              "No records found"
            )}
          </span>
        </div>

        <div>
          <button
            className="btn btn-sm custom-btn me-2"
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          {[...Array(Math.ceil(totalRecords / limit))].map((_, i) => (
            <button
              key={i}
              className={`btn btn-sm ${
                page === i + 1 ? "custom-btn" : "page-btn"
              } me-1`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="btn btn-sm custom-btn"
            disabled={page === Math.ceil(totalRecords / limit)}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      </div>
      <AssignExpertModal
        show={modalOpen}
        onClose={closeModal}
        patient={selectedPatient}
        experts={experts}
        onAssign={handleAssign}
      />
    </div>
  );
}
