// routes/commonRoutes.js
import React from "react";
import ChangePassword from "../../../Authentication/ChangePassword/ChangePassword";
import ErrorComponent from "../Components/ErrorPage/ErrorComponent";
import Notification from "../../../Notification/Notification";

const CommonRoute = [
  { path: "/change-password", element: <ChangePassword /> },
  { path: "/notification", element: <Notification />},
  { path: "/unauthorized", element: <ErrorComponent /> }
];

export default CommonRoute;
