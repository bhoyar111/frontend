import React, { useEffect, useState } from "react";
import { Eye, Trash2 } from "react-feather";
import { useLocation, useNavigate, Outlet } from "react-router-dom";
import ConfirmModal from "../../Common/Shared/Components/CustomePopup/ConfirmModal";
import Service from "./Services";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import ReuseableTable from "../../Common/Shared/Components/Table/ReuseableTable";
import PlanFormModal from "./PlanFormModal";

const SubscriptionList = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const isChildRoute = location.pathname !== "/subscription";
    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedRowToDelete, setSelectedRowToDelete] = useState(null);
    const [pendingAction, setPendingAction] = useState({ actionName: "", actionValue: null });
    const [isPlanModalOpen, setIsPlanModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const columns = [
      { key: "planName", label: "Plan Name" },
      { key: "planPrice", label: "Plan Price($)" },
      { key: "planDuration", label: "Time Interval" },
      { key: "discountPercentage", label: "Discount(%)" },
      {
        key: "isActivated",
        label: "Status",
        render: (row) => (
          <button
            className={`btn btn-sm ${row.isActivated ? "btn-success" : "btn-secondary"}`}
            onClick={() => {
              setSelectedRowToDelete(row);
              setPendingAction({
                actionName: "isActivated",
                actionValue: !row.isActivated
              });
              setShowDeleteModal(true);
            }}
          >
            {row.isActivated ? "Active" : "Inactive"}
          </button>
        )
      }
    ];
    const actions = [
      {
        label: "View",
        icon: <Eye size={14} />,
        onClick: (row) => {
          setSelectedPlan(row);         // set selected plan for editing
          setIsPlanModalOpen(true);
        }
      },
      {
        label: "Delete",
        icon: <Trash2 size={14} />,
        btnClass: "btn-outline-danger",
        onClick: (row) => {
          setSelectedRowToDelete(row);
          setPendingAction({ actionName: "isDeleted", actionValue: true });
          setShowDeleteModal(true);
        }
      }
    ];
    const topButtons = [
      {
        label: "Add Plan",
        onClick: () =>  {
            setSelectedPlan(null); // create mode
            setIsPlanModalOpen(true);
          },
        className: "btn-success"
      }
    ];
    const servicesList = [
      { value: "Analytic Report", label: "Analytic Report" },
      { value: "Audio Library", label: "Audio Library" },
      { value: "Sleep Articles", label: "Sleep Articles" },
      { value: "Talk to Expert", label: "Talk to Expert" }
    ];
    // API call
    const subscriptionPlanList = async () => {
      try {
        const reqData = { limit, page, searchText };
        const response = await Service.getAllPlanList(reqData);
        if (response?.status === 200) {
          setData(response?.data?.result || []);
          setTotalCount(response?.data?.totalRecords || 0);
        }
      } catch (err) {
        showToast("error", err?.response?.message || "Failed to fetch list");
      }
    };
    useEffect(() => {
      subscriptionPlanList();
      if (location.state?.refresh) {
        navigate(location.pathname, { replace: true, state: {} });
      }
    }, [limit, page, searchText, location.state?.refresh]);
    const handleSearch = (value) => {
      setSearchText(value);
      setPage(1);
    };
    const handleConfirmAction = async (actionName, actionValue) => {
      if (!selectedRowToDelete) return;
      const reqData = {
        planId: selectedRowToDelete._id,
        action_name: actionName,
        action_value: actionValue
      };
      try {
        const response = await Service.managePlan(reqData);
        if (response?.status === 200) {
          showToast("success", response?.message);
          if (actionName === "isDeleted") {
            setData(prev => prev.filter(item => item._id !== selectedRowToDelete._id));
            setTotalCount(prev => prev - 1);
          } else if (actionName === "isActivated") {
            setData(prev =>
              prev.map(item =>
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
            searchPlaceholder="Search by plan name..."
            onSearch={handleSearch}
            showTopButtons={true}
            topButtons={topButtons}
            enableToggleStatus={true}
            onToggleStatus={(row, field, newValue) => {
              setSelectedRowToDelete(row);
              setPendingAction({
                actionName: field,
                actionValue: newValue
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
          } this plan?`}
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
        <PlanFormModal
          isOpen={isPlanModalOpen}
          onClose={() => setIsPlanModalOpen(false)}
          onSubmit={() => {
            setIsPlanModalOpen(false); // close after submit
            subscriptionPlanList();
          }}
          servicesList={servicesList} // replace with actual list
          durations={["Month", "Week","Day","Year"]}
          defaultData={selectedPlan}
        />
        <Outlet />
      </>
    );
};

export default SubscriptionList;
