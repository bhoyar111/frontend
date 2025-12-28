import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import "./StaticPage.css";

import Service from "../Services";
import { Edit, Trash2 } from "react-feather";
import showToast from "../../../Common/Shared/Utils/ToastNotification";
import ReuseableTable from "../../../Common/Shared/Components/Table/ReuseableTable";
import ConfirmModal from "../../../Common/Shared/Components/CustomePopup/ConfirmModal";

export default function StaticPageList() {
  const navigate = useNavigate();
  const location = useLocation();
  const isChildRoute = location.pathname !== "/static-pages";

  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [pendingAction, setPendingAction] = useState({ actionName: "", actionValue: null });

  // Table columns for Static Pages
  const columns = [
    { key: "title", label: "Title" },
    { key: "heading", label: "Topic" },
    // {
    //   key: "isActive",
    //   label: "Status",
    //   render: (row) => (
    //     <span className={`badge ${row.isActive ? "bg-success" : "bg-danger"}`}>
    //       {row.isActive ? "Active" : "Inactive"}
    //     </span>
    //   ),
    // },
    {
      key: "updatedAt",
      label: "Last Updated",
      render: (row) => new Date(row.updatedAt).toLocaleDateString(),
    },
  ];

  // Row actions: View / Edit / Delete
  const actions = [
    // {
    //   label: "View",
    //   icon: <Eye size={14} />,
    //   btnClass: "btn-outline-info",
    //   onClick: (row) => window.open(`/page/${row.slug}`, '_blank'),
    // },
    {
      label: "Edit",
      icon: <Edit size={14} />,
      onClick: (row) => navigate(`/static-pages/edit/${row._id}`),
    },
    {
      label: "Delete",
      icon: <Trash2 size={14} />,
      btnClass: "btn-outline-danger",
      onClick: (row) => {
        setSelectedRow(row);
        setPendingAction({ actionName: "isDeleted", actionValue: true });
        setShowConfirmModal(true);
      },
    },
  ];

  // Top button → Add Static Page
  const topButtons = [
    {
      label: "Add Static Page",
      className: "btn-primary",
      onClick: () => navigate("/static-pages/add"),
    },
  ];

  // Fetch Static Pages
  const fetchStaticPages = async () => {
    setLoading(true);
    try {
      const reqData = { limit, page, searchText };
      const response = await Service.getStaticPages(reqData);
      if (response?.status === 200) {
        // Fixed: Correctly access the data array from the API response
        setData(response?.data?.data || []);
        // Fixed: Use the correct field for total count
        setTotalCount(response?.data?.count || 0);
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to fetch static pages");
    } finally {
      setLoading(false);
    }
  };

  // Confirm action: delete / toggle status
  const handleConfirmAction = async (actionName, actionValue) => {
    if (!selectedRow) return;

    try {
      let response;
      if (actionName === "isDeleted") {
        response = await Service.deleteStaticPage(selectedRow._id);
      } else {
        // For status toggle
        response = await Service.updateStaticPage(selectedRow._id, { [actionName]: actionValue });
      }
      
      if (response?.status === 200) {
        showToast("success", response?.message || "Action successful");
        await fetchStaticPages();
      } else {
        showToast("error", response?.message || "Action failed");
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Something went wrong");
    } finally {
      setShowConfirmModal(false);
      setSelectedRow(null);
      setPendingAction({ actionName: "", actionValue: null });
    }
  };

  // Handle search
  const handleSearch = (value) => {
    setSearchText(value);
    setPage(1);
  };

  useEffect(() => {
    fetchStaticPages();
    if (location.state?.refresh) {
      navigate(location.pathname, { replace: true, state: {} });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, searchText, location.state?.refresh]);

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
          loading={loading}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newLimit) => setLimit(newLimit)}
          showSearch={false}
          searchPlaceholder="Search static pages..."
          onSearch={handleSearch}
          showTopButtons={true}
          topButtons={topButtons}
          showDropdownFilter={false}
          enableToggleStatus={true}
          onToggleStatus={(row, field, newValue) => {
            setSelectedRow(row);
            setPendingAction({ actionName: field, actionValue: newValue });
            setShowConfirmModal(true);
          }}
        />
      )}

      <ConfirmModal
        show={showConfirmModal}
        message={`Are you sure you want to ${
          pendingAction.actionName === "isDeleted"
            ? "delete"
            : pendingAction.actionValue
            ? "activate"
            : "deactivate"
        } this Static Page?`}
        onClose={() => {
          setShowConfirmModal(false);
          setSelectedRow(null);
          setPendingAction({ actionName: "", actionValue: null });
        }}
        onConfirm={() =>
          handleConfirmAction(pendingAction.actionName, pendingAction.actionValue)
        }
      />
      <Outlet />
    </>
  );
}