import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { useDispatch, useSelector } from 'react-redux';

import "./Notification.css";
import Service from "./Services";
import showToast from "../Common/Shared/Utils/ToastNotification";
import { decrementUnreadCount } from "../Common/Shared/Slice/NotificationSlice";

const Notification = () => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state?.auth?.user?.userData);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [notifications, setNotifications] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const loggedInUserRole = useSelector((state) => state?.auth?.user?.userData?.role);

  const navigate = useNavigate();

  //   Format date & time
  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString("en-GB");
  };

  const formatTime = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  //   Fetch notifications
  const allUserNotiList = async () => {
    try {
      const reqData = {
        limit: itemsPerPage,
        page: currentPage
      };
      const response = await Service.allUserNotiList(reqData);

      if (response?.status === 200 && response?.data?.result) {
        setNotifications(response.data.result);
        setTotalRecords(response.data.totalRecords || 0);
        setTotalPages(response.data.totalPages || 1);
      }
    } catch (err) {
      showToast("error", err?.response?.message || "Failed to fetch notifications");
    }
  };

  useEffect(() => {
    allUserNotiList();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, itemsPerPage]);

  //   Handle click: mark read + redirect
  const handleNotificationClick = async (noti) => {
    try {
      if (!noti.isRead) {
        await Service.markNotificationRead({ id: noti._id });
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === noti._id ? { ...n, isRead: true } : n
          )
        );
        dispatch(decrementUnreadCount());
      }

      // Redirect based on type
      switch (noti.type) {
        case "APPOINTMENT":
          navigate(`/appointment/details/${noti?.metaData?.appointmentId}`);
          break;
        case "ASSIGNMENT":
          if(userInfo?.role === 'Admin'){
            navigate(`/surveydetails/view-patient-survey/${noti?.metaData?.patientId}`);
          }
          break;
        case "CHAT":
          if(userInfo?.role === 'Provider'){
            navigate(`/communication`);
          }
          break;
        default:
          navigate("/notifications");
      }
    } catch (err) {
      showToast("error", "Failed to mark notification as read");
    }
  };

 //  Generate page numbers - show max 10 pages at once
  const getPageNumbers = () => {
    const maxPagesToShow = 10;
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = startPage + maxPagesToShow - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    let pages = [];
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    return pages;
  };

  const backBtnNotification = () => {
    if (loggedInUserRole === "Provider") {
      navigate("/provider-dashboard");
    } else {
      navigate("/admin-dashboard");
    }
  };


  return (
    <div className="notification-container">
      {/* Header */}
      <div className="notification-header">
        <div className="header-left">
          <h1 className="notification-title">All Notifications</h1>
          <h5 className="notification-subtitle">
            Stay updated with your latest notifications
          </h5>
        </div>
        <div className="header-right">
          <button className="back-button" onClick={backBtnNotification}>
            ⬅ Back
          </button>
        </div>
      </div>

      {/* Notifications List */}
      <div className="notifications-wrapper">
        {notifications.length > 0 ? (
          notifications.map((noti) => (
            <div
              key={noti._id}
              className={`notification-card ${!noti.isRead ? "unread" : ""}`}
              onClick={() => handleNotificationClick(noti)}
              style={{ cursor: "pointer" }}
            >
              <div className="notification-content">
                {/* Icon */}
                <div className="notification-icon-wrapper">
                  {!noti.isRead && <div className="notification-red-dot"></div>}
                  <div className="notification-icon">
                    <Bell size={20} />
                  </div>
                </div>

                {/* Text */}
                <div className="notification-message-wrapper">
                  <p className="notification-message">{noti.title}</p>
                  <p className="notification-subtext">{noti.message}</p>
                </div>

                {/* Date/Time */}
                <div className="notification-datetime">
                  <p className="notification-date">{formatDate(noti.createdAt)}</p>
                  <p className="notification-time">{formatTime(noti.createdAt)}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p>No notifications found.</p>
        )}

        {/* Pagination */}
        <div className="notification-pagination">
          <div className="items-per-page-wrapper">
            <label className="items-per-page-label">Items per page:</label>
            <select
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="items-per-page-select"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
          </div>

          <div className="pagination-info">
            {notifications.length > 0
              ? `${(currentPage - 1) * itemsPerPage + 1}–${Math.min(
                  currentPage * itemsPerPage,
                  totalRecords
                )} of ${totalRecords}`
              : "0 of 0"}
          </div>

          {totalPages > 1 && (
            <div className="pagination-controls">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                «
              </button>
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-button"
              >
                ‹
              </button>

              {getPageNumbers().map((num) => (
                <button
                  key={num}
                  onClick={() => setCurrentPage(num)}
                  className={`pagination-button ${
                    currentPage === num ? "active" : ""
                  }`}
                >
                  {num}
                </button>
              ))}

              <button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                ›
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="pagination-button"
              >
                »
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Notification;
