import React, { useEffect, useState } from "react";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import ReuseableTable from "../../Common/Shared/Components/Table/ReuseableTable";
import Service from "./Services";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import { Eye } from "react-feather";
import {  Outlet, useNavigate } from "react-router-dom";
const PaymentHistory = () => {
    const navigate = useNavigate();
    // eslint-disable-next-line no-restricted-globals
    const isChildRoute = location.pathname !== "/payment-history";
    const [data, setData] = useState([]);
    const [limit, setLimit] = useState(10);
    const [page, setPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const [searchText, setSearchText] = useState("");
    const [fromDate, setFromDate] = useState(dayjs().startOf("month").format("YYYY-MM-DD"));
    const [toDate, setToDate] = useState(dayjs().endOf("month").format("YYYY-MM-DD"));
    const [patientId, setPatientId] = useState("");
    const [allPatientOptions, setAllPatientOptions] = useState([]);

    const handleDateChange = ({ from, to }) => {
        setFromDate(from);
        setToDate(to);
        allUserPaymentList({ from, to, page, limit, searchText, userId: patientId });
    };

    const handlePatientChange = (selectedOption) => {
        const selectedPatientId = selectedOption;
        setPatientId(selectedPatientId);
        setPage(1);
        allUserPaymentList({ fromDate, toDate, page: 1, limit, searchText, userId: selectedPatientId });
    };

    const columns = [
        {
          key: "createdAt",
          label: "Transaction Date & Time",
          render: (row) => {
            const date = new Date(row.createdAt);
            const formattedDate = date.toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric"
            });
            const formattedTime = date.toLocaleTimeString("en-GB", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: false
            });
            return `${formattedDate} | ${formattedTime}`;
          }
        },
        {
          key: "plan_name",
          label: "Plan Name",
          render: (row) => row?.subscription?.planDetails?.planName || "-"
        },
        {
          key: "user.fullName",
          label: "Patient Name",
          render: (row) => row?.user?.fullName || "-"
        },
        {
          key: "paidAmount",
          label: "Amount Paid($)",
          render: (row) => row?.subscription?.planDetails?.amountPaid || "-"
        },
        {
          key: "discountPercentage",
          label: "Discount (%)",
          render: (row) => row?.subscription?.planDetails?.discountPercentage || "-"
        },
        { key: "transactionId", label: "Transaction Id" },
        { key: "status", label: "Payment Status" }
      ];
      const actions = [
        {
          label: "View",
          icon: <Eye size={14} />,
          onClick: (row) =>
            navigate(`/payment-history/details`, {
              state: { transaction: row }   // 👈 send full row as state
            })
        }
      ];
    // API call
    const allUserPaymentList = async ({ from, to, page, limit, searchText, userId }) => {
        try {
            const reqData = {
                limit,
                page,
                searchText,
                userId,
                fromDate: from,
                toDate: to
            };
            const response = await Service.allTransactionsList(reqData);
            if (response?.status === 200) {
                const paymentData = response?.data?.result || [];
                setData(paymentData);
                setTotalCount(response?.data?.totalRecords || 0);
                // Extract unique patients from payment data
                const newPatients = [
                    ...new Map(
                        paymentData
                            .filter((item) => item?.user?._id && item?.user?.fullName) // Ensure userId and userName exist
                            .map((item) => [
                               item?.user?._id,
                                {
                                    value:item?.user?._id,
                                    label: item?.user?.fullName || "Unknown Patient"
                                }
                            ])
                    ).values()
                ];
                // Merge new patients with existing allPatientOptions
                setAllPatientOptions((prev) => {
                    const merged = [
                        ...new Map(
                            [...prev, ...newPatients].map((item) => [item.value, item])
                        ).values()
                    ];
                    return merged;
                });
            }
        } catch (err) {
            showToast("error", err?.response?.message || "Failed to fetch payment history");
        }
    };

    useEffect(() => {
        allUserPaymentList({ fromDate, toDate, page, limit, searchText, userId: patientId });
    }, [limit, page, searchText, fromDate, toDate, patientId]);

    const handleSearch = (value) => {
        setSearchText(value);
        setPage(1);
    };

    return (
      <>
        {!isChildRoute && (
          <div>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <ReuseableTable
                actions={actions}
                columns={columns}
                data={data}
                pageSize={limit}
                currentPage={page}
                totalCount={totalCount}
                onPageChange={(newPage) => setPage(newPage)}
                onPageSizeChange={(newLimit) => setLimit(newLimit)}
                showSearch={true}
                searchPlaceholder="Search..."
                onSearch={handleSearch}
                showDateFilters={true}
                onDateChange={handleDateChange}
                fromDate={fromDate}
                toDate={toDate}
                showDropdownFilter={true}
                dropdownOptions={allPatientOptions}
                dropdownPlaceholder="All Patient"
                onDropdownChange={handlePatientChange}
              />
            </LocalizationProvider>
          </div>
        )}
        <Outlet />
      </>
    );
};

export default PaymentHistory;
