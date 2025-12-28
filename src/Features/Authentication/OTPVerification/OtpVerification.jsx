import React, { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Service from "./Service";
import { userlogin } from "../../Common/Shared/Slice/AuthSlice";
import showToast from "../../Common/Shared/Utils/ToastNotification";
import { loginLogs } from "../../Common/Shared/Slice/LogsSlice";
import DynamicForm from "../../Common/Shared/Components/Form/DynamicForm";


const OtpVerification = () => {
  const formRef = useRef();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const heading = useSelector((state) => state.page.heading);
  const fields = [
    {
      type: "otp",
      name: "otp",
      label: "",
      length: 4,
      required: true
    }
  ];
  const handleSubmit = async (data) => {
    let userRole;
    if (heading !== "Admin Login Form") {
      userRole = "Provider";
    } else {
      userRole = "Admin";
    }
    try {
      let getUserData = JSON.parse(
        sessionStorage.getItem("verification_details")
      );
      let reqData = {
        email: getUserData?.email,
        otp: data?.otp,
        userId: getUserData?.userId
      };
      const response = await Service.verifyOtp(reqData);
      if (response?.status === 200) {
        if (userRole === "Provider") {
          navigate("/provider-dashboard");
        } else {
          navigate("/admin-dashboard");
        }
        dispatch(userlogin(response?.data));
        saveLoginLogs(response?.data?.userData);
        showToast("success", response?.message);
      } else {
        showToast("error", response?.message);
      }
    } catch (err) {
      showToast("error", err?.response?.message);
    }
  };

  const saveLoginLogs = async (data) => {
    try {
      let reqData = {
        user: {
          userId: data._id,
          fullName: data.fullName,
          role: data.role,
          email: data.email
        },
        action: "Login"
      };
      const response = await Service.logInLogs(reqData);
      if (response?.status === 200) {
        dispatch(loginLogs(response?.data));
      }
    } catch (err) {
      showToast("error", err?.response?.message);
    }
  };

  const handleResendOtp = async () => {
    try {
      let getUserData = JSON.parse(
        sessionStorage.getItem("verification_details")
      );
      const response = await Service.otpSendonMail({
        email: getUserData?.email
      });
      if (response?.status === 200) {
        formRef.current?.resetForm();
        showToast("success", "OTP resent successfully");
      } else {
        showToast("error", response?.message);
      }
    } catch (err) {
      showToast("error", err?.response?.message || "Failed to resend OTP");
    }
  };

  const buttons = [
    { label: "Submit", type: "submit" },
    { label: "Resend OTP", type: "button", onClick: handleResendOtp }
  ];

  return (
    <div className="form-wrapper">
      <div className="form-container">
        <h2 className="form-title">Enter OTP code</h2>
        <p> Verification Code Set on your email address.</p>
        <DynamicForm
          ref={formRef}
          fields={fields}
          onSubmit={handleSubmit}
          buttons={buttons}
        />
        <div className="form-footer">
          <Link to="/">
            <i className="bi bi-arrow-left"></i> Back to Login{" "}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
