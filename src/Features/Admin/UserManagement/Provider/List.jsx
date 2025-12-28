import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import Service from "../Services";
import { Edit, Eye, Trash2, ToggleLeft, ToggleRight } from "react-feather";
import showToast from "../../../Common/Shared/Utils/ToastNotification";
import ReuseableTable from "../../../Common/Shared/Components/Table/ReuseableTable";
import ConfirmModal from "../../../Common/Shared/Components/CustomePopup/ConfirmModal";

export default function List() {
  const navigate = useNavigate();
  const location = useLocation();
  const isChildRoute = location.pathname !== "/providers";

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

  const columns = [
    { key: "fullName", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "mobile", label: "Phone" },
    {
          key: "isActive",
          label: "Status",
          render: (row) => (
            <button
              className="btn btn-sm"
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: row.isActive ? "Green" : "red",
                padding: "4px",
              }}
              title={row.isActive ? "Activate" : "Deactivate"}
              onClick={() => {
                setSelectedRowToDelete(row);
                setPendingAction({
                  actionName: "isActive",
                  actionValue: !row.isActive,
                });
                setShowDeleteModal(true);
              }}
            >
              {row.isActive ? <ToggleRight size={25} /> : <ToggleLeft size={25} />}
            </button>
          ),
        },
  ];

  const actions = [
    {
      label: "View",
      icon: <Eye size={14} />,
      onClick: (row) => navigate(`/providers/view-provider/${row._id}`),
    },
    {
      label: "Edit",
      icon: <Edit size={14} />,
      onClick: (row) => navigate(`/providers/edit-provider/${row._id}`),
    },
    {
      label: "Delete",
      icon: <Trash2 size={14} />,
      btnClass: "btn-outline-danger",
      onClick: (row) => {
        setSelectedRowToDelete(row);
        setPendingAction({ actionName: "isDeleted", actionValue: true });
        setShowDeleteModal(true);
      },
    },
  ];

  const topButtons = [
    {
      label: "Add Provider",
      onClick: () => navigate("/providers/add-provider"),
      className: "btn-success",
    },
  ];

  // API call
  const ListingData = async () => {
    try {
      const reqData = {
        limit,
        page,
        searchText,
        isActive: statusFilter !== "" ? statusFilter : undefined,
        role: "Provider",
      };

      const response = await Service.getListProviders(reqData);
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
          searchPlaceholder="Search by provider..."
          onSearch={handleSearch}
          showTopButtons={true}
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
          showStatusFilter={true}
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
              : "inactivate"
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

      <Outlet />
    </>
  );
}
