import React from "react";
import { Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "../../../../../Common/Component/Navbar/Nav";
import Sidebar from "../../../../../Common/Component/Sidebar/Sidebar";
import "./PrivateLayout.css";
import IdleSystem from "../../IdleSystem/IdleSystem";

const PrivateLayout = () => {
  const isSidebarOpen = useSelector((state) => state.sidebar.isOpen);

  return (
    <div
      className={`layout-container ${isSidebarOpen ? "sidebar-open" : "sidebar-closed"}`}
    >
      {/* Sidebar */}
      <aside className="layout-sidebar">
        <Sidebar />
      </aside>

      {/* Main Section */}
      <div className="layout-main-section">
        <header className="layout-header">
          <Navbar />
        </header>

        <main className="layout-content">
          <IdleSystem/>
            <Outlet />
        </main>

        {/* <footer className="layout-footer">
          <p>Footer</p>
        </footer> */}
      </div>
    </div>
  );
};

export default PrivateLayout;
