import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, Outlet } from "react-router-dom";

import Service from "./Services";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import ReuseableTable from "../../Common/Shared/Components/Table/ReuseableTable";

export default function ContactUsList() {
  const TIMEZONE = process.env.REACT_APP_TIMEZONE || "America/New_York";
  const navigate = useNavigate();
  const location = useLocation();
  const isChildRoute = location.pathname !== "/contactus";

  const [data, setData] = useState([]);

  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [searchText, setSearchText] = useState("");

  // ========================= TABLE CONFIG =========================
  const columns = [
    {
      key: "createdAt",
      label: "Timestamp",
      render: (row) =>
        new Date(row.createdAt).toLocaleDateString("en-US", {
          timeZone: TIMEZONE,
          year: "numeric",
          month: "short",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
        }),
    },
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "message", label: "Message" },
  ];

  // const actions = [
  //   {
  //     label: "View",
  //     icon: <Eye size={14} />,
  //     onClick: (row) => navigate(`/contact-us/view/${row._id}`),
  //   },
  // ];

  // ========================= API CALL =========================
  const fetchContacts = async () => {
    try {
      const reqData = { limit, page, searchText };
      const response = await Service.getUserContactUs(reqData);
      if (response?.status === 200) {
        setData(response?.data?.result || []);
        setTotalCount(response?.data?.totalRecords || 0);
      } else {
        showToast(
          "error",
          response?.message || "Failed to fetch contact inquiries"
        );
      }
    } catch (err) {
      showToast(
        "error",
        err?.response?.data?.message ||
          "Something went wrong fetching contact inquiries"
      );
    }
  };

  // ========================= SEARCH & PAGINATION =========================
  const handleSearch = (value) => {
    setSearchText(value);
    setPage(1);
  };

  useEffect(() => {
    fetchContacts();
    if (location.state?.refresh) {
      navigate(location.pathname, { replace: true, state: {} });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit, page, searchText, location.state?.refresh]);

  // ========================= RENDER =========================
  return (
    <>
      {!isChildRoute && (
        <ReuseableTable
          columns={columns}
          data={data}
          // actions={actions}
          pageSize={limit}
          currentPage={page}
          totalCount={totalCount}
          onPageChange={(newPage) => setPage(newPage)}
          onPageSizeChange={(newLimit) => setLimit(newLimit)}
          showSearch={true}
          searchPlaceholder="Search by name or email..."
          onSearch={handleSearch}
          showTopButtons={false}
          showDropdownFilter={false}
        />
      )}
      <Outlet />
    </>
  );
}
