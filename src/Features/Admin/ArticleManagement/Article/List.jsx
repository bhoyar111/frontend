import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import "./Article.css";

import Service from "../Services";
import { Edit, Trash2 } from "react-feather";
import showToast from "../../../Common/Shared/Utils/ToastNotification";
import ReuseableTable from "../../../Common/Shared/Components/Table/ReuseableTable";
import ConfirmModal from "../../../Common/Shared/Components/CustomePopup/ConfirmModal";

export default function ArticleList() {
  const navigate = useNavigate();
  const location = useLocation();
  const isChildRoute = location.pathname !== "/articles";

  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMediaType, setSelectedMediaType] = useState("");
  const [loading, setLoading] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [pendingAction, setPendingAction] = useState({
    actionName: "",
    actionValue: null,
  });

  // Table columns for Articles
  const columns = [
    { key: "title", label: "Title" },
    // { key: "description", label: "Description" },
    {
      key: "category",
      label: "Category",
      render: (row) => row.category?.name || "-",
    },
    {
      key: "subCategory",
      label: "SubCategory",
      render: (row) => row.subCategory?.name || "-",
    },
    { key: "mediaType", label: "Media Type" },
  ];

  // Row actions: Edit / Delete
  const actions = [
    {
      label: "Edit",
      icon: <Edit size={14} />,
      onClick: (row) => navigate(`/articles/edit/${row._id}`),
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

  // Top button → Add Article
  const topButtons = [
    {
      label: "Add Content",
      className: "btn-primary",
      onClick: () => navigate("/articles/add"),
    },
  ];

  // Fetch Articles
  const fetchArticles = async () => {
    setLoading(true);
    try {
      const reqData = {
        limit,
        page,
        searchText,
        category: selectedCategory,
        mediaType: selectedMediaType,
      };
      const response = await Service.getListArticles(reqData);
      if (response?.status === 200) {
        setData(response?.data?.result || []);
        setTotalCount(response?.data?.totalRecords || 0);
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Failed to fetch articles"
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await Service.getListCategories();
      if (res?.status === 200) {
        setCategories(res.data.result || []);
      }
    } catch (err) {
      console.log(err);
      // showToast("error", "Failed to fetch categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Confirm action: delete / toggle status
  const handleConfirmAction = async (actionName, actionValue) => {
    if (!selectedRow) return;

    try {
      const response = await Service.deleteArticle(selectedRow._id);
      if (response?.status === 200) {
        showToast("success", response?.message || "Action successful");
        await fetchArticles();
      } else {
        showToast("error", response?.message || "Action failed");
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message || "Something went wrong"
      );
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

  const handleResetFilters = () => {
  setLimit(10);
  setPage(1);
  setSearchText("");
  setSelectedCategory("");
  setSelectedMediaType("");
};

  useEffect(() => {
    fetchArticles();
    if (location.state?.refresh) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    limit,
    page,
    searchText,
    selectedCategory,
    selectedMediaType,
    location.state?.refresh,
  ]);

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
          showSearch={true}
          searchPlaceholder="Search articles..."
          onSearch={handleSearch}
          showTopButtons={true}
          topButtons={topButtons}
          showDropdownFilter={true}
          dropdownOptions={categories.map((cat) => ({
            label: cat.name,
            value: cat._id,
          }))}
          dropdownPlaceholder="Search Category"
          selectedCategory={selectedCategory} 
          onDropdownChange={(value) => {
            setSelectedCategory(value);
            setPage(1);
          }}
          showStatusFilter={false}
          enableToggleStatus={true}
          onToggleStatus={(row, field, newValue) => {
            setSelectedRow(row);
            setPendingAction({ actionName: field, actionValue: newValue });
            setShowConfirmModal(true);
          }}
          showMediaTypeFilter={true}
          mediaTypeValue={selectedMediaType}
          onMediaTypeChange={(value) => {
            setSelectedMediaType(value);
            setPage(1);
          }}
          showResetButton={true}
          onResetFilters={handleResetFilters}
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
        } this Article?`}
        onClose={() => {
          setShowConfirmModal(false);
          setSelectedRow(null);
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
