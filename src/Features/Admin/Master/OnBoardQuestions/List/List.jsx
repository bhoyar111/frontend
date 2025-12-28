import React, { useEffect, useState } from "react";
import { Edit, Trash2 } from "react-feather";
import Service from "../Services";
import showToast from "../../../../Common/Shared/Utils/ToastNotification";
import ReuseableTable from "../../../../Common/Shared/Components/Table/ReuseableTable";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import ConfirmModal from "../../../../Common/Shared/Components/CustomePopup/ConfirmModal";

const List = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isChildRoute = location.pathname !== "/on-board-question";

  const [data, setData] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");
  const [questionFor, setQuestionFor] = useState("");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedRowToDelete, setSelectedRowToDelete] = useState(null);
  const [pendingAction, setPendingAction] = useState({
    actionName: "",
    actionValue: null,
  });

  const columns = [
    { key: "question", label: "Questions" }
  ];

  const actions = [
    {
      label: "Edit",
      icon: <Edit size={14} />,
      onClick: (row) => navigate(`/on-board-question/edit-on-board-question/${row._id}`),
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
      label: "Add On Board Question",
      onClick: () => navigate("/on-board-question/add-on-board-question"),
      className: "btn-success",
    },
  ];

  // API call
  const questionList = async () => {
    try {
      const reqData = { limit, page, questionFor, searchText };
      const response = await Service.getListQuestions(reqData);
      if (response?.status === 200) {
        setData(response?.data?.result || []);
        setTotalCount(response?.data?.totalRecords || 0);
      }
    } catch (err) {
      showToast("error", err?.response?.message || "Failed to fetch questions");
    }
  };

  useEffect(() => {
    questionList();
    if (location.state?.refresh) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, questionFor, searchText, location.state?.refresh]);

  const handleSearch = (value) => {
    setSearchText(value);
    setPage(1);
  };

  const handleDropdownChange = (value) => {
    setQuestionFor(value);
    setPage(1);
  };

  const handleConfirmAction = async (actionName, actionValue) => {
    if (!selectedRowToDelete) return;

    const reqData = {
      questionId: selectedRowToDelete._id,
      action_name: actionName,
      action_value: actionValue,
    };

    try {
      const response = await Service.deleteUpdateQuestions(reqData);

      if (response?.status === 200) {
        showToast("success", response?.message);

        if (actionName === "isDeleted") {
          setData((prev) =>
            prev.filter((item) => item._id !== selectedRowToDelete._id)
          );
          setTotalCount((prev) => prev - 1);
        } else if (actionName === "isActivated") {
          setData((prev) =>
            prev.map((item) =>
              item._id === selectedRowToDelete._id
                ? { ...item, isActivated: actionValue }
                : item
            )
          );
        }
      } else {
        showToast("error", response?.message);
      }
    } catch (err) {
      showToast("error", err?.response?.message || "Action failed");
    }

    setShowDeleteModal(false);
    setSelectedRowToDelete(null);
    setPendingAction({ actionName: "", actionValue: null });
  };

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
          searchPlaceholder="Search by questions..."
          onSearch={handleSearch}
          showTopButtons={true}
          topButtons={topButtons}
          onToggleStatus={(row, field, newValue) => {
            setSelectedRowToDelete(row);
            setPendingAction({
              actionName: field,
              actionValue: newValue,
            });
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
        } this question?`}
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
};

export default List;
