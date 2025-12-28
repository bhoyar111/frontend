import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import "./Patient.css";

import Service from "../Services";
import { Eye } from "react-feather";
import showToast from "../../../Common/Shared/Utils/ToastNotification";
import ReuseableTable from "../../../Common/Shared/Components/Table/ReuseableTable";
import ConfirmModal from "../../../Common/Shared/Components/CustomePopup/ConfirmModal";

export default function ListSurveyView() {
  // const TIMEZONE = process.env.REACT_APP_TIMEZONE || "America/New_York";
  const navigate = useNavigate();
  const location = useLocation();
  const isChildRoute = location.pathname !== "/surveydetails";

  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRowToDelete, setSelectedRowToDelete] = useState(null);
  const [pendingAction, setPendingAction] = useState({
    actionName: "",
    actionValue: null,
  });

  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteData, setInviteData] = useState({
    fullName: "",
    email: "",
  });

  const [errors, setErrors] = useState({});

  const columns = [
    { key: "fullName", label: "Patient Name" }
  ];

  const actions = [
    {
      label: "Survey View",
      icon: <Eye size={14} />,
      onClick: (row) => navigate(`/surveydetails/view-patient-survey/${row._id}`),
    }
  ];

  // Invite patient button
  const topButtons = [
    {
      label: "Invite Patient",
      className: "btn-success",
      onClick: () => setShowInviteModal(true),
    },
  ];

  // inviteData validation
  const validate = () => {
    const errs = {};
    if (!inviteData.fullName) errs.fullName = "Full Name is required";
    if (!inviteData.email) errs.email = "Email is required";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // handle Invite patient
  const handleInviteChange = (e) => {
    const { name, value } = e.target;
    setInviteData({ ...inviteData, [name]: value });
  };

  const handleCancel = () => {
    setShowInviteModal(false);
    setInviteData({ fullName: "", email: "" });
  };

  // Send Invited to patient
  const handleInviteSubmit = async () => {
    if (!validate()) return;
    try {
      const response = await Service.patientInvitation(inviteData);
      if (response?.status === 200) {
        showToast("Invited", response?.message || "Invited");
        setShowInviteModal(false);
        setInviteData({ fullName: "", email: "" });
      }
    } catch (error) {
      showToast("Failed to send invitation.", "error");
    }
  };

  // API call
  const ListingData = async () => {
    try {
      const reqData = {
        limit,
        page,
        searchText,
        isActive: statusFilter !== "" ? statusFilter : undefined,
        role: "Patient",
      };

      const response = await Service.getPatientSurveyList(reqData);
      if (response?.status === 200) {
        setData(response?.data?.result || []);
        setTotalCount(response?.data?.totalRecords || 0); // update if your API returns total count
      }
    } catch (err) {
      showToast("error", err?.response?.message || "Failed to fetch user");
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    setPage(1); // reset page on search
  };

  // Handle dropdown filter
  const handleDropdownChange = (val) => {
    setPage(1); // reset page on filter
    setStatusFilter(val);
  };

  // Handle Confirmation popup for status and deleted
  const handleConfirmAction = async (actionName, actionValue) => {
    if (!selectedRowToDelete) return;
    const reqData = {
      userId: selectedRowToDelete._id,
      action_name: actionName,
      action_value: actionValue,
    };

    try {
      const response = await Service.deleteProvider(reqData);
      if (response?.status === 200) {
        showToast("success", response?.message || "Action successful");
        await ListingData();
      } else {
        showToast("error", response?.message || "Action failed");
      }
    } catch (err) {
      showToast("error", err?.response?.message || "Something went wrong");
    } finally {
      setShowDeleteModal(false);
      setSelectedRowToDelete(null);
      setPendingAction({ actionName: "", actionValue: null });
    }
  };

  useEffect(() => {
    ListingData();
    if (location.state?.refresh) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, searchText, statusFilter, location.state?.refresh]);

  return (
    <>
      {!isChildRoute && (
        <ReuseableTable
          columns={columns}
          data={data}
          actions={actions}
          pageSize={limit}
          currentPage={page}
          totalCount={totalCount}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newLimit) => setLimit(newLimit)}
          showSearch={true}
          searchPlaceholder="Search by patient..."
          onSearch={handleSearch}
          // showTopButtons={true}
          topButtons={topButtons}
          showDropdownFilter={false}
          dropdownPlaceholder="Filter by type"
          onDropdownChange={handleDropdownChange}
          // Toggle status support
          enableToggleStatus={true}
          onToggleStatus={(row, field, newValue) => {
            setSelectedRowToDelete(row);
            setPendingAction({
              actionName: field,
              actionValue: newValue,
            });
            setShowDeleteModal(true);
          }}
          showStatusFilter={false}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
        />
      )}

      <ConfirmModal
        show={showDeleteModal}
        message={`Are you sure you want to ${
          pendingAction.actionName === "isDeleted"
            ? "delete"
            : pendingAction.actionValue
              ? "activate"
              : "inctivate"
        } this User?`}
        onClose={() => {
          setShowDeleteModal(false);
          setSelectedRowToDelete(null);
          setPendingAction({ actionName: "", actionValue: null });
        }}
        onConfirm={() =>
          handleConfirmAction(
            pendingAction.actionName,
            pendingAction.actionValue
          )
        }
      />

      {showInviteModal && (
        <div className="modal-backdrop">
          <div className="modal-box">
            <label className="popup-label">Invite Patient</label>
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={inviteData.fullName}
                  onChange={handleInviteChange}
                />
                {errors.fullName && (
                  <span className="error">{errors.fullName}</span>
                )}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={inviteData.email}
                  onChange={handleInviteChange}
                />
                {errors.email && <span className="error">{errors.email}</span>}
              </div>
            </div>
            <div className="modal-actions">
              <button
                type="submit"
                className="save-btn"
                onClick={handleInviteSubmit}
              >
                Send
              </button>
              <button className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <Outlet />
    </>
  );
}
