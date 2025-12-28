// routes/adminRoutes.js
import React from "react";
import { withRole } from "../Utils/WithRole";
import AdminDashboard from "../../../Dashboard/AdminDashboard/AdminDashboard";
import AdminProvider from "../../../Admin/UserManagement/Provider/List";
import AdminPatient from "../../../Admin/UserManagement/Patient/List";
import AddUpdateProvider from "../../../Admin/UserManagement/Provider/AddEdit";
import AddUpdatePatient from "../../../Admin/UserManagement/Patient/AddEdit";
import ViewDetailsProvider from "../../../Admin/UserManagement/Provider/ViewDetails";
import ViewDetailsPatient from "../../../Admin/UserManagement/Patient/ViewDetails";

const rawAdminRoutes = [
  // Dashboard 
  { path: "/admin-dashboard", element: <AdminDashboard /> },

  // User Management
  {
    path: "/providers",
    element: <AdminProvider />,
    children: [
      { path: "add-provider", element: <AddUpdateProvider /> },
      { path: "edit-provider/:userId", element: <AddUpdateProvider /> },
      { path: "view-provider/:userId", element: <ViewDetailsProvider /> },
    ],
  },
  {
    path: "/patients",
    element: <AdminPatient />,
    children: [
      { path: "add-patient", element: <AddUpdatePatient /> },
      { path: "edit-patient/:userId", element: <AddUpdatePatient /> },
      { path: "view-patient/:userId", element: <ViewDetailsPatient /> },
    ],
  }
];

const AdminRoute = withRole("Admin", rawAdminRoutes);
export default AdminRoute;
