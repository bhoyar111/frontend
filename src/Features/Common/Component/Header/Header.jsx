import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { setHeading } from "../../Shared/Slice/PageSlice";

const Header = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  const headingMap = {
    "/": "Physician Login Form",
    "/admin-login": "Admin Login Form"
  };
  useEffect(() => {
    const path = location.pathname;
    const heading = headingMap[path] || "Page";
    dispatch(setHeading(heading));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname, dispatch]);

  return <div></div>;
};

export default Header;
