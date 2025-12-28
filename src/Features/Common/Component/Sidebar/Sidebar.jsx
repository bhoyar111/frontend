import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  FaTachometerAlt,
  FaUsers,
  FaUserMd,
} from "react-icons/fa";
import "./Sidebar.css";
import { toggleSidebar } from "../../Shared/Slice/SidebarSlice";
import logo from "../../Assests/logo.png";

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const isOpen = useSelector((state) => state.sidebar.isOpen);
  const role = useSelector((state) => state?.auth?.user?.userData?.role);

  const [expandedMenus, setExpandedMenus] = useState([]);
  const [activeItem, setActiveItem] = useState("");

  const routeMap = {
    dashboard: "/admin-dashboard",
    patients: "/patients",
    providers: "/providers",
    availability: "/availability",
  };

  const adminMenu = [
    { id: "dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    {
      id: "users",
      label: "User Directory",
      icon: <FaUsers />,
      subItems: [
        { id: "providers", label: "Providers", icon: <FaUserMd /> },
        { id: "patients", label: "Patients", icon: <FaUsers /> },
      ],
    },
  ];

  const providerMenu = [
    { id: "provider-dashboard", label: "Dashboard", icon: <FaTachometerAlt /> },
    { id: "my-patient", label: "Patients", icon: <FaUsers /> },
  ];

  const menuItems = role === "Admin" ? adminMenu : providerMenu;

  useEffect(() => {
    const path = location.pathname;
    const matchedKey = Object.keys(routeMap).find(
      (key) => routeMap[key] === path
    );
    if (matchedKey) {
      setActiveItem(matchedKey);
      const parent = adminMenu.find((item) =>
        item.subItems?.some((sub) => sub.id === matchedKey)
      );
      if (parent) {
        setExpandedMenus((prev) =>
          prev.includes(parent.id) ? prev : [...prev, parent.id]
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const handleMenuClick = (id, hasSubItems) => {
    if (hasSubItems) {
      setExpandedMenus((prev) =>
        prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      );
    } else {
      setActiveItem(id);
      if (routeMap[id]) navigate(routeMap[id]);
    }
  };

  const renderSubMenu = (subItems, parentId) => {
    if (!isOpen || !expandedMenus.includes(parentId)) return null;
    return (
      <ul className="submenu">
        {subItems.map(({ id, label, icon }) => (
          <li
            key={id}
            className={`submenu-item ${activeItem === id ? "active" : ""}`}
            onClick={() => {
              setActiveItem(id);
              if (routeMap[id]) navigate(routeMap[id]);
            }}
          >
            {icon && <span className="icon">{icon}</span>}
            <span className="label">{label}</span>
          </li>
        ))}
      </ul>
    );
  };

  const renderMenu = () =>
    menuItems.map(({ id, label, icon, subItems }) => {
      const isActive = activeItem === id;
      const hasSubItems = !!subItems;

      return (
        <React.Fragment key={id}>
          <li
            className={`sidebar-item ${isActive ? "active" : ""}`}
            onClick={() => handleMenuClick(id, hasSubItems)}
          >
            <span className="icon">{icon}</span>
            {isOpen && (
              <>
                <span className="label">{label}</span>
                {hasSubItems && (
                  <span className="arrow">
                    {expandedMenus.includes(id) ? "▼" : "▶"}
                  </span>
                )}
              </>
            )}
          </li>
          {hasSubItems && renderSubMenu(subItems, id)}
        </React.Fragment>
      );
    });

  return (
    <div className={`sidebar-container ${isOpen ? "open" : "closed"}`}>
      <div className="sidebar-header" onClick={() => dispatch(toggleSidebar())}>
        <img
          src={logo}
          alt="Logo"
          className={isOpen ? "logo-icon" : "logo-icon-collapsed"}
        />
        {isOpen && <span className="admin-text">{role} Panel</span>}
      </div>
      <ul className="sidebar-links">{renderMenu()}</ul>
    </div>
  );
};

export default Sidebar;
