import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useMatches, useNavigate } from "react-router-dom";

export function ProtectedOutlet() {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const userRole = useSelector((state) => state.auth.user?.userData?.role);
  const matches = useMatches(); // Get current route match
  const currentRoute = matches[matches.length - 1];

  const allowedRoles = currentRoute?.handle?.roles;

  if (!isLoggedIn) {
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Redirect unauthorized access to a fallback page
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet />;
}

export function PublicOutlet() {
  const navigate = useNavigate();
  const data = useSelector((state) => state.auth.user);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      if (data?.userData?.role === "Provider") {
        navigate("/provider-dashboard", { replace: true });
      } else {
        navigate("/admin-dashboard", { replace: true });
      }
    }
  }, [isLoggedIn, navigate]);
  return !isLoggedIn ? <Outlet /> : null;
}
