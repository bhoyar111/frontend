import React from "react";
import Login from "../../../Authentication/Login/Login";
import ForgotPassword from "../../../Authentication/ForgotPassword/ForgotPassword";
import ResetPassword from "../../../Authentication/ResetPassword/ResetPassword";
import OtpVerification from "../../../Authentication/OTPVerification/OtpVerification";


const PublicRoute = [
  {
    path: "/",
    element: <Login />
  },
  {
    path: "/otp-verification",
    element: <OtpVerification />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    path: "/admin-login",
    element: <Login />
  }
];

export default PublicRoute;
