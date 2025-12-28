import React from "react";
import { withRole } from "../Utils/WithRole";
import ProviderDashboard from "../../../Dashboard/ProviderDashboard/ProviderDashboard";
import Profile from "../../../Provider/Profile/Profile";
import ProviderEdit from "../../../Provider/Profile/ProviderEdit";
import PatientList from "../../../Provider/Patient/PatientList";

const rawProviderRoutes = [
  { path: "/provider-dashboard", element: <ProviderDashboard /> },
  { path: "/provider-profile", element: <Profile /> },
  { path: "/provider-Edit/:userId", element: <ProviderEdit /> },
  { path: "/my-patient", element: <PatientList /> },
];

const ProviderRoute = withRole("Provider", rawProviderRoutes);
export default ProviderRoute;
