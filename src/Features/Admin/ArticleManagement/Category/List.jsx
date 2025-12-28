import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import "./Category.css";

import Service from "../Services";
import { Edit, Trash2 } from "react-feather";
import showToast from "../../../Common/Shared/Utils/ToastNotification";
import ReuseableTable from "../../../Common/Shared/Components/Table/ReuseableTable";
import ConfirmModal from "../../../Common/Shared/Components/CustomePopup/ConfirmModal";

export default function CategoryList() {
  const navigate = useNavigate();
  const location = useLocation();
  const isChildRoute = location.pathname !== "/categories";

  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [pendingAction, setPendingAction] = useState({
    actionName: "",
    actionValue: null,
  });

  const columns = [
    { key: "name", label: "Category Name" },
    { key: "description", label: "Description" },
    // {
    //   key: "isActive",
    //   label: "Status",
    //   render: (row) => (
    //     <button
    //       className={`btn btn-sm ${
    //         row.isActive ? "btn-success" : "btn-secondary"
    //       }`}
    //       onClick={() => {
    //         setSelectedRow(row);
    //         setPendingAction({
    //           actionName: "isActive",
    //           actionValue: !row.isActive,
    //         });
    //         setShowDeleteModal(true);
    //       }}
    //     >
    //       {row.isActive ? "Active" : "Inactive"}
    //     </button>
    //   ),
    // },
  ];

  const actions = [
    {
      label: "Edit",
      icon: <Edit size={14} />,
      onClick: (row) => navigate(`/categories/edit/${row._id}`),
    },
    {
      label: "Delete",
      icon: <Trash2 size={14} />,
      btnClass: "btn-outline-danger",
      onClick: (row) => {
        setSelectedRow(row);
        setPendingAction({ actionName: "isDeleted", actionValue: true });
        setShowDeleteModal(true);
      },
    },
  ];

  // Top button → Add category
  const topButtons = [
    {
      label: "Add Category",
      className: "btn-primary",
      onClick: () => navigate("/categories/add"),
    },
  ];

  // API call
  const fetchCategories = async () => {
    try {
      const reqData = { limit, page, searchText };
      const response = await Service.getListCategories(reqData);
      if (response?.status === 200) {
        setData(response?.data?.result || []);
        setTotalCount(response?.data?.totalRecords || 0);
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Failed to fetch categories");
    }
  };

  // Confirm action (delete/toggle status)
  const handleConfirmAction = async (actionName, actionValue) => {
    if (!selectedRow) return;
    const reqData = {
      categoryId: selectedRow._id,
      action_name: actionName,
      action_value: actionValue,
    };

    try {
      const response = await Service.deleteCategory(reqData.categoryId);
      if (response?.status === 200) {
        showToast("success", response?.message || "Action successful");
        await fetchCategories();
      } else {
        showToast("error", response?.message || "Action failed");
      }
    } catch (err) {
      showToast("error", err?.response?.data?.message || "Something went wrong");
    } finally {
      setShowDeleteModal(false);
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
    fetchCategories();
    if (location.state?.refresh) {
      navigate(location.pathname, { replace: true, state: {} });
    }
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
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newLimit) => setLimit(newLimit)}
          showSearch={true}
          searchPlaceholder="Search categories..."
          onSearch={handleSearch}
          showTopButtons={true}
          topButtons={topButtons}
          showDropdownFilter={false}
          enableToggleStatus={true}
          onToggleStatus={(row, field, newValue) => {
            setSelectedRow(row);
            setPendingAction({ actionName: field, actionValue: newValue });
            setShowDeleteModal(true);
          }}
        />
      )}

      <ConfirmModal
        show={showDeleteModal}
        message={`Are you sure you want to ${
          pendingAction.actionName === "isDeleted"
            ? "delete"
            : pendingAction.actionValue
            ? "activate"
            : "deactivate"
        } this Category?`}
        onClose={() => {
          setShowDeleteModal(false);
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
