import React from "react";
import { createBrowserRouter } from "react-router-dom";
import { ProtectedOutlet, PublicOutlet } from "./ProtectedRoutes";
import PublicRoute from "../Routes/PublicRoutes";
import PublicLayout from "../Components/Layouts/Public/PublicLayout";
import PrivateRoute from "../Routes/PrivateRoutes";
import PrivateLayout from "../Components/Layouts/Private/PrivateLayout";
import ErrorComponent from "../Components/ErrorPage/ErrorComponent";

const getRoutesConfig = () => {
  return createBrowserRouter([
    {
      path: "/",
      element: <PublicOutlet />,
      errorElement: <ErrorComponent />,
      children: [
        {
          element: <PublicLayout />,
          children: PublicRoute
        }
      ]
    },
    {
      path: "/",
      element: <ProtectedOutlet />,
      errorElement: <ErrorComponent />,
      children: [
        {
          element: <PrivateLayout />,
          children: PrivateRoute
        }
      ]
    }
  ]);
};

export default getRoutesConfig;
